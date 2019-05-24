// let start = new Date();
let hrstart = process.hrtime();
let simulateTime = 5;

setTimeout(function (argument) {
	// let end = new Date() - start;
	let hrend = process.hrtime(hrstart);

	console.log(`Execution Time (hr): %ds %dms`, hrend[0], hrend[1] / 1000000);

}, simulateTime);