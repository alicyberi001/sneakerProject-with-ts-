// import { errorHandler } from "../libs/errorHandling.js";
import {
  getBrands,
  getProducts,
  searchFunc,
  getUserInfo,
} from "../apis/services/user.service";
// import { toast } from "../libs/toast.js";

const username = document.getElementById("username") as HTMLElement;
let brandCont = document.getElementById("brandCont") as HTMLElement;
let cont = document.getElementById("cont") as HTMLElement;
let cartContainer = document.getElementById("cartContainer") as HTMLElement;
let searchBar = document.getElementById("searchBar") as HTMLInputElement;
let actionBar = document.getElementById("action-bar") as HTMLElement;
let leftSpan = document.getElementById("leftSpan") as HTMLElement;
let rightSpan = document.getElementById("rightSpan") as HTMLElement;
let contb = document.getElementById("contb") as HTMLElement;
let AllBtn = document.getElementById("AllBtn") as HTMLElement;

async function fetchUserInfo() {
  try {
    let response = await getUserInfo();
    console.log(response);
    if (username) {
      username.innerText = response.username;
    }
  } catch (error) {
    // errorHandler(error);
  }
}

function dayTime() {
  const now = new Date();
  const hours = now.getHours();
  let greeting: string;

  if (hours >= 6 && hours < 12) {
    greeting = "Good morning 🐻";
  } else if (hours >= 12 && hours < 14) {
    greeting = "Good afternoon 🤠";
  } else if (hours >= 14 && hours < 18) {
    greeting = "Good evening 😎";
  } else {
    greeting = "Good night 😴";
  }
  
  const timeElement = document.getElementById("time");
  if (timeElement) {
    timeElement.textContent = greeting;
  }
}

function brandGenerator(brand: string): string {
  return `
  <button id="${brand}_id" class="w-full h-11 bg-white text-black rounded-full py-2 px-4 border-2 flex items-center justify-center whitespace-nowrap ">${brand}</button>
`;
}

function renderBrands(brandArr: string[]) {
  if (brandCont) {
    brandCont.innerHTML = `<button id="AllBtn" class=" bg-[#343a40] w-full h-11 text-white rounded-full py-2 px-4 border-2 flex items-center justify-center whitespace-nowrap">All</button>`;
    brandCont.innerHTML += brandArr.map((el) => brandGenerator(el)).join(" ");
  }
}

async function fetchBrands() {
  let response = await getBrands();
  renderBrands(response);
}

let currentBrand: string | null ;
let currentPage = 1;
let totalProducts = 0;
let currentElement: HTMLElement | null ;
let newElement: HTMLElement | null ;

async function clickBrand(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!currentElement) {
    currentElement = target;
    currentElement.classList.replace("bg-white", "bg-[#343a40]");
    currentElement.classList.replace("text-black", "text-white");

    const allBtn = document.getElementById("AllBtn");
    if (allBtn) {
      allBtn.classList.replace("bg-[#343a40]", "bg-white");
      allBtn.classList.replace("text-white", "text-black");
    }
  } else if (currentElement) {
    newElement = target;
    currentElement.classList.replace("bg-[#343a40]", "bg-white");
    currentElement.classList.replace("text-white", "text-black");
    newElement.classList.replace("bg-white", "bg-[#343a40]");
    newElement.classList.replace("text-black", "text-white");
    currentElement = newElement;
  }
  const brandName = target.textContent;
  currentBrand = brandName === "All" ? null : brandName;

  await fetchProducts(1);
}

// =====================================================

function renderCards(cardArray: { imageURL: string, name: string, price: number, id: string }[]) {
  if (cartContainer) {
    cartContainer.innerHTML = cardArray.map((el) => cardGenerator(el)).join(" ");

    const paginationDiv = document.getElementById("pagination") as HTMLElement;
    paginationDiv.classList.add("hidden");

    const cards = cartContainer.children;
    const delay = 100;
    Array.from(cards).forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove("hidden"); 
        card.classList.add("animate-fade-in"); 

        if (index === cards.length - 1) {
          setTimeout(() => {
            paginationDiv.classList.remove("hidden");
            paginationDiv.classList.add("animate-fade-in");
          }, delay);
        }
      }, index * delay);
    });
  }
}

function cardGenerator({ imageURL, name, price, id }: { imageURL: string, name: string, price: number, id: string }): string {
  return `
  <a href="/sneaker?id=${id}" class="hidden"><div id="${id}" class="w-[182px] h-[244px] fold:w-[150px] fold:h-[220px]">
      <div class="w-[180px] h-[180px] fold:w-[150px] fold:h-[150px] bg-slate-100 rounded-[24px] flex justify-center items-center overflow-hidden">
          <img src="${imageURL}" alt="image">
      </div>
      <p class="font-bold text-[20px] line-clamp-1">${name}</p>
      <p class="font-semibold text-[16px]">$ ${price}.00</p>
  </div></a>`;
}

async function fetchProducts(page: number) {
  currentPage = page;
  try {
    const response = await getProducts(page, currentBrand);
    totalProducts = response.total;
    renderCards(response.data);
    setupPagination();
  } catch (error) {
    // toast(error, "error");
  }
}

// =====================================================

searchBar.addEventListener("focus", () => {
  actionBar.classList.add("hidden");
  contb.classList.add("hidden");
});

searchBar.addEventListener("blur", () => {
  actionBar.classList.remove("hidden");
  contb.classList.remove("hidden");
});

let currentSearch = "";
let totalSearchResults = 0;

function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: number | undefined;
  return function(...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

async function fetchSearchResults(page: number) {
  currentPage = page;
  const response = await searchFunc(page, currentSearch);
  if (response && response.data) {
    totalSearchResults = response.total;
    if (response.data.length === 0) {
      cartContainer.classList.replace("grid-cols-2", "grid-cols-1");
      cartContainer.innerHTML = `<div class="w-full flex items-center justify-center px-3 mt-40" ><img src="./pics/no-search-found.png" alt="notFound"></div>`;
    } else {
      cartContainer.classList.replace("grid-cols-1", "grid-cols-2");
      renderCards(response.data);
    }
    setupPagination(true);
  }
}

function setupPagination(isSearch = false) {
  const totalItems = isSearch ? totalSearchResults : totalProducts;
  const totalPages = Math.ceil(totalItems / 10);
  let paginationDiv = document.getElementById("pagination") as HTMLElement;
  paginationDiv.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.className =
      "w-10 ml-4 border-2 px-2 py-2 rounded-[10px] cursor-pointer";
    button.textContent = i.toString();

    if (i === currentPage) {
      button.classList.add("bg-[#343a40]", "text-white");
    }

    button.addEventListener("click", () => {
      if (isSearch) {
        fetchSearchResults(i);
      } else {
        fetchProducts(i);
      }
    });

    paginationDiv.appendChild(button);
  }
}

async function init() {
  fetchUserInfo();
  dayTime();
  fetchBrands();
  fetchProducts(1);
}

init();

brandCont.addEventListener("click", clickBrand);

searchBar.addEventListener("input", debounce(async function() {
  currentSearch = this.value;
  await fetchSearchResults(1);
  if (currentSearch.length == 0) {
    leftSpan.textContent = "Most Popular";
    rightSpan.textContent = "See All";
  } else {
    leftSpan.textContent = `Result for "${currentSearch}"`;
    rightSpan.textContent = `${totalSearchResults} founds`;
  }
}, 1500));

cont.addEventListener("click", (event) => {
  console.log(event.target);
});

