import { isAuthenticated } from '../../utils/auth'
import { formatDate } from '../../utils/dateUtils'
import { showMessage } from '../../utils/showMessage'
import { registerAttendance } from '../Events/ConfirmAttendance/registerAttendance'
import { deleteEvent } from '../Events/DeleteEvent/DeleteEvent'

export const SearchEvents = async (searchTerm) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/events/search/title/${encodeURIComponent(
        searchTerm
      )}`
    )

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
      const message = document.createElement('p')
      message.textContent = 'No events found matching your search..'
      message.style.fontSize = '1.5rem'

      main.appendChild(message)
      return
    }

    for (const event of events) {
      const divEvent = document.createElement('div')
      const title = document.createElement('h3')
      const img = document.createElement('img')
      const info = document.createElement('div')
      const buttonConfirm = document.createElement('button')

      divEvent.className = 'event'
      divEvent.dataset.id = event._id
      title.textContent = event.title
      info.className = 'info'
      buttonConfirm.textContent = 'Confirm Attendance'
      buttonConfirm.className = 'confirm'
      buttonConfirm.dataset.id = event._id

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

        divEvent.append(title, img, info, attendeeList, buttonConfirm)

        if (user._id === event.creator._id || user.rol === 'admin') {
          const deleteButton = document.createElement('button')
          deleteButton.textContent = 'Delete Event'
          deleteButton.className = 'delete'
          deleteButton.dataset.id = event._id

          deleteButton.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this event?')) {
              const eventId = deleteButton.dataset.id
              await deleteEvent(eventId)
            }
          })

          divEvent.appendChild(deleteButton)
        }
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

      buttonConfirm.addEventListener('click', () => {
        const eventId = buttonConfirm.dataset.id
        registerAttendance(eventId)
      })

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
