import { Header } from '../../components/Header/Header'
import { Home } from '../Home/Home'
import { showLoader, hideLoader } from '../../components/Loader/Loader'
import { apiFetch } from '../../services/api'
import { showMessage } from '../../utils/showMessage'

export const Login = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  Header(false)

  const loginDiv = document.createElement('div')
  loginDiv.className = 'login'

  LoginForm(loginDiv)

  main.append(loginDiv)
}

export const LoginForm = (fatherElement) => {
  const form = document.createElement('form')

  const inputEmail = document.createElement('input')
  const inputPassword = document.createElement('input')
  const button = document.createElement('button')

  form.id = 'form'
  inputEmail.type = 'email'
  inputPassword.type = 'password'
  inputEmail.placeholder = 'Email'
  inputPassword.placeholder = '******'
  button.textContent = 'Login'

  form.append(inputEmail, inputPassword, button)
  fatherElement.append(form)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    showLoader()

    if (inputEmail.value.trim() === '' || inputPassword.value.trim() === '') {
      showMessage(
        document.querySelector('main'),
        'Please fill in all fields.',
        true
      )
      hideLoader()
      return
    }

    await submitLogin(inputEmail.value, inputPassword.value, form)

    hideLoader()
  })
}

export const submitLogin = async (email, password, form) => {
  const credentials = { email, password }

  try {
    const response = await apiFetch('/api/v1/users/login', 'POST', credentials)

    const data = await response.json()

    if (!response.ok) {
      showMessage(
        document.querySelector('main'),
        data.message || 'Incorrect email or password',
        true
      )
      return
    } else {
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)

      showMessage(document.querySelector('main'), 'Login successful!', false)

      Home()
    }
  } catch (error) {
    showMessage(
      document.querySelector('main'),
      'An error occurred while logging in. Please try again.',
      true
    )
  }
}
