import { validationResult } from 'express-validator';
import ChildModel from '../models/Child.js'

export const getAllChildren = async (req, res) => {
    try {
        const allChildren = await ChildModel.find();

        res.json(allChildren);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить данные',
        });
    };
};

export const postChild = async (req, res) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        

        const doc = new ChildModel({
            name: req.body.name,
            surname: req.body.surname,
            secondName: req.body.secondName
        });

        const child = await doc.save();

        res.json({ child });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось добавить данные',
        });
    };
};