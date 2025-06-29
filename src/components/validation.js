export function enableValidation(config) {
  const { formSelector, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass } = config;

  const forms = document.querySelectorAll(formSelector);

  forms.forEach((form) => {
    setEventListeners(form, {
      inputSelector,
      submitButtonSelector,
      inactiveButtonClass,
      inputErrorClass,
      errorClass
    });
  });
}

function setEventListeners(form, { inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass }) {
  const inputList = Array.from(form.querySelectorAll(inputSelector));
  const submitButton = form.querySelector(submitButtonSelector);

  toggleButtonState(inputList, submitButton, inactiveButtonClass);

  inputList.forEach((input) => {
    input.addEventListener('input', () => {
      isValid(form, input, { inputErrorClass, errorClass });
      toggleButtonState(inputList, submitButton, inactiveButtonClass);
    });
  });
}

// Проверка валидности
function isValid(form, input, { inputErrorClass, errorClass }) {
  // Проверка встроенной валидности
  if (!input.validity.valid) {
    // Специальная проверка для паттерна
    if (input.pattern && input.value) {
      const regex = new RegExp(input.pattern);
      if (!regex.test(input.value.trim())) {
        // Если не прошла регулярка, показываем кастомное сообщение из data-error-message
        showInputError(form, input, input.dataset.errorMessage || input.validationMessage, { inputErrorClass, errorClass });
        return;
      }
    }
    // Иначе показываем стандартную ошибку
    showInputError(form, input, input.validationMessage, { inputErrorClass, errorClass });
  } else {
    hideInputError(form, input, { inputErrorClass, errorClass });
  }
}

// Отображение ошибки
function showInputError(form, input, errorMessage, { inputErrorClass, errorClass }) {
  const errorElement = form.querySelector(`#${input.id}-error`) || input.nextElementSibling;
  input.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
}

// Скрытие ошибки
function hideInputError(form, input, { inputErrorClass, errorClass }) {
  const errorElement = form.querySelector(`#${input.id}-error`) || input.nextElementSibling;
  input.classList.remove(inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(errorClass);
  input.setCustomValidity('');
}

// Активировать или отключить кнопку
function toggleButtonState(inputList, button, inactiveButtonClass) {
  const hasInvalidInput = inputList.some((input) => !input.validity.valid);
  if (hasInvalidInput) {
    button.classList.add(inactiveButtonClass);
    button.disabled = true;
  } else {
    button.classList.remove(inactiveButtonClass);
    button.disabled = false;
  }
}

// Очистка ошибок и деактивация кнопки
export function clearValidation(form, config) {
  const { inputSelector, submitButtonSelector, inactiveButtonClass } = config;
  const inputs = form.querySelectorAll(inputSelector);
  const submitButton = form.querySelector(submitButtonSelector);

  inputs.forEach((input) => {
    hideInputError(form, input, {
      inputErrorClass: config.inputErrorClass,
      errorClass: config.errorClass
    });
  });

  if (submitButton) {
    submitButton.classList.add(inactiveButtonClass);
    submitButton.disabled = true;
  }
}