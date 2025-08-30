const mongoose = require('mongoose')

let ready = false

async function connectMongo() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('[DB] No MONGODB_URI provided. Running in in-memory mode.')
    ready = false
    return null
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    ready = true
    console.log('[DB] Connected to MongoDB')
    return conn
  } catch (err) {
    console.error('[DB] MongoDB connection failed. Falling back to in-memory store.', err?.message)
    ready = false
    return null
  }
}

module.exports = { connectMongo, get dbReady() { return ready }, mongoose }
