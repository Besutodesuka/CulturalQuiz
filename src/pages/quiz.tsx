import React, { useState, useEffect } from 'react';
import quizData from '../quizData.json';
import { useNavigate } from 'react-router-dom';
import newBackground from '/StaticStar.jpg';
import {Choice} from '../utils/scoreUtils';

type Question = {
  id: number;
  question: string;
  options: Choice[]; // use the Choice type here
  name?: string; // you can set this manually or derive it elsewhere
};

const backgroundImage = `url(${newBackground})`;

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

//  bg-gradient-to-br from-purple-900 via-indigo-800 to-black
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 relative"
    style={{ backgroundImage }}
    >
      <div className="min-h-screen p-8 flex justify-center items-center">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-4xl text-white font-sans">
          
          <h1 className="text-3xl font-extrabold text-center text-purple-200 mb-8 leading-snug drop-shadow-lg">
            {question.question} <br /> <span className="text-purple-300">{question.name}</span>
          </h1>

          <div className="space-y-6">
            {shuffledOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left text-lg font-medium px-6 py-4 rounded-xl transition-all duration-300 
                  ${
                    answers[currentQuestion]?.value === option.value
                      ? 'bg-purple-600/80 border border-purple-300 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 border border-white/30'
                  }`}
              >
                {option.value}
              </button>
            ))}
          </div>

          {answers[currentQuestion] && (
            <div className="mt-8 p-6 bg-white/10 border-t border-white/20 rounded-xl shadow-inner">
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={prevQuestion}
                  className="px-5 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition shadow-md"
                >
                  ⬅ Previous
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion]}
                  className={`px-5 py-3 rounded-lg transition shadow-md ${
                    answers[currentQuestion]
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  Next ➡
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div> 
  );
};

export default Quiz;
