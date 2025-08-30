const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    note: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)
