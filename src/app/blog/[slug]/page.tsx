import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from '@/components/blog/mdx-components';
import PostNavigation from '@/components/blog/PostNavigation';
import TableOfContents from '@/components/blog/TableOfContents';
import {
  extractToc,
  getAdjacentPosts,
  getAllSlugs,
  getPostBySlug,
  transformDirectives,
} from '@/lib/blog';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: '글을 찾을 수 없습니다' };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      tags: post.tags,
      ...(post.image
        ? { images: [{ url: post.image, alt: post.title }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(post.image ? { images: [post.image] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const source = transformDirectives(post.content);
  const toc = post.customLayout ? [] : extractToc(post.content);
  const { prev, next } = getAdjacentPosts(slug);

  return (
    <div className="blog-post-page">
      <div className="blog-post-layout">
        <article className="blog-post-main">
          <Link href="/blog" className="blog-back-link">
            ← 블로그 목록
          </Link>

          {!post.customLayout && (
            <header className="blog-post-header">
              <h1 className="blog-post-title">{post.title}</h1>
              <p className="blog-post-meta">{post.readingMinutes}분 소요</p>
              {post.tags.length > 0 && (
                <div className="blog-post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="blog-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
          )}

          <div className={post.customLayout ? undefined : 'blog-prose'}>
            <MDXRemote
              source={source}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </div>

          <PostNavigation prev={prev} next={next} />
        </article>

        {!post.customLayout && <TableOfContents items={toc} />}
      </div>
    </div>
  );
}
