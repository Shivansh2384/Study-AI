import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { students } from "@/db/schema";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const email = String(credentials.email).toLowerCase().trim();
          const password = String(credentials.password);
          const action = String(credentials.action || "signin");

          if (password.length < 4) return null;

          const allStudents = await db.select().from(students).limit(500);
          const found = allStudents.find((s) => {
            const parts = s.name.split("|");
            return parts.length >= 2 && parts[1] === email;
          });

          if (action === "signup") {
            if (found) return null; // account exists
            const displayName = String(credentials.name || email.split("@")[0]);
            const [user] = await db.insert(students).values({
              name: `${displayName}|${email}|${password}`,
            }).returning();
            return { id: String(user.id), name: displayName, email };
          }

          // signin
          if (!found) return null;
          const parts = found.name.split("|");
          if (parts.length < 3 || parts[2] !== password) return null;
          return { id: String(found.id), name: parts[0], email: parts[1] };
        } catch (err) {
          console.error("Auth error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
