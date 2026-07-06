import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import WellnessHubPage from './pages/WellnessHubPage';
import ChatBot from './components/ChatBot'; // ✅ NEW

import './index.css';
import DiseaseAwareness from './pages/DiseaseAwareness';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "analysis", element: <AnalysisPage /> },
      { path: "wellness-hub", element: <WellnessHubPage /> },
      { path: "diseaseawareness", element: <DiseaseAwareness /> }, // ✅ NEW
      {
        path: "doctor-dashboard",
        element: (
          <div>
            <h1>Doctor Dashboard</h1>
            <p>This is a sample public dashboard (no authentication required).</p>
          </div>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);