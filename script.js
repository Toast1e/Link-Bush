const categoriesContainer = document.getElementById('categories-container');
const expandButton = document.getElementById('expand-button');
const expandDiv = document.getElementById('expand-div');
const closeButton = document.getElementById('close');
const categoryNameInput = document.getElementById('category-name');
const categoryDropdown = document.getElementById('category-dropdown');

let categories = [];

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function displayCategories() {
  categoriesContainer.innerHTML = '';
  categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category.name;

    // Add image for category expansion
    const expandImage = document.createElement('img');
    expandImage.classList.add('expand-image');
    expandImage.src = category.expanded ? 'images/image1.png' : 'images/image2.png';
    categoryTitle.appendChild(expandImage);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '*del';
    categoryTitle.appendChild(deleteButton);

    const categoryLinksDiv = document.createElement('div');
    categoryLinksDiv.classList.add('category-links');
    if (category.expanded) {
      categoryLinksDiv.style.display = 'block';
      deleteButton.style.display = 'block'; // Show delete button when category is expanded
    } else {
      categoryLinksDiv.style.display = 'none';
      deleteButton.style.display = 'none'; // Hide delete button when category is not expanded
    }
    category.links.forEach((link, index) => {
      const linkDiv = document.createElement('div');
      linkDiv.classList.add('link');
      const linkA = document.createElement('a');
      linkA.href = link.url;
      linkA.target = '_blank'; // Added target attribute
      const linkImg = document.createElement('img');
      linkImg.src = `https://www.google.com/s2/favicons?domain=${link.url}`;
      linkA.appendChild(linkImg);
      linkA.innerHTML += link.name;
      const linkDesc = document.createElement('p');
      linkDesc.innerHTML = link.description;
      const trashButton = document.createElement('button');
      trashButton.innerHTML = '&#128465;';
      trashButton.addEventListener('click', () => {
        category.links.splice(index, 1);
        saveCategories();
        displayCategories();
      });
      linkDiv.appendChild(linkA);
      linkDiv.appendChild(linkDesc);
      linkDiv.appendChild(trashButton);
      categoryLinksDiv.appendChild(linkDiv);
    });
    categoryDiv.appendChild(categoryTitle);
    categoryDiv.appendChild(categoryLinksDiv);
    categoryTitle.addEventListener('click', () => {
      category.expanded = !category.expanded;
      saveCategories();
      displayCategories();
    });

    // Delete category button event listener
    deleteButton.addEventListener('click', () => {
      const categoryIndex = categories.indexOf(category);
      if (categoryIndex !== -1) {
        categories.splice(categoryIndex, 1);
        saveCategories();
        displayCategories();
      }
    });

    categoriesContainer.appendChild(categoryDiv);
  });
}

expandDiv.style.display = 'none';

expandButton.addEventListener('click', () => {
  if (expandDiv.style.display === 'block') {
    expandDiv.style.display = 'none';
  } else {
    expandDiv.style.display = 'block';
  }
});

closeButton.addEventListener('click', () => {
  expandDiv.style.display = 'none';
});

function addLinkToCategory(category, link) {
  category.links.push(link);
  saveCategories();
  displayCategories();
}

function init() {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    categories = JSON.parse(storedCategories);
    displayCategories();
  }
}

const form = document.querySelector('form');
const nameInput = document.getElementById('name');
const urlInput = document.getElementById('url');
const iconButton = document.getElementById('get-icon');
const descriptionInput = document.getElementById('description');
const deleteCategoryButton = document.getElementById('delete-category');

iconButton.addEventListener('click', () => {
	const url = urlInput.value.trim();
	if (url) {
	  const linkImg = document.createElement('img');
	  linkImg.src = `https://www.google.com/s2/favicons?domain=${url}&s=32`; // Specify a larger size (64x64)
	  linkImg.style.height = '32px'; // Set the height to match the specified size
	  linkImg.style.marginRight = '10px'; // Set the right margin
	  iconButton.innerHTML = '';
	  iconButton.appendChild(linkImg);
	}
  });
  

form.addEventListener('submit', event => {
  event.preventDefault();
  const categoryName = categoryNameInput.value;
  const name = nameInput.value;
  const url = urlInput.value;
  const icon = iconButton.querySelector('img').src;
  const description = descriptionInput.value;
  if (
    categoryName.trim() &&
    name.trim() &&
    url.trim() &&
    icon.trim() &&
    description.trim()
  ) {
    let category = categories.find(cat => cat.name === categoryName);
    if (!category) {
      category = { name: categoryName, links: [], expanded: true };
      categories.push(category);
      populateCategoryDropdown();
    }
    const link = { name, url, icon, description };
    addLinkToCategory(category, link);
    nameInput.value = '';
    urlInput.value = '';
    iconButton.innerHTML = 'Get Icon';
    descriptionInput.value = '';
  }
});

init();
