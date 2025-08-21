import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Resume from './components/Resume';
import StudyDocs from './components/StudyDocs';
// 导入所有独立文档组件
import ReactLifecycle from './components/Docs/ReactLifecycle';
import MySQLIndexOptimization from './components/Docs/MySQLIndexOptimization';
import NodejsMiddleware from './components/Docs/NodejsMiddleware';
import PythonDataAnalysis from './components/Docs/PythonDataAnalysis';
import CssFlexbox from './components/Docs/CssFlexbox';
import DocPlaceholder from './components/DocPlaceholder';
import FuturePlan from './components/FuturePlan';
import GitHubProjects from './components/GitHubProjects';
import CommentSection from './components/CommentSection';




const AppContent = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 新增：标记是否为初始加载

  // 处理导航栏滚动状态
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 处理哈希锚点滚动 - 调整逻辑
  useEffect(() => {
    // 初始加载时不处理哈希滚动，除非是从其他页面跳转过来
    if (isInitialLoad) {
      setIsInitialLoad(false);
      // 只有当不是根路径时才处理初始哈希
      if (location.pathname !== '/') {
        handleHashScroll();
      }
      return;
    }

    // 非初始加载时正常处理哈希滚动
    handleHashScroll();
  }, [location]);

  // 提取哈希滚动逻辑为单独函数
  const handleHashScroll = () => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const targetElement = document.querySelector(location.hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  };

  return (
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

        {/* StudyDocs文档跳转页面链接 */}
        <Route path="/docs/react-lifecycle" element={<ReactLifecycle />} />
        <Route path="/docs/mysql-index-optimization" element={<MySQLIndexOptimization />} />
        <Route path="/docs/nodejs-middleware" element={<NodejsMiddleware />} />
        <Route path="/docs/python-data-analysis" element={<PythonDataAnalysis />} />
        <Route path="/docs/css-flexbox" element={<CssFlexbox />} />

        {/* 其他文档相关路由 */}
        <Route path="/docs/recent" element={<DocPlaceholder title="最近查看" />} />
        <Route path="/docs/favorites" element={<DocPlaceholder title="收藏文档" />} />
        <Route path="/docs/downloads" element={<DocPlaceholder title="已下载文档" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
