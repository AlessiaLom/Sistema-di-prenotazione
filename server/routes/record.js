/**
 * ------------------------ MODULES IMPORT ---------------------------
 */

const fs = require("fs");
const path = require("path");
const express = require("express");
const axios = require('axios');
const https = require("https");
const uuid = require('uuid');
const handlebars = require('handlebars');

/**
 * EMAIL
 */

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "mail.kobold.studio",
    auth: {
        user: 'booking@kobold.studio',
        pass: 'Ym9Nir+bUy84',
    },
    secure: true,
});

/**
 * ENCRYPTION
 */

const {encrypt, decrypt} = require('./../encryption/encryption');

/**
 * EMAIL TEMPLATE
 */

const emailTemplateSource = fs.readFileSync(path.join(__dirname, "./../views/template.hbs"), "utf8");
const template = handlebars.compile(emailTemplateSource);

const pendingEmailTemplateSource = fs.readFileSync(path.join(__dirname, "./../views/pending.hbs"), "utf8");
const pendingTemplate = handlebars.compile(pendingEmailTemplateSource);

const restaurantEmailTemplateSource = fs.readFileSync(path.join(__dirname, "./../views/newbooking.hbs"), "utf8");
const restaurantTemplate = handlebars.compile(restaurantEmailTemplateSource);

const cancelEmailTemplateSource = fs.readFileSync(path.join(__dirname, "./../views/cancel.hbs"), "utf8");
const cancelTemplate = handlebars.compile(cancelEmailTemplateSource);

const cancelRestaurantEmailTemplateSource = fs.readFileSync(path.join(__dirname, "./../views/rembooking.hbs"), "utf8");
const cancelRestaurantTemplate = handlebars.compile(cancelRestaurantEmailTemplateSource);

const restaurantConfirmEmailTemplateSource = fs.readFileSync(path.join(__dirname, "./../views/pendingconfirmed.hbs"), "utf8");
const restaurantConfirmTemplate = handlebars.compile(restaurantConfirmEmailTemplateSource);

const restaurantCancelEmailTemplateSource = fs.readFileSync(path.join(__dirname, "./../views/pendingcanceled.hbs"), "utf8");
const restaurantCancelTemplate = handlebars.compile(restaurantCancelEmailTemplateSource);

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
let oauth2Client = new google.auth.OAuth2(
    '504181834497-omrl5mnes3qmvvu39hu5v404lemlfq1c.apps.googleusercontent.com',
    "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",
    "postmessage" // you use 'postmessage' when the code is retrieved from a frontend (couldn't find why online)
);

/**
 * ------------------------ ENDPOINTS (from db) ---------------------------------
 */

/**
 * FETCH CUSTOMIZATION SETTINGS
 * Fetches data for customize page based on the id
 */
recordRoutes.route("/customize/:restaurantId").get(function (request, response) {
    let db_connect = dbo.getDb(); // connect to db
    let myQuery = {restaurantId: request.params.restaurantId}; // query in db
    db_connect
        .collection("customize")
        .findOne(myQuery, function (err, result) { // returns the first tuple matching the query in the selected collection
            if (err) {
                console.log("Error in FETCH CUSTOMIZATION: " + err)
                logError(err, "Restaurant " + request.params.restaurantId + " failed fetching customization from DB")
            } else {
                if (result)
                    logEvent("Restaurant " + request.params.restaurantId + " fetched customization from DB")
                else
                    logEvent("Restaurant " + request.params.restaurantId + " fetched nothing from customization")
            }
            response.json(result);
        });
});

/**
 * FETCH ACTIVITIES
 * Fetches data for customize page based on the id
 */
recordRoutes.route("/activities/:restaurantId").get(function (request, response) {
    let db_connect = dbo.getDb();
    let myQuery = {
        restaurantId: request.params.restaurantId
    };
    db_connect
        .collection("activities")
        .findOne(myQuery, function (err, result) {
            if (err) {
                console.log("Error in FETCH ACTIVITIES: " + err)
                logError(err, "Restaurant " + request.params.restaurantId + " failed fetching activities from DB")
            } else {
                if (result)
                    logEvent("Restaurant " + request.params.restaurantId + " fetched activities from DB")
                else
                    logEvent("Restaurant " + request.params.restaurantId + " fetched nothing from activities")
            }
            response.json(result);
        });
});

/**
 * FETCH BOOKINGS
 * Fetches bookings regarding restaurant with id passed as parameter
 */
recordRoutes.route("/bookings/:restaurantId").get(function (request, response) {
    let db_connect = dbo.getDb();
    let myQuery = {restaurantId: request.params.restaurantId};
    db_connect
        .collection("booking") // <  rename collection to bookingS
        .findOne(myQuery, function (err, result) {
            if (err) {
                console.log("Error in FETCH BOOKINGS: " + err)
                logError(err, "Restaurant " + request.params.restaurantId + " failed fetching bookings from DB")
            } else {
                if (result)
                    logEvent("Restaurant " + request.params.restaurantId + " fetched bookings from DB")
                else
                    logEvent("Restaurant " + request.params.restaurantId + " fetched nothing from bookings")
            }
            response.json(result);
        });
});

/**
 * FETCH AUTHENTICATION
 * Fetches infos about restaurant
 */
