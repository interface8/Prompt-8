import slugify from "slugify";

export function generateSlug(title: string, category?: string) {
  const base = `${category || "prompt"}-${title}`.toLowerCase();
  return slugify(base, { lower: true, strict: true });
}
