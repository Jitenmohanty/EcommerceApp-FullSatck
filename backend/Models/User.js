import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: Buffer,
    required: true,
  },
  role: { type: String, required: true, default: "user" },
  addresses: {
    type: [Schema.Types.Mixed],
  },
  orders: { type: [Schema.Types.Mixed] },
  resetPasswordToken: {type: String, default:''},
  salt:Buffer,
});

const virtual = userSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const User = mongoose.model("User", userSchema);
