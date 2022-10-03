const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const count = 1;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod/?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page) {
	currentArray = page === 'results' ? resultsArray : Object.values(favorites);
	currentArray.forEach((result) => {
		// Card container
		const card = document.createElement('div');
		card.classList.add('card');
		// Link
		const link = document.createElement('a');
		link.href = result.hdurl;
		link.title = 'View Full Image';
		link.target = '_blank';
		// Image
		const image = document.createElement('img');
		image.src = result.url;
		image.alt = 'NASA Picture of the Day';
		image.loading = 'lazy';
		image.classList.add('card-img-top');
		// Cart Body
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');
		// Card Title
		const title = document.createElement('h5');
		title.classList.add('card-title');
		title.textContent = result.title;
		// Save Text
		const saveText = document.createElement('p');
		saveText.classList.add('clickable');
		saveText.textContent = 'Add to Favorites';
		saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
		// Text
		const text = document.createElement('p');
		text.classList.add('card-text');
		text.textContent = result.explanation;
		// Copyright Info
		const footer = document.createElement('small');
		footer.classList.add('text-muted');
		// Date
		const date = document.createElement('strong');
		date.textContent = result.date;
		// Copyright
		const copyrightResult =
			result.copyright === undefined ? '' : result.copyright;
		const copyright = document.createElement('span');
		copyright.textContent = `${copyrightResult}`;
		// Append
		footer.append(date, copyright);
		cardBody.append(title, saveText, text, footer);
		link.appendChild(image);
		card.append(link, cardBody);
		imagesContainer.appendChild(card);
	});
}

function updateDOM(page) {
	// Get Favorites form localStorage
	if (localStorage.getItem('nasaFavorites')) {
		favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
	}
	createDOMNodes(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
	try {
		const response = await fetch(apiUrl);
		resultsArray = await response.json();
		updateDOM();
	} catch (err) {
		console.log(err);
	}
}

// Add result to Favorites
function saveFavorite(itemUrl) {
	// Loop through Results Array to select Favorite
	resultsArray.forEach((item) => {
		if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
			favorites[itemUrl] = item;
			// Show Save Confirmation for 2 Seconds
			saveConfirmed.hidden = false;
			setTimeout(() => {
				saveConfirmed.hidden = true;
			}, 2000);
		}
	});
	// Set Favorite in localStorage
	localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
}

// On Load
getNasaPictures();
