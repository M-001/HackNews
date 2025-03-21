import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoryById, getStoryComments } from "@/lib/services/database";
import { ArrowUpRight, Heart, CornerDownRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 每5分钟重新验证数据

interface CommentProps {
  id: number;
  by: string;
  text: string;
  textTranslated?: string | null;
  time: Date;
  showTranslation: boolean;
}

function Comment({ id, by, text, textTranslated, time, showTranslation }: CommentProps) {
  const displayText = showTranslation && textTranslated ? textTranslated : text;
  
  // 渲染HTML内容（HN的评论包含HTML）
  function createMarkup(content: string) {
    return { __html: content };
  }
  
  return (
    <div className="border border-gray-200 rounded-md p-4 mb-4">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <span className="font-medium mr-2">{by}</span>
        <span>
          {new Date(time).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={createMarkup(displayText)} />
      </div>
      
      {showTranslation && textTranslated && text !== textTranslated && (
        <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer">查看原文</summary>
            <div className="mt-2 prose prose-sm max-w-none opacity-80">
              <div dangerouslySetInnerHTML={createMarkup(text)} />
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default async function StoryPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  
  // 获取故事详情
  const story = await getStoryById(id);
  
  // 获取评论
  const comments = await getStoryComments(id);
  
  if (!story) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-screen-xl">
          <div className="p-8 text-center">
            <p className="text-lg text-gray-500">故事不存在或已被删除</p>
          </div>
        </div>
      </main>
    );
  }
  
  const displayTitle = story.titleTranslated || story.title;
  const displayText = story.textTranslated || story.text;
  const hostname = story.url ? new URL(story.url).hostname.replace(/^www\./, "") : null;
  
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl">
        <Card className="mb-8 overflow-hidden border border-border/40">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xl sm:text-2xl font-medium">
              {displayTitle}
              {hostname && (
                <span className="ml-2 text-sm text-muted-foreground">
                  <Link 
                    href={story.url || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center hover:text-orange-600 transition-colors"
                  >
                    ({hostname}) <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </span>
              )}
            </CardTitle>
          </CardHeader>
          
          {displayText && (
            <CardContent className="p-4 prose prose-orange max-w-none">
              <div dangerouslySetInnerHTML={{ __html: displayText }} />
              
              {story.titleTranslated && story.title !== story.titleTranslated && (
                <details className="text-xs text-gray-500 mt-4">
                  <summary className="cursor-pointer">查看原标题</summary>
                  <p className="mt-1">{story.title}</p>
                </details>
              )}
              
              {story.textTranslated && story.text && story.text !== story.textTranslated && (
                <details className="text-xs text-gray-500 mt-4">
                  <summary className="cursor-pointer">查看原文</summary>
                  <div className="mt-2 prose prose-sm max-w-none opacity-80" dangerouslySetInnerHTML={{ __html: story.text }} />
                </details>
              )}
            </CardContent>
          )}
          
          <CardFooter className="p-4 flex items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-orange-500" />
              <span className="mr-3">{story.score || 0} 分</span>
            </div>
            <div className="mr-3">
              由 <span className="font-medium">{story.by}</span> 发布于 {new Date(story.time).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
            <div className="flex items-center">
              <CornerDownRight className="h-4 w-4 mr-1" />
              <span>{story.descendants || 0} 评论</span>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">评论 ({comments.length})</h2>
          
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  by={comment.by}
                  text={comment.text}
                  textTranslated={comment.textTranslated}
                  time={comment.time}
                  showTranslation={true}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">暂无评论</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 