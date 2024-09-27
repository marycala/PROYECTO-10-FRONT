import { hideLoader, showLoader } from '../../Loader/Loader'
import { apiFetch } from '../../../services/api'
import { showMessage } from '../../../utils/showMessage'
import { updateEvent } from '../UpdateEvent/UpdateEvent'

export const deleteEvent = async (eventId) => {
  const eventElement = document.querySelector(`[data-id="${eventId}"]`)

  showLoader()
  try {
    const res = await apiFetch(
      `http://localhost:3000/api/v1/events/${eventId}`,
      'DELETE'
    )

    if (res.ok) {
      showMessage(eventElement, 'Event deleted successfully', false)
      updateEvent(eventId)
    } else {
      const errorData = await res.json()
      showMessage(
        eventElement,
        errorData.message || 'Error deleting event',
        true
      )
    }
  } catch (error) {
    showMessage(eventElement, 'An error has occurred', true)
  } finally {
    hideLoader()
  }
}
