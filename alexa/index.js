// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core'); //for alexa stuff
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');  //to get S3 persistence
const aws = require('aws-sdk'); //to access AWS
const s3 = new aws.S3({ apiVersion: '2006-03-01' }); //to get files from AWS

var data;

const InfoText = {
    PM: `Particulates are produced from Industrial processes, combustion of wood and fossil fuels, \
    construction and demolition activities, and entrainment of road dust into the air. They are also produced by windblown dust and wildfires.`,
    O3: `Ground Level Ozone is is formed when pollutants emitted by cars, power plants, industrial boilers, \
    refineries, chemical plants, and other sources react chemically in the presence of sunlight.`,
    CO: `Carbon Monoxide is formed both naturally and through human-driven activities, when fuels containing carbon are burnt in low-oxygen conditions.`,
    SO2: `Sulfu Dioxide is produced from the burning of fossil fuels - specifically coal and oil - \
    and the smelting of mineral ores (such as aluminum, copper, zinc, lead, and iron) that contain sulfur.`,
    CO2: `Though many living things emit carbon dioxide when they breathe, \
    the gas is widely considered to be a pollutant when associated with cars, planes, power plants, \
    and other human activities that involve the burning of fossil fuels such as gasoline and natural gas.`,
    NO2: `Nitrogen oxides, including nitrogen dioxide, are produced every time fossil fuels are burned--in power plants, \
    cars and other motor vehicles, as well as industrial boilers and heaters.`,
    FAIL: `Shoot, I don't know that one. You can say 'Tell me about air pollutants' and I'll provide a list of those I know about.`
}

const HealthText = {
    PM: `Particulates can cause premature death in people with heart or lung disease, heart attacks, irregular heartbeat, aggravated asthma,\
    decreased lung function, and increased respiratory symptoms such as irritation of the airways, coughing or difficulty breathing.`,
    O3: `Ozone can trigger a variety of health problems including chest pain, coughing, throat irritation, and airway inflammation. \
    It also can reduce lung function and harm lung tissue.`,
    NO2: `Breathing in raised levels of nitrogen dioxide increases the likelihood of respiratory problems. \
    Nitrogen dioxide inflames the lining of the lungs, and it can reduce immunity to lung infections. This can cause problems such as wheezing, coughing, colds, flu and bronchitis`,
    SO2:`Sulfur dioxide affects the respiratory system - particularly lung function - and can irritate the eyes. Sulfur dioxide irritates the respiratory tract and increases the risk of tract infections. \
    It causes coughing, mucus secretion and aggravates conditions such as asthma and chronic bronchitis.`,
    CO: `Breathing carbon monoxide can cause headache, dizziness, vomiting, and nausea. If levels are high enough, exposed people may become unconscious or die. \
    Exposure to moderate and high levels of CO over long periods of time has also been linked with increased risk of heart disease.`,
    CO2: `Exposure to carbon dioxide can produce a variety of health effects. These may include headaches, dizziness, restlessness, a tingling or \
    pins or needles feeling, difficulty breathing, \
    sweating, tiredness, increased heart rate, elevated blood pressure, coma, asphyxia, and convulsions`,
    FAIL: `Shoot, I don't know that one. You can say 'Tell me about air pollutant effects' and I'll provide a list of those I know about.`
}

const HealthDumpText = {
    dText: `I can provide info on either particulates under two point five or ten microns, ozone, carbon monoxide,\
    silicon dioxide or nitrogen dioxide. What pollutant woud you like to know more about?`
}  //seemingly deprecated