recordRoutes.route("/authentication").post(async function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let email = request.body.email
    let password = request.body.password
    try {
        let users = await db_connect
            .collection("authentication")
            .find().toArray()
        let respMessage = {}
        users.forEach((user) => {
            let decrypted = JSON.parse(decrypt(user.credentials))
            if (decrypted.email === email) {
                if (decrypted.password === password) {
                    respMessage = {
                        restaurantId: user.restaurantId
                    }
                    logEvent("User " + email + " authenticated")
                }
            }
        })
        response.json(respMessage)
    } catch (err) {
        console.log("Error in FETCH CUSTOMIZATION: " + err)
        logError(err, "User " + email + " failed authentication")
    }
});

/**
 * FETCH AVAILABILITY INFO
 * Get booked seats given activity for specified day
 */
recordRoutes.route("/bookings/seats/:restaurantId/:day/:activity").get(async function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {
        restaurantId: request.params.restaurantId,
    };

    try {
        let bookingArray = await db_connect
            .collection("booking")
            .findOne(myQuery);
        let respMessage = {};
        let seats = 0;
        let day = new Date(request.params.day);
        let date = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
        let activity = request.params.activity;

        bookingArray.bookings.forEach((booking) => {
            if (booking.bookingDate === date && booking.bookingActivity === activity && booking.bookingStatus === 'confirmed') {
                seats += parseInt(booking.bookingGuests);
            }
        });
        respMessage = {bookedSeats: seats};
        logEvent("Fetched availability for restaurant: " + request.params.restaurantId)
        response.json(respMessage);
    } catch (err) {
        console.log("Error in FETCH AVAILABILITY INFO: " + err)
        logError(err, "Could not fetch availability for restaurant: " + request.params.restaurantId)
    }

});

/**
 * ------------------------ ENDPOINTS (to db) ---------------------------------
 */

/**
 * UPDATE CUSTOMIZE INFO
 */
recordRoutes.route("/customize/save_changes/:restaurantId").post(function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {restaurantId: request.params.restaurantId};
    let newValues = {
        $set: {
            additionalInfo: request.body.additionalInfo,
            primaryColor: request.body.primaryColor,
            secondaryColor: request.body.secondaryColor,
            logoPath: request.body.logoPath,
            socialNetworks: request.body.socialNetworks,
            restaurantName: request.body.restaurantName
        },
    };
    db_connect
        .collection("customize")
        .updateOne(myQuery, newValues, function (err, result) {
            if (err) {
                logError(err, "Could not update customization settings for restaurant: " + request.params.restaurantId)
                response.status(501)
                console.log("Error updating customize: " + err)
            } else {
                logEvent("Updated customization settings for restaurant: " + request.params.restaurantId)
                response.status(201)
                console.log("1 document updated");
                response.json(result);
            }
        });
});

/**
 * UPDATE ACTIVITIES
 */
recordRoutes.route("/activities/save_changes/:restaurantId").post(function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {restaurantId: request.params.restaurantId};
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
            if (err) {
                logError(err, "Could not update activities settings for restaurant: " + request.params.restaurantId)
                response.status(501)
                console.log("Error updating activities: " + err)
            } else {
                logEvent("Updated activities settings for restaurant: " + request.params.restaurantId)
                response.status(201)
                console.log("1 document updated");
                response.json(result);
            }
        });
});

/**
 * UPDATE BOOKINGS
 * Sets booking's new status when it gets changed by the user in the management page
 */
recordRoutes.route("/bookings/save_changes/:restaurantId/:bookingId").post(async function (request, response) {
    let db_connect = dbo.getDb("sdp_db");
    let newStatus = request.body.newStatus
    let bookingId = request.params.bookingId
    let restaurantId = request.params.restaurantId
    let myQuery = {
        restaurantId: restaurantId, 'bookings.id': bookingId
    };
    let newValues = {
        $set: {
            'bookings.$.bookingStatus': newStatus
        },
    };
    let restaurantBookings = await getRestaurantBookingsById(restaurantId, bookingId)
    let booking = getBookingById(restaurantBookings.bookings, bookingId)

    let addToCalendar = // add to calendar if the status goes to confirmed from pending
        booking.bookingStatus === 'pending'
        && newStatus === 'confirmed'

    let removeFromCalendar = //  remove from calendar if going to be canceled from confirmed
        booking.bookingStatus === 'confirmed'
        && newStatus === 'canceled'

    db_connect
        .collection("booking")
        .updateOne(myQuery, newValues, async function (err, result) {
            if (err) {
                logError(err, "Could not update booking " + bookingId + " status to " + newStatus)
                response.status(501)
                console.log("Error updating bookings: " + err)
            } else {
                if (addToCalendar)
                    await addBookingToCalendar(restaurantId, booking)
                else if (removeFromCalendar)
                    await removeBookingFromCalendar(restaurantId, booking.id)
                logEvent("Updated booking " + bookingId + " status to " + newStatus)
                response.status(201)
                console.log("1 document updated");
                response.json(result);
            }
        });

    // Change status of the booking in the spreadsheet

    await updateBookingInSpreadsheet(restaurantId, bookingId, newStatus)

    let restaurantObject = await getRestaurantInfo(restaurantId);
    let restaurantName = restaurantObject.restaurantName;
    let siteLink = restaurantObject.siteLink;
    let subject = "";
    let htmlToSend;
    if (newStatus === "confirmed") {
        subject = "Prenotazione accettata dal ristorante";
        htmlToSend = restaurantConfirmTemplate({
            id: booking.id,
            restaurantName: restaurantName,
            siteLink: siteLink,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            bookingGuests: booking.bookingGuests,
            bookingActivity: booking.bookingActivity,
            bookingStatus: booking.bookingStatus,
            guestName: booking.guestName,
            guestSurname: booking.guestSurname,
            guestEmail: booking.guestEmail,
            guestPhone: booking.guestPhone,
            guestAdditionalInfo: booking.guestAdditionalInfo,
        });
    } else if (newStatus === "canceled") {
        subject = "Prenotazione rifiutata dal ristorante";
        htmlToSend = restaurantCancelTemplate({
            id: booking.id,
            restaurantName: restaurantName,
            siteLink: siteLink,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            bookingGuests: booking.bookingGuests,
            bookingActivity: booking.bookingActivity,
            bookingStatus: booking.bookingStatus,
            guestName: booking.guestName,
            guestSurname: booking.guestSurname,
            guestEmail: booking.guestEmail,
            guestPhone: booking.guestPhone,
            guestAdditionalInfo: booking.guestAdditionalInfo,
        });
    }

    sendEmailToUser(booking.guestEmail, htmlToSend, subject);
});

