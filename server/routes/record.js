/**
 * MODULES IMPORT
 */

const express = require("express");
const axios = require('axios');
const {encrypt, decrypt} = require('./../encryption/encryption');

/**
 * ROUTES
 */

const recordRoutes = express.Router();

/**
 * DB
 */

const dbo = require("./../db/conn.js");// This will help us connect to the database
// const ObjectId = require("mongodb").ObjectId;// This help convert the id from string to ObjectId for the _id.

/**
 * GOOGLE
 */

// const { OAuth2Client } = require('google-auth-library')
// const client = new OAuth2Client(process.env.CLIENT_ID)
const {google} = require('googleapis');
const {request} = require("express");
var oauth2Client = new google.auth.OAuth2(
    '504181834497-omrl5mnes3qmvvu39hu5v404lemlfq1c.apps.googleusercontent.com',
    "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",
    "postmessage" // you use 'postmessage' when the code is retrieved from a frontend (couldn't find why online)
);

/**
 * -----------------------------------------
 * -------------- MY METHODS ---------------
 * -----------------------------------------
 */

/**
 * ----------- FETCHING FROM DB ------------
 */

/**
 * FETCH ACTIVITIES
 * Fetches data for customize page based on the id
 */
recordRoutes.route("/customize/:id").get(function (request, response) {
    let db_connect = dbo.getDb();
    let myquery = {restaurantId: request.params.id};
    db_connect
        .collection("restaurant_info")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            response.json(result);
        });
});

/**
 * FETCH CUSTOMIZATION SETTINGS
 * Fetches data for customize page based on the id
 */
recordRoutes.route("/activities/:id").get(function (request, response) {
    let db_connect = dbo.getDb();
    let myquery = {restaurantId: request.params.id};
    db_connect
        .collection("activities")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            response.json(result);
        });
});

/**
 * FETCH BOOKINGS
 * Fetches bookings regarding restaurant with id passed as parameter
 */
recordRoutes.route("/bookings/:id").get(function (request, response) {
    let db_connect = dbo.getDb();
    let myquery = {restaurantId: request.params.id};
    db_connect
        .collection("booking") // <------------- rename collection to bookingS
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            response.json(result);
        });
});

/**
 * FETCH RESTAURANT INFO
 * Fetches infos about restaurant
 */
recordRoutes.route("/restaurant_info/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = {restaurantId: req.params.id};
    db_connect
        .collection("restaurant_info") //
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});


/**
 * ----------- SAVE CHANGES TO DB ----------------
 */

/**
 * Updates restaurant_info by id if the id already exixsts in the db, creates a new record if the id doesn't exist
 */

recordRoutes.route("/customize/save_changes/:id").post(function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myquery = {restaurantId: request.params.id};
    let newvalues = {
        $set: {
            additionalInfo: request.body.additionalInfo,
            primaryColor: request.body.primaryColor,
            secondaryColor: request.body.secondaryColor,
            logoPath: request.body.restaurantLogo,
            socialNetworks: request.body.socialNetworks,
            bookingForewarning: "",
            bookingOffest: "",
            bookingTheshold: {
                $numberInt: ""
            },
            restaurantName: request.body.restaurantName
        },
    };
    db_connect
        .collection("restaurant_info")
        .updateOne(myquery, newvalues, function (err, result) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(result);
        });
});

recordRoutes.route("/activities/save_changes/:id").post(function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myquery = {restaurantId: request.params.id};
    let newvalues = {
        $set: {
            bookingForewarning: request.body.bookingForewarning,
            bookingThreshold: request.body.bookingThreshold,
            bookingOffset: request.body.bookingOffset,
            activities: request.body.activities
        },
    };
    db_connect
        .collection("activities")
        .updateOne(myquery, newvalues, function (err, result) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(result);
        });
});

recordRoutes.route("/bookings/save_changes/:id/:bookingId").post(function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myquery = {
        restaurantId: request.params.id,
        'bookings.id': request.params.bookingId
    };
    let newvalues = {
        $set: {
            'bookings.$.bookingStatus': request.body.newStatus
        },
    };
    db_connect
        .collection("booking")
        .updateOne(myquery, newvalues, function (err, result) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(result);
        });
});

/**
 * BOOKING FORM QUERIES - ADD NEW BOOKING
 */
