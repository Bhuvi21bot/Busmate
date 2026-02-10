import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customerWallets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated session using better-auth
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    // Query wallet by userId from session
    const existingWallet = await db.select()
      .from(customerWallets)
      .where(eq(customerWallets.userId, session.user.id))
      .limit(1);

    // If wallet exists, return it
    if (existingWallet.length > 0) {
      return NextResponse.json(existingWallet[0], { status: 200 });
    }

    // Auto-create wallet if it doesn't exist
    const newWallet = await db.insert(customerWallets)
      .values({
        userId: session.user.id,
        balance: 0,
        totalSpent: 0,
        totalAdded: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newWallet[0], { status: 200 });
  } catch (error) {
    console.error('GET wallet error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}