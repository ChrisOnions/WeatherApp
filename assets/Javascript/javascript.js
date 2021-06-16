let cityInputBox = document.getElementById("citySearchInputBox")
let searchButton = document.getElementById("citySearchButton")
let forecastWrapper = document.getElementById("fiveDayForecastwrapper")
let forecastBoxs = document.getElementsByClassName("dayDisplayBox")
let searchwrapperArea = document.getElementById("searchWrapper")

const apiKey = "2396a268680cfdce876c4c2db720ae62";
const unit = "metric";
let cityName = ""

let searchHistory = JSON.parse(localStorage.getItem("PreviousSearches")) || []

// Fetch seven day forecast Data using lon & lat  
function callWeatherApi(lat, lon) {
  let requestURL = "https://api.openweathermap.org/data/2.5/onecall";
  requestURL += "?lat=" + lat;
  requestURL += "&lon=" + lon;
  requestURL += "&appid=" + apiKey;
  requestURL += "&units=" + unit;

  fetch(requestURL)

    .then(response => {
      if (!response.ok) {
        console.log("Response not ok");
      }
      else {
        return response.json()
      }
    })
    .then(data => {
      DisplayElements(data)
      populateFiveDayforecast(data)
    })
}


function DisplayElements(data) {
  let cityTimeVar = document.getElementById("cityDisplayDateAndTime")
  let temp = document.getElementById("temperature")
  let humidity = document.getElementById("humidity")
  let wind = document.getElementById("wind")
  let uv = document.getElementById("uvIndex")
  let convertedTime = data.daily[0].dt

  convertedTime = timeConverter(convertedTime);

  //Set new inner html with new variables
  cityTimeVar.innerHTML = convertedTime
  temp.innerHTML = "Temperature: " + data.daily[0].temp["day"] + "°C"
  humidity.innerHTML = "Humidity: " + data.daily[0].humidity + "%"
  wind.innerHTML = "Wind: " + data.daily[0].wind_speed + "m/s"
  uv.innerHTML = "UV Index : " + data.daily[0].uvi
}

function timeConverter(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let time = date + ' ' + month + ' ' + year;
  return time;
};

function populateFiveDayforecast(data) {
  forecastWrapper.innerHTML = "";
  for (i = 0; i <= 4; i++) {

    let dailyVariablesObj = {
      date: timeConverter(data.daily[i].dt),
      icon: data.daily[i].weather[0].icon,
      temp: data.daily[i].temp.day,
      humidity: data.daily[i].humidity
    }
    // let iconUrl = "http://openweathermap.org/img/w/" + dailyVariablesObj.icon + ".png"

    let forecastDaily = document.createElement("div")
    forecastDaily.setAttribute("class", "daysDisplayBox")
    forecastWrapper.append(forecastDaily)

    let displayBoxes = document.getElementsByClassName("daysDisplayBox")

    let dailyDate = document.createElement("h2")
    displayBoxes[i].appendChild(dailyDate)
    dailyDate.innerHTML = dailyVariablesObj.date

    let dailyicon = document.createElement("img")
    displayBoxes[i].appendChild(dailyicon)
    dailyicon.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyVariablesObj.icon + "@2x.png");

    let dailytemp = document.createElement("h4")
    displayBoxes[i].appendChild(dailytemp)
    dailytemp.innerHTML = "Temp : " + dailyVariablesObj.temp + "°C"

    let dailyhumidity = document.createElement("h4")
    displayBoxes[i].appendChild(dailyhumidity)
    dailyhumidity.innerHTML = "Humidity : " + dailyVariablesObj.humidity + "%"
  }
}

// changeP.setAttribute("style", "font-size: 25px; font-weight: bold; text-decoration:underline; ")

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  cityName = document.getElementById("citySearchInputBox").value.trim();
  getcityLatLong(cityName);
});

function searchHistoryEventHandler() {
  searchHistory.forEach(element => {
    let searchButtonEl = document.createElement("button")
    searchButtonEl.innerHTML = element
    searchButtonEl.className = "previouslySearchedCitys"
    searchwrapperArea.appendChild(searchButtonEl)
    searchButtonEl.addEventListener("click", function () {
      cityInputBox.textContent = this.textContent
      getcityLatLong(cityInputBox.textContent)
    })
  })
}

searchHistoryEventHandler();
// Get long and lat of the city searched 

function getcityLatLong(cityName) {
  if (cityName == "") {
    cityName = document.getElementById("citySearchInputBox").value.trim();
  }
  let cityNameDisplayEl = document.getElementById("cityname")
  //change to add item to local city

  let latlongcall = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey

  fetch(latlongcall)

    .then(response => response.json())

    .then(data => {
      cityNameDisplayEl.textContent = data.name
      searchHistory.push(data.name)
      localStorage.setItem("PreviousSearches", JSON.stringify(searchHistory))
      callWeatherApi(data.coord.lat, data.coord.lon)
    })
    .catch((error) => {
      console.log("error = ", error)
    })
}
}
