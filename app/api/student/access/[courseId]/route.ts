import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ hasAccess: false })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return NextResponse.json({ hasAccess: false })

  const purchase = await prisma.purchase.findFirst({
    where: { studentId: user.id, courseId: params.courseId, status: 'COMPLETED' },
  })

  return NextResponse.json({ hasAccess: !!purchase })
}
