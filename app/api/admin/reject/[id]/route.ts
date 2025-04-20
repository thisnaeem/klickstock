import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const { id } = await params;
    
    // Get the rejection reason if provided
    const { reason } = await request.json().catch(() => ({}));
    
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
    
    // Reject the item
    const rejectedItem = await db.contributorItem.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewerId: session.user.id,
        reviewNote: reason || "Rejected by admin",
        reviewedAt: new Date()
      }
    });
    
    return NextResponse.json({ 
      message: "Item rejected successfully",
      item: rejectedItem
    });
    
  } catch (error) {
    console.error("Failed to reject item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 