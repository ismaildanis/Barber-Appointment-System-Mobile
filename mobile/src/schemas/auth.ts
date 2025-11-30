import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email('Geçerli bir email adresi giriniz.'),
    password: z.string().min(6, 'Şifre en az 6 karakterden oluşmalıdır.'),
})
const nonEmpty = (msg: string) => z.string().trim().min(1, msg);

export const registerSchema = z.object({
  first_name: nonEmpty("Ad zorunlu"),
  last_name: nonEmpty("Soyad zorunlu"),
  username: z.string().trim().min(3, "Kullanıcı adı min 3 karakter"),
  email: z.string().email("Geçerli bir email giriniz"),
  password: z.string().min(6, "Şifre min 6 karakter"),
  password_confirmation: z.string().min(6, "Şifre min 6 karakter"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Şifreler eşleşmiyor",
  path: ["password_confirmation"],
});

export type LoginSchema = z.infer<typeof loginSchema>