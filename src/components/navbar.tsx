import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, TrendingUp, Clock, MessageSquare } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-orange-500 text-white">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span className="font-semibold">中文版Hacker News</span>
          </Link>
        </div>
        <nav className="ml-8 flex items-center space-x-6 text-sm font-medium">
          <Link href="/top" className="flex items-center transition-colors hover:text-white/80">
            <TrendingUp className="mr-1 h-4 w-4" />
            热门
          </Link>
          <Link href="/newest" className="flex items-center transition-colors hover:text-white/80">
            <Clock className="mr-1 h-4 w-4" />
            最新
          </Link>
          <Link href="/ask" className="flex items-center transition-colors hover:text-white/80">
            <MessageSquare className="mr-1 h-4 w-4" />
            问答
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:bg-orange-600 hover:text-white">
            登录
          </Button>
        </div>
      </div>
    </header>
  );
} 