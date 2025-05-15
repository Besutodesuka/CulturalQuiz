import React, { useState } from 'react';
import { addFeedback } from '../utils/feedback';
import { useNavigate } from 'react-router-dom';

function RatingScaleWithSubmit() {
  const [selectedValue, setSelectedValue] = useState(null); // To store the selected rating (1-5)
  const ratingOptions = [1, 2, 3, 4, 5]; // The choices

  const navigate = useNavigate();

  const handleRadioChange = (event) => {
    setSelectedValue(Number(event.target.value)); // Store value as a number
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (selectedValue !== null) {
      console.log('Rating submitted:', selectedValue);
      alert(`You submitted a rating of: ${selectedValue}`);
      // Here you would typically send the selectedValue to a backend or parent component
      addFeedback(selectedValue);
      navigate('/');
    } else {
      alert('Please select a rating before submitting.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-8  max-w-xs flex-1 w-auto h-auto">
      <form onSubmit={handleSubmit}>
        <fieldset className="border-none p-0 m-0">
          <legend className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            is our conclusion accurate? give us score! (1-5):
          </legend>
          <div className="flex flex-col space-y-3"> {/* Vertical layout with spacing */}
            {ratingOptions.map((value) => (
              <div key={value} className="flex items-center">
                <input
                  id={`rating-${value}`}
                  name="rating" // All radio buttons share the same name
                  type="radio"
                  value={value}
                checked={selectedValue === value}
                  onChange={handleRadioChange}
                  className="h-4 w-4 text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor={`rating-${value}`}
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-200 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={selectedValue === null} // Disable button if no rating is selected
          >
            Submit Rating
          </button>
        </div>
      </form>
    </div>
  );
}

export default RatingScaleWithSubmit;