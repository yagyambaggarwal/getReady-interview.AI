import { jwtVerified } from "../middleware/auth.middleware.js";
import { Router } from "express";
import { upload } from "../middleware/fileUpload.middleware.js";
import { generateInterviewReportController } from "../controllers/interview.controllers.js";

export const interviewRouter = Router();


interviewRouter.route("/").post(jwtVerified, upload.single("resume"), generateInterviewReportController);
