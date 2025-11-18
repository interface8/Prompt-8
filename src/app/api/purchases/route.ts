import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

// POST /api/purchases - Create purchase (checkout)
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

    const { promptIds, paymentMethod = 'paystack' } = await request.json();

    if (!promptIds || !Array.isArray(promptIds) || promptIds.length === 0) {
      return NextResponse.json(
        { error: 'Prompt IDs are required' },
        { status: 400 }
      );
    }

    // Fetch all prompts
    const prompts = await prisma.prompt.findMany({
      where: {
        id: { in: promptIds },
        isSellable: true,
      },
      include: {
        user: true,
      },
    });

    if (prompts.length !== promptIds.length) {
      return NextResponse.json(
        { error: 'Some prompts are not available' },
        { status: 404 }
      );
    }

    // Check for existing purchases
    const existingPurchases = await prisma.purchase.findMany({
      where: {
        userId: user.id,
        promptId: { in: promptIds },
      },
    });

    if (existingPurchases.length > 0) {
      return NextResponse.json(
        { error: 'You already own some of these prompts' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = prompts.reduce((sum: number, prompt: { price: number }) => sum + prompt.price, 0);

    // In production, integrate with Paystack here
    // For now, we'll simulate successful payment
    
    // Create purchases
    const purchases = await Promise.all(
      promptIds.map(async (promptId: string) => {
        const promptData = prompts.find((p: { id: string }) => p.id === promptId);
        if (!promptData) throw new Error('Prompt not found');
        
        const purchase = await prisma.purchase.create({
          data: {
            userId: user.id,
            promptId: promptData.id,
            amount: promptData.price,
            paymentMethod: paymentMethod || 'paystack',
            paymentStatus: 'COMPLETED',
            transactionId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          },
          include: {
            prompt: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                parameters: true,
                models: true,
              },
            },
          },
        });

        // Update prompt purchase count
        await prisma.prompt.update({
          where: { id: promptData.id },
          data: {
            purchaseCount: { increment: 1 },
          },
        });

        // Update creator earnings
        await prisma.user.update({
          where: { id: promptData.userId },
          data: {
            totalEarnings: { increment: promptData.price },
          },
        });

        return purchase;
      })
    );

    // Clear cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          promptId: { in: promptIds },
        },
      });
    }

    return NextResponse.json({
      success: true,
      purchases,
      totalAmount,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}

// GET /api/purchases - Get user's purchases
export async function GET() {
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

    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id },
      include: {
        prompt: {
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
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}
