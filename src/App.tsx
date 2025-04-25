import React, { useState, useEffect } from 'react';
import quizData from './quiz.json';

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  reason: string;
  name: string;
};

const App: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const question: Question = quizData[currentQuestion];

  useEffect(() => {
    // Shuffle choices only when the question changes
    setShuffledOptions([...question.options].sort(() => Math.random() - 0.5));
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer, // Store answer for the current question
    }));

    // If the answer is correct, automatically go to the next question
    if (answer === question.answer) {
      setTimeout(() => {
        setCurrentQuestion((prev) => (prev + 1) % quizData.length);
      }, 100); // Delay before moving to next question
    }
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % quizData.length);
  };

  const prevQuestion = () => {
    setCurrentQuestion((prev) => (prev - 1 + quizData.length) % quizData.length);
  };

  // Calculate score in real-time
  const correctAnswers = Object.keys(answers).reduce(
    (total, key) => (answers[parseInt(key)] === quizData[parseInt(key)].answer ? total + 1 : total),
    0
  );

  // Calculate progress
  const progress = ((correctAnswers / quizData.length) * 100).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 relative">
      {/* Progress Bar on Top Right */}
      <div className="absolute top-4 right-4 bg-white shadow-md p-2 rounded-lg">
        <p className="text-sm font-semibold">Correct: {correctAnswers} / {quizData.length}</p>
        <div className="w-32 bg-gray-200 h-3 rounded-lg mt-1">
          <div
            className="bg-green-500 h-3 rounded-lg transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {question.question} {question.name}
        </h1>
        <div className="space-y-4">
          {shuffledOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`p-4 w-full text-left border rounded-lg transition-all duration-300 ${answers[currentQuestion] === option
                  ? option === question.answer
                    ? 'bg-green-200 border-green-400'
                    : 'bg-red-200 border-red-400'
                  : 'bg-gray-50 hover:bg-gray-200'
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        {answers[currentQuestion] && (
          <div className="mt-6 p-4 border-t bg-gray-50 rounded-lg">
            {answers[currentQuestion] === question.answer ? (
              <p className="text-green-600 font-medium">✅ Correct! {question.reason}</p>
            ) : (
              <p className="text-red-600 font-medium">
                ❌ Incorrect. The correct answer is: <strong>{question.answer}</strong>. {question.reason}
              </p>
            )}

            <div className="mt-4 flex justify-between">
              <button
                onClick={prevQuestion}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                ⬅ Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={!answers[currentQuestion]} // Prevent moving forward until an answer is selected
                className={`px-4 py-2 rounded-lg transition ${answers[currentQuestion] ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
              >
                Next ➡
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
