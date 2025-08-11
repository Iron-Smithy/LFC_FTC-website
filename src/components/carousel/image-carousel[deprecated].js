// Define a new custom HTML element called <image-carousel>
class ImageCarousel extends HTMLElement {
    constructor() {
        super(); // Always call super() first in a custom element constructor

        // Attach a Shadow DOM to isolate HTML/CSS for this component
        // mode: 'open' means we can access it later with this.shadowRoot
        this.attachShadow({ mode: 'open' });

        // This will store the array of image objects from the JSON file
        this.imagesData = [];

        // Keeps track of which image is currently being shown
        this.imageIndex = 0;
    }

    // Runs automatically when the element is added to the page
    connectedCallback() {
        // Get the "src" attribute from the HTML tag (the JSON file path)
        const src = this.getAttribute('src');

        // If no src provided, show an error in console and stop
        if (!src) {
            console.error('No "src" attribute provided for <image-carousel>.');
            return;
        }

        // Fetch the JSON file that contains carousel image data
        fetch(src)
            .then(res => res.json()) // Convert the response into JS objects
            .then(data => {
                this.imagesData = data; // Save the images into our array
                this.render();          // Build the HTML/CSS for the component
                this.updateCarousel();  // Show the first image & text
            })
            .catch(err => console.error('Error loading carousel data:', err));
    }

    // Move to the next or previous image
    // dir is either +1 (next) or -1 (previous)
    changeImage(dir) {
        if (!this.imagesData.length) return; // Stop if no images loaded

        // Wrap around using modulo so it loops endlessly
        this.imageIndex = (this.imageIndex + dir + this.imagesData.length) % this.imagesData.length;

        // Update the displayed image & text
        this.updateCarousel();
    }

    // Update the image, title, and description displayed in the carousel
    updateCarousel() {
        // Get the current image data object
        const current = this.imagesData[this.imageIndex];

        // Grab elements inside the shadow DOM
        const imgEl = this.shadowRoot.querySelector('.carousel-image');
        const titleEl = this.shadowRoot.querySelector('.carousel-text h2');
        const descEl = this.shadowRoot.querySelector('.carousel-text p');

        // Set the image source and alt text
        imgEl.src = current.src;
        imgEl.alt = current.title || 'Carousel image';

        // Optional object-fit style from JSON (default: cover)
        imgEl.style.objectFit = current.fit || 'cover';

        // Update title and description text
        titleEl.textContent = current.title;
        descEl.textContent = current.desc;
    }

    // Create the HTML structure and CSS for the carousel
    render() {
        // Create a <style> element that holds all CSS for this component
        // This CSS is scoped to the shadow DOM, so it won't affect the rest of the page
        const style = document.createElement('style');
        style.textContent = `
            /* Host styles apply to the <image-carousel> element itself */
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                font-family: Poppins, 'Segoe UI', sans-serif;
                color: #c9c9c9;
                background-color: #11121a;
                padding: 1rem;
                max-width: 500px;
                border: 1px solid #272832;
                border-radius: 6px;
            }

            /* Wrapper for all carousel content */
            .carousel-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
            }

            /* Container for the image and arrows */
            .image-container {
                position: relative; /* Needed to position arrows on top of the image */
                width: 100%;
                aspect-ratio: 5/3; /* Keeps consistent shape */
                background-color: rgba(255, 255, 255, 0.1);
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* The actual carousel image */
            .carousel-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            /* Arrow buttons for navigation */
            .arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                fill: #c9c9c9;
                padding: 0.25rem;
                transition: fill 0.2s ease;
            }

            /* Hover effect for arrows */
            .arrow:hover {
                fill: #0071FF;
            }

            /* Left arrow on left side of image */
            .arrow.left {
                left: 0.25rem;
            }

            /* Right arrow on right side of image */
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
            }

            /* Description text */
            .carousel-text p {
                margin: 0;
                font-size: 0.95rem;
                color: #aaa;
            }
        `;

        // Create the HTML container for the carousel
        const container = document.createElement('div');
        container.classList.add('carousel-wrapper');

        // HTML structure for image, arrows, and text
        container.innerHTML = `
            <div class="image-container">
                <!-- Left arrow -->
                <button class="arrow left">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px">
                        <path d="M400-80 0-480l400-400 56 57-343 343 343 343-56 57Z"/>
                    </svg>
                </button>

                <!-- The carousel image -->
                <img class="carousel-image" src="" alt="">

                <!-- Right arrow -->
                <button class="arrow right">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px">
                        <path d="m304-82-56-57 343-343-343-343 56-57 400 400L304-82Z"/>
                    </svg>
                </button>
            </div>

            <!-- Text area below the image -->
            <div class="carousel-text">
                <h2>Image Title</h2>
                <p>Description goes here...</p>
            </div>
        `;

        // Add the style and container to the shadow DOM
        this.shadowRoot.append(style, container);

        // Attach event listeners to the arrows
        this.shadowRoot.querySelector('.arrow.left')
            .addEventListener('click', () => this.changeImage(-1));
        this.shadowRoot.querySelector('.arrow.right')
            .addEventListener('click', () => this.changeImage(1));
    }
}

// Register the custom element so we can use <image-carousel> in HTML
customElements.define('image-carousel', ImageCarousel);
