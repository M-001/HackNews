import { Navbar } from "@/components/navbar";
import { StoryCard } from "@/components/story-card";
import { getTopStories } from "@/lib/services/database";

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 每5分钟重新验证数据

export default async function Home() {
  // 获取热门故事
  const stories = await getTopStories('story', 30);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl">
        <h1 className="text-2xl font-bold mb-6">热门技术资讯</h1>
        
        <div className="grid gap-4">
          {stories.length > 0 ? (
            stories.map(story => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                titleTranslated={story.titleTranslated || undefined}
                url={story.url || undefined}
                score={story.score || undefined}
                by={story.by}
                time={story.time}
                descendants={story.descendants || 0}
                storyType={story.type}
                showTranslation={true}
              />
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-lg text-gray-500">正在获取数据，请稍候...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
