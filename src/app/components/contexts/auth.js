import React, {
  useState,
  useEffect,
  useContext,
  createContext
} from 'react'
// import firebase from '../../domains/services/firebase'

const AuthContext = createContext({
  user: null,
  setUser: () => {}
})

export default AuthContext

// const AuthContext = createContext()

// const AuthContextProvider = props => {
//   const auth = createAuthState() 
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
// }

// const useAuthContext = () => {
//   return useContext(AuthContext)
// }

// const createAuthState = () => {
//   const [user, setUser] = useState()

//   useEffect(() => {
//     firebase.auth && firebase.auth.onAuthStateChanged(user => {
//       console.log(user)
//       if (user) {
//         return user
//           .getIdToken()
//           .then(token => {
//             return fetch('/api/login', {
//               method: 'POST',
//               headers: new Headers({ 'Content-Type': 'application/json' }),
//               credentials: 'same-origin',
//               body: JSON.stringify({ token })
//             })
//           })
        
//       } else {
//         fetch('/api/logout', {
//           method: 'POST',
//           credentials: 'same-origin'
//         })
//       }
//     })
//   })

//   return {
//     user,
//     setUser,
//   }
// }

// export default {
//   AuthContext,
//   AuthContextProvider,
//   createAuthState,
// }