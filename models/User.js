import mongoose from "mongoose";
import { userSchema } from "./schemas/userSchema.js";
import { userMethods, userVirtuals, userMiddleware } from "./methods/userMethods.js";

userSchema.methods = userMethods;
userVirtuals(userSchema);
userMiddleware(userSchema);

const User = mongoose.model("User", userSchema);
export default User;
