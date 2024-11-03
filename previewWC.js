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
        
    }
}