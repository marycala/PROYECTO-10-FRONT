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

  const searchButton = document.createElement('button')
  searchButton.textContent = 'Search'
  searchButton.classList.add('button')

  const clearButton = document.createElement('button')
  clearButton.textContent = 'Clear'
  clearButton.classList.add('button')

  const handleSearch = async () => {
    const searchTerm = searchInput.value.trim()
    if (searchTerm) {
      const resultsContainer = await SearchEvents(searchTerm)
      const main = document.querySelector('main')
      main.innerHTML = ''
      main.append(resultsContainer)
    } else {
      showMessage(searchContainer, 'Please enter a search term.', true)
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
