export const showLoader = () => {
  let loader = document.querySelector('#loader')

  if (!loader) {
    loader = document.createElement('div')
    loader.id = 'loader'
    loader.textContent = 'Loading...'
    loader.style.position = 'fixed'
    loader.style.top = '50%'
    loader.style.left = '50%'
    loader.style.transform = 'translate(-50%, -50%)'
    loader.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    loader.style.color = '#fff'
    loader.style.padding = '10px'
    loader.style.borderRadius = '5px'
    loader.style.zIndex = '1000'
    document.body.appendChild(loader)
  }
}

export const hideLoader = () => {
  const loader = document.querySelector('#loader')
  if (loader) {
    loader.remove()
  }
}
