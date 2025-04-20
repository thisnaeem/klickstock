"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { signOut } from "@/auth";

type UpdateProfileParams = {
  userId: string;
  name?: string;
  image?: string;
};

export async function updateProfile({ userId, name, image }: UpdateProfileParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(image && { image })
      }
    });

    revalidatePath('/profile');
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function deleteAccount(userId: string) {
  try {
    // Delete the user account
    await prisma.user.delete({
      where: { id: userId }
    });

    // Sign out the user
    await signOut();
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}

/**
 * Records a download for the user and updates the contributor item download count
 */
export async function recordDownload(userId: string, contributorItemId: string) {
  try {
    // Check if the user has already downloaded this item
    const existingDownload = await prisma.download.findFirst({
      where: {
        userId,
        contributorItemId
      }
    });
    
    // If not already downloaded, create a new download record
    if (!existingDownload) {
      await prisma.download.create({
        data: {
          userId,
          contributorItemId
        }
      });
    }
    
    // Always increment the download count on the contributor item
    await prisma.contributorItem.update({
      where: { id: contributorItemId },
      data: {
        downloads: { increment: 1 }
      }
    });
    
    revalidatePath('/downloads');
    return { success: true };
  } catch (error) {
    console.error("Failed to record download:", error);
    return { success: false, error: "Failed to record download" };
  }
} 