/**
 * REGISTER NEW USER
 */
recordRoutes.route("/register").post(async (request, response) => {
    const users = await getUsers()
    let exists = existingEmail(users, request.body.email)
    if (!exists) {
        let credentials = {
            email: request.body.email,
            password: request.body.password
        }
        let newRestaurantId = uuid.v4()
        let encryptedCredentials = encrypt(JSON.stringify(credentials))
        let db_connect = dbo.getDb()
        let newUser = {
            restaurantId: newRestaurantId,
            credentials: encryptedCredentials
        }
        db_connect
            .collection("authentication")
            .insertOne(newUser, function (err, res) {
                if (err) {
                    console.log("Error REGISTER NEW USER: " + err)
                    logError(err, "Could not register new user with mail " + request.body.email)
                } else {
                    logEvent("Register new user with mail " + request.body.email)
                }
                response.json({
                    restaurantId: newRestaurantId
                });
            });
        setupUsersCollections(newRestaurantId)
    } else if (users.length) {
        response.json({})
    }
})

/**
 * ADD NEW BOOKING
 * Booking form query that adds a new booking in the db
 */
recordRoutes.route("/booking/add/:restaurantId").post(async function (request, response) {
    let db_connect = dbo.getDb();
    let myQuery = {
        restaurantId: request.params.restaurantId
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
        guestMarketing: request.body.guestMarketing
    }
    let newValues = {
        $push: {
            bookings: booking
        }
    };
    let restaurantEmail = await getRestaurantEmail(request.params.restaurantId);
    let restaurantObject = await getRestaurantInfo(request.params.restaurantId);
    let restaurantName = restaurantObject.restaurantName;
    let siteLink = restaurantObject.siteLink;
    let subject = "";
    let htmlToSend;
    if (booking.bookingStatus === 'confirmed') {
        await addBookingToCalendar(request.params.restaurantId, booking);
        subject = "Prenotazione confermata";
        htmlToSend = template({
            id: booking.id,
            restaurantName: restaurantName,
            siteLink: siteLink,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            bookingGuests: booking.bookingGuests,
            bookingActivity: booking.bookingActivity,
            bookingStatus: booking.bookingStatus,
            guestName: booking.guestName,
            guestSurname: booking.guestSurname,
            guestEmail: booking.guestEmail,
            guestPhone: booking.guestPhone,
            guestAdditionalInfo: booking.guestAdditionalInfo,
        });


    } else {
        subject = "Prenotazione presa in carico";
        htmlToSend = pendingTemplate({
            id: booking.id,
            restaurantName: restaurantName,
            siteLink: siteLink,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            bookingGuests: booking.bookingGuests,
            bookingActivity: booking.bookingActivity,
            bookingStatus: booking.bookingStatus,
            guestName: booking.guestName,
            guestSurname: booking.guestSurname,
            guestEmail: booking.guestEmail,
            guestPhone: booking.guestPhone,
            guestAdditionalInfo: booking.guestAdditionalInfo,
        });
    }

    await addBookingToSpreadsheet(request.params.restaurantId, booking)
    db_connect
        .collection("booking")
        .updateOne(myQuery, newValues, function (err, res) {
            if (err) {
                console.log("Error ADD NEW BOOKING (customer action): " + err)
                logError(err, "Could add new booking (customer action) to restaurant" + request.params.restaurantId)
            } else {
                logEvent("Added new booking (customer action) to restaurant" + request.params.restaurantId)
            }
            response.json(res);
        });

    const restaurantHtmlToSend = restaurantTemplate({
        id: booking.id,
        restaurantName: restaurantName,
        siteLink: siteLink,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        bookingGuests: booking.bookingGuests,
        bookingActivity: booking.bookingActivity,
        bookingStatus: booking.bookingStatus,
        guestName: booking.guestName,
        guestSurname: booking.guestSurname,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        guestAdditionalInfo: booking.guestAdditionalInfo,
    })

    // SEND EMAILS

    // to customer

    sendEmailToUser(request.body.guestEmail, htmlToSend, subject)

    // to restaurant

    subject = "Nuova prenotazione ricevuta";
    sendEmailToUser(restaurantEmail, restaurantHtmlToSend, subject)

});

/**
 * DELETE EXISTING BOOKING
 * Booking form query that deletes a booking from the db
 */
