const autocompleteContainer = document.querySelector('.autocomplete');
const autocompleteInput = autocompleteContainer.querySelector("#search-input");
const autocompleteButton = autocompleteContainer.querySelector(".autocomplete__button");
const message = document.querySelector('.message');
const autocompleteForm = autocompleteContainer.querySelector('.autocomplete__form');
const getColorApi = 'http://localhost:3001/colors';
let colors = [];
let autocompleteRef;

// 1 - Call the API to get data of input autocomplete
// Create a new XMLHttpRequest object

const xhr = new XMLHttpRequest();

// Call API
fetchColors();

// Set event handlers
xhr.onload = onLoad;
xhr.onerror = onError;

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

// On response received
function onLoad() {
	colors = JSON.parse(this.response);
	const mappedColors = colors.map(function (obj) {
		return obj.name;
	});
	// Create an instance of autocomplete
	autocompleteRef = new Autocomplete(autocompleteInput, mappedColors);
	loading(false);
}

// Only triggers if the request couldn't be made at all
function onError() {
	alert('Network Error');
	loading(false);
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
	// Set loading to true
	loading(true);

	// If there is an autocomplete already instantiated, destroy it
	if (autocompleteRef) {
		autocompleteRef.destroy();
	}

	// Configure the call
	xhr.open('GET', getColorApi);

	// Send the request
	xhr.send();
}
