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

export const updateChild = async (req, res) => {
    try {
        await ChildModel.updateOne(
            {
                _id: req.params.id
            }, 
            {
                name: req.body.name,
                surname: req.body.surname,
                secondName: req.body.secondName,
            }
    );

    res.json({
        success: true,
        message: {
            name: req.body.name,
            surname: req.body.surname,
            secondName: req.body.secondName,
        }
    })

    } catch (error) {
        res.status(500).json({
            message: 'Не удалось изменить запись'
        });
        console.log(error);
    };
};

export const deleteChild = async (req, res) => {
    try {
        await ChildModel.deleteOne(
            {
                _id: req.params.id
            }
        );
    res.json({
        success: true,
        message: {
            id: req.params.id
        }
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось удалить запись'
        });
    };
}