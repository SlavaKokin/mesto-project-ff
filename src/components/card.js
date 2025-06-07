//Функции для работы с карточками
//Функция создания карточки
export function createCard(dataCard, deleteCard, handleLike, handleImage, cardTemplate) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = dataCard.link;
  cardImage.alt = dataCard.name;
  cardTitle.textContent = dataCard.name;

  //Обработчик кнопки удаления
  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement);
  });

  // Обработчик лайка
  likeButton.addEventListener('click', handleLike);

  // Обработчик клика по изображению
  cardImage.addEventListener('click', () => handleImage({ name: dataCard.name, link: dataCard.link }));
  return cardElement;
};

//Обработчик кнопки лайка
export function handleLikeButtonClick(event) {
  event.target.classList.toggle('card__like-button_is-active');
};

//Функция удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove();
};

