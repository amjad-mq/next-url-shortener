import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { createUrlSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();

  const result = createUrlSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { url, customAlias } = result.data;

  let shortCode: string;

  if (customAlias) {
    const existing = await prisma.url.findUnique({
      where: { shortCode: customAlias },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This alias is already taken" },
        { status: 409 }
      );
    }

    shortCode = customAlias;
  } else {
    shortCode = nanoid(7);
    let existing = await prisma.url.findUnique({ where: { shortCode } });
    while (existing) {
      shortCode = nanoid(7);
      existing = await prisma.url.findUnique({ where: { shortCode } });
    }
  }

  const created = await prisma.url.create({
    data: {
      originalUrl: url,
      shortCode,
    },
  });

  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${created.shortCode}`;

  return NextResponse.json({ shortCode: created.shortCode, shortUrl });
}