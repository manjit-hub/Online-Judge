// models/Problem.js
import mongoose  from 'mongoose';

const problemSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true 
    },
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    solved: {
        type: String,
        default: "No"
    },
    acceptance_rate: {
        type: Number,
        default:  null,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    testCases: [
        {
            input: String,
            output: String,
            explanation: String 
        }
    ]
});

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
