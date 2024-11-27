const inputField = document.getElementById("user-input");
const outputDiv = document.getElementById("output");
const chatSection = document.getElementById("chat-section");
const destroyButton = document.getElementById("destroy-button");
const destroySound = document.getElementById("destroy-sound");

// Copy button functionality
const copyButton = document.getElementById("copy-button");
const copyText = document.getElementById("copy-text");

copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(copyText.textContent).then(() => {
    alert("Copied to clipboard: " + copyText.textContent);
  });
});

// Destroy button functionality
destroyButton.addEventListener("click", () => {
  // Destroy button kaybolur
  destroyButton.style.display = "none";

  // Ses efekti oynatılır
  destroySound.play();

  // Chat section yok edilir
  chatSection.style.display = "none";

  // Yazı efektlerini sırayla göster
  displayTypingEffect("Why the fuck did you do that you moron!?", () => {
    displayTypingEffect("Now you can fuck yourself..");
  });
});

// Typing efekti
function displayTypingEffect(text, callback) {
  const container = document.createElement("div");
  container.className = "typing-text";
  outputDiv.appendChild(container);

  let index = 0;
  const interval = setInterval(() => {
    container.textContent += text[index];
    index++;
    if (index === text.length) {
      clearInterval(interval);
      if (callback) callback();
      outputDiv.scrollTop = outputDiv.scrollHeight; // Auto-scroll
    }
  }, 50); // Harflerin yazılma hızı
}

// Metni anında ekleme
function appendOutput(text, type) {
  const container = document.createElement("p");
  container.textContent = text;

  if (type === "user") container.style.color = "#00ff00";
  else if (type === "ai") container.style.color = "#00ffaa";
  else if (type === "error") container.style.color = "#ff0000";

  outputDiv.appendChild(container);
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

// Chat input handling
inputField.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const userInput = inputField.value.trim();
    if (!userInput) return;

    appendOutput(`> ${userInput}`, "user");
    inputField.value = "";

    // "nigga writing..." göstermek için
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "blinking";
    typingIndicator.textContent = "nigga writing...";
    outputDiv.appendChild(typingIndicator);
    outputDiv.scrollTop = outputDiv.scrollHeight;

    try {
      const response = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();

      if (data.response) {
        // Yanıt geldiğinde "nigga writing..." kaldır ve typing efekti göster
        typingIndicator.remove();
        displayTypingEffect(data.response, null);
      } else if (data.error) {
        typingIndicator.remove();
        appendOutput(`Error: ${data.error}`, "error");
      }
    } catch (error) {
      typingIndicator.remove();
      appendOutput("Error: Network issue. Check console for details.", "error");
      console.error("Network Error:", error);
    }
  }
});
