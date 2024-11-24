import { apiFetch } from '../../services/api'
import { showMessage } from '../../utils/showMessage'
import { RenderEvent } from '../Events/RenderEvent/RenderEvent'

export const SearchEvents = async (searchTerm) => {
  try {
    const res = await apiFetch(
      `/api/v1/events/search/title/${encodeURIComponent(searchTerm)}`
    )

    if (!res.ok) {
      const errorMessage = `Error searching events: ${res.statusText}`
      showMessage(document.querySelector('main'), errorMessage, true)
      return
    }

    const events = await res.json()
    const eventsContainer = document.createElement('section')
    eventsContainer.id = 'search-results-container'
    const user = JSON.parse(localStorage.getItem('user'))

    if (events.length === 0) {
      const noResultsMessage = document.createElement('p')
      noResultsMessage.textContent = 'No events match your search.'
      eventsContainer.append(noResultsMessage)
      return eventsContainer
    }

    for (const event of events) {
      const eventElement = RenderEvent(event, user)
      eventsContainer.append(eventElement)
    }

    return eventsContainer
  } catch (error) {
    showMessage(
      document.querySelector('main'),
      'Error searching for events. Please try again later.',
      true
    )
    return
  }
}
