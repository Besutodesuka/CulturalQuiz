// src/pages/HomePage.tsx
// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline'; // Optional: Add an icon (install @heroicons/react)

function HomePage() {
  return (
    // Flex container to center content vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 text-center px-4">

      {/* Card-like container for content */}
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg max-w-md w-full">

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Quiz Zone!
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 text-base sm:text-lg">
          Ready to challenge yourself? Click the button below to start the quiz and test your knowledge.
        </p>

        {/* Link wrapping the button */}
        <Link
          to="/quiz"
          className="inline-block" // Needed for transform/transition effects on the link itself if desired
        >
          <button
            className="
              bg-indigo-600 hover:bg-indigo-700   // Background and hover state
              text-white                           // Text color
              font-semibold                        // Font weight
              py-3 px-6                            // Padding
              rounded-lg                           // Rounded corners
              shadow-md                            // Shadow
              transition-all duration-300 ease-in-out // Smooth transitions
              transform hover:scale-105            // Slight scale effect on hover
              flex items-center                    // Align icon and text if using icon
              gap-2                                // Space between icon and text if using icon
            "
          >
            Start Quiz
            {/* Optional Icon */}
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </Link>

      </div>

      {/* Optional: Footer or additional info */}
      <p className="mt-10 text-sm text-gray-500">
        Built with React & Tailwind CSS
      </p>
    </div>
  );
}

export default HomePage;