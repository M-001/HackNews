/**
 * 初始化数据脚本
 * 用于首次运行时获取和翻译数据
 */

import * as FetchService from '../lib/services/fetchAndTranslate.js';

async function main() {
  console.log('开始初始化数据...');
  
  try {
    // 获取并翻译热门故事
    console.log('====== 开始获取热门故事 ======');
    await FetchService.fetchAndTranslateTopStories(10);
    console.log('热门故事处理完成\n');
    
    // 获取并翻译最新故事
    console.log('====== 开始获取最新故事 ======');
    await FetchService.fetchAndTranslateNewestStories(10);
    console.log('最新故事处理完成\n');
    
    // 获取并翻译Ask HN故事
    console.log('====== 开始获取Ask HN故事 ======');
    await FetchService.fetchAndTranslateAskStories(5);
    console.log('Ask HN故事处理完成\n');
    
    console.log('数据初始化完成！');
  } catch (error) {
    console.error('数据初始化出错:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

main(); 