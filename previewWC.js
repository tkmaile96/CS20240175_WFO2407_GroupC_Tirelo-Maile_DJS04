class BookPreview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open'});
    }

    connectedCallback() {
        this.render()
    }

    // observed attributes
    static get observedAttributes() {
        return [ 'title', 'author', 'image'];
    }
    
    attributeChangedCallback() {
        this.render()
    }

    /**
     * render the html structures of the book preview.
     */
    render() {
        const title = this.getAttribute('title');
        const author = this.getAttribute('author');
        const image = this.getAttribute('image') || "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348471955i/120009.jpg";

        this.shadowRoot.innerHTML = `
        <style>
            .preview {
                display: flex;
                cursor: pointer;
            }
            .preview__image {
                width: 50px;
                height: 75px;
                margin-right: 10px;
            }
            .preview__info {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .preview__title {
                font-size: 1em;
                font-weight: bold;
            }
            .preview__author {
                font-size: 0.8em;
                color: grey;
            }
        </style>
        <button class="preview" data-preview="${this.getAttribute('id')}">
        <img class="preview__image" src="${image}" alt="Book cover" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${author}</div>
        </div>
    </button>    
    }`;
}