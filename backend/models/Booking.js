const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    roomName: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    guests: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    total: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema)
