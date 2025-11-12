// agents/coach/utils/helpers.js

/**
 * Formats interview questions for display
 */
export const formatQuestion = (question, index) => {
  return {
    id: `q_${index + 1}`,
    number: index + 1,
    question: question.question,
    category: question.category || "general",
    suggestedAnswer: question.suggestedAnswer || "",
    keyPoints: question.keyPoints || [],
    tips: question.tips || [],
  };
};

/**
 * Groups questions by category
 */
export const groupQuestionsByCategory = (questions) => {
  const grouped = {};

  questions.forEach((question) => {
    const category = question.category || "general";

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(question);
  });

  return grouped;
};

/**
 * Counts questions by category
 */
export const countByCategory = (questions) => {
  const counts = {
    technical: 0,
    behavioral: 0,
    company: 0,
    scenario: 0,
    general: 0,
  };

  questions.forEach((question) => {
    const category = question.category || "general";
    if (counts.hasOwnProperty(category)) {
      counts[category]++;
    } else {
      counts.general++;
    }
  });

  return counts;
};

/**
 * Filters questions by category
 */
export const filterByCategory = (questions, category) => {
  return questions.filter((q) => q.category === category);
};

/**
 * Sorts questions by difficulty or category
 */
export const sortQuestions = (questions, sortBy = "category") => {
  const order = {
    technical: 1,
    behavioral: 2,
    scenario: 3,
    company: 4,
    general: 5,
  };

  return [...questions].sort((a, b) => {
    if (sortBy === "category") {
      return (order[a.category] || 5) - (order[b.category] || 5);
    }
    return 0;
  });
};

/**
 * Truncates text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Formats STAR method answer
 */
export const formatSTARAnswer = (situation, task, action, result) => {
  return `**Situation:** ${situation}\n\n**Task:** ${task}\n\n**Action:** ${action}\n\n**Result:** ${result}`;
};

/**
 * Validates question object structure
 */
export const validateQuestion = (question) => {
  const errors = [];

  if (!question.question || typeof question.question !== "string") {
    errors.push("Question text is required and must be a string");
  }

  if (!question.category || typeof question.category !== "string") {
    errors.push("Category is required and must be a string");
  }

  if (question.keyPoints && !Array.isArray(question.keyPoints)) {
    errors.push("keyPoints must be an array");
  }

  if (question.tips && !Array.isArray(question.tips)) {
    errors.push("tips must be an array");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates array of questions
 */
export const validateQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    return {
      isValid: false,
      errors: ["Questions must be an array"],
    };
  }

  const allErrors = [];

  questions.forEach((question, index) => {
    const validation = validateQuestion(question);
    if (!validation.isValid) {
      allErrors.push(`Question ${index + 1}: ${validation.errors.join(", ")}`);
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

/**
 * Generates question ID
 */
export const generateQuestionId = (question, index) => {
  const categoryPrefix = (question.category || "gen").substring(0, 3);
  return `${categoryPrefix}_${index + 1}_${Date.now()}`;
};

/**
 * Extracts keywords from question text
 */
export const extractKeywords = (text) => {
  const commonWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "about",
    "what",
    "how",
    "why",
    "when",
    "where",
    "who",
    "can",
    "could",
    "would",
    "should",
  ];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.includes(word));

  return [...new Set(words)];
};

/**
 * Calculates preparation time estimate
 */
export const estimatePrepTime = (questionsCount) => {
  const minutesPerQuestion = 5;
  const totalMinutes = questionsCount * minutesPerQuestion;

  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
};

/**
 * Creates practice schedule
 */
export const createPracticeSchedule = (questions, daysUntilInterview) => {
  const questionsPerDay = Math.ceil(questions.length / daysUntilInterview);

  const schedule = [];

  for (let day = 1; day <= daysUntilInterview; day++) {
    const startIndex = (day - 1) * questionsPerDay;
    const endIndex = Math.min(day * questionsPerDay, questions.length);
    const dayQuestions = questions.slice(startIndex, endIndex);

    schedule.push({
      day,
      date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toDateString(),
      questionsCount: dayQuestions.length,
      questions: dayQuestions,
      estimatedTime: estimatePrepTime(dayQuestions.length),
    });
  }

  return schedule;
};

/**
 * Formats company research for display
 */
export const formatCompanyResearch = (research) => {
  const sections = research.split("##").filter((s) => s.trim());

  return sections.map((section) => {
    const lines = section.trim().split("\n");
    const title = lines[0].trim();
    const content = lines.slice(1).join("\n").trim();

    return {
      title,
      content,
    };
  });
};

/**
 * Extracts key points from research
 */
export const extractKeyPoints = (research) => {
  const bulletPoints = research.match(/^[-•*]\s+(.+)$/gm) || [];
  return bulletPoints.map((point) => point.replace(/^[-•*]\s+/, "").trim());
};
