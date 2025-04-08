import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasContributorAccess, hasAdminAccess } from '@/lib/permissions';

export async function GET() {
  try {
    const session = await auth();
    const isContributor = await hasContributorAccess();
    const isAdmin = await hasAdminAccess();
    
    // Don't expose sensitive information in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        authenticated: !!session?.user,
        isContributor,
        isAdmin,
      });
    }
    
    // More detailed response for development
    return NextResponse.json({
      authenticated: !!session?.user,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      } : null,
      permissions: {
        isContributor,
        isAdmin,
      }
    });
  } catch (error) {
    console.error('Session debug error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session information' },
      { status: 500 }
    );
  }
} 