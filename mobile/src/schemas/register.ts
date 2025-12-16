import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin."),
  firstName: z.string().min(1, "Ad alanı boş bırakılamaz."),
  lastName: z.string().min(1, "Soyad alanı boş bırakılamaz."),
  phone: z.string().min(10, "Telefon numarası en az 10 haneli olmalı."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
});
export type RegisterSchema = z.infer<typeof registerSchema>;
