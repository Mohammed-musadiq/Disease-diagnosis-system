import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { FaMicroscope, FaLaptopMedical, FaCogs, FaChartLine } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="home-page-container">

      {/* --- Section 1: Hero - Split Screen Layout with Video Background --- */}
      <section className="hero-split-section">
        
        {/* --- Video Background Implementation --- */}
        <video autoPlay loop muted playsInline className="hero-video-bg-split">
          {/* IMPORTANT: Ensure you have a suitable video file named /dna-background.mp4 in your 'public' folder */}
          <source src="/dna-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay for contrast and color consistency */}
        <div className="hero-overlay-split"></div>

        {/* Left Side: Text and CTA */}
        <div className="hero-text-column">
          <h1 className="hero-title">
            <span className="highlight-text">Precision</span> Diagnosis Powered by AI
          </h1>
          <p className="hero-subtitle">
            Instantly analyze complex medical scans using **Deep Learning Models** trained for accuracy in X-Rays, MRIs, and Dermatological Imagery.
          </p>
          
          <div className="hero-cta-group">
            <Link to="/analysis" className="primary-cta-button">
              <FaChartLine /> Start Analysis Now
            </Link>
            
          </div>

          <div className="tech-badge">
            Powered by FastAPI &amp; PyTorch 🚀
          </div>
        </div>

        {/* Right Side: Visual/Model Showcase */}
        {/* NOTE: This column will sit *on top* of the video/overlay. */}
        <div className="hero-visual-column">
          <div className="model-card skin-model">
            <FaMicroscope className="model-icon"/>
            <h3>Dermatology AI</h3>
            <p>Classifies skin conditions with high precision.</p>
          </div>
          <div className="model-card xray-model">
            <FaLaptopMedical className="model-icon"/>
            <h3>Radiology AI</h3>
            <p>Detects anomalies in chest X-ray scans.</p>
          </div>
          <div className="model-card mri-model">
            <FaCogs className="model-icon"/>
            <h3>Advanced MRI</h3>
            <p>Segmentation and analysis of complex structures.</p>
          </div>
        </div>
      </section>

      {/* --- Section 2: Core Metrics/Features --- */}
      <section className="metrics-section">
        <h2>Why Choose DiagnoX?</h2>
        <div className="metrics-grid">
          <div className="metric-box">
            <div className="metric-number">90<span className="small-text">%</span></div>
            <p className="metric-label">Model Accuracy Rate</p>
          </div>
          <div className="metric-box">
            <div className="metric-number">3</div>
            <p className="metric-label">Specialist AI Models</p>
          </div>
          <div className="metric-box">
            <div className="metric-number">10k+</div>
            <p className="metric-label">Images in Training Data</p>
          </div>
          <div className="metric-box">
            <div className="metric-number">5<span className="small-text"> Sec</span></div>
            <p className="metric-label">Avg. Analysis Time</p>
          </div>
        </div>
      </section>

      {/* --- Section 3: Final Call to Action --- */}
      <section className="cta-final-section">
        <h2>Ready to Validate Your Project?</h2>
        <p>Upload your datasets and evaluate the performance of our cutting-edge Deep Learning solutions.</p>
        <Link to="/analysis" className="primary-cta-button large-cta">
          Access the Analysis Hub
        </Link>
      </section>

      {/* --- Section 4: Footer --- */}
      <footer className="footer-new">
        <div className="footer-container">
          <p className="footer-brand">DiagnoX</p>
          <div className="footer-disclaimer-group">
            <p className="disclaimer-text">&copy; 2025 Mohammed. Prototype for educational/research use.</p>
            <p className="disclaimer-text">This tool does not provide professional medical diagnosis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}