var form = document.getElementById('shorten-form');
var urlBox = form.elements[0];
var link = document.getElementById('link');
var shortenedBox = document.getElementById('shortened');

function displayShortenedUrl (response) {
  link.textContent = response.data.shortUrl;
  link.setAttribute(
    'href', response.data.shortUrl
  );
  shortenedBox.style.opacity = '1';
  urlBox.value = '';
}

function alertError(err) {
  alert('Are you sure the URL is correct? Make sure it has http:// at the beginning');
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  axios.post('/new', { url: urlBox.value })
  .then(displayShortenedUrl)
  .catch(alertError);
});

