export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUsername(username: string): boolean {
  return typeof username === "string" && username.length >= 3 && username.length <= 20;
}

export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 6;
}

export function isValidAvatar(file?: Express.Multer.File): string | null {
  if (!file) return null;

  if (!file.mimetype.startsWith("image/")) {
    return "Solo se permiten imágenes como avatar";
  }

  if (file.size > 2 * 1024 * 1024) {
    return "El avatar no puede superar los 2MB";
  }

  return null;
}
