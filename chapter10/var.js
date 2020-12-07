const PROGRAM = 'PROGRAM'  // reserved keyword
const BEGIN = 'BEGIN'
const END = 'END'
const DOT = 'DOT' // 点

const VAR = 'VAR' // reserved keyword
const COLON = 'COLON' // : 冒号
const COMMA = 'COMMA' // , 逗号
const INTEGER = 'INTEGER' // integer type
const REAL = 'REAL' // pascal 浮点类型
const INTEGER_CONST = 'INTEGER_CONST' // 整数，for example, 3 or 5
const REAL_CONST = 'REAL_CONST' // 浮点数 or example, 3.14 and so on
const INTEGER_DIV = 'INTEGER_DIV' // 整数相除
const FLOAT_DIV = 'INTEGER_DIV' // 浮点数相除

const EOF = 'EOF' // 输入结束
const PLUS = 'PLUS' // 加
const MINUS = 'MINUS' // 减
const MUL = 'MUL' // 乘
const DIV = 'DIV' // 除
const L_PAREN = 'L_PAREN' // 左括号
const R_PAREN = 'R_PAREN' // 右括号
const ID = 'ID'
const SEMI = 'SEMI'  // ;
const ASSIGN = 'ASSIGN' // 赋值语句 :=

module.exports = {
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
}