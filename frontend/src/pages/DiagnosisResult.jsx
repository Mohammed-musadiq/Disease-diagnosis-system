import ChatBot from "../components/ChatBot";

export default function DiagnosisResult() {
  const diagnosis = "Hypertension"; // Example

  return (
    <div>
      <h2>Your diagnosis: {diagnosis}</h2>
      <ChatBot />
    </div>
  );
}