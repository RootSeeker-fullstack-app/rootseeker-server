const router = require("express").Router();

const mongoose = require("mongoose");

const Activity = require("../models/Activity.model");

// POST /api/activities - Create a new activity
router.post("/activities", (req, res, next) => {
	const { name, description, duration, images, available, date, price, user } =
		req.body;

	const newProject = {
		name,
		description,
		duration,
		images,
		available,
		date,
		price,
		user,
	};

	Activity.create(newProject)
		.then((response) => res.status(201).json(response))
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
		.populate("user")
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
		.populate("user")
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
router.put("/activities/:activityId", (req, res, next) => {
	const { activityId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(activityId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	const { name, description, duration, images, available, date, price } =
		req.body;

	const updatedActivity = {
		name,
		description,
		duration,
		images,
		available,
		date,
		price,
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
router.delete("/activities/:activityId", (req, res, next) => {
	const { activityId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(activityId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	Activity.findByIdAndRemove(activityId)
		// .then(deletedActivity => {
		//     return Task.deleteMany({ _id: { $in: deletedActivity.tasks } }); // delete all tasks assigned to that project
		// })
		.then(() =>
			res.json({
				message: `Activity with id ${activityId} was removed successfully.`,
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
