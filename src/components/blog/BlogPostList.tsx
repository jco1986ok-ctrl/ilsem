'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { BlogPostMeta } from '@/lib/blog-utils';

type Props = {
  posts: BlogPostMeta[];
  tags: string[];
};

export default function BlogPostList({ posts, tags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const newestSlugs = useMemo(
    () => new Set(posts.slice(0, 2).map((post) => post.slug)),
    [posts]
  );

  const filtered = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((post) => post.tags.includes(activeTag));
  }, [posts, activeTag]);

  return (
    <div className="blog-list">
      {tags.length > 0 && (
        <div className="blog-tag-filters" role="group" aria-label="태그 필터">
          <button
            type="button"
            className={`blog-filter-chip ${activeTag === null ? 'is-active' : ''}`}
            onClick={() => setActiveTag(null)}
          >
            전체
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`blog-filter-chip ${activeTag === tag ? 'is-active' : ''}`}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="blog-empty">해당 태그의 글이 없습니다.</p>
      ) : (
        <ul className="blog-card-list">
          {filtered.map((post) => {
            const isNew = newestSlugs.has(post.slug);

            return (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="blog-card">
                  <h2 className="blog-card-title">
                    {isNew && <span className="blog-new-badge">NEW</span>}
                    {post.title}
                  </h2>
                  <p className="blog-card-desc">{post.description}</p>
                  {post.tags.length > 0 && (
                    <div className="blog-card-tags">
                      {post.tags.map((tag) => (
                        <span key={tag} className="blog-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
