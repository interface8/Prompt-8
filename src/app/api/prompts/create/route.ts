import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import slugify from 'slugify';

// POST /api/prompts/create - Create new prompt
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has creator role
    if (user.role !== 'CREATOR' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only creators can create prompts' },
        { status: 403 }
      );
    }

    const {
      title,
      description,
      domain,
      category,
      skillLevel,
      price,
      license,
      tags,
      template,
      sampleOutput,
      parameters,
      models,
    } = await request.json();

    // Validation
    if (!title || !description || !domain || !template) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true });
    let slugExists = await prisma.prompt.findUnique({ where: { slug } });
    let counter = 1;
    
    while (slugExists) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      slugExists = await prisma.prompt.findUnique({ where: { slug } });
      counter++;
    }

    // Get or create prompt type
    let promptType = await prisma.promptType.findFirst({
      where: { name: domain },
    });

    if (!promptType) {
      promptType = await prisma.promptType.create({
        data: { name: domain },
      });
    }

    // Create prompt
    const finalPrice = parseFloat(price) || 0;
    const prompt = await prisma.prompt.create({
      data: {
        title,
        slug,
        content: template,
        domain,
        category: category || 'General',
        template,
        typeId: promptType.id,
        userId: user.id,
        description: description || null,
        skillLevel: (skillLevel?.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') || 'BEGINNER',
        price: finalPrice,
        license: license || 'Commercial Use Allowed',
        tags: tags || [],
        sampleOutput: sampleOutput || null,
        isSellable: finalPrice > 0,
        status: 'PENDING_REVIEW',
      },
    });

    // Create parameters
    if (parameters && Array.isArray(parameters) && parameters.length > 0) {
      await prisma.parameter.createMany({
        data: parameters.map((param: { name: string; type: string; description: string; required?: boolean; placeholder?: string; options?: string[] }) => ({
          promptId: prompt.id,
          name: param.name,
          type: param.type.toUpperCase() as 'TEXT' | 'NUMBER' | 'SELECT' | 'TEXTAREA',
          description: param.description,
          required: param.required ?? true,
          placeholder: param.placeholder || null,
          options: param.options || [],
        })),
      });
    }

    // Create model recommendations
    if (models && Array.isArray(models) && models.length > 0) {
      await prisma.model.createMany({
        data: models.map((model: { name: string; provider: string; efficiency?: number; recommended?: boolean }) => ({
          promptId: prompt.id,
          name: model.name,
          provider: model.provider,
          efficiency: model.efficiency ?? 85,
          recommended: model.recommended ?? false,
        })),
      });
    }

    // Fetch complete prompt with relations
    const completePrompt = await prisma.prompt.findUnique({
      where: { id: prompt.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            verified: true,
          },
        },
        parameters: true,
        models: true,
      },
    });

    return NextResponse.json(completePrompt, { status: 201 });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
