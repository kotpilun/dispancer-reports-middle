import express from "express";
import mongoose from "mongoose";

const app = express();

app.get('/', (req, res) => {
    res.send('Hello SERVER');
});

app.listen(4444, (err) => {
    if (err) {
        return console.log('ERROR');
    }

    return console.log('SEREVER ON PORT 4444 OK');
});

