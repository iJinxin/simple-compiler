const chapter3_main = require('./chapter3/index')
const chapter4_main = require('./chapter4/index')
const chapter5_main = require('./chapter5/index')
const chapter5_ex = require('./chapter5/exercise')
const chapter6_main = require('./chapter6/index')
const chapter7_main = require('./chapter7_AST/index')
const chapter8_main = require('./chapter8/index')

chapter8_main()

function test() {
    let a = 2
    let b = -(1)
    return a+b
}
// console.log(test())