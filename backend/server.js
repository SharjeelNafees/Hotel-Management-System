const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ExcelJS = require('exceljs');
const dotenv = require('dotenv');
const { connectMongo, dbReady } = require('./db');
let BookingModel = null;
let CustomerModel = null;

// Ensure .env values override any existing environment variables
dotenv.config({ override: true });

const app = express();

// Basic security and middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const DEFAULT_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:5002',
  'http://localhost:5003',
  'http://localhost:5004',
  'http://localhost:5005',
];
const EXTRA_ORIGIN = process.env.CLIENT_ORIGIN;
const ALLOWED_ORIGINS = EXTRA_ORIGIN
  ? Array.from(new Set([...DEFAULT_ORIGINS, EXTRA_ORIGIN]))
  : DEFAULT_ORIGINS;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., curl, server-to-server) with no origin
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'hotel-nova-backend' });
});

// Example API route
app.get('/api/v1/info', (req, res) => {
  res.json({
    name: 'Hotel Nova API',
    version: '1.0.0',
    message: 'Welcome to Hotel Nova backend API',
  });
});

// In-memory Staff Store (replace with DB later)
const staffStore = [];
let nextId = 1;

// List staff
app.get('/api/v1/staff', (req, res) => {
  res.json(staffStore);
});

// Create staff
app.post('/api/v1/staff', (req, res) => {
  const { name, role, employeeId, phone, email } = req.body || {};
  if (!name || !role || !employeeId) {
    return res.status(400).json({ error: 'name, role, and employeeId are required' });
  }
  // Prevent duplicate employeeId
  if (staffStore.some(s => s.employeeId === employeeId)) {
    return res.status(409).json({ error: 'employeeId already exists' });
  }
  const staff = {
    id: String(nextId++),
    name,
    role,
    employeeId,
    phone: phone || '',
    email: email || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  staffStore.push(staff);
  res.status(201).json(staff);
});

// Update staff
app.put('/api/v1/staff/:id', (req, res) => {
  const { id } = req.params;
  const index = staffStore.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Staff not found' });
  const { name, role, employeeId, phone, email } = req.body || {};
  if (employeeId && staffStore.some(s => s.employeeId === employeeId && s.id !== id)) {
    return res.status(409).json({ error: 'employeeId already exists' });
  }
  const current = staffStore[index];
  const updated = {
    ...current,
    name: name ?? current.name,
    role: role ?? current.role,
    employeeId: employeeId ?? current.employeeId,
    phone: phone ?? current.phone,
    email: email ?? current.email,
    updatedAt: new Date().toISOString(),
  };
  staffStore[index] = updated;
  res.json(updated);
});

// Delete staff
app.delete('/api/v1/staff/:id', (req, res) => {
  const { id } = req.params;
  const index = staffStore.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Staff not found' });
  const [removed] = staffStore.splice(index, 1);
  res.json({ success: true, removed });
});

// In-memory Rooms and Bookings for demo
const rooms = [
  { id: '101', name: 'Deluxe King', capacity: 2, price: 199 },
  { id: '102', name: 'Deluxe Twin', capacity: 2, price: 189 },
  { id: '201', name: 'Family Suite', capacity: 4, price: 329 },
  { id: '301', name: 'Presidential Suite', capacity: 4, price: 899 },
];
const bookings = [];
let nextBookingId = 1;

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd; // simple overlap check
}

