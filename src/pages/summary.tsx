
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateScore, appendToCsv, Choice } from '../utils/scoreUtils'; // Make sure path is correct
import CenteredCircularImage from '../component/image';
import RatingScaleWithSubmit from '../component/radio';
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

// Define the structure for the score dictionary
// Explicitly listing keys for clarity and potential future use
type ScoreDimension = "P" | "IC" | "MF" | "UA" | "SL" | "IR";
type ScoreDict = Record<ScoreDimension, number>;

// Define full names for dimensions for better readability
const dimensionNames: Record<ScoreDimension, string> = {
    "P": "Power Distance",
    "IC": "Individualism",
    "MF": "Masculinity",
    "UA": "Uncertainty Avoidance",
    "SL": "Long Term Orientation",
    "IR": "Indulgence",
};


export default function Summary() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    // Initialize with default structure to prevent errors before calculation
    const [scoreDict, setScoreDict] = useState<ScoreDict>({
        "P": 0, "IC": 0, "MF": 0, "UA": 0, "SL": 0, "IR": 0,
    });
    const [isSubmitted, setIsSubmitted] = useState(false); // Track if data has been saved

    const [planetImg, setplanetImg] = useState("/vite.svg");
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
        if (answerLogs && answerLogs.length > 0) { // remove if the choice schema is availiable
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

        // set up showing the planet detail

    }, [answerLogs, navigate]); // Add navigate as dependency if using it in effect

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
                pointBorderColor: '#',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)',
                TestColor:'rgb(255, 255, 255)',
                borderWidth: 1,
            },
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
                    color: 'rgba(255, 255, 255, 0.1)', // Color of lines from center to labels
                },
                grid: {
                    color: 'rgba(200, 200, 100, 0.1)', // Color of the concentric grid lines
                },
                pointLabels: {
                     font: {
                        size: 11, // Adjust label font size if needed
                    },
                    color: 'rgb(255, 255, 255)', // Color of dimension labels (P, IC, etc.)
                },
                ticks: {
                    backdropColor: 'rgba(0, 0, 0, 0.1)', // Background for tick values
                    color: 'rgb(255, 255, 255)', // Color for tick values (0, 10, 20..)
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
            {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                Quiz Results & Analysis
            </h1> */}
            <CenteredCircularImage
                imagePath={planetImg}// Path relative to the public folder
                altText="John Doe's Avatar"
                size={64} // This will make the image w-64 h-64 (16rem x 16rem)
            />
            {/* this is the description sections */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <p>
                    {}
                </p>
            </div>
            {/* this is bottom section */}
            <div className="justify-center mx-6 my-6 grid grid-cols-1 md:grid-cols-2 items-start w-full">
                 {/* Radar Chart Section //guesses submit then show */}
                <div className="justify-center dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md dark:text-white w-full mb-6">
                    <h2 className="text-xl font-semibold  dark:text-white mb-4">Score Visualization</h2>
                    <div className="relative h-64 sm:h-80 md:h-96"> {/* Set height for aspect ratio */}
                        <Radar data={radarChartData} options={radarChartOptions} />
                    </div>
                </div>
                {/* {radio button here} */}
                <RatingScaleWithSubmit/>
            </div>
        </div>
    );
}
