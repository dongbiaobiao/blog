import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Resume from './components/Resume';
import StudyDocs from './components/StudyDocs';
// 导入文档页面的占位组件
import DocPlaceholder from './components/DocPlaceholder';
import FuturePlan from './components/FuturePlan';
import GitHubProjects from './components/GitHubProjects';
import CommentSection from './components/CommentSection';

const App = () => {
  // 控制导航栏滚动效果
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="bg-gray-50 text-dark font-sans">
        <Navbar scrolled={scrolled} />

        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <Resume />
              <StudyDocs />
              <FuturePlan />
              <GitHubProjects />
              <CommentSection />

            </>
          } />

          {/* 文档路由 - 使用占位组件避免错误 */}
          <Route path="/docs/react-lifecycle" element={<DocPlaceholder title="React 组件生命周期详解" />} />
          <Route path="/docs/mysql-index-optimization" element={<DocPlaceholder title="MySQL 索引优化步骤" />} />
          <Route path="/docs/nodejs-middleware" element={<DocPlaceholder title="Node.js 中间件开发指南" />} />
          <Route path="/docs/python-data-analysis" element={<DocPlaceholder title="Python 数据分析入门" />} />
          <Route path="/docs/css-flexbox" element={<DocPlaceholder title="CSS Flexbox 布局全解析" />} />
          <Route path="/docs/recent" element={<DocPlaceholder title="最近查看" />} />
          <Route path="/docs/favorites" element={<DocPlaceholder title="收藏文档" />} />
          <Route path="/docs/downloads" element={<DocPlaceholder title="已下载文档" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
