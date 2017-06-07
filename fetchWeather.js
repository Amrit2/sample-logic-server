const axios = require('axios')

    module.exports = function fetchWeather(locationName) {
      // Be sure to replace this with the API key from your openweathermap account
      // https://home.openweathermap.org/api_keys
      const appId = '<YOUR_OPENWEATHER_APP_ID>'
      const requestUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${appId}&q=${locationName}`

      return axios.get(requestUrl)
    }
