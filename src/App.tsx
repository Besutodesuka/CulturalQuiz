// App.tsx
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Quiz from './pages/quiz'; // Example: Create this component
import Summary from './pages/summary'; // Example: Create this component
import HomePage from './pages/HomePage';
import IntroPage from './pages/introPage';

function App() {
  return (
    <div className="App">
      {/* Optional: Add some basic navigation links */}
      {/* <nav style={{ marginBottom: '20px', padding: '10px', background: '#eee' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/quiz">Start Quiz</Link>
      </nav> */}

      {/* Define the routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/intropage" element={<IntroPage />} />
        {/* Add other routes as needed */}
        <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Catch-all route */}
      </Routes>
    </div>
  );
}

export default App;