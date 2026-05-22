require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

//console.log(CUSTOM_OBJECT_TYPE);
const hubspotHeaders = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json',
};
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
  try {
    const properties = 'name,venue,start_date';

    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      {
        headers: hubspotHeaders,
        params: {
          properties,
          limit: 100,
        },
      }
    );

    res.render('homepage', {
      pageTitle: 'Custom Object Table | Integrating With HubSpot I Practicum',
      records: response.data.results,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('There was an error loading your custom object records.');
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
  });
});






// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
  try {
    const newRecord = {
      properties: {
        name: req.body.name,
        venue: req.body.venue,
        start_date: req.body.start_date,
      },
    };
    //console.log(properties.venue);
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      newRecord,
      {
        headers: hubspotHeaders,
      }
    );

    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('There was an error creating the custom object record.');
  }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));