//Function to get data from a CSV file
async function csvFromAWSToInput(csvName) {
    const bucket = 'aurafiles';
    const key = csvName;
    const params = {
        Bucket: bucket,
        Key: key,
     };
    try { //this function gets CSV stuff.
        const data =  await s3.getObject(params).promise();
        var content = data.Body.toString();
        var lines = content.split(',');
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    } 
    //Layout of Information is as follows:
    //Particulate Matter (2.5 and 10 Microns) is array[3]
    //Ozone is array[5]
    //Sulfur Dioxide is array[7]
    //Carbon Monoxide is array[9]
    //Carbon Dioxide is array[11]
    //AQI is array[13]
    //Smokes (quantity) per day is array[15]
    data = {
        pm: lines[3],
        ozone: lines[5],
        so2: lines[7],
        co: lines[9],
        co2: lines[11],
        aqi: lines[13],
        smokes: lines[15]
    } //this data could be used in additional functions in the future, such as a pollutant breakdown.
    return data;
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
   async handle(handlerInput) {
        //Check to see if we have a city stored
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        const currentCity = sessionAttributes.hasOwnProperty('currentCity') ? sessionAttributes.currentCity : 0;
        
        if (currentCity) { //If we have a city stored, give the default launch message
            const speakOutput = `Welcome to Aura! You can ask me about the current air quality, the air quality forecast, or info about air pollutants. Which would you like to try?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard("Welcome!", speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        } else {
            const speakOutput = `Welcome to Aura! I can provide all sorts of info on air quality. Before we begin, can you provide the name of the city you're living in?`;
            //Note: This would not be necessary by default if the Alexa Test Website could provide location data.
            //It cannot, however, and therefore we need to set the city beforehad.
            const repromptOutput = `Say 'I live in ...' followed by the name of the city. What's the name of the city you live in?`
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .withSimpleCard("Welcome!", speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
    }
};

const currentCityAddIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'currentCityAddIntent';
    },
    async handle(handlerInput) {
        //Get values from slots
        const currentCity = handlerInput.requestEnvelope.request.intent.slots.currentCity.value;
        //...and initialize the attributesManager
        const attributesManager = handlerInput.attributesManager;
        // And then tell the attributesManager what the slots should be saved as
        const locationAttributes = {
            "currentCity" : currentCity,
        };
        
        //We need to send that data we just declared to S3
        attributesManager.setPersistentAttributes(locationAttributes);
        //and wait for it to arrive
        await attributesManager.savePersistentAttributes();
        const speakOutput = `Thanks, I'll remember that your current city is ${currentCity}. Please say 'Launch Aura Air' to restart the service.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard("Current City Saved", speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


//Get the air quality where the user is right now.
//We'll use a separate function to get the info from the file.
const AirQualityLocalIntentHandler = {
    canHandle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        
        const currentCity = sessionAttributes.hasOwnProperty('currentCity') ? sessionAttributes.currentCity : 0;
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'airQualityLocalIntent' && currentCity;
        //Instead of asking for whether or not we have location info here,
        //We'll check for it dynamically.
    },
   async handle(handlerInput) {
        //First step - see if we can get location data
        const serviceClientFactory = handlerInput.serviceClientFactory; 
        const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
        const accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
        //const apiEndpoint = handlerInput.requestEnvelope.context.System.apiEndpoint; 
        //Ask for permissions through a card if it doesn't work!
        if (!accessToken) {
            return handlerInput.responseBuilder
                .speak(`Please enable Customer Profile permissions in the Amazon Alexa app.`)
                .withAskForPermissionsConsentCard(['read::alexa:device:all:address'])  //use a card so that people can touch a screen to give permission, if they have a screen alexa device.
                .getResponse();
    }
        //now we try to get address from API. We put it in 'try' just in case the API call fails
        
        //NOTE TO REVIEWERS: I don't have access to an Alexa, meaning that I cannoty access any device location (the test website does not support it, and only produces 'null' output.)
        //As such the following code block is commented out. Comments will explain what would be done if a real device is used.
        /*
        let address;                                                                //initialize it but don't declare it in case we can't reach it
        try {                                                                       //try to get timezone, but don't commit just in case the API call fails
            const upsServiceClient = serviceClientFactory.getUpsServiceClient();    //activate the client
            address = await upsServiceClient.getaddress(deviceId);                  //and get the location
            } catch (error) {                                                       //if the API can't be accessed, pass an error.
                if (error.name !== 'ServiceError') {                                //say the following upon a service error:
                    return handlerInput.responseBuilder.speak("There was a problem connecting to the service.").getResponse();
                 }
                console.log('error', error.message);
            }  
        const cityFromAPI = address.city;                                           //Get the city from the api.
        */
        //Instead, we load the attributes manager
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        //and get the current city and time indicated by the slot.
        
        const currentCity = sessionAttributes.hasOwnProperty('currentCity') ? sessionAttributes.currentCity : 0;
         //For the purposes of demonstration, the current two files are 'Sydney' and 'Beijing.' We need to reject cities that don't match this input for now.
        
        if (currentCity !== `sydney` && (currentCity !==`Beijing`)) {
            return handlerInput.responseBuilder
            .speak(`Sorry, we don't have ` + currentCity + ` on file. For this demo, you can select Sydney or Beijing.`)
            .withSimpleCard(`City Not Detected`, `Please try again with either Sydney or Beijing.`)
            .reprompt()
            .getResponse();
        }
        
        const dateValue = handlerInput.requestEnvelope.request.intent.slots.date.value;  //get the current date to feed into data retrieval 
        //CSV format for this Alexa demonstration is the following: 'AQD-currentCity-dateValue.csv'
        const csvName = `AQD-` + currentCity + `-` + dateValue + `.csv`;
        //ask the almighty function to retrieve the corresponding file from the AWS server
        data = await csvFromAWSToInput(csvName);
        //and pull out the info as required.
        const dataSmokes = data.smokes;
        
        let cardTitle;
        let speakOutput; //Determine what recommendation we want to give
        let cardOutput;
        if (dataSmokes <= 1) {
            cardTitle = `Looking good!`
            speakOutput = `<speak>Let me check. <audio src = "https://aurafiles.s3.amazonaws.com/alexabreathe.mp3" />
            It feels like a fine day to go outside! The measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes.</speak>`
            cardOutput = `It feels like a fine day to go outside! The measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes.`
        } else if (dataSmokes > 1 && dataSmokes < 2) {
            cardTitle = `Looking iffy...`
            speakOutput = `<speak>Let me check. <audio src = "https://aurafiles.s3.amazonaws.com/alexabreathe.mp3" />
            It looks a little hairy...the measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes. \
            If you're sensitive to allergens, consider taking an antihistamine.</speak>`
            cardOutput = `It looks a little hairy...the measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes. If you're sensitive to allergens, consider taking an antihistamine.`
        } else {
            cardTitle = `Looking bad...`
            speakOutput = `<speak>Let me check. <audio src = "https://aurafiles.s3.amazonaws.com/alexabreathetocough.mp3" /><audio src="soundbank://soundlibrary/human/amzn_sfx_cough_01"/>
            <amazon:effect name="whispered">Not looking good...the measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes. \
            Minimise time spent outside, or bring a gas mask with you.</amazon:effect></speak>`
            cardOutput = `Not looking good...the measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes. Minimise time spent outside, or bring a gas mask with you.`
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(cardTitle, cardOutput)
            .reprompt()
            .getResponse();
    }
};

const AirQualityLocationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'airQualityLocationIntent';
        //For the case where you want to check out a specific city.
    },
   async handle(handlerInput) {
        
        //We load the attributes manager
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        //and get the current city and time indicated by each slot.
        
        const cityValue = handlerInput.requestEnvelope.request.intent.slots.queryCity.value; 
        const dateValue = handlerInput.requestEnvelope.request.intent.slots.date.value;  //get the current date to feed into data retrieval 
        
        //For the purposes of demonstration, the current two files are 'Sydney' and 'Beijing.' We need to reject cities that don't match this input for now.
        
        if (cityValue !== `sydney` && (cityValue !==`Beijing`)) {
            return handlerInput.responseBuilder
            .speak(`Sorry, we don't have ` + cityValue + ` on file. For this demo, you can select Sydney or Beijing.`)
            .withSimpleCard(`City Not Detected`, `Please try again with either Sydney or Beijing.`)
            .reprompt()
            .getResponse();
        }
        
        //CSV format for this Alexa demonstration is the following: 'AQD-cityValue-dateValue.csv'
        const csvName = `AQD-` + cityValue + `-` + dateValue + `.csv`;
        //ask the almighty function to retrieve the corresponding file from the AWS server
        data = await csvFromAWSToInput(csvName);
        //and pull out the info as required.
        const dataSmokes = data.smokes;
        
        let cardTitle;
        let speakOutput; //Determine what recommendation we want to give
        let cardOutput;
        if (dataSmokes <= 1) {
            cardTitle = `Looking good!`
            speakOutput = `<speak>Let me check. <audio src = "https://aurafiles.s3.amazonaws.com/alexabreathe.mp3" />
            It feels like a fine day to go outside! The measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes.</speak>`
            cardOutput = `It feels like a fine day to go outside! The measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes.`
        } else if (dataSmokes > 1 && dataSmokes < 2) {
            cardTitle = `Looking iffy...`
            speakOutput = `<speak>Let me check. <audio src = "https://aurafiles.s3.amazonaws.com/alexabreathe.mp3" />
            It looks a little hairy...the measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes. \
            If you're sensitive to allergens, consider taking an antihistamine.</speak>`
            cardOutput = `It looks a little hairy...the measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes. If you're sensitive to allergens, consider taking an antihistamine.`
        } else {
            cardTitle = `Looking bad...`
            speakOutput = `<speak>Let me check. <audio src = "https://aurafiles.s3.amazonaws.com/alexabreathetocough.mp3" /><audio src="soundbank://soundlibrary/human/amzn_sfx_cough_01"/>
            <amazon:effect name="whispered">Not looking good...the measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes. \
            Minimise time spent outside, or bring a gas mask with you.</amazon:effect></speak>`
            cardOutput = `Not looking good...the measured air quality is equivalent to breathing ` + dataSmokes + ` cigarettes. Minimise time spent outside, or bring a gas mask with you.`
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(cardTitle, cardOutput)
            .reprompt()
            .getResponse();
    }
};

