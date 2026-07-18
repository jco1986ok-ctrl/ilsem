'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { BlogPostMeta } from '@/lib/blog-utils';

const PAGE_SIZE = 10;

type Props = {
  posts: BlogPostMeta[];
  tags: string[];
};

export default function BlogPostList({ posts, tags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const newestSlugs = useMemo(
    () => new Set(posts.slice(0, 2).map((post) => post.slug)),
    [posts]
  );

  const filtered = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((post) => post.tags.includes(activeTag));
  }, [posts, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [activeTag]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      <div className="blog-board-meta">
        전체 {filtered.length}건
        {totalPages > 1 && (
          <span>
            {' '}
            · {page}/{totalPages} 페이지
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="blog-empty">해당 태그의 글이 없습니다.</p>
      ) : (
        <>
          <ul className="blog-card-list">
            {pageItems.map((post) => {
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

          {totalPages > 1 && (
            <nav className="blog-pagination" aria-label="페이지 이동">
              <button
                type="button"
                className="blog-page-btn"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                이전
              </button>

              <div className="blog-page-numbers">
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`blog-page-num ${page === num ? 'is-active' : ''}`}
                    onClick={() => goToPage(num)}
                    aria-current={page === num ? 'page' : undefined}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="blog-page-btn"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                다음
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
