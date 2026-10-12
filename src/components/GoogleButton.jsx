import { GoogleLogin } from '@react-oauth/google'

export default function GoogleButton({ onToken, onError }) {
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={(response) => {
          if (!response.credential) {
            onError('Google sign-in failed. Please try again.')
            return
          }
          onToken(response.credential)
        }}
        onError={() => onError('Google sign-in failed. Please try again.')}
      />
    </div>
  )
}
