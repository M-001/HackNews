/**
 * 翻译服务
 * 使用OpenRouter API进行英文到中文的翻译
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * 使用OpenRouter API翻译文本
 * @param text 需要翻译的文本
 * @param targetLanguage 目标语言，默认为中文
 * @returns 翻译后的文本
 */
export async function translateText(text: string, targetLanguage: string = '中文'): Promise<string> {
  if (!text || text.trim() === '') {
    return '';
  }
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://github.com/yourusername/hack_news',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat:free',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的翻译引擎，将内容从英文翻译为${targetLanguage}，保持原文的格式和风格。
翻译应该流畅自然，符合目标语言的表达习惯。
保留原文中的所有代码片段、链接和特殊格式不变。
对于技术术语，尽量使用目标语言中广泛接受的翻译。`
          },
          {
            role: 'user',
            content: `请将以下文本翻译成${targetLanguage}:\n\n${text}`
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`翻译请求失败: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('翻译出错:', error);
    return text; // 出错时返回原文
  }
}

/**
 * 批量翻译多个文本
 * @param texts 需要翻译的文本数组
 * @param targetLanguage 目标语言，默认为中文
 * @returns 翻译后的文本数组
 */
export async function batchTranslate(texts: string[], targetLanguage: string = '中文'): Promise<string[]> {
  // 过滤空文本
  const validTexts = texts.filter(text => text && text.trim() !== '');
  
  if (validTexts.length === 0) {
    return [];
  }
  
  // 为了减少API调用次数，我们将多个短文本合并成一个请求
  // 但限制总字符数，避免超出API限制
  const MAX_CHARS_PER_REQUEST = 8000;
  const batches: string[][] = [[]];
  let currentBatchIndex = 0;
  let currentBatchSize = 0;
  
  for (const text of validTexts) {
    // 如果当前批次加上新文本会超出限制，创建新批次
    if (currentBatchSize + text.length + 10 > MAX_CHARS_PER_REQUEST) {
      batches.push([]);
      currentBatchIndex++;
      currentBatchSize = 0;
    }
    
    batches[currentBatchIndex].push(text);
    currentBatchSize += text.length + 10; // +10 是分隔符的估计长度
  }
  
  // 处理每个批次
  const results: string[] = [];
  
  for (const batch of batches) {
    // 使用特殊分隔符合并文本，确保能够准确拆分
    const separator = `\n===DIVIDER_${Date.now()}_${Math.random().toString(36).substring(2, 10)}===\n`;
    const combinedText = batch.join(separator);
    
    const translatedCombined = await translateText(combinedText, targetLanguage);
    
    // 拆分翻译结果
    const translatedTexts = translatedCombined.split(separator);
    
    if (translatedTexts.length !== batch.length) {
      // 如果翻译结果数量与原文不一致，则逐个翻译
      for (const text of batch) {
        const translated = await translateText(text, targetLanguage);
        results.push(translated);
      }
    } else {
      results.push(...translatedTexts);
    }
  }
  
  // 确保返回结果数量与输入一致
  while (results.length < texts.length) {
    results.push('');
  }
  
  return results.slice(0, texts.length);
} 