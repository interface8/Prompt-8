import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const prompt = await prisma.prompt.findUnique({
    where: { slug: params.slug },
    include: { user: true, comments: true },
  });

  if (!prompt)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(prompt);
}
