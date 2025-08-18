import React from 'react';

const GitHubProjects = () => {
  return (
    <section className="py-40 bg-gray-50 text-white">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">GitHub 项目</h2>
        <span className="block w-12 h-2 bg-indigo-600 rounded mx-auto mt-5"></span>

        <p className="text-center text-gray-400 max-w-3xl mx-auto mb-10">
          我的开源项目和代码仓库，欢迎Star和Fork
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 项目卡片 1 */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-3">React组件库</h3>
            <p className="text-gray-300 mb-4">
              一个轻量级、高性能的React UI组件库，包含常用UI组件和工具函数。
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">UI组件</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <span className="flex items-center">
                  <i className="fa fa-star text-yellow-400 mr-1"></i>128
                </span>
                <span className="flex items-center">
                  <i className="fa fa-code-fork text-gray-400 mr-1"></i>32
                </span>
              </div>
              <a
                href="#"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                查看项目
              </a>
            </div>
          </div>

          {/* 项目卡片 2 */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-3">Node.js后端框架</h3>
            <p className="text-gray-300 mb-4">
              基于Node.js的轻量级后端框架，支持中间件、路由和数据库集成。
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">Node.js</span>
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">Express</span>
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">RESTful</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <span className="flex items-center">
                  <i className="fa fa-star text-yellow-400 mr-1"></i>95
                </span>
                <span className="flex items-center">
                  <i className="fa fa-code-fork text-gray-400 mr-1"></i>18
                </span>
              </div>
              <a
                href="#"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                查看项目
              </a>
            </div>
          </div>

          {/* 项目卡片 3 */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-3">个人博客系统</h3>
            <p className="text-gray-300 mb-4">
              基于Next.js开发的个人博客系统，支持Markdown编辑和静态页面生成。
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">Next.js</span>
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">Markdown</span>
              <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">MongoDB</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <span className="flex items-center">
                  <i className="fa fa-star text-yellow-400 mr-1"></i>210
                </span>
                <span className="flex items-center">
                  <i className="fa fa-code-fork text-gray-400 mr-1"></i>45
                </span>
              </div>
              <a
                href="#"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                查看项目
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="https://github.com/dongbiaobiao"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            访问我的GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default GitHubProjects;