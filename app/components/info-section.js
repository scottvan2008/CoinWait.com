export function InfoSection({ title, content }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600">{content}</p>
    </div>
  )
}

