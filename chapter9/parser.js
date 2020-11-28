import Lexer from './lexer'
const [INTEGER, EOF, PLUS, MINUS, MULTIPLY, DIVIDE, L_PAREN, R_PAREN, ASSIGN, DOT, BEGIN, END, SEMI, ID] = [
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
    "BEGIN",
    "END",
    "SEMI",
    "ID"
];

// 二元运算符
class BinOp {
    constructor(left, op, right) {
        this.left = left
        this.token = this.op = op
        this.right = right
    }
}
// 一元运算符
class UnaryOp {
    constructor (op, expr) {
        this.token = this.op = op
        this.expr = expr
    }
}

class Num {
    // 叶子结点 INTEGER
    constructor(token) {
        this.token = token
        this.value = token.value
    }
}

class Assign {
    constructor(left, op, right) {
        this.left = left
        this.token = this.op = op
        this.right = right
    }
}
class Var {
    constructor(token) {
        this.token = token
        this.value = token.value
    }
}
class NoOp {
    constructor() {

    }
}
class Parser {
    constructor(lexer) {
        this.lexer = lexer
        this.current_token = lexer.get_next_token()
    }
    error() {
        throw new Error("parser error")
    }
    eat(token_type) {
        if (this.current_token.type === token_type) {
            this.current_token = this.lexer.get_next_token()
        } else {
            this.error()
        }
    }
    program() {
        let node = this.compound_statement()
        this.eat(DOT)
        return node
    }
    compound_statement() {
        this.eat(BEGIN)
        let nodes = this.statement_list()
        this.eat(END)


    }
    statement_list() {
        let node = this.statement()
        let result = [node]
        while (this.current_token.type === SEMI) {
            this.eat(SEMI)
            result.push(this.statement())
        }

        if (this.current_token.type === ID) {
            this.error()
        }

        return result
    }
    statement() {
        if (this.current_token.type === BEGIN) {
            return this.compound_statement()
        } else if (this.current_token.type === ID) {
            return this.assignment_statement()
        } else {
            return this.empty()
        }
    }
    assignment_statement() {
        let left = this.variable()
        let op = token = this.current_token
        this.eat(ASSIGN)
        let right = this.expr()

        return new Assign(left, token, right)
    }
    variable() {
        let node = new Var(this.current_token)
        this.eat(ID)
        return node
    }
    empty() {
        return new NoOp()
    }
    expr() {
        let node = this.term()
        while ([PLUS, MINUS].includes(this.current_token.type)) {
            this.eat(this.current_token.type)
            node = new BinOp(node, this.current_token, this.term())
        }
        return node
    }
    term() {
        let node = this.factor()
        while ([MULTIPLY, DIVIDE].includes(this.current_token.type)) {
            this.eat(this.current_token.type)
            node = new BinOp(node, this.current_token, this.factor())
        }
        return node
    }
    factor() {
        // factor : PLUS factor
        //       | MINUS factor
        //       | INTEGER
        //       | LPAREN expr RPAREN
        //       | variable
        let token = this.current_token
        if (token.type === PLUS) {
            this.eat(PLUS)
            return new UnaryOp(token, this.factor())
        } else if (token.type === MINUS) {
            this.eat(MINUS)
            return new UnaryOp(token, this.factor())
        } else if (token.type === INTEGER) {
            this.eat(INTEGER)
            return new Num(token)
        } else if (token.type === L_PAREN) {
            this.eat(L_PAREN)
            let node = this.expr()
            this.eat(R_PAREN)

            return node
        } else {
            return this.variable()
        }
    }
    init() {
        let node = this.program()
        if (this.current_token.type !== EOF) {
            this.error()
        }

        return node
    }
}