import fitsClues from 'fitsClues';

const mapCombosCache = {};
const mapCombos = (history, callback) => {
  const chars = "abcdef";
  const possibleCombos = [];

  const historyStr = history.map((s) => s.join("")).join("");
  if (!callback && mapCombosCache[historyStr]) {
    return mapCombosCache[historyStr];
  }
  const recursor = (combo) => {
    if (combo.length > 3) {
      if (!history.length || fitsClues(history, combo, historyStr)) {
        possibleCombos.push(callback ? callback(combo) : combo);
      }
      return;
    }
    for (let i = 0; i < chars.length; i++) {
      recursor(combo + chars[i]);
    }
  };
  recursor("");
  if (!callback) {
    mapCombosCache[historyStr] = possibleCombos;
  }
  return possibleCombos;
};

export default mapCombos;
