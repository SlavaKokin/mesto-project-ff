export function enableValidation(config) {
  const { formSelector, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass } = config;

  const forms = document.querySelectorAll(formSelector);
  forms.forEach((form) => {
    const inputs = form.querySelectorAll(inputSelector);
    const submitButton = form.querySelector(submitButtonSelector);

    // Проверка регулярных выражений
    const namePattern = /^[A-Za-zА-Яа-яЁё\- ]+$/;

    // Проверка URL
    const urlPattern = /^(https?:\/\/[^\s]+)$/;

    // Функция проверки поля (с кастомными правилами)
    const validateInput = (input) => {
  let valid = true;
  const value = input.value.trim();

  // Обязательность
  if (!value) {
    input.setCustomValidity('Это поле обязательно.');
    valid = false;
  } else {
    // Проверка по типу поля
    if (input.name === 'name') {
      // Имя
      if (value.length < 2 || value.length > 40) {
        input.setCustomValidity('Должно быть от 2 до 40 символов.');
        valid = false;
      } else if (!namePattern.test(value)) {
        input.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.');
        valid = false;
      } else {
        // Всё хорошо
        input.setCustomValidity('');
      }
    } else if (input.name === 'description') {
      // О себе
      if (value.length < 2 || value.length > 200) {
        input.setCustomValidity('Должно быть от 2 до 200 символов.');
        valid = false;
      } else if (!namePattern.test(value)) {
        input.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.');
        valid = false;
      } else {
        input.setCustomValidity('');
      }
    } else if (input.name === 'place-name') {
      // Название места
      if (value.length < 2 || value.length > 30) {
        input.setCustomValidity('Должно быть от 2 до 30 символов.');
        valid = false;
      } else if (!namePattern.test(value)) {
        input.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.');
        valid = false;
      } else {
        input.setCustomValidity('');
      }
    } else if (input.name === 'link') {
      // Проверка URL
      if (!urlPattern.test(value)) {
        input.setCustomValidity('Введите корректную ссылку.');
        valid = false;
      } else {
        input.setCustomValidity('');
      }
    } else if (input.name === 'avatar-link') {
      // Проверка URL для аватара
      if (!urlPattern.test(value)) {
        input.setCustomValidity('Введите корректную ссылку.');
        valid = false;
      } else {
        input.setCustomValidity('');
      }
    }
  }

  // Установка сообщения ошибки
  const errorElement = form.querySelector(`#${input.id}-error`) || input.nextElementSibling;
  if (!valid) {
    input.classList.add(inputErrorClass);
    errorElement.textContent = input.validationMessage;
    errorElement.classList.add(errorClass);
  } else {
    input.classList.remove(inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(errorClass);
  }
  return valid;
};

    // Проверка всей формы
    const checkFormValidity = () => {
      let isValidForm = true;
      inputs.forEach((input) => {
        const validInput = validateInput(input);
        if (!validInput) {
          isValidForm = false;
        }
      });
      // Управление кнопкой
      if (isValidForm) {
        submitButton.classList.remove(inactiveButtonClass);
        submitButton.disabled = false;
      } else {
        submitButton.classList.add(inactiveButtonClass);
        submitButton.disabled = true;
      }
    };

    // Обработчики input
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        validateInput(input);
        checkFormValidity();
      });
    });

    // Изначально отключить кнопку
    checkFormValidity();

    // Обработка сабмита
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      // Проверить все поля
      inputs.forEach((input) => validateInput(input));
      checkFormValidity();

      if (form.checkValidity()) {
        // Можно оставить по дефолту или реализовать отправку
      }
    });
  });
}

export function clearValidation(form, config) {
  const { inputSelector, submitButtonSelector, inactiveButtonClass } = config;

  const inputs = form.querySelectorAll(inputSelector);
  const submitButton = form.querySelector(submitButtonSelector);

  inputs.forEach((input) => {
    input.classList.remove(config.inputErrorClass);
    const errorElement = form.querySelector(`#${input.id}-error`) || input.nextElementSibling;
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
    // Обнуляем кастомные сообщения
    input.setCustomValidity('');
  });
  // Отключить кнопку
  submitButton.classList.add(inactiveButtonClass);
  submitButton.disabled = true;
}