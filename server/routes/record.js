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

/**
 * GOOGLE
 */

const {google} = require('googleapis');
const calendar = google.calendar('v3');
var oauth2Client = new google.auth.OAuth2(
    '504181834497-omrl5mnes3qmvvu39hu5v404lemlfq1c.apps.googleusercontent.com',
    "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",
    "postmessage" // you use 'postmessage' when the code is retrieved from a frontend (couldn't find why online)
);

/**
 * -------------- MY METHODS ---------------
 */

/**
 * FETCH ACTIVITIES
 * Fetches data for customize page based on the id
 */
recordRoutes.route("/customize/:id").get(function (request, response) {
    let db_connect = dbo.getDb();
    let myQuery = {restaurantId: request.params.id};
    db_connect
        .collection("restaurant_info")
        .findOne(myQuery, function (err, result) {
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
    let myQuery = {restaurantId: request.params.id};
    db_connect
        .collection("activities")
        .findOne(myQuery, function (err, result) {
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
    let myQuery = {restaurantId: request.params.id};
    db_connect
        .collection("booking") // <------------- rename collection to bookingS
        .findOne(myQuery, function (err, result) {
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
    let myQuery = {restaurantId: req.params.id};
    db_connect
        .collection("restaurant_info") //
        .findOne(myQuery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

/**
 * ----------- SAVE CHANGES TO DB ----------------
 */

/**
 * UPDATE RESTAURANT INFO
 */
recordRoutes.route("/customize/save_changes/:id").post(function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {restaurantId: request.params.id};
    let newValues = {
        $set: {
            additionalInfo: request.body.additionalInfo,
            primaryColor: request.body.primaryColor,
            secondaryColor: request.body.secondaryColor,
            logoPath: request.body.logoPath,
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
        .updateOne(myQuery, newValues, function (err, result) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(result);
        });
});

/**
 * UPDATE ACTIVITIES
 */
recordRoutes.route("/activities/save_changes/:id").post(function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {restaurantId: request.params.id};
    let newValues = {
        $set: {
            bookingForewarning: request.body.bookingForewarning,
            bookingThreshold: request.body.bookingThreshold,
            bookingOffset: request.body.bookingOffset,
            activities: request.body.activities
        },
    };
    db_connect
        .collection("activities")
        .updateOne(myQuery, newValues, function (err, result) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(result);
        });
});

/**
 * UPDATE BOOKINGS
 * Sets booking's new status when it gets changed by the user in the management page
 */
recordRoutes.route("/bookings/save_changes/:id/:bookingId").post(function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {
        restaurantId: request.params.id,
        'bookings.id': request.params.bookingId
    };
    let newValues = {
        $set: {
            'bookings.$.bookingStatus': request.body.newStatus
        },
    };
    db_connect
        .collection("booking")
        .updateOne(myQuery, newValues, function (err, result) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(result);
        });
});

/**
 * ADD NEW BOOKING
 * Booking form query that adds a new booking in the db
 */
recordRoutes.route("/booking/add/:id").post(async function (request, response) {
    let db_connect = dbo.getDb();
    let myQuery = {
        "restaurantId": request.params.id
    };
    let booking = {
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
    let newValues = {
        $push: {
            bookings: booking
        }
    };
    if (booking.bookingStatus === 'confirmed') {
        await addBookingToCalendar(request.params.id, booking);
    }
    db_connect
        .collection("booking")
        .updateOne(myQuery, newValues, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
});

/**
 * DELETE EXISTING BOOKING
 * Booking form query that deletes a booking from the db
 */
recordRoutes.route("/booking/update").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myQuery = {
        restaurantId: req.body.id,
        'bookings.id': req.body.bookingId
    };
    let newValues = {
        $set: {
            'bookings.$.bookingStatus': 'canceled'
        },
    };
    db_connect
        .collection("booking")
        .updateOne(myQuery, newValues, function (err, res) {
            if (err) throw err;
            // console.log("1 document updated");
            response.json(res);
        });
});

/**
 * -------------- GOOGLE -------------------
 */

/**
 * Manages the user's tokens, storing them in an encrypted way. Returns to the client the user's info
 */
recordRoutes.route("/auth/google/").post(async (request, response) => {
    let {tokens} = await oauth2Client.getToken(request.body.code) //await oauth2Client.getToken(request.body.googleData);
    let restaurantId = request.body.restaurantId
    if (tokens.refresh_token) {
        storeTokens(tokens, restaurantId)
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
    // testRefreshToken();
    /*let testBooking = {
        id: "hcggfhhgdr54332",
        bookingDate: "2022-9-28",
        bookingTime: "20:30",
        bookingGuests: "5",
        bookingActivity: "Aperitivo",
        bookingStatus: "confirmed",
        guestName: "Pippo",
        guestSurname: "Pluto",
        guestEmail: "pippo@gmail.com",
        guestPhone: "3437292344",
        guestAdditionalInfo: "Additional Info",
    }
    await addBookingToCalendar(restaurantId, testBooking)
    setTimeout(async () => await removeBookingFromCalendar(restaurantId, testBooking.id), 20000)*/
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
            console.log("1 document updated " + result);
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

/**
 * [GOOGLE CALENDAR] Converts our booking object into a correct Google Event object
 * @param booking
 * @returns {{summary: string, start: {dateTime: string, timeZone: string}, description: string, end: {dateTime: string, timeZone: string}, id}}
 */
function bookingToGoogleEvent(booking) {
    const timeStampStart = booking.bookingDate + "T" + booking.bookingTime + ":00+02:00";
    let timeHour = parseInt(booking.bookingTime.substring(0, 2));
    let timeMin = booking.bookingTime.substring(3, 5);
    timeHour += 2;
    let endTime = String(timeHour) + ":" + timeMin;
    const timeStampEnd = booking.bookingDate + "T" + endTime + ":00+02:00";
    // parametrize the returned object with fields in booking
    return {
        id: booking.id,
        summary: booking.bookingActivity + ' per ' + booking.bookingGuests,
        description: booking.guestName + ' ' + booking.guestSurname + ' ha prenotato per ' + booking.bookingGuests + ' alle ' + booking.bookingTime + ' del ' + booking.bookingDate + '. I contatti di ' + booking.guestName + ' sono: ' + booking.guestPhone + ', ' + booking.guestEmail + '. ' + (booking.guestAdditionalInfo != null ? 'Il cliente ha lasciato un messaggio alla prenotazione: ' + booking.guestAdditionalInfo : ''),
        start: {
            dateTime: timeStampStart,
            timeZone: 'Europe/Rome',
        },
        end: {
            dateTime: timeStampEnd,
            timeZone: 'Europe/Rome',
        },
    }
}

/**
 * [GOOGLE CALENDAR] Adds a new Event to the restaurant's calendar
 * @param restaurantId
 * @param booking booking object
 * @returns {Promise<void>}
 */
async function addBookingToCalendar(restaurantId, booking) {
    let tokens = await getTokens(restaurantId)
    oauth2Client.setCredentials(tokens);
    let bookingEvent = bookingToGoogleEvent(booking)
    await calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        resource: bookingEvent,
    }, function (err, bookingEvent) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }

    });
    console.log('Event created ' + bookingEvent.id);
}

/**
 * [GOOGLE CALENDAR] Removes event from restaurant's calendar
 * @param restaurantId
 * @param bookingId event's id and booking's id are the same
 * @returns {Promise<void>}
 */
async function removeBookingFromCalendar(restaurantId, bookingId) {
    let tokens = await getTokens(restaurantId)
    oauth2Client.setCredentials(tokens);

    const res = await calendar.events.delete({
        auth: oauth2Client,
        calendarId: 'primary',
        eventId: bookingId,
    });
    console.log(res.data)
}


/**
 * -------------- TESTS -------------------
 */

module.exports = recordRoutes;