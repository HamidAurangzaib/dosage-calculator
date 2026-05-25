import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'content/blog');

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Product {
  name: string;
  link: string;            // Amazon affiliate URL
  image?: string;          // optional: /products/xxx.jpg (self-hosted) — Amazon ToS bars hotlinking their CDN
  rating?: number;         // e.g. 4.6
  reviews?: number;        // e.g. 30841
  bestFor: string;         // short award label, e.g. "Best Unflavored Creatine"
  form: string;            // "Powder", "Capsules", "Powder (pre-workout)"
  servings?: string;       // "200 servings"
  dose?: string;           // "5g per serving"
  highlights: string[];    // bullet pros
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
  affiliate?: boolean; // set true on articles containing Amazon affiliate links — shows disclosure
  products?: Product[]; // optional product roundup (renders comparison table + cards)
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
        affiliate: data.affiliate || false,
        products: data.products || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}
