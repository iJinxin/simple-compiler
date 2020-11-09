/**
 * 1.Extend the calculator to handle multiplication of two integers
 * 2.Extend the calculator to handle division of two integers
 * 3.Modify the code to interpret expressions containing an arbitrary number of additions and subtractions, for example “9 - 5 + 3 + 11”
 * 
 * 1.乘法
 * 2.除法
 * 3.任意数量加减法
 */

const { readLine, close } = require('../utils/readline')
const [INTEGER, EOF, PLUS, MINUS, MUTIPLE, DIVIDE] = ['INTEGER', 'EOF', 'PLUS', 'MINUS', 'MUTIPLE', 'DIVIDE']

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
            } else if (this.current_char == " ") {
                this.advance()
            } else if (this.current_char == '+') {
                let token = new Token(PLUS, this.current_char)
                this.advance()
                return token
            } else if (this.current_char == '-') {
                let token = new Token(MINUS, this.current_char)
                this.advance()
                return token
            } else if (this.current_char == '*') {
                let token = new Token(MUTIPLE, this.current_char)
                this.advance()
                return token
            } else if (this.current_char == '/') {
                let token = new Token(DIVIDE, this.current_char)
                this.advance()
                return token
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
    expr() {
        // set current token to the first token taken from the input
        this.current_token = this.get_next_token()

        let left,operator,right;

        // 多个元素连续运算（未处理运算符优先级）
        while (this.current_char != null) {
            // 第一轮计算后，读入左值，运算符，右值后计算，并赋值给新左值
            // 之后读入运算符，右值，计算，赋值给新左值
            if (!right) {
                left = this.current_token.value
                this.eat(INTEGER)
            }
            operator = this.current_token
            this.eat(operator.type)

            right = this.current_token.value
            this.eat(INTEGER)

            if (operator.type == PLUS) {
                left = left + right
            } else if (operator.type == MINUS) {
                left = left - right
            } else if (operator.type == MUTIPLE) {
                left = left * right
            } else {
                left = left / right
            }

        }

        return left
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
main()