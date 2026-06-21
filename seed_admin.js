const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://masoompersonal1_db_user:princelucky@cluster0.6znzyew.mongodb.net/portfolio?appName=Cluster0';

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Define Admin schema directly to avoid Next.js imports
    const AdminSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true }
    });
    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('laxman', salt);

    // Delete any existing admins to start fresh
    await Admin.deleteMany({});
    
    // Create the new admin
    const admin = new Admin({
      username: 'laxman',
      passwordHash: passwordHash
    });
    
    await admin.save();
    console.log('Successfully seeded admin user with username "laxman" and password "laxman"');

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
