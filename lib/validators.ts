import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre es muy largo"),
  bio: z.string().max(500, "La biografía no puede exceder 500 caracteres").optional().or(z.literal("")),
  job_title: z.string().max(100, "El título es muy largo").optional().or(z.literal("")),
  location: z.string().max(100, "La ubicación es muy larga").optional().or(z.literal("")),
  github_url: z.string().url("URL de GitHub inválida").optional().or(z.literal("")),
  linkedin_url: z.string().url("URL de LinkedIn inválida").optional().or(z.literal("")),
  website_url: z.string().url("URL del sitio web inválida").optional().or(z.literal("")),
  tech_path: z.enum(['dev', 'infra', 'data', 'design', 'cyber', 'qa'], {
    errorMap: () => ({ message: "Ruta tecnológica inválida" })
  }).optional()
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
