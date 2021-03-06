const baseURL = 'http://localhost:3000'

function getLabels(url) {
  return fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [{
          image: {
            source: {
              imageUri: url
            }
          },
          features: [{
            type: 'LABEL_DETECTION',
            maxResults: 5
          }]
        }]
      })
    })
    .then(resp => resp.json())
}

function getPhotos() {
  return fetch(baseURL + '/pichas')
    .then(resp => resp.json())
}

function savePicha(photo) {
  return fetch(baseURL + '/pichas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(photo)
    })
    .then(resp => resp.json())
}

function saveRelevance(tagId, photoId) {
  fetch(baseURL + '/relevances', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tag_id: tagId,
      picha_id: photoId
    })
  })
}

function saveTag(tag) {
  return fetch(baseURL + '/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: tag.description
      })
    })
    .then(resp => resp.json())
}

function saveComment(comment) {
  return fetch(baseURL + '/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    })
    .then(resp => resp.json())
}

function getPhotoById(id) {
  return fetch(baseURL + `/pichas/${id}`)
    .then(res => res.json())
}

function deletePhoto(id) {
  return fetch(baseURL + `/pichas/${id}`, {
    method: 'DELETE'
  });
}