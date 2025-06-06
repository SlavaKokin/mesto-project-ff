//Работа модальных окон
// Функция открытия
export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  addEscListener(popup);
}

// Функция закрытия
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
}


// закрытие при клике на Escape
export function addEscListener(popup) {
  const onEsc = (evt) => {
    if (evt.key === 'Escape') {
      closeModal(popup);
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
};