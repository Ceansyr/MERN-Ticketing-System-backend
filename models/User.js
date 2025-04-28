import mongoose from "mongoose";
import { userSchema } from "./schemas/userSchema.js";
import { userMethods, userVirtual, userMiddleware } from "./methods/userMethods.js";

userSchema.methods = userMethods;
userVirtual(userSchema);
userMiddleware(userSchema);

const User = mongoose.model("User", userSchema);
export default User;
