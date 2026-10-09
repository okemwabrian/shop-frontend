import { useEffect, useState } from 'react'
import { errorMessage } from '../api/client.js'
import { getLegal } from '../api/shop.js'
import ErrorBox from './ErrorBox.jsx'
import Loading from './Loading.jsx'

export default function LegalPage({ name }) {
  const [doc, setDoc] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setDoc(null)
    setError('')

    getLegal(name)
      .then((result) => {
        if (active) setDoc(result)
      })
      .catch((err) => {
        if (active) setError(errorMessage(err))
      })

    return () => {
      active = false
    }
  }, [name])

  if (error) return <ErrorBox message={error} />
  if (!doc) return <Loading />

  return (
    <article className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="text-2xl font-bold">{doc.title}</h1>
      <p className="text-sm text-gray-500">
        Version {doc.version}, last updated {doc.lastUpdated}
      </p>
      <div className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-700">
        {doc.content}
      </div>
    </article>
  )
}
