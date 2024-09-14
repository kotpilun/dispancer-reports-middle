import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import * as ChildController from './controllers/ChildController.js'
import * as DispancerController from "./controllers/DispancerController.js";
import { childCreateValidator } from "./validations/child.js";
import { createDoc } from "./controllers/createDoc.js";


// mongoose.connect('mongodb://admin:secret@localhost:27017/dispancer?authSource=admin')
mongoose.connect('mongodb://mongo:27017/dispancer')
    .then(() => console.log('DB STARTED ON PORT 27017'))
    .catch((err) => console.log('DB ERROR: ', err));

const PORT = 4444;
const app = express();

app.use(express.json());
// app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors());

app.get('/children', ChildController.getAllChildren);
app.post('/children', childCreateValidator, ChildController.postChild);
app.post('/docs', createDoc);
app.patch('/children/:id', childCreateValidator, ChildController.updateChild);
app.delete('/children/:id', ChildController.deleteChild);

app.get('/dispancer', DispancerController.getAllDispancers);
app.post('/dispancer', DispancerController.postDispancer);


app.listen(PORT, (err) => {
    if (err) {
        return console.log('ERROR');
    }

    return console.log('SEREVER OK ON PORT: ', PORT);
});


