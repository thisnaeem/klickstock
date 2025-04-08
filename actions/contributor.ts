"use server";

import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { bufferizeFile, uploadImageToCloudinary } from "@/lib/cloudinary";
import { hasContributorAccess } from "@/lib/permissions";
import { ContributorItemStatus } from "@prisma/client";

export async function uploadImageToServer(formData: FormData, saveDraft: boolean = false) {
  // Check authentication and permissions
  const session = await auth();
  const hasAccess = await hasContributorAccess();
  
  // Debug session data
  console.log("Session data:", JSON.stringify({
    id: session?.user?.id,
    email: session?.user?.email,
    role: session?.user?.role
  }));
  
  // Check if user is logged in
  if (!session || !session.user) {
    throw new Error("Not authenticated. Please log in.");
  }
  
  // Check if user has necessary permissions
  if (!hasAccess) {
    throw new Error("You don't have permission to upload content. Please contact an administrator.");
  }
  
  // Check if user ID exists
  if (!session.user.id) {
    throw new Error("User ID not found in session");
  }

  // Get form data
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const license = formData.get("license") as string || "STANDARD";
  const category = formData.get("category") as string;
  
  // Extract tags
  const tags: string[] = [];
  formData.getAll("tags[]").forEach((tag) => {
    if (typeof tag === "string" && tag.trim()) {
      tags.push(tag.trim());
    }
  });

  if (!file || !title) {
    throw new Error("Missing required fields");
  }

  try {
    // Validate file size on server side as well (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds the maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    // Convert file to buffer
    const buffer = await bufferizeFile(file);
    
    // Upload to Cloudinary with folder structure
    const folderName = `freepik-contributors/${session.user.id}`;
    const imageUrl = await uploadImageToCloudinary(buffer, folderName);
    
    if (!imageUrl) {
      throw new Error("Failed to upload image to Cloudinary");
    }
    
    // Save to database with appropriate status
    const item = await db.contributorItem.create({
      data: {
        title,
        description,
        imageUrl,
        // Set status to DRAFT if saveDraft is true, otherwise PENDING for admin review
        status: saveDraft ? ContributorItemStatus.DRAFT : ContributorItemStatus.PENDING,
        userId: session.user.id,
        license: license === "EXTENDED" ? "EXTENDED" : "STANDARD",
        tags: tags,
        categories: category ? [category] : []
      }
    });

    return { 
      success: true, 
      message: saveDraft ? "Image saved as draft" : "Image uploaded successfully",
      itemId: item.id
    };
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(error.message || "Failed to upload image");
  }
}

// Add a new function to submit a draft for review
export async function submitDraftForReview(itemId: string) {
  const session = await auth();
  const hasAccess = await hasContributorAccess();
  
  // Check if user is logged in
  if (!session || !session.user) {
    throw new Error("Not authenticated. Please log in.");
  }
  
  // Check if user has necessary permissions
  if (!hasAccess) {
    throw new Error("You don't have permission to submit content for review.");
  }
  
  try {
    // Find the draft item
    const item = await db.contributorItem.findUnique({
      where: {
        id: itemId,
        userId: session.user.id,
        status: ContributorItemStatus.DRAFT
      }
    });
    
    if (!item) {
      throw new Error("Draft not found or you don't have permission to submit it");
    }
    
    // Check if all required fields are filled
    if (!item.title || item.categories.length === 0) {
      throw new Error("Please fill in all required fields before submitting for review");
    }
    
    // Update the status to PENDING
    const updatedItem = await db.contributorItem.update({
      where: { id: itemId },
      data: { status: ContributorItemStatus.PENDING }
    });
    
    return {
      success: true,
      message: "Draft submitted for review",
      itemId: updatedItem.id
    };
  } catch (error: any) {
    console.error("Submit draft error:", error);
    throw new Error(error.message || "Failed to submit draft for review");
  }
}

// Add a new function to delete a draft
export async function deleteDraft(itemId: string) {
  const session = await auth();
  
  // Check if user is logged in
  if (!session || !session.user) {
    throw new Error("Not authenticated. Please log in.");
  }
  
  try {
    // Find and delete the draft
    const item = await db.contributorItem.findFirst({
      where: {
        id: itemId,
        userId: session.user.id
      }
    });
    
    if (!item) {
      throw new Error("Item not found or you don't have permission to delete it");
    }
    
    // Delete the item
    await db.contributorItem.delete({
      where: { id: itemId }
    });
    
    return {
      success: true,
      message: "Item deleted successfully"
    };
  } catch (error: any) {
    console.error("Delete draft error:", error);
    throw new Error(error.message || "Failed to delete item");
  }
} 