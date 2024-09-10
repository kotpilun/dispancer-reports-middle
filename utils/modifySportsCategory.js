export function modifySportsCategory(data) {
    switch (data.sportsCategory) {
        case '1 р.':
            data.sportsCategory = "I";
            break;
        case '2 р.':
            data.sportsCategory = "II";
            break;
        case '3 р.':
            data.sportsCategory = "III";
            break;
        case '3 юн. р.':
            data.sportsCategory = "III юн.";
            break;
        case '2 юн. р.':
            data.sportsCategory = "II юн.";
            break;
        case '1 юн. р.':
            data.sportsCategory = "I юн.";
            break;
    
        default:
            break;
    }

    return data.sportsCategory;
}