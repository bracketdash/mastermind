const historyPlaceholder = document.getElementById("history-placeholder");
const historyBox = document.getElementById("history");
const controls = document.querySelectorAll(".controls > .column > div");
const btnSubmit = document.getElementById("btn-submit");
const btnUndo = document.getElementById("btn-undo");

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
