const bodyElement: HTMLElement = document.body;

const wrapper: HTMLElement | null = document.querySelector('.wrapper');

const slidesArea: HTMLElement | null = document.querySelector('.slides-area');

const slidesCount: number = slidesArea ? slidesArea.childElementCount : 0;

const slidesCountMinusOne: number = slidesCount - 1;

const nextButton: HTMLElement | null = document.querySelector('.button-next');

const paginationsArea: HTMLElement | null = document.querySelector('.paginations-area');

let slidePosition: number = 0;

let moveValue: number = 0;

let unit: string = 'px';

let updateWrapperWidth: (width?: number) => void;
let createPaginationItems: () => void;

if (nextButton) {
  nextButton.addEventListener('click', (event: Event) => {
    moveToNextSlide();
  });
}

window.addEventListener('resize', (event: Event) => {
  if (wrapper) {
    updateWrapperWidth(wrapper.offsetWidth);
  }
});

function moveToNextSlide() {
  if (slidePosition === slidesCountMinusOne) {
    getStartedActions();
  } else {
    slidePosition++;
    if (wrapper) {
      moveValue += wrapper.offsetWidth;
    }
  }

  if (slidesArea) {
    slidesArea.style.marginLeft = `-${moveValue}${unit}`;
  }

  updateNextButton();
  createPaginationItems();
}

(updateWrapperWidth = function (width?: number) {
  if (wrapper && slidesArea) {
    width = width || wrapper.offsetWidth;

    slidesArea.style.width = `${width * slidesCount}${unit}`;

    if (slidePosition > 0) {
      moveValue = width;

      slidesArea.style.marginLeft = `-${width}${unit}`;

      if (slidePosition === slidesCountMinusOne) {
        slidesArea.style.marginLeft = `-${width * slidesCountMinusOne}${unit}`;
      }
    }
  }
})();

function updateNextButton() {
  if (nextButton) {
    nextButton.classList.add('button-next--fade');

    setTimeout(() => {
      nextButton.classList.remove('button-next--fade');
    }, 500);

    setTimeout(() => {
      if (slidePosition === slidesCountMinusOne) {
        nextButton.textContent = 'Get Started';
      } else {
        nextButton.textContent = 'Next';
      }
    }, 550);
  }
}

(createPaginationItems = function () {
  if (paginationsArea) {
    paginationsArea.innerHTML = '';

    for (let i = 0; i < slidesCount; i++) {
      const paginationItem: string = '<span class="paginations-area__item"></span>';
      paginationsArea.innerHTML += paginationItem;
    }

    if (paginationsArea.children[slidePosition]) {
      paginationsArea.children[slidePosition].classList.add('paginations-area__item--current');
    }
  }
})();

function getStartedActions() {
  window.location.href = "/login";

  if (wrapper) {
    wrapper.classList.add('wrapper--has-fade');
  }
}