const baseURL = 'http://localhost:3000'

function getLabels(url) {
  fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
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

function savePicha() {
  return fetch(baseURL + '/pichas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPhoto)
    })
    .then(resp => resp.json())
}

function saveTag() {
  fetch(baseURL + '/tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({

    })
  })
}

function saveComment() {
  fetch(baseURL + '/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({

    })
  })
}