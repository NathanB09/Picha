const photoForm = document.querySelector('#add-photo-form')
const titleInput = document.querySelector('#title')
const urlInput = document.querySelector('#url')

const state = {
  pichas: []
}

function renderPhoto() {

}

photoForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const newPhoto = {
    title: titleInput.value,
    url: urlInput.value
  }

  state.pichas.push(newPhoto)

  // savePicha()

  photoForm.reset()
})