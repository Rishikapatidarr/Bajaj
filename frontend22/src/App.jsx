import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set page title to roll number
  document.title = "ABCD123"; // Replace with your actual roll number

  // Handle form submission
  const handleSubmit = async () => {
    setError("");
    setResponseData(null);

    try {
      // Validate JSON input
      const parsedData = JSON.parse(jsonInput);

      setLoading(true); // Set loading state to true

      // Call the backend API
      const response = await axios.post("http://localhost:3000/bfhl", parsedData);

      // Set the response data in state
      setResponseData(response.data);
    } catch (err) {
      // Handle errors (invalid JSON or API errors)
      setError("Invalid JSON or API error");
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Handle multi-select dropdown change
  const handleSelectChange = (event) => {
    const value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(value);
  };

  // Filter response data based on selected options
  const filterResponseData = () => {
    if (!responseData) return null;

    let filteredData = {};

    // Filter based on selected options
    if (selectedOptions.includes("Alphabets")) {
      filteredData.alphabets = responseData.alphabets;
    }
    if (selectedOptions.includes("Numbers")) {
      filteredData.numbers = responseData.numbers;
    }
    if (selectedOptions.includes("Highest lowercase alphabet")) {
      filteredData.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
    }

    return filteredData;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project API Interaction</h1>

      {/* Text input for JSON */}
      <textarea
        rows="5"
        cols="50"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON (e.g., { "data": ["A", "C", "z"] })'
      />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>

      {/* Display error if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display multi-select dropdown */}
      {responseData && (
        <>
          <div style={{ marginTop: "20px" }}>
            <label htmlFor="data-options">Select options to display:</label>
            <select
              id="data-options"
              multiple
              value={selectedOptions}
              onChange={handleSelectChange}
              style={{ width: "200px", height: "100px" }}
            >
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
            </select>
          </div>

          {/* Render filtered response based on selected options */}
          <div style={{ marginTop: "20px" }}>
            <h3>Filtered Response:</h3>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
              {JSON.stringify(filterResponseData(), null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
