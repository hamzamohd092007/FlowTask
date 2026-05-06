export const normalizeName = (str = "") =>
  str
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

export const formatName = (str = "") =>
  normalizeName(str)
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

export const normalizeEmail = (str = "") => str.trim().toLowerCase();

const isValidEmail = (email = "") => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);

export const getPasswordStrength = (password) => {
  if (!password) return "";
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  if (strength <= 1) return "Weak";
  if (strength === 2) return "Medium";
  return "Strong";
};

export const validateAuth = ({ type, fullName, email, password, confirmPassword }) => {
  const name = formatName(fullName);
  const normalizedEmail = normalizeEmail(email);
  let errors = {};
  if (!normalizedEmail) {
    errors.email = "Email is required";
  } else if (!isValidEmail(normalizedEmail)) {
    errors.email = "Invalid email";
  }
  if (!password) {
    errors.password = "Password is required";
  }
  if (type === "signup") {
    if (!name) {
      errors.fullName = "Full name is required";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";

    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    isSubmitValid: Object.keys(errors).length === 0,
    errors,
    formatted: {
      fullName: name,
      email: normalizedEmail,
    },
  };
};