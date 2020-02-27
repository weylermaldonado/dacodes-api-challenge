const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

function checkInput(input) {
    if (isNaN(input)) {
        throw new Error('Provide a valid number');
    }
    if (input < 0 || input > 5001) {
        throw new Error('Please provide a number between 1-5000');
    }
    return parseInt(input);
    
}

function inputNumbers(question) {
  return new Promise((resolve) => {
    readline.question(question, (input) => {
        const numberOftestCases = checkInput(input);
        return resolve(numberOftestCases);
    });
  });
}

async function main() {
    let count = 0;
    const matrix = [];
    const testCases = await inputNumbers('Type the number of test cases: ');
    if (testCases) console.log('You typed: ', testCases);

    while(count < testCases) {
        let N = await inputNumbers(`Provide N for matrix #${count + 1}: `);
        let M = await inputNumbers(`Provide N for matrix #${count + 1}: `);
        matrix.push([M, N]);
        count++;
    }

    console.log(matrix);
    calculateEndingView(matrix);
    readline.close();
}

function calculateEndingView(matrix) {
    if (matrix.length > matrix[0].length) {
        if (matrix[0].length % 2 === 0){
            console.log('You\'re looking: D');
        } else {
            console.log(' You\'re looking: U');
        }
    } else if (matrix.length === matrix[0].length || matrix.length < matrix[0].length) {
        if (matrix.length % 2 === 0){
            console.log(' You\'re looking: L');
        } else {
            console.log('You\'re looking: R');
        }
    }
}

main();
