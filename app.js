const chars = "abcdef";

const allPegCombos = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 0],
  [2, 1],
  [2, 2],
  [3, 0],
  [3, 1],
  [4, 0],
];

const historyPlaceholder = document.getElementById("history-placeholder");
const historyBox = document.getElementById("history");
const controls = document.querySelectorAll(".controls > .column > div");
const btnSubmit = document.getElementById("btn-submit");
const btnUndo = document.getElementById("btn-undo");

function fitsClues(history, combo) {
  const comboChars = new Set(combo);
  for (let i = 0; i < history.length; i++) {
    const [prevCombo, reds, whites] = history[i];
    if (combo === prevCombo) {
      return false;
    }
    if (reds === 0) {
      for (let j = 0; j < prevCombo.length; j++) {
        if (prevCombo[j] === combo[j]) {
          return false;
        }
      }
    }
    const totalPegs = reds + whites;
    if (totalPegs === 0) {
      for (let j = 0; j < prevCombo.length; j++) {
        if (comboChars.has(prevCombo[j])) {
          return false;
        }
      }
    } else {
      let exactMatches = 0;
      for (let j = 0; j < prevCombo.length; j++) {
        if (prevCombo[j] === combo[j]) {
          exactMatches++;
        }
      }
      const prevFreq = {};
      const comboFreq = {};
      for (let j = 0; j < prevCombo.length; j++) {
        prevFreq[prevCombo[j]] = (prevFreq[prevCombo[j]] || 0) + 1;
        comboFreq[combo[j]] = (comboFreq[combo[j]] || 0) + 1;
      }
      let overlapCount = 0;
      for (const char in prevFreq) {
        overlapCount += Math.min(prevFreq[char] || 0, comboFreq[char] || 0);
      }
      if (exactMatches !== reds || overlapCount < totalPegs) {
        return false;
      }
    }
  }
  return true;
}

function getPossibleSecretCodes(history) {
  let possibleSecretCodes = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      for (let k = 0; k < 6; k++) {
        for (let l = 0; l < 6; l++) {
          const current = chars[i] + chars[j] + chars[k] + chars[l];
          if (fitsClues(history, current)) {
            possibleSecretCodes++;
          }
        }
      }
    }
  }
  return possibleSecretCodes;
}

function getFeedback(history, guess) {
  const possibleResults = [];
  allPegCombos.forEach(([red, white]) => {
    const possibleSecretCodes = getPossibleSecretCodes([
      ...history,
      [guess, red, white],
    ]);
    if (possibleSecretCodes) {
      possibleResults.push([red, white, possibleSecretCodes]);
    }
  });
  if (!possibleResults.length) {
    return {
      red: 4,
      white: 0,
    };
  }
  possibleResults.sort((a, b) => b[2] - a[2]);
  return {
    red: possibleResults[0][0],
    white: possibleResults[0][1],
  };
}

function handleClickControl() {
  this.parentElement.querySelector(".selected").classList.remove("selected");
  this.classList.add("selected");
}

function handleClickSubmit() {
  const history = [];
  const historyRows = historyBox.querySelectorAll(".history-row");
  if (historyRows.length) {
    historyRows.forEach((row) => {
      const sequence = Array.from(row.querySelectorAll(".sequence > div"))
        .map((tile) => tile.className)
        .join("");
      const red = row.querySelectorAll(".red").length;
      const white = row.querySelectorAll(".white").length;
      history.push([sequence, red, white]);
    });
  }
  const guess = Array.from(
    document.querySelectorAll(".controls > .column > .selected")
  )
    .map(
      (selected) =>
        Array.from(selected.classList).filter((val) => val !== "selected")[0]
    )
    .join("");
  const { red, white } = getFeedback(history, guess);
  historyPlaceholder.classList.add("hidden");
  historyBox.innerHTML += `
    <div class="history-row">
      <div class="sequence">
        <div class="${guess[0]}"></div>
        <div class="${guess[1]}"></div>
        <div class="${guess[2]}"></div>
        <div class="${guess[3]}"></div>
      </div>
      <div class="pegs">
        ${'<div class="red"></div>'.repeat(red)}
        ${'<div class="white"></div>'.repeat(white)}
      </div>
    </div>
  `;
  btnUndo.classList.remove("disabled");
}

function handleClickUndo() {
  const historyRows = Array.from(historyBox.querySelectorAll(".history-row"));
  if (!historyRows.length) {
    return;
  }
  if (historyRows.length === 1) {
    historyPlaceholder.classList.remove("hidden");
    btnUndo.classList.add("disabled");
  }
  historyRows[historyRows.length - 1].remove();
}

controls.forEach((control) => {
  control.addEventListener("click", handleClickControl);
});
btnSubmit.addEventListener("click", handleClickSubmit);
btnUndo.addEventListener("click", handleClickUndo);
