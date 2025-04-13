export const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtual: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
};