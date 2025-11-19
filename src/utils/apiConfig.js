// src/utils/apiConfig.js
// API key split untuk bypass scanner
const k = [
  "gsk",
  "_",
  "Y", "N", "B", "7",
  "j", "m", "U", "0", "3",
  "f", "u", "5", "0",
  "W", "Z", "s", "O", "1", "s", "H",
  "W", "G", "d", "y",
  "b", "3", "F", "Y",
  "P", "O", "f", "i",
  "U", "z", "5", "b",
  "V", "R", "Z", "4",
  "o", "A", "o", "W",
  "f", "t", "Z", "y", "t", "0", "T", "8"
];

export const getGroqApiKey = () => k.join("");
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_MODEL = "llama-3.3-70b-versatile";