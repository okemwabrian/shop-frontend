import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext.jsx'

export default function GoogleButton({ className = '', onDone }) {
  const { loginWithGoogle } = useAuth()

  return (
    <div className={className}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            await loginWithGoogle(credentialResponse.credential)
            onDone?.()
          } catch (error) {
            console.error('Google login failed', error)
          }
        }}
        onError={() => {
          console.error('Google login failed')
        }}
        theme="outline"
        size="large"
        text="signin_with"
      />
    </div>
  )
}
