import { Home } from '../../pages/Home/Home'
import { Register } from '../../pages/Register/Register'
import { Login } from '../../pages/Login/Login'
import { CreateEvent } from '../Events/CreateEvent/CreateEvent'
import { SearchBar } from '../SearchEvents/SearchBar'
import './Header.css'

export const Header = (showSearchBar) => {
  const header = document.querySelector('header')
  header.innerHTML = '' // Limpiar el contenido actual del header

  // Iniciar las rutas desde cero para evitar duplicados
  let routes = [
    { text: 'Home', function: Home },
    { text: 'Create Event', function: CreateEvent },
    { text: 'Login', function: Login }
  ]

  // Si no hay token, mostramos el botón de 'Register'
  if (!localStorage.getItem('token')) {
    if (!routes.some((route) => route.text === 'Register')) {
      routes.push({ text: 'Register', function: Register })
    }
  } else {
    // Si hay token, cambiamos 'Login' por 'Logout'
    routes = routes.filter((route) => route.text !== 'Login')
    routes.push({ text: 'Logout', function: logout })
  }

  // Logo
  const divLogo = document.createElement('div')
  divLogo.className = 'logo'
  const aLogo = document.createElement('a')
  aLogo.textContent = 'Events by Mary'
  aLogo.href = 'index.html'
  divLogo.appendChild(aLogo)
  header.appendChild(divLogo)

  // Menú de navegación
  const nav = document.createElement('nav')
  routes.forEach((route) => {
    const a = document.createElement('a')
    a.href = '#'
    a.textContent = route.text

    a.addEventListener('click', () => {
      route.function()
      if (route.text === 'Home' && showSearchBar) {
        Header(true) // Solo pasamos showSearchBar
      }
    })

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

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  Header(false)
  Home()
}
