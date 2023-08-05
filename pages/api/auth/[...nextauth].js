import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
      allowDangerousEmailAccountLinking: true,
      
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_FRONT_ID,
      clientSecret: process.env.FACEBOOK_FRONT_SECRET,
      allowDangerousEmailAccountLinking: true,
      
    }),
  ],
  
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  callbacks: {
    session: async ({session,token,user}) => {
      session.accessToken = token.accessToken
      return session
    }
  }
}

const authHandler =  NextAuth(authOptions)
export default async function handler(...params) {
  await authHandler(...params);
}
