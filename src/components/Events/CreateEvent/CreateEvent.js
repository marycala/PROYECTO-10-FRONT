import { FormCreate } from '../FormCreate/FormCreate'
import { showMessage } from '../../../utils/showMessage'
import { showLoader, hideLoader } from '../../Loader/Loader'
import { isAuthenticated } from '../../../utils/auth'
import { Header } from '../../Header/Header'
import { Home } from '../../../pages/Home/Home'
import { apiFetch } from '../../../services/api'
import './CreateEvent.css'

export const CreateEvent = () => {
  const main = document.querySelector('main')
  main.innerHTML = ''
  Header(false)

  if (!isAuthenticated()) {
    const message = document.createElement('p')
    message.textContent = 'You do not have permission. Please log in.'
    message.style.fontSize = '1.5rem'

    main.appendChild(message)
    return
  }

  const form = FormCreate()
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    showLoader()
    await submitEvent(form, main)
  })

  main.appendChild(form)
}

const submitEvent = async (form, main) => {
  const title = form.elements.title.value
  const date = form.elements.date.value
  const location = form.elements.location.value
  const description = form.elements.description.value
  const fileInput = form.elements.file
  const imageUrl = form.elements['img-url'].value

  let price = parseFloat(form.elements.price.value)
  if (form.elements.price.value === 'Free' || price === 0) {
    price = 0
  }
  const formattedDate = new Date(date).toISOString()

  const formData = new FormData()
  formData.append('title', title)
  formData.append('date', formattedDate)
  formData.append('location', location)
  formData.append('description', description)
  formData.append('price', price)

  if (fileInput.files.length > 0) {
    formData.append('img', fileInput.files[0])
  } else if (imageUrl) {
    formData.append('img', imageUrl)
  }

  const user = JSON.parse(localStorage.getItem('user'))
  const userId = user._id

  if (!userId) {
    showMessage(main, 'User ID not found. Please log in again.', true)
    return
  }

  try {
    const res = await apiFetch(
      `http://localhost:3000/api/v1/events/create/${userId}`,
      'POST',
      formData
    )

    if (!res.ok) {
      const errorData = await res.json()
      showMessage(main, errorData.error || 'Error creating the event', true)
    }

    showMessage(main, 'Event created successfully')
    hideLoader()
    Home()
  } catch (error) {
    hideLoader()
    showMessage(main, 'Error creating the event. Please try again.', true)
  }
}
