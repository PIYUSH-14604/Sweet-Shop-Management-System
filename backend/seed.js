require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/SweetShop';

async function run(){
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding');

  const userSchema = new mongoose.Schema({ email: { type: String, unique: true }, password: String, role: String });
  const sweetSchema = new mongoose.Schema({ name: { type: String, unique: true }, category: String, price: Number, quantity: Number });
  const User = mongoose.model('UserSeed', userSchema, 'users');
  const Sweet = mongoose.model('SweetSeed', sweetSchema, 'sweets');

  const adminEmail = 'admin@example.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hash = await bcrypt.hash('pass123', 10);
    admin = await User.create({ email: adminEmail, password: hash, role: 'admin' });
    console.log('Created admin user:', adminEmail);
  } else {
    console.log('Admin user already exists:', adminEmail);
  }

  const sweets = [
    { name: 'Chocolate Truffle', category: 'Chocolate', price: 2.5, quantity: 50 },
    { name: 'Strawberry Jelly', category: 'Candy', price: 1.2, quantity: 100 },
    { name: 'Caramel Bite', category: 'Caramel', price: 1.5, quantity: 80 }
  ];

  for (const s of sweets) {
    const existing = await Sweet.findOne({ name: s.name });
    if (!existing) {
      await Sweet.create(s);
      console.log('Inserted sweet:', s.name);
    } else {
      console.log('Sweet exists:', s.name);
    }
  }

  await mongoose.disconnect();
  console.log('Seeding complete');
}

run().catch(err => { console.error('Seeding failed', err); process.exit(1); });
