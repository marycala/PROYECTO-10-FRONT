export const FormCreate = () => {
  const form = document.createElement('form')
  form.className = 'create-event'
  form.enctype = 'multipart/form-data'
  form.innerHTML = `
  <label for="title">Event Title:</label>
  <input type="text" id="title" name="title" required />
  
  <label for="file">Upload Image (Optional):</label>
  <input type="file" id="file" name="file" />

  <label for="img-url">Or Enter Image URL (Optional):</label>
  <input type="text" id="img-url" name="img-url" />

  <label for="date">Date:</label>
  <input type="datetime-local" id="date" name="date" required />

  <label for="location">Location:</label>
  <input type="text" id="location" name="location" required />

  <label for="description">Description:</label>
  <textarea id="description" name="description" required></textarea>

  <label for="price">Price:</label>
  <input type="number" id="price" name="price" min="0" required />

  <button type="submit">Create Event</button>
  <div id="error-container"></div>
`
  return form
}
