import mongoose from "mongoose";

const citationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      default: "",
    },
    snippet: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    citations: [citationSchema],
    model: {
      type: String,
      default: "gpt-4o-mini",
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ content: "text" });

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
