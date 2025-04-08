import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { otpVerificationSchema } from "@/lib/schemas/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received verification request:', body);
    
    const validatedData = otpVerificationSchema.parse(body);
    console.log('Validated data:', validatedData);
    
    // Additional check to ensure email is present
    if (!validatedData.email) {
      console.error('Email is missing in validation data');
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    console.log('Found user:', { email: user?.email, hasToken: !!user?.verificationToken });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.verificationToken || !user.verificationTokenExpiry) {
      return NextResponse.json(
        { error: "No verification pending" },
        { status: 400 }
      );
    }

    if (user.verificationToken !== validatedData.otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (new Date() > user.verificationTokenExpiry) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    // Verify the user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
} 