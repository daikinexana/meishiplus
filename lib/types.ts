// データベースの型定義（Prismaスキーマから移行）

export interface User {
  id: string;
  clerkId: string;
  email: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface ProfilePage {
  id: string;
  userId: string;
  slug: string;
  isPublished: boolean;
  role: string | null;
  audience: string | null;
  impressionTags: string[];
  name: string | null;
  photoUrl: string | null;
  headline: string | null;
  tagline: string | null;
  whoHelp: string | null;
  situation: string | null;
  reasonText: string | null;
  valueText: string | null;
  notFitText: string | null;
  experienceTags: string[];
  commonQuestions: string[];
  humanText: string | null;
  tone: string | null;
  themeId: string | null;
  generatedJson: any | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkItem {
  id: string;
  pageId: string;
  label: string;
  url: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfilePageWithLinks extends ProfilePage {
  links: LinkItem[];
}
