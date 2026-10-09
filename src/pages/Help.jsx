import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '../api/client.js'
import { getContact, getFaqs } from '../api/shop.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Loading from '../components/Loading.jsx'

export default function Help() {
  const [faqs, setFaqs] = useState([])
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    Promise.all([getFaqs(), getContact()])
      .then(([faqData, contactData]) => {
        if (!active) return
        setFaqs(faqData)
        setContact(contactData)
      })
      .catch((err) => {
        if (active) setError(errorMessage(err))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) return <Loading />
  if (error) return <ErrorBox message={error} />

  const groups = faqs.reduce((result, faq) => {
    const category = faq.category || 'General'
    if (!result[category]) result[category] = []
    result[category].push(faq)
    return result
  }, {})

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <h1 className="text-2xl font-bold">Help centre</h1>
        {Object.entries(groups).map(([category, questions]) => (
          <section key={category}>
            <h2 className="mb-2 font-semibold text-orange-600">{category}</h2>
            <div className="space-y-2">
              {questions.map((faq) => (
                <details
                  key={faq.id}
                  className="rounded-lg border border-gray-200 bg-white p-3"
                >
                  <summary className="cursor-pointer font-medium">
                    {faq.question}
                  </summary>
                  <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
        {faqs.length === 0 && (
          <p className="text-gray-500">No questions have been added yet.</p>
        )}
      </div>

      <aside className="h-fit space-y-3 rounded-lg border border-gray-200 bg-white p-5 text-sm">
        <h2 className="text-lg font-bold">Contact us</h2>
        {contact.email && (
          <p>
            Email:{' '}
            <a href={`mailto:${contact.email}`} className="text-orange-600">
              {contact.email}
            </a>
          </p>
        )}
        {contact.phone && (
          <p>
            Phone:{' '}
            <a href={`tel:${contact.phone}`} className="text-orange-600">
              {contact.phone}
            </a>
          </p>
        )}
        {contact.hours && <p className="text-gray-500">{contact.hours}</p>}
        {contact.whatsappLink && (
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="block rounded-md bg-green-500 py-2 text-center font-semibold text-white hover:bg-green-600"
          >
            Chat on WhatsApp
          </a>
        )}
        <Link
          to="/support"
          className="block rounded-md border border-gray-300 py-2 text-center font-medium"
        >
          Open a support ticket
        </Link>
      </aside>
    </div>
  )
}
