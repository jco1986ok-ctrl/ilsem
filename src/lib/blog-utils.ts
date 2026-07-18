export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\uac00-\ud7a3\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export type BlogFrontmatter = {
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
  readingTime: string;
  readingMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

export type TocItem = {
  id: string;
  text: string;
};
