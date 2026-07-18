import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { BlogFrontmatter, BlogPost, BlogPostMeta, TocItem } from './blog-utils';
import { slugify } from './blog-utils';

export type { BlogFrontmatter, BlogPost, BlogPostMeta, TocItem };
export { slugify, formatDate } from './blog-utils';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
export const BLOG_BASE_URL = 'https://ilsem.vercel.app';

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

/** Convert ::: {.warning|tip|success} blocks into MDX components */
export function transformDirectives(content: string): string {
  return content
    .replace(
      /:::\{\.warning\}\s*\n([\s\S]*?)\n\s*:::/g,
      '<WarningBox>\n$1\n</WarningBox>'
    )
    .replace(
      /:::\{\.tip\}\s*\n([\s\S]*?)\n\s*:::/g,
      '<TipBox>\n$1\n</TipBox>'
    )
    .replace(
      /:::\{\.success\}\s*\n([\s\S]*?)\n\s*:::/g,
      '<SuccessBox>\n$1\n</SuccessBox>'
    );
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^##\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    items.push({ id: slugify(text), text });
  }

  return items;
}

function parsePostFile(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx$/, '');
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  const frontmatter = data as BlogFrontmatter;

  const readingMinutes =
    typeof frontmatter.readingMinutes === 'number'
      ? frontmatter.readingMinutes
      : Math.max(1, Math.ceil(stats.minutes));

  return {
    slug,
    title: frontmatter.title ?? slug,
    date: frontmatter.date ?? '',
    description: frontmatter.description ?? '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    image: frontmatter.image,
    customLayout: Boolean(frontmatter.customLayout),
    readingTime: `${readingMinutes} min read`,
    readingMinutes,
    content,
  };
}

export function getAllPosts(): BlogPostMeta[] {
  ensureBlogDir();

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  return files
    .map((file) => {
      const post = parsePostFile(file);
      const { content: _content, ...meta } = post;
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  ensureBlogDir();

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  return parsePostFile(`${slug}.mdx`);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getAdjacentPosts(slug: string): {
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) return { prev: null, next: null };

  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  getAllPosts().forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
