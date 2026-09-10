import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import SignIn from '../../Components/SignIn/SignIn'
import { useAuth } from '../../Context/AuthContext'

interface Props { }

const SignInPage = (_props: Props) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className='signInPageContainer'>
      <SignIn />
    </div>
  )
}

export default SignInPage
