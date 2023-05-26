const categoriesContainer = document.getElementById('categories-container');
const expandButton = document.getElementById('expand-button');
const expandDiv = document.getElementById('expand-div');
const settingButton = document.getElementById('setting-button');
const settingDiv = document.getElementById('expand-setting-div');
const closeSettingButton = document.getElementById('setting-close');
const closeButton = document.getElementById('close');
const categoryNameInput = document.getElementById('category-name');
const categoryDropdown = document.getElementById('category-dropdown');

let categories = [];

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function populateCategoryDropdown() {
  categoryDropdown.innerHTML = ''; // Clear existing options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    categoryDropdown.appendChild(option);
  });
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
    deleteButton.innerHTML = '<img src="images/local_fire_department_FILL0_wght400_GRAD0_opsz48.png" alt="Delete" title="Delete Category">';
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
      trashButton.classList.add('delete-button');
      trashButton.innerHTML = '<img src="images/delete_FILL0_wght400_GRAD0_opsz48 (1).png" alt="Delete" title="Delete Card">';
      trashButton.addEventListener('click', () => {
        showDeleteConfirmation(category, index); // Show delete confirmation popup
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
      showDeleteConfirmation(category); // Show delete confirmation popup
    });

    categoriesContainer.appendChild(categoryDiv);
  });

  populateCategoryDropdown(); // Populate the category dropdown
}

function showDeleteConfirmation(category, linkIndex = null) {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.style.zIndex = '9999'; // Set a high z-index value to appear above other elements

  const message = document.createElement('p');
  message.textContent = 'Are you sure you want to delete this category?';
  popup.appendChild(message);

  const yesButton = document.createElement('button');
  yesButton.classList.add('yesButton');
  yesButton.textContent = 'Yes';
  yesButton.addEventListener('click', () => {
    deleteCategory(category, linkIndex);
    popup.remove();
  });
  popup.appendChild(yesButton);

  const noButton = document.createElement('button');
  noButton.classList.add('noButton');
  noButton.textContent = 'No';
  noButton.addEventListener('click', () => {
    popup.remove();
  });
  popup.appendChild(noButton);

  document.body.appendChild(popup);

  // Center the popup vertically and horizontally
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
}

function deleteCategory(category, linkIndex = null) {
  if (linkIndex !== null) {
    category.links.splice(linkIndex, 1);
  } else {
    const categoryIndex = categories.indexOf(category);
    if (categoryIndex !== -1) {
      categories.splice(categoryIndex, 1);
    }
  }
  saveCategories();
  displayCategories();
}

// Div holding Add Link container
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

//Div holding Setting container
settingDiv.style.display = 'none';

settingButton.addEventListener('click', () => {
  if (settingDiv.style.display === 'block') {
    settingDiv.style.display = 'none';
  } else {
    settingDiv.style.display = 'block';
  }
});

closeSettingButton.addEventListener('click', () => {
  settingDiv.style.display = 'none';
});

function addLinkToCategory(category, link) {
  category.links.push(link);
  saveCategories();
  displayCategories();
}

function downloadLocalStorage() {
  const localStorageData = JSON.stringify(localStorage);
  const blob = new Blob([localStorageData], { type: 'application/json' });

  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'local_storage_data.json';
  downloadLink.click();
}

function uploadLocalStorage() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const localStorageData = e.target.result;
      const parsedData = JSON.parse(localStorageData);

      for (const key in parsedData) {
        localStorage.setItem(key, parsedData[key]);
      }

      alert('Local storage data uploaded successfully!');
      location.reload(); // Refresh the page
    };

    reader.readAsText(file);
  }
}




function init() {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    categories = JSON.parse(storedCategories);
    displayCategories();
    populateCategoryDropdown(); // Populate the category dropdown

    // Add event listener to category dropdown
    categoryDropdown.addEventListener('change', () => {
      categoryNameInput.value = categoryDropdown.value;
    });
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
    linkImg.src = `https://www.google.com/s2/favicons?sz=64&domain=${url}`;
    // linkImg.src = `https://www.google.com/s2/favicons?sz=${faviconSize}&domain=${url}`;
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

// Function to handle the image upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    // Set the image as the background of the website
    document.body.style.backgroundImage = `url(${e.target.result})`;
    document.body.style.backgroundAttachment = 'fixed'; // Prevent scrolling of the background image
    document.body.style.backgroundSize = 'cover'; // Maintain aspect ratio

    // Display the uploaded image in the image-preview element
    const imagePreview = document.getElementById('image-preview');
    imagePreview.src = e.target.result;

    // Save the image to local storage
    localStorage.setItem('backgroundImage', e.target.result);
  };

  reader.readAsDataURL(file);
}

// Event listener for image upload button
const imageUpload = document.getElementById('image-upload');
imageUpload.addEventListener('change', handleImageUpload);

// Check if a background image exists in local storage
const savedBackgroundImage = localStorage.getItem('backgroundImage');
if (savedBackgroundImage) {
  // Set the saved image as the background of the website
  document.body.style.backgroundImage = `url(${savedBackgroundImage})`;
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.backgroundSize = 'cover';

  // Display the saved image in the image-preview element
  const imagePreview = document.getElementById('image-preview');
  imagePreview.src = savedBackgroundImage;
}

// Get all the theme buttons
const themeButtons = document.querySelectorAll('.circle');
// Get the dark mode checkbox element
const darkModeCheckbox = document.getElementById('darkModeCheckbox');

// Attach click event listeners to each theme button
themeButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    applyTheme(index + 1);
  });
});

// Add event listener to the dark mode checkbox
darkModeCheckbox.addEventListener('change', () => {
  toggleDarkMode();
});

function applyTheme(themeNumber) {
  const body = document.body;
  const currentTheme = getSelectedTheme(body);

  // Check if the selected theme is different from the current theme
  if (themeNumber !== currentTheme) {
    // Remove the current theme class from the body element
    if (currentTheme !== -1) {
      body.classList.remove(`theme-${currentTheme}`);
    }
    // Add the selected theme class to the body element
    body.classList.add(`theme-${themeNumber}`);
    // Save the selected theme in local storage
    saveTheme(themeNumber);
  }
}

function getSelectedTheme(body) {
  // Extract the current theme number from the body class
  const classes = body.classList;
  for (let i = 1; i <= themeButtons.length; i++) {
    if (classes.contains(`theme-${i}`)) {
      return i;
    }
  }
  return -1; // Return -1 if no theme is selected
}

function saveTheme(themeNumber) {
  // Save the selected theme in local storage
  localStorage.setItem('selectedTheme', themeNumber);
}

function toggleDarkMode() {
  const body = document.body;
  const darkModeTheme = 'theme-dark';
  const lightModeTheme = 'theme-light';

  if (darkModeCheckbox.checked) {
    // Remove light mode theme and apply dark mode theme
    body.classList.remove(lightModeTheme);
    body.classList.add(darkModeTheme);
    // Save the selected theme in local storage
    saveTheme(darkModeTheme);
  } else {
    // Remove dark mode theme and apply light mode theme
    body.classList.remove(darkModeTheme);
    body.classList.add(lightModeTheme);
    // Save the selected theme in local storage
    saveTheme(lightModeTheme);
  }
}

// On page load, check if a theme is stored in local storage and apply it
document.addEventListener('DOMContentLoaded', () => {
  const selectedTheme = localStorage.getItem('selectedTheme');
  if (selectedTheme) {
    // If the selected theme is dark mode, check the checkbox
    if (selectedTheme === 'theme-dark') {
      darkModeCheckbox.checked = true;
    }
    applyTheme(selectedTheme);
  }
});



init();
