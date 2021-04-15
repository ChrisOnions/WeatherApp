var cityInputBox = document.getElementById("citySearchInputBox")
var searchButton = document.getElementById("citySearchButton")
var forecastWrapper = document.getElementById("fiveDayForecastwrapper")
var forecastBoxs = document.getElementsByClassName("dayDisplayBox")
var latitude ;
var longitude ;
var DataWeather ;
var apiKey = "2396a268680cfdce876c4c2db720ae62";
var unit = "metric";




var requestURL = "https://api.openweathermap.org/data/2.5/onecall";
requestURL += "?lat=" + latitude; 
requestURL += "&lon=" + longitude;
requestURL += "&appid=" + apiKey;
requestURL += "&units=" + unit;

// Fetch seven day forecast Data using lon & lat  
function callWeatherApi(){
  fetch(requestURL)
    .then(function(response) { 
        if (!response.ok) {
            throw Error(response.message);
        }
        return response.json()
    })
    .then(function(data) {
        console.log(data)
        DataWeather = data;
        var dailyArray = data.daily;
        var thirdDay = dailyArray[2];
        var thirdDayTemp = thirdDay.temp;
        var thirdDayMax = thirdDayTemp.max;
        console.log("Third Day Max", thirdDayMax)
        DisplayElements(data)
        populateFiveDayforecast(data)
    })
    .catch((error) =>{
      console.log("Error", error)
    });
}


function DisplayElements (weatherData){
  var cityTimeVar = document.getElementById("cityDisplayDateAndTime")
  var temp = document.getElementById("temperature")
  var humidity = document.getElementById("humidity")
  var wind = document.getElementById("wind")
  var uv = document.getElementById("uvIndex")
  var convertedTime = DataWeather.daily[0].dt
  
  convertedTime =  timeConverter(convertedTime);
  
  //Set new inner html with new variables
    cityTimeVar.innerHTML = DataWeather.timezone +" - " + convertedTime 
    temp.innerHTML = "Temperature: " + weatherData.daily[0].temp["day"] + "°C"
    humidity.innerHTML = "Humidity: " + weatherData.daily[0].humidity + "%"
    wind.innerHTML = "Wind: " + weatherData.daily[0].wind_speed + "m/s"
    uv.innerHTML = "UV Index : " +weatherData.daily[0].uvi

}
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year  ;
  return time;
};

function populateFiveDayforecast(weatherData){
    for (i = 0; i <= 4 ; i++) {
      
      var dailyVariablesObj = {
        date: timeConverter(DataWeather.daily[i].dt),
        icon: DataWeather.daily[i].weather[0].icon,
        temp: DataWeather.daily[i].temp.day,
        humidity: DataWeather.daily[i].humidity
      }
      var iconUrl = "http://openweathermap.org/img/w/" + dailyVariablesObj.icon +".png"
      console.log(i)
      console.log("this is the object" + dailyVariablesObj.date)
      console.log("this is the icon"+ dailyVariablesObj.icon)

      var forecastDaily = document.createElement("div")
      forecastDaily.setAttribute("class","daysDisplayBox")
      forecastWrapper.append(forecastDaily)
      
      var displayBoxes = document.getElementsByClassName("daysDisplayBox")
      console.log(displayBoxes)

      let dailyDate = document.createElement("h2")
      displayBoxes[i].appendChild(dailyDate)
      dailyDate.innerHTML  = dailyVariablesObj.date

      let dailyicon = document.createElement("img")
      displayBoxes[i].appendChild(dailyicon)
      dailyicon.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyVariablesObj.icon + "@2x.png");

      let dailytemp = document.createElement("h4")
      displayBoxes[i].appendChild(dailytemp)
      dailytemp.innerHTML  = "Temp : " + dailyVariablesObj.temp +"°C"

      let dailyhumidity = document.createElement("h4")
      displayBoxes[i].appendChild(dailyhumidity)
      dailyhumidity.innerHTML  = "Humidity : " + dailyVariablesObj.humidity + "%"
  }
}

// changeP.setAttribute("style", "font-size: 25px; font-weight: bold; text-decoration:underline; ")

searchButton.addEventListener("click", function () {
  getcityLatLong();
  
  });


  // Get long and lat of the city searched 
  function getcityLatLong(){
    var cityName = document.getElementById("citySearchInputBox").value.trim();
    if (cityName == ""){
      alert("Enter city")
      
    }
    else{
      
      localStorage.setItem("PreviousSearches" , cityName )
    }

    let latlongcall ="https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey
    
    fetch(latlongcall)
      .then(function(response) { 
        if (!response.ok) {
            throw Error(response.message);
        }
        return response.json()
    })
    .then(function(data) {
      console.log(data)
      longitude = data.coord.lon
      latitude = data.coord.lat
      callWeatherApi();
    })
  }
