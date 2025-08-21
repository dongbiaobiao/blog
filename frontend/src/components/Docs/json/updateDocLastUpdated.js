const fs = require('fs').promises;
const path = require('path');

// 配置：目标文档ID和JSON文件路径（根据项目结构调整！）
const TARGET_DOC_ID = 5; // CssFlexbox对应的文档ID
const JSON_FILE_PATH = path.resolve(__dirname, './docs.json'); // 你的docsData.json路径

/**
 * 获取当前日期，格式：YYYY-MM-DD
 */
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

/**
 * 核心函数：更新JSON中目标文档的lastUpdated字段
 */
const updateDocLastUpdated = async () => {
  try {
    // 1. 读取JSON文件内容
    const jsonContent = await fs.readFile(JSON_FILE_PATH, 'utf8');
    const docs = JSON.parse(jsonContent);

    // 2. 查找ID为5的文档
    const docIndex = docs.findIndex(doc => doc.id === TARGET_DOC_ID);
    if (docIndex === -1) {
      console.error(`❌ 错误：未在${JSON_FILE_PATH}中找到ID为${TARGET_DOC_ID}的文档`);
      return;
    }

    // 3. 更新lastUpdated为当前日期
    const currentDate = getCurrentDate();
    docs[docIndex].lastUpdated = currentDate;

    // 4. 写入更新后的内容（保持JSON格式缩进）
    await fs.writeFile(
      JSON_FILE_PATH,
      JSON.stringify(docs, null, 2), // 缩进2个空格，保持可读性
      'utf8'
    );

    console.log(`📝 已将文档"${docs[docIndex].title}"的lastUpdated更新为：${currentDate}`);

  } catch (error) {
    console.error('❌ 更新失败：', error.message);
    // 打印错误堆栈，便于调试
    console.error(error.stack);
  }
};

// 执行更新
updateDocLastUpdated();
    