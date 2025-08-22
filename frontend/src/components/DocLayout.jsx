import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import docs from './Docs/json/docs.json';

const DocLayout = ({ children, headings = [] }) => {  // 接收标题数据
  const location = useLocation();
  const navigate = useNavigate();
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [activeHeading, setActiveHeading] = useState('');
  const headingRefs = useRef({});

  // 监听滚动事件，用于导航栏样式和当前标题高亮
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // 检测当前可见的标题
      const currentPosition = window.scrollY + 100;

      for (const [id, ref] of Object.entries(headingRefs.current).reverse()) {
        if (ref && ref.offsetTop <= currentPosition) {
          setActiveHeading(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // 匹配当前文档
  useEffect(() => {
    const docId = location.state?.docId;
    if (docId) {
      const matchedDoc = docs.find(doc => doc.id === docId);
      setCurrentDoc(matchedDoc);
    }
  }, [location.state?.docId]);

  // 滚动逻辑
  useEffect(() => {
    if (shouldScroll && location.pathname === '/' && location.hash === '#study-docs') {
      const target = document.getElementById('study-docs');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setShouldScroll(false);
      }
    }
  }, [location, shouldScroll]);

  // 处理返回操作
  const handleBack = () => {
    const activeCategory = location.state?.activeCategory;
    navigate('/#study-docs', {
      state: { activeCategory: activeCategory }
    });
  };

  // 处理目录项点击
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 注册标题引用
  const registerHeading = (id, ref) => {
    if (id && ref) {
      headingRefs.current[id] = ref;
    }
  };

  // 处理子元素，为标题添加ID和引用
  const renderChildrenWithHeadings = React.Children.map(children, (child) => {
    if (child.type === 'h3' && child.props.children && typeof child.props.children === 'string') {
      // 生成唯一ID
      const headingText = child.props.children.trim();
      const headingId = headingText.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

      // 注册标题引用
      return React.cloneElement(child, {
        id: headingId,
        ref: (ref) => registerHeading(headingId, ref)
      });
    }
    return child;
  });

  if (!currentDoc) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:pl-64 py-12">加载中...</div>;
  }

  return (
    <section className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        {/*<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">*/}
        {/*  <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center">*/}
        {/*    技术文档中心*/}
        {/*  </h1>*/}
        {/*</div>*/}
      </header>

      {/* 固定返回按钮和目录 */}
      <div className="fixed z-50">
        {/* 移动端返回按钮 */}
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

        {/* 桌面端侧边栏：返回按钮 + 目录 */}
        <div className="hidden md:block ml-4 mt-[150px] w-[220px]">
          <button
            onClick={handleBack}
            className="flex items-center mb-6
                      text-indigo-600 hover:text-indigo-800
                      text-lg transition-colors"
          >
            <i className="fa fa-arrow-left mr-2"></i>
            <span>返回文档列表</span>
          </button>

          {/* 目录区域 */}
          {headings.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                目录
              </h3>
              <ul className="space-y-2 text-sm">
                {headings.map((heading, index) => {
                  const headingId = heading.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '');

                  return (
                    <li key={index}>
                      <button
                        onClick={() => scrollToHeading(headingId)}
                        className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition-colors ${
                          activeHeading === headingId ? 'text-indigo-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {heading}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 文档卡片 */}
        <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transform transition-all hover:shadow-md">
          {/* 文档标题区域 */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-100 bg-gray-50">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              {currentDoc.title}
            </h1>
            <div className="flex flex-wrap items-center text-gray-500 text-sm mt-4 gap-x-6 gap-y-2">
              <span className="flex items-center">
                <i className="fa fa-calendar-o mr-1.5"></i>
                <span>最后更新: {currentDoc.lastUpdated}</span>
              </span>
              <span className="flex items-center">
                <i className="fa fa-folder-o mr-1.5"></i>
                <span>分类: {
                  {
                    'frontend': '前端开发',
                    'backend': '后端开发',
                    'database': '数据库',
                    'ai': '人工智能'
                  }[currentDoc.category] || currentDoc.category
                }</span>
              </span>
              <span className="flex items-center">
                <i className="fa fa-clock-o mr-1.5"></i>
                <span>阅读时间: 10-15分钟</span>
              </span>
            </div>
          </div>

          {/* 文档内容区域 */}
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="prose max-w-none prose-indigo">
              {renderChildrenWithHeadings}
            </div>
          </div>

          {/* 页脚区域 */}
          <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50 text-center text-gray-500 text-sm">
            <p>© 2025 技术文档中心 | 持续更新中</p >
          </div>
        </div>

        {/* 侧边留白 */}
        {/*<div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/4 max-w-xs bg-gray-50"></div>*/}
        {/*<div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1/4 max-w-xs bg-gray-50"></div>*/}
      </div>
    </section>
  );
};

export default DocLayout;