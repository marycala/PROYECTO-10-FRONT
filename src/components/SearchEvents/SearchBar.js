import { Home } from '../../pages/Home/Home'
import { showMessage } from '../../utils/showMessage'
import { SearchEvents } from './SearchEvents'
import './SearchBar.css'

export const SearchBar = () => {
  const searchContainer = document.createElement('div')
  searchContainer.classList.add('search')

  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.placeholder = 'Search by title...'
  searchInput.classList.add('search-input')
  searchInput.setAttribute('aria-label', 'Search for events by title')

  const searchButton = document.createElement('button')
  searchButton.textContent = 'Search'
  searchButton.classList.add('button')
  searchButton.setAttribute('aria-label', 'Search events')

  const clearButton = document.createElement('button')
  clearButton.textContent = 'Clear'
  clearButton.classList.add('button')
  clearButton.setAttribute('aria-label', 'Clear search and show all events')

  let isSearching = false

  const handleSearch = async () => {
    const searchTerm = searchInput.value.trim()
    if (!searchTerm) {
      showMessage(searchContainer, 'Please enter a search term.', true)
      return
    }

    if (isSearching) return
    isSearching = true

    try {
      const resultsContainer = await SearchEvents(searchTerm)
      const main = document.querySelector('main')
      main.innerHTML = ''
      main.append(resultsContainer)
    } catch (error) {
      showMessage(
        searchContainer,
        'Error performing search. Please try again.',
        true
      )
    } finally {
      isSearching = false
    }
  }

  const handleClear = () => {
    searchInput.value = ''
    Home()
  }

  searchButton.addEventListener('click', handleSearch)
  clearButton.addEventListener('click', handleClear)

  searchContainer.append(searchInput, searchButton, clearButton)
  return searchContainer
}
