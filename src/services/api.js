const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://proyecto-10-back-mu.vercel.app'

export const apiFetch = async (
  endpoint,
  method = 'GET',
  body = null,
  form = null
) => {
  const token = localStorage.getItem('token')
  const options = {
    method,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    },
    body
  }

  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options)

    if (response.status === 400 && form) {
      let pError = document.querySelector('.error')

      if (!pError) {
        pError = document.createElement('p')
        pError.classList.add('error')
        pError.style.color = 'red'
        form.append(pError)
      }

      const errorData = await response.json()
      pError.textContent = `Error: ${
        errorData.message || 'An error has occurred'
      }`
      return null
    }

    return response
  } catch (error) {
    console.error('Fetch error:', error)
  }
}
