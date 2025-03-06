// TODO: UI interactions will go here

// Example run:

const history = [
  ["abcd", 1, 2], // First guess "abcd" had 1 red peg and 2 white pegs
  ["efba", 0, 3], // Second guess "efba" had 0 red pegs and 3 white pegs
  ["cdfe", 2, 0], // Third guess "cdfe" had 2 red pegs and 0 white pegs
];

const guess = "effe";

console.log("Spinner starts spinning...");
console.time("Total spin time");
getFeedback(history, guess).then((pegs) => {
  console.log(JSON.stringify(pegs));
  console.timeEnd("Total spin time");
});
