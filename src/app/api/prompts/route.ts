import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const prompts = await prisma.prompt.findMany({
    where: { isPrivate: false },
    include: { user: true, favorites: true, comments: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(prompts);
}

export async function POST(req: Request) {
  const data = await req.json();

  const newPrompt = await prisma.prompt.create({
    data: {
      title: data.title,
      content: data.content,
      slug: data.slug, // generate with slugify if needed
      userId: data.userId,
      category: data.category,
      price: data.price,
      isPrivate: data.isPrivate || false,
      type: data.type, // ensure this is provided in the request body
      user: { connect: { id: data.userId } } // connect user relation
    }
  });

  return NextResponse.json(newPrompt);
}
