import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            reqired: true
        },
        secondName: {
            type: String,
            required: true
        },
    },
        
    {
        timestamps: true, 
    }
);

export default mongoose.model('Child', ChildSchema);