// If someone asks for info about Pollutants
const PollutantInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PollutantInfoIntent';
    },
    handle(handlerInput) {
        //Initialise the attributes manager and get the pollutant to look at
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        const pollutantInfoValue = handlerInput.requestEnvelope.request.intent.slots.pollutant.value;
        //Save the pollutant to the session manager just in case the user wants to ask about health effects next
        //I'm saving it for posterity as it does not follow through for some reason I cannot decipher. This is left for the purposes of proof of capability
        sessionAttributes.pollutantInfo = pollutantInfoValue;
        
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        //In case the response is gibberish
        let cardTitle;
        let speakOutput = InfoText.FAIL
        
        if (pollutantInfoValue === 'carbon monoxide') {
            cardTitle = `Carbon Monoxide`
            speakOutput = InfoText.CO;
        } else if (pollutantInfoValue === 'nitrogen dioxide') {
            cardTitle = `Nitrogen Dioxide`
            speakOutput = InfoText.NO2;
        } else if (pollutantInfoValue === 'ozone') {
            cardTitle = `Ozone`
            speakOutput = InfoText.O3;
        } else if (pollutantInfoValue === 'sulfur dioxide') {
            cardTitle = `Sulfur Dioxide`
            speakOutput = InfoText.SO2;
        } else if (pollutantInfoValue === 'carbon dioxide') {
            cardTitle = `Carbon Dioxide`
            speakOutput = InfoText.CO2;
        } else if (pollutantInfoValue === 'particulate matter') {
            cardTitle = `Particulate Matter`
            speakOutput = InfoText.PM;
        } else {
            cardTitle = `Pollutant Not Found`
            speakOutput = InfoText.FAIL;
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(cardTitle, speakOutput)
            //We reprompt to see if someone wants to know more info from Aura Info
            .reprompt()
            .getResponse();
    }
};

//Idea: When someone triggers either PollutantInfo or PollutantHealth, the Pollutant measured gets saved into an attribute. 

