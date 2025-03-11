export const getBoxColor = (letter, index, feedback) => {
    if (!feedback) return '#fff';

    const feedbackTypes = {
        'G': 'green',
        'Y': '#FFCC00',
        'B': 'gray'
    };

    const feedbackLetter = feedback[index];
    return feedbackTypes[feedbackLetter] || '#fff';
};