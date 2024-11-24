import { showMessage } from '../../../utils/showMessage'
import { apiFetch } from '../../../services/api'
import { RenderEvent } from '../RenderEvent/RenderEvent'

export const EventsList = async () => {
  try {
    const res = await apiFetch('/api/v1/events')

    if (!res.ok) {
      const errorMessage = `Error fetching events: ${res.statusText}`
      showMessage(document.querySelector('main'), errorMessage, true)
      return
    }

    const events = await res.json()
    const eventsContainer = document.createElement('section')
    eventsContainer.id = 'events-container'
    const user = JSON.parse(localStorage.getItem('user'))

    if (events.length === 0) {
      showMessage(
        document.querySelector('main'),
        'No events available at the moment.',
        true
      )
      return
    }

    for (const event of events) {
      const eventElement = RenderEvent(event, user)
      eventsContainer.append(eventElement)
    }

    return eventsContainer
  } catch (error) {
    showMessage(
      document.querySelector('main'),
      'Error loading events. Please try again later.',
      true
    )
    return document.createElement('p')
  }
}
