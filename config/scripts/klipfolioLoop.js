let Nightmare = require('nightmare');
let vo = require('vo');

const nightmare = Nightmare({
	show: true
});

let arrDetails = ["Glass", "Mouse", "Phone", "Tissue", "Grips"];

nightmare
	.goto('https://www.google.com/')
	.then(function() {
		console.log("Main");
		return myLooper(nightmare, arrDetails);
	})
	.catch((err) => {
		console.log(err);
	})

function myLooper(nightmare, arrDetails) {
	return nightmare
		.wait(3000)
		.then(function() {
			for (var i = 0; i < 5; i++) {
				// console.log(arrDetails[i]);
				if (arrDetails[i] != null) {
					console.log(arrDetails[i]);
					nightmare
						.goto("https://github.com/segmentio/nightmare/issues/708")
						.wait(1000)
						.then()
				} else {
					console.log("*** End Game ***");
				}
			}
			// console.log(arrDetails);
			// return myLooper(nightmare, arrDetails);
		})
		.catch((err) => {
			console.log(err);
		})
}

// myLooper(nightmare, arrDetails);