export const modifyDateOfBirth = (date) => {
    date = date.split('-').reverse().join('.');

    return date;
}