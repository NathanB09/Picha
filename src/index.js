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
const windowPic = document.querySelector('.window-photo')
const closeComments = document.querySelector('.close-comment-window')
const commentUl = document.querySelector('.comment-list')
const commentForm = document.querySelector('#comment-form')
const commentInput = document.querySelector('#comment-content')
const datalist = document.querySelector('#tags')
const popup2 = document.querySelector('#popup2')
const logo = document.querySelector('.logo-anchor')
const popup1 = document.querySelector('#popup1')
const close1 = document.querySelector('.close')
const deleteBtn = document.querySelector('.delete-image')

const state = {
  pichas: [],
  currentPichaId: 0
}
const uniqTags = []

// initial page load of pre-existing photos
getPhotos().then(data => {
  state.pichas = data
  renderPhotos(state.pichas)
  searchDatalist()
  window.location.href = '#'
})

function searchDatalist() {
  toUniqTags()
  uniqTags.forEach(tag => {
    const option = document.createElement('option')
    option.value = tag.description
    datalist.append(option)
  })
}

// renders a single photo
function renderPhoto(photo) {
  const aTag = document.createElement('a')
  const imgTag = document.createElement('img')

  imgTag.src = photo.url
  imgTag.className = 'photo-card'

  aTag.append(imgTag)
  cardHold.append(aTag)

  aTag.addEventListener('click', () => {
    popup2.classList.toggle('visible')
    state.currentPichaId = photo.id
    windowPic.src = photo.url
    tagsContainer.innerHTML = ''
    renderTags(photo.id)
  })
}

function renderComment(comment) {
  const commentLi = document.createElement('li')
  const commentP = document.createElement('p')
  commentLi.className = 'comment-li'
  commentP.className = 'comment-p'
  commentP.innerText = comment.content
  commentLi.append(commentP)
  commentUl.append(commentLi)
}

function toggleComments() {
  windowPic.parentNode.querySelector('.comment-window').classList.toggle("visible")
  commentUl.innerHTML = ""
  getPhotoById(state.currentPichaId).then(json => {
    json.comments.forEach(comment => renderComment(comment))
  })
}

windowPic.addEventListener('click', toggleComments)
closeComments.addEventListener('click', toggleComments)

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
        popup2.classList.toggle('visible')
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
    updatePage()
  })

  photoForm.reset()
  popup1.classList.toggle('visible')
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

  toUniqTags()

  uniqTags.sort((a, b) => {
    if (a.description < b.description) {
      return -1
    }
    if (a.description > b.description) {
      return 1
    }
    return 0
  })

  uniqTags.forEach(tag => {
    const tagBtn = document.createElement('button')

    tagBtn.className = 'tag-button'
    tagBtn.innerText = tag.description

    // renders the images for the clicked tag
    tagBtn.addEventListener('click', event => {
      event.preventDefault()
      cardHold.innerHTML = ''
      renderPhotos(filtered(tag.description))
    })

    cardHold.append(tagBtn)
  })

})

function toUniqTags() {
  const temp = []
  uniqTags.length = 0
  state.pichas.forEach(photo => {
    photo.tags.forEach(tag => {

      if (!temp.includes(tag.description)) {
        temp.push(tag.description)
        uniqTags.push(tag)
      }

    })
  })
}

commentForm.addEventListener('submit', event => {
  event.preventDefault()
  const newComment = {
    picha_id: state.currentPichaId,
    content: commentInput.value
  }
  saveComment(newComment)
  renderComment(newComment)
  commentForm.reset()
})

close2.addEventListener('click', () => {
  hideComments()
  popup2.classList.toggle('visible')
})

logo.addEventListener('click', () => {
  popup1.classList.toggle('visible')
})

close1.addEventListener('click', () => {
  popup1.classList.toggle('visible')
})

deleteBtn.addEventListener('click', (event) => {
  event.preventDefault()
  removePhoto(state.currentPichaId)
});

document.querySelector('.popup2').addEventListener('click', event => {
  event.stopPropagation()
})

window.addEventListener('keyup', event => {
  if (event.which === 27 && popup2.classList.contains('visible')) {
    hideComments()
    popup2.classList.toggle('visible')
  }
})

popup2.addEventListener('click', (event) => {
  hideComments()
  popup2.classList.toggle('visible')
})

function removePhoto(id) {
  if (confirm('Are you sure you want to delete this Picha?')) {
    deletePhoto(id)
    deletePhotoFromState(id)
    hideComments()
    updatePage()
    popup2.classList.toggle('visible')
  };
};

function deletePhotoFromState(id) {
  const toDelete = state.pichas.find(picha => picha.id === id)
  const deleteIndex = state.pichas.indexOf(toDelete)
  state.pichas.splice(deleteIndex, 1)
}

function hideComments() {
  if (windowPic.parentNode.querySelector('.comment-window').classList.value.includes('visible')) {
    toggleComments()
  }
}