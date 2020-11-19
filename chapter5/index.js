/**
 * 1.对算术表达式做词法分析
 * 2.能够解析任意合法的加减乘除组合
 * 3.按算数符权重计算得值
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

class Lexer {
    constructor(text) {
        this.text = text
        this.pos = 0
        this.current_char = text.charAt(0)
    }
    error() {
        throw new Error("character error")
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
    skip_whitespace() {

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
            } else if (this.current_char == ' ') {
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
                this.error()
            }
        }
        return new Token(EOF, null)
    }
    isNumber(char) {
        let reg = /\d/g
        return reg.test(char)
    }
}

class Parser {
    constructor(lexer) {
        this.lexer = lexer
        this.current_token = lexer.get_next_token()
    }
    error() {
        throw new Error("syntax error")
    }
    eat(token_type) {
        if (this.current_token.type === token_type) {
            this.current_token = this.lexer.get_next_token()
        } else {
            this.error()
        }
    }
    factor() {
        let token = this.current_token
        this.eat(INTEGER)
        return token.value
    }
    term() {
        let result = this.factor()
        while([MULTIPLY, DIVIDE].includes(this.current_token.type)) {
            if (this.current_token.type === MULTIPLY) {
                this.eat(MULTIPLY)
                result = result * this.factor()
            } else {
                this.eat(DIVIDE)
                result = result / this.factor()
            }
        }
        return result
    }
    expr() {
        let result = this.term()

        while([PLUS, MINUS].includes(this.current_token.type)) {
            if (this.current_token.type === PLUS) {
                this.eat(PLUS)
                result = result + this.term()
            } else {
                this.eat(MINUS)
                result = result - this.term()
            }
        }
        return result
    }
}

async function main() {
    while (true) {
        let text;
        try {
            let text = await readLine()
            let lexer = new Lexer(text)
            let parser = new Parser(lexer)

            let result = parser.expr()

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