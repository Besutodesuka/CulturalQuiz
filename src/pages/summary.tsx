
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateScore, appendToCsv, Choice } from '../utils/scoreUtils'; // Make sure path is correct
import CenteredCircularImage from '../component/image';
import RatingScaleWithSubmit from '../component/radio';
import introGif from '/FallingStar.gif';
const backgroundImage = `url(${introGif})`;
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
import dimensionDescription from '../dimensionDescription.json';
import planetList from '../planetDescription.json';

type ScoreDimension = "P" | "IC" | "MF" | "UA" | "SL" | "IR";

type Planet = {
    "id": number;
    "planet": string;
    "image": string;
    "Description":string;
    "stat": PlanetStat;
}

type StatLevel = "High" | "Low" | "Balance";
interface PlanetStat {
    "P": StatLevel;
    "IC": StatLevel;
    "MF": StatLevel;
    "UA": StatLevel;
    "SL": StatLevel;
    "IR": StatLevel;
}

type StatCriteria = Partial<PlanetStat>;

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

const HighBar = 2;
const LowBar = -2;

function getScoreLevel(
    score: number
): StatLevel{
    if (score > HighBar) {
        return "High";
    } else if (score < LowBar) {
        return "Low";
    } else { // score must be 2
        return "Balance";
    }
}

function getPlanetsByStatCriteria(
    criteria: StatCriteria
): Planet | null{
    if (!planetList || planetList.length === 0) {
        return null; // No planets to choose from
    }

    // If criteria is somehow empty (though it shouldn't be with PlanetStat type)
    if (Object.keys(criteria).length === 0) {
        return planetList[0]; // Or null, depending on desired behavior for empty criteria
    }

    let bestMatchPlanet: Planet | null = null;
    let highestMatchCount = -1;

    for (const planet of planetList) {
        let currentMatchCount = 0;
        // Since criteria is PlanetStat, all keys are guaranteed to be present.
        (Object.keys(criteria) as Array<keyof PlanetStat>).forEach(key => {
            if (planet.stat[key] === criteria[key]) {
                currentMatchCount++;
            }
        });

        if (currentMatchCount > highestMatchCount) {
            highestMatchCount = currentMatchCount;
            bestMatchPlanet = planet;
        }
    }

    // If no planet had any matches (highestMatchCount stayed 0 or -1)
    // but there are planets, bestMatchPlanet would be the first one.
    // If you want to return null if no stats matched at all (match count 0),
    // you could add: if (highestMatchCount === 0 && bestMatchPlanet) return null;
    // But typically, even 0 matches means the "closest" is just a very poor match.
    // If bestMatchPlanet is still null here AND planets.length > 0,
    // it implies the loop didn't run or update, which is unlikely.
    // So, if planets are available, bestMatchPlanet should be one of them.
    return bestMatchPlanet;
}

export default function Summary() {
    const location = useLocation();
    const navigate = useNavigate();
    // Initialize with default structure to prevent errors before calculation
    const [scoreDict, setScoreDict] = useState<ScoreDict>({
        "P": 0, "IC": 0, "MF": 0, "UA": 0, "SL": 0, "IR": 0,
    });
    const [isSubmitted, setIsSubmitted] = useState(false); // Track if data has been saved

    const [planetImg, setplanetImg] = useState("/vite.svg");
    const [planetName, setplanetName] = useState("planet name");
    const [planetDescription, setplanetDescription] = useState("planet name");
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
                const criteria: PlanetStat = {
                    "P": getScoreLevel(calculatedScores["P"]) ?? "Balance",
                    "IC": getScoreLevel(calculatedScores["IC"]) ?? "Balance",
                    "MF": getScoreLevel(calculatedScores["MF"]) ?? "Balance",
                    "UA": getScoreLevel(calculatedScores["UA"]) ?? "Balance",
                    "SL": getScoreLevel(calculatedScores["SL"]) ?? "Balance",
                    "IR": getScoreLevel(calculatedScores["IR"]) ?? "Balance",
                };
                const planet = getPlanetsByStatCriteria(criteria);
                setplanetName(planet.planet);
                setplanetImg(planet.image);
                setplanetDescription(planet.Description);
                setError(null);
                // for(i of calculatedScores)
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 relative"
        style={{backgroundImage}}
        >
            <CenteredCircularImage
                imagePath={planetImg}// Path relative to the public folder
                altText="John Doe's Avatar"
                size={48} // This will make the image w-64 h-64 (16rem x 16rem)
            />
            <div className="justify-self-center justify-items-center dark:bg-gray-800  sm:p-2 rounded-lg shadow-md my-4 flex-auto w-1/3">
                <h2 className="text-xl font-semibold  dark:text-white">{planetName}</h2>
            </div>
            {/* this is the description sections */}
            <div className="dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md w-4/5">
                <h2 className="text-xl font-semibold  dark:text-white mb-4">your planet</h2>
                <p className='text-white'>{planetDescription}</p>
                <h2 className="text-xl font-semibold  dark:text-white mb-4">cultural details</h2>
                {
                (() => {
                    const descriptions = dimensionDescription.map(dim => {
                    const currentScore = scoreDict[dim.type];
                    if (currentScore === undefined) {
                        return `Score not available for type: ${dim.type}`;
                    } else if (currentScore > HighBar) {
                        return dim.high;
                    } else if (currentScore < LowBar) {
                        return dim.low;
                    } else {
                        return dim.balance;
                    }
                    });

                    return (
                    <p className="dark:text-white">
                        {descriptions.join(' ')} {/* Join with space or change to '\n' if line breaks are preferred */}
                    </p>
                    );
                })()
                }
            </div>
            {/* this is bottom section */}
            <div className="items-center my-6 grid grid-cols-1 md:grid-cols-2 w-4/5">
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
