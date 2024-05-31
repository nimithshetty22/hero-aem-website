import { fetchPlaceholders } from '../../scripts/aem.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide?.querySelectorAll('a')?.forEach((link) => link?.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide?.offsetLeft,
    behavior: 'smooth',
  });
}

var autoSlideInterval;
function startAutoSlide(block) {
  autoSlideInterval = setInterval(() => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  }, 4500);
}

function resetAutoSlide(block) {
  if(autoSlideInterval && block.classList.contains('auto-slide')) {
    clearInterval(autoSlideInterval);
    startAutoSlide(block);
  }
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
    resetAutoSlide(block);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    resetAutoSlide(block);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

function createDoubleSlide(row1, row2, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row1.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  row2.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

function createSlideIndicator(slideIndicators, placeholders, currIdx, lastIdx) {
  if (slideIndicators) {
    const indicator = document.createElement('li');
    indicator.classList.add('carousel-slide-indicator');
    indicator.dataset.targetSlide = currIdx;
    indicator.innerHTML = `<button type="button"><span>${placeholders.showSlide || 'Show Slide'} ${currIdx + 1} ${placeholders.of || 'of'} ${lastIdx}</span></button>`;
    slideIndicators.append(indicator);
  }
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.classList.add('slide-indicators-wrapper');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');

    slideIndicatorsNav.insertAdjacentHTML('afterbegin',`
      <button type="button" class= "slide-prev slide-nav" aria-label="${placeholders.previousSlide || 'Previous Slide'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17 22.5L8 12L17 1.5" stroke="#FF0000" stroke-width="3"></path>
        </svg>
      </button>
    `);

    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);

    slideIndicatorsNav.insertAdjacentHTML('beforeend', `
      <button type="button" class="slide-next slide-nav" aria-label="${placeholders.nextSlide || 'Next Slide'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 22.5L16 12L7 1.5" stroke="#FF0000" stroke-width="3"></path>
        </svg>
      </button>
    `);

    block.append(slideIndicatorsNav);
  }

  if (block.classList.contains('awards')) {
    let counter = 0;
    let totalSlides = Math.ceil(parseInt(rows.length / 2));

    for (let i = 0; i < rows.length; i += 2) {
      const slide = createDoubleSlide(rows[i], rows[i + 1], counter, carouselId);
      slidesWrapper.append(slide);
      createSlideIndicator(slideIndicators, placeholders, counter, totalSlides);
      rows[i].remove();
      rows[i + 1].remove();
      counter += 1;
    }

    if (rows.length & 1) {
      const slide = createSlide(rows[-1], counter, carouselId);
      slidesWrapper.append(slide);
      createSlideIndicator(slideIndicators, placeholders, counter, totalSlides);
      rows[-1].remove();
    }
  }

  else {
    rows.forEach((row, idx) => {
      const slide = createSlide(row, idx, carouselId);
      slidesWrapper.append(slide);
      createSlideIndicator(slideIndicators, placeholders, idx, rows.length);
      row.remove();
    });
  }

  container.append(slidesWrapper);
  block.prepend(container);
  block.classList.contains('auto-slide') && startAutoSlide(block);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}