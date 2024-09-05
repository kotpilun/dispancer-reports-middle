import { validationResult } from 'express-validator';
import ChildModel from '../models/Child.js'

// export const getAllChildren = async (req, res) => {
//     try {
//         const allChildren = await ChildModel.find().populate('dispancer').exec();

//         res.json(allChildren);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: 'Не удалось получить данные',
//         });
//     };
// };

export const getAllChildren = async (req, res) => {
    try {
        const allChildren = await ChildModel.find().populate('dispancer').exec();

        const formattedChildren = allChildren.map(child => ({
            _id: child._id,
            name: child.name,
            surname: child.surname,
            secondName: child.secondName,
            dateOfBirth: child.dateOfBirth,
            sportsCategory: child.sportsCategory,
            address: child.address,
            dispancer: child.dispancer.name, // Извлечение только имени диспансера
            createdAt: child.createdAt,
            updatedAt: child.updatedAt,
            __v: child.__v
        }));

        res.json(formattedChildren);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить данные',
        });
    }
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
            secondName: req.body.secondName,
            dateOfBirth: req.body.dateOfBirth,
            sportsCategory: req.body.sportsCategory,
            address: req.body.address,
            dispancer: req.body.dispancer
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