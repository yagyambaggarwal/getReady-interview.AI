// import { GoogleGenAI } from "@google/genai"
// import { z } from "zod";
// import { zodToJsonSchema } from "zod-to-json-schema"




// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY
// })


// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
//     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
//     title: z.string().describe("The title of the job for which the interview report is generated"),
// })


// export const generateInterviewReport = async function ({ resume, selfDescription, jobDescription }) {


//     //     const prompt = `Generate an interview report for a candidate with the following details:
//     //                         Resume: ${resume}
//     //                         Self Description: ${selfDescription}
//     //                         Job Description: ${jobDescription}
//     // `


//     const prompt = `
// You are an expert interview preparation AI.

// You MUST return ONLY valid JSON matching the schema exactly.

// DO NOT omit any field.
// DO NOT return empty object.
// DO NOT skip arrays.

// Rules:
// - matchScore must be number 0-100
// - all arrays must have at least 3 items
// - NO field can be missing
// - DO NOT return markdown

// Candidate Resume:
// ${resume}

// Self Description:
// ${selfDescription}

// Job Description:
// ${jobDescription}

// Return strictly in schema format.
// `;


//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(interviewReportSchema),
//         }
//     })

//     // console.log(response.text);
//     return JSON.parse(response.text)

// }


import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number(),

    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })).min(3),

    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })).min(3),

    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })).min(3),

    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })).min(3),

    title: z.string()
});

export const generateInterviewReport = async function ({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `You are an expert interview preparation AI.

YOU MUST RETURN ONLY VALID JSON IN THIS EXACT FORMAT - NO VARIATIONS:

{
  "matchScore": 75,
  "technicalQuestions": [
    {
      "question": "What is a question text here?",
      "intention": "What is the interviewer testing with this question?",
      "answer": "How should the candidate answer this with specific details, examples, and technical depth?"
    },
    {
      "question": "Another technical question?",
      "intention": "Another testing intention",
      "answer": "Another detailed answer"
    },
    {
      "question": "Third technical question?",
      "intention": "Testing intention",
      "answer": "Detailed answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a time when...",
      "intention": "Testing communication or leadership",
      "answer": "Use STAR method: Situation, Task, Action, Result..."
    },
    {
      "question": "Describe a situation where...",
      "intention": "Testing conflict resolution",
      "answer": "Specific example with details"
    },
    {
      "question": "How do you handle...",
      "intention": "Testing adaptability",
      "answer": "Concrete example"
    }
  ],
  "skillGaps": [
    {
      "skill": "AWS cloud services",
      "severity": "high"
    },
    {
      "skill": "Kubernetes orchestration",
      "severity": "medium"
    },
    {
      "skill": "gRPC implementation",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Microservices Architecture Patterns",
      "tasks": [
        "Study service discovery, API gateways, and inter-service communication",
        "Research CQRS and Event Sourcing patterns with real examples",
        "Design a simple microservice architecture diagram"
      ]
    },
    {
      "day": 2,
      "focus": "Cloud Platforms & Containerization",
      "tasks": [
        "Complete AWS EC2 and S3 tutorials",
        "Learn Docker: Dockerfile, image building, container running",
        "Deploy a simple Node.js app to Docker"
      ]
    },
    {
      "day": 3,
      "focus": "Kubernetes & Orchestration",
      "tasks": [
        "Study pods, services, deployments in Kubernetes",
        "Practice deploying containers using kubectl",
        "Understand scaling and rolling updates"
      ]
    }
  ],
  "title": "Senior Backend Engineer"
}

CRITICAL RULES:
- Each question MUST have exactly 3 fields: question, intention, answer (ALL REQUIRED)
- Each skillGap MUST have exactly 2 fields: skill, severity (ALL REQUIRED)
- Each preparationPlan day MUST have exactly 3 fields: day (number), focus, tasks (array of 2-4 strings)
- MINIMUM 3 items in each array
- NO string arrays - EVERY array must contain objects with the specified fields
- NO nested text with newlines like "Day 1:\nTasks:\n-" - use proper JSON structure
- matchScore is a number 0-100
- Return ONLY the JSON object - NO explanations, NO markdown, NO extra text
- If you don't know a field, use realistic placeholder data

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Generate the JSON report now:`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    // 🔥 IMPORTANT FIX: DO NOT trust only response.text
    const raw =
        response.text ||
        response.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("🔥 RAW AI RESPONSE:\n", raw);

    if (!raw) {
        throw new Error("Empty response from AI");
    }

   let parsed;
try {
    parsed = JSON.parse(response.text);
} catch (err) {
    console.log("RAW:", response.text);
    throw new Error("Invalid JSON from AI");
}

    // 🔥 FINAL SAFETY LAYER (CRITICAL)
    return {
    matchScore: parsed.matchScore ?? 0,

    technicalQuestions:
        parsed.technicalQuestions ||
        parsed.interview_questions ||
        [],

    behavioralQuestions:
        parsed.behavioralQuestions ||
        [],

    skillGaps:
        parsed.skillGaps ||
        parsed.skill_gaps ||
        [],

    preparationPlan:
        parsed.preparationPlan ||
        parsed.preprationPlan ||
        parsed.preparation_plan ||
        [],

    title: parsed.title || "Interview Report"
};
};


// 🔥 FALLBACKS (UNCHANGED BUT SAFE)

function generateFallbackTechnical() {
    return [
        {
            question: "Explain REST API design principles.",
            intention: "Check backend fundamentals",
            answer: "Stateless APIs, proper HTTP methods, and resource-based structure."
        },
        {
            question: "What is middleware in Node.js?",
            intention: "Check backend flow understanding",
            answer: "Middleware runs between request and response lifecycle."
        },
        {
            question: "How does caching improve performance?",
            intention: "System optimization",
            answer: "Reduces database load and improves response time."
        }
    ];
}

function generateFallbackBehavioral() {
    return [
        {
            question: "Tell me about a challenging project.",
            intention: "Problem solving",
            answer: "Use STAR method to explain situation, action, result."
        },
        {
            question: "How do you handle pressure?",
            intention: "Stress management",
            answer: "Prioritize tasks and communicate clearly."
        },
        {
            question: "Describe a team conflict.",
            intention: "Teamwork",
            answer: "Explain how you resolved conflict professionally."
        }
    ];
}

function generateFallbackSkills() {
    return [
        { skill: "System Design", severity: "high" },
        { skill: "Scalability", severity: "high" },
        { skill: "Distributed Systems", severity: "medium" }
    ];
}

function generateFallbackPlan() {
    return [
        {
            day: 1,
            focus: "System Design Basics",
            tasks: ["Read scalability concepts", "Watch architecture videos"]
        },
        {
            day: 2,
            focus: "Backend Fundamentals",
            tasks: ["Revise Node.js", "Practice API design"]
        },
        {
            day: 3,
            focus: "Mock Interview",
            tasks: ["Solve DSA problems", "Practice behavioral questions"]
        }
    ];
}