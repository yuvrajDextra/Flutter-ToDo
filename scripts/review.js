const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runReview() {
  const diff = fs.readFileSync("pr.diff", "utf8");

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const result = await model.generateContent(`
    You are a senior Flutter developer reviewing a pull request.

    Analyze the following code changes and provide a structured review.

    Your response MUST include the following sections:

    1. Issues
    - List bugs, bad practices, or potential problems.

    2. Suggestions
    - Provide actionable improvements.

    3. Flutter Best Practices
    - Mention Flutter-specific improvements (performance, widget usage, rebuild optimization, etc.)

    4. Code Quality Score (1-10)
    - Give a score where:
    1 = very poor
    10 = production-ready, high quality

    5. Final Verdict
    - Clearly state ONE of the following:
    - ✅ Safe to Merge
    - ⚠️ Needs Improvement
    - ❌ Requires Urgent Fixes

    - Keep the response concise, professional, and easy to scan.

Code changes:
${diff}
`);

  const review = result.response.text();

  fs.writeFileSync("review.txt", review);
}

runReview();