"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

type UserRole = "USER" | "CONTRIBUTOR" | "ADMIN" | "SUPER_ADMIN";

/**
 * Updates a user's role
 * @param userId The ID of the user to update
 * @param newRole The new role to assign
 * @returns An object indicating success or error
 */
export async function updateUserRole(userId: string, newRole: UserRole) {
  try {
    // Verify the current user is a super admin
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Only super admins can perform this action"
      };
    }

    // Don't allow changing your own role (for safety)
    if (userId === session.user.id) {
      return {
        success: false,
        error: "Cannot change your own role"
      };
    }

    // Don't allow changing another super admin's role
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (targetUser?.role === "SUPER_ADMIN") {
      return {
        success: false,
        error: "Cannot change the role of another super admin"
      };
    }

    // Update the user role
    await db.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    // Revalidate relevant paths
    revalidatePath("/sadmin/users");
    revalidatePath("/sadmin/contributors");
    revalidatePath("/sadmin/admins");

    return {
      success: true,
      message: `User role updated to ${newRole} successfully`
    };
  } catch (error) {
    console.error("[UPDATE_USER_ROLE]", error);
    return {
      success: false,
      error: "Failed to update user role"
    };
  }
} 