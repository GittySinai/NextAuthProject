import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connect();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Here we map the hashedPassword to the password field
    });

    await newUser.save();

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    return NextResponse.json(
      { message: "An error occurred while registering the user.", error },
      { status: 500 }
    );
  }
}
