import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const prompt = await prisma.prompt.findUnique({
    where: { slug: (await params).slug },
    include: { user: true, comments: true }
  });

  if (!prompt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(prompt);
}
