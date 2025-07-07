/**
 * Carousel, navbar scrollspy, and mobile nav logic for Healthcare Africa
 * @file script.js
 * @author You
 */

/** === CAROUSEL LOGIC === **/

const slides = [
  { img: "img/banner1.jpg", alt: "Healthcare Banner 1" },
  { img: "img/banner2.jpg", alt: "Healthcare Banner 2" },
  { img: "img/banner3.jpg", alt: "Healthcare Banner 3" }
];

let currentSlide = 0;
const carouselImg = document.getElementById("carouselImg");
const carouselOverlay = document.getElementById("carouselOverlay");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");
const carouselDots = document.getElementById("carouselDots");
const carouselCard = document.getElementById("sliderContainer");

/**
 * Build dot navigation and update active state.
 */
function buildDots() {
  carouselDots.innerHTML = "";
  slides.forEach((slide, idx) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (idx === currentSlide ? " active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
    dot.setAttribute("tabindex", "0");
    dot.onclick = () => showSlide(idx, idx > currentSlide ? "right" : "left");
    dot.onkeydown = e => {
      if (e.key === "Enter" || e.key === " ") showSlide(idx, idx > currentSlide ? "right" : "left");
    };
    carouselDots.appendChild(dot);
  });
}

/**
 * Show slide at given index with SLIDE transition
 * @param {number} idx
 * @param {string} [direction] - "left" or "right"
 */
function showSlide(idx, direction) {
  if (idx < 0) idx = slides.length - 1;
  if (idx >= slides.length) idx = 0;

  // Remove previous slide classes
  carouselImg.classList.remove("slide-in", "slide-out-left", "slide-in-right", "slide-in-left", "slide-out-right");
  carouselOverlay.classList.remove("slide-in", "slide-out-left", "slide-in-right", "slide-in-left", "slide-out-right");

  // Decide direction (default = right)
  let slideDir = direction;
  if (!slideDir) {
    slideDir = (idx > currentSlide || (currentSlide === slides.length - 1 && idx === 0)) ? "right" : "left";
  }

  // Slide out old image
  carouselImg.classList.add(slideDir === "right" ? "slide-out-left" : "slide-out-right");
  carouselOverlay.classList.add(slideDir === "right" ? "slide-out-left" : "slide-out-right");

  setTimeout(() => {
    currentSlide = idx;
    carouselImg.src = slides[currentSlide].img;
    carouselImg.alt = slides[currentSlide].alt;
    buildDots();

    // Slide in new image
    carouselImg.classList.remove("slide-out-left", "slide-out-right");
    carouselOverlay.classList.remove("slide-out-left", "slide-out-right");
    carouselImg.classList.add(slideDir === "right" ? "slide-in-right" : "slide-in-left");
    carouselOverlay.classList.add(slideDir === "right" ? "slide-in-right" : "slide-in-left");

    // Then bring to normal position
    setTimeout(() => {
      carouselImg.classList.remove("slide-in-right", "slide-in-left");
      carouselImg.classList.add("slide-in");
      carouselOverlay.classList.remove("slide-in-right", "slide-in-left");
      carouselOverlay.classList.add("slide-in");
    }, 60);

    // Clean up after animation
    setTimeout(() => {
      carouselImg.classList.remove("slide-in");
      carouselOverlay.classList.remove("slide-in");
    }, 650);
  }, 280);
}

// Next/Prev controls
if (arrowLeft) arrowLeft.onclick = () => showSlide(currentSlide - 1, "left");
if (arrowRight) arrowRight.onclick = () => showSlide(currentSlide + 1, "right");

// Initial render
showSlide(currentSlide);

// Hide arrows on mobile
function toggleArrows() {
  if (window.innerWidth <= 1024) {
    if (arrowLeft) arrowLeft.style.display = "none";
    if (arrowRight) arrowRight.style.display = "none";
  } else {
    if (arrowLeft) arrowLeft.style.display = "";
    if (arrowRight) arrowRight.style.display = "";
  }
}
window.addEventListener("resize", toggleArrows);
toggleArrows();

/** --- SWIPE SUPPORT FOR MOBILE --- **/
let touchStartX = 0;
let touchEndX = 0;

carouselCard.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, {passive:true});

carouselCard.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
}, {passive:true});

function handleGesture() {
  if (touchEndX < touchStartX - 40) {  // swipe left
    showSlide(currentSlide + 1, "right");
  }
  if (touchEndX > touchStartX + 40) {  // swipe right
    showSlide(currentSlide - 1, "left");
  }
}

/** --- AUTOPLAY (LOOPING) --- **/
let carouselInterval;

function startCarouselAutoplay() {
  clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    showSlide(currentSlide + 1, "right");
  }, 4000);
}

// Pause on mouse hover/focus for accessibility
carouselCard.addEventListener("mouseenter", () => clearInterval(carouselInterval));
carouselCard.addEventListener("mouseleave", startCarouselAutoplay);
carouselCard.addEventListener("focusin", () => clearInterval(carouselInterval));
carouselCard.addEventListener("focusout", startCarouselAutoplay);

