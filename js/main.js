"use strict";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const buttonLogin = document.querySelector(".button-login");
const html = document.querySelector("html");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const createTitleCard = document.querySelector(".section-heading");
const restaurantTitle = document.querySelector(".restaurant-title");
const restaurantRating = document.querySelector(".rating");
const restaurantPrice = document.querySelector(".price");
const restaurantCategory = document.querySelector(".category");
const inputSearch = document.querySelector(".input-search");
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart')

let login = localStorage.getItem("food");

const cart = [];

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибка ${response.status}!`);
  }

  return await response.json();
};

function toggleModal() {
  modal.classList.toggle("is-open");
}
function toogaleModalAuth() {
  modalAuth.classList.toggle("is-open");
  loginInput.style.borderColor = "";
  if (modalAuth.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/;
  console.log(regName.test(str));
  return regName.test(str);
}

function autorized() {
  function logOut() {
    login = null;
    localStorage.removeItem("food");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    cartButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);

    checkAuth();
  }

  console.log("Авторизован");

  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";
  buttonOut.addEventListener("click", logOut);
}

function noAutorized() {
  console.log("Не авторизован");

  function logIn(event) {
    event.preventDefault();
    if (validName(loginInput.value)) {
      login = loginInput.value;
      localStorage.setItem("food", login);
      toogaleModalAuth();
      buttonAuth.removeEventListener("click", toogaleModalAuth);
      closeAuth.removeEventListener("click", toogaleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = "rgba(255, 0, 0)";
    }
  }

  buttonAuth.addEventListener("click", toogaleModalAuth);
  closeAuth.addEventListener("click", toogaleModalAuth);
  logInForm.addEventListener("submit", logIn);
  modalAuth.addEventListener("click", (event) => {
    if (event.target.classList.contains("is-open")) {
      toogaleModalAuth();
    }
  });
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    noAutorized();
  }
}

function createCardRestuarant({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery,
}) {
  const cardRestaurant = document.createElement("a");
  cardRestaurant.className = "card card-restaurant";
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
  <img src='${image}' alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">${name}</h3>
      <span class="card-tag tag">${timeOfDelivery} мин</span>
    </div>
    
    <div class="card-info">
      <div class="rating">
        ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
    
  </div>
  
`;

  cardRestaurant.insertAdjacentHTML("beforeend", card);
  cardsRestaurants.insertAdjacentElement("beforeend", cardRestaurant);
}

function createCardGood({ description, name, price, image, id }) {
  const card = document.createElement("div");
  card.className = "card";
  card.id = id;

  card.insertAdjacentHTML(
    "beforeend",
    `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart ">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `
  );

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
  const target = event.target;

  const restaurant = target.closest(".card-restaurant");

  if (login) {
    if (restaurant) {
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      // console.dir(restaurant);
      menu.classList.remove("hide");

      const { name, kitchen, price, stars } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toogaleModalAuth();
  }
}

function addToCart(event) {
  const target = event.target;

  const buttonAddToCart = target.closest(".button-add-cart");
  
  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = card.id;

    const food = cart.find( (item) => {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }
    console.log(cart);
  }
}

function renderCart(){
    modalBody.textContent = '';

    cart.forEach(({id, title, cost, count })=>{
      const itemCart = `<div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost} </strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>`;

     modalBody.insertAdjacentHTML('afterbegin', itemCart); 

    })

    const totalPrice = cart.reduce((result, item)=>{
      return result + (parseFloat(item.cost) * item.count);
    },0);


    modalPrice.textContent = totalPrice + ' ₽';
}

function changeCount(event){
  const target = event.target;

  if(target.classList.contains('counter-button')){
    const food = cart.find((item)=>{
      return item.id === target.dataset.id;
    });
    if(target.classList.contains('counter-minus')){
      food.count--
      if(food.count === 0){
        cart.splice(cart.indexOf(food), 1);
      }
    }
    
    if(target.classList.contains('counter-plus')) food.count++
    
   renderCart();
  }

 
}

function init() {
  checkAuth();
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestuarant);
  });
  
  cartButton.addEventListener("click", ()=>{
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click',() => {
    cart.length = 0;
    renderCart();
  })

  modalBody.addEventListener('click', changeCount);


  cardsMenu.addEventListener("click", addToCart);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener("click", openGoods);

  logo.addEventListener("click", () => {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });

  inputSearch.addEventListener("keypress", (event) => {
    if (event.charCode === 13) {
      const value = event.target.value.trim();

      if (!value) {
        event.target.style.background = "red";
        setTimeout(() => {
          event.target.style.background = "";
        }, 1500);
        event.target.value = "";
        return;
      }

      getData("./db/partners.json")
        .then((data) => {
          return data.map((partner) => {
            return partner.products;
          });
        })
        .then((linksProduct) => {
          cardsMenu.textContent = "";

          linksProduct.forEach((link) => {
            getData(`./db/${link}`).then((data) => {
              const resultSearch = data.filter((item) => {
                const name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              });

              containerPromo.classList.add("hide");
              restaurants.classList.add("hide");

              menu.classList.remove("hide");

              restaurantTitle.textContent = "Результат поиска";
              restaurantRating.textContent = "";
              restaurantPrice.textContent = "";
              restaurantCategory.textContent = "разная кухня";
              resultSearch.forEach(createCardGood);
            });
          });
        });
    }
  });
}

init();

//slider

const mySlider = new Swiper(".swiper-container", {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: "cube",
  grabCursor: true,
  delay: 2000,
  cubeEffect: {
    shadow: false,
  },
});
