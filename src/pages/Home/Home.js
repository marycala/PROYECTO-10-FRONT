import { Header } from '../../components/Header/Header'
import { EventsList } from '../../components/Events/EventsList/EventsList'
import { showLoader, hideLoader } from '../../components/Loader/Loader'
import { showMessage } from '../../utils/showMessage'
import { SearchBar } from '../../components/SearchEvents/SearchBar'

export const Home = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  Header(true, SearchBar)

  showLoader()

  try {
    const eventsList = await EventsList()
    main.append(eventsList)
  } catch (error) {
    showMessage(main, 'Error loading events. Please try again later.', true)
  } finally {
    hideLoader()
  }
}
