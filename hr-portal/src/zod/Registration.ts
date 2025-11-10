import { z } from "zod";

export const registrationSchema = z.object({
  username: z.string().min(3, "Min 3 chars").max(20, "Max 20 chars"),
  email: z.email("Invalid email format").max(100, "Max 100 chars"),
  password: z.string().min(6, "Min 6 chars").max(50, "Max 50 chars"),
});