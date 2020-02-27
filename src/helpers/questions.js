const questionsTypes = ['boolean', 'only-one', 'more-than-one', 'more-than-one-all'];


function verifyQuestions(questions) {
    if (!Array.isArray(questions)) {
        return { isCorrect: false, message: 'The questions should be an array.' };
    } else if (questions.length === 0) {
        return { isCorrect: false, message: 'The questions shouldn\'t be empty.' };
    } else {
        for (const question of questions) {
            if (!question.text || !question.type || !question.answers || questionsTypes.indexOf(question.type) === -1) {
                return { isCorrect: false, message: 'Each question should have a text, type and answers property. The available questions types are: ' + questionsTypes };
            } else if(!Array.isArray(question.answers) || question.answers.length === 0) {
            return { isCorrect: false, message: 'The answers should be a no empty array.' };
            } else {
                for (const answer of question.answers) {
                    if (!answer.score || !answer.text || !answer.isCorrect) {
                        return  { isCorrect: false, message: 'Each answer should have a text, score and isCorrect property.' };
                    }
                }
            }
        }
    }

    return  { isCorrect: true, message: '' };
}

module.exports = { verifyQuestions };