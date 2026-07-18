import type { Metadata } from 'next';
import BlogPostList from '@/components/blog/BlogPostList';
import { getAllPosts, getAllTags } from '@/lib/blog';

export const metadata: Metadata = {
  title: '일셈 블로그 — 노동자가 꼭 알아야 할 정보',
  description:
    '산재보상, 퇴직금, 연차수당, 부당해고 등 노동자가 꼭 알아야 할 실무 정보를 쉽게 정리합니다.',
  openGraph: {
    title: '일셈 블로그 — 노동자가 꼭 알아야 할 정보',
    description:
      '산재보상, 퇴직금, 연차수당, 부당해고 등 노동자가 꼭 알아야 할 실무 정보를 쉽게 정리합니다.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="blog-list-page">
      <header className="blog-list-header">
        <h1 className="blog-list-title">일셈 블로그</h1>
        <p className="blog-list-subtitle">노동자가 꼭 알아야 할 정보</p>
      </header>
      <BlogPostList posts={posts} tags={tags} />
    </div>
  );
}
