import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NewsPost } from '@/components/news/news-post'
import { RelatedPosts } from '@/components/news/related-posts'
import { getNewsItem, getNews } from '@/lib/api'

interface NewsPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: NewsPostPageProps): Promise<Metadata> {
  try {
    const response = await getNewsItem(params.slug)
    const article = response.data

    return {
      title: article.seo.meta_title || `${article.title} | CBK Racing News`,
      description: article.seo.meta_description || article.excerpt,
      keywords: [`${article.category}`, 'CBK Racing', 'motorsport', 'racing news'],
      authors: [{ name: article.author.name, url: article.author.email }],
      openGraph: {
        title: article.title,
        description: article.excerpt,
        type: 'article',
        publishedTime: article.published_at,
        authors: [article.author.name],
        tags: [article.category],
        images: article.cover_image ? [
          {
            url: article.cover_image.url,
            width: 1200,
            height: 630,
            alt: article.cover_image.alt || article.title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: article.cover_image ? [article.cover_image.url] : undefined,
      },
      alternates: {
        canonical: `/news/${params.slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'News Article | CBK Racing',
      description: 'Read the latest news from CBK Racing',
    }
  }
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  try {
    const response = await getNewsItem(params.slug)
    const article = response.data

    // Fetch related posts (same category, exclude current)
    const relatedResponse = await getNews({
      category: article.category,
      per_page: 4
    })
    const relatedPosts = relatedResponse.data.filter(post => post.id !== article.id).slice(0, 3)

    return (
      <div className="min-h-screen bg-white">
        <main>
          <NewsPost article={article} />
          {relatedPosts.length > 0 && (
            <RelatedPosts
              posts={relatedPosts}
              currentCategory={article.category}
            />
          )}
        </main>
      </div>
    )
  } catch (error) {
    notFound()
  }
}