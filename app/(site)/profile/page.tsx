import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './components/ProfileForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { prisma } from '@/lib/prisma';
import { Separator } from '@/components/ui/separator';
import AccountSettings from './components/AccountSettings';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true
    }
  });
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2 text-white">Profile Settings</h1>
      <p className="text-gray-400 mb-6">Manage your account information and preferences</p>
      <Separator className="mb-6 bg-gray-800" />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8 bg-gray-900/60 border border-gray-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Profile Information</TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="bg-gray-900/60 p-6 rounded-lg shadow-lg border border-gray-800/50 backdrop-blur-sm">
            <ProfileForm user={user} />
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <div className="bg-gray-900/60 p-6 rounded-lg shadow-lg border border-gray-800/50 backdrop-blur-sm">
            <AccountSettings user={user} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 