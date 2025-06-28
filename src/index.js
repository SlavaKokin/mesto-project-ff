//1)Импотры
import "./pages/index.css";
import { openModal, closeModal } from "./components/modal.js"; // Импорт функций открытия и закрытия
import { createCard, handleLike, deleteCard } from "./components/card.js";
import { enableValidation, clearValidation } from './components/validation.js';
import { getUserInfo, getInitialCards, addCard, updateUserInfo, updateUserAvatar, deleteCardApi } from './components/api.js'

//2)Глобальные переменные
let cardToDelete; // карточка, которую собираемся удалить
let cardIdToDelete; // id карточки

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
// Переменные для модального окна подтверждения
const confirmPopup = document.querySelector('.popup_type_confirm');
const confirmButton = confirmPopup.querySelector('.popup__confirm-button');
//Элементы окна редактирования аватара
const avatarPopup = document.querySelector('.popup_type_update-avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarLinkInput = avatarForm.querySelector('input[name="avatar-link"]');
const updateAvatarButton = document.querySelector('.profile__update-avatar-button');

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

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);

//3) Обработчики
// Обработчик клика по изображению карточки
function handleImage({ name, link }) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
};

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
  clearValidation(editPopup, validationConfig);
  fillProfileData();
  openModal(editPopup);
});
//Добавление
addPopupButton.addEventListener('click', () => {
  clearValidation(addPopup, validationConfig);
  // очистить поля формы, если нужно
  const formAdd = addPopup.querySelector('.popup__form');
  formAdd.reset();
  // отключить кнопку
  const submitBtn = formAdd.querySelector('.popup__button');
  submitBtn.classList.add(validationConfig.inactiveButtonClass);
  submitBtn.disabled = true;
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

// Функция открытия окна подтверждения
export function openDeleteConfirmation(cardElement, cardId) {
  cardToDelete = cardElement;
  cardIdToDelete = cardId;
  openModal(confirmPopup);
};

// Обработчик кнопки "Да" в попапе подтверждения
confirmButton.addEventListener('click', () => {
  if (cardIdToDelete) {
    // Отправляем DELETE-запрос
    deleteCardApi(cardIdToDelete)
      .then(() => {
        // После успешного удаления — удаляем карточку со страницы
        if (cardToDelete) {
          cardToDelete.remove();
        }
        // Обнуляем переменные
        cardToDelete = null;
        cardIdToDelete = null;
        closeModal(confirmPopup);
      })
      .catch((err) => {
        console.error(`Ошибка при удалении карточки: ${err}`);
        // Можно добавить отображение ошибки пользователю
        closeModal(confirmPopup);
      });
  }
});

//Обработчик формы редактирования профиля
profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newName = nameInput.value;
  const newAbout = jobInput.value;
  const saveButton = profileFormElement.querySelector('.popup__button');

  // Меняем текст кнопки
  saveButton.textContent = 'Сохранение...';

  updateUserInfo(newName, newAbout)
    .then((updatedUserData) => {
      profileTitle.textContent = updatedUserData.name;
      profileDescription.textContent = updatedUserData.about;
      profileTitle.dataset.userId = updatedUserData._id;
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении профиля: ${err}`);
    })
    .finally(() => {
      // Возвращаем исходный текст
      saveButton.textContent = 'Сохранить';
      closeModal(editPopup);
    });
});

// Обработчик формы добавления новой карточки
cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const placeName = placeInput.value; 
  const link = linkInput.value;
  const saveButton = evt.target.querySelector('.popup__button');

  saveButton.textContent = 'Сохранение...';

  addCard(placeName, link)
    .then((newCardData) => {
      const newCardElement = createCard(newCardData, deleteCard, handleLike, handleImage, cardTemplate);
      cardContainer.prepend(newCardElement);
      evt.target.reset();
      // отключить кнопку
      saveButton.classList.add(validationConfig.inactiveButtonClass);
      saveButton.disabled = true;
      closeModal(addPopup);
    })
    .catch((err) => {
      console.error(`Ошибка при добавлении карточки: ${err}`);
    })
    .finally(() => {
      // Возвращаем текст кнопки
      saveButton.textContent = 'Сохранить';
    });
});

//Получаем карточки при загрузке страницы
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    window.currentUserId = userData._id; 

    // Обновляем профиль 
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;

    // Обновляем аватар
    const profileImage = document.querySelector('.profile__image');
    if (profileImage) {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
    }

    // Отрисовка карточек
    renderCards(cards);
  })
  .catch((err) => {
    console.error(`Ошибка при загрузке данных: ${err}`);
  });
//Функция добавления карточек на страницу
  function renderCards(cards) {
  cards.forEach((cardData) => {
    const cardElement = createCard(cardData, deleteCard, handleLike, handleImage, cardTemplate);
    cardContainer.append(cardElement);
  });
};


//Работа попапа обновления аватара
//Открытие попапа аватара
updateAvatarButton.addEventListener('click', () => {
  // Очищаем форму
  avatarForm.reset();
  // Отключаем кнопку отправки
  const submitBtn = avatarForm.querySelector('.popup__button');
  submitBtn.classList.add(validationConfig.inactiveButtonClass);
  submitBtn.disabled = true;
  // Открываем попап
  openModal(avatarPopup);
});
//Обработка формы обновления аватара
avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newAvatarLink = avatarLinkInput.value;
  const saveButton = avatarForm.querySelector('.popup__button');

  saveButton.textContent = 'Сохранение...';

  updateUserAvatar(newAvatarLink)
    .then((updatedUserData) => {
      const profileImage = document.querySelector('.profile__image');
      if (profileImage) {
        profileImage.style.backgroundImage = `url(${updatedUserData.avatar})`;
      }
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении аватара: ${err}`);
    })
    .finally(() => {
      saveButton.textContent = 'Сохранить';
      closeModal(avatarPopup);
    });
});