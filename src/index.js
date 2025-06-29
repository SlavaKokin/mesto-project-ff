// Импорты
import "./pages/index.css";
import { openModal, closeModal } from "./components/modal.js";
import { createCard, handleLike, deleteCard } from "./components/card.js";
import { enableValidation, clearValidation } from './components/validation.js';
import { getUserInfo, getInitialCards, addCard, updateUserInfo, updateUserAvatar, deleteCardApi } from './components/api.js';

// Глобальные переменные
let currentUserId;
let cardToDelete; // карточка, которую собираемся удалить
let cardIdToDelete; // id карточки

// Элементы
const cardContainer = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

// Модальные окна
const imagePopup = document.querySelector('.popup_type_image');
const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

const editPopupButton = document.querySelector('.profile__edit-button');
const addPopupButton = document.querySelector('.profile__add-button');
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');

const confirmPopup = document.querySelector('.popup_type_confirm');
const confirmButton = confirmPopup.querySelector('.popup__confirm-button');

const avatarPopup = document.querySelector('.popup_type_update-avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarLinkInput = avatarForm.querySelector('input[name="avatar-link"]');
const updateAvatarButton = document.querySelector('.profile__update-avatar-button');

const profileImage = document.querySelector('.profile__image');

const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = profileFormElement.querySelector('input[name="name"]');
const jobInput = profileFormElement.querySelector('input[name="description"]');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

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

// Обработчики открытия попапов
editPopupButton.addEventListener('click', () => {
  clearValidation(editPopup, validationConfig);
  fillProfileData();
  openModal(editPopup);
});
addPopupButton.addEventListener('click', () => {
  clearValidation(addPopup, validationConfig);
  addPopup.querySelector('.popup__form').reset();
  openModal(addPopup);
});
updateAvatarButton.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

// Закрытие попапов
document.querySelectorAll('.popup__close').forEach((closeBtn) => {
  const popup = closeBtn.closest('.popup');
  closeBtn.addEventListener('click', () => closeModal(popup));
});
document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) closeModal(popup);
  });
});

// Заполнение данных профиля
function fillProfileData() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

// Обработчики форм
// Редактирование профиля
profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newName = nameInput.value;
  const newAbout = jobInput.value;
  const saveButton = profileFormElement.querySelector('.popup__button');

  saveButton.textContent = 'Сохранение...';

  updateUserInfo(newName, newAbout)
    .then((updatedUserData) => {
      profileTitle.textContent = updatedUserData.name;
      profileDescription.textContent = updatedUserData.about;
    })
    .catch((err) => console.error(`Ошибка обновления профиля: ${err}`))
    .finally(() => {
      saveButton.textContent = 'Сохранить';
      closeModal(editPopup);
    });
});

// Добавление карточки
cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const placeName = placeInput.value;
  const link = linkInput.value;
  const saveButton = evt.target.querySelector('.popup__button');

  saveButton.textContent = 'Сохранение...';

  addCard(placeName, link)
    .then((newCardData) => {
      const newCard = createCard(newCardData, deleteCard, handleLike, handleImage, cardTemplate, currentUserId, openDeleteConfirmation);
      cardContainer.prepend(newCard);
      evt.target.reset();
      clearValidation(addPopup, validationConfig);
      closeModal(addPopup);
    })
    .catch((err) => console.error(`Ошибка добавления карточки: ${err}`))
    .finally(() => {
      saveButton.textContent = 'Сохранить';
    });
});

// Обновление аватара
avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newAvatarLink = avatarLinkInput.value;
  const saveButton = avatarForm.querySelector('.popup__button');

  saveButton.textContent = 'Сохранение...';

  updateUserAvatar(newAvatarLink)
    .then((updatedUserData) => {
      if (profileImage) {
        profileImage.style.backgroundImage = `url(${updatedUserData.avatar})`;
      }
    })
    .catch((err) => console.error(`Ошибка обновления аватара: ${err}`))
    .finally(() => {
      saveButton.textContent = 'Сохранить';
      closeModal(avatarPopup);
    });
});

// Получение данных при загрузке
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    if (profileImage) {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
    }
    renderCards(cards, currentUserId);
  })
  .catch((err) => console.error(`Ошибка при загрузке данных: ${err}`));

function renderCards(cards, userId) {
  cards.forEach((cardData) => {
    const card = createCard(cardData, deleteCard, handleLike, handleImage, cardTemplate, userId, openDeleteConfirmation);
    cardContainer.append(card);
  });
}

// Обработка изображения карточки
function handleImage({ name, link }) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}

// Открытие окна подтверждения
export function openDeleteConfirmation(cardElement, cardId) {
  cardToDelete = cardElement;
  cardIdToDelete = cardId;
  openModal(confirmPopup);
}

// Подтверждение удаления
confirmButton.addEventListener('click', () => {
  if (cardIdToDelete) {
    deleteCardApi(cardIdToDelete)
      .then(() => {
        if (cardToDelete) cardToDelete.remove();
        cardToDelete = null;
        cardIdToDelete = null;
        closeModal(confirmPopup);
      })
      .catch((err) => console.error(`Ошибка при удалении карточки: ${err}`));
  }
});