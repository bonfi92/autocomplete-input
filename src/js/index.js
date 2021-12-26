const autocompleteContainer = document.querySelector('.autocomplete');
const autocompleteInput = autocompleteContainer.querySelector("#search-input");
const autocompleteButton = autocompleteContainer.querySelector(".autocomplete__button");
const message = document.querySelector('.message');
const autocompleteForm = autocompleteContainer.querySelector('.autocomplete__form');
const getColorApi = 'http://localhost:3001/colors';
let colors = [];
let autocompleteRef;


// 2 - Listen for form submit event to change background color
autocompleteForm.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
	e.preventDefault();
	const color = colors.filter(function (obj) {
		return obj.name.toLowerCase() === autocompleteInput.value.toLowerCase();
	})[0];

	if (color) {
		message.innerHTML = color.name + ', ' + color.id;
		// Set selected color to body with a gradient
		document.querySelector('body').style.background = 'linear-gradient(110deg,' + color.id + ', lightcyan)';
	} else {
		message.innerHTML = 'No color found';
	}
}

function loading(isLoading) {
	if (isLoading) {
		autocompleteContainer.classList.add('loading');
	} else {
		autocompleteContainer.classList.remove('loading');
	}
	autocompleteInput.disabled = isLoading;
	autocompleteButton.disabled = isLoading;
}

function fetchColors() {
	// If there is an autocomplete already instantiated, destroy it
	if (autocompleteRef) {
		autocompleteRef.destroy();
	}

	loading(true);

	fetch(getColorApi)
		.then(res => {
			if (res.ok) {
				return res.json();
			}
		})
		.then(res => {
			colors = res;
			const mappedColors = res.map(obj => obj.name);
			// Create an instance of autocomplete
			autocompleteRef = new Autocomplete(autocompleteInput, mappedColors);
		})
		.catch(() => {
			alert('Network Error');
		})
		.finally(() => {
			loading(false);
		})
}

fetchColors();
