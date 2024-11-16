import { initCodeInputAutoFocus } from "./modules/autoFocus";
import { initModal } from "./modules/modal";
import { showHelpPopup, showTimerPopup } from "./modules/popups";

const errorModal = initModal();

const emailField = document.querySelector("#email");
const emailDisplay = document.querySelector("[data-email-display]");

const resendWrapper = document.querySelector(".resend-wrapper");
const resendBtn = document.querySelector("[data-resend-btn]");

const timerDisplay = document.querySelector("[data-timer-text]");

const steps = document.querySelectorAll(".step");
const prevBtn = document.querySelector("[data-step-prev-btn]");
const nextBtn = document.querySelector("[data-step-next-btn]");

const submitBtn = document.querySelector("[data-submit-btn]");

// Пока не очень понятно как использовать
localStorage.clear();
const STORAGE_KEY = "supercellSendCode";
const STORAGE = JSON.parse(localStorage.getItem(STORAGE_KEY));

const getInfo = async () => {
  const data = await fetch(
    "https://67373faaaafa2ef2223329b8.mockapi.io/supercell_otpravka_koda"
  ).then((res) => res.json());

  return {
    email: data[0]?.email ?? null,
    canSendCode: data[0]?.can_send_code ?? true,
    secondsPassed: data[0]?.seconds_passed ?? 58,
  };
};

const handleNextStep = async () => {
  const currentEmail = emailField.value;

  if (!isEmailValid(currentEmail)) return;

  nextBtn.classList.add("loading");

  const { email, canSendCode, secondsPassed } = await getInfo();

  if (!canSendCode) {
    changeStep(1);

    emailDisplay.textContent = email;
    nextBtn.classList.remove("loading");

    startTimer(secondsPassed);

    return;
  }

  await sendCode();
  changeStep(1);
  emailDisplay.textContent = currentEmail;
  startTimer(58);
  nextBtn.classList.remove("loading");
};

let interval;
const startTimer = (secondsPassed) => {
  clearInterval(interval);

  if (secondsPassed >= 60) return;

  let time = 60 - secondsPassed;

  resendWrapper.classList.add("hidden");
  timerDisplay.classList.remove("hidden");
  timerDisplay.textContent = `Код отправлен. Повторная отправка будет доступна через ${time} секунд`;

  interval = setInterval(() => {
    time--;
    timerDisplay.textContent = `Код отправлен. Повторная отправка будет доступна через ${time} секунд`;

    if (time <= 0) {
      clearInterval(interval);
      timerDisplay.classList.add("hidden");
      resendWrapper.classList.remove("hidden");
    }
  }, 1000);
};

const sendCode = async () => {
  const queryParams = new URLSearchParams(document.location.search);
  const order_id = queryParams.get("order_id");
  const order_serial_number = queryParams.get("order_serial_number");

  const email = emailField.value;

  try {
    const response = await page.executeBackendScenario(
      "supercell_otpravka_koda",
      {
        order_id,
        order_serial_number,
        email,
      },
      {}
    );

    if (!response.ok) {
      errorModal.show(response.message);
    }
  } catch (error) {
    console.error("Error sending code:", error);
  }
};

const compareCode = () => {
  const queryParams = new URLSearchParams(document.location.search);
  const order_id = queryParams.get("order_id");
  const order_serial_number = queryParams.get("order_serial_number");

  const email = emailField.value;
  const code = getCode();

  if (code.length !== 6) return;

  try {
    page
      .executeBackendScenario(
        "supercell_proverka_koda",
        {
          order_id,
          order_serial_number,
          email,
          code,
        },
        {}
      )
      .then((res) => {
        if (!res.ok) {
          errorModal.show(res.message);
        }
      });
  } catch (error) {
    console.error("Error confirm code:", error);
  }
};

// Util functions
const getCode = () => {
  const inputs = Array.from(document.querySelectorAll(".code"));
  return inputs.map((input) => input.value).join("");
};

const changeStep = (index) => {
  steps.forEach((step, i) => {
    step.dataset.visible = i === index ? "true" : "false";
  });
};

const isEmailValid = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

initCodeInputAutoFocus();

// Primary code

prevBtn?.addEventListener("click", () => changeStep(0));

nextBtn?.addEventListener("click", handleNextStep);

submitBtn?.addEventListener("click", compareCode);

resendBtn.addEventListener("click", async () => {
  submitBtn.classList.add("loading");

  const { secondsPassed } = await getInfo();

  await sendCode();
  startTimer(secondsPassed);

  submitBtn.classList.remove("loading");
});

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
//
//
//
//
//
//
const helpBtns = document.querySelectorAll("[data-help-btn]");
helpBtns.forEach((helpBtn) => helpBtn.addEventListener("click", showHelpPopup));
