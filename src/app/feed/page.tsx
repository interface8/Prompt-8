'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, Sparkles, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { prompts } from '@/data/mockData';

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('foryou');
  const [newPrompt, setNewPrompt] = useState('');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Handle post creation
  const handleCreatePost = () => {
    if (!newPrompt.trim()) return;
    
    const newPost = {
      id: `post-${Date.now()}`,
      type: 'post' as const,
      author: {
        name: session.user?.name || 'Anonymous',
        avatar: session.user?.image || 'https://ui-avatars.com/api/?name=User',
        verified: false,
      },
      timestamp: new Date().toISOString(),
      content: newPrompt,
      prompt: {
        title: 'New Post',
        domain: 'General',
        category: 'Discussion',
        preview: newPrompt.substring(0, 200),
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
      isLiked: false,
      isBookmarked: false,
    };
    
    setPosts([newPost, ...posts]);
    setNewPrompt('');
  };

  // Mock feed items based on prompts data + user posts
  const feedItems = [
    ...posts,
    ...prompts.slice(0, 10).map(prompt => ({
      id: prompt.id,
      type: 'prompt' as const,
      author: {
        name: prompt.creator.name,
        avatar: prompt.creator.avatar,
        verified: prompt.creator.verified,
      },
      timestamp: new Date(prompt.createdAt).toISOString(),
      content: prompt.description,
      prompt: {
        title: prompt.title,
        domain: prompt.domain,
        category: prompt.category,
        preview: prompt.description.substring(0, 200),
      },
      stats: {
        likes: prompt.purchaseCount,
        comments: prompt.reviewCount,
        shares: Math.floor(prompt.purchaseCount / 2),
      },
      isLiked: false,
      isBookmarked: false,
    }))
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Stats */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-6">
              <Card className="border-2 border-gray-800 bg-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Prompts</span>
                      <span className="text-gray-100 font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Followers</span>
                      <span className="text-gray-100 font-medium">234</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Following</span>
                      <span className="text-gray-100 font-medium">89</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-800 bg-gray-900">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    Trending Tags
                  </h3>
                  <div className="space-y-2">
                    {['AI', 'GPT-4', 'ChatGPT', 'Midjourney', 'DALL-E'].map((tag) => (
                      <button
                        key={tag}
                        className="block w-full text-left text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Create Post */}
            <Card className="border-2 border-gray-800 bg-gray-900">
              <CardContent className="p-4 sm:p-6">
                <div className="flex gap-3 sm:gap-4">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full hidden sm:block"
                    />
                  )}
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Share a prompt or start a discussion..."
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 min-h-[80px] resize-none text-sm"
                    />
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs cursor-pointer hover:bg-gray-800">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Prompt
                        </Badge>
                        <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs cursor-pointer hover:bg-gray-800">
                          Discussion
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-sm"
                        onClick={handleCreatePost}
                        disabled={!newPrompt.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-gray-900 border border-gray-800 grid grid-cols-3">
                <TabsTrigger value="foryou" className="data-[state=active]:bg-indigo-600 text-xs sm:text-sm">
                  For You
                </TabsTrigger>
                <TabsTrigger value="following" className="data-[state=active]:bg-indigo-600 text-xs sm:text-sm">
                  Following
                </TabsTrigger>
                <TabsTrigger value="trending" className="data-[state=active]:bg-indigo-600 text-xs sm:text-sm">
                  Trending
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4 mt-6">
                {feedItems.map((item) => (
                  <FeedCard key={item.id} item={item} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Suggestions */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-6">
              <Card className="border-2 border-gray-800 bg-gray-900">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Suggested Creators
                  </h3>
                  <div className="space-y-4">
                    {prompts.slice(0, 3).map((prompt) => (
                      <div key={prompt.id} className="flex items-center gap-3">
                        <Image
                          src={prompt.creator.avatar}
                          alt={prompt.creator.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-100 truncate">
                            {prompt.creator.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {prompt.domain}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 text-xs">
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-indigo-600/50 bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-100 mb-2">
                    Go Premium
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Unlock advanced features and creator tools
                  </p>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-sm">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface FeedCardProps {
  item: {
    id: string;
    author: {
      name: string;
      avatar: string;
      verified: boolean;
    };
    timestamp: string;
    content: string;
    prompt: {
      title: string;
      domain: string;
      category: string;
      preview: string;
    };
    stats: {
      likes: number;
      comments: number;
      shares: number;
    };
    isLiked: boolean;
    isBookmarked: boolean;
  };
}

function FeedCard({ item }: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(item.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(item.isBookmarked);
  const [likeCount, setLikeCount] = useState(item.stats.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Card className="border-2 border-gray-800 bg-gray-900 hover:border-gray-700 transition-colors">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Image
            src={item.author.avatar}
            alt={item.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-gray-100">{item.author.name}</p>
              {item.author.verified && (
                <Badge className="bg-blue-600 text-xs px-1.5 py-0">✓</Badge>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {new Date(item.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-300 mb-3">{item.content}</p>

        {/* Prompt Preview */}
        <Link href={`/prompt/${item.id}`}>
          <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer">
            <div className="flex items-start gap-2 mb-2 flex-wrap">
              <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-600/30 text-xs">
                {item.prompt.domain}
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                {item.prompt.category}
              </Badge>
            </div>
            <h4 className="text-sm font-semibold text-gray-100 mb-2">{item.prompt.title}</h4>
            <p className="text-xs text-gray-400 line-clamp-2">{item.prompt.preview}...</p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 sm:gap-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs sm:text-sm">{likeCount}</span>
            </button>
            <button className="flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-indigo-400 transition-colors">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">{item.stats.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-green-400 transition-colors">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm hidden sm:inline">{item.stats.shares}</span>
            </button>
          </div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`transition-colors ${
              isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
