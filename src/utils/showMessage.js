import './showMessage.css'

export const showMessage = (container, message, isError) => {
  const messageElement = document.createElement('p')
  messageElement.textContent = message
  messageElement.className = `message ${isError ? 'error' : 'success'}`
  container.appendChild(messageElement)

  setTimeout(() => {
    messageElement.remove()
  }, 3000)
}
