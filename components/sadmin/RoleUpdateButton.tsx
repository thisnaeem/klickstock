"use client";

import { useState } from "react";
import { UserPlus, ShieldCheck, UserCog, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUserRole } from "@/actions/superAdmin";

type RoleUpdateButtonProps = {
  userId: string;
  currentRole: string;
  userName: string;
};

export function RoleUpdateButton({ userId, currentRole, userName }: RoleUpdateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleUpdate = async (newRole: "USER" | "CONTRIBUTOR" | "ADMIN") => {
    if (newRole === currentRole) return;
    
    // Confirm before updating
    if (!confirm(`Are you sure you want to change ${userName}'s role to ${newRole}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserRole(userId, newRole);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>Change Role</>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentRole !== "USER" && (
          <DropdownMenuItem 
            onClick={() => handleRoleUpdate("USER")}
            className="flex items-center cursor-pointer"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Make User
          </DropdownMenuItem>
        )}
        {currentRole !== "CONTRIBUTOR" && (
          <DropdownMenuItem 
            onClick={() => handleRoleUpdate("CONTRIBUTOR")}
            className="flex items-center cursor-pointer"
          >
            <UserCog className="h-4 w-4 mr-2" />
            Make Contributor
          </DropdownMenuItem>
        )}
        {currentRole !== "ADMIN" && (
          <DropdownMenuItem 
            onClick={() => handleRoleUpdate("ADMIN")}
            className="flex items-center cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Make Admin
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 