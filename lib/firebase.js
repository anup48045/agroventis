import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Check if Firebase is already initialized
if (!admin.apps.length) {
  try {
    // Hardcoded config for testing (remove this once env vars work)
    const serviceAccount = {
      projectId: "agroventis-b73b4",
      clientEmail: "firebase-adminsdk-fbsvc@agroventis-b73b4.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDh3qgTnBSVtG/7\nPrI8gQteW1H4oSyBhB0szc9VN8jwXKIFl1T2Ow8lijk5+6QqvZkTMBFgvCniQKRy\nSCX7dOoS/QitNCs4zpth+AZCvl31O6EM99M1ZDrVUlBlp0e6lbgOW0rqr7eqS0bc\nEohn5UuSfOppVb36jihg+1FyzrzYuXP+LuP6Ztct24lVksPiC7mAQkHLOOK4xIIp\n90i2uo4yssCR7SIdXp1icZfgmJURjaptFlLUoMZmTuX8goo3bnWBbUwR3mEzMTeE\nqUdYxWdCM2+dxXEwQEVEI1CU/oLR//lO2CsqGz1HPhzV66o9MCE08UUeAp/jQIw7\nnvwADxQDAgMBAAECggEAH7iZekeNTIkOwQZJGd41roa8uGJKUdYwEr7Ew38WJUud\nJZPfRsV8lxUWfGIu6CHAgcVaa2+BoljZv4MKcoo05X3L3idZepzpjZS7rFv37hz1\nvVCAxRrSeGsbB2u60yV7t+hyWQtci/oOdZHUvmKhfm00rp5wE+QrH5OsGKeYNgdy\nAojXyRKV3gsIyW1lWoJzflM0O7Ipa1K3B21HN2SYAneF51gxAsJnEfYxQGdriOQC\nFFspNgOqgpfen6xx3XqgOCOXoLc/BFcQ4hv3FQUszkUZRotQ75tvtaYOC6bzW5DX\nau1xNju+4zGHtxX7EhAgZVZUVcKxTXVybFa6/RpSgQKBgQD4kdnq4KjWVkbdEFec\noQYbT+gwP+vgWZaiDHPPFJV4Edw3QJYLQp+8YSgp4NKKIuASYaCH0vZHdc92tNKJ\nvnPuseTzPNyGdB+Nz0l1M5fxcH+ih/tFjLbtbq6u8hlL5a9rKHHtLv/1W23jReVR\nSmMP+ec3dieDSoj7HIcCKlmE0wKBgQDonxi4EuO/oO3STqCKm7N0jruuHKVQxBWq\n4Bd7uoPkpT7iWqCena6yJ/gDHwSR/Qr3YYmqCsO8gy2gsL0y0WnYurukekDxrTXJ\nfrlZSzhQAe85dVeXXVLYv9KmtOQhKH+lEz1LySBBm+uDTuSTsLzBa1wdHiXm2w92\nXs+toQx2EQKBgGVhx4ne+74ADoMXqUQ/AOie3MrhJ2mn4KJTheCOOrBwSGtYsloB\nYHlK/0Cla/nfY5jbrMf5KW3YBTgbZEu+HDbc4865ohBMyJnkU8eztWNKSSSXZcrm\nK64HmMPOBrdIBRYltuHQa6E9G0K5PWC8gE8B1GZwkIkiG2CgMAiYEU71AoGAX6h8\n+8UYzsaYxbD7p8QbacUAPLse6DWaS2hXf9PVRQMG9wIZpuBk5HI3NOFeecI67ju3\n5qsCjtTKwJetVeZzxmITo7F6X2fBBJkOE0AxagVBoLk2SdJgrS1ErLUaUuBajUF6\nJV4R26kIkjixGmLFXCyP9pFdOK/AjgazFE1z2GECgYEAumPxvZPAO3+zvQ1thtu+\nEZR8SOKreojZOaO1Zzbjl8g93qdTCfRTH8Jz3izlVJr4Y5sdyycAToMDN43+rpUT\nr9CstFclHQhgR3XaZucxgr883xSJtXAhpZmTIFwtqcGJo2Pb4zSvQ1yqdxO8qEaW\n6dkgXKzl4U7tSchN/hqvrGE=\n-----END PRIVATE KEY-----\n"
    };
    
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const auth = admin.auth();

export { auth };
