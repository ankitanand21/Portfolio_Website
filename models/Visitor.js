const mongoose = require("mongoose");

/*
 * A single-document collection that just tracks a running count.
 * We always operate on the one document with _id: "counter".
 */
const visitorSchema = new mongoose.Schema({
  _id: { type: String, default: "counter" },
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model("Visitor", visitorSchema);
