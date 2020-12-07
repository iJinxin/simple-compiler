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

// Program AST node represents a program and will be our root node
class Program{
    constructor(name, block) {
        this.name = name
        this.block = block
    }
}

//  Block AST node holds declarations and a compound statement
class Block {
    constructor (declarations, compound_statement) {
        this.declarations = declarations
        this.compound_statement = compound_statement
    }
}

// 变量类型
class Type {
    constructor(token, value) {
        this.token = token
        this.value = token.value
    }
}

// The VarDecl AST node represents a variable declaration. It holds a variable node and a type node
class VarDecl {
    constructor(var_node, type_node) {
        this.var_node = var_node
        this.type_node = type_node
    }
}

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
    constructor(op, expr) {
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

class Compound {
    constructor() {
        this.children = []
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
    error(type) {
        throw new Error("parser error:" + type)
    }
    eat(token_type) {
        if (this.current_token.type === token_type) {
            this.current_token = this.lexer.get_next_token()
        } else {
            this.error('eat')
        }
    }
    // 程序初始化
    // 以 PROGRAM VAR ; 三元素开头
    // block程序主体
    // 以DOT结尾
    program() {
        this.eat(PROGRAM)
        let var_node = this.variable()
        let prog_name = var_node.value
        this.eat(SEMI)

        let block_node = this.block()
        let program = new Program(prog_name, block_node)
        this.eat(DOT)

        return program
    }
    // 程序主体
    // 1.变量声明
    // 2.表达式
    block() {
        let declaration_nodes = this.declarations()
        let compound_statement_node = this.compound_statement()

        return new Block(declaration_nodes, compound_statement_node)
    }
    // 声明
    // 1.变量声明
    // 2.类型检查
    declarations() {
        let declarations = []
        if (this.current_token.type === VAR) {
            this.eat(VAR)
            while (this.current_token.type === ID) {
                let varDecl = this.variable_declaration()
                declarations = declarations.concat(varDecl)
                this.eat(SEMI)
            }
        }
        return declarations
    }
    // 变量声明-声明一行变量
    variable_declaration() {
        let var_nodes = [new Var(this.current_token)]
        this.eat(ID)

        // 判断是否多变量使用‘,’隔开
        while (this.current_token.type === COMMA) {
            this.eat(COMMA)
            var_nodes.push(new Var(this.current_token))
            this.eat(ID)
        }

        this.eat(COLON)

        // 判断本行变量类型
        let type_node = this.type_spec()

        let var_declarations = []

        for (let i=0;i<var_nodes.length;i++) {
            var_declarations.push(new VarDecl(var_nodes[i], type_node))
        }

        return var_declarations
    }
    // 类型检查 INTEGER or REAL
    type_spec() {
        let token = this.current_token
        if (token.type === INTEGER) {
            this.eat(INTEGER)
        } else {
            this.eat(REAL)
        }

        return new Type(token)
    }
    compound_statement() {
        this.eat(BEGIN)
        let nodes = this.statement_list()
        this.eat(END)

        let root = new Compound()
        for (let node of nodes) {
            root.children.push(node)
        }

        return root
    }
    statement_list() {
        let node = this.statement()
        let result = [node]
        while (this.current_token.type === SEMI) {
            this.eat(SEMI)
            result.push(this.statement())
        }

        if (this.current_token.type === ID) {
            this.error('statement_list')
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
        let token = this.current_token
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
        while ([MUL, INTEGER_DIV, FLOAT_DIV].includes(this.current_token.type)) {
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
        } else if (token.type === INTEGER_CONST) {
            this.eat(INTEGER_CONST)
            return new Num(token)
        } else if (token.type === REAL_CONST) {
            this.eat(REAL_CONST)
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
            this.error('init')
        }

        return node
    }
}

module.exports = Parser