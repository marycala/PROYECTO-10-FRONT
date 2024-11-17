import './EventsList.css'
import { isAuthenticated } from '../../../utils/auth'
import { formatDate } from '../../../utils/dateUtils'
import { registerAttendance } from '../ConfirmAttendance/registerAttendance'
import { deleteEvent } from '../DeleteEvent/DeleteEvent'
import { showMessage } from '../../../utils/showMessage'
import { deleteAttendance } from '../DeleteAttendance/DeleteAttendance'
import { apiFetch } from '../../../services/api'
import { updateEvent } from '../UpdateEvent/UpdateEvent'
import { showModal } from '../../../utils/showModal/showModal'

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
      const noEventsMessage = document.createElement('p')
      noEventsMessage.textContent = 'No events available at the moment.'
      eventsContainer.append(noEventsMessage)
      return eventsContainer
    }

    for (const event of events) {
      const divEvent = document.createElement('div')
      const title = document.createElement('h3')
      const img = document.createElement('img')
      const info = document.createElement('div')
      const buttonConfirm = document.createElement('button')
      const buttonDelete = document.createElement('button')

      divEvent.className = 'event'
      divEvent.dataset.id = event._id
      title.textContent = event.title
      info.className = 'info'
      buttonConfirm.textContent = 'Confirm Attendance'
      buttonConfirm.className = 'confirm-attendance'
      buttonConfirm.dataset.id = event._id
      buttonDelete.textContent = 'Delete Attendance'
      buttonDelete.className = 'delete-attendance'
      buttonDelete.style.display = 'none'
      buttonDelete.dataset.id = event._id

      if (event.img) {
        img.src = event.img
        img.alt = event.title
        divEvent.appendChild(img)
      }

      const formattedDate = formatDate(new Date(event.date))

      if (isAuthenticated()) {
        const attendeeList = document.createElement('ul')

        if (event.attendees.length === 0) {
          const noAttendeesMessage = document.createElement('p')
          noAttendeesMessage.textContent = 'No attendees for this event.'
          noAttendeesMessage.style.fontStyle = 'italic'
          attendeeList.append(noAttendeesMessage)
        } else {
          event.attendees.forEach((attendee) => {
            const attendeeItem = document.createElement('li')
            attendeeItem.textContent = `${attendee.userId.userName}`
            attendeeList.append(attendeeItem)
          })
        }

        info.innerHTML = `
          <p>Date: ${formattedDate}</p>
          <p>Location: ${event.location}</p>
          <p>Description: ${event.description}</p>
          <p>Price: ${event.price === 0 ? 'Free' : event.price + ' €'}</p>
          <p>Creator: ${event.creator.userName}</p>
          <p id="attendees-list">Attendees: </p>
        `
        divEvent.append(
          title,
          img,
          info,
          attendeeList,
          buttonConfirm,
          buttonDelete
        )

        if (user._id === event.creator._id || user.rol === 'admin') {
          const deleteButton = document.createElement('button')
          deleteButton.textContent = 'Delete Event'
          deleteButton.className = 'delete'
          deleteButton.dataset.id = event._id

          deleteButton.addEventListener('click', () => {
            const eventId = deleteButton.dataset.id
            showModal(
              'Are you sure you want to delete this event?',
              async () => {
                await deleteEvent(eventId)
                divEvent.remove()
              }
            )
          })

          divEvent.appendChild(deleteButton)
        }

        buttonConfirm.addEventListener('click', async () => {
          const eventId = buttonConfirm.dataset.id
          await registerAttendance(eventId)
          await updateEvent(eventId)

          buttonConfirm.style.display = 'none'
          buttonDelete.style.display = 'block'
        })

        const isRegistered = event.attendees.some(
          (attendee) => attendee.userId._id === user._id
        )

        if (isRegistered) {
          buttonConfirm.style.display = 'none'
          buttonDelete.style.display = 'block'
          const registeredAttendee = event.attendees.find(
            (attendee) => attendee.userId._id === user._id
          )
          if (registeredAttendee) {
            buttonDelete.dataset.attendeeId = registeredAttendee._id
          }
        }

        buttonDelete.addEventListener('click', async () => {
          const attendeeId = buttonDelete.dataset.attendeeId
          const eventId = buttonDelete.dataset.id
          await deleteAttendance(attendeeId, eventId)
          await updateEvent(eventId)

          buttonConfirm.style.display = 'block'
          buttonDelete.style.display = 'none'
        })
      } else {
        info.innerHTML = `
          <p>Date: ${formattedDate}</p>
          <p>Location: ${event.location}</p>
          <p>Description: ${event.description}</p>
          <p>Price: ${event.price === 0 ? 'Free' : event.price + ' €'}</p>
          <p>Number of Attendees: ${event.attendees.length}</p>
        `
        divEvent.append(title, img, info)
      }

      eventsContainer.append(divEvent)
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
