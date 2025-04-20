import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download, FileImage } from 'lucide-react';
import DownloadButton from './components/DownloadButton';

export default async function DownloadsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  const downloads = await prisma.download.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      contributorItem: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Function to get a friendly file name
  const getDisplayFileName = (title: string, imageType: string = 'JPG') => {
    // Replace long hash with shortened version if needed
    const cleanTitle = title.length > 20 && title.match(/^[a-z0-9]{20,}$/i) 
      ? `${title.substring(0, 8)}...` 
      : title;
      
    return `${cleanTitle}.${imageType.toLowerCase()}`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">My Downloads</h1>
        {downloads.length > 0 && (
          <p className="text-sm text-gray-500 mt-1 md:mt-0">
            <span className="font-medium text-gray-900">{downloads.length}</span> {downloads.length === 1 ? 'item' : 'items'} downloaded
          </p>
        )}
      </div>
      
      {downloads.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Download className="h-12 w-12 mx-auto text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No downloads yet</h2>
          <p className="text-gray-500 mb-6">Start exploring our collection and download some images</p>
          <Link href="/gallery">
            <Button>Browse Gallery</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {downloads.map((download) => (
              <li key={download.id} className="p-4 hover:bg-blue-50 transition-colors duration-200 relative">
                <Link href={`/gallery/${download.contributorItemId}`} className="absolute inset-0 z-0" aria-hidden="true"></Link>
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="flex-shrink-0 h-16 w-16 relative rounded overflow-hidden shadow-sm">
                    <Link href={`/gallery/${download.contributorItemId}`} className="block">
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10"></div>
                      <Image
                        src={download.contributorItem.imageUrl}
                        alt={download.contributorItem.title}
                        fill
                        sizes="64px"
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 transition-colors">
                      {getDisplayFileName(download.contributorItem.title, download.contributorItem.imageType)}
                    </p>
                    <div className="flex items-center mt-1">
                      <FileImage className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">
                        {download.contributorItem.imageType || 'JPG'} • Downloaded {formatDistanceToNow(download.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 relative z-20">
                    <DownloadButton 
                      userId={session.user.id || ''} 
                      contributorItemId={download.contributorItemId}
                      imageUrl={download.contributorItem.imageUrl}
                      title={download.contributorItem.title}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 