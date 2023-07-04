const router = require("express").Router();

const mongoose = require("mongoose");

const Activity = require("../models/Activity.model");
const Reservation = require("../models/Reservation.model");

const fileUploader = require("../config/cloudinary.config");

const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
	// console.log("file is: ", req.file)

	if (!req.file) {
		next(new Error("No file uploaded!"));
		return;
	}

	// Get the URL of the uploaded file and send it as a response.
	// 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

	res.json({ fileUrl: req.file.path });
});

// POST /api/activities - Create a new activity
router.post("/activities", isAuthenticated, (req, res, next) => {
	let { name, description, duration, images, available, date, price, maxParticipants } =
		req.body;

	const newActivity = {
		name,
		description,
		duration,
		images,
		available,
		date,
		price,
		maxParticipants,
		user: req.payload._id,
	};

	Activity.create(newActivity)
		.then((response) => {
			res.status(201).json(response);
		})
		.catch((err) => {
			console.log("Error creating new activity", err);
			res.status(500).json({
				message: "Error creating a new activity",
				error: err,
			});
		});
});

// GET /api/activities -  Retrieves all of the activities
router.get("/activities", (req, res, next) => {
	Activity.find()
		.populate("user", "-password")
		.then((activitiesArr) => res.json(activitiesArr))
		.catch((err) => {
			console.log("Error getting list of activities", err);
			res.status(500).json({
				message: "Error getting list of activities",
				error: err,
			});
		});
});

//  GET /api/activities/:activityId  -  Get details of a specific activity by id
router.get("/activities/:activityId", (req, res, next) => {
	const { activityId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(activityId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	Activity.findById(activityId)
		.populate("user", "-password")
		.then((activity) => res.json(activity))
		.catch((err) => {
			console.log("Error getting details of an activity", err);
			res.status(500).json({
				message: "Error getting details of an activity",
				error: err,
			});
		});
});

// PUT /api/activities/:activityId  -  Updates a specific activity by id
router.put("/activities/:activityId", isAuthenticated, (req, res, next) => {
	const { activityId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(activityId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	let { name, description, duration, images, available, date, price, maxParticipants } =
		req.body;

	const updatedActivity = {
		name,
		description,
		duration,
		images,
		available,
		date,
		price,
		maxParticipants
	};

	Activity.findByIdAndUpdate(activityId, updatedActivity, { new: true })
		.then((updatedActivity) => res.json(updatedActivity))
		.catch((err) => {
			console.log("Error updating activity", err);
			res.status(500).json({
				message: "Error updating activity",
				error: err,
			});
		});
});

// DELETE /api/activities/:activityId  -  Deletes a specific activity by id
router.delete("/activities/:activityId", isAuthenticated, (req, res, next) => {
	const { activityId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(activityId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	Activity.findByIdAndRemove(activityId)
		.then((deletedActivity) => {
			return Reservation.deleteMany({ activity: activityId });
		})
		.then(() =>
			res.json({
				message: `Activity with id ${activityId} and related reservations were removed successfully.`,
			})
		)
		.catch((err) => {
			console.log("error deleting activity", err);
			res.status(500).json({
				message: "error deleting activity",
				error: err,
			});
		});
});

module.exports = router;
