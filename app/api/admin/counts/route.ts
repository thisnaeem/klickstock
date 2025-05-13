import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { ContributorItemStatus } from "@prisma/client";

export async function GET() {
  const session = await auth();

  // Check if user is admin
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Count items by status
    const pendingCount = await db.contributorItem.count({
      where: { status: ContributorItemStatus.PENDING }
    });

    const approvedCount = await db.contributorItem.count({
      where: { status: ContributorItemStatus.APPROVED }
    });

    const rejectedCount = await db.contributorItem.count({
      where: { status: ContributorItemStatus.REJECTED }
    });

    return NextResponse.json({
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount
    });
  } catch (error) {
    console.error("Error fetching admin counts:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch counts" }), {
      status: 500,
    });
  }
} 