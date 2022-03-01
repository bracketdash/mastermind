// node play aabb:0:0,ccdd:1:1 cdef
const chars = "abcdef";
const guess = process.argv[3].toLowerCase();
const history = process.argv[2]
  .toLowerCase()
  .split(",")
  .map((s) => s.split(":").map((s) => (isNaN(parseInt(s)) ? s : parseInt(s))));
const possibleCombos = [];
const recursor = (prefix) => {
  if (prefix.length > 3) {
    possibleCombos.push(prefix);
    return;
  }
  for (let i = 0; i < chars.length; i++) {
    recursor(prefix + chars[i]);
  }
};
recursor("");
console.log(possibleCombos);
