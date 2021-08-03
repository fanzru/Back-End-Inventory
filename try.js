const { FLOAT } = require("sequelize/types");

let  a = FLOAT(Number(20));
let  b = FLOAT(Number(20));

let c = a + b;
console.log(c);