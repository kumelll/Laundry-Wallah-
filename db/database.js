// JSON file database - no native dependencies, works on all platforms
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let DATA_FILE = path.join(__dirname, 'data.json');
if (process.env.DATA_FILE) {
  DATA_FILE = process.env.DATA_FILE;
}

let data = { users: [], services: [], orders: [] };

function load() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    data = JSON.parse(raw);
  } catch (e) {
    data = { users: [], services: [], orders: [] };
  }
}

function save() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log(`DB saved to ${DATA_FILE}`);
  } catch (err) {
    console.error(`DB save failed: ${err.message}`);
  }
}

function init() {
  load();
  if (data.services.length === 0) {
    data.services = [
      { id: 1, name: 'Shirt/T-shirt', price_per_item: 30, category: 'clothes' },
      { id: 2, name: 'Jeans/Trousers', price_per_item: 50, category: 'clothes' },
      { id: 3, name: 'Bedsheet Single', price_per_item: 80, category: 'bedding' },
      { id: 4, name: 'Bedsheet Double', price_per_item: 120, category: 'bedding' },
      { id: 5, name: 'Towel', price_per_item: 40, category: 'bedding' },
      { id: 6, name: 'Saree/Delicate', price_per_item: 100, category: 'delicate' },
      { id: 7, name: 'Jacket/Coat', price_per_item: 80, category: 'clothes' }
    ];
    save();
    console.log('Services seeded.');
  }
  const adminEmail = 'admin@laundrywallah.com';
  if (!data.users.find(u => u.email === adminEmail)) {
    const hash = bcrypt.hashSync('admin123', 10);
    data.users.push({
      id: data.users.length ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
      email: adminEmail,
      password_hash: hash,
      name: 'Admin',
      phone: '',
      address: '',
      role: 'admin',
      created_at: new Date().toISOString()
    });
    save();
    console.log('Admin user: admin@laundrywallah.com / admin123');
  }
}

function nextId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}

const db = {
  init,

  getUserByEmail(email, role) {
    return data.users.find(u => u.email === email && (!role || u.role === role));
  },

  createUser(user) {
    const id = nextId(data.users);
    data.users.push({ ...user, id, created_at: new Date().toISOString() });
    save();
    return data.users.find(u => u.id === id);
  },

  getServices() {
    return data.services;
  },

  getServiceById(id) {
    return data.services.find(s => s.id === parseInt(id));
  },

  createOrder(order) {
    const id = nextId(data.orders);
    const row = { ...order, id, status: 'pending', created_at: new Date().toISOString() };
    data.orders.push(row);
    save();
    return row;
  },

  getOrdersByUserId(userId) {
    return data.orders.filter(o => o.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getOrderById(id, userId) {
    const o = data.orders.find(x => x.id === parseInt(id));
    if (!o || (userId !== undefined && o.user_id !== userId)) return null;
    return o;
  },

  getAllOrders() {
    return data.orders.map(o => {
      const u = data.users.find(x => x.id === o.user_id);
      return { ...o, user_name: u ? u.name : '', user_email: u ? u.email : '' };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  updateOrderStatus(id, status) {
    const intId = parseInt(String(id));
    const o = data.orders.find(x => x.id === intId);
    if (!o) {
      console.log(`Order ${intId} not found`);
      return null;
    }
    console.log(`Updating order ${intId} to status ${status}`);
    o.status = status;
    save();
    return o;
  },

  getStats() {
    const orders = data.orders;
    return {
      total: orders.length,
      pending: orders.filter(o => ['pending', 'pickup_scheduled'].includes(o.status)).length,
      inProgress: orders.filter(o => ['clothes_picked_up', 'washing_completed'].includes(o.status)).length,
      delivered: orders.filter(o => o.status === 'delivered').length
    };
  }
};

module.exports = db;
