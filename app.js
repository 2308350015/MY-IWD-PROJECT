const apiKey = '2e5da9ef7be353df437632c73e29b81d'; 
const searchButton = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const forecastSection = document.getElementById('forecast-section');
const errorMessage = document.getElementById('error-message');
const loadingMessage = document.getElementById('loading-message');
const geolocationButton = document.getElementById('geolocation-btn');

// Predefined list of colors for background change
const colors = [
    '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9',
    '#BBDEFB', '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9',
    '#DCEDC8', '#F0F4C3', '#FFECB3', '#FFE0B2', '#FFCCBC'
];

// Automatically detect the user's location on page load
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError);
    } else {
        showError('Geolocation is not supported by this browser.');
    }
});

// Success callback for geolocation
function onPositionSuccess(position) {
    const { latitude, longitude } = position.coords;
    getWeatherByCoordinates(latitude, longitude);
}

// Error callback for geolocation
function onPositionError(error) {
    showError('Error getting location: ' + error.message);
}

// Fetch weather data using coordinates
async function getWeatherByCoordinates(lat, lon) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    showLoading();
    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(apiURL),
            fetch(forecastURL)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (weatherResponse.ok && forecastResponse.ok) {
            displayWeatherData(weatherData);
            displayForecast(forecastData);
            hideError();
            changeBackgroundColor(); // Change background color after fetching weather data
        } else {
            showError(weatherData.message);
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

// Fetch weather data using city name (manual search)
async function getWeatherData(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    showLoading();
    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(apiURL),
            fetch(forecastURL)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (weatherResponse.ok && forecastResponse.ok) {
            displayWeatherData(weatherData);
            displayForecast(forecastData);
            hideError();
            changeBackgroundColor(); // Change background color after fetching weather data
        } else {
            showError(weatherData.message);
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

// Event listener for manual search
searchButton.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherData(cityName);
    } else {
        alert('Please enter a city name');
    }
});

// Function to display weather data
function displayWeatherData(data) {
    const { name, main, weather, wind, clouds, sys } = data;
    const temp = main.temp;
    const weatherCondition = weather[0].description;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const cloudiness = clouds.all;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();
    const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    document.getElementById('city-name').textContent = name;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString();
    document.getElementById('temperature').textContent = `${temp}°C`;
    document.getElementById('weather-condition').textContent = weatherCondition;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed} m/s`;
    document.getElementById('cloudiness').textContent = `${cloudiness}%`;
    document.getElementById('sunrise').textContent = sunrise;
    document.getElementById('sunset').textContent = sunset;
    document.getElementById('weather-icon').src = icon;

    weatherDisplay.classList.remove('hidden');
}

// Function to display forecast data
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    const filteredForecast = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    filteredForecast.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        const temp = item.main.temp;
        const weatherCondition = item.weather[0].description;
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `
            <p><strong>${date}</strong></p>
            <img src="${icon}" alt="${weatherCondition}" />
            <p>${temp}°C</p>
            <p>${weatherCondition}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });

    forecastSection.classList.remove('hidden');
}

// Function to show an error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
    forecastSection.classList.add('hidden');
}

// Function to hide the error message
function hideError() {
    errorMessage.classList.add('hidden');
}

// Function to show the loading message
function showLoading() {
    loadingMessage.classList.remove('hidden');
}

// Function to hide the loading message
function hideLoading() {
    loadingMessage.classList.add('hidden');
}

// Function to randomly change the background color
function changeBackgroundColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
}
