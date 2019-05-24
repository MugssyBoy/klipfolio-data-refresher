// Format: Apr 3, 2019 8:15 PM
const moment = require('../node_modules/moment');
const momentRange = require('../node_modules/moment-range');
momentRange.extendMoment(moment);
const dateTime = require('datetime-converter-nodejs');

// const date = new Date();
// const fullDateTime = `${date.getMonth()} ${date.getDay()}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`; 
// const month = fullDateTime.toLocaleString('en-us', { month: 'long' })

let range = moment.range(dateTime.isoString('Apr 3, 2019 11:04 PM'), dateTime.isoString('Apr 3, 2019 11:05 PM'), null, []);

// console.log(moment(dateTime.isoString('Apr 4, 2019 11:04 PM')).within(range));
// console.log(moment(dateTime.isoString('Apr 4, 2019 11:04 PM')).add(2, 'minutes'));
// console.log(moment(dateTime.isoString('Apr 3, 2019 11:04 PM')).isBetween(range));

// console.log(moment().add(1, 'minutes'));

let currentDateTime = dateTime.isoString(moment().seconds(0).milliseconds(0).format());
let currentDateTimeRange = moment.range(moment(currentDateTime).add(-2, 'minutes'), currentDateTime, null, []);
let formattedCurrDateTime = moment(currentDateTime).format('MMM D, YYYY h:mm A');

if (moment(dateTime.isoString('Apr 4, 2019 3:41 AM')).within(currentDateTimeRange)) {
	console.log('In Range');
	console.log(currentDateTimeRange);
} else {
	console.log('Out Range');
	console.log(currentDateTimeRange);
}

console.log(currentDateTimeRange);

// console.log(moment().format('MMM D, YYYY h:mm A'));

// const start = new Date(2012, 0, 15);
// const end   = new Date(2012, 4, 23);
// const range = moment.range(start, end);

// console.log(Date('Apr 3, 2019 11:03 PM'));

// console.log(range);