/**
 * 1.乘法
 * 2.除法
 * 3.任意数量加减法
 */

const { readLine, close } = require('../utils/readline')
const [INTEGER, EOF, PLUS, MINUS, MULTIPLY, DIVIDE] = ['INTEGER', 'EOF', 'PLUS', 'MINUS', 'MULTIPLY', 'DIVIDE']

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
        this.current_token = null
    }
    errors() {
        throw new Error("parsing error")
    }
    advance() {
        // pos指针前移，更新current_char
        this.pos += 1
        if (this.pos > this.text.length - 1) {
            this.current_char = null
        } else {
            this.current_char = this.text.charAt(this.pos)
        }
    }
    integer() {
        // 连续数字拼接，返回完整整数
        let result = ""
        while (this.current_char != null && this.isNumber(this.current_char)) {
            result += this.current_char
            this.advance()
        }
        return Number(result)
    }
    get_next_token() {
        // This method is responsible for breaking a sentence apart into tokens. One token at a time.
        while (this.current_char != null) {
            if (this.isNumber(this.current_char)) {
                return new Token(INTEGER, this.integer())
            } else if (this.current_char ==  ' ') {
                this.advance()
            } else if (this.current_char == '+') {
                this.advance()
                return new Token(PLUS, '+')
            } else if (this.current_char == '-') {
                this.advance()
                return new Token(MINUS, '-')
            } else if (this.current_char == '*') {
                this.advance()
                return new Token(MULTIPLY, '*')
            } else if (this.current_char == '/') {
                this.advance()
                return new Token(DIVIDE, '/')
            } else {
                this.errors()
            }
        }
        return new Token(EOF, null)
    }
    eat(token_type) {
        if (this.current_token.type == token_type) {
            this.current_token = this.get_next_token()
        } else {
            this.errors()
        }
    }
    // 处理数字，如不是数字则抛错
    term() {
        let token = this.current_token
        this.eat(INTEGER)

        return token.value
    }
    expr() {
        // set current token to the first token taken from the input
        this.current_token = this.get_next_token()

        // 首次get_next_token，必须是数字
        let result = this.term()

        // INTEGER后的token需要是运算符，运算符后的token需要为INTEGER
        while ([PLUS, MINUS].includes(this.current_token.type)) {
            let token = this.current_token
            if (token.type == PLUS) {
                this.eat(PLUS)
                result += this.term()
            } else if (token.type == MINUS) {
                this.eat(MINUS)
                result -= this.term()
            }
        }
        // 原文在这里有bug，例如’1+2 3‘应该报语法错误，但实际会输出3
        if (this.current_token.type != EOF) {
            this.errors()
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
        let text;
        try {
            let text = await readLine()
            let interpreter = new Interpreter(text)
            let result = interpreter.expr()

            console.log(`${text} = ${result}`)
            // close()
            // break
        } catch (e) {
            console.error(e)
            close()
            break
        }
    }
}
// main()
module.exports = main