const fs = require('fs');
const historyLogDir = `../logs`;

let logMainDir = fs.existsSync(historyLogDir) ? true : false;

if (logMainDir) {
	console.info(`Not Bad`);
}