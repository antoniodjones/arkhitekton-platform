import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-cbc';

// Derive a proper 32-byte key from the encryption key
function getKey(): Buffer {
  // CRITICAL: Encryption key MUST be set in environment
  // In production, use proper key management (AWS KMS, Azure Key Vault, HashiCorp Vault, etc.)
  const encryptionKey = process.env.ENCRYPTION_KEY;
  
  if (!encryptionKey) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is required for encrypting sensitive settings. ' +
      'Please set this to a secure random string (minimum 32 characters).'
    );
  }
  
  if (encryptionKey.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
  }
  
  return scryptSync(encryptionKey, 'salt', 32);
}

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const key = getKey();
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return IV + encrypted data (IV is needed for decryption)
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedData: string): string {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const key = getKey();
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return ''; // Return empty string on decryption failure
  }
}

// Helper to check if a value is encrypted (has IV:data format)
export function isEncrypted(value: string): boolean {
  return value.includes(':') && value.split(':').length === 2;
}
