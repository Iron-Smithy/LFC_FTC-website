// =========================
// Custom HTML Element: <image-carousel>
// =========================
// This component creates a fully encapsulated, customizable image carousel.
// It uses the Shadow DOM for isolated styles, supports loading images from a JSON file,
// and allows easy customization of colors, dimensions, and styling via attributes or CSS variables.
//
// Example Usage:
// <image-carousel 
//     src="images.json"
//     primary-color="red"
//     secondary-color="white"
//     text-color="lightgray"
//     background-color="#222"
//     width="700px"
//     height="350px">
// </image-carousel>

class ImageCarousel extends HTMLElement {
    // List of attributes we want to "watch" for changes
    // When one of these changes, attributeChangedCallback() will run
    static get observedAttributes() {
        return [
            'primary-color',     // Color for active/hover UI elements (like arrow hover)
            'secondary-color',   // Color for default UI elements (like arrows and text headings)
            'text-color',        // Color for descriptions
            'background-color',  // Background of the carousel
            'width',             // Max width of carousel
            'height'             // Fixed height (overrides aspect ratio)
        ];
    }

    constructor() {
        super(); // Always call super() first in a custom element constructor

        // Attach Shadow DOM so styles/HTML inside don't affect the rest of the page
        this.attachShadow({ mode: 'open' });

        // Stores image objects loaded from the JSON file
        this.imagesData = [];

        // Keeps track of the currently displayed image
        this.imageIndex = 0;
    }

    // Runs automatically when the element is inserted into the page
    connectedCallback() {
        // Read the 'src' attribute from the element (this is the JSON file path)
        const src = this.getAttribute('src');

        // If no 'src' provided, show error and stop
        if (!src) {
            console.error('No "src" attribute provided for <image-carousel>.');
            return;
        }

        // Fetch the JSON file with image data
        fetch(src)
            .then(res => res.json()) // Convert JSON into JS object/array
            .then(data => {
                this.imagesData = data; // Store the image data
                this.render();          // Build the HTML and CSS inside the Shadow DOM
                this.updateCarousel();  // Show the first image
            })
            .catch(err => console.error('Error loading carousel data:', err));
    }

    // Runs when one of our observed attributes changes
    attributeChangedCallback(name, oldValue, newValue) {
        // Ensure Shadow DOM exists before applying style updates
        if (this.shadowRoot) {
            const wrapper = this.shadowRoot.host.style;

            // Update CSS variables based on the changed attribute
            if (name === 'width') wrapper.setProperty('--carousel-width', newValue);
            if (name === 'height') wrapper.setProperty('--carousel-height', newValue);
            if (name === 'primary-color') wrapper.setProperty('--primary-color', newValue);
            if (name === 'secondary-color') wrapper.setProperty('--secondary-color', newValue);
            if (name === 'text-color') wrapper.setProperty('--text-color', newValue);
            if (name === 'background-color') wrapper.setProperty('--background-color', newValue);
        }
    }

    // Changes the current image by a given direction
    // dir = +1 → next image, dir = -1 → previous image
    changeImage(dir) {
        if (!this.imagesData.length) return; // Do nothing if images not loaded

        // Wraps index around using modulo so it loops infinitely
        this.imageIndex = (this.imageIndex + dir + this.imagesData.length) % this.imagesData.length;

        // Update displayed image and text
        this.updateCarousel();
    }

    // Updates image, title, and description to match current imageIndex
    updateCarousel() {
        const current = this.imagesData[this.imageIndex];

        // Find the relevant DOM elements inside Shadow DOM
        const imgEl = this.shadowRoot.querySelector('.carousel-image');
        const titleEl = this.shadowRoot.querySelector('.carousel-text h2');
        const descEl = this.shadowRoot.querySelector('.carousel-text p');

        // Update image source, alt text, and fit style
        imgEl.src = current.src;
        imgEl.alt = current.title || 'Carousel image';
        imgEl.style.objectFit = current.fit || 'cover';

        // Update title and description text
        titleEl.textContent = current.title;
        descEl.textContent = current.desc;
    }

    // Builds the HTML and CSS inside the Shadow DOM
    render() {
        // ======================
        // CSS Styling
        // ======================
        const style = document.createElement('style');
        style.textContent = `
            /* Host styles (the <image-carousel> itself) */
            :host {
                /* Default CSS variable values (can be overridden via attributes or CSS) */
                --primary-color: #0071FF;       /* Hover/active color */
                --secondary-color: #c9c9c9;     /* Heading/arrow base color */
                --text-color: #aaa;             /* Description text color */
                --background-color: #11121a;    /* Carousel background */
                --carousel-width: 500px;        /* Default max width */
                --carousel-height: auto;        /* Default height (auto keeps aspect ratio) */

                /* Layout styling */
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                font-family: Poppins, 'Segoe UI', sans-serif;
                color: var(--secondary-color);
                background-color: var(--background-color);
                padding: 1rem;
                max-width: var(--carousel-width);
                border: 1px solid #272832;
                border-radius: 6px;
            }

            /* Wrapper around everything inside the carousel */
            .carousel-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
            }

            /* Image area with arrows */
            .image-container {
                position: relative;
                width: 100%;
                aspect-ratio: 5/3; /* Keeps shape unless height overridden */
                background-color: rgba(255, 255, 255, 0.1);
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                height: var(--carousel-height);
            }

            /* The main displayed image */
            .carousel-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            /* Arrow buttons */
            .arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                fill: var(--secondary-color);
                padding: 0.25rem;
                transition: fill 0.2s ease;
            }

            /* Arrow hover effect */
            .arrow:hover {
                fill: var(--primary-color);
            }

            /* Left arrow position */
            .arrow.left {
                left: 0.25rem;
            }

            /* Right arrow position */
            .arrow.right {
                right: 0.25rem;
            }

            /* Text under the image */
            .carousel-text {
                text-align: center;
                margin-top: 0.5rem;
            }

            /* Title text */
            .carousel-text h2 {
                margin: 0.25rem 0;
                font-size: 1.25rem;
                color: var(--secondary-color);
            }

            /* Description text */
            .carousel-text p {
                margin: 0;
                font-size: 0.95rem;
                color: var(--text-color);
            }
        `;

        // ======================
        // HTML Structure
        // ======================
        const container = document.createElement('div');
        container.classList.add('carousel-wrapper');

        // HTML content for the carousel
        container.innerHTML = `
            <div class="image-container">
                <!-- Left arrow -->
                <button class="arrow left">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px">
                        <path d="M400-80 0-480l400-400 56 57-343 343 343 343-56 57Z"/>
                    </svg>
                </button>

                <!-- Main image -->
                <img class="carousel-image" src="" alt="">

                <!-- Right arrow -->
                <button class="arrow right">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px">
                        <path d="m304-82-56-57 343-343-343-343 56-57 400 400L304-82Z"/>
                    </svg>
                </button>
            </div>

            <!-- Image title and description -->
            <div class="carousel-text">
                <h2>Image Title</h2>
                <p>Description goes here...</p>
            </div>
        `;

        // Append CSS and HTML into the Shadow DOM
        this.shadowRoot.append(style, container);

        // Attach click events to arrows
        this.shadowRoot.querySelector('.arrow.left')
            .addEventListener('click', () => this.changeImage(-1));
        this.shadowRoot.querySelector('.arrow.right')
            .addEventListener('click', () => this.changeImage(1));
    }
}

// Register the custom element so it can be used in HTML
customElements.define('image-carousel', ImageCarousel);
