import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid"; // Use uuid package to generate dynamic user ID

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Example POST route: /bfhl
app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ is_success: false, error: "Invalid input format" });
    }

    // Generate dynamic user data (in real application, fetch from DB or generate dynamically)
    const user_id = uuidv4(); // Dynamically generate user ID
    const email = `${user_id}@example.com`; // Use user ID to generate a dynamic email
    const roll_number = `ROLL${user_id.slice(0, 8).toUpperCase()}`; // Generate dynamic roll number

    // Separate numbers and alphabets
    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));

    // Determine the highest lowercase alphabet
    const lowercaseAlphabets = alphabets.filter((char) => char === char.toLowerCase());
    const highestLowercaseAlphabet = lowercaseAlphabets.sort().pop() || null;

    // Check for prime numbers in input
    const isPrime = (num) => {
      if (num < 2) return false;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
      }
      return true;
    };

    const isPrimeFound = numbers.some((num) => isPrime(Number(num)));

    // File validation (if file_b64 exists)
    let fileValid = false;
    let mimeType = null;
    let fileSizeKB = null;

    if (file_b64) {
      try {
        const buffer = Buffer.from(file_b64, "base64");
        fileValid = true;
        mimeType = "application/octet-stream"; // Placeholder, adjust if MIME detection is implemented
        fileSizeKB = (buffer.length / 1024).toFixed(2); // Convert bytes to KB
      } catch (e) {
        fileValid = false;
      }
    }

    // Response
    const response = {
      is_success: true,
      user_id,
      email,
      roll_number,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
      is_prime_found: isPrimeFound,
      file_valid: fileValid,
      file_mime_type: mimeType,
      file_size_kb: fileSizeKB,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ is_success: false, error: "Internal Server Error" });
  }
});

// Example GET route: /bfhl
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
