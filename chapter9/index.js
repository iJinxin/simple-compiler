// import Lexer from './lexer'
// import Parser from './parser'
// import Interpreter from './interpreter'
const Lexer = require('./lexer')
const Parser = require('./parser')
const Interpreter = require('./interpreter')
const { readLine, close } = require('../utils/readline')
// const testFile = require('./a.txt')

const fs = require('fs')
const path = require('path')

const resolve = function (file) {
    return path.resolve(__dirname, file)
}

async function main() {
    // let text = await readLine();
    // let data = fs.readFileSync(path.resolve(__dirname, 'a.txt'))

    fs.readFile(resolve('a.txt'), 'utf-8', (err, data) => {
        if (err) {
            throw err
        }

        // parse here
        console.log(data)

        let lexer = new Lexer(data.toString());
        let parser = new Parser(lexer);

        let interpreter = new Interpreter(parser)

        let result = interpreter.interpreter()

        console.log(`'result:' = ${result}`);

    })


    return;
}
module.exports = main;