import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/schemas/auth";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    if (req.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid content type. Expected application/json" },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // Validate the request body
    const validation = signupSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 12);

    // Create user with pending verification
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        verificationToken: otp,
        verificationTokenExpiry: otpExpiry,
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(validatedData.email, otp);
    console.log(`sending email to ${validatedData.email} with otp ${otp}`)
    if (!emailResult.success) {
      // If email fails, delete the user and return error
      await prisma.user.delete({
        where: { id: user.id },
      });
      
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Verification email sent",
      email: user.email,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
} 