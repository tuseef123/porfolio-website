//////////////////////
// Navigation Menu
/////////////////////
(() => {

    const hamburgerBtn = document.querySelector(".hamburger-btn"),
        navMenu = document.querySelector(".nav-menu"),
        closeNavBtn = navMenu.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    function showNavMenu() {
        navMenu.classList.add("open");
        bodyScrollingToggle();
    }

    function hideNavMenu() {
        navMenu.classList.remove("open");
        fadeOutEffect();
        bodyScrollingToggle();
    }

    function fadeOutEffect() {
        document.querySelector(".fade-out-effect").classList.add("active");
        setTimeout(() => {
            document.querySelector(".fade-out-effect").classList.remove("active");
        }, 300)
    }

    // Attach Event Handler To The Document
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("link-item")) {
            // Make Sure event.target.hash Has A Value Before OverRidding Default Behaviour
            if (event.target.hash !== "") {
                // Prevent Default Anchor Click Behaviour
                event.preventDefault();
                const hash = event.target.hash;
                // Deactivate Exiting Active 'Section'
                document.querySelector(".section.active").classList.add("hide");
                document.querySelector(".section.active").classList.remove("active");
                // Activate New 'Section'
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");
                // Deactivate Exiting Active Navigation Menu 'link-item'
                navMenu.querySelector(".active").classList.add("outer-shadow", "hover-in-shadow");
                navMenu.querySelector(".active").classList.remove("active", "inner-shadow");
                // If Clicked 'link-item' Is Contained Within Navigation Menu
                if (navMenu.classList.contains("open")) {
                    // Activate New NAvigation Menu 'link-item'
                    event.target.classList.add("active", "inner-shadow");
                    event.target.classList.remove("outer-shadow", "hover-in-shadow");
                    // Hide Navigation Menu
                    hideNavMenu();
                } else {
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) => {
                        if (hash === item.hash) {
                            // Activate Navigation Menu 'link-item'
                            item.classList.add("active", "inner-shadow");
                            item.classList.remove("outer-shadow", "hover-in-shadow");
                        }
                    })
                    fadeOutEffect();
                }
                // Adding # to URL
                window.location.hash = hash;
            }
        }
    })

})();

//////////////////////
// About Section Tabs
/////////////////////
(() => {
    const aboutSection = document.querySelector(".about-section");
    const tabsContainer = document.querySelector(".about-tabs");

    tabsContainer.addEventListener("click", (event) => {
        // if event.target contains 'tab-item' class and not 'active' class
        if (event.target.classList.contains("tab-item") &&
            !(event.target.classList.contains("active"))) {
            const target = event.target.getAttribute("data-target");
            // deactivate exiting active tab
            tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            // activate new tab as active
            event.target.classList.add("active", "outer-shadow");
            // deactivate exiting tab-content
            aboutSection.querySelector(".tab-content.active").classList.remove("active");
            // activate new tab-content
            aboutSection.querySelector(target).classList.add("active");
        }
    })
})();

//////////////////////
// Testimonial Slider
/////////////////////
(() => {
    const sliderContainer = document.querySelector(".testi-slider-container");
    const slides = sliderContainer.querySelectorAll(".testi-item");
    const slideWidth = sliderContainer.offsetWidth;
    const prevBtn = document.querySelector("testi-slider-nav, .prev");
    const nextBtn = document.querySelector("testi-slider-nav, .next");
    const activeSlide = sliderContainer.querySelector(".testi-item.active");
    let slideIndex = Array.from(slides).indexOf(activeSlide);

    // Set width of all slides
    slides.forEach((slide) => {
        slide.style.width = slideWidth + "px";
    })

    // set width of sliderContainer
    sliderContainer.style.width = slideWidth * slides.length + "px";

    nextBtn.addEventListener("click", () => {
        if (slideIndex === slides.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        slider();
    })

    prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex = slides.length - 1;
        } else {
            slideIndex--;
        }
        slider();
    })

    function slider() {
        // Deactivate Exiting Slides
        sliderContainer.querySelector(".testi-item.active").classList.remove("active");
        // Activate New Slide
        slides[slideIndex].classList.add("active");
        sliderContainer.style.marginLeft = -(slideWidth * slideIndex) + "px";
    }
    slider();
})();

function bodyScrollingToggle() {
    document.body.classList.toggle("stop-scrolling");
}

////////////////////////////
// Portfolio Filter & Popup
////////////////////////////

(() => {
    const filterContainer = document.querySelector(".portfolio-filter"),
        portfolioItemsContainer = document.querySelector(".portfolio-items"),
        portfolioItems = document.querySelectorAll(".portfolio-item"),
        popup = document.querySelector(".portfolio-popup"),
        prevBtn = popup.querySelector(".pp-prev"),
        nextBtn = popup.querySelector(".pp-next"),
        closeBtn = popup.querySelector(".pp-close"),
        projectDetailsContainer = popup.querySelector(".pp-details"),
        projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
    let itemIndex, slideIndex, screenshots;

    filterContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("filter-item") && !event.target.classList.contains("active")) {
            // Deactivate Exiting Filter
            filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            // Active New Filter
            event.target.classList.add("outer-shadow", "active");
            const target = event.target.getAttribute("data-target");

            portfolioItems.forEach((item) => {
                if (target === item.getAttribute("data-category") || target === "all") {
                    item.classList.add("show");
                    item.classList.remove("hide");
                } else {
                    item.classList.add("hide");
                    item.classList.remove("show");
                }
            })
        }
    })

    portfolioItemsContainer.addEventListener("click", (event) => {
        if (event.target.closest(".portfolio-item-inner")) {
            const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
            // Get PortfolioItem Index
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");
            screenshots = screenshots.split(",");

            if (screenshots.length === 1) {
                nextBtn.style.display = "none";
                prevBtn.style.display = "none";
            } else {
                nextBtn.style.display = "block";
                prevBtn.style.display = "block";
            }

            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }

        // 
    })

    function popupToggle() {
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".pp-img");
        // Activate The Loader Until The Image Loaded
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () => {
            // Deactivate The Loader Until The Image Loaded
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1) + " of " + screenshots.length;
    }

    // Close Popup
    closeBtn.addEventListener("click", () => {
        popupToggle();
        if (projectDetailsContainer.classList.contains("active")) {
            popupDetailsToggle();
        }
    })

    // Next Slide
    nextBtn.addEventListener("click", () => {
        if (slideIndex === screenshots.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        popupSlideshow();
    })

    // Previous Slide
    prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex = screenshots.length - 1
        } else {
            slideIndex--;
        }
        popupSlideshow();
    })

    function popupDetails() {
        // If portfolio-item-details does not exists
        if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
            projectDetailsBtn.style.display = "none";
            return;
        }

        projectDetailsBtn.style.display = "block";
        // Get Runtime Project Details
        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
        popup.querySelector(".pp-project-details").innerHTML = details;
        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
        popup.querySelector(".pp-title h2").innerHTML = title;
        const category = portfolioItems[itemIndex].getAttribute("data-category");
        popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");

    }

    projectDetailsBtn.addEventListener("click", () => {
        popupDetailsToggle();
    })

    function popupDetailsToggle() {
        if (projectDetailsContainer.classList.contains("active")) {
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px";
        } else {
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");
            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }
    }

})();

// Hide All Sections Except Active
(() => {

    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
        if (!section.classList.contains("active")) {
            section.classList.add("hide");
        }
    })

})();

window.addEventListener("load", () => {
    // Preloader
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(() => {
        document.querySelector(".preloader").style.display = "none";
    }, 600)
})