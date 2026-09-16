import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'src/data/cncc_db.json');

// In-memory fallback cache for serverless environments when file system is read-only
let memoryCache: any = null;

/**
 * Reads database content from Supabase (if configured), falling back to local JSON
 */
export async function getDbData(): Promise<any> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  // 1. Try Supabase Cloud Database if env variables are present
  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/cncc_content?id=eq.1&select=data`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const rows = await response.json();
        if (rows && rows.length > 0 && rows[0].data) {
          return rows[0].data;
        }
      }
    } catch (err) {
      console.warn('Could not fetch from Supabase, falling back to local file/cache:', err);
    }
  }

  // 2. Fall back to memory cache if available
  if (memoryCache) {
    return memoryCache;
  }

  // 3. Fall back to local cncc_db.json file
  try {
    const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf8');
    const parsed = JSON.parse(fileContent);
    memoryCache = parsed;
    return parsed;
  } catch (error) {
    console.error('Error reading local db file:', error);
    return null;
  }
}

/**
 * Saves database content to Supabase (if configured) and updates local JSON/memory
 */
export async function saveDbData(newData: any): Promise<boolean> {
  memoryCache = newData;

  // 1. Try saving to Supabase if configured
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/cncc_content`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: 1,
          data: newData,
          updated_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Also update local file if possible (e.g. in dev)
        trySaveLocalFile(newData);
        return true;
      }
    } catch (err) {
      console.warn('Could not save to Supabase:', err);
    }
  }

  // 2. Try saving to local file (works in development or writable environments)
  const localSaved = trySaveLocalFile(newData);
  return localSaved || true;
}

function trySaveLocalFile(data: any): boolean {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    // In serverless read-only environment, this is expected to fail quietly
    return false;
  }
}
