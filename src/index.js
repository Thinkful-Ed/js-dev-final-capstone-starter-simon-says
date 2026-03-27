/**
 * DOM SELECTORS
 */

const startButton = document.querySelector(".js-start-button"); //Use querySelector() to get the start button element
const statusSpan = document.querySelector(".js-status"); // Use querySelector() to get the status element
const heading = document.querySelector(".js-heading"); // Use querySelector() to get the heading element
const padContainer = document.querySelector(".js-pad-container"); // Use querySelector() to get the pad container element
const dropDown = document.querySelector(".js-dropdown"); // Use querySelector() to get the dropdown element
/**
 * VARIABLES
 */
let computerSequence = []; // track the computer-generated sequence of pad presses
let playerSequence = []; // track the player-generated sequence of pad presses
let maxRoundCount = 0; // the max number of rounds, varies with the chosen level
let roundCount = 0; // track the number of rounds that have been played so far

/**
 *
 * The `pads` array contains an array of pad objects.
 *
 * Each pad object contains the data related to a pad: `color`, `sound`, and `selector`.
 * - The `color` property is set to the color of the pad (e.g., "red", "blue").
 * - The `selector` property is set to the DOM selector for the pad.
 * - The `sound` property is set to an audio file using the Audio() constructor.
 * Audio file for the red pad: "../assets/simon-says-sound-1.mp3"
 * Audio file for the green pad: "../assets/simon-says-sound-2.mp3"
 * Audio file for the blue pad: "../assets/simon-says-sound-3.mp3"
 * Audio file for the yellow pad: "../assets/simon-says-sound-4.mp3"
 *
 */

const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("assets/simon-says-sound-1.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("assets/simon-says-sound-3.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("assets/simon-says-sound-2.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("assets/simon-says-sound-4.mp3"),
  },
];

/**
 * EVENT LISTENERS
 */

padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);

/**
 * EVENT HANDLERS
 */

/**
 * Called when the start button is clicked.
 */
function startButtonHandler() {
  onChange(); //sets the level of the game from the dropdown
  roundCount = roundCount + 1; // incements round count from 0 to 1
  startButton.classList.add("hidden"); // hides the start button now that button has been clicked
  statusSpan.classList.remove("hidden"); // reveals the status element so status messages show
  playComputerTurn(); // start the game with the computer going first
}

/**
 * Called when one of the pads is clicked.
 */
function padHandler(event) {
  const { color } = event.target.dataset; //extracts the value of `data-color`attribute on the element that was clicked and stores it in the `color` variable
  if (!color) return; // exits the function if the `color` variable is falsy
  const pad = pads.find((pad) => pad.color === color); //retrieve the pad from the `pads` array and store it in a variable called `pad`
  pad.sound.play(); //plays sound that matches the color
  checkPress(color); //verify the player's selection
  return color; // Return the `color` variable as the output
}

/**
 * HELPER FUNCTIONS
 */

/**
 * Returns a randomly selected item from a given array.
 */
function getRandomItem(collection) {
  if (collection.length === 0) return null; //return null if array is empty
  const randomIndex = Math.floor(Math.random() * collection.length); //ensures the randomIndex value is within the array length
  return collection[randomIndex];
}

/**
 * Sets the status text of a given HTML element with a given a message
 */
function setText(element, text) {
  element.textContent = text;
  return element;
}

/**
 * Activates a pad of a given color by playing its sound and light
 */

function activatePad(color) {
  let pad = pads.find((pad) => pad.color === color); //returns object where colors equal
  pad.selector.classList.add("activated"); //activates to indicate selected pad
  pad.sound.play(); // plays sound
  setTimeout(() => pad.selector.classList.remove("activated"), 300); // deactivates indicator of selected pad
}

/**
 * Activates a sequence of colors passed as an array to the function
 */

function activatePads(sequence) {
  sequence.forEach((element, i) => {
    //Iterates over the `sequence` array
    setTimeout(() => activatePad(element), 800 * (i + 1)); //calls `activatePad()`, adding a delay between each press
  });
}