recordRoutes.route("/booking/add/:id").post(function (request, response) {
    let db_connect = dbo.getDb();
    let myQuery = {
        "restaurantId": request.params.id
    };
    let newValues = {
        $push: {
            bookings: {
                id: request.body.id,
                bookingDate: request.body.bookingDate,
                bookingTime: request.body.bookingTime,
                bookingGuests: request.body.bookingGuests,
                bookingActivity: request.body.bookingActivity,
                bookingStatus: request.body.bookingStatus,
                guestName: request.body.guestName,
                guestSurname: request.body.guestSurname,
                guestEmail: request.body.guestEmail,
                guestPhone: request.body.guestPhone,
                guestAdditionalInfo: request.body.guestAdditionalInfo,
            }
        }
    };
    db_connect
        .collection("booking")
        .updateOne(myQuery, newValues, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
});

/**
 * BOOKING FORM QUERIES - DELETE EXISTING BOOKING
 */
recordRoutes.route("/booking/update").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = {
        restaurantId: req.body.id,
        'bookings.id': req.body.bookingId
    };
    let newvalues = {
        $set: {
            'bookings.$.bookingStatus': 'canceled'
        },
    };
    db_connect
        .collection("booking")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            // console.log("1 document updated");
            response.json(res);
        });
});

/**
 * -----------------------------------------
 * -------------- GOOGLE -------------------
 * -----------------------------------------
 */

recordRoutes.route("/auth/google/").post(async (request, response) => {
    let {tokens} = await oauth2Client.getToken(request.body.code) //await oauth2Client.getToken(request.body.googleData);
    if (tokens.refresh_token) {
        storeTokens(tokens, "0001")
        // save it with the restaurant id
        /**
         * RESUME FROM HERE
         * DO NOT JUST SAVE REFRESH TOKEN BUT ALSO THE ACCESS TOKEN
         *
         * Revoke access here https://myaccount.google.com/u/1/permissions?pageId=none to test the receiving of refresh token
         */
        // upsert(tokens, request.body.id)

    }
    // console.log(tokens);
    testRefreshToken();
    await addBookingToCalendar('0001', {})
    // Get user info and return them to the client so that they can be printed
    if (tokens.access_token) {
        const userInfo = await axios
            .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {Authorization: `Bearer ${tokens.access_token}`},
            })
            .then(res => res.data).then();
        response.send(JSON.stringify(userInfo))
    }
})

/**
 * UTILITY LIB
 */

function bookingToGoogleEvent(booking){
    // parametrize the returned object with fields in booking
    return {
        'summary': 'Aperitivo per 5',
        'description': 'Tizio ha prenotato per 5 alle XX:XX del XX-XX ad un Aperitivo. I contatti di Tizio sono: 423893248932, tizio@gmail.com',
        'start': {
            'dateTime': '2022-09-23T09:00:00-00:00',
            'timeZone': 'America/Los_Angeles',
        },
        'end': {
            'dateTime': '2022-09-23T17:00:00-00:00',
            'timeZone': 'America/Los_Angeles',
        },
    }
}

async function addBookingToCalendar(restaurantId, booking){
    let tokens = await getTokens(restaurantId)
    oauth2Client.setCredentials(tokens);
    let bookingEvent = bookingToGoogleEvent(booking)
    let calendar = google.calendar('v3')
    await calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        resource: bookingEvent,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event created');
    });
}

/**
 * Stores the refresh token in the db in an encrypted format
 * @param tokens google oAuth2 tokens taken from login
 * @param restaurantId
 */
function storeTokens(tokens, restaurantId) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {restaurantId: restaurantId};
    // ENCRYPTION
    let encrypted = encrypt(JSON.stringify(tokens))
    let newValues = {
        $set: {
            tokens: encrypted
        },
    };
    db_connect
        .collection("tokens")
        .updateOne(myQuery, newValues, function (err, result) {
            if (err) throw err;
            console.log("1 document updated");
        });

}

/**
 * Gets tokens from db corresponding to the restaurantId passed as argument
 * @param restaurantId
 */
async function getTokens(restaurantId) {
    let db_connect = dbo.getDb();
    let myQuery = {restaurantId: restaurantId};
    return db_connect
        .collection("tokens")
        .findOne(myQuery)
        .then((result) =>
            JSON.parse(decrypt(result.tokens))
        )

}

function testRefreshToken() {
    console.log("Started timeout")
    setTimeout(async () => {
        let tokens = await getTokens("0001")
        oauth2Client.setCredentials(tokens);

        /* 
        * Save credential to the global variable in case access token was refreshed.
        * ACTION ITEM: In a production app, you likely want to save the refresh token
        *              in a secure persistent database instead.
        */
        // userCredential = tokens;

        const drive = google.drive('v3');
        await drive.files.list({
            auth: oauth2Client,
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        }, (err1, res1) => {
            if (err1) return console.log('The API returned an error: ' + err1);
            const files = res1.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file) => {
                    console.log(`${file.name} (${file.id})`);
                });
                response.json(files)
            } else {
                console.log('No files found.');
            }
        });
    }, 3610000)
}

module.exports = recordRoutes;