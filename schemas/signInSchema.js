import { z } from 'zod';

// schema validation using zod
export const signInSchema = z.object({
    email: z.string({ message: "Invalid email address or username" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})