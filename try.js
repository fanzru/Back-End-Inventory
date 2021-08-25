const d = new Date();
let year = d.getFullYear()
let month = d.getMonth()
let day = d.getDate()

let date = new Date().toISOString().split('T')[0];
console.log(date)

