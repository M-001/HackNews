import { NextResponse } from "next/server";
import * as FetchService from "@/lib/services/fetchAndTranslate";

// 限制只允许Vercel Cron Jobs调用此API
function isVercelCronJob(request: Request): boolean {
  const userAgent = request.headers.get("user-agent") || "";
  return userAgent.includes("Vercel") || process.env.NODE_ENV === "development";
}

export async function GET(request: Request) {
  // 验证请求来源
  if (!isVercelCronJob(request)) {
    return NextResponse.json(
      { error: "未授权访问" },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  let success = true;
  const errors: string[] = [];

  try {
    // 获取并处理热门故事
    await FetchService.fetchAndTranslateTopStories(30);
    
    // 获取并处理最新故事
    await FetchService.fetchAndTranslateNewestStories(30);
    
    // 获取并处理Ask HN故事
    await FetchService.fetchAndTranslateAskStories(20);
  } catch (error) {
    success = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);
    console.error("Cron任务执行出错:", error);
  }

  const executionTime = (Date.now() - startTime) / 1000;

  return NextResponse.json({
    success,
    executionTime: `${executionTime.toFixed(2)}秒`,
    timestamp: new Date().toISOString(),
    errors: errors.length > 0 ? errors : undefined,
  });
}

// 为定时任务配置导出的配置
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5分钟最大执行时间 