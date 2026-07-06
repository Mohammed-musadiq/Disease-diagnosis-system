import React from "react";
import "./DiseaseAwareness.css";

const diseases = [
  // --- Same 10 diseases (unchanged content) ---
  {
    name: "Heart Attack",
    symptoms: [
      "Chest pain or pressure",
      "Shortness of breath",
      "Pain spreading to arm/neck/jaw",
      "Cold sweat, dizziness",
      "Nausea or vomiting"
    ],
    precautions: [
      "Avoid smoking",
      "Healthy diet",
      "Regular exercise",
      "Control cholesterol & BP"
    ],
    detection: [
      "ECG",
      "Troponin blood test",
      "Coronary angiography",
      "Chest X-ray"
    ]
  },
  {
    name: "Cancer",
    symptoms: [
      "Unexplained weight loss",
      "Fatigue",
      "Lumps or swelling",
      "Abnormal bleeding",
      "Skin changes"
    ],
    precautions: [
      "Avoid tobacco & alcohol",
      "Healthy lifestyle",
      "Avoid long sun exposure",
      "Regular checkups"
    ],
    detection: ["Biopsy", "MRI/CT scan", "Blood tests"]
  },
  {
    name: "Stroke",
    symptoms: [
      "Sudden numbness",
      "Speech difficulty",
      "Loss of balance",
      "Severe headache",
      "Confusion"
    ],
    precautions: [
      "Control BP",
      "Quit smoking",
      "Physical activity",
      "Low-salt diet"
    ],
    detection: ["CT scan", "MRI scan", "Blood tests"]
  },
  {
    name: "Asthma",
    symptoms: ["Wheezing", "Coughing", "Chest tightness", "Breathlessness"],
    precautions: [
      "Avoid smoke/dust",
      "Use inhalers",
      "Avoid allergens",
      "Protect from cold air"
    ],
    detection: ["Spirometry", "Peak flow test", "Allergy test"]
  },
  {
    name: "Tuberculosis (TB)",
    symptoms: [
      "Cough > 3 weeks",
      "Weight loss",
      "Night sweats",
      "Chest pain",
      "Fever"
    ],
    precautions: [
      "Cover cough",
      "Complete TB treatment",
      "Good ventilation",
      "Avoid close contact"
    ],
    detection: ["Sputum test", "Chest X-ray", "TB skin test"]
  },
  {
    name: "Pneumonia",
    symptoms: [
      "High fever",
      "Cough with phlegm",
      "Chest pain",
      "Fatigue",
      "Breathlessness"
    ],
    precautions: [
      "Vaccination",
      "Clean hands",
      "Avoid smoking",
      "Healthy immune system"
    ],
    detection: ["Chest X-ray", "Blood tests", "Pulse oximetry"]
  },
  {
    name: "Malaria",
    symptoms: ["High fever", "Chills", "Sweating", "Headache", "Vomiting"],
    precautions: [
      "Use mosquito nets",
      "Avoid stagnant water",
      "Repellents",
      "Protective clothing"
    ],
    detection: ["Blood smear test", "Rapid diagnostic test"]
  },
  {
    name: "Dengue",
    symptoms: [
      "High fever",
      "Joint pain",
      "Vomiting",
      "Rash",
      "Bleeding gums"
    ],
    precautions: [
      "Prevent mosquito bites",
      "Clean surroundings",
      "Avoid standing water",
      "Use repellents"
    ],
    detection: ["NS1 antigen test", "CBC", "IgM/IgG test"]
  },
  {
    name: "Kidney Disease",
    symptoms: [
      "Swelling legs",
      "Fatigue",
      "Changes in urination",
      "High BP",
      "Nausea"
    ],
    precautions: [
      "Monitor BP & sugar",
      "Low-salt diet",
      "Hydration",
      "Avoid painkillers"
    ],
    detection: ["Urine test", "Creatinine test", "Ultrasound"]
  },
  {
    name: "Arthritis",
    symptoms: ["Joint pain", "Stiffness", "Swelling", "Warm joints"],
    precautions: [
      "Maintain weight",
      "Exercise",
      "Hot/Cold compress",
      "Avoid heavy lifting"
    ],
    detection: ["X-ray", "MRI", "Blood test (RA factor)"]
  }
];

const DiseaseAwareness = () => {
  return (
    <div className="awareness-container">
      <h1 className="title">Disease Awareness</h1>

      <div className="grid">
        {diseases.map((d, i) => (
          <div className="card animated-card" key={i}>
            <h2>{d.name}</h2>

            <div className="section">
              <h3>Symptoms</h3>
              <ul>{d.symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>

            <div className="section">
              <h3>Precautions</h3>
              <ul>{d.precautions.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>

            <div className="section">
              <h3>Detection Methods</h3>
              <ul>{d.detection.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseAwareness;
