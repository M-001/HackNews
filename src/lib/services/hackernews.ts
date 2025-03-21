/**
 * Hacker News API 服务
 * 使用官方Firebase API获取故事和评论数据
 */

const API_BASE_URL = process.env.HACKER_NEWS_API_URL || 'https://hacker-news.firebaseio.com/v0';

// 请求配置
const fetchConfig = {
  timeout: 10000, // 10秒超时
  retries: 3, // 最多重试3次
  retryDelay: 1000, // 重试间隔1秒
};

/**
 * 带重试机制的fetch请求
 */
async function fetchWithRetry(url: string, retries = fetchConfig.retries): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fetchConfig.timeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, fetchConfig.retryDelay));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export type StoryType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

export interface HNStory {
  id: number;
  deleted?: boolean;
  type: string;
  by: string;
  time: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title: string;
  parts?: number[];
  descendants?: number;
}

export interface HNComment {
  id: number;
  deleted?: boolean;
  type: string;
  by: string;
  time: number;
  text: string;
  dead?: boolean;
  parent: number;
  kids?: number[];
}

/**
 * 获取指定类型的故事ID列表
 */
export async function getStoryIds(type: StoryType = 'top', limit: number = 30): Promise<number[]> {
  const response = await fetchWithRetry(`${API_BASE_URL}/${type}stories.json`);
  if (!response.ok) {
    throw new Error(`获取故事列表失败: ${response.statusText}`);
  }
  
  const ids = await response.json() as number[];
  return ids.slice(0, limit);
}

/**
 * 获取单个故事详情
 */
export async function getStory(id: number): Promise<HNStory> {
  const response = await fetchWithRetry(`${API_BASE_URL}/item/${id}.json`);
  if (!response.ok) {
    throw new Error(`获取故事详情失败: ${response.statusText}`);
  }
  
  return await response.json() as HNStory;
}

/**
 * 批量获取多个故事详情
 */
export async function getStories(ids: number[]): Promise<HNStory[]> {
  const promises = ids.map(id => getStory(id));
  const stories = await Promise.all(promises);
  return stories.filter(story => !story.deleted && !story.dead);
}

/**
 * 获取评论详情
 */
export async function getComment(id: number): Promise<HNComment> {
  const response = await fetchWithRetry(`${API_BASE_URL}/item/${id}.json`);
  if (!response.ok) {
    throw new Error(`获取评论失败: ${response.statusText}`);
  }
  
  return await response.json() as HNComment;
}

/**
 * 批量获取多个评论详情
 */
export async function getComments(ids: number[]): Promise<HNComment[]> {
  // 分批获取评论，每批10个
  const batchSize = 10;
  const batches = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    batches.push(ids.slice(i, i + batchSize));
  }
  
  const allComments = [];
  for (const batch of batches) {
    const promises = batch.map(id => getComment(id));
    const comments = await Promise.all(promises);
    allComments.push(...comments);
    // 每批之间暂停1秒，避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return allComments.filter(comment => !comment.deleted && !comment.dead);
}

/**
 * 获取完整的评论树
 * 递归获取所有子评论
 */
export async function getCommentTree(rootIds: number[], maxDepth: number = 3): Promise<HNComment[]> {
  if (!rootIds || rootIds.length === 0 || maxDepth <= 0) {
    return [];
  }
  
  const comments = await getComments(rootIds);
  
  // 递归获取子评论，但限制深度以避免过多请求
  if (maxDepth > 1) {
    for (const comment of comments) {
      if (comment.kids && comment.kids.length > 0) {
        const childComments = await getCommentTree(comment.kids, maxDepth - 1);
        // 将子评论信息附加到现有数据结构中
        (comment as any).childComments = childComments;
      }
    }
  }
  
  return comments;
} 