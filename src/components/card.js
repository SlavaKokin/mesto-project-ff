//Функции для работы с карточками
import { likeCard, unlikeCard } from '../components/api.js';
import { openDeleteConfirmation } from '../index.js';
//Функция создания карточки
export function createCard(cardData, deleteCard, handleLike, handleImage, cardTemplate) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElement = cardElement.querySelector('.card__like-count'); // добавляем

  // Сохраняем ID карточки в data-атрибуте
  cardElement.dataset.cardId = cardData._id;

  // Установка изображения и названия
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Устанавливаем количество лайков
  likeCountElement.textContent = cardData.likes.length;
  
  // Статус лайка текущего пользователя
  if (window.currentUserId && cardData.likes.some(user => user._id === window.currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  };

  // Отобразить кнопку удаления только для владельца
  if (cardData.owner._id !== window.currentUserId) {
    deleteButton.style.display = 'none';
  } else {
    // Обработка клика по кнопке удаления
    deleteButton.addEventListener('click', () => {
      // Вызов функции открытия окна подтверждения
      openDeleteConfirmation(cardElement, cardData._id);
    });
  }

  // Обработка лайка
  likeButton.addEventListener('click', () => {
    handleLike(cardData, likeButton, likeCountElement);
  });

  // Обработка клика по изображению
  cardImage.addEventListener('click', () => handleImage({ name: cardData.name, link: cardData.link }));
  return cardElement;
}

export function handleLike(cardData, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const cardId = cardData._id;

  if (!isLiked) {
    likeCard(cardId)
      .then((updatedCard) => {
        console.log('Обновленная карточка:', updatedCard);
        likeCountElement.textContent = updatedCard.likes.length;
        likeButton.classList.add('card__like-button_is-active');
        cardData.likes = updatedCard.likes; // обновляем локальные данные
      })
      .catch((err) => {
        console.error('Ошибка при лайке:', err);
      });
  } else {
    unlikeCard(cardId)
      .then((updatedCard) => {
        likeCountElement.textContent = updatedCard.likes.length;
        likeButton.classList.remove('card__like-button_is-active');
        cardData.likes = updatedCard.likes;
      })
      .catch((err) => {
        console.error('Ошибка при дизлайке:', err);
      });
  }
}

//Функция удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove();
};

