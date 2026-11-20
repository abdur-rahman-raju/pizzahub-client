import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware, getOAuthState } from "better-auth/api";
import { MongoClient } from "mongodb";


const client = globalThis._mongoClient ?? new MongoClient(process.env.MONGODB_URI);
if (process.env.NODE_ENV !== "production") {
  globalThis._mongoClient = client;
}
const db = client.db(process.env.DB_NAME);


const SIGNUP_ROLES = ["vendor", "customer"];


const PROTECTED_FIELDS = [
  "role",
  "isBlocked",
  "subscriptionPlan",
  "subscriptionExpiresAt",
];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),

  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer" },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      businessName: { type: "string", required: false },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          let role = user.role;
          let oauthBusinessName = null;

    
          if (ctx?.path === "/callback/:id") {
            const state = await getOAuthState();
            role = state?.role;
            if (typeof state?.businessName === "string" && state.businessName.trim()) {
              oauthBusinessName = state.businessName.trim().slice(0, 80);
            }
          }

          const safeRole = SIGNUP_ROLES.includes(role) ? role : "customer";

          const data = {
            ...user,
            role: safeRole,
            isBlocked: false,
            subscriptionPlan: "free",
          };
          if (safeRole === "vendor" && oauthBusinessName) {
            data.businessName = oauthBusinessName;
          }

          return { data };
        },
      },
      update: {
        before: async (data) => {
          for (const field of PROTECTED_FIELDS) {
            if (field in data) {
              throw new APIError("FORBIDDEN", {
                message: "You are not allowed to change this field",
              });
            }
          }
          return { data };
        },
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password || "";
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must include at least one uppercase and one lowercase letter",
          });
        }
      }
    }),
  },


  plugins: [jwt(), nextCookies()],
});