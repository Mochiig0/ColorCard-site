(() => {
  const form = document.getElementById("support-form");
  const submitButton = document.getElementById("support-submit");
  const status = document.getElementById("support-form-status");

  if (
    !(form instanceof HTMLFormElement) ||
    !(submitButton instanceof HTMLButtonElement) ||
    !(status instanceof HTMLElement)
  ) {
    return;
  }

  const endpoint = form.getAttribute("action") ?? "";
  const endpointIsPlaceholder = endpoint.includes("<FORM_ID>");
  const defaultButtonLabel = submitButton.textContent ?? "Send message";

  const setStatus = (state, message, detail = "") => {
    status.dataset.state = state;
    status.replaceChildren();

    const messageElement = document.createElement("strong");
    messageElement.textContent = message;
    status.append(messageElement);

    if (detail) {
      const detailElement = document.createElement("span");
      detailElement.textContent = detail;
      status.append(detailElement);
    }
  };

  if (endpointIsPlaceholder) {
    submitButton.disabled = true;
    setStatus("unavailable", "The support form is not available yet.");
    return;
  }

  submitButton.disabled = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    setStatus("sending", "Sending your message...");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Support request failed");
      }

      form.reset();
      setStatus(
        "success",
        "Thanks — your message has been sent.",
        "We'll reply to the email address you provided.",
      );
    } catch {
      setStatus("error", "We couldn't send your message. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonLabel;
    }
  });
})();
