export function money(amount) {
  return `KES ${Number(amount).toLocaleString('en-KE')}`
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
