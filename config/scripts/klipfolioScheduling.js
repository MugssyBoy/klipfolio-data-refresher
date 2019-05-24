const moment = require('moment');

setInterval(function() {
	let currentHourMin = moment().format('hh:mm A');

	if (currentHourMin === "03:56 AM") {
		console.log(`running: ${currentHourMin}`);
	} else {
		console.log(`awaiting: 35 seconds...`);
	};

}, 35000)