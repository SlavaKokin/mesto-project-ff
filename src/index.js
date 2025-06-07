//1)Импотры
import "./pages/index.css";
import { initialCards } from "./components/cards.js"; // Импорт массива карточек
import { openModal, closeModal } from "./components/modal.js"; // Импорт функций открытия и закрытия
import { createCard, handleLikeButtonClick, deleteCard } from "./components/card.js";

//2)Глобальные переменные
// Элементы карточки
const cardContainer = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

// Элементы модального окна с изображением
const imagePopup = document.querySelector('.popup_type_image');
const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

// Элемент обработчика клика по карточкам
const cardList = document.querySelector('.places__list');

// Элементы открытия модальных окон 
const editPopupButton = document.querySelector('.profile__edit-button');
const addPopupButton = document.querySelector('.profile__add-button');
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');

//Элементы формы попапа для профиля
const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = profileFormElement.querySelector('input[name="name"]');
const jobInput = profileFormElement.querySelector('input[name="description"]');
//Элементы данных профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

//Элементы формы попапа для добавления карточки
const cardFormElement = document.querySelector('.popup__form[name="new-place"]');
const placeInput = cardFormElement.querySelector('input[name="place-name"]');
const linkInput = cardFormElement.querySelector('input[name="link"]');

//3) Обработчики
// Обработчик клика по изображению карточки
function handleImage({ name, link }) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
};

//Вывести карточки на страницу
initialCards.forEach(dataCard => {
  const cardElement = createCard(dataCard, deleteCard, handleLikeButtonClick, handleImage, cardTemplate);
  cardContainer.append(cardElement);
});

// Обработчики открытия и закрытия попапов
// Обработчик для открытия окна с изображением
cardList.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('card__image')) {
    const card = evt.target.closest('.card');
    const name = card.querySelector('.card__title').textContent;
    const link = evt.target.src;
    handleImage({ name, link });
  }
});

// Обработчики открытия модальных окон редактирования и добавления
// Заполнение модального окна
function fillProfileData() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
};
// Редактирование
editPopupButton.addEventListener('click', () => {
  fillProfileData();
  openModal(editPopup);
});
//Добавление
addPopupButton.addEventListener('click', () => {
  openModal(addPopup);
});

// Обработчик кнопки закрытия модального окна
document.querySelectorAll('.popup__close').forEach((closeButton) => {
  const popup = closeButton.closest('.popup');
  closeButton.addEventListener('click', () => closeModal(popup));
});

// Обработчик закрытия модального по оверлею
document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

//Обработчик формы редактирования карточки
profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();// Эта строчка отменяет стандартную отправку формы.
  profileTitle.textContent = nameInput.value; // Вставьте новые значения с помощью textContent
  profileDescription.textContent = jobInput.value;
  closeModal(editPopup);
}); 

// Обработчик формы добавления новой карточки
cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
  const placeName = placeInput.value; 
  const link = linkInput.value;// Получите значение полей placeInput и linkInput из свойства value
  const newCardData = {
    name: placeName,
    link: link
  }; 
  const newCard = createCard(newCardData, deleteCard, handleLikeButtonClick, handleImage, cardTemplate);
  cardContainer.prepend(newCard);// Вставляем новые данные
  evt.target.reset(); // Очистка формы
  closeModal(addPopup); // Закрытие попапа
});





