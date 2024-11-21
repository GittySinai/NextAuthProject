import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/userSchema"; // מודל המשתמש שלך

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, // שם משתנה תואם ל-.env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // סוד לאימות

  callbacks: {
    // בעת התחברות: חיבור ל-MongoDB והוספת המשתמש אם הוא לא קיים
    async signIn({ user }) {
      await connect(); // חיבור למסד הנתונים
      try {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // אם המשתמש לא קיים, צור אותו במסד הנתונים
          await User.create({
            name: user.name,
            email: user.email,
            password: "", // משתמש Google לא צריך סיסמה
            isGoogleUser: true, // מזהה שמדובר במשתמש Google
          });
          console.log("New user created:", user);
        } else {
          console.log("User already exists:", user);
        }
        return true; // הצלחה בהתחברות
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // כשלון בהתחברות
      }
    },

    // הצגת פרטי המשתמש ב-Session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ""; // הוספת ID ל-Session רק אם session.user קיים
      }
      return session;
    },

    // הפניות מותאמות אישית לאחר התחברות או התנתקות
    async redirect({ url, baseUrl }) {
      // אם המשתמש ניסה לגשת לכתובת מסוימת, תחזיר אותו לשם
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // אחרת, ניתוב ברירת מחדל
      return `${baseUrl}/pages/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };
