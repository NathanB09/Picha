const photoForm = document.querySelector('#add-photo-form')
const titleInput = document.querySelector('#title')
const urlInput = document.querySelector('#url')
const cardHold = document.querySelector('.card-holder')
const tagsContainer = document.querySelector('.tags-container')
const searchForm = document.querySelector('#tag-search')
const searchInput = document.querySelector('#search-item')
const homeTab = document.querySelector('#home-tab')
const tagTab = document.querySelector('#tag-tab')
const close2 = document.querySelector('.close2')

const state = {
  pichas: []
}

// initial page load of pre-existing photos
getPhotos().then(data => {
  state.pichas = data
  renderPhotos(state.pichas)
  window.location.href = '#'
})

// renders a single photo
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
    windowPic.src = photo.url
    tagsContainer.innerHTML = ''
    renderTags(photo.id)
  })
}

// renders the photos tags
function renderTags(id) {
  state.pichas.find(pic => pic.id === id).tags
    .forEach(tag => {
      const tagBtn = document.createElement('button')
      const tagSpan = document.createElement('span')

      tagBtn.className = 'tag-button'
      tagSpan.innerText = tag.description

      // renders the images for the clicked tag
      tagBtn.addEventListener('click', event => {
        event.preventDefault()
        cardHold.innerHTML = ''
        renderPhotos(filtered(tag.description))
        window.location.href = '#'
      })

      tagBtn.append(tagSpan)
      tagsContainer.append(tagBtn)
    })
}

// renders all pre-existing photos
function renderPhotos(photos) {
  photos.forEach(photo => renderPhoto(photo))
}

// updates page with new data
function updatePage() {
  cardHold.innerHTML = ''
  renderPhotos(state.pichas)
}

// Listener for creating uploading new photo
photoForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const newPhoto = {
    title: titleInput.value,
    url: urlInput.value
  }

  savePicha(newPhoto).then(photo => {
    state.pichas.push(photo)
    createTags(photo)
    window.location.href = '#'
    updatePage()
  })

  photoForm.reset()
})

// creates 5 tags to photo passed in
function createTags(photo) {
  const lastPic = state.pichas[state.pichas.length - 1]
  getLabels(photo.url).then(data => {
    data.responses[0].labelAnnotations.forEach(tag => {
      saveTag(tag).then(tagData => {
        lastPic.tags.push(tagData)
        saveRelevance(tagData.id, photo.id)
      })
    })
  })
}

// filters images by search input
searchForm.addEventListener('submit', event => {
  event.preventDefault()

  if (filtered(searchInput.value).length > 0) {
    cardHold.innerHTML = ''
    renderPhotos(filtered(searchInput.value))
  } else {
    cardHold.innerText = "No Images Found"
  }

  searchForm.reset()
})

function filtered(value) {
  return state.pichas.filter(photo => {
    return !!photo.tags.find(tag => {
      return tag.description.toLowerCase() === value.toLowerCase()
    })
  })
}

// renders home page showing all pics
homeTab.addEventListener('click', event => {
  event.preventDefault()
  updatePage()
})

// renders all tags
tagTab.addEventListener('click', event => {
  event.preventDefault()

  cardHold.innerHTML = ''

  state.pichas.forEach(photo => {
    photo.tags.forEach(tag => {
      const tagBtn = document.createElement('button')
      const tagSpan = document.createElement('span')

      tagBtn.className = 'tag-button'
      tagSpan.innerText = tag.description

      // renders the images for the clicked tag
      tagBtn.addEventListener('click', event => {
        event.preventDefault()
        cardHold.innerHTML = ''
        renderPhotos(filtered(tag.description))
      })

      tagBtn.append(tagSpan)
      cardHold.append(tagBtn)
    })
  })

})