recordRoutes.route("/booking/update").post(async function (request, response) {
    let db_connect = dbo.getDb();
    let myQuery = {
        restaurantId: request.body.id, 'bookings.id': request.body.bookingId
    };

    let restaurantBookings = await getRestaurantBookingsById(request.body.id, request.body.bookingId);
    let booking = getBookingById(restaurantBookings.bookings, request.body.bookingId);
    let restaurantEmail = await getRestaurantEmail(request.body.id);
    let restaurantObject = await getRestaurantInfo(request.body.id);
    let restaurantName = restaurantObject.restaurantName;
    let siteLink = restaurantObject.siteLink;

    if (booking.bookingStatus !== 'canceled') {
        await removeBookingFromCalendar(request.body.id, request.body.bookingId);
        let newValues = {
            $set: {
                'bookings.$.bookingStatus': 'canceled'
            },
        };
        db_connect
            .collection("booking")
            .updateOne(myQuery, newValues, function (err, res) {
                if (err) {
                    console.log("Error DELETE EXISTING BOOKING (customer action): " + err)
                    logError(err, "Could not delete booking " + booking.id)
                } else {
                    logEvent("Deleted booking " + booking.id)
                }
                response.json(res);
            });
    } else {
        response.json({
            message: 'La prenotazione inserita è già cancellata'
        });
    }

    // Change status in spreadsheet

    await updateBookingInSpreadsheet(request.body.id, booking.id, 'canceled')

    // SEND EMAILS

    // to customer

    const cancelHtmlToSend = cancelTemplate({
        id: booking.id,
        restaurantName: restaurantName,
        siteLink: siteLink,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        bookingGuests: booking.bookingGuests,
        bookingActivity: booking.bookingActivity,
        bookingStatus: booking.bookingStatus,
        guestName: booking.guestName,
        guestSurname: booking.guestSurname,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        guestAdditionalInfo: booking.guestAdditionalInfo,
    });

    let subject = "Prenotazione cancellata"
    sendEmailToUser(booking.guestEmail, cancelHtmlToSend, subject);

    // to restaurant

    const restaurantCancelHtmlToSend = cancelRestaurantTemplate({
        id: booking.id,
        restaurantName: restaurantName,
        siteLink: siteLink,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        bookingGuests: booking.bookingGuests,
        bookingActivity: booking.bookingActivity,
        bookingStatus: booking.bookingStatus,
        guestName: booking.guestName,
        guestSurname: booking.guestSurname,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        guestAdditionalInfo: booking.guestAdditionalInfo,
    });

    subject = "Nuova prenotazione cancellata"
    sendEmailToUser(restaurantEmail, restaurantCancelHtmlToSend, subject)
});

/**
 * ------------------------ GOOGLE ENDPOINTS ----------------------------------------
 */

/**
 * LOGIN
 * Manages the user's tokens, storing them in an encrypted way. Returns to the client the user's info
 */
recordRoutes.route("/google/login").post(async (request, response) => {
    let {tokens} = await oauth2Client.getToken(request.body.code) //await oauth2Client.getToken(request.body.googleData);
    let restaurantId = request.body.restaurantId
    logEvent("Restaurant " + restaurantId + " logged in with google")

    if (tokens.refresh_token) {
        let userInfo = {}
        if (tokens.access_token) {
            userInfo = await axios
                .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {Authorization: `Bearer ${tokens.access_token}`},
                })
                .then(res => res.data)
            storeTokens(tokens, restaurantId)
            storeProfile(userInfo, restaurantId)
            let spreadsheetId = await initSpreadsheet('bookings', restaurantId)
            storeSpreadsheetId(spreadsheetId, restaurantId)
            response.send(JSON.stringify(userInfo))
        }
    }
})

/**
 * FETCH USER'S GOOGLE PROFILE OBJ
 * Fetches the user's Google profile in the App component
 */
recordRoutes.route("/profile/:restaurantId").get(async (request, response) => {
    let profile = await getProfile(request.params.restaurantId)
    if (profile)
        logEvent("Fetched Google profile for restaurant: " + request.params.restaurantId)
    else
        logEvent("No Google profile for restaurant: " + request.params.restaurantId)
    response.send(profile)
})

/**
 * LOGOUT
 * Handles google logout, deletes document in db and revokes access to applications
 * Revoking access to application is necessary so that at the next login the refresh token will be given again
 */
recordRoutes.route("/google/logout/:restaurantId").delete(async (request, response) => {
    // Revoke access to application
    let restaurantId = request.params.restaurantId
    await revokeAccessToApp(restaurantId)
    let db_connect = dbo.getDb();
    let myQuery = {
        restaurantId: restaurantId
    };
    // Delete user's google data in db (tokens, profile, spreadsheetId)
    db_connect
        .collection("google_data") //
        .deleteOne(myQuery, function (err, result) {
            if (err) {
                console.log("Error LOGOUT GOOGLE: " + err)
                logError(err, "Could not log out from google for restaurant: " + restaurantId)
            } else {
                logEvent("Logged out from google for restaurant " + restaurantId)
            }
            response.json(result)
        });
})

/**
 * --------------------------- UTILITY LIBRARY -----------------------------------------
 */

/**
 * GOOGLE
 */

/**
 * Stores the refresh token in the db in an encrypted format
 * @param tokens google oAuth2 tokens taken from login
 * @param restaurantId
 */
