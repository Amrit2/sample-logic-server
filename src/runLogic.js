const fetchWeather = require('./fetchWeather')
const InitClient = require('initai-node')

module.exports = function runLogic(eventData) {
  return new Promise((resolve) => {
    const client = InitClient.create(eventData, {succeed: resolve})

   const collectCity = client.createStep({
      satisfied() { return Boolean(client.getConversationState().weatherCity) },

     extractInfo() {
        // use the getFirstEntityWithRole method to exatract city from a message 
        const city = client.getFirstEntityWithRole(client.getMessagePart(), 'city')

        // If we have a city, update our conversation state
        if (city) {
          client.updateConversationState({
            weatherCity: city,
          })

          console.log('Grab the weather for: ', city)
        }
      },
     
      prompt() {
        // Prompt the user for their city
        // We will use the onboarding_prompt_city intent from our training data
        client.addResponse('onboarding_prompt_city')
        client.done()
      },
    })

     const provideWeather = client.createStep({
      satisfied() { return false },

      prompt() {
        const weatherData = {
          temperature: 60,
          condition: 'sunny',
          city: client.getConversationState().weatherCity.value,
        }

        client.addResponse('provide_weather', weatherData)
        client.done()
      },
    })

    client.runFlow({
      streams: {
        main: 'getWeather',
        getWeather: [collectCity, provideWeather],
      }
    })
  })
}
