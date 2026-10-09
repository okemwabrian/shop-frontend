const styles = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  OPEN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-200 text-gray-700',
}

export default function StatusBadge({ status }) {
  const style = styles[status] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
