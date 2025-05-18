import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // crea createdAt y updatedAt automáticamente
  }
);

export default mongoose.model("Task", taskSchema);
