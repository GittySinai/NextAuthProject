import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // אימות כדי לוודא שאימיילים לא משוכפלים
    },
    password: {
      type: String,
    },
    isGoogleUser: {
      type: Boolean,
      default: false, // ברירת מחדל - משתמש שלא נכנס דרך Google
    },
  },
  { timestamps: true } // יצירת שדות createdAt ו-updatedAt אוטומטית
);

// Middleware לוודא סיסמה רק עבור משתמשים רגילים
userSchema.pre("save", function (next) {
  if (!this.isGoogleUser && !this.password) {
    return next(new Error("Password is required for non-Google users"));
  }
  next();
});

const User = models.User || mongoose.model("User", userSchema);

export default User;
