import { isAuthenticated } from '../../../utils/auth'
import { showLoader, hideLoader } from '../../Loader/Loader'
import { apiFetch } from '../../../services/api'
import { updateEvent } from '../UpdateEvent/UpdateEvent'
import { showMessage } from '../../../utils/showMessage'

export const registerAttendance = async (eventId) => {
  const eventElement = document.querySelector(`[data-id="${eventId}"]`)

  if (!isAuthenticated()) {
    showMessage(
      eventElement,
      'You do not have permission. Please log in.',
      true
    )
    return
  }

  const user = JSON.parse(localStorage.getItem('user'))
  const userId = user._id

  if (!userId) {
    showMessage(eventElement, 'User ID not found. Please log in again.', true)
    return
  }

  const body = {
    userId
  }

  showLoader()

  try {
    const res = await apiFetch(`/api/v1/attendees/${eventId}`, 'POST', body)

    if (res.ok) {
      showMessage(eventElement, 'Attendance confirmed', false)
      updateEvent(eventId)
    } else {
      const errorData = await res.json()
      showMessage(
        eventElement,
        errorData.message || 'You are already registered',
        true
      )
    }
  } catch (error) {
    showMessage(eventElement, 'Error confirming attendance', true)
  } finally {
    hideLoader()
  }
}
