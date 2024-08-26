import express from "express";
import mongoose from "mongoose";

import * as ChildController from './controllers/ChildController.js'
import { childCreateValidator } from "./validations/child.js";

mongoose.connect('mongodb://admin:secret@localhost:27017/dispancer?authSource=admin')
    .then(() => console.log('DB STARTED ON PORT 27017'))
    .catch((err) => console.log('DB ERROR: ', err));

const PORT = 4444;
const app = express();

app.use(express.json());

app.get('/children', ChildController.getAllChildren);
app.post('/children', childCreateValidator, ChildController.postChild);


app.listen(PORT, (err) => {
    if (err) {
        return console.log('ERROR');
    }

    return console.log('SEREVER OK ON PORT: ', PORT);
});

