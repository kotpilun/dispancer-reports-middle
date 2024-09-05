import { body } from 'express-validator';

export const childCreateValidator = [
    body('name', 'Введите Имя минимум 3 символа').isLength({ min: 3 }).isString(),
    body('surname', 'Введете фамилию минимум 3 символа').isLength({ min: 3 }).isString(),
    body('secondName', 'Введите отчество минимум 3 символа').isLength({ min: 3}).isString(),
    body('dateOfBirth', 'Введите дату в формате "DD.MM.YYYY"').isLength({ min: 10}).isString(),
    body('sportsCategory', 'Введите спортивную категорию').isLength({ min: 3}).isString(),
    body('address', 'Введите адрес').isLength({ min: 3}).isString(),
];