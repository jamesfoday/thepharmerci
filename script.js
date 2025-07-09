/**
 * Carousel, navbar scrollspy, modal logic, and mobile nav for Healthcare Africa
 * @file script.js
 * @author
 */

/* ------------------- Carousel Logic ------------------- */

const carouselImg = document.getElementById("carouselImg");
const carouselOverlay = document.getElementById("carouselOverlay");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");
const carouselDots = document.getElementById("carouselDots");
const carouselCard = document.getElementById("sliderContainer");

const slides = [
  { img: "img/banner1.jpg", alt: "Healthcare Banner 1" },
  { img: "img/banner2.jpg", alt: "Healthcare Banner 2" },
  { img: "img/banner3.jpg", alt: "Healthcare Banner 3" }
];
let currentSlide = 0;

// Only run carousel logic if elements exist (for home page)
if (carouselImg && carouselOverlay && carouselCard && carouselDots) {
  /**
   * Builds the dot navigation for the carousel and updates the active state.
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
   * Shows the carousel slide at the given index, with sliding transition.
   * @param {number} idx
   * @param {string} [direction] - "left" or "right"
   */
  function showSlide(idx, direction) {
    if (idx < 0) idx = slides.length - 1;
    if (idx >= slides.length) idx = 0;
    carouselImg.classList.remove("slide-in", "slide-out-left", "slide-in-right", "slide-in-left", "slide-out-right");
    carouselOverlay.classList.remove("slide-in", "slide-out-left", "slide-in-right", "slide-in-left", "slide-out-right");
    let slideDir = direction;
    if (!slideDir) {
      slideDir = (idx > currentSlide || (currentSlide === slides.length - 1 && idx === 0)) ? "right" : "left";
    }
    carouselImg.classList.add(slideDir === "right" ? "slide-out-left" : "slide-out-right");
    carouselOverlay.classList.add(slideDir === "right" ? "slide-out-left" : "slide-out-right");

    setTimeout(() => {
      currentSlide = idx;
      carouselImg.src = slides[currentSlide].img;
      carouselImg.alt = slides[currentSlide].alt;
      buildDots();
      carouselImg.classList.remove("slide-out-left", "slide-out-right");
      carouselOverlay.classList.remove("slide-out-left", "slide-out-right");
      carouselImg.classList.add(slideDir === "right" ? "slide-in-right" : "slide-in-left");
      carouselOverlay.classList.add(slideDir === "right" ? "slide-in-right" : "slide-in-left");
      setTimeout(() => {
        carouselImg.classList.remove("slide-in-right", "slide-in-left");
        carouselImg.classList.add("slide-in");
        carouselOverlay.classList.remove("slide-in-right", "slide-in-left");
        carouselOverlay.classList.add("slide-in");
      }, 60);
      setTimeout(() => {
        carouselImg.classList.remove("slide-in");
        carouselOverlay.classList.remove("slide-in");
      }, 650);
    }, 280);
  }

  if (arrowLeft) arrowLeft.onclick = () => showSlide(currentSlide - 1, "left");
  if (arrowRight) arrowRight.onclick = () => showSlide(currentSlide + 1, "right");

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

  // Touch/Swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  carouselCard.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});
  carouselCard.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 40) showSlide(currentSlide + 1, "right");
    if (touchEndX > touchStartX + 40) showSlide(currentSlide - 1, "left");
  }, {passive:true});

  // Autoplay Loop
  let carouselInterval;
  function startCarouselAutoplay() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
      showSlide(currentSlide + 1, "right");
    }, 4000);
  }
  carouselCard.addEventListener("mouseenter", () => clearInterval(carouselInterval));
  carouselCard.addEventListener("mouseleave", startCarouselAutoplay);
  carouselCard.addEventListener("focusin", () => clearInterval(carouselInterval));
  carouselCard.addEventListener("focusout", startCarouselAutoplay);
  startCarouselAutoplay();
}

/* ------------------- Navbar Scrollspy ------------------- */

