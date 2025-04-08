"use server";

import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { ContributorItemStatus } from "@prisma/client";
import { hasAdminAccess } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

/**
 * Approve a contributor submission
 */
export async function approveSubmission(itemId: string) {
  // Check authentication and permissions
  const session = await auth();
  const isAdmin = await hasAdminAccess();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  if (!isAdmin) {
    throw new Error("You don't have permission to perform this action");
  }
  
  try {
    // Update the status to APPROVED
    await db.contributorItem.update({
      where: { id: itemId },
      data: { 
        status: ContributorItemStatus.APPROVED,
        reviewerId: session.user.id,
        reviewNote: "Content approved by administrator",
        reviewedAt: new Date()
      }
    });
    
    // Revalidate relevant paths
    revalidatePath('/admin/submissions');
    revalidatePath('/admin/approved');
    revalidatePath('/gallery');
    
    return { success: true, message: "Content approved successfully" };
  } catch (error: any) {
    console.error("Error approving content:", error);
    throw new Error(error.message || "Failed to approve content");
  }
}

/**
 * Reject a contributor submission with a reason
 */
export async function rejectSubmission(itemId: string, rejectionReason: string) {
  // Check authentication and permissions
  const session = await auth();
  const isAdmin = await hasAdminAccess();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  if (!isAdmin) {
    throw new Error("You don't have permission to perform this action");
  }
  
  if (!rejectionReason) {
    throw new Error("Rejection reason is required");
  }
  
  try {
    // Update the status to REJECTED with reason
    await db.contributorItem.update({
      where: { id: itemId },
      data: { 
        status: ContributorItemStatus.REJECTED,
        reviewerId: session.user.id,
        reviewNote: rejectionReason,
        reviewedAt: new Date()
      }
    });
    
    // Revalidate relevant paths
    revalidatePath('/admin/submissions');
    revalidatePath('/admin/rejected');
    
    return { success: true, message: "Content rejected successfully" };
  } catch (error: any) {
    console.error("Error rejecting content:", error);
    throw new Error(error.message || "Failed to reject content");
  }
}

/**
 * Get contributor statistics for the admin dashboard
 */
export async function getContributorStats() {
  // Check authentication and permissions
  const session = await auth();
  const isAdmin = await hasAdminAccess();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  if (!isAdmin) {
    throw new Error("You don't have permission to access this data");
  }
  
  try {
    // Get counts by status
    const pendingCount = await db.contributorItem.count({
      where: { status: ContributorItemStatus.PENDING }
    });
    
    const approvedCount = await db.contributorItem.count({
      where: { status: ContributorItemStatus.APPROVED }
    });
    
    const rejectedCount = await db.contributorItem.count({
      where: { status: ContributorItemStatus.REJECTED }
    });
    
    // Get total downloads and views
    const stats = await db.contributorItem.aggregate({
      where: { status: ContributorItemStatus.APPROVED },
      _sum: {
        downloads: true,
        views: true
      }
    });
    
    const totalDownloads = stats._sum.downloads || 0;
    const totalViews = stats._sum.views || 0;
    
    // Get contributor count
    const contributorCount = await db.user.count({
      where: { role: "CONTRIBUTOR" }
    });
    
    // Get user count
    const userCount = await db.user.count();
    
    return {
      pendingCount,
      approvedCount,
      rejectedCount,
      totalDownloads,
      totalViews,
      contributorCount,
      userCount
    };
  } catch (error: any) {
    console.error("Error fetching contributor stats:", error);
    throw new Error(error.message || "Failed to fetch contributor statistics");
  }
} 