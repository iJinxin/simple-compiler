const {
    PROGRAM,
    BEGIN,
    END,
    DOT,
    VAR,
    COLON,
    COMMA,
    INTEGER,
    REAL,
    INTEGER_CONST,
    REAL_CONST,
    INTEGER_DIV,
    FLOAT_DIV,
    EOF,
    PLUS,
    MINUS,
    MUL,
    DIV,
    L_PAREN,
    R_PAREN,
    ID,
    SEMI,
    ASSIGN
} = require('./var')

class Token {
    constructor(type, value) {
        this.type = type
        this.value = value
    }
}

const RESERVED_KEYWORDS = new Map([
    ['PROGRAM', new Token('PROGRAM', 'PROGRAM')],
    ['VAR', new Token('VAR', 'VAR')],
    ['DIV', new Token('INTEGER_DIV', 'DIV')],
    ['INTEGER', new Token('INTEGER', 'INTEGER')],
    ['REAL', new Token('REAL', 'REAL')],
    ['BEGIN', new Token('BEGIN', 'BEGIN')],
    ['END', new Token('END', 'END')]
])

class Lexer {
    constructor(text) {
        this.text = text
        this.pos = 0
        this.current_char = text.charAt(0)
    }
    error(char) {
        throw new Error('letex error: ' + char)
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
    // {} 注释快
    skip_comment() {
        while (this.current_char != '}') {
            this.advance()
        }
        this.advance()
    }
    // 处理整数和浮点数
    number() {
        let result = ''
        while (this.current_char != null && this.isNumber(this.current_char)) {
            result += this.current_char
            this.advance()
        }

        // 浮点数判断
        if (this.current_char == '.') {
            result += this.current_char
            this.advance()
            while (this.current_char != null && this.isNumber(this.current_char)) {
                result += this.current_char
                this.advance()
            }
            return new Token(REAL_CONST, parseFloat(result))
        } else {
            return new Token(INTEGER_CONST, parseInt(result))
        }
    }
    get_next_token() {
        while (this.current_char !== null) {
            if (this.current_char === ' ' || this.current_char === '\n') {
                this.advance()
            } else if (this.current_char === '{') {
                this.advance()
                this.skip_comment()
                // continue
            }  else if (this.isStr(this.current_char)) {
                return this._id()
            } else if (this.isNumber(this.current_char)) {
                return this.number()
            } else if (this.current_char === ':' && this.peek() === '=') {
                this.advance()
                this.advance()
                return new Token(ASSIGN, ':=')
            } else if (this.current_char === ',') {
                this.advance()
                return new Token(COMMA, ',')
            } else if (this.current_char === ':') {
                this.advance()
                return new Token(COLON, ':')
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
                return new Token(MUL, '*')
            } else if (this.current_char === '/') {
                this.advance()
                return new Token(FLOAT_DIV, '/')
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
                this.error(this.current_char)
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