import { Home } from '../../pages/Home/Home'
import { Register } from '../../pages/Register/Register'
import { Login } from '../../pages/Login/Login'
import { CreateEvent } from '../Events/CreateEvent/CreateEvent'
import { SearchBar } from '../SearchEvents/SearchBar'
import './Header.css'

const routes = [
  { text: 'Home', function: Home },
  { text: 'Register', function: Register },
  { text: 'Login', function: Login },
  { text: 'Create Event', function: CreateEvent }
]

export const Header = (showSearchBar) => {
  const header = document.querySelector('header')
  header.innerHTML = ''

  const divLogo = document.createElement('div')
  divLogo.className = 'logo'
  const aLogo = document.createElement('a')
  aLogo.textContent = 'Events by Mary'
  aLogo.href = 'index.html'
  divLogo.appendChild(aLogo)
  header.appendChild(divLogo)

  const nav = document.createElement('nav')
  routes.forEach((route) => {
    const a = document.createElement('a')
    a.href = '#'
    a.textContent = route.text

    if (route.text === 'Login' && localStorage.getItem('token')) {
      a.textContent = 'Logout'
      a.addEventListener('click', () => {
        localStorage.removeItem('token')
        Header(false)
      })
    } else {
      a.addEventListener('click', () => {
        route.function()
        if (route.text === 'Home' && showSearchBar) {
          Header(true, onSearch)
        }
      })
    }

    nav.appendChild(a)
  })
  header.appendChild(nav)

  if (showSearchBar) {
    const searchBar = SearchBar(async (searchTerm) => {
      await SearchEvents(searchTerm)
    })
    header.appendChild(searchBar)
  }
}
