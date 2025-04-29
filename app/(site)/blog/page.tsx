import { CalendarDays, Clock, User } from 'lucide-react';

const featuredPost = {
  title: "The Future of Stock Photography in 2024",
  excerpt: "Discover the emerging trends that will shape stock photography this year, from AI-generated content to authentic representation.",
  author: "Sarah Johnson",
  date: "Feb 15, 2024",
  readTime: "8 min read",
  image: "/blog/featured.jpg",
  category: "Industry Trends"
};

const posts = [
  {
    title: "10 Tips for Better Product Photography",
    excerpt: "Learn how to capture stunning product photos that sell.",
    author: "Mike Chen",
    date: "Feb 12, 2024",
    readTime: "6 min read",
    category: "Photography Tips"
  },
  {
    title: "Understanding Image Licensing",
    excerpt: "A comprehensive guide to image licenses and usage rights.",
    author: "Alex Thompson",
    date: "Feb 10, 2024",
    readTime: "5 min read",
    category: "Legal"
  },
  {
    title: "Color Theory in Photography",
    excerpt: "Master the art of color composition in your photos.",
    author: "Emma Davis",
    date: "Feb 8, 2024",
    readTime: "7 min read",
    category: "Photography Tips"
  },
  {
    title: "Building a Photography Portfolio",
    excerpt: "Essential tips for creating a portfolio that stands out.",
    author: "Chris Wilson",
    date: "Feb 5, 2024",
    readTime: "4 min read",
    category: "Career Advice"
  },
  {
    title: "The Rise of Mobile Photography",
    excerpt: "How smartphones are changing the photography landscape.",
    author: "Lisa Zhang",
    date: "Feb 3, 2024",
    readTime: "6 min read",
    category: "Technology"
  },
  {
    title: "Mastering Light in Photography",
    excerpt: "Understanding and utilizing different lighting techniques.",
    author: "David Brown",
    date: "Feb 1, 2024",
    readTime: "8 min read",
    category: "Photography Tips"
  }
];

export default function BlogPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              KlickStock Blog
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Insights, tutorials, and news from the world of photography
            </p>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500"></div>
            </div>
            <div className="p-8 lg:p-12">
              <div className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                {featuredPost.category}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center text-sm text-gray-500 space-x-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {featuredPost.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {featuredPost.readTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <div key={index} className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mb-4">
                    {post.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {post.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 