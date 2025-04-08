import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { ContributorItemStatus } from "@prisma/client";

export async function GET() {
  try {
    // Get the current user
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get counts for each status
    const draftsCount = await db.contributorItem.count({
      where: {
        userId: session.user.id,
        status: ContributorItemStatus.DRAFT
      }
    });
    
    const pendingCount = await db.contributorItem.count({
      where: {
        userId: session.user.id,
        status: ContributorItemStatus.PENDING
      }
    });
    
    const rejectedCount = await db.contributorItem.count({
      where: {
        userId: session.user.id,
        status: ContributorItemStatus.REJECTED
      }
    });
    
    const approvedCount = await db.contributorItem.count({
      where: {
        userId: session.user.id,
        status: ContributorItemStatus.APPROVED
      }
    });
    
    // Return the counts
    return NextResponse.json({
      drafts: draftsCount,
      pending: pendingCount,
      rejected: rejectedCount,
      approved: approvedCount
    });
    
  } catch (error) {
    console.error("Error fetching counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 