// Check availability
app.post('/api/v1/availability', async (req, res) => {
  try {
    const { checkin, checkout, guests, roomId } = req.body || {};
    const ci = checkin ? new Date(checkin) : null;
    const co = checkout ? new Date(checkout) : null;
    const g = Number(guests || 1);
    if (!ci || !co || isNaN(ci) || isNaN(co) || ci >= co) {
      return res.status(400).json({ error: 'Invalid dates' });
    }
    const candidateRooms = (roomId ? rooms.filter(r => r.id === String(roomId)) : rooms)
      .filter(r => r.capacity >= g);

    if (dbReady && BookingModel) {
      // Check conflicts from DB
      const availableRooms = [];
      for (const r of candidateRooms) {
        const conflict = await BookingModel.exists({
          roomId: r.id,
          $expr: { $lt: [ { $toDate: ci }, '$checkout' ] },
          checkin: { $lt: co },
        });
        if (!conflict) availableRooms.push(r);
      }
      return res.json({ available: availableRooms.length > 0, rooms: availableRooms });
    }

    // In-memory fallback
    const availableRooms = candidateRooms.filter(r => {
      const conflicts = bookings.filter(b => b.roomId === r.id && overlaps(ci, co, new Date(b.checkin), new Date(b.checkout)));
      return conflicts.length === 0;
    });
    return res.json({ available: availableRooms.length > 0, rooms: availableRooms });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Create booking
app.post('/api/v1/bookings', async (req, res) => {
  try {
    const { roomId, name, email, phone, checkin, checkout, guests } = req.body || {};
    const room = rooms.find(r => r.id === String(roomId));
    if (!room) return res.status(400).json({ error: 'Invalid roomId' });
    const ci = checkin ? new Date(checkin) : null;
    const co = checkout ? new Date(checkout) : null;
    const g = Number(guests || 1);
    if (!ci || !co || isNaN(ci) || isNaN(co) || ci >= co) {
      return res.status(400).json({ error: 'Invalid dates' });
    }
    if (g > room.capacity) return res.status(400).json({ error: 'Guests exceed room capacity' });

    if (dbReady && BookingModel) {
      const conflict = await BookingModel.exists({
        roomId: room.id,
        $expr: { $lt: [ { $toDate: ci }, '$checkout' ] },
        checkin: { $lt: co },
      });
      if (conflict) return res.status(409).json({ error: 'Room not available for selected dates' });
      const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
      const total = nights * room.price;
      const created = await BookingModel.create({
        roomId: room.id,
        roomName: room.name,
        pricePerNight: room.price,
        checkin: ci,
        checkout: co,
        guests: g,
        name: name || '',
        email: email || '',
        phone: phone || '',
        total,
      });
      // Upsert customer in DB
      const key = (email || phone || '').trim();
      if (key && CustomerModel) {
        const filter = email ? { email } : { phone };
        await CustomerModel.findOneAndUpdate(
          filter,
          { $setOnInsert: { name: name || '' }, $set: { email: email || '', phone: phone || '' } },
          { upsert: true, new: true }
        );
      }
      return res.status(201).json({ confirmation: String(created._id), booking: {
        id: String(created._id),
        roomId: created.roomId,
        roomName: created.roomName,
        pricePerNight: created.pricePerNight,
        checkin: created.checkin,
        checkout: created.checkout,
        guests: created.guests,
        name: created.name,
        email: created.email,
        phone: created.phone,
        total: created.total,
        createdAt: created.createdAt,
      }});
    }

    // In-memory fallback
    const conflict = bookings.some(b => b.roomId === room.id && overlaps(ci, co, new Date(b.checkin), new Date(b.checkout)));
    if (conflict) return res.status(409).json({ error: 'Room not available for selected dates' });
    const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
    const total = nights * room.price;
    const booking = {
      id: String(nextBookingId++),
      roomId: room.id,
      roomName: room.name,
      pricePerNight: room.price,
      checkin: ci.toISOString(),
      checkout: co.toISOString(),
      guests: g,
      name: name || '',
      email: email || '',
      phone: phone || '',
      total,
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    const key = (email || phone || '').toLowerCase();
    if (key) {
      const existingIdx = customerStore.findIndex(c => (c.email || c.phone).toLowerCase() === key);
      if (existingIdx >= 0) {
        customerStore[existingIdx] = {
          ...customerStore[existingIdx],
          name: name || customerStore[existingIdx].name,
          email: email || customerStore[existingIdx].email,
          phone: phone || customerStore[existingIdx].phone,
          note: customerStore[existingIdx].note,
          updatedAt: new Date().toISOString(),
        };
      } else {
        customerStore.push({
          id: String(nextCustomerId++),
          name: name || '',
          email: email || '',
          phone: phone || '',
          note: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
    return res.status(201).json({ confirmation: booking.id, booking });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
});

// List bookings
app.get('/api/v1/bookings', async (req, res) => {
  try {
    if (dbReady && BookingModel) {
      const list = await BookingModel.find().sort({ createdAt: -1 }).lean();
      return res.json(list.map(b => ({
        id: String(b._id),
        roomId: b.roomId,
        roomName: b.roomName,
        pricePerNight: b.pricePerNight,
        checkin: b.checkin,
        checkout: b.checkout,
        guests: b.guests,
        name: b.name,
        email: b.email,
        phone: b.phone,
        total: b.total,
        createdAt: b.createdAt,
      })));
    }
    return res.json(bookings);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list bookings' });
  }
});

// In-memory Service Requests (housekeeping/maintenance)
const requestStore = [];
let nextRequestId = 1;

// Create request
app.post('/api/v1/requests', (req, res) => {
  const { type, room, note, preferredTime, source } = req.body || {};
  if (!type || !room) return res.status(400).json({ error: 'type and room are required' });
  const entry = {
    id: String(nextRequestId++),
    type, // 'housekeeping' | 'maintenance'
    room: String(room),
    note: note || '',
    preferredTime: preferredTime || '',
    status: 'pending',
    source: source || 'chatbot',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  requestStore.push(entry);
  res.status(201).json(entry);
});

// List requests (for admin)
app.get('/api/v1/requests', (req, res) => {
  res.json(requestStore);
});

// Update request status
app.put('/api/v1/requests/:id', (req, res) => {
  const { id } = req.params;
  const idx = requestStore.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Request not found' });
  const { status, note } = req.body || {};
  const current = requestStore[idx];
  requestStore[idx] = {
    ...current,
    status: status || current.status,
    note: note ?? current.note,
    updatedAt: new Date().toISOString(),
  };
  res.json(requestStore[idx]);
});

// Simple Admin Auth (username/password from env)
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password123';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-static-token';

app.post('/api/v1/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ token: ADMIN_TOKEN, user: { username } });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// In-memory Customers Store (simple placeholder)
const customerStore = [];
let nextCustomerId = 1;

// List customers
app.get('/api/v1/customers', async (req, res) => {
  try {
    if (dbReady && CustomerModel) {
      const list = await CustomerModel.find().sort({ createdAt: -1 }).lean();
      return res.json(list.map(c => ({
        id: String(c._id),
        name: c.name,
        email: c.email,
        phone: c.phone,
        note: c.note,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })));
    }
    return res.json(customerStore);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list customers' });
  }
});

// Create customer
app.post('/api/v1/customers', async (req, res) => {
  try {
    const { name, email, phone, note } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name is required' });
    if (dbReady && CustomerModel) {
      const created = await CustomerModel.create({ name, email: email || '', phone: phone || '', note: note || '' });
      return res.status(201).json({
        id: String(created._id), name: created.name, email: created.email, phone: created.phone, note: created.note,
        createdAt: created.createdAt, updatedAt: created.updatedAt,
      });
    }
    const customer = {
      id: String(nextCustomerId++),
      name,
      email: email || '',
      phone: phone || '',
      note: note || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    customerStore.push(customer);
    return res.status(201).json(customer);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update customer
app.put('/api/v1/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, note } = req.body || {};
    if (dbReady && CustomerModel) {
      const updated = await CustomerModel.findByIdAndUpdate(
        id,
        { $set: { name, email, phone, note } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Customer not found' });
      return res.json({
        id: String(updated._id), name: updated.name, email: updated.email, phone: updated.phone, note: updated.note,
        createdAt: updated.createdAt, updatedAt: updated.updatedAt,
      });
    }
    const idx = customerStore.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Customer not found' });
    const current = customerStore[idx];
    const updatedMem = {
      ...current,
      name: name ?? current.name,
      email: email ?? current.email,
      phone: phone ?? current.phone,
      note: note ?? current.note,
      updatedAt: new Date().toISOString(),
    };
    customerStore[idx] = updatedMem;
    return res.json(updatedMem);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
app.delete('/api/v1/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (dbReady && CustomerModel) {
      const removed = await CustomerModel.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ error: 'Customer not found' });
      return res.json({ success: true, removed: { id: String(removed._id) } });
    }
    const idx = customerStore.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Customer not found' });
    const [removed] = customerStore.splice(idx, 1);
    return res.json({ success: true, removed });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Helper to send workbook as response
async function sendWorkbook(res, workbook, filename) {
  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.send(Buffer.from(buffer));
}

// Export staff to Excel
app.get('/api/v1/staff/export', async (req, res) => {
  try {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Staff');
    ws.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Full Name', key: 'name', width: 30 },
      { header: 'Role', key: 'role', width: 20 },
      { header: 'Employee ID', key: 'employeeId', width: 20 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Created At', key: 'createdAt', width: 24 },
      { header: 'Updated At', key: 'updatedAt', width: 24 },
    ];
    // Header styling
    ws.getRow(1).font = { bold: true };
    staffStore.forEach(s => ws.addRow(s));
    await sendWorkbook(res, wb, `staff_${new Date().toISOString().slice(0,10)}.xlsx`);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to generate staff Excel' });
  }
});

// Export customers to Excel
app.get('/api/v1/customers/export', async (req, res) => {
  try {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Customers');
    ws.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Full Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Note', key: 'note', width: 40 },
      { header: 'Created At', key: 'createdAt', width: 24 },
      { header: 'Updated At', key: 'updatedAt', width: 24 },
    ];
    ws.getRow(1).font = { bold: true };
    if (dbReady && CustomerModel) {
      const list = await CustomerModel.find().lean();
      list.forEach(c => ws.addRow({
        id: String(c._id), name: c.name, email: c.email, phone: c.phone, note: c.note,
        createdAt: c.createdAt, updatedAt: c.updatedAt,
      }));
    } else {
      customerStore.forEach(c => ws.addRow(c));
    }
    await sendWorkbook(res, wb, `customers_${new Date().toISOString().slice(0,10)}.xlsx`);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to generate customers Excel' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

function startWithPort(port, retries = 2) {
  const server = http.createServer(app);

  const onError = (err) => {
    if (err && err.code === 'EADDRINUSE') {
      if (retries > 0) {
        const nextPort = port + 1;
        console.warn(`Port ${port} in use, retrying on ${nextPort}...`);
        // Cleanup listeners before retrying with a fresh server
        server.removeAllListeners('error');
        server.close?.();
        setTimeout(() => startWithPort(nextPort, retries - 1), 300);
      } else {
        console.error(`All retry ports are in use. Last attempted: ${port}.`);
        process.exit(1);
      }
    } else {
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  };

  server.on('error', onError);
  server.on('listening', () => {
    console.log(`Backend API listening on http://localhost:${port}`);
    console.log(`CORS allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
  });

  server.listen(port);
}

// Prefer .env PORT or API_PORT, default to 5003 for local dev
const BASE_PORT = Number(process.env.PORT || process.env.API_PORT) || 5003;
console.log(`Requested base port: ${BASE_PORT}`);

// Connect to MongoDB, then start server (fallback to in-memory if connection fails)
connectMongo()
  .then(() => {
    try {
      // Lazy-require models only after attempting connection
      BookingModel = require('./models/Booking');
      CustomerModel = require('./models/Customer');
    } catch (e) {
      console.warn('Models could not be loaded; staying in in-memory mode.', e?.message);
    }
  })
  .finally(() => startWithPort(BASE_PORT));
