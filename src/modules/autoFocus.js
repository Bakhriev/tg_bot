export const initCodeInputAutoFocus = () => {
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
};
