import mongoose from "mongoose";

const chatbotSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  headerColor: {
    type: String,
    default: "#334758"
  },
  backgroundColor: {
    type: String,
    default: "#FFFFFF"
  },
  welcomeMessages: [{
    type: String
  }],
  missedChatTimer: {
    minutes: {
      type: Number,
      default: 12
    },
    seconds: {
      type: Number,
      default: 0
    }
  },
  introductionForm: {
    enabled: {
      type: Boolean,
      default: true
    },
    nameField: {
      type: Boolean,
      default: true
    },
    phoneField: {
      type: Boolean,
      default: true
    },
    emailField: {
      type: Boolean,
      default: true
    },
    buttonText: {
      type: String,
      default: "Thank You!"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ChatbotSettings = mongoose.model("ChatbotSettings", chatbotSettingsSchema);
export default ChatbotSettings;