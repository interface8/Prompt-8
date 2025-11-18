import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ promptId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { promptId } = await params;
    
    // Check if user already liked this prompt
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_promptId: {
          userId: session.user.id,
          promptId: promptId,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.$transaction([
        prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        }),
        prisma.prompt.update({
          where: { id: promptId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        }),
      ]);

      return NextResponse.json({ liked: false, message: 'Prompt unliked' });
    } else {
      // Like - add the like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId: session.user.id,
            promptId: promptId,
          },
        }),
        prisma.prompt.update({
          where: { id: promptId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        }),
      ]);

      return NextResponse.json({ liked: true, message: 'Prompt liked' });
    }
  } catch (error) {
    console.error('Like/unlike error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ promptId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { promptId } = await params;
    
    const like = await prisma.like.findUnique({
      where: {
        userId_promptId: {
          userId: session.user.id,
          promptId: promptId,
        },
      },
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error('Get like status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}