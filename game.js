const fitsCluesCache = {};
const getHistorySliceCache = {};
const mapCombosCache = {};

function fitsClues(history, combo, historyStr) {
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
}

function getHistorySlice(combo, guess) {
  if (getHistorySliceCache[combo + guess]) {
    return getHistorySliceCache[combo + guess];
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
  getHistorySliceCache[combo + guess] = slice;
  return slice;
}

function mapCombos(history, callback) {
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
}

// TODO: adapt to return data instead of console.logging it
function getFeedback(history, guess) {
  const combos = mapCombos(history);
  const numCombos = combos.length;
  const codes = combos.map((code, index) => {
    let total = 0;
    combos.forEach((combo) => {
      const numCombosAfter = mapCombos([
        ...history,
        getHistorySlice(combo, code),
      ]).length;
      total += numCombos - numCombosAfter;
    });
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `Calculating feedback... ${((index * 100) / numCombos).toFixed(2)}%`
    );
    return {
      slice: getHistorySlice(code, guess),
      avg: total / numCombos,
    };
  });
  codes.sort((a, b) => (a.avg > b.avg ? 1 : a.avg < b.avg ? -1 : 0));
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.log(
    [...history, [guess, codes[0].slice[1], codes[0].slice[2]]]
      .map((s) => s.join(":"))
      .join(",")
  );
}
