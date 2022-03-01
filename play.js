// node play aabb:0:0,ccdd:1:1 cdef
const chars = "abcdef";
const guess = process.argv[3].toLowerCase();
const history = process.argv[2]
  .toLowerCase()
  .split(",")
  .map((s) => s.split(":").map((s) => (isNaN(parseInt(s)) ? s : parseInt(s))));
const possibleCombos = [];
const fitsClues = (combo) => {
  let passing = true;
  history.forEach((slice) => {
    // passing = false if any of the below is false:
    // - combo !== slice[0]
    // - if slice has pegs, combo includes the same chars at least equal to the number of pegs
    // - combo does not include any of the same chars in the same spots if no red pegs were assigned
    // - combo does not incllude any of the same chars if no pegs were assigned
  });
  return passing;
};
const recursor = (combo) => {
  if (combo.length > 3) {
    if (fitsClues(combo)) {
      possibleCombos.push(combo);
    }
    return;
  }
  for (let i = 0; i < chars.length; i++) {
    recursor(combo + chars[i]);
  }
};
recursor("");
console.log(possibleCombos);
