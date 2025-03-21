/**
 * 数据库服务
 * 处理故事和评论的数据库操作
 */

import { PrismaClient } from '@prisma/client';
import { HNStory, HNComment } from './hackernews';

// 初始化Prisma客户端
const prisma = new PrismaClient();

/**
 * 保存故事到数据库
 * 如果已存在则更新
 */
export async function saveStory(story: HNStory, titleTranslated?: string, textTranslated?: string) {
  return await prisma.story.upsert({
    where: { id: story.id },
    update: {
      title: story.title,
      titleTranslated: titleTranslated,
      url: story.url,
      score: story.score,
      by: story.by,
      time: new Date(story.time * 1000),
      descendants: story.descendants || 0,
      text: story.text,
      textTranslated: textTranslated,
      type: story.type,
      lastFetched: new Date(),
    },
    create: {
      id: story.id,
      title: story.title,
      titleTranslated: titleTranslated,
      url: story.url,
      score: story.score,
      by: story.by,
      time: new Date(story.time * 1000),
      descendants: story.descendants || 0,
      text: story.text,
      textTranslated: textTranslated,
      type: story.type,
      lastFetched: new Date(),
    },
  });
}

/**
 * 批量保存故事到数据库
 */
export async function saveStories(stories: HNStory[], translatedTitles?: string[], translatedTexts?: string[]) {
  const savePromises = stories.map((story, index) => {
    const titleTranslated = translatedTitles?.[index];
    const textTranslated = translatedTexts?.[index];
    return saveStory(story, titleTranslated, textTranslated);
  });
  
  return await Promise.all(savePromises);
}

/**
 * 保存评论到数据库
 */
export async function saveComment(comment: HNComment, textTranslated?: string) {
  return await prisma.comment.upsert({
    where: { id: comment.id },
    update: {
      parent: comment.parent,
      by: comment.by,
      time: new Date(comment.time * 1000),
      text: comment.text,
      textTranslated: textTranslated,
      kids: comment.kids || [],
      lastFetched: new Date(),
    },
    create: {
      id: comment.id,
      parent: comment.parent,
      by: comment.by,
      time: new Date(comment.time * 1000),
      text: comment.text,
      textTranslated: textTranslated,
      kids: comment.kids || [],
      storyId: null, // 需要另外设置
      lastFetched: new Date(),
    },
  });
}

/**
 * 批量保存评论到数据库
 */
export async function saveComments(comments: HNComment[], translatedTexts?: string[]) {
  const savePromises = comments.map((comment, index) => {
    const textTranslated = translatedTexts?.[index];
    return saveComment(comment, textTranslated);
  });
  
  return await Promise.all(savePromises);
}

/**
 * 关联评论到故事
 */
export async function linkCommentsToStory(storyId: number, commentIds: number[]) {
  if (!commentIds || commentIds.length === 0) {
    return;
  }
  
  const updatePromises = commentIds.map(commentId => 
    prisma.comment.update({
      where: { id: commentId },
      data: { storyId },
    })
  );
  
  return await Promise.all(updatePromises);
}

/**
 * 获取最新的故事列表
 */
export async function getLatestStories(type: string, limit: number = 30, offset: number = 0) {
  return await prisma.story.findMany({
    where: {
      type,
    },
    orderBy: {
      time: 'desc',
    },
    take: limit,
    skip: offset,
  });
}

/**
 * 获取最高分的故事列表
 */
export async function getTopStories(type: string, limit: number = 30, offset: number = 0) {
  return await prisma.story.findMany({
    where: {
      type,
    },
    orderBy: {
      score: 'desc',
    },
    take: limit,
    skip: offset,
  });
}

/**
 * 获取故事详情
 */
export async function getStoryById(id: number) {
  return await prisma.story.findUnique({
    where: { id },
  });
}

/**
 * 获取故事的评论
 */
export async function getStoryComments(storyId: number) {
  return await prisma.comment.findMany({
    where: {
      storyId,
    },
    orderBy: {
      time: 'asc',
    },
  });
}

/**
 * 获取评论详情
 */
export async function getCommentById(id: number) {
  return await prisma.comment.findUnique({
    where: { id },
  });
} 