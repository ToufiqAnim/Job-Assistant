export const parseJSON = (text) => {
  try {
    // Remove markdown code blocks
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Find first { and last }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON object found in response");
    }

    const jsonStr = cleaned.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("JSON parse error:", error);
    console.error("Raw text:", text);
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
};
