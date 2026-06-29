const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uri = "mongodb+srv://masoompersonal1_db_user:princelucky@cluster0.6znzyew.mongodb.net/portfolio?appName=Cluster0";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });
const Admin = mongoose.model("Admin", adminSchema);

async function checkAdmin() {
  await mongoose.connect(uri);
  const admins = await Admin.find({});
  console.log("Current Admins in DB:", admins);
  
  if (admins.length === 0) {
    console.log("No admins found, creating secure fallback admin");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("laxman", salt);
    const newAdmin = new Admin({ username: "laxman", passwordHash });
    await newAdmin.save();
    console.log("Secure fallback admin created.");
  }
  
  process.exit(0);
}
checkAdmin();
