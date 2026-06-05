import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        unique: true,          // ← very important for login systems
        trim: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,          // ← very important for login systems
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        // required: true,
        // unique: true,          // ← very important for login systems
        trim: true
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }  // automatically adds createdAt & updatedAt
);

// Very important: collection name should be lowercase & plural in most cases
const User = mongoose.model('user', userSchema);  
// or: const User = mongoose.model('user', userSchema);  ← collection will be "users"

export default User;