# Weather server

This project is a server collecting weather data from openweathermap. The server keeps the api key safe and trims down the needed data.

### Requisites
 - Node (tested using Node v18)
 - **.env** file in root folder containing:

    **API_KEY**="a working openweatherapi.com key"  
    **WEATHER_URL**=https://api.openweathermap.org/data/2.5/weather  
    **PORT**=4000  
    **CLIENT**=http://localhost:5173

    If client is on another server, then enter the new domain under CLIENT.

### Install
    
    npm install


### Run
    npm run dev

If everything is working the server is served at port 4000 and have two endpoints:
 - http://localhost:4000/weather (JSON data)
 - http://localhost:4000/weather_nojs (no JavaScript)


### Todo
Get tests to work. Some import error halted the process.