function storeTokens(tokens, restaurantId) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {
        restaurantId: restaurantId
    };
    // ENCRYPTION
    let encrypted = encrypt(JSON.stringify(tokens))
    let newValues = {
        $set: {
            tokens: encrypted
        },
    };
    db_connect
        .collection("google_data")
        .updateOne(myQuery, newValues, {upsert: true}, function (err, result) {
            if (err) {
                console.log("Error STORE TOKENS: " + err)
                logError(err, "Could not store google tokens for restaurant: " + restaurantId)
            } else {
                logEvent("Stored google tokens for restaurant " + restaurantId)
            }
            console.log("1 document updated " + result);
        });
}

/**
 * Gets tokens from db corresponding to the restaurantId passed as argument
 * @param restaurantId
 */
async function getTokens(restaurantId) {
    let db_connect = dbo.getDb();
    let myQuery = {
        restaurantId: restaurantId
    };
    let tokens = db_connect
        .collection("google_data")
        .findOne(myQuery)
        .then((result) => JSON.parse(decrypt(result.tokens)))
    if (tokens)
        logEvent("Got Google tokens for restaurant: " + restaurantId)
    else
        logEvent("No google tokens for restaurant: " + restaurantId)

    return tokens
}

/**
 * Stores google user's encrypted profile object
 * @param profile google user profile object
 * @param restaurantId
 */
function storeProfile(profile, restaurantId) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {restaurantId: restaurantId};

    // ENCRYPTION
    let encrypted = encrypt(JSON.stringify(profile))
    let newValues = {
        $set: {
            profile: encrypted
        },
    };
    db_connect
        .collection("google_data")
        .updateOne(myQuery, newValues, {upsert: true}, function (err, result) {
            if (err) {
                console.log("Error STORE PROFILE: " + err)
                logError(err, "Failed to store google profile for restaurant: " + restaurantId)
            } else {
                logEvent("Stored user's Google profile for restaurant: " + restaurantId)
            }
            // console.log("1 document updated " + result);
        });
}

/**
 * Gets google user's profile object from the db
 * @param restaurantId
 * @returns {Promise<*>}
 */
async function getProfile(restaurantId) {
    let db_connect = dbo.getDb();
    let myQuery = {
        restaurantId: restaurantId
    };
    let googleData = await db_connect
        .collection("google_data")
        .findOne(myQuery)
        .then((result) => result)
    if (googleData && googleData.profile) {
        logEvent("Got user's Google profile for restaurant: " + restaurantId)
        return JSON.parse(decrypt(googleData.profile))
    } else {
        logEvent("No user's Google profile for restaurant: " + restaurantId)
        return {}
    }

}

/**
 * Revokes app's access to user's Google APIs (used when the user logs out)
 * @param restaurantId
 * @returns {Promise<void>}
 */
async function revokeAccessToApp(restaurantId) {
    let tokens = await getTokens(restaurantId)
    let postData = "token=" + tokens.refresh_token;

    // Options for POST request to Google's OAuth 2.0 server to revoke a token
    let postOptions = {
        host: 'oauth2.googleapis.com', port: '443', path: '/revoke', method: 'POST', headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData)
        }
    };
    // Set up the request
    const postReq = https.request(postOptions, function (res) {
        res.setEncoding('utf8');
        res.on('data', d => {
            // console.log('Response: ' + d);
            logEvent("Revoked app's access to Google APIs for restaurant: " + restaurantId)
        });
    });

    postReq.on('error', error => {
        console.log("Error REVOKING GOOGLE ACCESS TO APP: " + error)
        logError(error, "Error revoking app's access to Google APIs for restaurant: " + restaurantId)
    });

    // Post the request with data
    postReq.write(postData);
    postReq.end();
}

/**
 * [GOOGLE CALENDAR] Converts our booking object into a correct Google Event object
 * @param booking
 * @param activityEndingTime
 * @returns {{summary: string, start: {dateTime: string, timeZone: string}, description: string, end: {dateTime: string, timeZone: string}, id}}
 */
