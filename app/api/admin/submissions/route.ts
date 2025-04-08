import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { hasAdminAccess } from "@/lib/permissions";
import { ContributorItemStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await auth();
    const isAdmin = await hasAdminAccess();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to access this resource" },
        { status: 403 }
      );
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    
    // Fetch pending submissions
    const items = await db.contributorItem.findMany({
      where: { 
        status: ContributorItemStatus.PENDING 
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    });
    
    // Get total count for pagination
    const totalCount = await db.contributorItem.count({
      where: { status: ContributorItemStatus.PENDING }
    });
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return NextResponse.json({
      items,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev
      }
    });
  } catch (error: any) {
    console.error("Failed to fetch submissions:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 