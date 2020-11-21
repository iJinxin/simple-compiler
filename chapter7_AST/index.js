/**
 * 
 */
class Token{
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

class AST {

}

class BinOp {
    constructor(AST) {

    }
}

class Parser {

}

class NodeVisitor{
    
}

class Interpreter {

}