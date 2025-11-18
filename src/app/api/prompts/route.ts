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
  const body = (await req.json()) as {
    title: string;
    content: string;
    userId: string;
    category: string;
    domain: string;
    template: string;
    typeId?: string;
    slug?: string;
    price?: number;
    isPrivate?: boolean;
  };

  const {
    title,
    content,
    userId,
    category,
    domain,
    template,
    typeId,
    slug,
    price,
    isPrivate,
  } = body;

  // Validate required fields
  if (!title || !content || !userId || !category || !domain || !template) {
    return NextResponse.json(
      { error: 'Missing required fields: title, content, userId, category, domain, template' },
      { status: 400 }
    );
  }

  // Generate slug from title using underscores
  const generateSlugFromTitle = (t: string) =>
    t
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');

  const generatedSlug = slug || generateSlugFromTitle(title);

  // Get or create default prompt type if not provided
  let promptTypeId = typeId;
  if (!promptTypeId) {
    const defaultType = await prisma.promptType.findFirst({
      where: { name: domain },
    });
    
    if (defaultType) {
      promptTypeId = defaultType.id;
    } else {
      const newType = await prisma.promptType.create({
        data: { name: domain },
      });
      promptTypeId = newType.id;
    }
  }

  const newPrompt = await prisma.prompt.create({
    data: {
      title,
      content,
      slug: generatedSlug,
      userId,
      category,
      domain,
      template,
      typeId: promptTypeId,
      price: price ?? 0,
      isPrivate: isPrivate ?? false,
    },
  });

  return NextResponse.json(newPrompt);
}
