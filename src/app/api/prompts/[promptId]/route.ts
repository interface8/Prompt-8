import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ promptId: string }> }
) {
  const { promptId } = await params;
  
  // Try to find by ID first, then by slug
  let prompt = await prisma.prompt.findUnique({
    where: { id: promptId },
    include: { user: true, comments: true, parameters: true, models: true }
  });

  // If not found by ID, try by slug
  if (!prompt) {
    prompt = await prisma.prompt.findUnique({
      where: { slug: promptId },
      include: { user: true, comments: true, parameters: true, models: true }
    });
  }

  if (!prompt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(prompt);
}
