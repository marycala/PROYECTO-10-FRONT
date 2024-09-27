import { showMessage } from '../../utils/showMessage'
import { hideLoader, showLoader } from '../Loader/Loader'
import { createEventElement } from './createEventElement'

export const onSearch = async (searchTerm) => {
  showLoader()

  const main = document.querySelector('main')

  try {
    const url = searchTerm
      ? `http://localhost:3000/api/v1/events/search/title/${encodeURIComponent(
          searchTerm
        )}`
      : `http://localhost:3000/api/v1/events`

    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const results = await res.json()

    main.innerHTML = ''

    if (Array.isArray(results)) {
      if (results.length > 0) {
        const eventsContainer = document.createElement('section')
        results.forEach((event) => {
          const divEvent = createEventElement(event)
          eventsContainer.append(divEvent)
        })
        main.append(eventsContainer)
      } else {
        showMessage(main, 'No events found.', true)
      }
    } else {
      showMessage(main, 'Unexpected results format received.', true)
    }
  } catch (error) {
    console.error('Search error:', error)
    showMessage(
      main,
      'An error occurred while searching. Please try again.',
      true
    )
  } finally {
    hideLoader()
  }
}
