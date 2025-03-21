/**
 * 数据获取和翻译服务
 * 从Hacker News API获取数据，翻译后存储到数据库
 */

import * as HackerNews from './hackernews.js';
import * as Translate from './translate.js';
import * as Database from './database.js';

/**
 * 获取并翻译热门故事
 */
export async function fetchAndTranslateTopStories(limit: number = 30): Promise<void> {
  console.log(`开始获取热门故事，数量: ${limit}`);
  
  try {
    // 获取热门故事ID
    const ids = await HackerNews.getStoryIds('top', limit);
    console.log(`获取到 ${ids.length} 个故事ID`);
    
    // 获取故事详情
    const stories = await HackerNews.getStories(ids);
    console.log(`获取到 ${stories.length} 个故事详情`);
    
    // 提取需要翻译的文本
    const titles = stories.map(story => story.title);
    const texts = stories.map(story => story.text || '');
    
    // 翻译标题
    console.log('开始翻译标题...');
    const translatedTitles = await Translate.batchTranslate(titles);
    console.log('标题翻译完成');
    
    // 翻译正文（如果有）
    console.log('开始翻译正文...');
    const translatedTexts = await Translate.batchTranslate(texts);
    console.log('正文翻译完成');
    
    // 保存到数据库
    console.log('将故事保存到数据库...');
    await Database.saveStories(stories, translatedTitles, translatedTexts);
    console.log('故事保存完成');
    
    // 获取并处理评论
    for (const story of stories) {
      if (story.kids && story.kids.length > 0) {
        console.log(`处理故事#${story.id}的评论...`);
        await fetchAndTranslateComments(story.id, story.kids);
      }
    }
    
    console.log('所有数据处理完成');
  } catch (error) {
    console.error('获取和翻译故事时出错:', error);
    throw error;
  }
}

/**
 * 获取并翻译评论
 */
export async function fetchAndTranslateComments(storyId: number, commentIds: number[], maxDepth: number = 2): Promise<void> {
  if (!commentIds || commentIds.length === 0) {
    return;
  }
  
  try {
    // 获取评论内容
    const comments = await HackerNews.getCommentTree(commentIds, maxDepth);
    console.log(`获取到 ${comments.length} 条评论`);
    
    // 提取需要翻译的文本
    const texts = comments.map(comment => comment.text || '');
    
    // 翻译评论
    console.log('开始翻译评论...');
    const translatedTexts = await Translate.batchTranslate(texts);
    console.log('评论翻译完成');
    
    // 保存评论到数据库
    console.log('将评论保存到数据库...');
    await Database.saveComments(comments, translatedTexts);
    console.log('评论保存完成');
    
    // 关联评论到故事
    await Database.linkCommentsToStory(storyId, comments.map(comment => comment.id));
    console.log(`已关联 ${comments.length} 条评论到故事 #${storyId}`);
  } catch (error) {
    console.error('获取和翻译评论时出错:', error);
    throw error;
  }
}

/**
 * 获取并翻译最新故事
 */
export async function fetchAndTranslateNewestStories(limit: number = 30): Promise<void> {
  console.log(`开始获取最新故事，数量: ${limit}`);
  
  try {
    // 获取最新故事ID
    const ids = await HackerNews.getStoryIds('new', limit);
    console.log(`获取到 ${ids.length} 个故事ID`);
    
    // 获取故事详情
    const stories = await HackerNews.getStories(ids);
    console.log(`获取到 ${stories.length} 个故事详情`);
    
    // 提取需要翻译的文本
    const titles = stories.map(story => story.title);
    const texts = stories.map(story => story.text || '');
    
    // 翻译标题
    console.log('开始翻译标题...');
    const translatedTitles = await Translate.batchTranslate(titles);
    console.log('标题翻译完成');
    
    // 翻译正文（如果有）
    console.log('开始翻译正文...');
    const translatedTexts = await Translate.batchTranslate(texts);
    console.log('正文翻译完成');
    
    // 保存到数据库
    console.log('将故事保存到数据库...');
    await Database.saveStories(stories, translatedTitles, translatedTexts);
    console.log('故事保存完成');
  } catch (error) {
    console.error('获取和翻译故事时出错:', error);
    throw error;
  }
}

/**
 * 获取并翻译Ask HN故事
 */
export async function fetchAndTranslateAskStories(limit: number = 30): Promise<void> {
  console.log(`开始获取Ask HN故事，数量: ${limit}`);
  
  try {
    // 获取Ask HN故事ID
    const ids = await HackerNews.getStoryIds('ask', limit);
    console.log(`获取到 ${ids.length} 个故事ID`);
    
    // 获取故事详情
    const stories = await HackerNews.getStories(ids);
    console.log(`获取到 ${stories.length} 个故事详情`);
    
    // 提取需要翻译的文本
    const titles = stories.map(story => story.title);
    const texts = stories.map(story => story.text || '');
    
    // 翻译标题
    console.log('开始翻译标题...');
    const translatedTitles = await Translate.batchTranslate(titles);
    console.log('标题翻译完成');
    
    // 翻译正文（如果有）
    console.log('开始翻译正文...');
    const translatedTexts = await Translate.batchTranslate(texts);
    console.log('正文翻译完成');
    
    // 保存到数据库
    console.log('将故事保存到数据库...');
    await Database.saveStories(stories, translatedTitles, translatedTexts);
    console.log('故事保存完成');
    
    // 获取并处理评论
    for (const story of stories) {
      if (story.kids && story.kids.length > 0) {
        console.log(`处理故事#${story.id}的评论...`);
        await fetchAndTranslateComments(story.id, story.kids);
      }
    }
    
    console.log('所有数据处理完成');
  } catch (error) {
    console.error('获取和翻译故事时出错:', error);
    throw error;
  }
} 