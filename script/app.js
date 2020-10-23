// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

//main function
let showResult = function(json) {
	// Sunrise/sunsetdates
	let sunriseDate = new Date(json.city.sunrise * 1000);
	let sunsetDate = new Date(json.city.sunset * 1000);
	let currentTime = new Date(new Date().getTime());
	
	// Calculating minutes
	let sunsetMinutes = toMinutes(sunsetDate) + json.city.timezone;
	let sunriseMinutes = toMinutes(sunriseDate)+ json.city.timezone;
	let currentMinutes = toMinutes(currentTime)+ json.city.timezone;

	// Calculating percentage
	let percentage = Math.round(((currentMinutes - sunriseMinutes)/(sunsetMinutes - sunriseMinutes))*100);
	let timeOfDayLeft = sunsetMinutes - currentMinutes;
	let sunriseString = `${sunriseDate.getHours()}:${sunlightLeft(sunriseDate.getMinutes())}`;
	let sunsetString = `${sunsetDate.getHours()}:${sunlightLeft(sunsetDate.getMinutes())}`;
	let currentString = `${currentTime.getHours()}:${sunlightLeft(currentTime.getMinutes())}`;

	// Showing time
	document.querySelector(`.js-sunrise`).innerHTML = sunriseString;
	document.querySelector(`.js-sunset`).innerHTML = sunsetString;
	document.querySelector(`.js-sun`).setAttribute(`data-time`, currentString);
	document.querySelector(`.js-time-left`).innerHTML = timeOfDayLeft + " ";
	document.querySelector(`.js-sun`).style.bottom = `${percentage}%`;
	document.querySelector(`.js-sun`).style.left = `${percentage}%`;
	document.querySelector(`.js-location`).innerHTML = `${json.city.name}, ${json.city.country}`

};

// Function for minutes
let toMinutes = function(date) {
	let mins = 0
	for ( let i = 0; i < date.getHours(); i++){
		mins += 60;
	}
	mins += date.getMinutes();
	return mins;
};

// Function to calculate how many minutes sunlight is left
let sunlightLeft = function(n) {
    return n < 10 ? '0' + n : n;
}

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Build URL
	let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6b54d6e89b8c5e5d45599681d3bbe6cc&units=metric&lang=nl&cnt=1`;

	// Fetch for API and showResult function
	const endpoint = url;
    fetch(endpoint).then(function (response) {
        return response.json();
    }).then(function (json) {
        console.log(json);
        showResult(json);
    }).catch(function(error) {
        console.error('An error occured, we handled it.', error);
    });
};

document.addEventListener('DOMContentLoaded', function() {
	// We will query the API with longitude and latitude.
	getAPI(51.1471626, 4.2972797);
});
