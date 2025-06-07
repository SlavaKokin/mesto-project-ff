//Работа модальных окон
// Функция открытия
export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeByEsc);
};

// Функция закрытия
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeByEsc);
};

// закрытие при клике на Escape
function closeByEsc(evt) {
    if (evt.key === "Escape") {
      const openedPopup = document.querySelector('.popup_is-opened');
      if (openedPopup) {
      closeModal(openedPopup);
    } 
    }
};  