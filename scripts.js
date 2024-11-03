import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import './previewWC.js' //import the  previewWC component

let currentPage = 1;
let filteredBooks = books;

/**
 * Initializes the book previews, genre and author dropdowns, and theme settings.
 */
function initializeUserInterface() {
    displayBookPreviews(filteredBooks.slice(0, BOOKS_PER_PAGE));
    initialiseDropdown('data-search-genres', genres, 'All Genres');
    initialiseDropdown('data-search-authors', authors, 'All Authors');
    setTheme();
    updateShowMoreButton();
}

/**
 * Creates book preview buttons and appends them to the DOM.
 * @param {Array} booksToShow - List of books to display.
 */

// changed the display BookPreviews function to accept an array of books
function displayBookPreviews(booksToShow) {
    const fragment = document.createDocumentFragment();
    booksToShow.forEach(({ author, id, image, title}) => {
        const bookPreview = document.createElement('book-preview');
        bookPreview.setAttribute('id', id);
        bookPreview.setAttribute('title', title);
        bookPreview.setAttribute( 'author', authors[author]);
        bookPreview.setAttribute('image', image);
        fragment.appendChild(bookPreview);    
    });
    document.querySelector('[data-list-items]').appendChild(fragment);
}

/**
 * Creates a button element for a book preview.
 * @param {Object} book - The book details.
 * @returns {HTMLElement} - The preview button element.
 */
function createBookPreviewButton({ author, id, image, title }) {
    const previewButton = document.createElement('button');
    previewButton.classList.add('preview');
    previewButton.dataset.preview = id;
    previewButton.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;
    return previewButton;
}

/**
 * initiate a dropdown menu with options.
 * @param {string} dropdownDataAttribute - The data attribute for the dropdown element.
 * @param {Object} options - The options to populate the dropdown with.
 * @param {string} defaultText - The default option text.
 */
function initialiseDropdown(dropdownDataAttribute, options, defaultText) {
    const dropdown = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = 'any';
    defaultOption.innerText = defaultText;
    dropdown.appendChild(defaultOption);

    Object.entries(options).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.innerText = name;
        dropdown.appendChild(option);
    });

    document.querySelector(`[${dropdownDataAttribute}]`).appendChild(dropdown);
}

/**
 * Sets theme based on user preferences.
 */
function setTheme() {
    const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
    applyTheme(theme);
}

/**
 * Apply the selected theme
 * @parameters {string} theme - The selected theme ('day' or 'night').
 */
function applyTheme(theme) {
    document.querySelector('[data-settings-theme]').value = theme;
    const darkColor = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
    const lightColor = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
    document.documentElement.style.setProperty('--color-dark', darkColor);
    document.documentElement.style.setProperty('--color-light', lightColor);
}

/**
 * Updates the show more button
 */
function updateShowMoreButton() {
    const button = document.querySelector('[data-list-button]');
    button.disabled = filteredBooks.length <= currentPage * BOOKS_PER_PAGE;
    button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${Math.max(0, filteredBooks.length - currentPage * BOOKS_PER_PAGE)})</span>
    `;
}

/**
 * Handles form submission for the search filters.
 * Filters books based on search
 * @parameters {Event} event - The form submit event.
 */
function handleSearchForBooks(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);

    filteredBooks = books.filter(book => filterBook(book, filters));
    currentPage = 1;

    document.querySelector('[data-list-items]').innerHTML = '';
    displayBookPreviews(filteredBooks.slice(0, BOOKS_PER_PAGE));
    updateShowMoreButton();
    document.querySelector('[data-list-message]').classList.toggle('list__message_show', filteredBooks.length === 0);
    document.querySelector('[data-search-overlay]').open = false;
}

/**
 * Filters a book based on the selected criteria.
 * @param {Object} book - The book to filter.
 * @param {Object} filters - The filter criteria.
 * @returns {boolean} - True if the book matches the filters; otherwise false.
 */
function filterBook(book, filters) {
    const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch = filters.author === 'any' || book.author === filters.author;
    const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);

    return titleMatch && authorMatch && genreMatch;
}

/**
 * Loads additional books 
 */
function loadMoreBooks() {
    const start = currentPage * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    displayBookPreviews(filteredBooks.slice(start, end));
    currentPage++;
    updateShowMoreButton();
}

/**
 * Initializes event listeners 
 */
function initializeEventListeners() {
    document.querySelector('[data-search-form]').addEventListener('submit', handleSearchForBooks);
    document.querySelector('[data-list-button]').addEventListener('click', loadMoreBooks);
    document.querySelector('[data-settings-form]').addEventListener('submit', event => {
        event.preventDefault();
        const theme = new FormData(event.target).get('theme');
        applyTheme(theme);
        document.querySelector('[data-settings-overlay]').open = false;
    });

    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = false;
    });

    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = false;
    });

    document.querySelector('[data-header-search]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = true;
        document.querySelector('[data-search-title]').focus();
    });

    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = true;
    });

    document.querySelector('[data-list-close]').addEventListener('click', () => {
        document.querySelector('[data-list-active]').open = false;
    });

    document.querySelector('[data-list-items]').addEventListener('click', displayBookDetails);
}

/**
 * Displays details of a selected book.
 * @param {Event} event - The click event.
 */
function displayBookDetails(event) {
    const previewId = event.target.closest('[data-preview]')?.dataset.preview;
    const selectedBook = books.find(book => book.id === previewId);
    if (selectedBook) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = selectedBook.image;
        document.querySelector('[data-list-image]').src = selectedBook.image;
        document.querySelector('[data-list-title]').innerText = selectedBook.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[selectedBook.author]} (${new Date(selectedBook.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = selectedBook.description;
    }
}

// Initialize the UI and event listeners on page load
initializeUserInterface();
initializeEventListeners();
