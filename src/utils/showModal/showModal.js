import { modalTemplate } from './modalTemplate'
import './showModal.css'

const initializeModal = () => {
  if (!document.getElementById('modal')) {
    const div = document.createElement('div')
    div.innerHTML = modalTemplate
    document.body.appendChild(div)
  }
}

export const showModal = (message, onConfirm) => {
  initializeModal()

  const modal = document.getElementById('modal')
  const modalMessage = document.getElementById('modal-message')
  const confirmButton = document.getElementById('modal-confirm')
  const cancelButton = document.getElementById('modal-cancel')

  modal.classList.remove('hidden')
  modalMessage.textContent = message

  confirmButton.onclick = () => {
    onConfirm()
    modal.classList.add('hidden')
  }

  cancelButton.onclick = () => {
    modal.classList.add('hidden')
  }
}
