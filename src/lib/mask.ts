/** Mascaramento visual de identificadores e segredos. Nunca exibir valor completo. */
export function maskSecret(value: string | null | undefined, visible = 4): string {
  if (!value) return "—";
  const tail = value.slice(-visible);
  return `${"•".repeat(12)}${tail}`;
}

export function maskPhone(value: string | null | undefined): string {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return value;
  return `${value.slice(0, Math.max(0, value.length - 4)).replace(/\d/g, "•")}${digits.slice(-4)}`;
}

export function maskEmail(value: string | null | undefined): string {
  if (!value) return "—";
  const [user, domain] = value.split("@");
  if (!domain) return value;
  const head = user.slice(0, 2);
  return `${head}${"•".repeat(Math.max(3, user.length - 2))}@${domain}`;
}
