import mongoose, { Schema, Document } from 'mongoose';

// --- AUTH SCHEMA ---
export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
}

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

// --- PORTFOLIO CONTENT SCHEMA ---
// We will store all text/media config in a single document to make fetching extremely fast and simple.

export interface IPortfolioContent extends Document {
  hero: {
    topSubheading: string;
    mainTitle: string;
    signature: string;
    signatureSubtext: string;
    mediaUrl: string;
    mediaPublicId: string;
    mobileMediaUrl: string;
    mobileMediaPublicId: string;
  };
  about: {
    title: string;
    description: string;
    mediaList: { url: string; publicId: string }[];
  };
  works: {
    year: string;
    title: string;
    description: string;
    grids: {
      mediaList: { url: string; publicId: string }[];
    }[];
  };
  services: {
    description: string;
    list: {
      title: string;
      mediaUrl: string;
      mediaPublicId: string;
    }[];
  };
  exhibitions: {
    year: string;
    title: string;
    description: string;
    list: {
      text: string;
      mediaUrl: string;
      mediaPublicId: string;
    }[];
  };
  footer: {
    mediaUrl: string;
    mediaPublicId: string;
    mobileMediaUrl: string;
    mobileMediaPublicId: string;
    email: string;
    mobile: string;
  };
  socials: {
    instagram: string;
    whatsapp: string;
    enableWhatsapp: boolean;
  };
}

const PortfolioContentSchema = new Schema({
  hero: {
    topSubheading: String,
    mainTitle: String,
    signature: String,
    signatureSubtext: String,
    mediaUrl: String,
    mediaPublicId: String,
    mobileMediaUrl: String,
    mobileMediaPublicId: String,
  },
  about: {
    title: String,
    description: String,
    mediaList: [{ url: String, publicId: String }],
  },
  works: {
    year: String,
    title: String,
    description: String,
    grids: [{
      mediaList: [{ url: String, publicId: String }]
    }],
  },
  services: {
    description: String,
    list: [{ title: String, mediaUrl: String, mediaPublicId: String }],
  },
  exhibitions: {
    year: String,
    title: String,
    description: String,
    list: [{ text: String, mediaUrl: String, mediaPublicId: String }],
  },
  footer: {
    mediaUrl: String,
    mediaPublicId: String,
    mobileMediaUrl: String,
    mobileMediaPublicId: String,
    email: { type: String, default: "hello@example.com" },
    mobile: { type: String, default: "+1 234 567 8900" },
  },
  socials: {
    instagram: { type: String, default: "https://instagram.com" },
    whatsapp: { type: String, default: "https://wa.me/12345678900" },
    enableWhatsapp: { type: Boolean, default: true },
  }
});

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export const PortfolioContent = mongoose.models.PortfolioContent || mongoose.model<IPortfolioContent>('PortfolioContent', PortfolioContentSchema);
