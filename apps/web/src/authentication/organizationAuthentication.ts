import crypto from 'crypto-js';

export const hashPassword = (password: string): string => {
    const salt = crypto.lib.WordArray.random(16).toString();
    const combinedPass = password + salt;
    const hashedPassword = crypto.SHA256(combinedPass).toString();
    return `${salt}:${hashedPassword}`;
};