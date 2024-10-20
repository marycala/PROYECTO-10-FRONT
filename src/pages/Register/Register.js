import { Header } from '../../components/Header/Header'
import { showLoader, hideLoader } from '../../components/Loader/Loader'
import { apiFetch } from '../../services/api'
import { showMessage } from '../../utils/showMessage'
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
  inputName.placeholder = 'Name'
  inputEmail.placeholder = 'Email'
  inputPassword.placeholder = '******'
  button.textContent = 'Register'

  form.append(inputName, inputEmail, inputPassword, button)
  fatherElement.append(form)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    showLoader(fatherElement)

    await submitRegister(
      inputName.value,
      inputEmail.value,
      inputPassword.value,
      form
    )

    hideLoader()
  })
}

const submitRegister = async (name, email, password, form) => {
  const userData = {
    userName: name,
    email: email,
    password: password
  }

  try {
    const res = await apiFetch(
      'http://localhost:3000/api/v1/users/register',
      'POST',
      userData
    )

    if (!res.ok) {
      const errorMessage =
        res.status === 400 ? 'Email is already in use' : 'An error has occurred'
      showMessage(form, errorMessage, true)
      return
    } else {
      await submitLogin(email, password, form)
      showMessage(form, 'Registration successful! Redirecting...', false)

      form.reset()
    }
  } catch (error) {
    showMessage(form, 'Connection error. Please try again later.', true)
  }
}
