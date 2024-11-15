localStorage.clear();
const emailField = document.querySelector("#email");
const emailDisplay = document.querySelector("[data-email-display]");
const timerTextDisplay = document.querySelector("[data-timer-text] span");
const steps = document.querySelectorAll(".step");
const prevBtn = document.querySelector("[data-step-prev-btn]");
const nextBtn = document.querySelector("[data-step-next-btn]");
const submitBtn = document.querySelector("[data-submit-btn]");
const resendBtn = document.querySelector("[data-resend-btn]");

// LocalStorage Interface
// supercellSendCode: {"time": "", "email": "", canSendCode: ""}

// Данные из localStorage
const currentUser = JSON.parse(localStorage.getItem("supercellSendCode"));

let interval;
let canSendCode = currentUser?.canSendCode ?? true;
let currentEmail = currentUser?.email ?? "";

const queryParams = new URLSearchParams(document.location.search);
const orderId = queryParams.get("order_id", null);
const orderSerialNumber = queryParams.get("order_serial_number", null);

prevBtn?.addEventListener("click", () => changeStep(0));

nextBtn?.addEventListener("click", handleNextStep);

resendBtn?.addEventListener("click", handleResendCode);

function handleNextStep() {
  if (!isEmailValid(emailField.value)) return;
}

// Функция отправки кода от пользователя
async function sendCode() {
  console.log("sended code to user email");

  try {
    page
      .executeBackendScenario(
        "supercell_otpravka_koda",
        {
          order_id: orderId,
          order_serial_number: orderSerialNumber,
          email: emailField?.value,
        },
        {}
      )
      .then((res) => {
        if (!res.ok) {
          errorModal.setText(res.message);
          errorModal.show();
        }
      });
  } catch (error) {
    console.error("Error sending code:", error);
  }
}

// Обработчик повторной отправки кода
function handleResendCode() {
  if (canSendCode) {
    sendCode();
    startTimer();
    hideResend();
  }
}

// Функция для получения кода из input
function getCode() {
  const inputs = Array.from(document.querySelectorAll(".code"));
  return inputs.map((input) => input.value).join("");
}

function updateTimerDisplay() {
  timerTextDisplay.textContent = "2";
}

// Получение текущего времени таймера из localStorage
function getCurrentTime() {
  const savedTime = localStorage.getItem("time");
  let currentTime = savedTime
    ? 60 - Math.trunc((Date.now() - +savedTime) / 1000)
    : 60;
  return currentTime;
}

submitBtn?.addEventListener("click", () => {
  compareCode();
});

async function compareCode() {
  const code = getCode();
  if (code.length !== 6) return;

  try {
    page
      .executeBackendScenario(
        "supercell_proverka_koda",
        {
          order_id: orderId,
          order_serial_number: orderSerialNumber,
          email: emailField?.value,
          code: code,
        },
        {}
      )
      .then((res) => {
        if (!res.ok) {
          errorModal.setText(res.message);
          errorModal.show();
        }
      });
  } catch (error) {
    console.error("Error confirm code:", error);
  }
}

// Utils
//
//
//
//
//
//
//
//
//
//
//

// Установка email на странице
function setEmail() {
  const savedEmail = localStorage.getItem("email"); // Берем email из localStorage
  emailDisplay.textContent = savedEmail; // Показываем сохраненный email
}

function initModal() {
  const errorModal = document.querySelector('[data-modal="error"]');
  const modalErrorText = errorModal?.querySelector?.("[data-modal-error-text]");
  const closeBtn = errorModal?.querySelector?.("[data-destroyer]");

  const show = () => errorModal?.classList.add("active");
  const hide = () => errorModal?.classList.remove("active");

  const setText = (text) => {
    modalErrorText.textContent = text;
  };

  errorModal?.addEventListener(
    "click",
    (e) => e.target === errorModal && hide()
  );

  closeBtn?.addEventListener("click", hide);

  return { show, hide, setText };
}

const errorModal = initModal();

// Тут никакой логики, просто показываем help popup

function showHelpPopup() {
  const popup = page.getPopup("popup-faq");
  popup.show();
  errorModal.hide();
}

const helpBtns = document.querySelectorAll("[data-help-btn]");
helpBtns.forEach((helpBtn) => helpBtn.addEventListener("click", showHelpPopup));

// Показ popup-таймера
function showTimerPopup() {
  const popup = page.getPopup("popup-timer");
  popup.show();
  errorModal.hide();
}

// Автоматический переход фокуса при вводе кода
function initCodeInputAutoFocus() {
  const codeInputs = document.querySelectorAll(".code");

  codeInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1) {
        const nextInput = codeInputs[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "") {
        const prevInput = codeInputs[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    });
  });
}

initCodeInputAutoFocus();

// Utils

// Показать кнопку повторной отправки
function showResend() {
  document.querySelector(".resend-wrapper")?.classList.remove("hidden");
}

// Скрыть кнопку повторной отправки
function hideResend() {
  document.querySelector(".resend-wrapper")?.classList.add("hidden");
}

// Очистка текста таймера
function clearTime() {
  timerTextDisplay?.classList.add("hidden");
}

// Проверка на валидность email
function isEmailValid(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Смена шага
function changeStep(index) {
  steps.forEach((step, i) => {
    step.dataset.visible = i === index ? "true" : "false";
  });
}
