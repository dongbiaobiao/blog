const chokidar = require('chokidar');
const { spawn } = require('child_process');
const path = require('path');

/**
 * Vite插件：监听CssFlexbox.jsx文件变化，自动更新docsData.json中的lastUpdated
 */
const updateDocPlugin = () => {
  let watcher;

  return {
    name: 'update-doc-lastupdated',

    // 当Vite配置解析完成后执行
    configResolved() {
      // 监听目标文件路径（根据你的项目结构调整！）
      // 示例：假设CssFlexbox.jsx在src目录下
      const targetFile = path.resolve(__dirname, './src/components/Docs/CssFlexbox.jsx');

      // 初始化文件监听器
      watcher = chokidar.watch(targetFile, {
        persistent: true,  // 保持监听状态
        ignoreInitial: true // 忽略初始加载时的事件
      });

      // 当文件被修改并保存时触发
      watcher.on('change', (changedFilePath) => {
        console.log(`\n🔄 检测到文件修改: ${path.basename(changedFilePath)}`);
        console.log('📅 正在更新文档最后修改时间...');

        // 执行更新JSON的脚本
        const updateScript = spawn('node', [
          path.resolve(__dirname, './src/components/Docs/json/updateDocLastUpdated.js')
        ], {
          stdio: 'inherit' // 继承终端输出，便于查看日志
        });

        // 脚本执行完成后
        updateScript.on('close', (code) => {
          if (code === 0) {
            console.log('✅ 文档时间更新成功');
          } else {
            console.error(`❌ 脚本执行失败，退出码: ${code}`);
          }
        });
      });
    },

    // 当Vite关闭时清理监听器
    closeBundle() {
      if (watcher) {
        watcher.close();
        console.log('📌 已停止文件监听');
      }
    }
  };
};

module.exports = updateDocPlugin;
