import {useEffect, useState} from 'react'
import fetcher from './fetcher'
import Avatar from './../../components/atoms/Avatar'

const UserAvatar = ({ id }) => {
  const [ user, setUser ] = useState()

  useEffect(() => {
    const fetchUser = async () => {
      const _user = await fetcher.fetch(id)
      _user && setUser(_user)
    }

    fetchUser()
  }, [id])

  return (
    <>{user && user.photoUrl && (<Avatar url={user.photoUrl} />)}</>
  )
}

export default UserAvatar