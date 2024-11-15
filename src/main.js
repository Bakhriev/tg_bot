import { initModal } from "./modules/modal";
import { showHelpPopup } from "./modules/popups";

// localStorage.clear();
const emailField = document.querySelector("#email");
const emailDisplay = document.querySelector("[data-email-display]");

const timerTextDisplay = document.querySelector("[data-timer-text]");

const steps = document.querySelectorAll(".step");
const prevBtn = document.querySelector("[data-step-prev-btn]");
const nextBtn = document.querySelector("[data-step-next-btn]");

const submitBtn = document.querySelector("[data-submit-btn]");
const resendBtn = document.querySelector("[data-resend-btn]");

const errorModal = initModal();

const handleNextStep = () => {};

const sendCode = async () => {
  const queryParams = new URLSearchParams(document.location.search);

  const order_id = queryParams.get("order_id");
  const order_serial_number = queryParams.get("order_serial_number");

  const email = emailField?.value;

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

  const email = emailField?.value;

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
