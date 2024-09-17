import { errorHandler } from "../libs/errorHandling.ts";
import { toast } from "../libs/toast.ts";
import { getSneaker } from "../apis/services/user.service.ts";

let container = document.getElementById("container") as HTMLElement | null;
let id = Number(window.location.href.split("?")[1].split("=")[1]);
let newPrice: number;

async function fetchPageElems(): Promise<void> {
  try {
    const response = await getSneaker(id);
    elemGenerator(response);
    colorGenerator(response.colors);
    initial(response.price);
    view();
    colortick();
  } catch (error) {
    errorHandler(error);
    toast("Failed to fetch sneaker data");
  }
}

interface SneakerResponse {
  imageURL: string;
  name: string;
  price: number;
  sizes: string;
  colors: string;
}

interface ElemGenarator {
  sizes: string;
}

function elemGenerator({ imageURL, name, price, sizes }): SneakerResponse: void {
  let sizeArr: <any>  = sizes.split("|");
  if (container) {
    container.innerHTML = `
      <a href="/home"><i class="fas fa-arrow-left absolute top-[17px] left-[20px]"></i></a>
        <div class="h-[400px] w-full bg-[#F6F6F6]"><img src="${imageURL}"></img></div>
        <div class=" w-[90%] border-b pb-4 pt-6 fold:pt-0">
          <div class="flex justify-between items-center mt-3">
            <div class="text-[27px] fold:text-[23px] font-semibold">${name}</div>
            <div><img src="./pics/heart.png" alt="heart" /></div>
          </div>
          <div class="flex items-center mt-3 gap-2">
            <div
              class="w-13 h-5 mr-2 bg-slate-200 text-[9px] font-semibold py-2.5 px-2 flex justify-center items-center rounded-md"
            >
              5,371 sold
            </div>
            <i class="fas fa-star-half-stroke"></i>
            <p class="text-[10px] text-gray-700">4.3(5.389 reviews)</p>
          </div>
        </div>
        <div class="w-[90%] mt-3">
          <span class="font-bold">Description</span><br>
          <span class="text-ellipsis overflow-hidden">Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
          Non  
          <span id="extra" class="hidden">magni eligendi ipsum neque fuga, maiores, quia corrupti</span>
          </span>
          <span id="viewmore" class="font-semibold">viewMore...</span>
        </div>
        <div class="h-[100px] w-full flex items-center justify-between gap-4">
          <div class="h-[70%] flex flex-col ml-4 gap-y-2.5" >
              <span class="font-semibold">Size</span>
              <div class="flex gap-3">
                <div class="w-9 h-9 border border-black rounded-full flex justify-center items-center">${sizeArr[0]}</div>
                <div class="w-9 h-9 border border-black rounded-full flex justify-center items-center">${sizeArr[1]}</div>
                <div class="w-9 h-9 border border-black rounded-full flex justify-center items-center">${sizeArr[2]}</div>
              </div>
          </div>
          <div class="w-full flex flex-col ml-2 overflow-x-auto scrollbar-hide gap-y-2.5">
            <span class="font-semibold">color</span>
            <div class="w-full flex space-x-2  overflow-x-auto scrollbar-hide"><div id="colorContainer" class="w-full flex space-x-2 ml-2 overflow-x-auto scrollbar-hide"></div>
            </div>
          </div>
        </div>
        <div class="h-[50px] w-[90%] flex items-center gap-3 flex-1">
          <p class="text-[17px] font-semibold">Quantity</p>
          <div class="w-[95px] h-8 bg-gray-200 rounded-full flex items-center justify-evenly">
              <div id="minus" class='minus'><i class="fas fa-minus"></i></div>
              <div id="num" class="num font-semibold">0</div>
              <div id="plus" class='plus'><i class="fas fa-plus"></i></div>
          </div>
        </div>
        <div class="h-[100px] w-[90%] fold:h-[90px] border-t flex items-center justify-between mt-auto">
          <div>
            <p class="text-[12px]">Total Price</p>
            <p id="price" class="text-[18px] font-bold">$00.00</p>
          </div>
          <div class="relative w-[60%]">
            <img src="./pics/icons8-bag-48.png" alt="bag" class="w-5 h-5 absoluteleft-[22%] top-2.5">
            <button class="bg-black w-full h-11 text-white text-sm rounded-full pl-[25px] shadow-black shadow-2xl">
              Add to cart
            </button>
          </div>
        </div>`;
  }
}

function colorGenerator(colors: string): void {
  let obj: Record<string, string> = {
    black: "bg-xblack",
    blue: "bg-xblue",
    red: "bg-xred",
    brown: "bg-xbrown",
    white: "bg-xwhite",
  };
  let colorContainer = document.getElementById("colorContainer") as HTMLElement | null;
  if (colorContainer) {
    let colorArr = colors.split("|");
    colorArr.forEach((el) => {
      colorContainer.innerHTML += `<button class="flex items-center justify-center w-9 h-9 rounded-full py-2 px-4 border-2 focus:bg-slate-200/70 ${obj[el]}"><i class="fas fa-check hidden"></i></button>`;
    });
  }
}

let currentColor: HTMLElement | null;
function colortick(): void {
  let colorContainer = document.getElementById("colorContainer") as HTMLElement | null;
  if (colorContainer) {
    colorContainer.addEventListener("click", (event) => {
      let target = event.target as HTMLElement;
      if (currentColor) {
        currentColor.classList.replace("visible", "hidden");
      }
      if (target.children[0]) {
        target.children[0].classList.replace("hidden", "visible");
        currentColor = target.children[0] as HTMLElement;
      }
    });
  }
}

function initial(price: number): void {
  let priceSpan = document.getElementById("price") as HTMLElement | null;
  let minus = document.getElementById("minus") as HTMLElement | null;
  let plus = document.getElementById("plus") as HTMLElement | null;
  let num = document.getElementById("num") as HTMLElement | null;
  let number = num ? Number(num.textContent) : 0;

  function changeQuantity(this: HTMLElement): void {
    if (minus && plus && num && priceSpan) {
      if (this.classList.contains("minus") && number > 0) {
        number--;
        num.textContent = String(number);
      } else if (this.classList.contains("plus")) {
        number++;
        num.textContent = String(number);
      }
      priceSpan.textContent = `$${number * price}.00`;
    }
  }

  minus?.addEventListener("click", changeQuantity);
  plus?.addEventListener("click", changeQuantity);
}

function view(): void {
  let viewMore = document.getElementById("viewmore") as HTMLElement | null;
  let moreText = document.getElementById("extra") as HTMLElement | null;
  
  if (viewMore && moreText) {
    viewMore.addEventListener("click", function () {
      if (moreText.classList.contains("hidden")) {
        moreText.classList.replace("hidden", "visible");
        viewMore.textContent = "ViewLess";
      } else {
        moreText.classList.replace("visible", "hidden");
        viewMore.textContent = "ViewMore...";
      }
    });
  }
}