//.json() is used to parse a network response's body (which is a stream) into JSON, returning a promise.
//JSON.parse() directly converts a JSON string into a JavaScript object, working synchronously on an existing string.

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loadingContainer");
const userInfoContainer = document.querySelector(".user-info-container");
const falseLocation = document.querySelector(".falseLocation");
console.log(userTab)
let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

getfromSessionStorage();
function switchTab(clickedTab) {
    if (currentTab != clickedTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            getfromSessionStorage(); // fetch the latitude and longitude already stored(if stored)
        }
    }
}
userTab.addEventListener('click', () => {
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // make grant access invisible
    grantAccessContainer.classList.remove("active");
    // make loades visible
    loadingScreen.classList.add("active");

    try {
        const res = await
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (e) {
        loadingScreen.classList.remove("active");
        alert("Not working at the moment, sorry for the inconvience");
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed= document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    
    //fetch values from weatherinfo and putting in UI
    // we got one sample data from that api-> converted it to json(google ofcourse)-> then from there writing all this code
    
    cityName.innerText = weatherInfo?.name; //OPTIONAL CHAINING:DO NOT THROWS ERROR IF NOT FOUND, GIVE UNDEFINED
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;//? means if weatherInfo exist then it moves forward
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;


}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else {
        alert("Bro u do not have geolocation in your system.")
    }
}


const grantAccessButton = document.querySelector("[data-grant-access]");
grantAccessButton.addEventListener('click', getLocation());
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const serachInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = serachInput.value;
    if (cityName == "") {
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");
     falseLocation.classList.remove('active');
    
    try {
        const res = await
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
         if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        falseLocation.classList.remove('active');
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
         
        renderWeatherInfo(data);
    }
    catch (error) {
         falseLocation.classList.add('active');
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
       
       

    }
}