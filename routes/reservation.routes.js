const router = require("express").Router();

const mongoose = require("mongoose");

const Reservation = require("../models/Reservation.model");
const Activity = require("../models/Activity.model");
const User = require("../models/User.model");

// POST /api/reservation - Create a new reservation
router.post("/reservations", (req, res, next) => {
	/// Activity we are going to take it from the props
	const { user, activity, numberOfPeople, price } = req.body;

	const newReservation = {
		user,
		activity,
		totalPrice: price * numberOfPeople,
		numberOfPeople,
	};

	Reservation.create(newReservation)
		.then((response) => res.status(201).json(response))
		.catch((err) => {
			console.log("Error creating new reservation", err);
			res.status(500).json({
				message: "Error creating a new reservation",
				error: err,
			});
		});
});

// GET /api/reservations -  Retrieves all of the reservations
router.get("/reservations", (req, res, next) => {
	Reservation.find()
		.populate("user")
		.populate("activity")
		.then((reservationsArr) => res.json(reservationsArr))
		.catch((err) => {
			console.log("Error getting list of reservations", err);
			res.status(500).json({
				message: "Error getting list of reservations",
				error: err,
			});
		});
});

//  GET /api/reservations/:reservationId  -  Get details of a specific reservation by id
router.get("/reservations/:reservationId", (req, res, next) => {
	const { reservationId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(reservationId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	Reservation.findById(reservationId)
		.populate("user")
		.populate("activity")
		.then((reservation) => res.json(reservation))
		.catch((err) => {
			console.log("Error getting details of an reservation", err);
			res.status(500).json({
				message: "Error getting details of an reservation",
				error: err,
			});
		});
});

// PUT /api/reservations/:reservationId  -  Updates a specific reservation by id
router.put("/reservations/:reservationId", (req, res, next) => {
	const { reservationId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(reservationId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	const { numberOfPeople, price } = req.body;

	const updatedReservation = {
		numberOfPeople,
		totalPrice: price * numberOfPeople,
	};

	Reservation.findByIdAndUpdate(reservationId, updatedReservation, {
		new: true,
	})
		.then((updatedReservation) => res.json(updatedReservation))
		.catch((err) => {
			console.log("Error updating activity", err);
			res.status(500).json({
				message: "Error updating activity",
				error: err,
			});
		});
});

// DELETE /api/reservations/:reservationId  -  Deletes a specific reservation by id
router.delete("/reservations/:reservationId", (req, res, next) => {
	const { reservationId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(reservationId)) {
		res.status(400).json({ message: "Specified id is not valid" });
		return;
	}

	Reservation.findByIdAndRemove(reservationId)
		// .then(deletedActivity => {
		//     return Task.deleteMany({ _id: { $in: deletedActivity.tasks } }); // delete all tasks assigned to that project
		// })
		.then(() =>
			res.json({
				message: `Reservation with id ${reservationId} was removed successfully.`,
			})
		)
		.catch((err) => {
			console.log("error deleting reservation", err);
			res.status(500).json({
				message: "error deleting reservation",
				error: err,
			});
		});
});

module.exports = router;