function bookingToGoogleEvent(booking, activityEndingTime) {

    // starting date time in the Google format: yyyy-mm-ddThh:mm:ms+02:00
    const googleFormattedStart = booking.bookingDate + "T" + booking.bookingTime + ":00+02:00";

    let googleFormattedEnd
    if (booking.bookingTime < activityEndingTime) {
        googleFormattedEnd = booking.bookingDate + "T" + activityEndingTime + ":00+02:00";
    } else if (booking.bookingTime > activityEndingTime) { // if the ending time goes to the next day, the day has to be incremented by 1
        let startingDateObj = new Date(booking.bookingDate)
        startingDateObj.setDate(startingDateObj.getDate() + 1)
        let newEndingDate =
            startingDateObj.getFullYear() + "-" +
            (startingDateObj.getMonth() + 1) + "-" +
            startingDateObj.getDate()
        googleFormattedEnd = newEndingDate + "T" + activityEndingTime + ":00+02:00";
    }
    // parametrize the returned object with fields in booking
    return {
        id: booking.id,
        summary: booking.bookingActivity + ' per ' + booking.bookingGuests,
        description: booking.guestName + ' ' + booking.guestSurname +
            ' ha prenotato per ' + booking.bookingGuests +
            ' alle ' + booking.bookingTime +
            ' del ' + booking.bookingDate +
            '. I contatti di ' + booking.guestName +
            ' sono: ' + booking.guestPhone + ', ' + booking.guestEmail + '. ' +
            (booking.guestAdditionalInfo != null ? 'Il cliente ha lasciato un messaggio alla prenotazione: ' + booking.guestAdditionalInfo : ''),
        start: {
            dateTime: googleFormattedStart, timeZone: 'Europe/Rome',
        },
        end: {
            dateTime: googleFormattedEnd, timeZone: 'Europe/Rome',
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
    let activity = await getActivityData(restaurantId, booking.bookingActivity) //  get the activity of the booking to retrieve the ending time
    let bookingEvent = bookingToGoogleEvent(booking, activity.endingTime) // create google formatted request
    await calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        resource: bookingEvent,
    }, function (err, bookingEvent) {
        if (err) {
            logError(err, 'Failed event creation on Google calendar for restaurant: ' + restaurantId + " for the booking: " + booking.id)
            console.log('There was an error contacting the Calendar service: ' + err);
            console.log('The booking you were trying to add is: ' + bookingEvent);
        } else {
            logEvent('Event created on Google calendar for restaurant: ' + restaurantId + " for the booking: " + booking.id)
        }
    });
    // console.log('Event created ' + bookingEvent.id);
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
    console.log(bookingId)
    const res = await calendar.events.delete({
        auth: oauth2Client,
        calendarId: 'primary',
        eventId: bookingId,
    }, function (err, data) {
        if (err) {
            logError(err, 'Failed to remove event from Google calendar for restaurant: ' + restaurantId + " for the booking: " + bookingId)
            console.log('There was an error contacting the Calendar service: ' + err);
            console.log('The id of the booking you were trying to delete is: ' + bookingId);
        } else {
            logEvent('Event removed from Google calendar for restaurant: ' + restaurantId + " for the booking: " + bookingId)
        }
        console.log(data)
    });

}

/**
 * Converts a booking to the corresponding request to send to the Google spreadsheet api
 * @param booking
 * @param spreadsheetId
 * @param auth
 * @returns {{valueInputOption: string, resource: {values: (*|string)[][], range: string}, auth, insertDataOption: string, range: string, spreadsheetId}}
 */
function bookingToSpreadsheetRow(booking, spreadsheetId, auth) {
    return {
        // The ID of the spreadsheet to update.
        spreadsheetId: spreadsheetId,

        // The A1 notation of a range to search for a logical table of data.
        // Values are appended after the last row of the table.
        range: 'Foglio1!A1:L1',

        // How the input data should be interpreted.
        valueInputOption: 'USER_ENTERED',

        // How the input data should be inserted.
        insertDataOption: 'INSERT_ROWS',

        // Columns order => Id, name, surname, guests, activity, time, date, phone, email, additional info, status
        resource: {
            "range": "Foglio1!A1:L1",
            "values": [
                [
                    booking.id,
                    booking.guestName,
                    booking.guestSurname,
                    booking.bookingGuests,
                    booking.bookingActivity,
                    booking.bookingTime,
                    booking.bookingDate,
                    booking.guestPhone,
                    booking.guestEmail,
                    booking.guestAdditionalInfo,
                    booking.guestMarketing,
                    booking.bookingStatus
                ]
            ]
        },

        auth: auth,
    }
}

/**
 * Appends booking row to the user's Google Spreadsheet
 * @param restaurantId
 * @param booking
 * @returns {Promise<void>}
 */
async function addBookingToSpreadsheet(restaurantId, booking) {
    let tokens = await getTokens(restaurantId)
    oauth2Client.setCredentials(tokens);
    let spreadsheetId = await getSpreadsheetId(restaurantId)
    let request = bookingToSpreadsheetRow(booking, spreadsheetId, oauth2Client)
    const sheets = google.sheets('v4');
    try {
        const response = (await sheets.spreadsheets.values.append(request)).data;
        logEvent("Added booking " + booking.id + " to spreadsheet of restaurant: " + restaurantId)
        console.log(JSON.stringify(response, null, 2));
    } catch (err) {
        logError("Failed to add booking " + booking.id + " to spreadsheet of restaurant: " + restaurantId)
        console.log("Error adding booking to spreadsheet: " + err);
    }
}

/**
 * Updates status of a booking in the restaurant's spreadsheet given the bookingId
 * @param restaurantId
 * @param bookingId
 * @param newStatus
 * @returns {Promise<void>}
 */
async function updateBookingInSpreadsheet(restaurantId, bookingId, newStatus) {
    let tokens = await getTokens(restaurantId)
    oauth2Client.setCredentials(tokens);
    let spreadsheetId = await getSpreadsheetId(restaurantId)
    const sheets = google.sheets('v4');
    let request = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: spreadsheetId,

        // The A1 notation of the values to retrieve.
        range: 'Foglio1',

        auth: oauth2Client,
    };

    // get all the rows
    const response = (await sheets.spreadsheets.values.get(request)).data;

    //iterate over the rows and change status
    response.values.forEach((row) => {
        if (row.includes(bookingId)) { // if the row contains the booking id -> found the row to modify
            row[11] = newStatus // update the status
        }
    })

    // Clear the spreadsheet
    try {
        await sheets.spreadsheets.values.clear({
            spreadsheetId: spreadsheetId,
            range: 'Foglio1',
            auth: oauth2Client
        })

        // write all the rows again
        const res = await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: "Foglio1!A1:L1",
            auth: oauth2Client,
            valueInputOption: "USER_ENTERED",
            resource: {
                range: 'Foglio1!A1:L1',
                values: response.values
            }
        });
    } catch (err) {
        logError(err, "Error updating row in spreadsheet")
    }

}

