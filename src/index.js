const photoForm = document.querySelector('#add-photo-form')
const cardHold = document.querySelector('.card-holder')
const tagsContainer = document.querySelector('.tags-container')
const searchForm = document.querySelector('#tag-search')
const windowPic = document.querySelector('.window-photo')
const commentUl = document.querySelector('.comment-list')
const commentForm = document.querySelector('#comment-form')
const datalist = document.querySelector('#tags')
const popup2 = document.querySelector('#popup2')
const popup1 = document.querySelector('#popup1')

const state = {
  pichas: [],
  currentPichaId: 0
}
const uniqTags = []

// Initial page load of pre-existing photos
getPhotos().then(data => {
  state.pichas = data
  renderPhotos(state.pichas)
  searchDatalist()
})

// Predictive search
function searchDatalist() {
  toUniqTags()
  uniqTags.forEach(tag => {
    const option = document.createElement('option')
    option.value = tag.description
    datalist.append(option)
  })
}

// Renders a single photo
function renderPhoto(photo) {
  const aTag = document.createElement('a')
  const imgTag = document.createElement('img')
  imgTag.src = photo.url
  imgTag.className = 'photo-card'
  aTag.append(imgTag)
  cardHold.append(aTag)

  aTag.addEventListener('click', () => {
    togglePopup2()
    state.currentPichaId = photo.id
    windowPic.src = photo.url
    tagsContainer.innerHTML = ''
    renderTags(photo.id)
  })
}

// Renders individual comment
function renderComment(comment) {
  const commentLi = document.createElement('li')
  const commentP = document.createElement('p')
  commentLi.className = 'comment-li'
  commentP.className = 'comment-p'
  commentP.innerText = comment.content
  commentLi.append(commentP)
  commentUl.append(commentLi)
}

// Toggles between image and comments on popup2
function toggleComments() {
  windowPic.parentNode.querySelector('.comment-window').classList.toggle("visible")
  commentUl.innerHTML = ""
  getPhotoById(state.currentPichaId).then(json => {
    json.comments.forEach(comment => renderComment(comment))
  })
}

// Renders the photo's tags on popup2
function renderTags(id) {
  state.pichas.find(pic => pic.id === id).tags
    .forEach(tag => {
      const tagBtn = document.createElement('button')
      const tagSpan = document.createElement('span')
      tagBtn.className = 'tag-button'
      tagSpan.innerText = tag.description
      // Filters the images on clicking tag
      tagBtn.addEventListener('click', event => {
        event.preventDefault()
        cardHold.innerHTML = ''
        renderPhotos(filtered(tag.description))
        togglePopup2()
      })
      tagBtn.append(tagSpan)
      tagsContainer.append(tagBtn)
    })
}

// Renders all existing photos
function renderPhotos(photos) {
  photos.forEach(photo => renderPhoto(photo))
}

// Updates page with new data
function updatePage() {
  cardHold.innerHTML = ''
  renderPhotos(state.pichas)
}

// Creates 5 tags to photo passed in
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

// Filters photos by tag
function filtered(value) {
  return state.pichas.filter(photo => {
    return !!photo.tags.find(tag => {
      return tag.description.toLowerCase() === value.toLowerCase()
    })
  })
}

// Hides duplicate tags
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

// Deletes photo from API, closes popup and updates page
function removePhoto(id) {
  if (confirm('Are you sure you want to delete this Picha?')) {
    deletePhoto(id)
    deletePhotoFromState(id)
    hideComments()
    updatePage()
    togglePopup2()
  };
};

// Deletes photo from state
function deletePhotoFromState(id) {
  const toDelete = state.pichas.find(picha => picha.id === id)
  const deleteIndex = state.pichas.indexOf(toDelete)
  state.pichas.splice(deleteIndex, 1)
}

// Hides comments - displays image on popup2
function hideComments() {
  if (windowPic.parentNode.querySelector('.comment-window').classList.value.includes('visible')) {
    toggleComments()
  }
}

// Opens/closes popup1
function togglePopup1() {
  popup1.classList.toggle('visible')
}

// Opens/closes popup2
function togglePopup2() {
  popup2.classList.toggle('visible')
}

// Sorts unique tags alphabetically
function sortUniqTags() {
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
}

// Shows comments on clicking image in popup2
windowPic.addEventListener('click', toggleComments)

// Hides comments on clicking 'back' button
document.querySelector('.close-comment-window').addEventListener('click', toggleComments)


// Adds a new comment
commentForm.addEventListener('submit', event => {
  event.preventDefault()
  const newComment = {
    picha_id: state.currentPichaId,
    content: document.querySelector('#comment-content').value
  }
  saveComment(newComment)
  renderComment(newComment)
  commentForm.reset()
})

// Closes popup2 and hides comments
document.querySelector('.close2').addEventListener('click', () => {
  hideComments()
  togglePopup2()
})

// Opens new image form on clicking logo
document.querySelector('.logo-anchor').addEventListener('click', () => {
  togglePopup1()
})

// Closes popup1
document.querySelector('.close').addEventListener('click', () => {
  togglePopup1()
})

// Deletes photo
document.querySelector('.delete-image').addEventListener('click', (event) => {
  event.preventDefault()
  removePhoto(state.currentPichaId)
});

// Closes popups on pressing esc
window.addEventListener('keyup', event => {
  if (event.which === 27 && popup2.classList.contains('visible')) {
    hideComments()
    togglePopup2()
  } else if (event.which === 27 && popup1.classList.contains('visible')) {
    togglePopup1()
  }
})

// Makes popup1 div an exception to close on click
document.querySelector('.popup').addEventListener('click', event => {
  event.stopPropagation()
})

// Clicking anywhere closes popup1
popup1.addEventListener('click', (event) => {
  togglePopup1()
})

// Makes popup2 div an exception to close on click
document.querySelector('.popup2').addEventListener('click', event => {
  event.stopPropagation()
})

// Clicking anywhere closes popup2
popup2.addEventListener('click', (event) => {
  hideComments()
  togglePopup2()
})

// Listener for creating uploading new photo
photoForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const newPhoto = {
    title: document.querySelector('#title').value,
    url: document.querySelector('#url').value
  }
  savePicha(newPhoto).then(photo => {
    state.pichas.push(photo)
    createTags(photo)
    updatePage()
  })
  photoForm.reset()
  togglePopup1()
})

// renders all tags
document.querySelector('#tag-tab').addEventListener('click', event => {
  event.preventDefault()
  cardHold.innerHTML = ''
  sortUniqTags()
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

// renders home page showing all pics
document.querySelector('#home-tab').addEventListener('click', event => {
  event.preventDefault()
  updatePage()
})

// filters images by search input
searchForm.addEventListener('submit', event => {
  event.preventDefault()
  const searchInput = document.querySelector('#search-item')
  if (filtered(searchInput.value).length > 0) {
    cardHold.innerHTML = ''
    renderPhotos(filtered(searchInput.value))
  } else {
    cardHold.innerText = "No Images Found"
  }
  searchForm.reset()
})