import crypto from "crypto";

// Constants
const ALGORITHM = "aes-256-gcm"; // Using GCM mode for authenticated encryption
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits for GCM
const SALT_LENGTH = 16; // 128 bits for key derivation

// Get encryption key from environment
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
console.log("Encryption key exists:", !!ENCRYPTION_KEY);
console.log("Encryption key length:", ENCRYPTION_KEY?.length);

if (!ENCRYPTION_KEY) {
  if (typeof window === "undefined") {
    // Server-side error
    throw new Error(
      "ENCRYPTION_KEY environment variable is not set. Please add it to your .env file."
    );
  } else {
    // Client-side error
    console.error("ENCRYPTION_KEY environment variable is not set");
    throw new Error("Encryption key is not configured properly");
  }
}

// Validate key length
const key = Buffer.from(ENCRYPTION_KEY!, "hex");
if (key.length !== KEY_LENGTH) {
  console.error(
    `Invalid key length: ${key.length} bytes. Expected ${KEY_LENGTH} bytes.`
  );
  throw new Error(
    `Invalid key length: ${key.length} bytes. Expected ${KEY_LENGTH} bytes.`
  );
}

// Generate a random IV
export function generateIV(): string {
  return crypto.randomBytes(IV_LENGTH).toString("hex");
}

// Generate a random salt for key derivation
export function generateSalt(): string {
  return crypto.randomBytes(SALT_LENGTH).toString("hex");
}

// Derive a key using PBKDF2
function deriveKey(masterKey: Buffer, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, KEY_LENGTH, "sha256");
}

// Encrypt data with additional security measures
export function encryptData(data: string): {
  encrypted: string;
  iv: string;
  salt: string;
} {
  try {
    // Generate a random salt for key derivation
    const salt = generateSalt();
    const saltBuffer = Buffer.from(salt, "hex");

    // Derive a unique key for this encryption
    const derivedKey = deriveKey(key, saltBuffer);

    // Generate a random IV
    const iv = generateIV();
    const ivBuffer = Buffer.from(iv, "hex");

    // Create cipher with GCM mode
    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, ivBuffer);

    // Add associated data for authentication (optional)
    cipher.setAAD(Buffer.from("YarnnuMarketplace"));

    // Encrypt the data
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    // Combine encrypted data with auth tag
    const result = encrypted + authTag.toString("hex");

    return {
      encrypted: result,
      iv,
      salt,
    };
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

// Decrypt data with additional security measures
export function decryptData(
  encryptedData: string,
  iv: string,
  salt: string
): string {
  try {
    // Check for invalid encryption values (from old seller applications)
    if (iv === "temp-iv" || salt === "temp-salt" || !iv || !salt) {
      console.warn(
        "Invalid encryption values detected, returning fallback value"
      );
      return "Temporary Data - Please Update";
    }

    // Try GCM decryption first (current method)
    try {
      // Convert salt and IV to buffers
      const saltBuffer = Buffer.from(salt, "hex");
      const ivBuffer = Buffer.from(iv, "hex");

      // Derive the same key used for encryption
      const derivedKey = deriveKey(key, saltBuffer);

      // Extract auth tag from the end of encrypted data
      const authTag = Buffer.from(encryptedData.slice(-32), "hex");
      const encrypted = encryptedData.slice(0, -32);

      // Create decipher
      const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, ivBuffer);

      // Set authentication tag
      decipher.setAuthTag(authTag);

      // Add associated data for authentication (must match encryption)
      decipher.setAAD(Buffer.from("YarnnuMarketplace"));

      // Decrypt the data
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw error; // Re-throw the GCM error
    }
  } catch (error) {
    console.error("Decryption error:", error);
    // Return a fallback value instead of throwing an error
    return "Temporary Data - Please Update";
  }
}

// Helper function to encrypt birthdate data
export function encryptBirthdate(birthdate: string): {
  encryptedBirthdate: string;
  birthdateIV: string;
  birthdateSalt: string;
} {
  const { encrypted, iv, salt } = encryptData(birthdate);
  return {
    encryptedBirthdate: encrypted,
    birthdateIV: iv,
    birthdateSalt: salt,
  };
}

// Helper function to decrypt birthdate data
export function decryptBirthdate(data: {
  encryptedBirthdate: string;
  birthdateIV: string;
  birthdateSalt: string;
}): string {
  return decryptData(
    data.encryptedBirthdate,
    data.birthdateIV,
    data.birthdateSalt
  );
}
