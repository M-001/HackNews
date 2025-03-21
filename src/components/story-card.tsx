import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowUpRight, MessageSquare, Heart } from "lucide-react";

interface StoryCardProps {
  id: number;
  title: string;
  titleTranslated?: string;
  url?: string;
  score?: number;
  by: string;
  time: Date;
  descendants: number;
  storyType: string;
  showTranslation: boolean;
}

export function StoryCard({
  id,
  title,
  titleTranslated,
  url,
  score,
  by,
  time,
  descendants,
  storyType,
  showTranslation = true,
}: StoryCardProps) {
  const displayTitle = showTranslation && titleTranslated ? titleTranslated : title;
  const hostname = url ? new URL(url).hostname.replace(/^www\./, "") : null;
  const timeAgo = new Date(time).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <Card className="mb-4 overflow-hidden border border-border/40 hover:border-orange-300 transition-all">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base sm:text-lg font-medium line-clamp-2">
          <Link href={`/item/${id}`} className="hover:text-orange-600 transition-colors">
            {displayTitle}
          </Link>
          {hostname && (
            <span className="ml-2 text-sm text-muted-foreground">
              <Link 
                href={url || "#"} 
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
      <CardContent className="p-4 pt-1 text-sm text-muted-foreground">
        {showTranslation && titleTranslated && title !== titleTranslated && (
          <p className="text-xs text-gray-500 italic mb-2">原标题: {title}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center text-xs text-muted-foreground">
        <div className="flex items-center">
          <Heart className="h-3 w-3 mr-1 text-orange-500" />
          <span className="mr-3">{score || 0} 分</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="h-3 w-3 mr-1" />
          <Link href={`/item/${id}`} className="hover:text-orange-600 transition-colors mr-3">
            {descendants || 0} 评论
          </Link>
        </div>
        <div>
          由 <span className="font-medium">{by}</span> 发布于 {timeAgo}
        </div>
      </CardFooter>
    </Card>
  );
} 