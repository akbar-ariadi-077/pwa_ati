const apiKey = `41fc5134221e4df4aface232cd2d9c9d`;
const defaultSource = 'techradar';
const sourceSelector = document.querySelector('#sources');
const newsArticles = document.querySelector('main');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js')
      .then(registration => console.log('Service Worker registered'))
      .catch(err => 'SW registration failed'));
}

window.addEventListener('load', e => {
  sourceSelector.addEventListener('change', evt => updateNews(evt.target.value));
  updateNewsSources().then(() => {
    sourceSelector.value = defaultSource;
	console.log(sourceSelector.value);
    updateNews();
  });
});

window.addEventListener('online', () => updateNews(sourceSelector.value));

async function updateNewsSources() {
  const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
  const json = await response.json();
  sourceSelector.innerHTML =
    json.sources.map(source => `<option value="${source.id}">${source.name}</option>`).join('\n');
}

async function updateNews(source = defaultSource) {
  newsArticles.innerHTML = '';
  const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`);
  const json = await response.json();
  newsArticles.innerHTML =
    json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
	if(article.urlToImage!=null)
	{	return `<div class="article">
				  <a href="${article.url}">
					<h3>${article.title}</h3>				
					<img src="${article.urlToImage}" alt="${article.title}">					
					<p>${article.description}</p>
				  </a>
				</div>
			  `;		
	}
}