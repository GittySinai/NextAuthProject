import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/userSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("_id name email");

    console.log("User: ", user);


    return NextResponse.json(
      {
        message: "User found.",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);

    return NextResponse.json(
      { message: "An error occurred while fetching the user.", error },
      { status: 500 }
    );
  }
}
