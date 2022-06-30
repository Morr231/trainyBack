const array = [];

for (let j = 4; j < 9; j++) {
    const tempArr = fs.readFileSync(`texts/text3.txt`).toString().split("\n");
    tempArr.forEach((el) => {
        array.push(el);
    });
}

console.log(array.length);

for (i in array) {
    const text = new Text({ text: array[i] });
    text.save((err) => {});
}
