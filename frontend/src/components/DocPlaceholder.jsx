import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const DocPlaceholder = ({ title }) => {
  const location = useLocation();
  const [shouldScroll, setShouldScroll] = useState(false);

  // 监听路由变化，当跳转到首页且有锚点时执行滚动
  useEffect(() => {
    if (shouldScroll && location.pathname === '/' && location.hash === '#study-docs') {
      const target = document.getElementById('study-docs');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setShouldScroll(false);
      }
    }
  }, [location, shouldScroll]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              to="/#study-docs"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
              onClick={() => setShouldScroll(true)}
            >
              <i className="fa fa-arrow-left mr-2"></i>
              <span>返回首页</span>
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="flex items-center mr-4">
                <i className="fa fa-calendar-o mr-1"></i>
                <span>最后更新: 2023-06-18</span>
              </span>
              <span className="flex items-center">
                <i className="fa fa-tag mr-1"></i>
                <span>文档</span>
              </span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>此文档正在完善中，敬请期待...</p>

            <h2>文档概要</h2>
            <p>这里将包含"{title}"的详细内容、步骤和示例。</p>

            <h2>学习目标</h2>
            <ul>
              <li>理解核心概念和原理</li>
              <li>掌握实际操作步骤</li>
              <li>学会解决常见问题</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocPlaceholder;
