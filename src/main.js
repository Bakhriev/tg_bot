import { initCodeInputAutoFocus } from "./modules/autoFocus";
import { initModal } from "./modules/modal";
import { showHelpPopup } from "./modules/popups";

const errorModal = initModal();

const emailField = document.querySelector("#email");
const emailDisplay = document.querySelector("[data-email-display]");

const steps = document.querySelectorAll(".step");
const prevBtn = document.querySelector("[data-step-prev-btn]");
const nextBtn = document.querySelector("[data-step-next-btn]");

const submitBtn = document.querySelector("[data-submit-btn]");

// Пока не очень понятно как использовать
// localStorage.clear();
const STORAGE_KEY = "supercellSendCode";
const STORAGE = JSON.parse(localStorage.getItem(STORAGE_KEY));

const handleNextStep = async () => {
  const email = emailField.value;

  if (!isEmailValid(email)) return;

  sendCode();
  changeStep(1);
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
