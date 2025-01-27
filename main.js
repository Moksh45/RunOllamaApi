const axios = require("axios");

async function callOllamaAPIAndExtractContent(modelName, prompt) {
  const url = "https://rnfmi-2409-40e3-5045-5978-28ad-267b-e4fb-96fe.a.free.pinggy.link/api/chat";
  let fullContent = ''; // Variable to accumulate content

  const requestBody = {
    model: modelName,
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "stream",
    });

    response.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n").filter(Boolean);
      lines.forEach((line) => {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            fullContent += parsed.message.content; // Accumulate content
          }
        } catch (err) {
          console.error("Parsing error:", err.message);
        }
      });
    });

    response.data.on("end", () => {
      console.log(fullContent); // Output accumulated content in single line
    });

  } catch (error) {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Details:", error.response.data);
    }
  }
}

// Example usage
(async () => {
  const modelName = "qwen:0.5b";
  const prompt = "write the hello world program in python";
  await callOllamaAPIAndExtractContent(modelName, prompt);
})();
