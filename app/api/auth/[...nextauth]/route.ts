import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        login:    { label: 'Login',    type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.login },
              { email:    credentials.login },
            ],
          },
          select: { id: true, email: true, name: true, password: true, role: true, isBlocked: true, isApproved: true },
        })

        if (!user) return null
        if (user.isBlocked) throw new Error('BLOCKED')

        // Учитель должен быть одобрен
        if (user.role === 'TEACHER' && !user.isApproved) {
          throw new Error('TEACHER_NOT_APPROVED')
        }

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id   = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).id  = token.id
      }
      return session
    },
  },
  pages: { signIn: '/auth/login' },
  session: { strategy: 'jwt' },
})

export { handler as GET, handler as POST }
