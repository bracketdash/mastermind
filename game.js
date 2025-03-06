const chars = "abcdef";
const possibleSolutions = [];
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 6; j++) {
    for (let k = 0; k < 6; k++) {
      for (let l = 0; l < 6; l++) {
        possibleSolutions.push(chars[i] + chars[j] + chars[k] + chars[l]);
      }
    }
  }
}

const allPegCombos = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 0],
  [2, 1],
  [2, 2],
  [3, 0],
  [3, 1],
  [4, 0],
];

function fitsClues(history, combo) {
  const comboChars = new Set(combo);
  for (let i = 0; i < history.length; i++) {
    const [prevCombo, reds, whites] = history[i];
    if (combo === prevCombo) {
      return false;
    }
    if (reds === 0) {
      for (let j = 0; j < prevCombo.length; j++) {
        if (prevCombo[j] === combo[j]) {
          return false;
        }
      }
    }
    const totalPegs = reds + whites;
    if (totalPegs === 0) {
      for (let j = 0; j < prevCombo.length; j++) {
        if (comboChars.has(prevCombo[j])) {
          return false;
        }
      }
    } else {
      let exactMatches = 0;
      for (let j = 0; j < prevCombo.length; j++) {
        if (prevCombo[j] === combo[j]) {
          exactMatches++;
        }
      }
      const prevFreq = {};
      const comboFreq = {};
      for (let j = 0; j < prevCombo.length; j++) {
        prevFreq[prevCombo[j]] = (prevFreq[prevCombo[j]] || 0) + 1;
        comboFreq[combo[j]] = (comboFreq[combo[j]] || 0) + 1;
      }
      let overlapCount = 0;
      for (const char in prevFreq) {
        overlapCount += Math.min(prevFreq[char] || 0, comboFreq[char] || 0);
      }
      if (exactMatches !== reds || overlapCount < totalPegs) {
        return false;
      }
    }
  }
  return true;
}

function getPossibleSecretCodes(history) {
  const possibleSecretCodes = [];
  possibleSolutions.forEach((possibleSolution) => {
    if (fitsClues(history, possibleSolution)) {
      possibleSecretCodes.push(possibleSolution);
    }
  });
  return possibleSecretCodes.length;
}

function calculatePegs(guess, solution) {
  let redPegs = 0;
  let whitePegs = 0;
  const guessChars = guess.split("");
  const solutionChars = solution.split("");
  const guessRemaining = [];
  const solutionRemaining = [];
  for (let i = 0; i < 4; i++) {
    if (guessChars[i] === solutionChars[i]) {
      redPegs++;
    } else {
      guessRemaining.push(guessChars[i]);
      solutionRemaining.push(solutionChars[i]);
    }
  }
  for (const guessChar of guessRemaining) {
    const index = solutionRemaining.indexOf(guessChar);
    if (index !== -1) {
      whitePegs++;
      solutionRemaining.splice(index, 1);
    }
  }
  return [redPegs, whitePegs];
}

function minExpectedPegs(history, guess) {
  if (history.length === 0) {
    return 0;
  }
  let minPossiblePegs = Infinity;
  for (const solution of possibleSolutions) {
    let consistent = true;
    for (const [prevGuess, redPegs, whitePegs] of history) {
      const prevResult = calculatePegs(prevGuess, solution);
      if (prevResult[0] !== redPegs || prevResult[1] !== whitePegs) {
        consistent = false;
        break;
      }
    }
    if (consistent) {
      const currentResult = calculatePegs(guess, solution);
      minPossiblePegs = Math.min(
        minPossiblePegs,
        currentResult[0] + currentResult[1]
      );
    }
  }
  if (minPossiblePegs === Infinity) {
    return 0;
  }
  return minPossiblePegs;
}

function getFeedback(history, guess) {
  const possibleResults = [];
  allPegCombos.forEach(([red, white]) => {
    if (red + white >= minExpectedPegs(history, guess)) {
      const possibleSecretCodes = getPossibleSecretCodes([
        ...history,
        [guess, red, white],
      ]);
      if (possibleSecretCodes) {
        possibleResults.push([red, white, possibleSecretCodes]);
      }
    }
  });
  if (!possibleResults.length) {
    return {
      red: 4,
      white: 0,
    };
  }
  possibleResults.sort((a, b) => b[2] - a[2]);
  return {
    red: possibleResults[0][0],
    white: possibleResults[0][1],
  };
}
