const fs = require('fs');
const moment = require('../node_modules/moment');

let todayDate = moment().format('MMDDYY');
let historyLogPath = `../logs/kliplog-${todayDate}.txt`;

function historyLogChecker (callback) {
	let logCheckingResult = fs.existsSync(historyLogPath) ? true : false;
	callback(logCheckingResult);
}

historyLogChecker(historyLogCreator);

function historyLogCreator (logCheckingResult) {
	if (logCheckingResult) {
		fs.appendFile(historyLogPath, 'Found Text\n', err => {
			if (err) throw err;
			console.log(`Found: Done Appending!`);
		});
	} else {
		fs.writeFile(historyLogPath, 'Not Found Text\n', err => {
			if (err) throw err;
			console.log(`Not Found: Done Writing!`);
		});
	}
}
