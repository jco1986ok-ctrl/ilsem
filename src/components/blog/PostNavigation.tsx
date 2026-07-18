import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/blog-utils';

type Props = {
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
};

export default function PostNavigation({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav className="blog-post-nav" aria-label="이전/다음 글">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="blog-post-nav-link prev">
          <span className="blog-post-nav-label">이전 글</span>
          <span className="blog-post-nav-title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/blog/${next.slug}`} className="blog-post-nav-link next">
          <span className="blog-post-nav-label">다음 글</span>
          <span className="blog-post-nav-title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
