const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("sdp_db");
    db_connect
        .collection("booking")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect
        .collection("booking")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

/**
 * Fetches data for customize page based on the id
 */
recordRoutes.route("/customize/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect
        .collection("restaurant_info")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

/**
 * Fetches data for activities in the activities page (to fill the activity table)
 */
recordRoutes.route("/activities/").get(function (req, res) {
    let db_connect = dbo.getDb("sdp_db");
    db_connect
        .collection("activities")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

/**
* Fetches data for customize page based on the id
*/
recordRoutes.route("/activities/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { restaurantId: req.params.id };
    db_connect
        .collection("activities")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
    };
    db_connect.collection("records").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            re: req.body.name,
            position: req.body.position,
            level: req.body.level,
        },
    };
    db_connect
        .collection("records")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

/**
 * Updates restaurant_info by id if the id already exixsts in the db, creates a new record if the id doesn't exist
 */

recordRoutes.route("/customize/save_changes/:id").post(function (req, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            additionalInfo: req.body.additionalInfo,
            primaryColor: req.body.primaryColor,
            secondaryColor: req.body.secondaryColor,
            logoPath: req.body.restaurantLogo,
            socialNetworks: req.body.socialNetworks,
            bookingForewarning: "",
            bookingOffest: "",
            bookingTheshold: {
                $numberInt: ""
            },
            restaurantName: req.body.restaurantName
        },
    };
    db_connect
        .collection("restaurant_info")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

recordRoutes.route("/activities/save_changes/:id").post(function (req, response) {
    let db_connect = dbo.getDb("sdp_db");
    let myquery = { restaurantId: req.params.id };
    let newvalues = {
        $set: {
            bookingForewarning: req.body.bookingForewarning,
            bookingThreshold: req.body.bookingThreshold,
            bookingOffset: req.body.bookingOffset,
            activities: req.body.activities
        },
    };
    db_connect
        .collection("activities")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});

module.exports = recordRoutes;

