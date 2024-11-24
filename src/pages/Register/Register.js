import { Header } from '../../components/Header/Header'
import { showLoader, hideLoader } from '../../components/Loader/Loader'
import { apiFetch } from '../../services/api'
import { showMessage } from '../../utils/showMessage'
import { Home } from '../Home/Home'
import { submitLogin } from '../Login/Login'

export const Register = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  Header(false)

  const registerDiv = document.createElement('div')
  registerDiv.className = 'register'

  RegisterForm(registerDiv)

  main.append(registerDiv)
}

const RegisterForm = (fatherElement) => {
  const form = document.createElement('form')

  const inputName = document.createElement('input')
  const inputEmail = document.createElement('input')
  const inputPassword = document.createElement('input')
  const button = document.createElement('button')

  form.id = 'form'
  inputName.type = 'text'
  inputEmail.type = 'email'
  inputPassword.type = 'password'
  inputName.placeholder = 'Name and surname'
  inputEmail.placeholder = 'Email'
  inputPassword.placeholder = '******'
  button.textContent = 'Register'

  form.append(inputName, inputEmail, inputPassword, button)
  fatherElement.append(form)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = inputName.value.trim()
    const email = inputEmail.value.trim()
    const password = inputPassword.value.trim()

    showLoader(fatherElement)

    await submitRegister(name, email, password, form)

    hideLoader()
  })
}

const submitRegister = async (name, email, password, form) => {
  const userData = {
    userName: name,
    email: email,
    password: password
  }

  if (name.length < 6) {
    showMessage(
      document.querySelector('main'),
      'You have to introduce your name and surname',
      true
    )
    return
  }

  if (password.length < 6 || password.lenght > 12) {
    showMessage(
      document.querySelector('main'),
      'Password must be between 6 and 12 characters.',
      true
    )
    return
  }

  try {
    const res = await apiFetch(`/api/v1/users/register`, 'POST', userData)

    if (!res.ok) {
      const errorMessage =
        res.status === 400 ? 'Email is already in use' : 'An error has occurred'
      showMessage(document.querySelector('main'), errorMessage, true)
      return
    } else {
      showMessage(
        document.querySelector('main'),
        'Registration successful! Redirecting...',
        false
      )
      await submitLogin(email, password, form)

      form.reset()

      setTimeout(() => {
        Home()
      }, 1500)
    }
  } catch (error) {
    showMessage(form, 'Connection error. Please try again later.', true)
  }
}
