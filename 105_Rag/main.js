import { PDFParse } from "pdf-parse";
import fs from "fs";

let dataBuffer = fs.readFileSync("./QT.pdf");

const parser = new PDFParse({
    data: dataBuffer,
});

const data = await parser.getText();

console.log(data);



