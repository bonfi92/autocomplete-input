(function () {
	function Autocomplete(inp, arr) {
		if (!(inp instanceof Element || inp.tagName !== 'INPUT' || inp.type !== 'text')) {
			throw new Error('No input text element passed in');
		}

		if (!(arr instanceof Array)) {
			throw new Error('You have to pass an array as second argument');
		}

		const listClass = 'autocomplete__list';
		const itemClass = 'item';
		const itemActiveClass = 'item--active';
		let inputParent = inp.parentElement;
		let itemFocused;
		this.inputEl = inp;
		this.handleInputEvent = function (e) {
			// First remove any opens list
			closeAllLists();

			// If no character inserted exit
			if (!this.value) {
				return;
			}

			// Create the list that will contain all suggested values based on input value
			const list = document.createElement('ul');
			list.classList.add(listClass);
			inputParent.appendChild(list);

			// Create regular expression to check values in array
			const regExp = new RegExp('^(' + this.value + ')(.*)$', 'i');

			for (let i = 0; i < arr.length; i++) {
				const regExpRes = arr[i].match(regExp);
				if (regExpRes) {
					// regExpRes[0] --> full match (complete string)
					// regExpRes[1] --> capturing group 1 (string equal to value in input)
					// regExpRes[2] --> capturing group 2 (rest of the string)
					const string = '<strong>' + regExpRes[1] + '</strong>' + regExpRes[2];
					const item = document.createElement('li');
					item.classList.add(itemClass);
					item.innerHTML = string;
					item.innerHTML += '<input type="hidden" value="' + arr[i] + '"/>';
					item.addEventListener('click', handleItemClick);
					list.appendChild(item);
				}
			}
		}
		this.handleKeyDownEvent = function (e) {
			const itemsList = getItemsList();

			switch (e.key) {
				case 'ArrowDown':
					if (itemsList) {
						itemFocused++;
						setActiveItem(itemsList);
					}
					break;
				case 'ArrowUp':
					if (itemsList) {
						itemFocused--;
						setActiveItem(itemsList);
					}
					break;
				case 'Enter':
					// Prevent the form to be submitted
					// Emulate the click event on current item
					if (itemFocused > -1) {
						e.preventDefault();
						itemsList[itemFocused].click();
					}
					break;
				default:
					break;
			}
		}

		this.inputEl.addEventListener('input', this.handleInputEvent);
		this.inputEl.addEventListener('keydown', this.handleKeyDownEvent);

		function setActiveItem(itemsList) {
			// If no items in the exit
			if (!itemsList) {
				return;
			}

			// Remove active class from items
			removeActiveItems(itemsList);

			// Check when selection reaches the end or the start of the list
			if (itemFocused < 0) {
				itemFocused = itemsList.length - 1;
			} else if (itemFocused >= itemsList.length) {
				itemFocused = 0;
			}

			itemsList[itemFocused].classList.add(itemActiveClass);
		}

		function removeActiveItems(itemsList) {
			for (let i = 0; i < itemsList.length; i++) {
				itemsList[i].classList.remove(itemActiveClass);
			}
		}

		function getItemsList() {
			let ret = null;
			const itemsContainer = inputParent.querySelector('.' + listClass);
			if (itemsContainer) {
				const itemsList = itemsContainer.getElementsByClassName(itemClass);
				if (itemsList.length) {
					ret = itemsList;
				}
			}
			return ret;
		}

		function handleItemClick(e) {
			inp.value = this.querySelector('input').value;
			inp.focus();
			closeAllLists();
		}

		function closeAllLists() {
			// Remove all lists
			const allLists = inputParent.getElementsByClassName(listClass);
			for (let i = 0; i < allLists.length; i++) {
				allLists[i].parentNode.removeChild(allLists[i]);
			}

			// Reset focused element
			itemFocused = -1;
		}
	}

	Autocomplete.prototype.destroy = function () {
		this.inputEl.removeEventListener('input', this.handleInputEvent);
		this.inputEl.removeEventListener('keydown', this.handleKeyDownEvent);
	};

	window.Autocomplete = Autocomplete;
})();
