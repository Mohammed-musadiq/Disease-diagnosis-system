import React, { useState, useCallback } from 'react';
import axios from 'axios'; // You'll need to install this: npm install axios
import './DoctorDashboardPage.css';

// Base URL for your backend (assuming it runs on localhost:5000)
const API_BASE_URL = 'http://localhost:5000';

function DoctorDashboardPage() {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch patient data from the backend
  const fetchPatientData = useCallback(async () => {
    if (!patientId) {
      setError('Please enter a valid Patient ID.');
      setPatientData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setPatientData(null);

    try {
      // API call to the backend
      const response = await axios.get(`${API_BASE_URL}/api/doctor/patient/${patientId}`);
      
      // Check if the patient was found
      if (response.data && response.data.id) {
        setPatientData(response.data);
      } else {
        setError(`Patient with ID: ${patientId} not found.`);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('An error occurred while fetching data. Check server status.');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Handler for the Search button
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatientData();
  };

  // --- Render Functions for Patient History ---

  const renderHistory = () => {
    if (!patientData || !patientData.history || patientData.history.length === 0) {
      return <p>No diagnosis history available.</p>;
    }

    return (
      <div className="history-list">
        {patientData.history.map((record, index) => (
          <div key={index} className="history-card">
            <div className="card-header">
              <span className="record-date">{record.date}</span>
              <span className={`record-status ${record.status.toLowerCase().replace(' ', '-')}`}>
                {record.status}
              </span>
            </div>
            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
            <p><strong>Model Used:</strong> {record.model}</p>
            <p><strong>Confidence:</strong> {record.confidence}%</p>
            <button className="view-details-btn">View Full Details</button>
          </div>
        ))}
      </div>
    );
  };

  // --- Main Component Render ---

  return (
    <div className="doctor-dashboard-container">
      <header className="dashboard-header">
        <h1>🏥 Doctor Dashboard</h1>
        <p>Welcome, Doctor. Use the search bar to retrieve patient records.</p>
      </header>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter Patient Unique ID (e.g., PID-1001)"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search Patient'}
          </button>
        </form>
      </div>
      
      {error && <div className="message error-message">{error}</div>}
      {loading && <div className="message loading-message">Fetching patient data...</div>}

      {patientData && (
        <div className="patient-details-section">
          <h2>Patient Details: {patientData.name}</h2>
          
          <div className="patient-info-cards">
            <div className="info-card">
              <h3>ID</h3>
              <p>{patientData.id}</p>
            </div>
            <div className="info-card">
              <h3>Age/Gender</h3>
              <p>{patientData.age} / {patientData.gender}</p>
            </div>
            <div className="info-card">
              <h3>Contact</h3>
              <p>{patientData.contact}</p>
            </div>
          </div>
          
          <div className="patient-history-card">
            <h2>Diagnosis History</h2>
            {renderHistory()}
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboardPage;