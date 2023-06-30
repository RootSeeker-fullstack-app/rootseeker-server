const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Activity = require("../models/Activity.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Reservation = require("../models/Reservation.model");

// GET /api/users -  Retrieves all of the users
router.get("/users", (req, res, next) => {
	User.find()
		.then((users) => res.json(users))
		.catch((err) => {
			console.log("Error getting list of users", err);
			res.status(500).json({
				message: "Error getting list of users",
				error: err,
			});
		});
});

//  GET /api/users/:userId  -  Get details of a specific user by id
router.get("/users/:username", (req, res, next) => {
	const { username } = req.params;

	// if (!mongoose.Types.ObjectId.isValid(user)) {
	// 	res.status(400).json({ message: "Specified id is not valid" });
	// 	return;
	// }

	User.find({ username: username })
		.then((user) => res.json(user))
		.catch((err) => {
			console.log("Error getting details of an user", err);
			res.status(500).json({
				message: "Error getting details of an user",
				error: err,
			});
		});
});

// PUT /api/users/:userId  -  Updates a specific user by id
router.put("/users/:userId", isAuthenticated, (req, res, next) => {
	const { userId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(userId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	const { firstName, lastName, imgProfile } = req.body;

	const updatedUser = {
		firstName,
		lastName,
		imgProfile,
	};

	User.findByIdAndUpdate(userId, updatedUser, { new: true })
		.then((updatedUser) => res.json(updatedUser))
		.catch((err) => {
			console.log("Error updating user", err);
			res.status(500).json({
				message: "Error updating user",
				error: err,
			});
		});
});

// DELETE /api/users/:userId  -  Deletes a specific user by id
router.delete("/users/:userId", isAuthenticated, (req, res, next) => {
	const { userId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(userId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	User.findByIdAndRemove(userId)
		.then((deletedUser) => {
			return Activity.deleteMany({ user: userId });
		})
		.then(() => {
			return Reservation.deleteMany({ user: userId });
		})
		.then(() => {
			res.json({
				message: `User with id ${userId}, associated activities, and related reservations were removed successfully.`,
			});
		})
		.catch((err) => {
			console.log("Error deleting user, activities, and reservations", err);
			res.status(500).json({
				message: "Error deleting user, activities, and reservations",
				error: err,
			});
		});
});

module.exports = router;
