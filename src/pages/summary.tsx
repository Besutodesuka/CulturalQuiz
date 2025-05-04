import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { calculateScore, appendToCsv } from '../utils/scoreUtils';

interface Choice {
  questionId: string;
  selectedOption: string;
  correctOption: string;
  type: string;
  score: number;
}

export default function Summary() {
  const location = useLocation();
  const [userGuess, setUserGuess] = useState('');
  const [scoreDict, setScoreDict] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const answerLogs: Choice[] = location.state?.answerLogs || [];

  useEffect(() => {
    const scores = calculateScore(answerLogs);
    setScoreDict(scores);
  }, [answerLogs]);

  const totalScore = Object.values(scoreDict).reduce((sum, val) => sum + val, 0);

  const handleSubmitGuess = () => {
    if (!submitted) {
      appendToCsv(userGuess, totalScore.toString());
      setSubmitted(true);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 font-bold">Score Summary</h1>

      <div className="mb-4">
        <label htmlFor="guess">Guess your total score:</label>
        <input
          type="number"
          id="guess"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          className="border p-1 mx-2"
        />
        <button
          onClick={handleSubmitGuess}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Submit Guess
        </button>
      </div>

      {submitted && (
        <div className="mt-4">
          <h2 className="text-lg">Your Guess: {userGuess}</h2>
          <h2 className="text-lg mb-2">Actual Total Score: {totalScore}</h2>

          <h3 className="text-md font-semibold">Breakdown by Type:</h3>
          <ul className="list-disc pl-5">
            {Object.entries(scoreDict).map(([type, score]) => (
              <li key={type}>
                {type}: {score}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
