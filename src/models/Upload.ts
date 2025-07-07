import mongoose from 'mongoose';

const UploadSchema = new mongoose.Schema(
  {
    filename: String,
    url: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'uploads' }
);

export default mongoose.models.Upload || mongoose.model('Upload', UploadSchema);
