import { query, queryOne } from "./db";
import type { User, ProfilePage, LinkItem, ProfilePageWithLinks } from "./types";

/**
 * ユーザー関連のクエリ
 */
export const userQueries = {
  /**
   * Clerk IDでユーザーを取得
   */
  async findByClerkId(clerkId: string): Promise<User | null> {
    const result = await queryOne<User>(
      `SELECT * FROM users WHERE "clerkId" = $1 LIMIT 1`,
      [clerkId]
    );
    return result;
  },

  /**
   * ユーザーを作成
   */
  async create(data: { clerkId: string; email?: string | null; role?: string }): Promise<User> {
    const result = await queryOne<User>(
      `INSERT INTO users ("clerkId", email, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [data.clerkId, data.email || null, data.role || "user"]
    );
    if (!result) throw new Error("Failed to create user");
    return result;
  },

  /**
   * ユーザーの最終ログイン日時を更新
   */
  async updateLastLogin(userId: string): Promise<void> {
    await query(
      `UPDATE users SET "lastLoginAt" = NOW(), "updatedAt" = NOW() WHERE id = $1`,
      [userId]
    );
  },

  /**
   * ユーザーを更新
   */
  async update(clerkId: string, data: { email?: string | null }): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.email !== undefined) {
      fields.push(`email = $${paramIndex}`);
      values.push(data.email);
      paramIndex++;
    }

    fields.push(`"updatedAt" = NOW()`);
    values.push(clerkId);

    const result = await queryOne<User>(
      `UPDATE users SET ${fields.join(", ")} WHERE "clerkId" = $${paramIndex} RETURNING *`,
      values
    );
    if (!result) throw new Error("Failed to update user");
    return result;
  },

  /**
   * ユーザーを削除
   */
  async delete(clerkId: string): Promise<void> {
    await query(`DELETE FROM users WHERE "clerkId" = $1`, [clerkId]);
  },
};

/**
 * プロフィールページ関連のクエリ
 */
export const profileQueries = {
  /**
   * ユーザーIDでプロフィールを取得（リンク含む）
   */
  async findByUserId(userId: string): Promise<ProfilePageWithLinks | null> {
    const profile = await queryOne<ProfilePage>(
      `SELECT * FROM profile_pages WHERE "userId" = $1 LIMIT 1`,
      [userId]
    );

    if (!profile) return null;

    const links = await query<LinkItem>(
      `SELECT * FROM link_items WHERE "pageId" = $1 ORDER BY "order" ASC`,
      [profile.id]
    );

    return { ...profile, links };
  },

  /**
   * スラッグでプロフィールを取得（公開用）
   */
  async findBySlug(slug: string): Promise<ProfilePageWithLinks | null> {
    const profile = await queryOne<ProfilePage>(
      `SELECT * FROM profile_pages WHERE slug = $1 AND "isPublished" = true LIMIT 1`,
      [slug]
    );

    if (!profile) return null;

    const links = await query<LinkItem>(
      `SELECT * FROM link_items WHERE "pageId" = $1 ORDER BY "order" ASC`,
      [profile.id]
    );

    return { ...profile, links };
  },

  /**
   * スラッグの存在確認
   */
  async slugExists(slug: string): Promise<boolean> {
    const result = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM profile_pages WHERE slug = $1`,
      [slug]
    );
    return result ? parseInt(result.count) > 0 : false;
  },

  /**
   * プロフィールを作成
   */
  async create(data: {
    userId: string;
    slug: string;
    isPublished?: boolean;
  }): Promise<ProfilePage> {
    const result = await queryOne<ProfilePage>(
      `INSERT INTO profile_pages ("userId", slug, "isPublished", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [data.userId, data.slug, data.isPublished || false]
    );
    if (!result) throw new Error("Failed to create profile");
    return result;
  },

  /**
   * プロフィールを更新
   */
  async update(
    profileId: string,
    data: Partial<Omit<ProfilePage, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<ProfilePage> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // 引用符なしのカラム名（小文字）
    // database-setup.sqlを参照：role, audience, name, headline, tagline, situation, tone は引用符なし
    // それ以外（キャメルケース）は引用符付き
    const unquotedColumns = new Set([
      'role', 'audience', 'name', 'headline', 'tagline', 'situation', 'tone'
    ]);

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        // データベースのカラム名を決定
        // 引用符なしのカラムはそのまま、それ以外は引用符付きキャメルケース
        const dbKey = unquotedColumns.has(key) ? key : key;
        const quotedKey = unquotedColumns.has(key) ? dbKey : `"${dbKey}"`;
        
        // themeIdの更新をログに記録
        if (key === 'themeId' && process.env.NODE_ENV === "development") {
          console.log("[profileQueries.update] Updating themeId:", value, "→ quotedKey:", quotedKey);
        }
        
        // 配列フィールドの処理（impressionTags, experienceTags, commonQuestions）
        if (Array.isArray(value)) {
          // pgライブラリはJavaScriptの配列を自動的にPostgreSQLの配列に変換する
          // 空配列も正しく処理される
          fields.push(`${quotedKey} = $${paramIndex}::TEXT[]`);
          values.push(value);
        } else if (value !== null && typeof value === 'object') {
          // JSONBフィールド（generatedJson）の処理
          fields.push(`${quotedKey} = $${paramIndex}::JSONB`);
          values.push(JSON.stringify(value));
        } else {
          // 通常のフィールド（文字列、数値、nullなど）
          fields.push(`${quotedKey} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push(`"updatedAt" = NOW()`);
    values.push(profileId);

    try {
      const queryText = `UPDATE profile_pages SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
      if (process.env.NODE_ENV === "development") {
        console.log("[profileQueries.update] Executing query:", queryText);
        console.log("[profileQueries.update] Values:", values.map((v, i) => 
          typeof v === 'object' && v !== null ? `[Object ${i}]` : v
        ));
      }
      
      const result = await queryOne<ProfilePage>(queryText, values);
      if (!result) throw new Error("Failed to update profile");
      
      if (process.env.NODE_ENV === "development") {
        console.log("[profileQueries.update] ✅ Success. themeId:", result.themeId, "hasGeneratedJson:", !!result.generatedJson);
      }
      
      return result;
    } catch (error) {
      console.error("Error in profileQueries.update:", {
        profileId,
        data,
        fields,
        values: values.map((v, i) => 
          typeof v === 'object' && v !== null ? `[Object ${i}]` : v
        ),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  },
};

/**
 * リンクアイテム関連のクエリ
 */
export const linkQueries = {
  /**
   * IDでリンクを取得
   */
  async findById(linkId: string): Promise<LinkItem | null> {
    return await queryOne<LinkItem>(
      `SELECT * FROM link_items WHERE id = $1 LIMIT 1`,
      [linkId]
    );
  },

  /**
   * ページIDでリンクを取得
   */
  async findByPageId(pageId: string): Promise<LinkItem[]> {
    return await query<LinkItem>(
      `SELECT * FROM link_items WHERE "pageId" = $1 ORDER BY "order" ASC`,
      [pageId]
    );
  },

  /**
   * リンクを作成
   */
  async create(data: {
    pageId: string;
    label: string;
    url: string;
    order: number;
  }): Promise<LinkItem> {
    const result = await queryOne<LinkItem>(
      `INSERT INTO link_items ("pageId", label, url, "order", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [data.pageId, data.label, data.url, data.order]
    );
    if (!result) throw new Error("Failed to create link");
    return result;
  },

  /**
   * リンクを更新
   */
  async update(linkId: string, data: Partial<Pick<LinkItem, "label" | "url" | "order">>): Promise<LinkItem> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        fields.push(`"${dbKey}" = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push(`"updatedAt" = NOW()`);
    values.push(linkId);

    const result = await queryOne<LinkItem>(
      `UPDATE link_items SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    if (!result) throw new Error("Failed to update link");
    return result;
  },

  /**
   * リンクを削除
   */
  async delete(linkId: string): Promise<void> {
    await query(`DELETE FROM link_items WHERE id = $1`, [linkId]);
  },

  /**
   * ページIDでリンク数をカウント
   */
  async countByPageId(pageId: string): Promise<number> {
    const result = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM link_items WHERE "pageId" = $1`,
      [pageId]
    );
    return result ? parseInt(result.count) : 0;
  },

  /**
   * ページIDで全てのリンクを削除
   */
  async deleteByPageId(pageId: string): Promise<void> {
    await query(`DELETE FROM link_items WHERE "pageId" = $1`, [pageId]);
  },
};
