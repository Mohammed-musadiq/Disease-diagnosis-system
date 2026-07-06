import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { AiOutlineCamera, AiOutlineClose } from 'react-icons/ai';
import { BsMicFill } from 'react-icons/bs';
import './AnalysisPage.css';

// ---------------------------------------------------------------
// 1️⃣ SpeechToText Component with Animated Mic (Gemini-style)
// ---------------------------------------------------------------
const SpeechToText = ({ onResult, disabled, isListening, setIsListening }) => {
  const recognitionRef = useRef(null);
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [SpeechRecognition, onResult, setIsListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Recognition start error:", error);
      }
    }
  };

  return (
    <button
      onClick={startListening}
      disabled={disabled || isListening || !SpeechRecognition}
      className={`mic-btn ${isListening ? "listening" : ""}`}
      title={isListening ? "Listening..." : "Start Voice Input"}
    >
      <BsMicFill size={22} />
      {isListening && <span className="mic-wave"></span>}
    </button>
  );
};

// ---------------------------------------------------------------
// 2️⃣ WebcamCapture Component (unchanged, with Close + Retake)
// ---------------------------------------------------------------
const WebcamCapture = ({ onCapture, onCancel }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 1920,
      height: 1080,
    });
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const handleUsePhoto = () => {
    if (imgSrc) {
      const file = dataURLtoFile(imgSrc, `captured_${Date.now()}.jpeg`);
      onCapture(file);
    }
  };

  const videoConstraints = {
    facingMode: "environment",
    width: 1920,
    height: 1080,
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "black",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imgSrc ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={imgSrc}
            alt="Captured"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
          <button
            onClick={onCancel}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "rgba(255,255,255,0.25)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "45px",
              height: "45px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10001,
            }}
          >
            <AiOutlineClose size={35} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              width: "90%",
              maxWidth: "400px",
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <button
              onClick={() => setImgSrc(null)}
              style={{
                flex: 1,
                padding: "12px 0",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "1.1rem",
              }}
            >
              Retake
            </button>
            <button
              onClick={handleUsePhoto}
              style={{
                flex: 1,
                padding: "12px 0",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "1.1rem",
              }}
            >
              Consider
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            height="100%"
            videoConstraints={videoConstraints}
            style={{ objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={capture}
              style={{
                width: "70px",
                height: "70px",
                backgroundColor: "white",
                border: "8px solid #007bff",
                borderRadius: "50%",
                cursor: "pointer",
                boxShadow: "0 0 0 5px rgba(255,255,255,0.3)",
              }}
            />
          </div>
          <button
            onClick={onCancel}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "rgba(255,255,255,0.25)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "45px",
              height: "45px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10001,
            }}
          >
            <AiOutlineClose size={35} />
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------
// 3️⃣ Main AnalysisModule Component (Mic beside Analyze)
// ---------------------------------------------------------------
const AnalysisModule = ({ title, description, endpoint, isText = false }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleImageCapture = (capturedFile) => {
    setFile(capturedFile);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(capturedFile));
    setIsCameraOpen(false);
  };

  const handleSpeechResult = (transcript) => {
    setText((prev) =>
      prev.trim() === "" ? transcript : prev + " " + transcript
    );
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      let options = {};
      if (isText) {
        if (!text.trim())
          throw new Error("Please enter or speak symptoms for analysis.");
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        };
      } else {
        if (!file) throw new Error("No image selected for analysis.");
        const form = new FormData();
        form.append("file", file);
        options = { method: "POST", body: form };
      }

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, options);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Unknown error");
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isCameraOpen)
    return (
      <WebcamCapture
        onCapture={handleImageCapture}
        onCancel={() => setIsCameraOpen(false)}
      />
    );

  return (
    <div className="input-card">
      <h3>{title}</h3>
      <p>{description}</p>

      {isText ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="6"
            placeholder="Describe symptoms..."
          ></textarea>

          <div className="analyze-section">
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="analyze-btn"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            {/* 🎙️ Mic Beside Analyze Button */}
            <SpeechToText
              onResult={handleSpeechResult}
              disabled={loading}
              isListening={isListening}
              setIsListening={setIsListening}
            />
          </div>
        </>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
              className="file-btn"
            >
              Choose a File
            </button>

            <button
              onClick={() => setIsCameraOpen(true)}
              disabled={loading}
              className="camera-btn"
            >
              Live Camera <AiOutlineCamera size={20} style={{ marginLeft: "8px" }} />
            </button>
          </div>

          <p style={{ marginBottom: "10px", color: file ? "#28a745" : "#6c757d" }}>
            {file ? `Selected: ${file.name}` : "No image selected."}
          </p>

          {preview && <img src={preview} alt="preview" className="preview-image" />}

          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="analyze-btn"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </>
      )}

      {loading && <div className="loading-spinner"></div>}
      {error && <div className="error-message">⚠️ {error}</div>}
      {result && (
        <div className="result-card">
          <h3>Analysis Result</h3>
          <div className="result-item">
            <strong>Top Prediction:</strong> <span>{result.top_label}</span>
          </div>
          <div className="result-item">
            <strong>Confidence:</strong>{" "}
            <span>{Math.round(result.confidence * 100)}%</span>
          </div>
          <h4>Ranked Results:</h4>
          <ul className="ranked-list">
            {result.ranked.slice(0, 3).map((r, i) => (
              <li key={i}>
                {r.label}: {Math.round(r.prob * 100)}%
              </li>
            ))}
          </ul>
          {result.explanation && (
            <div className="explanation-card">
              <p><strong>Name:</strong> {result.top_label}</p>
              <h4>About the Disease</h4>
              <p>{result.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------
// 4️⃣ Page Wrapper
// ---------------------------------------------------------------
export default function AnalysisPage() {
  const [selectedType, setSelectedType] = useState("");

  const renderModule = () => {
    switch (selectedType) {
      case "skin":
        return <AnalysisModule title="🧑‍⚕️ Dermatologist AI" description="Upload a clear photo of a skin lesion." endpoint="/predict/skin" />;
      case "xray":
        return <AnalysisModule title="☢️ Radiologist AI" description="Upload a chest X-ray for pneumonia detection." endpoint="/predict/xray" />;
      case "mri":
        return <AnalysisModule title="🧠 Neurologist AI" description="Upload a brain MRI for tumor classification." endpoint="/predict/mri" />;
      case "text":
        return <AnalysisModule title="📝 Symptom Analyzer" description="Describe your symptoms for a text-based analysis." endpoint="/predict/text" isText={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="analysis-page">
      <h2>Specialist AI Analysis Hub</h2>
      <p className="page-description">
        Select the type of disease or analysis you want to perform.
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="dropdown"
        >
          <option value="">-- Select Disease Type --</option>
          <option value="skin">🧑‍⚕️ Skin (Dermatology)</option>
          <option value="xray">☢️ X-ray (Radiology)</option>
          <option value="mri">🧠 Brain MRI (Neurology)</option>
          <option value="text">📝 Symptom (Text)</option>
        </select>
      </div>

      <div className="modules-container">
        {renderModule() || (
          <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>
            Please select a disease type to continue.
          </p>
        )}
      </div>
    </div>
  );
}
