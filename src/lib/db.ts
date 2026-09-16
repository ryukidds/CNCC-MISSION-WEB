import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'src/data/cncc_db.json');

// In-memory fallback cache for serverless environments when file system is read-only
let memoryCache: any = null;

function getLocalData(): any {
  try {
    const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading local db file:', error);
    return null;
  }
}

/**
 * Checks connection to Supabase and returns detailed diagnostic info
 */
export async function checkDbConnection(): Promise<{
  connected: boolean;
  hasUrl: boolean;
  hasKey: boolean;
  tableExists: boolean;
  message: string;
  statusCode?: number;
  error?: string;
}> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      connected: false,
      hasUrl: Boolean(supabaseUrl),
      hasKey: Boolean(supabaseKey),
      tableExists: false,
      message: '환경변수(SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY)가 등록되지 않았거나 Vercel 재배포(Redeploy)가 아직 되지 않았습니다.',
    };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/cncc_content?id=eq.1&select=id`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const rows = await response.json();
      return {
        connected: true,
        hasUrl: true,
        hasKey: true,
        tableExists: true,
        message: `✅ Supabase 클라우드 DB 정상 연결 완료! (영구 보존 활성화됨, 데이터 행: ${rows.length}개)`,
      };
    } else {
      const errText = await response.text();
      const isTableMissing = response.status === 404 || errText.includes('relation') || errText.includes('does not exist');
      return {
        connected: false,
        hasUrl: true,
        hasKey: true,
        tableExists: false,
        statusCode: response.status,
        message: isTableMissing
          ? '⚠️ Supabase 계정 연결은 성공했으나, "cncc_content" 테이블이 생성되지 않았습니다. Supabase SQL Editor에서 테이블 생성 쿼리를 실행해주세요.'
          : `⚠️ Supabase 응답 오류 (Status ${response.status}): ${errText}`,
        error: errText,
      };
    }
  } catch (err: any) {
    return {
      connected: false,
      hasUrl: true,
      hasKey: true,
      tableExists: false,
      message: `⚠️ Supabase 통신 오류: ${err.message}`,
      error: err.message,
    };
  }
}

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

        // Table exists but is empty (first-time init) -> seed from local JSON
        const initial = getLocalData();
        if (initial) {
          await saveDbData(initial);
          return initial;
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
  const local = getLocalData();
  if (local) {
    memoryCache = local;
    return local;
  }

  return null;
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
        trySaveLocalFile(newData);
        return true;
      } else {
        const err = await response.text();
        console.error('Failed to save to Supabase:', response.status, err);
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