//If someone asks for health effects about pollutants
const PollutantHealthIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PollutantHealthIntent';
    },
    handle(handlerInput) {
        //If the user has already invoked health, we get that slot to make the transition between intents seamless
        //const attributesManager = handlerInput.attributesManager;
        //const sessionAttributes = attributesManager.getSessionAttributes();
        //const attributes = handlerInput.attributesManager.getSessionAttributes();
        
        //get the session attribute from the information intent, if it was accessed earlier. 
        //NOTE: THIS SHOULD WORK BUT FOR SOME REASON IT DOES NOT. AZI COULDN'T FIGURE IT OUT EITHER :P
        //let pollutantHealthAttribute = attributes.pollutantInfo;
        const pollutantHealthSlot = handlerInput.requestEnvelope.request.intent.slots.pollutant.value;
        let pollutantHealthValue;
        /*
        //If it exists, set the search value to be the info value
        if (pollutantHealthAttribute && (pollutantHealthAttribute !== pollutantHealthSlot)) {
            pollutantHealthValue = pollutantHealthAttribute;
        } else { //try from the slots
            pollutantHealthValue = pollutantHealthSlot;
        } */
        
        pollutantHealthValue = pollutantHealthSlot;
        //By default, if there are no slots filled
        let speakOutput = HealthText.FAIL;
        let cardTitle;
        if (pollutantHealthValue === 'carbon monoxide') {
            cardTitle = `Carbon Monoxide`
            speakOutput = HealthText.CO;
        } else if (pollutantHealthValue === 'nitrogen dioxide') {
            cardTitle = `Nitrogen Dioxide`
            speakOutput = HealthText.NO2;
        } else if (pollutantHealthValue === 'ozone') {
            cardTitle = `Ozone`
            speakOutput = HealthText.O3;
        } else if (pollutantHealthValue === 'sulfur dioxide') {
            speakOutput = HealthText.SO2;
            cardTitle = `Sulfur Dioxide`
        } else if (pollutantHealthValue === 'carbon dioxide') {
            speakOutput = HealthText.CO2;
            cardTitle = `Carbon Dioxide`
        } else if (pollutantHealthValue === 'particulate matter') {
            cardTitle = `Particulate Matter`
            speakOutput = HealthText.PM;
        } else {
            cardTitle = `Pollutant Not Found`
            speakOutput = HealthText.FAIL;
        }
            
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(cardTitle, speakOutput)
            //We reprompt to see if someone wants to know more info from Aura Info
            .reprompt()
            .getResponse();
      
    }
};

const chernobylIntentHandler = { //a bit of fun
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'chernobylIntent';
        //For the case where you want to check out a specific city.
    },
   async handle(handlerInput) {
        
        //play a sound and say something funny. Not to be taken seriously
        
        let cardTitle =  `Special message from the Kommissar.`;
        let speakOutput = `<speak>Special message from the Kommissar.<audio src = "https://aurafiles.s3.amazonaws.com/alexaChernobyl.mp3" /></speak>`; //Determine what recommendation we want to give
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(cardTitle, `Important Message Inbound!`)
            .reprompt()
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoadCurrentCityInterceptor = {
    async process(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        //Get either the cty info, or find nothing
        const sessionAttributes = await attributesManager.getPersistentAttributes () || {};
        
        const currentCity = sessionAttributes.hasOwnProperty('currentCity') ? sessionAttributes.currentCity : 0;

        if (currentCity) { //If we have it all, set the current session to have it
            attributesManager.setSessionAttributes(sessionAttributes);
        }
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .withApiClient(new Alexa.DefaultApiClient ()) //Need this to get data about location, timezone, etc.
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
        )
    .addRequestHandlers(
        AirQualityLocalIntentHandler,
        AirQualityLocationIntentHandler,
        LaunchRequestHandler,
        currentCityAddIntentHandler,
        PollutantInfoIntentHandler,
        PollutantHealthIntentHandler,
        chernobylIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addRequestInterceptors(
    LoadCurrentCityInterceptor  //we do this seperately to load data every time
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
