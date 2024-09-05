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
        dateOfBirth: {
            type: String,
            required: true
        },
        sportsCategory: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        dispancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dispancer',
            required: true
        },
    },
        
    {
        timestamps: true, 
    }
);

export default mongoose.model('Child', ChildSchema);