// // import { createRequire } from "module";
// // const require = createRequire(import.meta.url);

// // const pdfModule = require("pdf-parse");
// // const pdf = pdfModule.default || pdfModule;

// // import { generateInterviewReport } from "../services/ai.service.js";
// // import { Report } from "../models/interviewReport.model.js";

// // export const generateInterviewReportController = async (req, res) => {

// //     const { selfDescription, jobDescription } = req.body;

// //     if (!selfDescription || !jobDescription) {
// //         return res.status(400).json({ message: "Self Description and JD is required." });
// //     }

// //     const resumeContent = await pdf(req.file.buffer);


// //     const interViewReportByAi = await generateInterviewReport({
// //         resume: resumeContent.text,
// //         selfDescription,
// //         jobDescription
// //     });

// //     const interviewReport = await Report.create({
// //         user: req.user._id,
// //         resume: resumeContent.text,
// //         selfDescription,
// //         jobDescription,
// //         ...interViewReportByAi
// //     });

// //     return res.status(201).json({
// //         message: "Interview report generated successfully.",
// //         data: interviewReport
// //     });
// // };


// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// import { generateInterviewReport } from "../services/ai.service.js";
// import { Report } from "../models/interviewReport.model.js";

// async function extractText(buffer) {
//     const uint8Array = new Uint8Array(buffer); // 🔥 FIX
//     const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;   
//     // getDocument({ data: new Uint8Array(buffer) })

//     let text = "";

//     for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         text += content.items.map(item => item.str).join(" ") + " ";
//     }

//     return text;
// }

// export const generateInterviewReportController = async (req, res) => {

//     try {
//         const { selfDescription, jobDescription } = req.body;

//         if (!selfDescription || !jobDescription) {
//             return res.status(400).json({
//                 message: "Self Description and JD is required."
//             });
//         }

//         const resumeText = await extractText(req.file.buffer);

//         const aiResult = await generateInterviewReport({
//             resume: resumeText,
//             selfDescription,
//             jobDescription
//         });

//         const interviewReport = await Report.create({
//             user: req.user._id,
//             resume: resumeText,
//             selfDescription,
//             jobDescription,
//             ...aiResult
//         });

//         return res.status(201).json({
//             message: "Interview report generated successfully.",
//             data: interviewReport
//         });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };








import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { generateInterviewReport } from "../services/ai.service.js";
import { Report } from "../models/interviewReport.model.js";

/**
 * Extract text from PDF buffer
 */
async function extractText(buffer) {
    const uint8Array = new Uint8Array(buffer);

    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n";
    }

    return text.trim();
}

/**
 * Controller
 */
export const generateInterviewReportController = async (req, res) => {
    try {
        const { selfDescription, jobDescription } = req.body;

        // 1. Validate input
        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: "Self Description and JD is required."
            });
        }

        if (!req.file?.buffer) {
            return res.status(400).json({
                message: "Resume PDF is required."
            });
        }

        // 2. Extract resume text
        const resumeText = await extractText(req.file.buffer);

        // 3. Call AI service
        const aiResult = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        console.log("🔥 Processing AI result...");

        // 4. Transform AI response to match schema structure
        // The AI may return strings instead of objects, so we normalize them
        const transformQuestions = (questions) => {
            return (questions || []).map((q, idx) => {
                if (typeof q === 'object' && q.question) {
                    return q; // Already an object
                }
                // String format - just use as question, generic intention/answer
                return {
                    question: typeof q === 'string' ? q : JSON.stringify(q),
                    intention: "Interview assessment",
                    answer: "Refer to the question and prepare a comprehensive answer with specific examples and technical depth."
                };
            });
        };

        const transformSkillGaps = (gaps) => {
            return (gaps || []).map((gap, idx) => {
                if (typeof gap === 'object' && gap.skill) {
                    return gap; // Already an object
                }
                // String format - guess severity
                return {
                    skill: typeof gap === 'string' ? gap : JSON.stringify(gap),
                    severity: idx % 3 === 0 ? "high" : idx % 3 === 1 ? "medium" : "low"
                };
            });
        };

        const transformPrepPlan = (plans) => {
            return (plans || []).map((plan, idx) => {
                if (typeof plan === 'object' && plan.day) {
                    return plan; // Already an object
                }
                // String format - extract day from text or use index
                const planText = typeof plan === 'string' ? plan : JSON.stringify(plan);
                const dayMatch = planText.match(/Day\s*(\d+)/i);
                const day = dayMatch ? parseInt(dayMatch[1]) : idx + 1;
                
                return {
                    day: day,
                    focus: planText.split('.')[0] || "Preparation",
                    tasks: [planText] // Put the entire text as one task
                };
            });
        };

        const normalizedResult = {
            matchScore: aiResult.matchScore ?? 0,
            technicalQuestion: transformQuestions(aiResult.technicalQuestions),
            behaviouralQuestion: transformQuestions(aiResult.behavioralQuestions),
            skillGap: transformSkillGaps(aiResult.skillGaps),
            preprationPlan: transformPrepPlan(aiResult.preparationPlan),
            title: aiResult.title || "Interview Report"
        };

        // 5. Save to DB (NO spread operator confusion)
        const interviewReport = await Report.create({
            user: req.user._id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...normalizedResult
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            data: interviewReport
        });

    } catch (err) {
        console.error("Controller Error:", err);
        return res.status(500).json({
            message: "Server error while generating interview report"
        });
    }
};