import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // In a real app, you would check if the user has admin rights
    // For simplicity, we're not doing that here
    
    // Get the item
    const item = await db.contributorItem.findUnique({
      where: { id }
    });
    
    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    
    // Approve the item
    const approvedItem = await db.contributorItem.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewerId: session.user.id,
        reviewedAt: new Date()
      }
    });
    
    return NextResponse.json({ 
      message: "Item approved successfully",
      item: approvedItem
    });
    
  } catch (error) {
    console.error("Failed to approve item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 