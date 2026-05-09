import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'content/blog');

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  lastUpdated?: string;
  content: string;
  keywords: string[];
  references: string[];
  reviewedBy?: string;
  faq?: FaqItem[];
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx'));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: data.slug || file.replace('.mdx', ''),
        title: data.title,
        description: data.description,
        date: data.date,
        lastUpdated: data.lastUpdated,
        content,
        keywords: data.keywords || [],
        references: data.references || [],
        reviewedBy: data.reviewedBy,
        faq: data.faq || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}
