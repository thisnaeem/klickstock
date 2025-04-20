"use client";

import { useState } from 'react';
import { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { updateProfile } from '@/actions/user';
import { User as LucideUser, Camera, Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  user: Pick<User, 'id' | 'name' | 'email' | 'image' | 'role' | 'createdAt'>;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(user.image || null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      image: user.image || ""
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string);
        form.setValue("image", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await updateProfile({ userId: user.id, name: data.name, image: data.image });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewImage || ""} alt={user.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg">
                {user.name ? user.name[0].toUpperCase() : <LucideUser className="h-12 w-12" />}
              </AvatarFallback>
            </Avatar>
            <label htmlFor="image-upload" className="absolute -bottom-1 -right-1 cursor-pointer bg-blue-500 rounded-full p-2 text-white hover:bg-blue-600 transition-colors">
              <Camera className="h-4 w-4" />
              <span className="sr-only">Upload image</span>
            </label>
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
          </div>
          
          <div className="flex-1 w-full sm:w-auto">
            <h3 className="text-lg font-medium mb-4">Profile Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem className="mb-4">
              <FormLabel>Email</FormLabel>
              <Input value={user.email || ""} disabled />
              <FormDescription>
                Your email address cannot be changed
              </FormDescription>
            </FormItem>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
} 