// Start autoplay when page loads
startCarouselAutoplay();

/** === NAVBAR SCROLLSPY === **/
const navLinks = document.querySelectorAll(".nav-link");
const sectionIds = ["home", "about", "how", "where", "partners", "partnership"];
const sections = sectionIds.map(id => document.getElementById(id));

function updateNavActive() {
  let index = 0;
  sections.forEach((section, i) => {
    if (section && window.scrollY + 120 >= section.offsetTop) index = i;
  });
  navLinks.forEach(link => link.classList.remove("active"));
  navLinks.forEach((link, i) => {
    if (i % 6 === index) link.classList.add("active");
  });
}
window.addEventListener("scroll", updateNavActive, { passive: true });
updateNavActive();

/**
 * MOBILE NAV LOGIC
 */
// Offcanvas
const menuToggle = document.getElementById("menuToggle");
const offcanvasNav = document.getElementById("offcanvasNav");
const navBackdrop = document.getElementById("navBackdrop");
const closeNav = document.getElementById("closeNav");
const navLinksMobile = offcanvasNav ? offcanvasNav.querySelectorAll(".nav-link") : [];

if (menuToggle) {
  menuToggle.onclick = function() {
    offcanvasNav.classList.add("open");
    navBackdrop.classList.add("show");
    offcanvasNav.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // Focus first link
    setTimeout(() => navLinksMobile[0].focus(), 180);
  };
}

if (closeNav) {
  closeNav.onclick = closeOffcanvas;
}
if (navBackdrop) {
  navBackdrop.onclick = closeOffcanvas;
}
navLinksMobile.forEach(link => link.onclick = closeOffcanvas);

function closeOffcanvas() {
  offcanvasNav.classList.remove("open");
  navBackdrop.classList.remove("show");
  offcanvasNav.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Keyboard a11y: ESC closes menu
window.addEventListener("keydown", e => {
  if (e.key === "Escape" && offcanvasNav && offcanvasNav.classList.contains("open")) {
    closeOffcanvas();
  }
});


// For mobile: update section title in header
const mobileSectionTitle = document.getElementById('mobileSectionTitle');

function updateMobileSectionTitle() {
  if (!mobileSectionTitle) return;
  // Only run on mobile (<=1024px)
  if (window.innerWidth > 1024) return;

  let current = 0;
  sections.forEach((section, i) => {
    if (section && window.scrollY + 120 >= section.offsetTop) current = i;
  });
  // Map to section names
  const sectionNames = [
    "Home", "About us", "How we work", "Where we work", "Our partners", "Partnership/M&A"
  ];
  mobileSectionTitle.textContent = sectionNames[current];
}
window.addEventListener("scroll", updateMobileSectionTitle, { passive: true });
window.addEventListener("resize", updateMobileSectionTitle);
updateMobileSectionTitle();

// When clicking mobile nav links, also update
const allNavLinks = document.querySelectorAll(".nav-link");
allNavLinks.forEach(link => {
  link.addEventListener("click", function() {
    setTimeout(updateMobileSectionTitle, 350); // Wait for scroll
  });
});


// team modal

// --- Team Modal Logic ---

// Get modal DOM elements
const modal = document.getElementById('teamModal');
const modalBackdrop = document.getElementById('teamModalBackdrop');
const modalClose = document.getElementById('teamModalClose');
const modalImg = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

/**
 * Opens the team member modal and fills with the selected member's data.
 * @param {HTMLElement} member - The team member element clicked
 */
function openTeamModal(member) {
  // Show modal and backdrop
  modal.classList.add('show');
  modalBackdrop.classList.add('show');
  // Fill modal content from data attributes
  modalImg.src = member.dataset.img;
  modalImg.alt = member.dataset.name + ' - ' + member.dataset.role;
  modalName.textContent = member.dataset.name;
  modalTitle.textContent = member.dataset.title;
  modalDesc.textContent = member.dataset.desc;
  modal.setAttribute('aria-hidden', 'false');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  // Set focus to close button for accessibility
  modalClose.focus();
}

/**
 * Closes the team member modal and backdrop
 */
function closeTeamModal() {
  modal.classList.remove('show');
  modalBackdrop.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  modalBackdrop.setAttribute('aria-hidden', 'true');
}

// Attach open event to all team members
document.querySelectorAll('.team-member').forEach(member => {
  // Mouse click opens modal
  member.addEventListener('click', function() {
    openTeamModal(member);
  });
  // Keyboard Enter/Space opens modal
  member.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openTeamModal(member);
    }
  });
});

// Attach close events
modalClose.addEventListener('click', closeTeamModal);             // Close button
modalBackdrop.addEventListener('click', closeTeamModal);          // Backdrop click

// ESC key closes modal if open
window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal.classList.contains('show')) {
    closeTeamModal();
  }
});
