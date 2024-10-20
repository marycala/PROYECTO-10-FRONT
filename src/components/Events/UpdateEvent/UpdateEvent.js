import { apiFetch } from '../../../services/api'
import { showMessage } from '../../../utils/showMessage'

export const updateEvent = async (eventId) => {
  try {
    const res = await apiFetch(`${API_URL}/api/v1/events/${eventId}`)

    if (res.ok) {
      const event = await res.json()
      updateEventUI(event)
    } else {
      const eventElement = document.querySelector(`[data-id="${eventId}"]`)
      showMessage(
        eventElement,
        'Failed to load event. Please try again later.',
        true
      )
    }
  } catch (error) {
    const eventElement = document.querySelector(`[data-id="${eventId}"]`)
    showMessage(
      eventElement,
      'Error fetching event. Please check your connection.',
      true
    )
  }
}

export const updateEventUI = (event) => {
  const eventElement = document.querySelector(`[data-id="${event._id}"]`)

  if (!eventElement) {
    return
  }

  const attendeeList = eventElement.querySelector('ul')

  attendeeList.innerHTML = ''

  if (event.attendees.length === 0) {
    const noAttendeesMessage = document.createElement('p')
    noAttendeesMessage.textContent = 'No attendees for this event.'
    noAttendeesMessage.style.fontStyle = 'italic'
    attendeeList.append(noAttendeesMessage)
  } else {
    event.attendees.forEach((attendee) => {
      const attendeeItem = document.createElement('li')
      attendeeItem.textContent = attendee.userId.userName
      attendeeList.append(attendeeItem)
    })
  }
}
