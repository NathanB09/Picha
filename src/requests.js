const apiKey = ''

function getLabelObject(url) {
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