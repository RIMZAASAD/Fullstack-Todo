export interface PasswordStrength {
  score: number; // 0-4 scale (0 = very weak, 4 = very strong)
  level: 'weak' | 'medium' | 'strong' | 'very_strong';
  message: string;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const minLength = 8;
  const maxLength = 128;

  // Check length
  const hasMinLength = password.length >= minLength;
  const hasMaxLength = password.length <= maxLength;

  // Check for character variety
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Calculate score based on criteria
  if (hasMinLength) score += 1;
  if (hasUpperCase) score += 1;
  if (hasLowerCase) score += 1;
  if (hasNumbers) score += 1;
  if (hasSpecialChars) score += 1;

  // Adjust score based on length (more granular scoring)
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Cap the score to 4 for level determination
  const cappedScore = Math.min(score, 4);

  let level: 'weak' | 'medium' | 'strong' | 'very_strong' = 'weak';
  let message = '';

  if (cappedScore === 0) {
    level = 'weak';
    message = 'Very weak password';
  } else if (cappedScore === 1) {
    level = 'weak';
    message = 'Weak password';
  } else if (cappedScore === 2) {
    level = 'medium';
    message = 'Medium strength password';
  } else if (cappedScore === 3) {
    level = 'strong';
    message = 'Strong password';
  } else {
    level = 'strong';
    message = 'Very strong password';
  }

  return {
    score: cappedScore,
    level,
    message,
    requirements: {
      minLength: hasMinLength && hasMaxLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChars
    }
  };
};

export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength.level) {
    case 'weak':
      return 'text-red-400';
    case 'medium':
      return 'text-amber-400';
    case 'strong':
    case 'very_strong':
      return 'text-emerald-400';
    default:
      return 'text-slate-400';
  }
};

export const getPasswordStrengthBg = (strength: PasswordStrength): string => {
  switch (strength.level) {
    case 'weak':
      return 'bg-red-500/20';
    case 'medium':
      return 'bg-amber-500/20';
    case 'strong':
    case 'very_strong':
      return 'bg-emerald-500/20';
    default:
      return 'bg-slate-500/20';
  }
};