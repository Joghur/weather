# Weather

This project is composed of

- a server collecting weather data from openweathermap. The server keeps the api key safe and trims down the needed data.
- a ReactJs widget that displays weather data. You can select the city from which you want the data.

### Requisites
 - Node (tested using Node v18)
 - **.env** file in server folder containing:

    **API_KEY**="a working openweatherapi.com key"  
    **WEATHER_URL**=https://api.openweathermap.org/data/2.5/weather  
    **PORT**=4000  
    **CLIENT**=http://localhost:5173

    If client is on another server, then enter the new domain under CLIENT.

### Install and run
Install and run using the following command in a terminal
    
    npm run start

If everything is working, goto page **http://localhost:5173** to see the weather data. City chosen defaults to Copenhagen, but you can pass another city in the Url: **http://localhost:5173/?city=Hobro**

The server is served at port 4000 and have two endpoints:
 - http://localhost:4000/weather (JSON data)
 - http://localhost:4000/weather_nojs (no JavaScript)

### Troubleshooting
If something goes wrong, you can start the server and widget client in two separate terminals, by going inside each subfolder and type

    npm install
    npm run dev


### Todo

 - Get tests to work for the server. Some import error halted the process.
 - Change server URL in **widget/src/settings** if it changes from **localhost:4000/weather**