/**
 * Inits a spreadsheet used to represent bookings. The initialized spreadsheet will have a header row
 * @param title of the spreadsheet
 * @param restaurantId
 * @returns {Promise<*>}
 */
async function initSpreadsheet(title, restaurantId) {
    let tokens = await getTokens(restaurantId)
    oauth2Client.setCredentials(tokens);

    const service = google.sheets({
        version: 'v4',
        auth: oauth2Client
    });
    // Columns order => Id, name, surname, guests, activity, time, date, phone, email, additional info, status
    const resource = {
        "properties": {
            "title": title
        },
        "sheets": [
            {
                "protectedRanges":
                    [
                        {
                            "range":
                                {
                                    "startColumnIndex": 0,
                                    "endColumnIndex": 10,
                                    "startRowIndex": 0,
                                    "endRowIndex": 0,
                                    'sheetId': 0
                                },
                            "description": "protected"
                        }
                    ],
                "data": [
                    {
                        "startRow": 0,
                        "startColumn": 0,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Id'
                                        },

                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 1,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Name'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 2,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Surname'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 3,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Guests'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 4,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Activity'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 5,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Time'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 6,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Date'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 7,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Phone'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 8,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Email'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 9,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Additional Info'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 10,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Marketing'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        "startRow": 0,
                        "startColumn": 11,
                        "rowData": [
                            {
                                "values": [
                                    {
                                        "userEnteredValue": {
                                            "stringValue": 'Status'
                                        }
                                    }
                                ]
                            },
                        ]
                    }
                ],
                "properties": {
                    "sheetId": 0
                }
            }
        ],
    };
    try {
        const spreadsheet = await service.spreadsheets.create({
            resource,
            fields: 'spreadsheetId',
        });
        console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
        logEvent("Initialized spreadsheet for restaurant: " + restaurantId)
        return await spreadsheet.data.spreadsheetId;
    } catch (err) {
        logError(err, "Failed to initilize spreadsheet for restaurant: " + restaurantId)
        console.log("Error init spreadsheet: " + err)
    }
}

/**
 * Stores the encrypted spreadsheetId in the db
 * @param spreadsheetId
 * @param restaurantId
 */
function storeSpreadsheetId(spreadsheetId, restaurantId) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {
        restaurantId: restaurantId
    };
    // ENCRYPTION
    let encrypted = encrypt(JSON.stringify(spreadsheetId))
    let newValues = {
        $set: {
            spreadsheetId: encrypted
        },
    };
    db_connect
        .collection("google_data")
        .updateOne(myQuery, newValues, {upsert: true}, function (err, result) {
            if (err) {
                console.log("Error storing the spreadsheetId in the db: " + err)
                logError(err, "Failed to store spreadsheet id for restaurant: " + restaurantId)
            } else {
                logEvent("Stored spreadsheet id for restaurant: " + restaurantId)
            }
            console.log("1 document updated " + result);
        });
}

/**
 * Gets spreadsheetId from db based on the given restaurantId
 * @param restaurantId
 * @returns {Promise<{}|any>} spreadsheet id
 */
async function getSpreadsheetId(restaurantId) {
    let db_connect = dbo.getDb();
    let myQuery = {
        restaurantId: restaurantId
    };
    let googleData = await db_connect
        .collection("google_data")
        .findOne(myQuery)
        .then((result) => result)
    if (googleData && googleData.spreadsheetId) {
        logEvent("Got spreadsheetId for restaurant: " + restaurantId)
        return JSON.parse(decrypt(googleData.spreadsheetId))
    } else {
        logEvent("No spreadsheetId for restaurant: " + restaurantId)
        return {}
    }
}

/**
 * Gets the restaurant's email from the google_data collection
 * @param restaurantId
 * @returns {Promise<*>}
 */
async function getRestaurantEmail(restaurantId) {
    let profile = await getProfile(restaurantId)
    return profile.email
}

/**
 * DB
 */

/**
 * Gets all the users from the db
 * @returns array of users
 */
async function getUsers() {
    let db_connect = dbo.getDb("sdp_db");
    return await db_connect
        .collection("authentication")
        .find().toArray()
}

/**
 * Checks if an email already exists among a user array
 * @param users array of users
 * @param email we want to check
 * @returns {boolean} true if the email already exists
 */
function existingEmail(users, email) {
    for (let i = 0; i < users.length; i++) {
        let decrypted = JSON.parse(decrypt(users[i].credentials))
        if (decrypted.email === email) {
            return true
        }
    }
    return false
}

/**
 * Initializes new restaurant's collections in db
 * @param restaurantId id of the new restaurant
 */
function setupUsersCollections(restaurantId) {
    // Create new customize document
    newCustomizeDocument(restaurantId)
    // Create new activities document
    newActivitiesDocument(restaurantId)
    // booking
    newBookingsDocument(restaurantId)
    logEvent("Initialized collections for restaurant: " + restaurantId)
}

/**
 * Initializes a new customize document in the customize collection
 * @param restaurantId
 */
