import React, { useState, useEffect } from 'react';
import quizData from '../quizData.json';
import { useNavigate } from 'react-router-dom';

type Choice = {
  value: string;
  type: string;
  score: number;
  nextQuestionId: number;
};

type Question = {
  id: number;
  question: string;
  options: Choice[]; // use the Choice type here
  name?: string; // you can set this manually or derive it elsewhere
};

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [NextQuestionBuffer, setNextQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: Choice }>({});
  const [shuffledOptions, setShuffledOptions] = useState<Choice[]>([]);

  const [stack, setStack] = useState<number[]>([]);

  const push = () => {
    if (currentQuestion) {
      setStack([...stack, currentQuestion]);
    }
  };

  const pop = () => {
    if (stack.length > 0) {
      const newStack = [...stack];
      const poppedItem = newStack.pop();
      setStack(newStack);
      return poppedItem
    }
    return 0
  };

  const question: Question = quizData[currentQuestion];
  const navigate = useNavigate();

  // shuffed question
  useEffect(() => {
    // Shuffle choices only when the question changes
    setShuffledOptions([...question.options].sort(() => Math.random() - 0.5));
  }, [currentQuestion]);

  useEffect(() => {
    console.log("Answers state updated:", answers);
  }, [answers]);


  // answer handler
  const handleAnswer = (selectedOption: Choice) => {
    const nextId = selectedOption.nextQuestionId;
    const nextIndex = quizData.findIndex((q) => q.id === nextId);
    setNextQuestion(nextIndex);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: selectedOption,
    }));
  };

  const nextQuestion = () => {
    // Navigate to the next question after a small delay
    setTimeout(() => {
      if (NextQuestionBuffer !== -1) {
        push();
        setCurrentQuestion(NextQuestionBuffer);
      } else {
        // End of quiz or invalid nextQuestionId
        navigate('/summary', { state: { answerLogs: Object.values({ ...answers}) } });
      }
    }, 300); // Optional delay for UX
  };

  const prevQuestion = () => {
    const prevId = pop();
    setNextQuestion(currentQuestion);
    setCurrentQuestion(prevId);
  };

  // Calculate score in real-time
  // const correctAnswers = Object.keys(answers).reduce(
  //   (total, key) =>
  //     answers[parseInt(key)]?.value === quizData[parseInt(key)].answer
  //       ? total + 1
  //       : total,
  //   0
  // );


  // Calculate progress
  // const progress = ((correctAnswers / quizData.length) * 100).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 relative">
      {/* Progress Bar on Top Right */}
      {/* <div className="absolute top-4 right-4 bg-white shadow-md p-2 rounded-lg"> */}
        {/* <p className="text-sm font-semibold">Correct: {correctAnswers} / {quizData.length}</p>
        <div className="w-32 bg-gray-200 h-3 rounded-lg mt-1">
          <div
            className="bg-green-500 h-3 rounded-lg transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div> */}
      {/* </div> */}

      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {question.question} {question.name}
        </h1>
        <div className="space-y-4">
          {shuffledOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option)}
              className={`p-4 w-full text-left border rounded-lg transition-all duration-300 
             ${answers[currentQuestion]?.value === option.value
                  ? 'bg-blue-200 border-blue-500' // Selected = blue
                  : 'bg-gray-50 hover:bg-gray-200 border-gray-300' // Unselected = gray + hover
                }`}
            >
              {option.value}
            </button>
          ))}

        </div>

        {answers[currentQuestion] && (
          <div className="mt-6 p-4 border-t bg-gray-50 rounded-lg">
            {/* {answers[currentQuestion]?.value === question.answer ? (
              <p className="text-green-600 font-medium">✅ Correct! {question.reason}</p>
            ) : (
              <p className="text-red-600 font-medium">
                ❌ Incorrect. The correct answer is: <strong>{question.answer}</strong>. {question.reason}
              </p>
            )} */}


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

export default Quiz;
