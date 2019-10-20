# Aura

A simple to understand air quality real-time and forecasting visualization, with an intuitive cigarette dose scale.



## Features

### Real-Time Airquality Visualization

Real-time data is subject to some uncertainty, as some sources have not been calibrated relative to each other. Ground station data is subject to localisation bias and technical error, thus should only serve as an indication for that particular location. See Model for more information. In order to provide Real-Time data for our users, we have utilized two sources. One of these is live NASA satellite data, and the other is live ground station based data sourced from AirVisual. While AirVisual does not posses the reliability and accuracy that comes with NASA solutions such as AERONET, which has data vilification by dedicated scientists, and instrument calibration, it does offer mass deployment and real time streaming. As a result, we have decided to extend this data to our users to allow them to attain an indication of current trends happening around them. One important property of these devices to consider however, is that these devices are prone to localization bias. This can be for instance, a small backyard BBQ artificially inflating the readings on a nearby sensor. Thus it is extremely important that AirVisual ground station data are taken with a large grain of salt!


### Airquality Forcast Visualization 

TIn order to both make our model reliable and allow others to understand and improve upon our work, a large portion of our data comes from open source, government based data sources. This includes organisations such as NASA and NOAA. Furthermore, data from AirVisual was also used in order to deliver real time earth station based global data, along side NASA satellite data. Here we will explain exactly how data was used to deliver our unique solution. The Artificial Intelligence (AI) algorithm used for our forecasting model was trained using NASA and NOAA data only. This was decided based on the fact that the data sources can be considered as reliable both in validity and credibility. The AI code was trained by feeding the algorithm the following datasets:    - NASA's MODIS Adaptive Processing System (MODAPS) Aqua/Terra
    (Satellite measurements of aerosol concentration within the atmosphere)
- NASA/UN's Gridded Population of the World (GPW)
    (Geospacial predicted global population densities) 
- NOAA's Global Historic Climate Network (GHCN) and Integrated Surface Database (ISD), as well as the Global Forecast System (GFS)
    (Historic global ground station based weather measurements, and forecast data)
- NASA's Aerosol Robotic Network (AERONET)
    (System of ground based aerosol measurement stations)

 

Simplified, the model is based on the following assumption. Aerosol and air pollution is correlated to population density ​and to weather. For instance, more people driving around produces more pollutants. On the other hand, if the weather is rainy, less people go out, and furthermore, the rain helps to wash away air particulates. Thus by allowing an AI algorithm to learn these correlations by providing it a series of satellite and ground station pollution data, to be compared to weather and population density data. This model is then used to predict pollution levels given a location, which is used to look up the population density, as well as the weather forecast for that region. 

 
### Air Quality Index to Cigarette Conversion Formula

A simple equation was derived based on the work by Marcelo Coelho and Amaury Martiny, as well as work by the EPA regarding pollutant conversion from parts per million (ppm) to AQI, and then to number of cigarettes per day. This formula comes down to, assuming all pollutants have the same conversion factor:

C = 0.15 X

Where C is the number of cigarettes, and X is the pollutant ppm.

### Alexa

Alexa is the interface that allows users to seek information by simply asking a question. For ease of use, questions and answers are short and simple. For example, after opening our application on Alexa (Aura info), user can ask:

    “What is the Air Quality today?”

Alexa will in turn respond with seamless, human like response. An example of this will be:



    “Hmmm, let me check for you!”
    *deep breath in*
    *deep coughing sound*
    “The air quality does not look good today. Going out today will be equivalent to smoking 2.5 cigarettes. Avoid the CBD if possible, or wear a gas mask.”About Us

Our journey started in October 2019, when a number of enthusiastic people met at the Sydney NASA Space App Challenge, and formed a team aiming to address the lack of transparency around air pollution for everyday people. By providing users with a user-friendly application, an intuitive grading scale, using reliable NASA and NOAA based data, and by making our models and code transparent, we believe we will be able to further help reduce the adverse health effects of air pollution in urban areas.

 
### About Us

Our journey started in October 2019, when a number of enthusiastic people met at the Sydney NASA Space App Challenge, and formed a team aiming to address the lack of transparency around air pollution for everyday people. By providing users with a user-friendly application, an intuitive grading scale, using reliable NASA and NOAA based data, and by making our models and code transparent, we believe we will be able to further help reduce the adverse health effects of air pollution in urban areas.

### Our Team:

- Seyed Farshad Abedi (MSc in Physics): Data Selection and Web page Development
- Joshua Kahn (Bachelor in Aerospace Engineering): Alexa App Development
- Maryam Shahpasand (PHD Candidate in Computer Science):Data Selection and A.I
- Andrea Sotalbo (BE in Software Engineering): Data Visualization
- Jiya Jindal (BE (Honors) Aeronautical Engineering):Data Visualization
- Jamshid Ghasemi (Aircraft Engineer): Health and Environment Research


Our features will hence allow for seamless integration of technology and ease of use in everyday life, to help our users live a more comfortable life.




 
