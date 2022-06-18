const fitsCluesCache = {};

const fitsClues = (history, combo, historyStr) => {
  if (fitsCluesCache[historyStr + combo]) {
    return fitsCluesCache[historyStr + combo];
  }
  let passing = true;
  history.forEach((slice) => {
    if (combo === slice[0]) {
      passing = false;
      return;
    }
    if (!slice[1]) {
      slice[0].split("").some((char, index) => {
        if (char === combo[index]) {
          passing = false;
          return true;
        }
      });
      if (!passing) {
        return;
      }
    }
    const pegs = slice[1] + slice[2];
    const numSameChars = combo
      .split("")
      .filter((c) => slice[0].includes(c)).length;
    if ((!pegs && numSameChars) || (pegs && numSameChars < pegs)) {
      passing = false;
    }
  });
  fitsCluesCache[historyStr + combo] = passing;
  return passing;
};

export default fitsClues;
