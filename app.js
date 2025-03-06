const divider = document.getElementById("divider");
const msgThinking = document.getElementById("thinking");
const controls = document.querySelectorAll(".controls > .column > div");
const btnSubmit = document.getElementById("btn-submit");
const btnUndo = document.getElementById("btn-undo");

function handleClickControl() {
  this.parentElement.querySelector(".selected").classList.remove("selected");
  this.classList.add("selected");
}

function handleClickSubmit() {
  msgThinking.classList.remove("hidden");
  const history = [];
  const historyRows = document.querySelectorAll(".history-row:not(.initial)");
  if (historyRows.length) {
    // TODO: get the actual history from each history-row
    // const history = [
    //   ["abcd", 1, 2], // First guess "abcd" had 1 red peg and 2 white pegs
    //   ["efba", 0, 3], // Second guess "efba" had 0 red pegs and 3 white pegs
    //   ["cdfe", 2, 0], // Third guess "cdfe" had 2 red pegs and 0 white pegs
    // ];
  }
  let guess = "";
  document
    .querySelectorAll(".controls > .column > .selected")
    .forEach((selected) => {
      guess += Array.from(selected.classList).filter(
        (val) => val !== "selected"
      )[0];
    });

  // DEBUGGING
  console.log("history:");
  console.log(JSON.stringify(history));
  console.log(`guess: ${guess}`);

  getFeedback(history, guess).then((pegs) => {
    msgThinking.classList.add("hidden");
    // TODO: remove .history-row.initial if still present

    // DEBUGGING
    console.log(pegs);

    // TODO: add a new history-row with guess and pegs
    // TODO: reset controls to all red/a
  });
}

function handleClickUndo() {
  // TODO
}

controls.forEach((control) => {
  control.addEventListener("click", handleClickControl);
});
btnSubmit.addEventListener("click", handleClickSubmit);
btnUndo.addEventListener("click", handleClickUndo);
