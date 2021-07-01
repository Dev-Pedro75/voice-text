const buttonRecording = document.querySelector(".button-recording");
const textArea = document.querySelector(".text");
const status = document.querySelector(".status");
const recognition = createRecognition();
const clearTextButton = document.querySelector(".clear-text");
const copyTextButton = document.querySelector(".copy-text");
const playTextButton = document.querySelector(".play-text");
const selectLanguage = document.querySelector(".select");
const characters = document.querySelector(".characters");
const speech = new SpeechSynthesisUtterance();

let listening = false;
let running = false;
let voice = "";
let language = "en";

function updateTextArea() {
  characters.innerHTML = `Characters : ${textArea.value.length}`;
}

function createRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition =
    SpeechRecognition !== undefined ? new SpeechRecognition() : null;

  if (!recognition) {
    textArea.value = "Speech not found";
    return null;
  }

  recognition.language = "language";

  recognition.onstart = () => {
    listening = true;

    buttonRecording.innerHTML = listening
      ? '<i class="fas fa-microphone-slash"></i>'
      : '<i class="fas fa-microphone"></i>';

    status.innerHTML = "Listening...";

    buttonRecording.classList.remove("stop");
    buttonRecording.classList.add("start");
  };

  recognition.onend = () => {
    if (running == true) {
      recognition.start();
      return;
    }

    textArea.value += `${voice} `;
    voice = "";

    updateTextArea();

    listening = false;

    buttonRecording.innerHTML = listening
      ? '<i class="fas fa-microphone-slash"></i>'
      : '<i class="fas fa-microphone"></i>';

    status.innerHTML = "Click button to start";

    buttonRecording.classList.add("stop");
    buttonRecording.classList.remove("start");
  };

  recognition.onresult = (e) => {
    let transcript = e.results[0][0].transcript;
    voice += transcript;

    if (running == true) {
      return;
    }
  };

  return recognition;
}

function speak(text) {
  speech.lang = language;
  speech.text = text;

  speechSynthesis.speak(speech);
}

clearTextButton.addEventListener("click", () => {
  textArea.value = "";
  updateTextArea();
});

selectLanguage.addEventListener("change", () => {
  language = selectLanguage.value;
});

playTextButton.addEventListener("click", () => {
  if (textArea.value.trim() == "") {
    return;
  }

  speak(textArea.value);
});

copyTextButton.addEventListener("click", () => {
  textArea.select();
  document.execCommand("copy");
});

textArea.addEventListener("input", updateTextArea);

buttonRecording.addEventListener("click", (e) => {
  navigator.mediaDevices.getUserMedia({ video: false, audio: true });

  if (!recognition) return;
  recognition.lang = language;
  listening ? recognition.stop() : recognition.start();

  if (!running) {
    running = true;
  } else {
    running = false;
  }
});
