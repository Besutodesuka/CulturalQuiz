interface Choice {
    questionId: string;
    selectedOption: string;
    correctOption: string;
    type: string; // assumed field
    score: number; // assumed score for that question/answer
  }


// scoring culture
export function calculateScore(choices: Choice[]): Record<string, number> {
    // init score dict at all type: 0
    const scoreDict: Record<string, number> = {
        "power": 0,
        "uncertainty": 0,
        "freedom": 0,
    };
  
    // for loop on choices
    for (const choice of choices) {
      const type = choice.type; // get type
      const score = choice.score; // get score
  
      // add score to selected type
      if (!scoreDict[type]) {
        scoreDict[type] = 0;
      }
      scoreDict[type] += score;
    }
  
    // return the dict
    return scoreDict;
  }

// Fake CSV append logic — this won't work directly in the browser without a server or workaround
export function appendToCsv(userGuess: string, actualScore: string) {
const row = `${new Date().toISOString()},${userGuess},${actualScore}\n`;
const blob = new Blob([row], { type: 'text/csv' });

// Download as a CSV (simulate a+ mode append)
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'results.csv';
a.click();
}
