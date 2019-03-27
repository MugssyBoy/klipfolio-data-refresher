const Nightmare = require('nightmare');
const vo = require('vo');

let links = [];

vo(run)(function(err, result) {
	if (err) throw err;
});

function* run() {
	let nightmare = Nightmare({ show: true, waitTimeout: 60000 });
	yield nightmare
		.viewport(1024, 700)
		.goto('https://app.klipfolio.com/datasources/index')
		.wait('#f-username')
		.type('#f-username', 'jomael@outdoorequipped.com')
		.type('#f-password', ')=L)n60v')
		.click('#login')
		.wait('#library-find')
		.type('#library-find', 'adidas')
		.wait('#datasources-list')

	links = yield nightmare.evaluate(function() {
		return Array.from(document.querySelectorAll('.strong')).map(a => a.href);
	});

	console.log(links);

	for (let i = 0; i < links.length; i++) {
		yield nightmare
			.goto(links[i].href)
			.wait(5000)
	}

	// yield nightmare.end()
}