function newCustomizeDocument(restaurantId) {
    let document = {
        restaurantId: restaurantId,
        additionalInfo: "",
        primaryColor: "",
        secondaryColor: "",
        logoPath: "",
        socialNetworks: "",
        restaurantName: ""
    }
    let db_connect = dbo.getDb()
    db_connect
        .collection("customize")
        .insertOne(document, function (err, res) {
            if (err) {
                console.log("Error creating new customization document in the db: " + err)
            }
        });
}

/**
 * Initializes a new activities document in the customize collection
 * @param restaurantId
 */
function newActivitiesDocument(restaurantId) {
    let document = {
        restaurantId: restaurantId,
        bookingForewarning: "",
        bookingThreshold: "",
        bookingOffset: "",
        activities: []
    }
    let db_connect = dbo.getDb()
    db_connect
        .collection("activities")
        .insertOne(document, function (err, res) {
            if (err) {
                console.log("Error creating new activities document in the db: " + err)
            }
        });
}

/**
 * Initializes a new bookings document in the customize collection
 * @param restaurantId
 */
function newBookingsDocument(restaurantId) {
    let document = {
        restaurantId: restaurantId,
        bookings: []
    }
    let db_connect = dbo.getDb()
    db_connect
        .collection("booking")
        .insertOne(document, function (err, res) {
            if (err) {
                console.log("Error creating new bookings document in the db: " + err)
            }
        });
}

/**
 * Gets a booking object from an array of bookings by giving the booking id
 * @param {array} bookings
 * @param {string} bookingId
 * @returns {*} booking objects corresponding to the id
 */
function getBookingById(bookings, bookingId) {
    return bookings.find(b => b.id === bookingId)
}

/**
 * Gets from the db the array of bookings of a restaurant
 * @param restaurantId
 * @param bookingId (useless?) used to localize the array of bookings that contains a booking with this id
 * @returns {Promise<*>}
 */
async function getRestaurantBookingsById(restaurantId, bookingId) {
    let db_connect = dbo.getDb("sdp_db");
    let myQuery = {
        restaurantId: restaurantId,
        'bookings.id': bookingId
    };
    return db_connect
        .collection('booking')
        .findOne(myQuery)
}

/**
 * Gets activity object from db based on the restaurant id and the activity name
 * @param restaurantId
 * @param activityName
 * @returns {Promise<void>}
 */
async function getActivityData(restaurantId, activityName) {
    let db_connect = dbo.getDb(); // connect to db
    let myQuery = {
        restaurantId: restaurantId
    }; // query in db
    let activitiesData = await db_connect
        .collection("activities")
        .findOne(myQuery)
    let activitiesArray = activitiesData.activities
    return activitiesArray.find(a => a.activityName === activityName)
}

/**
 * Given the restaurantId returns the restaurant info
 * @param restaurantId
 * @returns {Promise<*>}
 */
async function getRestaurantInfo(restaurantId) {
    let db_connect = dbo.getDb();
    let myQuery = {
        restaurantId: restaurantId
    };
    return await db_connect
        .collection("customize")
        .findOne(myQuery)
}

/**
 * EMAIL
 */

/**
 * Sends email to user using nodemailer
 * @param receiverEmail
 * @param htmlToSend
 * @param emailSubject
 */
function sendEmailToUser(receiverEmail, htmlToSend, emailSubject) {
    const mailData = {
        from: "booking@kobold.studio",  // sender address
        to: receiverEmail,   // list of receivers
        subject: emailSubject,
        html: htmlToSend.toString()
    };

    transporter.sendMail(mailData, function (err, info) {
        if (err) {
            console.log("Error SENDING MAIL TO USER: " + err)
            logError(err, "Failed to send mail to user: " + receiverEmail)
        } else {
            logEvent("Sent email to user: " + receiverEmail)
            console.log(info);
        }
    });
}

/**
 * Logs error in the log file
 * @param error error object
 * @param info additional info as string
 */
function logError(error, info) {
    let currentDate = new Date();
    let dateAsString = currentDate.getDate() + "/"
        + (currentDate.getMonth() + 1) + "/"
        + currentDate.getFullYear() + " @ "
        + currentDate.getHours() + ":"
        + currentDate.getMinutes() + ":"
        + currentDate.getSeconds();

    let logRow =
        "TIMESTAMP: " + dateAsString + "\n" +
        "ERROR: " + error.name + "\n" +
        "MESSAGE: " + error.message + "\n" +
        "INFO: " + info +
        "\n\n"

    fs.open("log.txt", 'a', (err, fd) => {
        if (err) console.log(err);
        try {
            fs.appendFile("log.txt", logRow, 'utf-8', (err) => {
                if (err) {
                    console.log(err)
                }
            })
        } catch (err) {
            console.log(err);
        }
    });
}

/**
 * Logs successful events in the log file
 * @param event
 */
function logEvent(event) {
    let currentDate = new Date();
    let dateAsString = currentDate.getDate() + "/"
        + (currentDate.getMonth() + 1) + "/"
        + currentDate.getFullYear() + " @ "
        + currentDate.getHours() + ":"
        + currentDate.getMinutes() + ":"
        + currentDate.getSeconds();

    let logRow =
        "TIMESTAMP: " + dateAsString + "\n" +
        "EVENT: " + event +
        "\n\n"

    fs.open("log.txt", 'a', (err, fd) => {
        if (err) console.log(err);
        try {
            fs.appendFile("log.txt", logRow, 'utf-8', (err) => {
                if (err) {
                    console.log(err)
                }
            })
        } catch (err) {
            console.log(err);
        }
    });
}

module.exports = recordRoutes;