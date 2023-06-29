const { Schema, model } = require("mongoose");

const ReservationSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		activity: {
			type: Schema.Types.ObjectId,
			ref: "Activity",
		},
		totalPrice: {
			type: Number,
			min: 0,
		},
		numberOfPeople: {
			type: Number,
			min: 1,
			required: [
				true,
				"Please provide a number of participants for the activity",
			],
		},
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
);

const Reservation = model("Reservation", ReservationSchema);

module.exports = Reservation;
