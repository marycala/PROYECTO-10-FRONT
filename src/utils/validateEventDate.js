export function validateEventDate(date) {
  const eventDate = new Date(date)
  const currentDate = new Date()
  if (eventDate <= currentDate) {
    return 'The event date must be in the future'
  }
  return null
}
