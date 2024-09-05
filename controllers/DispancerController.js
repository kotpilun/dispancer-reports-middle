import DispancerModel from '../models/Dispancer.js'

export const postDispancer = async (req, res) => {
    try {
        console.log(req);
        const doc = new DispancerModel({
            name: req.body.name
        });

        const dispancer = await doc.save();

        res.json({ dispancer });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось добавить диспансер"
        });
    };
};

export const getAllDispancers = async (req, res) => {
    try {
        const allDispancers = await DispancerModel.find();

        res.json({ allDispancers });
    } catch (error) {
        res.status(500).json({
            message: 'Не удалось получить дтспансеры!'
        })
    }
}