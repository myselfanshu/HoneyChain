import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

// Store only a one-way digest of public QR capabilities, never their raw value.
export const tokenHash = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Validates Cloudflare Turnstile or CAPTCHA token with Cloudflare API.
 * If CAPTCHA_SECRET_KEY is not configured (e.g. local dev / demo mode),
 * it returns success with isDemo: true without faking production verification.
 */
export const verifyCaptcha = async (
  token?: string,
  remoteIp?: string
): Promise<{ success: boolean; isDemo: boolean; message?: string }> => {
  const secret = process.env.CAPTCHA_SECRET_KEY;
  if (!secret) {
    return {
      success: true,
      isDemo: true,
      message: 'Demo security mode: CAPTCHA bypass enabled for local development without secret key',
    };
  }

  if (!token) {
    return {
      success: false,
      isDemo: false,
      message: 'CAPTCHA token is required for this action',
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);
    if (remoteIp) formData.append('remoteip', remoteIp);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
    if (data.success) {
      return { success: true, isDemo: false };
    }
    return {
      success: false,
      isDemo: false,
      message: 'CAPTCHA verification failed. Please try again.',
    };
  } catch (err) {
    console.error('CAPTCHA verification error:', err);
    return {
      success: false,
      isDemo: false,
      message: 'Unable to reach CAPTCHA verification service',
    };
  }
};
