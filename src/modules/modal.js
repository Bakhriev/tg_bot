export const initModal = () => {
  const errorModal = document.querySelector('[data-modal="error"]');
  const modalErrorText = errorModal?.querySelector?.("[data-modal-error-text]");
  const closeBtn = errorModal?.querySelector?.("[data-destroyer]");

  const show = (text) => {
    modalErrorText.textContent = text;
    errorModal?.classList.add("active");
  };

  const hide = () => errorModal?.classList.remove("active");

  errorModal?.addEventListener(
    "click",
    (e) => e.target === errorModal && hide()
  );

  closeBtn?.addEventListener("click", hide);

  return { show, hide };
};
