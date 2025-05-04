import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // <--- Import BrowserRouter
import './index.css'
import 'antd/dist/reset.css';
import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter> {/* <--- Wrap App with BrowserRouter */}
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
} else {
  console.error("Failed to find the root element with ID 'root'");
}
