import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get form data
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const license = formData.get("license") as string;
    const image = formData.get("image") as File;
    
    // Get tags and categories as arrays
    const tags = formData.getAll("tags") as string[];
    const categories = formData.getAll("categories") as string[];
    
    // Validate required fields
    if (!title || !description || !license || !image || !tags.length || !categories.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate license
    if (license !== "STANDARD" && license !== "EXTENDED") {
      return NextResponse.json(
        { error: "Invalid license type" },
        { status: 400 }
      );
    }
    
    // In a real application, you would upload the image to a cloud storage service
    // and get a URL to save in the database. For simplicity, we'll simulate this.
    const imageUrl = `/uploads/${Date.now()}_${image.name}`;
    
    // Create the contributor item
    const contributorItem = await db.contributorItem.create({
      data: {
        title,
        description,
        imageUrl,
        license: license as "STANDARD" | "EXTENDED",
        tags,
        category: categories[0],
        userId: session.user.id || ''
      }
    });
    
    return NextResponse.json({ 
      message: "Item uploaded successfully",
      item: contributorItem
    });
    
  } catch (error) {
    console.error("Failed to upload item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 