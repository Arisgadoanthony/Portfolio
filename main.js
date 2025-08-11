tailwind.config = {
            darkMode: 'class', // Ensure dark mode is based on 'dark' class
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Poppins', 'sans-serif'],
                    },
                    colors: {
                        'background-dark': '#121212',
                        'text-dark': '#f0f0f0',
                        'primary-dark': '#F57C00', /* Dark Yellow / Deep Orange */
                        'secondary-dark': '#D32F2F', /* Dark Red */
                        'card-bg-dark': '#1E1E1E',
                        'border-dark': '#333',
                        'dark-blue-card': '#2B2A4A',
                        'dark-purple-bg': '#221C38',
                        'green-accent-light': '#00E676',
                        'star-filled': '#FFD700', /* Gold for stars */
                        'star-empty': '#4A4A4A',  /* Dark grey for empty stars */
                        'rating-text-color': '#F8D02C', /* Light yellow for overall rating */
                        /* Skill Brand Colors */
                        'color-html': '#E34F26',
                        'color-css': '#1572B6',
                        'color-javascript': '#F7DF1E',
                        'color-react': '#61DAFB',
                        'color-node': '#339933',
                        'color-python': '#3776AB',
                        'color-database': '#607D8B',
                        'color-uiux': '#8A2BE2',
                        'color-graphic': '#FF1493',
                        'color-branding': '#00BF8F',
                        'color-prototyping': '#FF4500',
                    },
                }
            }
        };


        // Theme Toggle Functionality - REMOVED, now only dark theme is present.
        // The `dark` class is always applied to the `html` element.

        // Mobile Menu Toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileNavLinks = document.getElementById('mobile-nav-links');

        /**
         * Toggles the visibility of the mobile navigation menu.
         */
        mobileMenuButton.addEventListener('click', () => {
            mobileNavLinks.classList.toggle('hidden');
            mobileNavLinks.classList.toggle('active');
        });

        // Close mobile menu when a navigation link is clicked
        mobileNavLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavLinks.classList.add('hidden');
                mobileNavLinks.classList.remove('active');
            });
        });

        // Intersection Observer for Animations and Skill Bars
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the element visible to trigger animation
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // For skill bars - ensure they animate when visible
                    if (entry.target.classList.contains('skill-bar-outer')) {
                        const progress = entry.target.dataset.progress;
                        const innerBar = entry.target.querySelector('.skill-bar-inner');
                        if (innerBar) {
                            innerBar.style.width = progress;
                        }
                    }
                    // Apply general animation classes
                    if (entry.target.classList.contains('animate-fadeInScale') ||
                        entry.target.classList.contains('animate-slideInLeft') ||
                        entry.target.classList.contains('animate-slideInRight')) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'none';
                    }
                    // Animate bar chart bars
                    if (entry.target.classList.contains('chart-bar')) {
                        entry.target.setAttribute('data-animated', 'true');
                    }
                    observer.unobserve(entry.target); // Stop observing once animated to prevent re-triggering
                }
            });
        }, observerOptions);

        // Observe elements with animation classes and skill bars to trigger them on scroll
        document.querySelectorAll('.animate-fadeInScale, .animate-slideInLeft, .animate-slideInRight, .chart-bar, .skill-bar-outer').forEach(el => {
            // Set initial state for animations (opacity 0, transformed) so they animate in
            if (el.classList.contains('animate-fadeInScale')) {
                el.style.opacity = '0';
                el.style.transform = 'scale(0.9)';
            } else if (el.classList.contains('animate-slideInLeft')) {
                el.style.opacity = '0';
                el.style.transform = 'translateX(-50px)';
            } else if (el.classList.contains('animate-slideInRight')) {
                el.style.opacity = '0';
                el.style.transform = 'translateX(50px)';
            }
            // For skill bars, ensure initial width is 0 so animation can play
            if (el.classList.contains('skill-bar-outer')) {
                const innerBar = el.querySelector('.skill-bar-inner');
                if (innerBar) {
                    innerBar.style.width = '0%';
                }
            }
            observer.observe(el);
        });


        // Particle Background in Hero Section (Canvas API)
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        /**
         * Resizes the canvas to fill the entire hero section.
         */
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.getElementById('hero').offsetHeight;
        }

        /**
         * Represents a single particle in the background animation.
         * @param {number} x - Initial x-coordinate.
         * @param {number} y - Initial y-coordinate.
         * @param {number} vx - Velocity in x-direction.
         * @param {number} vy - Velocity in y-direction.
         * @param {number} radius - Particle radius.
         * @param {string} color - Particle color.
         */
        class Particle {
            constructor(x, y, vx, vy, radius, color) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.radius = radius;
                this.color = color;
                this.alpha = 0.5; // Initial transparency
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${this.alpha})`;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off walls
                if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                    this.vx *= -1;
                }
                if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                    this.vy *= -1;
                }

                // Fade out slowly
                this.alpha -= 0.001;
                if (this.alpha < 0.01) {
                    // Reset particle if it fades out completely
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * 0.5;
                    this.vy = (Math.random() - 0.5) * 0.5;
                    this.alpha = 0.5;
                }
            }
        }

        /**
         * Initializes particles for the background animation.
         */
        function initParticles() {
            particles = [];
            const numParticles = Math.floor((canvas.width * canvas.height) / 10000); // Adjust density based on screen size
            // Particles will now use the new primary and secondary dark colors
            const colors = [
                getComputedStyle(document.documentElement).getPropertyValue('--primary-dark').trim(),
                getComputedStyle(document.documentElement).getPropertyValue('--secondary-dark').trim(),
                '#f0f0f0' // A neutral color
            ];

            for (let i = 0; i < numParticles; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const vx = (Math.random() - 0.5) * 0.5; // Slow movement
                const vy = (Math.random() - 0.5) * 0.5;
                const radius = Math.random() * 2 + 1; // 1 to 3 pixels
                const color = colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(x, y, vx, vy, radius, color));
            }
        }

        /**
         * Animation loop for particles.
         */
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            // Apply a subtle trail effect based on the current theme
            ctx.fillStyle = 'rgba(18, 18, 18, 0.05)'; // Always dark theme background for trail
            ctx.fillRect(0, 0, canvas.width, canvas.height);


            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw lines between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) { // Connect if particles are close
                        const baseColor = '150, 150, 150'; // Grayish tones for lines
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${baseColor}, ${((100 - distance) / 100) * 0.2})`; // Fading lines
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animateParticles);
        }

        // Initialize particles and start animation when the window loads and on resize
        window.addEventListener('load', () => {
            resizeCanvas();
            initParticles();
            animateParticles();
        });
        window.addEventListener('resize', () => {
            cancelAnimationFrame(animationFrameId); // Stop previous animation loop
            resizeCanvas();
            initParticles();
            animateParticles();
        });


        // Scroll Progress Indicator
        const scrollProgress = document.getElementById('scroll-progress');

        /**
         * Updates the width of the scroll progress bar based on scroll position.
         */
        function updateScrollProgress() {
            const scrollPx = document.documentElement.scrollTop;
            const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winHeightPx > 0) ? (scrollPx / winHeightPx) * 100 : 0;
            scrollProgress.style.width = `${scrolled}%`;
            scrollProgress.setAttribute('aria-valuenow', scrolled.toFixed(0));
        }

        // Listen for scroll events to update the progress bar
        document.addEventListener('scroll', updateScrollProgress);
        // Also update on page load to set initial state
        document.addEventListener('DOMContentLoaded', updateScrollProgress);


        // Testimonial Form Star Rating (Add a Review)
        const reviewStarRating = document.getElementById('review-star-rating');
        const userRatingInput = document.getElementById('user-rating');
        let currentRating = 0;

        if (reviewStarRating) {
            reviewStarRating.addEventListener('click', (e) => {
                const star = e.target.closest('.star');
                if (star) {
                    currentRating = parseInt(star.dataset.value);
                    userRatingInput.value = currentRating;
                    updateStars(currentRating);
                }
            });

            reviewStarRating.addEventListener('mouseover', (e) => {
                const star = e.target.closest('.star');
                if (star) {
                    const hoverValue = parseInt(star.dataset.value);
                    updateStars(hoverValue, true);
                }
            });

            reviewStarRating.addEventListener('mouseout', () => {
                updateStars(currentRating);
            });

            /**
             * Updates the visual representation of stars.
             * @param {number} rating - The current rating value.
             * @param {boolean} isHover - True if the update is due to hovering, false otherwise.
             */
            function updateStars(rating, isHover = false) {
                const stars = reviewStarRating.querySelectorAll('.star');
                stars.forEach(star => {
                    const starValue = parseInt(star.dataset.value);
                    if (starValue <= rating) {
                        star.classList.replace('far', 'fas'); // Fill star
                        star.classList.add('selected');
                    } else {
                        star.classList.replace('fas', 'far'); // Outline star
                        star.classList.remove('selected');
                    }
                });
            }
        }

        // Experience & Education Timeline Detail Cards
        document.querySelectorAll('.timeline-node').forEach(node => {
            node.addEventListener('click', function() {
                const detailId = this.dataset.detail;
                const detailCard = document.getElementById(detailId);

                // Hide any other active detail cards
                document.querySelectorAll('.timeline-detail-card.active').forEach(card => {
                    if (card.id !== detailId) {
                        card.classList.remove('active');
                    }
                });

                // Toggle the clicked card
                if (detailCard) {
                    detailCard.classList.toggle('active');
                }
            });
        });

        // Hide detail card if clicked outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.timeline-node') && !event.target.closest('.timeline-detail-card')) {
                document.querySelectorAll('.timeline-detail-card.active').forEach(card => {
                    card.classList.remove('active');
                });
            }
        });