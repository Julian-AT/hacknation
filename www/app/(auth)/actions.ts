"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { createUser, getUser } from "@/lib/db/queries";
import { rateLimit } from "@/lib/rate-limit";

import { signIn } from "./auth";

const authLimiter = rateLimit({ windowMs: 60_000, max: 5 });

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export type LoginActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data"
    | "rate_limited";
};

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",").at(0)?.trim() ?? "unknown";

    if (!authLimiter.check(`login:${ip}`)) {
      return { status: "rate_limited" };
    }

    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export type RegisterActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data"
    | "rate_limited";
};

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",").at(0)?.trim() ?? "unknown";

    if (!authLimiter.check(`register:${ip}`)) {
      return { status: "rate_limited" };
    }

    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    }
    await createUser(validatedData.email, validatedData.password);
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
