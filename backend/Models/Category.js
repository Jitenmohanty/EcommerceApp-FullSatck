import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
    label:{
        type:String,
        required:true,
        unique:true
    },
    value:{
        type:String,
        required:true,
        unique:true
    }
});

const virtual = CategorySchema.virtual("id");
virtual.get(function () {
  return this._id;
});
CategorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const Category = mongoose.model("Category", CategorySchema);
