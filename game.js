const chars = "abcdef";
const fitsCluesCache = {};
const getHistorySliceCache = {};
const mapCombosCache = {};

function fitsClues(history, combo, historyStr) {
  const cacheKey = historyStr + combo;
  if (fitsCluesCache[cacheKey] !== undefined) {
    return fitsCluesCache[cacheKey];
  }
  let passing = true;
  for (let i = 0; i < history.length; i++) {
    const slice = history[i];
    if (combo === slice[0]) {
      passing = false;
      break;
    }
    if (!slice[1]) {
      for (let j = 0; j < slice[0].length; j++) {
        if (slice[0][j] === combo[j]) {
          passing = false;
          break;
        }
      }
      if (!passing) {
        break;
      }
    }
    const pegs = slice[1] + slice[2];
    const numSameChars = combo
      .split("")
      .filter((c) => slice[0].includes(c)).length;
    if ((!pegs && numSameChars) || (pegs && numSameChars < pegs)) {
      passing = false;
      break;
    }
  }
  fitsCluesCache[cacheKey] = passing;
  return passing;
}

function getHistorySlice(combo, guess) {
  const cacheKey = combo + guess;
  if (getHistorySliceCache[cacheKey] !== undefined) {
    return getHistorySliceCache[cacheKey];
  }
  let red = 0;
  let white = 0;
  guess.split("").forEach((char, index) => {
    if (char === combo[index]) {
      red++;
    } else if (combo.includes(char)) {
      white++;
    }
  });
  const slice = [combo, red, white];
  getHistorySliceCache[cacheKey] = slice;
  return slice;
}

function mapCombos(history, callback) {
  const possibleCombos = [];
  const historyStr = history.map((s) => s.join("")).join("");
  if (!callback && mapCombosCache[historyStr] !== undefined) {
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
}

function getFeedback(history, guess) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const combos = mapCombos(history);
      const numCombos = combos.length;
      const codes = combos.map((code) => {
        let total = 0;
        combos.forEach((combo) => {
          const numCombosAfter = mapCombos([
            ...history,
            getHistorySlice(combo, code),
          ]).length;
          total += numCombos - numCombosAfter;
        });
        return {
          slice: getHistorySlice(code, guess),
          avg: total / numCombos,
        };
      });
      codes.sort((a, b) => (a.avg > b.avg ? 1 : a.avg < b.avg ? -1 : 0));
      resolve({
        red: codes[0].slice[1],
        white: codes[0].slice[2],
      });
    }, 0);
  });
}
