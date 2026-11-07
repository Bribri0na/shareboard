import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const logInSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6,"Password must be at least 6 cahtacters"),
})
export type LogInInput = z.infer<typeof logInSchema>


export const postSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    content: z.string().min(1, "Content is required"),
})

export type PostInput = z.infer<typeof postSchema>


export const commentSchema = z.object({
    content:z
    .string()
    .min(1,"Comment cnanot be empty")
    .max(50, "Comment must be 500 characters or less")
})

export type CommentInput = z.infer<typeof commentSchema>

