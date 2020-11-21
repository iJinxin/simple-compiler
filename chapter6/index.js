const { readLine, close } = require('../utils/readline')
const [INTEGER, EOF, PLUS, MINUS, MULTIPLY, DIVIDE, L_PAREN, R_PAREN] = [
    "INTEGER",
    "EOF",
    "PLUS",
    "MINUS",
    "MULTIPLY",
    "DIVIDE",
    "L_PAREN",
    "R_PAREN",
];

class Token {
    constructor(type, value) {
        this.type = type
        this.value = value
    }
}

class Lexer {
    constructor(text) {
        this.pos = 0
        this.text = text
        this.current_char = text.charAt(0)
    }
    error() {
        throw new Error('charapter error!')
    }
    advince() {
        this.pos += 1
        if (this.pos > this.text.length - 1) {
            this.current_char = null
        } else {
            this.current_char = this.text.charAt(this.pos)
        }
    }
    integer() {
        let result = ""
        while (this.current_char !== null && this.isNumber(this.current_char)) {
            result += this.current_char
            this.advince()
        }
        return Number(result)
    }

    get_next_token() {
        while (this.current_char !== null) {
            if (this.isNumber(this.current_char)) {
                return new Token(INTEGER, this.integer())
            } else if (this.current_char === " ") {
                this.advince()
            } else if (this.current_char === '+') {
                this.advince()
                return new Token(PLUS, '+')
            } else if (this.current_char === '-') {
                this.advince()
                return new Token(MINUS, '-')
            } else if (this.current_char === '*') {
                this.advince()
                return new Token(MULTIPLY, '*')
            } else if (this.current_char === '/') {
                this.advince()
                return new Token(DIVIDE, '/')
            } else if (this.current_char === '(') {
                this.advince()
                return new Token(L_PAREN, '(')
            } else if (this.current_char === ')') {
                this.advince()
                return new Token(R_PAREN, ')')
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
        throw new Error('parser error!')
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
        if (token.type === INTEGER) {
            this.eat(INTEGER)
            return token.value
        } else {
            if (token.type === L_PAREN) {
                this.eat(L_PAREN)
                let result = this.expr()
                this.eat(R_PAREN)
                return result
            }
        }

    }
    term() {
        let result = this.factor()
        if (this.current_token.type === MULTIPLY) {
            this.eat(MULTIPLY)
            result = result * this.factor()
        } else if (this.current_token.type === DIVIDE) {
            this.eat(DIVIDE)
            result = result / this.factor()
        }
        return result
    }
    expr() {
        let result = this.term()
        if (this.current_token.type === PLUS) {
            this.eat(PLUS)
            result = result + this.term()
        } else if (this.current_token.type === MINUS) {
            this.eat(MINUS)
            result = result - this.term()
        }
        return result
    }
}

async function main() {
    while (true) {
        let text;
        try {
            let text = await readLine();
            let lexer = new Lexer(text);
            let parser = new Parser(lexer);

            let result = parser.expr();

            console.log(`${text} = ${result}`);
            // break
        } catch (e) {
            console.error(e);
            close();
            break;
        }
    }
}
module.exports = main;