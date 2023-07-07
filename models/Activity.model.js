const { Schema, model } = require("mongoose");

const CoordinateSchema = new Schema({
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
});

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
    images: [
      {
        type: String,
      },
    ],
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
    maxParticipants: {
      type: Number,
      min: 1,
      required: [
        true,
        "Please provide a maximum of participants for the activity",
      ],
    },
    category: {
      type: String,
      enum: ["Land", "Water", "Sky", "Cultural"],
      default: "Land",
    },
    coordinates: {
      type: [CoordinateSchema], // Array of embedded documents
      // required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Activity = model("Activity", ActivitySchema);

module.exports = Activity;
