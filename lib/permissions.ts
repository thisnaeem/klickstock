import { Role } from "@prisma/client";
import { auth } from "@/auth";

// Check if the user has contributor privileges
export async function hasContributorAccess() {
  const session = await auth();

  if (!session || !session.user) {
    return false;
  }

  // Users with CONTRIBUTOR, ADMIN or SUPER_ADMIN roles can upload
  const contributorRoles: Role[] = ["CONTRIBUTOR", "ADMIN", "SUPER_ADMIN"];
  return contributorRoles.includes(session.user.role as Role);
}

// Check if the user has admin privileges
export async function hasAdminAccess() {
  const session = await auth();

  if (!session || !session.user) {
    return false;
  }

  // Users with ADMIN or SUPER_ADMIN roles have admin access
  const adminRoles: Role[] = ["ADMIN", "SUPER_ADMIN"];
  return adminRoles.includes(session.user.role as Role);
}

// Get current user with role information
export async function getCurrentUser() {
  const session = await auth();
  
  if (!session || !session.user) {
    return null;
  }
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
  };
} 