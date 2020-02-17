import uuidv4 from 'uuid/v4'
import { firebase, db } from '../services/firebase'

export const status = {
  0: 'private',
  1: 'public',
  2: 'draft',
}
export const STATUS_PRIVATE = 0
export const STATUS_PUBLIC = 1
export const STATUS_DRAFT = 2

const getPages = async ({
  orderBy = 'publishedAt',
  createdAt,
  publishedAt,
  statusType,
} = {}) => {
  let query = db.collection('pages')
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

  const postsSnapshot = await query.get()

  const posts = []
  postsSnapshot.forEach((doc) => {
    posts.push(doc.data())
  })
  return posts
}

const getPage = async id => {
  const page = await getPageBySlug(id)
  if (page) {
    return page
  }

  const doc = await db.collection('pages').doc(id).get()
  return doc.exists ? doc.data() : null
}

const getPageUrl = page => {
  if (!page) {
    return ''
  }
  return page.slug
    ? encodeURIComponent(page.slug)
    : encodeURIComponent(page.id)
}

const getPageBySlug = async (slug) => {
  const pagesRef = db.collection('pages');
  const snapshot = await pagesRef.where('slug', '==', slug).get()

  if (snapshot.empty) {
    return null
  }

  const pages = []
  snapshot.forEach(doc => {
    pages.push(doc.data())
  })
  return pages.shift()
}

const createPage = async ({
  status: inputStatus,
  title: inputTitle,
  slug: inputSlug,
  body,
}) => {
  const id = uuidv4()
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
  const title = inputTitle && inputTitle.trim()
  const slug = inputSlug && inputSlug.trim()
  const status = parseInt(inputStatus)

  await db.collection('pages')
  .doc(id)
  .set({
    id,
    status,
    title,
    slug,
    body,
    draft: { title, slug, body },
    createdAt: serverTimestamp,
    updatedAt: serverTimestamp,
    publishedAt: status === STATUS_PUBLIC ? serverTimestamp : null,
  })
  return true
}

const updatePage = async ({
  id,
  status: inputStatus,
  title: inputTitle,
  slug: inputSlug,
  body,
}) => {
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
  const title = inputTitle && inputTitle.trim()
  const slug = inputSlug && inputSlug.trim()
  const status = parseInt(inputStatus)

  const prevPage = await getPage(id)
  !prevPage && (() => {throw new Exception('Could not find page')})()

  const draft = { title, slug, body }
  const data = {
    status,
    title,
    slug,
    body,
    draft,
    updatedAt: serverTimestamp
  }

  if (!prevPage.publishedAt && status === STATUS_PUBLIC) {
    data.publishedAt = serverTimestamp
  }

  const saveData = status == STATUS_DRAFT ? { draft } : data

  await db.collection('pages').doc(id).set(saveData, { merge: true })

  return true
}

const deletePage = async id => {
  const page = await getPage(id)
  if (!page) {
    const message = 'Could not find post'
    throw new ValidationError( message, [{ key: 'id', message }])
  }
  await db.collection('pages').doc(id).delete()
}

export {
  getPageUrl,
  getPages,
  getPage,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
}