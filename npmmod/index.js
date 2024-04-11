import chalk from "chalk";
import validator from "validator";

console.log(chalk.green.inverse('Hello world!'));

const res = validator.isEmail("manraj.vdoit@gmail.com");
console.log(res);