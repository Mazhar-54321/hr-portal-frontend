import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(3).max(50),
  username: z.string().min(3).max(20),
  email: z.email().max(100),
  phone: z.string().max(20).optional(),
  website: z.url("Enter a valid URL").max(100).optional().or(z.literal("")),
  role: z.enum(["Admin", "Editor", "Viewer"]),
  isActive: z.boolean(),
  skills: z.array(z.string().min(2).max(10)),
  availableSlots:  z.array(
  z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date.getTime() > Date.now();
      },
      { message: "Slot must be a valid future date" }
    )
),
  address: z.object({
    street: z.string().min(5).max(100),
    city: z.string().min(2).max(50),
    zipcode: z.string().regex(/^\d{5,10}$/),
  }),
  company: z.object({
    name: z.string().min(2).max(100),
  }),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
