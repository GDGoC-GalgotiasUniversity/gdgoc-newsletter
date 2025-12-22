import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return null;
    }

    const verified = jwt.verify(token, jwtSecret);
    return verified;
  } catch (error) {
    return null;
  }
}

export async function verifyAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token) {
      return null;
    }

    const verified = jwt.verify(token, jwtSecret);
    return verified;
  } catch (error) {
    return null;
  }
}

export function getTokenFromCookie(cookieString: string) {
  const cookies = cookieString.split(';').reduce((acc: any, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  return cookies.authToken || cookies.adminToken;
}

export function generateToken(payload: any, expiresIn: string = '7d') {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}
