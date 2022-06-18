const getHistorySliceCache = {};

const getHistorySlice = (combo, guess) => {
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
};

export default getHistorySlice;
