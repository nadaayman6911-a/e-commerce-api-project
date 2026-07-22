const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

module.exports = mongoose.model("Category", categorySchema);