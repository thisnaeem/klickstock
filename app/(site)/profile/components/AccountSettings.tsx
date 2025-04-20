"use client";

import { useState } from 'react';
import { User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import { deleteAccount } from '@/actions/user';
import { useRouter } from 'next/navigation';

type AccountSettingsProps = {
  user: Pick<User, 'id' | 'name' | 'email' | 'image' | 'role' | 'createdAt'>;
};

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [deleteInput, setDeleteInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await deleteAccount(user.id);
      toast.success("Account deleted successfully");
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account");
      setIsLoading(false);
    }
  };
  
  const isDeleteButtonDisabled = deleteInput !== user.email;
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Account Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Account Type</p>
            <p className="text-base">{user.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Member Since</p>
            <p className="text-base">{format(new Date(user.createdAt), 'MMMM d, yyyy')}</p>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-base font-medium text-red-800">Delete Account</h4>
          <p className="text-sm text-red-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="my-4">
                <p className="text-sm mb-2">
                  To confirm, type your email address: <span className="font-medium">{user.email}</span>
                </p>
                <Input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="Enter your email"
                  className="mb-2"
                />
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleteButtonDisabled || isLoading}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
} 