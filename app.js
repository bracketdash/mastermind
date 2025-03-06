const msgThinking = document.getElementById("thinking");
const controls = document.querySelectorAll(".controls > .column > div");
const btnSubmit = document.getElementById("btn-submit");
const btnUndo = document.getElementById("btn-undo");

function handleSubmitClick() {
  msgThinking.classList.remove("hidden");
  // TODO: get the actual history from each history-row
  const history = [
    ["abcd", 1, 2], // First guess "abcd" had 1 red peg and 2 white pegs
    ["efba", 0, 3], // Second guess "efba" had 0 red pegs and 3 white pegs
    ["cdfe", 2, 0], // Third guess "cdfe" had 2 red pegs and 0 white pegs
  ];
  // TODO: get the user's actual guess from controls selected classes
  const guess = "effe";
  getFeedback(history, guess).then((pegs) => {
    msgThinking.classList.add("hidden");
    // TODO: add a new history-row (removing .initial if still present)
  });
}
