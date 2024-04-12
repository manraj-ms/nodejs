const data = {
    name: "manraj",
    age: 22
}
console.log(data.name);

//object to json
const jsonData = JSON.stringify(data);
console.log(jsonData);

//json to obj
const objData = JSON.parse(jsonData);
console.log(objData);