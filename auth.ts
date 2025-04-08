import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import { Role } from "@prisma/client"
import { compare } from "bcryptjs"
import { loginSchema } from "@/lib/schemas/auth"

declare module "next-auth" {
    interface Session {
      user: {
        role: Role
        id: string
      } & DefaultSession["user"]
    }
    
    interface User {
      role: Role
      id: string
    }
  }



export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Validate the credentials input
                const validatedCredentials = loginSchema.safeParse(credentials);
                
                if (!validatedCredentials.success) {
                    return null;
                }
                
                const { email, password } = validatedCredentials.data;
                
                // Find the user by email
                const user = await prisma.user.findUnique({
                    where: { email },
                });
                
                if (!user || !user.password) {
                    throw new Error("Invalid email or password");
                }
                
                // Compare passwords
                const isPasswordValid = await compare(password, user.password);
                
                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }
                
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            }
        })
    ],
    callbacks: {
        async session({ session, token, user }) {
            if (session.user) {
                // Ensure id and role are copied from token to session
                session.user.id = token.sub as string;
                session.user.role = token.role as Role;
                
                // Debug session info in development
                if (process.env.NODE_ENV === 'development') {
                    console.log('Session data:', {
                        userId: session.user.id,
                        role: session.user.role
                    });
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // Copy user role and id to token
                token.role = user.role;
                token.sub = user.id;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
})