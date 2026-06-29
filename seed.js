const mongoose = require("mongoose");
const uri = "mongodb+srv://masoompersonal1_db_user:princelucky@cluster0.6znzyew.mongodb.net/portfolio?appName=Cluster0";

const schema = new mongoose.Schema({}, { strict: false });
const PortfolioContent = mongoose.model("PortfolioContent", schema, "portfoliocontents");

async function seed() {
  await mongoose.connect(uri);
  const doc = await PortfolioContent.findOne();
  if (doc) {
    doc.hero.topSubheading = "AN AWARD-WINNING\nPHOTOGRAPHER WHOSE LENS\nTRANSFORMS MOMENTS INTO\nTIMELESS MASTERPIECES";
    doc.about.description = "DISTINGUISHED BY A MYRIAD OF\nACCOLADES AND INTERNATIONAL\nRECOGNITION, I STAND\nAS A LUMINARY IN THE REALM OF\nVISUAL STORYTELLING";
    doc.exhibitions.description = "The artist's ability to transcend\nboundaries and connect with a\nglobal audience is a testament to\nthe universal language of\nvisual storytelling";
    doc.markModified("hero");
    doc.markModified("about");
    doc.markModified("exhibitions");
    await doc.save();
    console.log("Seeded successfully");
  }
  process.exit(0);
}
seed();
