const linksContainer = document.getElementById('links-container');
const form = document.querySelector('form');
const nameInput = document.getElementById('name');
const urlInput = document.getElementById('url');
const iconButton = document.getElementById('get-icon');
const descriptionInput = document.getElementById('description');

let links = [];

function saveLinks() {
	localStorage.setItem('links', JSON.stringify(links));
}

function displayLinks() {
	linksContainer.innerHTML = '';
	links.forEach((link, index) => {
		const linkDiv = document.createElement('div');
		linkDiv.classList.add('link');
		const linkA = document.createElement('a');
		linkA.href = link.url;
		const linkImg = document.createElement('img');
		linkImg.src = link.icon;
		linkA.appendChild(linkImg);
		linkA.innerHTML += link.name;
		const linkDesc = document.createElement('p');
		linkDesc.innerHTML = link.description;
		const trashButton = document.createElement('button');
		trashButton.innerHTML = '&#128465;';
		trashButton.addEventListener('click', () => {
			links.splice(index, 1);
			saveLinks();
			displayLinks();
		});
		linkDiv.appendChild(linkA);
		linkDiv.appendChild(linkDesc);
		linkDiv.appendChild(trashButton);
		linksContainer.appendChild(linkDiv);
	});
}

iconButton.addEventListener('click', () => {
	const url = urlInput.value;
	if (url.trim()) {
		const iconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${url}`;
		iconButton.innerHTML = `<img src="${iconUrl}">`;
	}
});

form.addEventListener('submit', event => {
	event.preventDefault();
	const name = nameInput.value;
	const url = urlInput.value;
	const icon = iconButton.querySelector('img').src;
	const description = descriptionInput.value;
	if (name.trim() && url.trim() && icon.trim() && description.trim()) {
		links.push({ name, url, icon, description });
		saveLinks();
		nameInput.value = '';
		urlInput.value = '';
		iconButton.innerHTML = 'Get Icon';
		descriptionInput.value = '';
		displayLinks();
	}
});

function init() {
	const storedLinks = localStorage.getItem('links');
	if (storedLinks) {
		links = JSON.parse(storedLinks);
		displayLinks();
	}
}

const expandButton = document.getElementById('expand-button');
const expandDiv = document.getElementById('expand-div');
const closeButton = document.getElementById('close-button');

expandButton.addEventListener('click', () => {
  if (expandDiv.style.display === 'block') {
    expandDiv.style.display = 'none';
  } else {
    expandDiv.style.display = 'block';
    expandDiv.style.height = expandDiv.scrollHeight + 'px';
  }
});

closeButton.addEventListener('click', () => {
  expandDiv.style.display = 'none';
});


init();
