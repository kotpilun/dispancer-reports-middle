import mongoose, { Schema } from "mongoose";

const DispancerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true, 
    }
);

export default mongoose.model('Dispancer', DispancerSchema);