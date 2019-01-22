const photoForm = document.querySelector('#add-photo-form')
const titleInput = document.querySelector('#title')
const urlInput = document.querySelector('#url')
const cardHold = document.querySelector('.card-holder')

const state = {
  pichas: []
}

function renderPhoto(photo) {
  const aTag = document.createElement('a')
  const imgTag = document.createElement('img')

  imgTag.src = photo.url
  imgTag.className = 'photo-card'

  aTag.href = '#popup2'

  aTag.append(imgTag)

  cardHold.append(aTag)

  aTag.addEventListener('click', () => {
    const windowPic = document.querySelector('.window-photo')
    const tagsContainer = document.querySelector('.tags-container')
    tagsContainer.innerHTML = ''
    windowPic.src = photo.url
    state.pichas.find(pic => pic.id === photo.id).tags
      .forEach(tag => {
        const tagBtn = document.createElement('button')
        const tagSpan = document.createElement('span')

        tagBtn.className = 'tag-button'
        tagSpan.innerText = tag.description

        tagBtn.append(tagSpan)
        tagsContainer.append(tagBtn)
      })
  })
}

function renderPhotos(photos) {
  photos.forEach(photo => renderPhoto(photo))
}

getPhotos().then(data => {
  // console.log(data)
  state.pichas = data
  renderPhotos(state.pichas)
})

function updatePage() {
  cardHold.innerHTML = ''
  renderPhotos(state.pichas)
}

photoForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const newPhoto = {
    title: titleInput.value,
    url: urlInput.value
  }

  savePicha(newPhoto).then(photo => {
    state.pichas.push(photo)
    updatePage()

    getLabels(photo.url).then(data => {
      data.responses[0].labelAnnotations.forEach(tag => {
        saveTag(tag).then(tagData => {
          saveRelevance(tagData.id, photo.id)
        })
      })
    })

  })

  photoForm.reset()

})