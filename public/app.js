const chatHistory = document.querySelector("#chat-history");
const chatForm = document.querySelector("#chat-form");
const messageInput = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const loadingStatus = document.querySelector("#loading-status");
const suggestionButtons = document.querySelectorAll(".suggestion-button");

let conversationId = null;
let isSending = false;

function scrollToLatestMessage() {
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function addMessage(text, kind, sources = []) {
  const article = document.createElement("article");
  article.classList.add("message", `message-${kind}`);

  if (kind === "user") {
    const spacer = document.createElement("span");
    spacer.className = "message-spacer";
    spacer.setAttribute("aria-hidden", "true");
    article.append(spacer);
  } else {
    const avatar = document.createElement("span");
    avatar.className = "message-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "RC";
    article.append(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";

  const label = document.createElement("p");
  label.className = "message-label";
  label.textContent = kind === "user" ? "Tú" : kind === "error" ? "Aviso" : "Asistente Río Claro";

  const messageText = document.createElement("p");
  messageText.className = "message-text";
  messageText.textContent = text;
  content.append(label, messageText);

  if (sources.length > 0) {
    const sourceList = document.createElement("ul");
    sourceList.className = "source-list";
    const sourceHeading = document.createElement("li");
    sourceHeading.className = "source-heading";
    sourceHeading.textContent = "Fuente:";
    sourceList.append(sourceHeading);

    for (const source of sources) {
      if (typeof source !== "string" || source.length === 0) {
        continue;
      }
      const sourceItem = document.createElement("li");
      sourceItem.textContent = source;
      sourceList.append(sourceItem);
    }
    if (sourceList.childElementCount > 1) {
      content.append(sourceList);
    }
  }

  article.append(content);
  chatHistory.append(article);
  scrollToLatestMessage();
}

function setLoading(isLoading) {
  isSending = isLoading;
  messageInput.disabled = isLoading;
  sendButton.disabled = isLoading;
  for (const button of suggestionButtons) {
    button.disabled = isLoading;
  }
  loadingStatus.hidden = !isLoading;
}

async function sendMessage(message) {
  const trimmedMessage = message.trim();
  if (isSending || trimmedMessage.length === 0 || trimmedMessage.length > 2000) {
    return;
  }

  addMessage(trimmedMessage, "user");
  messageInput.value = "";
  setLoading(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: trimmedMessage,
        conversation_id: conversationId,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      addMessage(
        typeof result.error === "string"
          ? result.error
          : "No se pudo completar la consulta. Inténtalo de nuevo.",
        "error",
      );
      return;
    }

    if (
      typeof result.message !== "string" ||
      typeof result.conversation_id !== "string"
    ) {
      addMessage("El servicio devolvió una respuesta no válida. Inténtalo de nuevo.", "error");
      return;
    }

    conversationId = result.conversation_id;
    addMessage(
      result.message,
      "assistant",
      Array.isArray(result.sources) ? result.sources : [],
    );
  } catch {
    addMessage("No se pudo conectar con el asistente. Inténtalo de nuevo.", "error");
  } finally {
    setLoading(false);
    messageInput.focus();
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

for (const button of suggestionButtons) {
  button.addEventListener("click", () => {
    sendMessage(button.textContent);
  });
}
