export const showHelpPopup = () => {
  const popup = page.getPopup("popup-faq");
  popup.show();
  errorModal.hide();
};

// Показ popup-таймера
export const showTimerPopup = () => {
  const popup = page.getPopup("popup-timer");
  popup.show();
  errorModal.hide();
};
