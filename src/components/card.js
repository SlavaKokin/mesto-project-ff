import { likeCard, unlikeCard } from '../components/api.js';

export function createCard(cardData, deleteCard, handleLike, handleImage, cardTemplate, currentUserId, openDeleteConfirmation) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElement = cardElement.querySelector('.card__like-count');

  cardElement.dataset.cardId = cardData._id;

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  likeCountElement.textContent = cardData.likes.length;

  if (currentUserId && cardData.likes.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Если не владелец - скрыть кнопку удаления
  if (cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', () => {
      openDeleteConfirmation(cardElement, cardData._id);
    });
  }

  likeButton.addEventListener('click', () => {
    handleLike(cardData, likeButton, likeCountElement);
  });

  cardImage.addEventListener('click', () => handleImage({ name: cardData.name, link: cardData.link }));

  return cardElement;
}

export function handleLike(cardData, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const cardId = cardData._id;

  if (!isLiked) {
    likeCard(cardId)
      .then((updatedCard) => {
        likeCountElement.textContent = updatedCard.likes.length;
        likeButton.classList.add('card__like-button_is-active');
        cardData.likes = updatedCard.likes;
      })
      .catch((err) => console.error('Ошибка при лайке:', err));
  } else {
    unlikeCard(cardId)
      .then((updatedCard) => {
        likeCountElement.textContent = updatedCard.likes.length;
        likeButton.classList.remove('card__like-button_is-active');
        cardData.likes = updatedCard.likes;
      })
      .catch((err) => console.error('Ошибка при дизлайке:', err));
  }
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

