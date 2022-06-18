import getHistorySlice from 'getHistorySlice';
import mapCombos from 'mapCombos';

// TODO: adapt to return data instead of console.logging it

const getFeedback = (history, guess) => {
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
};

export default getFeedback;