/**
 * Allows the computer to play its turn.
 */
function playComputerTurn() {
  padContainer.classList.add("unclickable"); //makes pads unclickable by user
  dropDown.classList.add("unclickable"); //makes dropdown unselectable as game has started
  setText(statusSpan, "The computer's turn..."); //shows when it is computer's turn
  let maxRoundCount = onChange(); //sets max number of rounds
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`); // displays current round and max rounds
  computerSequence.push(getRandomItem(pads).color); // adds random color to array
  activatePads(computerSequence); //calls color sequence
  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 1000); //calls player's turn after computers turn finishes
}

/**
 * Allows the player to play their turn.
 */
function playHumanTurn() {
  padContainer.classList.remove("unclickable"); //makes pads clickable
  dropDown.classList.add("unclickable"); // dropdown unclickable as game has started
  setText(
    statusSpan,
    `Player has ${
      computerSequence.length - playerSequence.length
    } presses left!`
  ); // number of player presses left
}

/**
 * Checks the player's selection every time the player presses on a pad during
 * the player's turn
 */
function checkPress(color) {
  playerSequence.push(color); //adds player's color selection to player array
  let index = playerSequence.length - 1; // stores index of color variable
  let remainingPresses = computerSequence.length - playerSequence.length; // stores remaining presses value
  setText(statusSpan, `${remainingPresses} presses remain`); // displays remaining presses
  if (computerSequence[index] !== playerSequence[index]) {
    resetGame("Try Again!"); // display message player's press was not correct
    return; //exit game
  }
  if (remainingPresses === 0) {
    checkRound(); //calls checkRound() as no more presses are needed
    return;
  }
}

/**
 * Checks each round to see if the player has completed all the rounds of the game * or advance to the next round if the game has not finished.
 */

function checkRound() {
  let maxRoundCount = onChange(); //max number of rounds is bases on level selection
  if (playerSequence.length === maxRoundCount) {
    //if length of playerSequesnce array matches maxRound count player wins
    resetGame("You WIN!!!"); //calls the game reset function as player won
  } else {
    roundCount = roundCount + 1; // increases count to next round
    playerSequence = []; //empties player array in prep for next round
    setTimeout(() => playComputerTurn(), 1000); // calls computers turn to start next round
  }
}

/**
 * Resets the game. Called when either the player makes a mistake or wins the game.
 */
function resetGame(text) {
  computerSequence = []; //Reset `computerSequence` to an empty array
  playerSequence = []; //Reset `playerSequence` to an empty array
  roundCount = 0; //Reset `roundCount` to an empty array
  alert(text); //Resets alert window
  setText(heading, "Simon Says"); //Resets heading
  startButton.classList.remove("hidden"); // shows start button
  statusSpan.classList.add("hidden"); // hides status text prior to game start
  padContainer.classList.add("unclickable"); // makes pad container unclickable
  resetDropdown(); // resets level selection dropdown
}

/**
 * When the level is selected from the dropdown the number of rounds is determined.
 *  Level 1: 8 rounds
 *  Level 2: 14 rounds
 *  Level 3: 20 rounds
 *  Level 4: 31 rounds
 */
var e = document.getElementById("levelSelect");
function onChange() {
  var level = e.value;
  var text = e.options[e.selectedIndex].text;
  console.log(level, text);
  if (level === "1") {
    return 8;
  } else if (level === "2") {
    return 14;
  } else if (level === "3") {
    return 20;
  } else if (level === "4") {
    return 31;
  }
}
e.onchange = onChange;
onChange(); //calls level selection

/**
 * Resets the dropdown and makes clickable for Level selection
 */
function resetDropdown() {
  var dropDown = document.getElementById("levelSelect");
  dropDown.selectedIndex = 0;
  dropDown.classList.remove("unclickable");
}

/**
 * Used for testing purposes.
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
//window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame
