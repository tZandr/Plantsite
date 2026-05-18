import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    favoriteArticles: {
      type: [Number],
      require: false
    },
    favoritePlants: {
      type: [Number]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('User', userSchema);
