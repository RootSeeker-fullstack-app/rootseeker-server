const { Schema, model } = require("mongoose");

const ActivitySchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a valid name for the activity"],
		},
		description: {
			type: String,
			trim: true,
			required: [true, "Please provide a description for the activity"],
		},
		duration: {
			type: Number,
			required: [true, "Please provide a duration for the activity"],
			min: 5,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		images: {
			type: String,
			default:
				"https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg",
		},
		available: {
			type: Boolean,
			default: true,
		},
		date: {
			type: Date,
			required: [true, "Please provide a date for the activity"],
		},
		price: {
			type: Number,
			min: 0,
			required: [true, "Please provide a price for the activity"],
		},
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
);

const Activity = model("Activity", ActivitySchema);

module.exports = Activity;
