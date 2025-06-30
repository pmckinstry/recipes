import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to view your recipes" },
        { status: 401 }
      )
    }

    const recipes = await prisma.recipe.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        author: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ recipes })

  } catch (error) {
    console.error("Profile recipes get error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 