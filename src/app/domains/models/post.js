import uuidv4 from 'uuid/v4'
import { firebase, db, storage } from '../services/firebase'
import {
  createSlug,
  deleteSlug,
  validateSlugUniq
} from './slug'
import { createTag } from './tag'
import ValidationError from '../errors/validationError'
import dete from '../miscs/dateformat'

export const status = {
  0: 'private',
  1: 'public',
  2: 'draft',
}
export const STATUS_PRIVATE = 0
export const STATUS_PUBLIC = 1
export const STATUS_DRAFT = 2

const createPost = async ({
  status: inputStatus,
  title: inputTitle,
  slug: inputSlug,
  body,
  userId,
  image,
  tags,
}) => {
  const id = uuidv4()
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
  const title = inputTitle && inputTitle.trim()
  const slug = inputSlug && inputSlug.trim()
  const status = parseInt(inputStatus)
  const tabLabels = tags.map(tag => tag.label)

  slug && await validateSlugUniq(slug)

  await db.collection('posts')
    .doc(id)
    .set({
      id,
      status,
      title,
      slug,
      body,
      image,
      draft: { title, slug, body, image, tags: tabLabels },
      userId: [userId],
      tags: tabLabels,
      createdAt: serverTimestamp,
      updatedAt: serverTimestamp,
      publishedAt: status === STATUS_PUBLIC ? serverTimestamp : null,
    })

  const revisionId = new Date().getTime().toString()

  const revisionsRef = db.collection(`posts/${id}/revisions`)
  await revisionsRef.doc(revisionId).set({
    id: revisionId,
    status,
    body,
    createdAt: serverTimestamp,
  })

  slug && await createSlug(slug, id)

  tags && tags.length && await createTag(tags)

  return true
}

const updatePost = async ({
  id,
  status: inputStatus,
  title: inputTitle,
  slug: inputSlug,
  body,
  userId,
  image,
  tags,
}) => {
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
  const title = inputTitle && inputTitle.trim()
  const slug = inputSlug && inputSlug.trim()
  const status = parseInt(inputStatus)
  const tagLabels = tags.map(tag => tag.label)

  slug && await validateSlugUniq(slug, id)

  const prevPost = await getPost(id)
  !prevPost && (() => {throw new Exception('Could not find post')})()

  prevPost.slug && prevPost.slug != slug && await deleteSlug(prevPost.slug)

  const draft = { title, slug, body, image, tags: tagLabels }
  const data = {
    status,
    title,
    slug,
    image,
    body,
    draft,
    tags: tagLabels,
    updatedAt: serverTimestamp
  }

  if (!prevPost.publishedAt && status === STATUS_PUBLIC) {
    data.publishedAt = serverTimestamp
  }

  const saveData = status == STATUS_DRAFT ? { draft } : data

  // saveData.userId = [ ...(new Set([ ...prevPost.userId, userId ])) ]
  saveData.userId = firebase.firestore.FieldValue.arrayUnion(userId)

  await db.collection('posts').doc(id).set(saveData, { merge: true })

  const revisionId = new Date().getTime().toString()

  const revisionsRef = db.collection(`posts/${id}/revisions`)
  revisionsRef.doc(revisionId).set({
    id: revisionId,
    status,
    body,
    createdAt: serverTimestamp,
  })

  slug && await createSlug(slug, id)

  tags && tags.length && await createTag(tags)

  return true
}

const getPosts = async ({
  orderBy = 'publishedAt',
  createdAt,
  publishedAt,
  statusType,
  tag
} = {}) => {
  let query = db.collection('posts')
    .orderBy(orderBy, 'desc')
    .limit(20)

  if (publishedAt) {
    query = query.startAfter(
      publishedAt instanceof firebase.firestore.Timestamp
        ? publishedAt
        : new firebase.firestore.Timestamp(publishedAt.seconds, publishedAt.nanoseconds)
    )

  } else if (createdAt) {
    query = query.startAfter(
      createdAt instanceof firebase.firestore.Timestamp
        ? createdAt
        : new firebase.firestore.Timestamp(createdAt.seconds, createdAt.nanoseconds)
    )
  }

  if (statusType) {
    statusType == STATUS_PUBLIC && (query = query.where('status', '==', STATUS_PUBLIC))
    statusType == STATUS_PRIVATE && (query = query.where('status', '==', STATUS_PRIVATE))
  }

  if (tag && tag.trim()) {
    query = query.where('tags', 'array-contains', tag.trim())
  }

  const postsSnapshot = await query.get()

  const posts = []
  postsSnapshot.forEach((doc) => {
    posts.push(doc.data())
  })
  return posts
}

const getPost = async id => {
  const post = await getPostBySlug(id)
  if (post) {
    return post
  }

  const doc = await db.collection('posts').doc(id).get()
  return doc.exists ? doc.data() : null
}

const getPostBySlug = async (slug) => {
  const postsRef = db.collection('posts');
  const snapshot = await postsRef.where('slug', '==', slug).get()

  if (snapshot.empty) {
    return null
  }

  const posts = []
  snapshot.forEach(doc => {
    posts.push(doc.data())
  })
  return posts.shift()
}

const getPostUrl = post => {
  if (!post) {
    return ''
  }
  return post.slug
    ? encodeURIComponent(post.slug)
    : encodeURIComponent(post.id)
}

const deletePost = async id => {
  const post = await getPost(id)
  if (!post) {
    const message = 'Could not find post'
    throw new ValidationError( message, [{ key: 'id', message }])
  }
  await db.collection('posts').doc(id).delete()
  post.slug && deleteSlug(post.slug)
}

const uploadFeaturedImage = async ({ file, path: inputPath }) => {
  if (!file) {
    return
  }
  const fileName = uuidv4()
  const datePath = dete.format(new Date(), 'yyyyMM')
  const path = inputPath || `posts/${datePath}/${fileName}`
  const storageRef = storage.ref()
  const featuredPhotoRef = storageRef.child(path)
  const snapshot = await featuredPhotoRef.put(file)
  const url = await snapshot.ref.getDownloadURL()
  return { url, path }
}

const deleteFeaturedImage = async (path) => {
  const storageRef = storage.ref()
  const featuredPhotoRef = storageRef.child(path)
  return await featuredPhotoRef.delete()
}


export {
  createPost,
  updatePost,
  getPosts,
  getPost,
  getPostBySlug,
  getPostUrl,
  deletePost,
  uploadFeaturedImage,
  deleteFeaturedImage,
}