const navLinks = document.querySelectorAll(".nav-link");
const sectionIds = ["home", "about", "how", "where", "partners", "partnership", "team", "contact"];
const sections = sectionIds.map(id => document.getElementById(id));

/**
 * Updates active class on navbar links based on scroll position.
 */
function updateNavActive() {
  let index = 0;
  sections.forEach((section, i) => {
    if (section && window.scrollY + 120 >= section.offsetTop) index = i;
  });
  navLinks.forEach(link => link.classList.remove("active"));
  navLinks.forEach((link, i) => {
    if (i % sectionIds.length === index) link.classList.add("active");
  });
}
window.addEventListener("scroll", updateNavActive, { passive: true });
updateNavActive();

/* ------------------- Mobile Navigation / Offcanvas ------------------- */

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

window.addEventListener("keydown", e => {
  if (e.key === "Escape" && offcanvasNav && offcanvasNav.classList.contains("open")) {
    closeOffcanvas();
  }
});

/* ------------------- Mobile Sticky Section Title ------------------- */
const mobileSectionTitle = document.getElementById('mobileSectionTitle');
function updateMobileSectionTitle() {
  if (!mobileSectionTitle) return;
  if (window.innerWidth > 1024) return;
  let current = 0;
  sections.forEach((section, i) => {
    if (section && window.scrollY + 120 >= section.offsetTop) current = i;
  });
  const sectionNames = [
    "Home", "About us", "How we work", "Where we work", "Our partners", "Partnership/M&A", "Our Team", "Contact"
  ];
  mobileSectionTitle.textContent = sectionNames[current];
}
window.addEventListener("scroll", updateMobileSectionTitle, { passive: true });
window.addEventListener("resize", updateMobileSectionTitle);
updateMobileSectionTitle();
const allNavLinks = document.querySelectorAll(".nav-link");
allNavLinks.forEach(link => {
  link.addEventListener("click", function() {
    setTimeout(updateMobileSectionTitle, 350);
  });
});

/* ------------------- Team Modal ------------------- */
const modal = document.getElementById('teamModal');
const modalBackdrop = document.getElementById('teamModalBackdrop');
const modalClose = document.getElementById('teamModalClose');
const modalImg = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalBtn = document.getElementById('modalBtn');
const modalBtnIcon = document.getElementById('modalBtnIcon');
const modalBtnText = document.getElementById('modalBtnText');

/**
 * Opens the team member modal and fills in profile data.
 * @param {HTMLElement} member - The team member DOM node triggering the modal.
 */
function openTeamModal(member) {
  modal.classList.add('show');
  modalBackdrop.classList.add('show');
  modalImg.src = member.dataset.img;
  modalImg.alt = member.dataset.name + ' - ' + member.dataset.role;
  modalName.textContent = member.dataset.name;
  modalTitle.textContent = member.dataset.title;
  modalDesc.textContent = member.dataset.desc;

  // Set button text, icon, and link dynamically
  if (member.dataset.link) {
    modalBtn.href = member.dataset.link;
    modalBtn.style.display = '';
    if (member.dataset.icon) {
      modalBtnIcon.textContent = member.dataset.icon;
    } else {
      modalBtnIcon.textContent = "person";
    }
    modalBtnText.textContent = member.dataset.btn || "View Profile";
  } else {
    modalBtn.href = "#";
    modalBtn.style.display = "none";
  }

  modal.setAttribute('aria-hidden', 'false');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  modalClose.focus();
}

/**
 * Closes the team member modal and backdrop.
 */
function closeTeamModal() {
  modal.classList.remove('show');
  modalBackdrop.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  modalBackdrop.setAttribute('aria-hidden', 'true');
}

// Modal event listeners
document.querySelectorAll('.team-member').forEach(member => {
  member.addEventListener('click', function() {
    openTeamModal(member);
  });
  member.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openTeamModal(member);
    }
  });
});
if (modalClose) modalClose.addEventListener('click', closeTeamModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeTeamModal);
window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
    closeTeamModal();
  }
});
