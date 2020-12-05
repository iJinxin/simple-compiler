const [INTEGER, EOF, PLUS, MINUS, MULTIPLY, DIVIDE, L_PAREN, R_PAREN, ASSIGN, DOT, ID, SEMI] = [
    "INTEGER",
    "EOF",
    "PLUS",
    "MINUS",
    "MULTIPLY",
    "DIVIDE",
    "L_PAREN",
    "R_PAREN",
    "ASSIGN",
    "DOT",
    "ID",
    "SEMI"
];

class Token {
    constructor (type, value) {
        this.type = type
        this.value = value
    }
}

const RESERVED_KEYWORDS = new Map([
    ['BEGIN', new Token('BEGIN', 'BEGIN')],
    ['END', new Token('END', 'END')]
])

class Lexer {
    constructor(text) {
        this.text = text
        this.pos = 0
        this.current_char = text.charAt(0)
    }
    error() {
        throw new Error('letex error')
    }
    advance() {
        this.pos = this.pos + 1
        if (this.pos > this.text.length - 1) {
            this.current_char = null
        } else {
            this.current_char = this.text[this.pos]
        }
    }
    peek() {
        let peek_pos = this.pos + 1
        if (peek_pos > this.text.length - 1) {
            return null
        } else {
            return this.text[peek_pos]
        }
    }
    integer() {
        let result = ''
        while (this.current_char !== null && this.isNumber(this.current_char)) {
            result += this.current_char
            this.advance()
        }
        return result
    }
    // 识别变量和标识符
    // 字母或下划线开头，数字字母下划线组成
    _id() {
        let result = ''
        while (this.current_char !== null && this.isVar(this.current_char)) {
            result += this.current_char
            this.advance()
        }
        if (RESERVED_KEYWORDS.has(result)) {
            return RESERVED_KEYWORDS.get(result)
        } else {
            return new Token(ID, result)
        }
    }
    get_next_token() {
        while (this.current_char !== null) {
            if (this.current_char === ' ' || this.current_char === '\n') {
                this.advance()
            } else if (this.isStr(this.current_char)) {
                return this._id()
            } else if (this.isNumber(this.current_char)) {
                return new Token(INTEGER, this.integer())
            } else if (this.current_char === ':' && this.peek() === '=') {
                this.advance()
                this.advance()
                return new Token(ASSIGN, ':=')
            } else if (this.current_char === ';') {
                this.advance()
                return new Token(SEMI, ';')
            } else if (this.current_char === '+') {
                this.advance()
                return new Token(PLUS, '+')
            } else if (this.current_char === '-') {
                this.advance()
                return new Token(MINUS, '-')
            } else if (this.current_char === '*') {
                this.advance()
                return new Token(MULTIPLY, '*')
            } else if (this.current_char === '/') {
                this.advance()
                return new Token(DIVIDE, '/')
            } else if (this.current_char === '(') {
                this.advance()
                return new Token(L_PAREN, '(')
            } else if (this.current_char === ')') {
                this.advance()
                return new Token(R_PAREN, ')')
            } else if (this.current_char === '.') {
                this.advance()
                return new Token(DOT, '.')
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
    isVar(char) {
        let reg = /[_0-9a-zA-Z]/g
        return reg.test(char)
    }
    isStr(char) {
        let reg = /[_a-zA-Z]/g
        return reg.test(char)
    }
}

// export default Lexer
module.exports = Lexer