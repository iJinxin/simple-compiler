/**
 * 1.Modify the code to allow multiple-digit integers in the input, for example “12+3”
 * 2.Add a method that skips whitespace characters so that your calculator can handle inputs with whitespace characters like ” 12 + 3”
 * 3.Modify the code and instead of ‘+’ handle ‘-‘ to evaluate subtractions like “7-5”
 */

const { readLine, close } = require('../utils/readline')

class Token {
    // 初始化 type， value
    constructor(type, value) {
        this.type = type
        this.value = value
    }
}

class Interpreter {
    constructor(text) {
        // pos, text, currentToken
        this.pos = 0
        this.text = text
        this.current_char = this.text.charAt(0)
    }
    errors() {
        throw new Error("parsing error")
    }
    advance() {
        // pos指针前移，更新current_char
        this.pos += 1
        if (this.pos > this.text.length -1) {
            this.current_char = null
        } else {
            this.current_char = this.text.charAt(this.pos)
        }
    }
    integer() {
        // 连续数字拼接，返回完整整数
        let result = ""
        while(this.current_char != null && this.isNumber(this.current_char)) {
            result += this.current_char
            this.advance()
        }
        return Number(result)
    }
    get_next_token() {
        // This method is responsible for breaking a sentence apart into tokens. One token at a time.
        while (this.current_char != null) {
            if (this.isNumber(this.current_char)) {
                return new Token('INTEGER', this.integer())
            } else if (this.current_char == " ") {
                this.advance()
            } else if (this.current_char == '+') {
                let token = new Token('PLUS', this.current_char)
                this.advance()
                return token
            } else if (this.current_char == '-') {
                let token = new Token('MINUS', this.current_char)
                this.advance()
                return token
            } else {
                this.errors()
            }
        }
        return new Token('EOF', null)
    }
    expr() {
        // set current token to the first token taken from the input
        let left = this.get_next_token()
        let operator = this.get_next_token()
        let right = this.get_next_token()

        let result = 0
        if (operator.type == 'PLUS') {
            result = left.value + right.value
        } else {
            result = left.value - right.value
        }

        return result
    }
    isNumber(char) {
        let reg = /\d/g
        return reg.test(char)
    }
}

async function main() {
    while (true) {
        try {
            let text = await readLine()
            let interpreter = new Interpreter(text)
            let result = interpreter.expr()

            console.log(`${text} = ${result}`)
        } catch (e) {
            console.error(e)
            close()
            break
        }
    }
}

main()