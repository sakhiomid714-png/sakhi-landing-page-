"use strict";

console.log("=================================");
console.log("WeatherNow JavaScript loaded");
console.log("=================================");


// ======================================================
// WAIT UNTIL HTML IS READY
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM is ready. Starting WeatherNow...");


    // ==================================================
    // ELEMENTS
    // ==================================================

    const searchForm =
        document.getElementById("searchForm");

    const cityInput =
        document.getElementById("cityInput");

    const suggestions =
        document.getElementById("suggestions");

    const status =
        document.getElementById("status");

    const resultCard =
        document.getElementById("resultCard");

    const emptyState =
        document.getElementById("emptyState");

    const cityName =
        document.getElementById("cityName");

    const localTime =
        document.getElementById("localTime");

    const weatherIcon =
        document.getElementById("weatherIcon");

    const temperature =
        document.getElementById("temperature");

    const weatherDescription =
        document.getElementById("weatherDescription");

    const feelsLike =
        document.getElementById("feelsLike");

    const humidity =
        document.getElementById("humidity");

    const wind =
        document.getElementById("wind");

    const pressure =
        document.getElementById("pressure");

    const visibility =
        document.getElementById("visibility");

    const forecastGrid =
        document.getElementById("forecastGrid");

    const unitToggle =
        document.getElementById("unitToggle");

    const locateBtn =
        document.getElementById("locateBtn");

    const loadingOverlay =
        document.getElementById("loadingOverlay");

    const year =
        document.getElementById("year");


    // ==================================================
    // CHECK REQUIRED ELEMENTS
    // ==================================================

    const requiredElements = {
        searchForm,
        cityInput,
        suggestions,
        status,
        resultCard,
        emptyState,
        cityName,
        localTime,
        weatherIcon,
        temperature,
        weatherDescription,
        feelsLike,
        humidity,
        wind,
        pressure,
        visibility,
        forecastGrid,
        unitToggle,
        locateBtn,
        loadingOverlay,
        year
    };


    for (const [name, element] of Object.entries(requiredElements)) {

        if (!element) {

            console.error(
                `WeatherNow error: #${name} was not found in HTML.`
            );

            return;
        }
    }


    console.log("All HTML elements found successfully.");


    // ==================================================
    // VARIABLES
    // ==================================================

    let currentUnit = "celsius";

    let lastLocation = null;

    const climateCache = new Map();

    let suggestionTimer = null;

    let suggestionRequest = 0;

    let suggestionResults = [];

    let activeSuggestion = -1;


    // ==================================================
    // YEAR
    // ==================================================

    year.textContent =
        new Date().getFullYear();


    // ==================================================
    // WEATHER CODES
    // ==================================================

    function getWeatherInfo(code) {

        const weatherCodes = {

            0: {
                description: "Clear sky",
                icon: "☀️"
            },

            1: {
                description: "Mainly clear",
                icon: "🌤️"
            },

            2: {
                description: "Partly cloudy",
                icon: "⛅"
            },

            3: {
                description: "Overcast",
                icon: "☁️"
            },

            45: {
                description: "Fog",
                icon: "🌫️"
            },

            48: {
                description: "Depositing rime fog",
                icon: "🌫️"
            },

            51: {
                description: "Light drizzle",
                icon: "🌦️"
            },

            53: {
                description: "Moderate drizzle",
                icon: "🌦️"
            },

            55: {
                description: "Dense drizzle",
                icon: "🌧️"
            },

            61: {
                description: "Slight rain",
                icon: "🌦️"
            },

            63: {
                description: "Moderate rain",
                icon: "🌧️"
            },

            65: {
                description: "Heavy rain",
                icon: "🌧️"
            },

            71: {
                description: "Slight snow",
                icon: "🌨️"
            },

            73: {
                description: "Moderate snow",
                icon: "❄️"
            },

            75: {
                description: "Heavy snow",
                icon: "❄️"
            },

            77: {
                description: "Snow grains",
                icon: "❄️"
            },

            80: {
                description: "Slight rain showers",
                icon: "🌦️"
            },

            81: {
                description: "Moderate rain showers",
                icon: "🌧️"
            },

            82: {
                description: "Violent rain showers",
                icon: "⛈️"
            },

            85: {
                description: "Slight snow showers",
                icon: "🌨️"
            },

            86: {
                description: "Heavy snow showers",
                icon: "❄️"
            },

            95: {
                description: "Thunderstorm",
                icon: "⛈️"
            },

            96: {
                description: "Thunderstorm with hail",
                icon: "⛈️"
            },

            99: {
                description: "Thunderstorm with heavy hail",
                icon: "⛈️"
            }
        };


        return weatherCodes[code] || {

            description: "Unknown weather",

            icon: "🌤️"
        };
    }


    // ==================================================
    // STATUS
    // ==================================================

    function setStatus(message, type = "") {

        status.textContent = message;

        status.className = "status";

        if (type) {
            status.classList.add(type);
        }

        console.log(
            `STATUS [${type || "normal"}]:`,
            message
        );
    }


    // ==================================================
    // LOADING
    // ==================================================

    function showLoading() {

        loadingOverlay.classList.remove("hidden");

        loadingOverlay.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    function hideLoading() {

        loadingOverlay.classList.add("hidden");

        loadingOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    // ==================================================
    // FETCH JSON HELPER
    // ==================================================

    async function fetchJSON(url) {

        console.log("FETCHING:");
        console.log(url);


        let response;


        try {

            response =
                await fetch(url);

        } catch (error) {

            console.error(
                "Network error:",
                error
            );

            throw new Error(
                "Network error. Check your internet connection."
            );
        }


        console.log(
            "HTTP status:",
            response.status
        );


        if (!response.ok) {

            let errorMessage =
                `Request failed with HTTP ${response.status}.`;


            try {

                const errorData =
                    await response.json();


                if (errorData.reason) {

                    errorMessage +=
                        ` ${errorData.reason}`;
                }

            } catch {

                // Ignore JSON parsing error.
            }


            throw new Error(
                errorMessage
            );
        }


        try {

            return await response.json();

        } catch (error) {

            console.error(
                "JSON parsing error:",
                error
            );

            throw new Error(
                "The weather service returned invalid data."
            );
        }
    }


    // ==================================================
    // CITY SUGGESTIONS
    // ==================================================

    function closeSuggestions() {

        suggestionRequest += 1;

        suggestions.innerHTML = "";

        suggestions.classList.remove("show");

        cityInput.removeAttribute("aria-activedescendant");

        suggestionResults = [];

        activeSuggestion = -1;
    }


    function selectSuggestion(index) {

        const result = suggestionResults[index];

        if (!result) {
            return;
        }

        cityInput.value = result.name;

        closeSuggestions();

        searchForm.requestSubmit();
    }


    function updateActiveSuggestion(index) {

        activeSuggestion = index;

        const options = suggestions.querySelectorAll('[role="option"]');

        options.forEach((option, optionIndex) => {
            const selected = optionIndex === activeSuggestion;

            option.setAttribute("aria-selected", String(selected));

            if (selected) {
                cityInput.setAttribute("aria-activedescendant", option.id);
                option.scrollIntoView({ block: "nearest" });
            }
        });
    }


    function renderSuggestions(results) {

        closeSuggestions();

        suggestionResults = results;

        results.forEach((result, index) => {
            const option = document.createElement("li");
            const locationParts = [result.name, result.admin1, result.country]
                .filter((part, partIndex, parts) => part && parts.indexOf(part) === partIndex);

            option.id = `weather-suggestion-${index}`;
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", "false");
            option.dataset.index = String(index);
            option.textContent = locationParts.join(", ");
            suggestions.appendChild(option);
        });

        if (results.length) {
            suggestions.classList.add("show");
        }
    }


    cityInput.addEventListener("input", () => {

        window.clearTimeout(suggestionTimer);

        const query = cityInput.value.trim();
        const requestId = ++suggestionRequest;

        if (query.length < 2) {
            closeSuggestions();
            return;
        }

        suggestionTimer = window.setTimeout(async () => {
            const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
            url.searchParams.set("name", query);
            url.searchParams.set("count", "5");
            url.searchParams.set("language", "en");
            url.searchParams.set("format", "json");

            try {
                const data = await fetchJSON(url.toString());

                if (requestId !== suggestionRequest || cityInput.value.trim() !== query) {
                    return;
                }

                renderSuggestions(data.results || []);
            } catch (error) {
                if (requestId === suggestionRequest) {
                    closeSuggestions();
                }
            }
        }, 250);
    });


    cityInput.addEventListener("keydown", (event) => {

        if (!suggestionResults.length) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            updateActiveSuggestion(Math.min(activeSuggestion + 1, suggestionResults.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            updateActiveSuggestion(Math.max(activeSuggestion - 1, 0));
        } else if (event.key === "Escape") {
            closeSuggestions();
        } else if (event.key === "Enter" && activeSuggestion >= 0) {
            event.preventDefault();
            selectSuggestion(activeSuggestion);
        }
    });


    suggestions.addEventListener("pointerdown", (event) => {

        const option = event.target.closest('[role="option"]');

        if (option) {
            event.preventDefault();
            selectSuggestion(Number(option.dataset.index));
        }
    });


    document.addEventListener("pointerdown", (event) => {
        if (!event.target.closest(".search-form")) {
            closeSuggestions();
        }
    });


    // ==================================================
    // SEARCH CITY
    // ==================================================

    searchForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const city =
                cityInput.value.trim();

            closeSuggestions();


            console.log(
                "SEARCH SUBMITTED:",
                city
            );


            if (!city) {

                setStatus(
                    "Please enter a city name.",
                    "error"
                );

                return;
            }


            showLoading();


            setStatus(
                `Searching for ${city}...`
            );


            try {

                // ======================================
                // GEOCODING
                // ======================================

                const geoURL =
                    new URL(
                        "https://geocoding-api.open-meteo.com/v1/search"
                    );


                geoURL.searchParams.set(
                    "name",
                    city
                );

                geoURL.searchParams.set(
                    "count",
                    "1"
                );

                geoURL.searchParams.set(
                    "language",
                    "en"
                );

                geoURL.searchParams.set(
                    "format",
                    "json"
                );


                const geoData =
                    await fetchJSON(
                        geoURL.toString()
                    );


                console.log(
                    "GEOCODING DATA:",
                    geoData
                );


                if (
                    !geoData.results ||
                    geoData.results.length === 0
                ) {

                    throw new Error(
                        `City "${city}" was not found.`
                    );
                }


                const location =
                    geoData.results[0];


                console.log(
                    "LOCATION FOUND:",
                    location
                );


                // ======================================
                // WEATHER
                // ======================================

                const weatherData =
                    await getWeather(
                        location.latitude,
                        location.longitude
                    );


                console.log(
                    "WEATHER DATA:",
                    weatherData
                );


                // ======================================
                // SAVE LOCATION
                // ======================================

                lastLocation = {

                    latitude:
                        location.latitude,

                    longitude:
                        location.longitude,

                    name:
                        location.name,

                    country:
                        location.country || ""
                };


                // ======================================
                // DISPLAY
                // ======================================

                displayWeather(
                    lastLocation,
                    weatherData
                );


                setStatus(
                    weatherData.climateNormals
                        ? `Weather for ${location.name}, ${location.country}`
                        : `16-day forecast loaded for ${location.name}; historical averages are unavailable.`,
                    weatherData.climateNormals ? "success" : ""
                );


            } catch (error) {

                console.error(
                    "SEARCH ERROR:",
                    error
                );


                resultCard.classList.add(
                    "hidden"
                );


                emptyState.classList.remove(
                    "hidden"
                );


                setStatus(
                    error.message,
                    "error"
                );


            } finally {

                hideLoading();
            }
        }
    );


    // ==================================================
    // GET WEATHER
    // ==================================================

    async function getWeather(
        latitude,
        longitude
    ) {

        const weatherURL =
            new URL(
                "https://api.open-meteo.com/v1/forecast"
            );


        weatherURL.searchParams.set(
            "latitude",
            latitude
        );


        weatherURL.searchParams.set(
            "longitude",
            longitude
        );


        weatherURL.searchParams.set(
            "current",
            [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "weather_code",
                "surface_pressure",
                "wind_speed_10m"
            ].join(",")
        );


        weatherURL.searchParams.set(
            "hourly",
            "visibility"
        );


        weatherURL.searchParams.set(
            "daily",
            [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "wind_speed_10m_max",
                "wind_gusts_10m_max",
                "precipitation_probability_max"
            ].join(",")
        );


        weatherURL.searchParams.set(
            "temperature_unit",
            currentUnit
        );


        weatherURL.searchParams.set(
            "wind_speed_unit",
            "kmh"
        );


        weatherURL.searchParams.set(
            "forecast_days",
            "16"
        );


        weatherURL.searchParams.set(
            "timezone",
            "auto"
        );


        const forecastData = await fetchJSON(weatherURL.toString());

        try {
            forecastData.climateNormals = await getClimateNormals(
                latitude,
                longitude,
                forecastData.daily.time[0]
            );
        } catch (error) {
            console.warn("Long-range climate averages unavailable:", error);
            forecastData.climateNormals = null;
        }

        return forecastData;
    }


    function shiftDate(dateString, days) {

        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day + days));

        return date.toISOString().slice(0, 10);
    }


    function shiftYear(dateString, years) {

        const [year, month, day] = dateString.split("-").map(Number);
        const targetYear = year + years;
        const lastDayOfMonth = new Date(Date.UTC(targetYear, month, 0)).getUTCDate();
        const date = new Date(Date.UTC(targetYear, month - 1, Math.min(day, lastDayOfMonth)));

        return date.toISOString().slice(0, 10);
    }


    async function getClimateNormals(latitude, longitude, forecastStart) {

        const cacheKey = `${latitude},${longitude},${forecastStart},${currentUnit}`;

        if (climateCache.has(cacheKey)) {
            return climateCache.get(cacheKey);
        }

        const forecastEnd = shiftDate(forecastStart, 29);
        const archiveURL = new URL("https://archive-api.open-meteo.com/v1/archive");

        archiveURL.searchParams.set("latitude", latitude);
        archiveURL.searchParams.set("longitude", longitude);
        archiveURL.searchParams.set("start_date", shiftYear(forecastStart, -10));
        archiveURL.searchParams.set("end_date", shiftYear(forecastEnd, -1));
        archiveURL.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum");
        archiveURL.searchParams.set("temperature_unit", currentUnit);
        archiveURL.searchParams.set("timezone", "auto");

        const data = await fetchJSON(archiveURL.toString());
        const samplesByDate = new Map();

        for (let index = 0; index < (data.daily?.time?.length || 0); index++) {
            const dateKey = data.daily.time[index].slice(5);
            const high = data.daily.temperature_2m_max[index];
            const low = data.daily.temperature_2m_min[index];
            const precipitation = data.daily.precipitation_sum[index];

            if (!Number.isFinite(high) || !Number.isFinite(low)) {
                continue;
            }

            const samples = samplesByDate.get(dateKey) || {
                high: 0,
                low: 0,
                wetDays: 0,
                count: 0
            };

            samples.high += high;
            samples.low += low;
            samples.wetDays += Number.isFinite(precipitation) && precipitation >= 1 ? 1 : 0;
            samples.count += 1;
            samplesByDate.set(dateKey, samples);
        }

        const normals = Array.from({ length: 30 }, (_, index) => {
            const date = shiftDate(forecastStart, index);
            const sample = samplesByDate.get(date.slice(5));

            if (!sample?.count) {
                return { date, count: 0 };
            }

            return {
                date,
                high: sample.high / sample.count,
                low: sample.low / sample.count,
                wetDayPercent: Math.round((sample.wetDays / sample.count) * 100),
                count: sample.count
            };
        });

        climateCache.set(cacheKey, normals);

        if (climateCache.size > 8) {
            climateCache.delete(climateCache.keys().next().value);
        }

        return normals;
    }


    // ==================================================
    // DISPLAY WEATHER
    // ==================================================

    function displayWeather(
        location,
        data
    ) {

        console.log(
            "DISPLAYING WEATHER..."
        );


        if (!data.current) {

            throw new Error(
                "Weather data does not contain current conditions."
            );
        }


        const current =
            data.current;


        const info =
            getWeatherInfo(
                current.weather_code
            );


        // ----------------------------------------------
        // CITY
        // ----------------------------------------------

        cityName.textContent =
            location.country
                ? `${location.name}, ${location.country}`
                : location.name;


        // ----------------------------------------------
        // LOCAL TIME
        // ----------------------------------------------

        localTime.textContent =
            current.time
                ? `Local time: ${formatDateTime(
                    current.time,
                    data.timezone,
                    data.utc_offset_seconds
                )}`
                : "Local time unavailable";


        // ----------------------------------------------
        // ICON
        // ----------------------------------------------

        weatherIcon.textContent =
            info.icon;


        // ----------------------------------------------
        // TEMPERATURE
        // ----------------------------------------------

        temperature.textContent =
            `${Math.round(current.temperature_2m)}°`;


        // ----------------------------------------------
        // DESCRIPTION
        // ----------------------------------------------

        weatherDescription.textContent =
            info.description;


        // ----------------------------------------------
        // FEELS LIKE
        // ----------------------------------------------

        feelsLike.textContent =
            `${Math.round(current.apparent_temperature)}°`;


        // ----------------------------------------------
        // HUMIDITY
        // ----------------------------------------------

        humidity.textContent =
            `${current.relative_humidity_2m}%`;


        // ----------------------------------------------
        // WIND
        // ----------------------------------------------

        wind.textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;


        // ----------------------------------------------
        // PRESSURE
        // ----------------------------------------------

        pressure.textContent =
            `${Math.round(current.surface_pressure)} hPa`;


        // ----------------------------------------------
        // VISIBILITY
        // ----------------------------------------------

        const visibilityValue =
            getCurrentVisibility(
                data.hourly,
                current.time
            );


        visibility.textContent =
            formatVisibility(
                visibilityValue
            );


        // ----------------------------------------------
        // FORECAST
        // ----------------------------------------------

        displayForecast(
            data.daily,
            data.climateNormals
        );


        // ----------------------------------------------
        // SHOW RESULT
        // ----------------------------------------------

        resultCard.classList.remove(
            "hidden"
        );


        emptyState.classList.add(
            "hidden"
        );


        console.log(
            "Weather dashboard displayed successfully."
        );
    }


    // ==================================================
    // VISIBILITY
    // ==================================================

    function getCurrentVisibility(
        hourly,
        currentTime
    ) {

        if (
            !hourly ||
            !hourly.time ||
            !hourly.visibility
        ) {

            return null;
        }


        let index = hourly.time.indexOf(currentTime);

        if (index === -1) {
            const currentTimestamp = new Date(currentTime).getTime();
            index = hourly.time.reduce((closestIndex, time, candidateIndex, times) => {
                const candidateDistance = Math.abs(new Date(time).getTime() - currentTimestamp);
                const closestDistance = Math.abs(new Date(times[closestIndex]).getTime() - currentTimestamp);

                return candidateDistance < closestDistance ? candidateIndex : closestIndex;
            }, 0);
        }


        return hourly.visibility[index];
    }


    function formatVisibility(
        meters
    ) {

        if (
            meters === null ||
            meters === undefined
        ) {

            return "—";
        }


        if (
            meters >= 1000
        ) {

            return (
                `${(meters / 1000).toFixed(1)} km`
            );
        }


        return (
            `${Math.round(meters)} m`
        );
    }


    // ==================================================
    // FORECAST
    // ==================================================

    function displayForecast(daily, climateNormals) {

        forecastGrid.innerHTML = "";


        if (
            !daily ||
            !daily.time ||
            daily.time.length === 0
        ) {

            forecastGrid.innerHTML =
                "<p>Forecast unavailable.</p>";

            return;
        }


        const forecastCount = Math.min(daily.time.length, 16);
        const outlookDates = climateNormals || Array.from({ length: 30 }, (_, index) => ({
            date: shiftDate(daily.time[0], index),
            count: 0
        }));

        for (let i = 0; i < 30; i++) {

            const forecastDate = daily.time[i];
            const normal = outlookDates[i];
            const dateString = forecastDate || normal?.date;

            if (!dateString) {
                continue;
            }

            if (i === forecastCount && forecastCount < 30) {
                const divider = document.createElement("div");
                divider.className = "outlook-divider";
                divider.setAttribute("role", "separator");
                divider.innerHTML = "<span>Beyond the weather-model forecast · historical averages</span>";
                forecastGrid.appendChild(divider);
            }

            const date =
                new Date(
                    `${dateString}T12:00:00`
                );

            const card =
                document.createElement(
                    "article"
                );

            const isForecast = i < forecastCount;
            const dateLabel = getForecastDate(date, i);

            card.className = isForecast
                ? "forecast-item forecast-item-model"
                : "forecast-item forecast-item-normal";

            if (isForecast) {
                const info = getWeatherInfo(daily.weather_code[i]);

                card.innerHTML = `
                    <div class="forecast-day">
                        <span>${dateLabel}</span>
                        <span class="icon" aria-label="${info.description}">${info.icon}</span>
                    </div>

                    <div class="forecast-temperature">
                        <span class="forecast-high">${Math.round(daily.temperature_2m_max[i])}°</span>
                        <span class="forecast-low">${Math.round(daily.temperature_2m_min[i])}°</span>
                    </div>

                    <div class="forecast-details">
                        <span>${info.description}</span>
                        <span>Wind ${Math.round(daily.wind_speed_10m_max[i])} km/h · Gusts ${Math.round(daily.wind_gusts_10m_max?.[i] ?? daily.wind_speed_10m_max[i])} km/h</span>
                        ${Number.isFinite(daily.precipitation_probability_max?.[i])
                            ? `<span>Rain chance ${Math.round(daily.precipitation_probability_max[i])}%</span>`
                            : ""}
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="forecast-day">
                        <span>${dateLabel}</span>
                        <span class="outlook-mark" aria-label="Historical climate average">≈</span>
                    </div>

                    <div class="forecast-temperature">
                        <span class="forecast-high">${normal?.count ? `${Math.round(normal.high)}°` : "—"}</span>
                        <span class="forecast-low">${normal?.count ? `${Math.round(normal.low)}°` : "—"}</span>
                    </div>

                    <div class="forecast-details">
                        <span>10-year typical</span>
                        <span>${normal?.count ? `Wet on ${normal.wetDayPercent}% of days` : "Climate average unavailable"}</span>
                    </div>
                `;
            }

            forecastGrid.appendChild(
                card
            );
        }
    }


    // ==================================================
    // FORECAST DATE
    // ==================================================

    function getForecastDate(
        date,
        index
    ) {

        if (index === 0) {

            return "Today";
        }


        if (index === 1) {

            return "Tomorrow";
        }


        return date.toLocaleDateString(
            "en-US",
            {
                weekday: "short",
                month: "short",
                day: "numeric"
            }
        );
    }


    // ==================================================
    // DATE / TIME
    // ==================================================

    function formatDateTime(timeString, timeZone, utcOffsetSeconds = 0) {

        const [datePart, timePart = "00:00"] = timeString.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);
        const utcTime = Date.UTC(year, month - 1, day, hours, minutes)
            - (utcOffsetSeconds * 1000);

        return new Intl.DateTimeFormat("en-US", {
            timeZone: timeZone || "UTC",
            weekday: "long",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
        }).format(new Date(utcTime));
    }


    // ==================================================
    // CELSIUS / FAHRENHEIT
    // ==================================================

    unitToggle.addEventListener(
        "click",
        async () => {

            if (!lastLocation) {

                setStatus(
                    "Search for a city first.",
                    "error"
                );

                return;
            }


            const previousUnit = currentUnit;

            currentUnit =
                currentUnit === "celsius"
                    ? "fahrenheit"
                    : "celsius";


            unitToggle.setAttribute(
                "aria-pressed",
                currentUnit === "fahrenheit"
            );

            unitToggle.setAttribute(
                "aria-label",
                `Temperature unit: ${currentUnit === "celsius" ? "Celsius" : "Fahrenheit"}`
            );


            showLoading();


            setStatus(
                "Updating temperature..."
            );


            try {

                const weatherData =
                    await getWeather(
                        lastLocation.latitude,
                        lastLocation.longitude
                    );


                displayWeather(
                    lastLocation,
                    weatherData
                );


                setStatus(
                    `Temperature switched to °${
                        currentUnit === "celsius"
                            ? "C"
                            : "F"
                    }`,
                    "success"
                );


            } catch (error) {

                console.error(
                    "UNIT ERROR:",
                    error
                );

                currentUnit = previousUnit;

                unitToggle.setAttribute(
                    "aria-pressed",
                    currentUnit === "fahrenheit"
                );

                unitToggle.setAttribute(
                    "aria-label",
                    `Temperature unit: ${currentUnit === "celsius" ? "Celsius" : "Fahrenheit"}`
                );


                setStatus(
                    error.message,
                    "error"
                );


            } finally {

                hideLoading();
            }
        }
    );


    // ==================================================
    // CURRENT LOCATION
    // ==================================================

    locateBtn.addEventListener(
        "click",
        () => {

            if (
                !navigator.geolocation
            ) {

                setStatus(
                    "Your browser does not support location services.",
                    "error"
                );

                return;
            }


            showLoading();


            setStatus(
                "Getting your current location..."
            );


            navigator.geolocation.getCurrentPosition(

                async (position) => {

                    try {

                        const latitude =
                            position.coords.latitude;

                        const longitude =
                            position.coords.longitude;


                        console.log(
                            "CURRENT LOCATION:",
                            latitude,
                            longitude
                        );


                        const weatherData =
                            await getWeather(
                                latitude,
                                longitude
                            );


                        lastLocation = {

                            latitude,
                            longitude,

                            name:
                                "Your Location",

                            country:
                                ""
                        };


                        displayWeather(
                            lastLocation,
                            weatherData
                        );


                        setStatus(
                            weatherData.climateNormals
                                ? "Weather for your current location"
                                : "16-day forecast loaded; historical averages are unavailable.",
                            weatherData.climateNormals ? "success" : ""
                        );


                    } catch (error) {

                        console.error(
                            "LOCATION WEATHER ERROR:",
                            error
                        );


                        setStatus(
                            error.message,
                            "error"
                        );


                    } finally {

                        hideLoading();
                    }
                },


                (error) => {

                    console.error(
                        "GEOLOCATION ERROR:",
                        error
                    );


                    hideLoading();


                    let message =
                        "Could not access your location.";


                    if (
                        error.code ===
                        error.PERMISSION_DENIED
                    ) {

                        message =
                            "Location permission was denied.";

                    } else if (
                        error.code ===
                        error.POSITION_UNAVAILABLE
                    ) {

                        message =
                            "Your location is currently unavailable.";

                    } else if (
                        error.code ===
                        error.TIMEOUT
                    ) {

                        message =
                            "Location request timed out.";
                    }


                    setStatus(
                        message,
                        "error"
                    );
                }
            );
        }
    );


    // ==================================================
    // INITIAL STATUS
    // ==================================================

    setStatus(
        "Search for a city to see current conditions."
    );


    console.log(
        "WeatherNow is ready."
    );

});