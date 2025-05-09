type Score = {
  type: string;
  score: number;
}

export type Choice = {
  value: string;
  score: Score[];
  nextQuestionId: number;
};

// scoring culture
export function calculateScore(choices: Choice[]): Record<string, number> {
    // init score dict at all type: 0
    const scoreDict: Record<string, number> = {
        "P": 0, // High-low Power distance
        "IC": 0, // Individualism - Collectivism
        "MF": 0, // Motivation towards achievement and success (Masculine - Feminine)
        "UA": 0, // Uncertainty avoidance
        "SL": 0, // Short-term - Long-term orientation
        "IR": 0, // Indulgence - Restraint
    };
  
    // for loop on choices
    for (const choice of choices) {
      for (const score of choice.score){
        const type = score.type; // get type
        const s = score.score; // get score
        // add score to selected type
        if (!scoreDict[type]) {
          scoreDict[type] = 0;
        }
        scoreDict[type] += s;
      }
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

