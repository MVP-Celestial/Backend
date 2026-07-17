import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    visibility: {
      type: String,
      enum: ["private", "shared"],
      default: "private",
    },
    summary: {
      type: String,
      default: "",
      maxlength: 500,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ user: 1, updatedAt: -1 });
chatSchema.index({ title: "text", summary: "text" });

const messageModel = mongoose.models.Chat || mongoose.model("Message", chatSchema);

export default messageModel;
