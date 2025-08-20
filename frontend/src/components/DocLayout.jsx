import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DocLayout = ({ title, children }) => {
  const location = useLocation();
  const navigate = useNavigate(); // 用于编程式导航
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (shouldScroll && location.pathname === '/' && location.hash === '#study-docs') {
      const target = document.getElementById('study-docs');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setShouldScroll(false);
      }
    }
  }, [location, shouldScroll]);

  // 处理返回操作，携带分类状态
  const handleBack = () => {
    // 从location.state获取之前的分类
    const activeCategory = location.state?.activeCategory;

    // 导航回文档列表，并携带分类状态
    navigate('/#study-docs', {
      state: { activeCategory: activeCategory }
    });
  };

  return (
    <section className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 - 滚动时变化样式 */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center">
            技术文档中心
          </h1>
        </div>
      </header>

      {/* 固定返回按钮 - 为移动端和电脑端分别设置样式 */}
      <div className="fixed z-50">
        {/* 移动端样式 */}
        <button
          onClick={handleBack}
          className="fixed bottom-6 right-6 md:hidden
                    inline-flex items-center justify-center
                    bg-indigo-600 text-white
                    w-12 h-12 rounded-full shadow-lg
                    hover:bg-indigo-700 transition-all"
          aria-label="返回文档列表"
        >
          <i className="fa fa-arrow-left"></i>
        </button>

        {/* 电脑端样式 */}
        <button
          onClick={handleBack}
          className="hidden md:flex
                    items-center ml-[140px] mt-8
                    text-indigo-600 hover:text-indigo-800
                    text-lg transition-colors"
        >
          <i className="fa fa-arrow-left mr-2"></i>
          <span>返回文档列表</span>
        </button>
      </div>

      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 文档卡片 */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transform transition-all hover:shadow-md">
          {/* 文档标题区域 */}
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-gray-50">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
            <div className="flex flex-wrap items-center text-gray-500 text-sm mt-4 gap-x-6 gap-y-2">
              <span className="flex items-center">
                <i className="fa fa-calendar-o mr-1.5"></i>
                <span>最后更新: 2023-06-18</span>
              </span>
              <span className="flex items-center">
                <i className="fa fa-tag mr-1.5"></i>
                <span>技术文档</span>
              </span>
              <span className="flex items-center">
                <i className="fa fa-clock-o mr-1.5"></i>
                <span>阅读时间: 10-15分钟</span>
              </span>
            </div>
          </div>

          {/* 文档内容区域 */}
          <div className="px-6 sm:px-8 py-8">
            <div className="prose max-w-none prose-indigo">
              {children}
            </div>
          </div>

          {/* 页脚区域 */}
          <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50 text-center text-gray-500 text-sm">
            <p>© 2023 技术文档中心 | 持续更新中</p>
          </div>
        </div>

        {/* 侧边留白 */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/4 max-w-xs bg-gray-50"></div>
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1/4 max-w-xs bg-gray-50"></div>
      </div>
    </section>
  );
};

export default DocLayout;
    