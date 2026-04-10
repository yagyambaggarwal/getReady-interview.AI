import mongoose, {Schema, model} from "mongoose";


const technicalQuestionSchema = new Schema( 
    {
        question : {
            type : String,
            required : true
        },
        // Intention behinf this question
        intention : {
            type : String,
            required : true
        },
        answer : {
            type : String,
            required : true
        }
    }
    , {_id : false}
)


const behavioralQuestionSchema = new Schema(
    {
        question : {
            type : String,
            required : true
        },
        intention : {
            type : String,
            required: true
        },
        answer : {
            type : String,
            required : true
        }
    }, {_id : false}
)


const skillGapSchema = new Schema(
    {
        skill : {
            type : String,
            required : true
        },
        severity : {
            type : String,
            enum : ["low", "medium", "high"],
            required : true
        }
    }, {_id : false}
)


const preprationPlanSchema = new Schema(
    {
        day : {
            type : Number,
            required : true
        },
        focus : {
            type : String,
            required : true
        },
        tasks : [
            {
                type : String,
                required : true
            }
        ]
    }, {_id : false}
)






const interviewReportSchema = new Schema(
    {
        jobDescription : {
            type : String,
            required : [true, "Job Description is required."]
        },
        resume : {
            type : String
        },
        selfDescription : {
            type : String
        },
        matchScore : {
            type : Number,
            min : 0,
            max : 100
        },
        technicalQuestion : [technicalQuestionSchema],
        behaviouralQuestion : [behavioralQuestionSchema],
        skillGap : [skillGapSchema],
        preprationPlan : [preprationPlanSchema]

    },
    {
        timestamps : true
    }
);

export const Report = new mongoose("Report", interviewReportSchema);