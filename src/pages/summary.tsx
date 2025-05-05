
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateScore, appendToCsv } from '../utils/scoreUtils'; // Make sure path is correct
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartOptions, // Import ChartOptions type
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

// Define the structure for answer logs passed via state
interface Choice {
    questionId: string;
    selectedOption: string;
    correctOption: string;
    type: string; // This should be one of the keys: P, IC, MF, UA, SL, IR
    score: number; // The score contribution for this answer
}

// Define the structure for the score dictionary
// Explicitly listing keys for clarity and potential future use
type ScoreDimension = "P" | "IC" | "MF" | "UA" | "SL" | "IR";
type ScoreDict = Record<ScoreDimension, number>;

// Define full names for dimensions for better readability
const dimensionNames: Record<ScoreDimension, string> = {
    "P": "Power Distance (High-Low)",
    "IC": "Individualism vs. Collectivism",
    "MF": "Motivation (Masculine vs. Feminine)",
    "UA": "Uncertainty Avoidance",
    "SL": "Orientation (Short-Term vs. Long-Term)",
    "IR": "Indulgence vs. Restraint",
};


export default function Summary() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    // Initialize with default structure to prevent errors before calculation
    const [scoreDict, setScoreDict] = useState<ScoreDict>({
        "P": 0, "IC": 0, "MF": 0, "UA": 0, "SL": 0, "IR": 0,
    });
    const initialGuesses = { "P": 0, "IC": 0, "MF": 0, "UA": 0, "SL": 0, "IR": 0 };
    const [userGuesses, setUserGuesses] = useState<ScoreDict>(initialGuesses);
    const [isSubmitted, setIsSubmitted] = useState(false); // Track if data has been saved
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [guessSubmitted, setGuessSubmitted] = useState(false);
    // Safely access answer logs from location state
    const answerLogs: Choice[] | undefined = location.state?.answerLogs;

    if (!answerLogs || answerLogs.length === 0) {
        setError("No answer logs found. Please complete the quiz first.");
        setIsLoading(false);
        return;
    }
    // this is just for demo
    // const answerLogs = [];

    useEffect(() => {
        if ((answerLogs && answerLogs.length > 0) || true) { // remove if the choice schema is availiable
            try {
                const calculatedScores = calculateScore(answerLogs);
                // Ensure all expected keys are present, even if score is 0
                const fullScores: ScoreDict = {
                    "P": calculatedScores["P"] ?? 0,
                    "IC": calculatedScores["IC"] ?? 0,
                    "MF": calculatedScores["MF"] ?? 0,
                    "UA": calculatedScores["UA"] ?? 0,
                    "SL": calculatedScores["SL"] ?? 0,
                    "IR": calculatedScores["IR"] ?? 0,
                };
                setScoreDict(fullScores);
                setError(null);
            } catch (err) {
                console.error("Error calculating scores:", err);
                setError("Could not calculate scores.");
            }
        } else {
            setError("No answer logs found. Please complete the quiz first.");
            // Optional: Redirect if no data
            // navigate('/quiz');
        }
        setIsLoading(false);
    }, [answerLogs, navigate]); // Add navigate as dependency if using it in effect

    // Handler to update the specific dimension's guess
    const handleGuessChange = (dimension: ScoreDimension, value: string) => {
      setUserGuesses(prevGuesses => ({
          ...prevGuesses,
          [dimension]: value, // Update only the changed dimension
      }));
    };

    // Add this new handler function (or rename the old handleSubmitGuess)
    // Handler to mark guesses as submitted
    const handleSubmitGuesses = () => {
      // Optional: Add validation here if needed (e.g., check if all filled)
      setGuessSubmitted(true); // Use the existing guessSubmitted state setter
    };

    // Prepare data for the Radar chart
    const chartLabels = Object.keys(scoreDict).map(key => dimensionNames[key as ScoreDimension] || key); // Use full names
    const chartDataValues = Object.values(scoreDict);

    const radarChartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Your Scores by Dimension',
                data: chartDataValues,
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue area fill
                borderColor: 'rgb(54, 162, 235)', // Blue line
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
            },
            // Optional: Add another dataset for comparison (e.g., average scores)
            // {
            //   label: 'Average Scores',
            //   data: [/* average score data array */],
            //   backgroundColor: 'rgba(255, 99, 132, 0.2)',
            //   borderColor: 'rgb(255, 99, 132)',
            //   pointBackgroundColor: 'rgb(255, 99, 132)',
            //   ...
            // }
        ],
    };

    // Configure Radar chart options (adjust scale as needed)
    const radarChartOptions: ChartOptions<'radar'> = { // Specify type for options
        scales: {
            r: { // Options for the radial axis (the values)
                beginAtZero: true,
                suggestedMin: 0,
                 // Dynamically set max based on potential score range, or keep fixed
                // suggestedMax: 50, // Example: If max score per dimension is around 50
                angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)', // Color of lines from center to labels
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)', // Color of the concentric grid lines
                },
                pointLabels: {
                     font: {
                        size: 11, // Adjust label font size if needed
                    },
                    color: 'rgb(50, 50, 50)', // Color of dimension labels (P, IC, etc.)
                },
                ticks: {
                    backdropColor: 'rgba(255, 255, 255, 0.75)', // Background for tick values
                    color: 'rgb(100, 100, 100)', // Color for tick values (0, 10, 20..)
                },
            },
        },
        plugins: {
            legend: {
                position: 'top', // Position the legend
            },
            tooltip: {
                enabled: true, // Show tooltips on hover
            },
        },
        maintainAspectRatio: false, // Allow chart to resize within container
    };


    // --- Render Logic ---

    if (isLoading) {
        return <div className="p-6 text-center">Loading results...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                Quiz Results & Analysis
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* Guessing Section - Now handles individual dimensions */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Guess Your Scores by Dimension</h2>
                    {!guessSubmitted ? (
                        // Form for entering guesses
                        <div className="space-y-4">
                            {/* Map over dimensions to create input fields */}
                            {Object.keys(initialGuesses).map((key) => {
                                const dimension = key as ScoreDimension;
                                return (
                                    <div key={dimension} className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4">
                                        <label htmlFor={`guess-${dimension}`} className="font-medium text-gray-600 text-sm sm:text-base w-full sm:w-2/5">
                                            {dimensionNames[dimension] || dimension}: {/* Use full names */}
                                        </label>
                                        <input
                                            type="number" // Use number type
                                            id={`guess-${dimension}`}
                                            name={`guess-${dimension}`} // Add name attribute
                                            value={userGuesses[dimension]} // Bind to the specific dimension's guess state
                                            onChange={(e) => handleGuessChange(dimension, e.target.value)} // Call handler with dimension
                                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-3/5"
                                            placeholder="Your guess"
                                        />
                                    </div>
                                );
                            })}
                            {/* Button to submit all guesses */}
                            <button
                                onClick={handleSubmitGuesses}
                                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
                            >
                                Submit Guesses
                            </button>
                        </div>
                    ) : (
                        // Display comparison after submitting guesses
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">Guess vs. Actual Scores</h3>
                            {/* Map over actual scores to display comparison */}
                            {Object.keys(scoreDict).map((key) => {
                                const dimension = key as ScoreDimension;
                                const guess = userGuesses[dimension]; // Get guess, handle if empty ?.trim() || 'N/A'
                                const actual = scoreDict[dimension]; // Get actual score
                                // Basic comparison logic (can be enhanced)
                                // const guessNum = parseInt(guess);
                                const guessNum = guess;
                                const isMatch = !isNaN(guessNum) && guessNum === actual;
                                const guessColor = isNaN(guessNum) ? 'text-gray-500' : (isMatch ? 'text-green-600' : 'text-red-600');

                                return (
                                    <div key={dimension} className="flex justify-between items-center border-b pb-2 text-sm sm:text-base">
                                        <span className="font-medium text-gray-600 w-2/5">
                                            {dimensionNames[dimension] || dimension}: {/* Use full names */}
                                        </span>
                                        <span className="text-center w-1/5">
                                            {/* Display the user's guess */}
                                            Guess: <span className={`font-semibold ${guessColor}`}>{guess}</span>
                                        </span>
                                        <span className="text-right w-2/5">
                                            {/* Display the actual score */}
                                            Actual: <span className="font-semibold text-indigo-600">{actual}</span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {/* Radar Chart Section //guesses submit then show */}
                {guessSubmitted ? (<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Score Visualization</h2>
                    <div className="relative h-64 sm:h-80 md:h-96"> {/* Set height for aspect ratio */}
                        <Radar data={radarChartData} options={radarChartOptions} />
                    </div>
                </div>) : (<div className='text-xl font-semibold text-gray-700 mb-4" justify-center'> guess your score to see the actual score</div>)}
            </div>
        </div>
    );
}


// const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   setUserName(event.target.value);
// };

// const handleSubmitResults = (event: React.FormEvent<HTMLFormElement>) => {
//   event.preventDefault(); // Prevent default form submission
//   if (!userName.trim()) {
//       alert('Please enter your name.');
//       return;
//   }
//   if (!isSubmitted) {
//       try {
//           appendToCsv(userName.trim(), scoreDict);
//           setIsSubmitted(true); // Mark as submitted to prevent duplicates
//           // Optional: Navigate away after submission
//           // navigate('/thank-you');
//       } catch (err) {
//           console.error("Failed to submit results:", err);
//           alert("There was an error saving your results.");
//       }
//   }
// };

 /* Scores & Submission Section
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Scores by Dimension</h2>
                    <ul className="list-none space-y-2 mb-6">
                        {Object.entries(scoreDict).map(([key, score]) => (
                            <li key={key} className="flex justify-between items-center border-b pb-1">
                                <span className="text-gray-600 font-medium">
                                    {dimensionNames[key as ScoreDimension] || key}:
                                 </span>
                                <span className="text-gray-800 font-semibold text-lg">{score}</span>
                            </li>
                        ))}
                    </ul>

                    <hr className="my-6" />

                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Save Your Results</h2>
                    {isSubmitted ? (
                        <div className="text-center p-4 bg-green-100 text-green-700 rounded-md">
                            Your results have been saved. Thank you!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitResults} className="space-y-4">
                            <div>
                                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Your Name:
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName" // Corresponds to the field name in the comment
                                    value={userName}
                                    onChange={handleNameChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Your Name"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
                                disabled={isSubmitted}
                            >
                                {isSubmitted ? 'Saved' : 'Save Results'}
                            </button>
                        </form>
                    )}
                </div> */