// Teachable Machine code
// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/ib5oDKdNm/";

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
    "BROWSER_FFT", // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL);

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
}

async function init() {
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels
  const labelContainer = document.getElementById("label-container");
  for (let i = 0; i < classLabels.length; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  recognizer.listen(result => {
    const scores = result.scores; // probability of prediction for each class
    // render the probability scores per class
    for (let i = 0; i < classLabels.length; i++) {
      const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
      labelContainer.childNodes[i].innerHTML = classPrediction;



      // pelin logiikka
      console.log("classLabels[i] -- ", classLabels[i])
      console.log("result.scores[i] -- ", result.scores[i])
      if (classLabels[i] === "Red" && result.scores[i] > 0.5) {
        handleAnswer("Red")
      }
      if (classLabels[i] === "Green" && result.scores[i] > 0.5) {
        handleAnswer("Green")
      }
      if (classLabels[i] === "Blue" && result.scores[i] > 0.5) {
        handleAnswer("Blue")
      }
    }


  }, {
    includeSpectrogram: true, // in case listen should return result.spectrogram
    probabilityThreshold: 0.75,
    invokeCallbackOnNoiseAndUnknown: true,
    overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
  });

  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 5000);
}




// game code
let r, g, b;
let correctAnswer = "";
let score = 0;

function randomValue() {
  return Math.floor(Math.random() * 256);
}

function generateColor() {
  do {
    r = randomValue();
    g = randomValue();
    b = randomValue();
  } while (r === g || r === b || g === b);

  document.getElementById("colorBox").style.backgroundColor =
    `rgb(${r}, ${g}, ${b})`;

  correctAnswer = getCorrectAnswer(r, g, b);

  document.getElementById("feedback").textContent = "";
  document.getElementById("rgbValue").textContent = "";
}

function getCorrectAnswer(r, g, b) {
  if (r > g && r > b) return "Red";
  if (g > r && g > b) return "Green";
  return "Blue";
}

function handleAnswer(answer) {
  const feedback = document.getElementById("feedback");
  const rgbValue = document.getElementById("rgbValue");

  if (answer === correctAnswer) {
    score++;
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = "❌ Wrong!";
    feedback.style.color = "red";
  }

  rgbValue.textContent = `RGB was (${r}, ${g}, ${b}) — Correct answer: ${correctAnswer}`;
  document.getElementById("score").textContent = `Score: ${score}`;

  setTimeout(generateColor, 1500);
}

// Start game
generateColor();