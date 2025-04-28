import bcrypt from "bcrypt";

export const userMethods = {
  matchPassword: async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },
  
  toPublicJSON: function() {
    const obj = this.toJSON();
    delete obj.password;
    return obj;
  }
};

export const userVirtual = (schema) => {
  schema.virtual("fullName").get(function() {
    return `${this.firstName} ${this.lastName}`;
  });
};

export const userMiddleware = (schema) => {
  schema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
};