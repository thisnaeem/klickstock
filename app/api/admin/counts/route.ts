import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { ContributorItemStatus } from "@prisma/client";

export async function GET() {
  try {
    // Get the current user
    const session = await auth();
    
    // Check if user is admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get counts for each status
    const pendingCount = await db.contributorItem.count({
      where: {
        status: ContributorItemStatus.PENDING
      }
    });
    
    const approvedCount = await db.contributorItem.count({
      where: {
        status: ContributorItemStatus.APPROVED
      }
    });
    
    const rejectedCount = await db.contributorItem.count({
      where: {
        status: ContributorItemStatus.REJECTED
      }
    });
    
    // Get user counts
    const usersCount = await db.user.count();
    
    const contributorsCount = await db.user.count({
      where: {
        role: "CONTRIBUTOR"
      }
    });
    
    // Return the counts
    return NextResponse.json({
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      users: usersCount,
      contributors: contributorsCount
    });
    
  } catch (error) {
    console.error("Error fetching admin counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 