import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import docs from './Docs/json/docs.json';
// 导入通用UI配置
import uiConfig from './Docs/json/uiConfig.json';

// 基础配置（若uiConfig生效，此部分可删除，此处保留用于兼容）
const UI_CONFIG = {
  colors: {
    info: '#0ea5e9',
    warning: '#f59e0b',
    danger: '#ef4444',
    success: '#10b981',
    border: '#e2e8f0'
  },
  dimensions: {
    tipBoxPadding: '1rem 1.25rem',
    tipBoxPaddingMobile: '0.75rem 1rem',
    tipBoxGap: '0.75rem',
    paragraphMarginBottom: '1rem',
    codeBlockBorderRadius: '6px'
  },
  controls: {
    tipBoxIcons: {
      info: 'ℹ️',
      warning: '⚠️',
      danger: '❌'
    }
  }
};

const DocLayout = ({ children, headings = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [activeHeading, setActiveHeading] = useState('');
  const [isMobile, setIsMobile] = useState(false); // 移动端判断
  const headingRefs = useRef({});

  // 监听屏幕尺寸，判断是否为移动端（768px为断点）
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  // -------------------------- 1. 核心修改：TipBox（英文不随意换行） --------------------------
  const TipBox = ({ type = 'info', children }) => {
    const styles = {
      info: {
        background: '#eff6ff',
        borderLeft: `4px solid ${UI_CONFIG.colors.info}`,
        color: '#0369a1'
      },
      warning: {
        background: '#fffbeb',
        borderLeft: `4px solid ${UI_CONFIG.colors.warning}`,
        color: '#b45309'
      },
      danger: {
        background: '#fee2e2',
        borderLeft: `4px solid ${UI_CONFIG.colors.danger}`,
        color: '#b91c1c'
      }
    };

    // 响应式内边距：移动端缩小
    const tipBoxPadding = isMobile
      ? UI_CONFIG.dimensions.tipBoxPaddingMobile
      : UI_CONFIG.dimensions.tipBoxPadding;

    return (
      <div style={{
        ...styles[type],
        padding: tipBoxPadding,
        margin: `${UI_CONFIG.dimensions.paragraphMarginBottom} auto`,
        maxWidth: '100%', // 禁止超出父容器
        borderRadius: UI_CONFIG.dimensions.codeBlockBorderRadius,
        display: 'flex',
        alignItems: 'flex-start',
        gap: UI_CONFIG.dimensions.tipBoxGap,
        // 关键：英文不随意换行配置
        whiteSpace: 'pre-wrap', // 保留手动换行，长内容整体换行（不截断英文）
        wordWrap: 'normal',    // 恢复默认单词换行，不强制拆分英文单词
        overflow: 'hidden',    // 兜底防止溢出
        boxSizing: 'border-box'// 确保内边距不撑大容器
      }}>
        {/* 图标区域：固定大小，不挤压文字 */}
        <div style={{
          fontSize: '1.25rem',
          marginTop: '0.1rem',
          flexShrink: 0, // 图标不收缩
          width: '1.5rem',
          textAlign: 'center'
        }}>
          {UI_CONFIG.controls.tipBoxIcons[type]}
        </div>
        {/* 文字区域：自适应宽度 + 英文不随意换行 */}
        <div style={{
          lineHeight: '1.7',
          color: styles[type].color,
          flex: 1, // 占满剩余空间
          whiteSpace: 'pre-wrap', // 继承外层换行规则
          wordWrap: 'normal'     // 继承外层换行规则
        }}>
          {typeof children === 'string' ? (
            <span style={{ whiteSpace: 'pre-wrap', wordWrap: 'normal' }}>{children}</span>
          ) : (
            React.Children.map(children, (child) => {
              // 处理p标签子元素，强制继承换行样式
              if (child.type === 'p') {
                return React.cloneElement(child, {
                  style: {
                    ...child.props.style,
                    marginBottom: UI_CONFIG.dimensions.paragraphMarginBottom,
                    whiteSpace: 'pre-wrap', // p标签内文字也遵循英文不随意换行
                    wordWrap: 'normal',
                    lineHeight: '1.7',
                    margin: 0, // 清除默认margin避免间距异常
                    marginBottom: child.props.style?.marginBottom || UI_CONFIG.dimensions.paragraphMarginBottom
                  }
                });
              }
              return child;
            })
          )}
        </div>
      </div>
    );
  };

  // -------------------------- 2. 优化：移动端代码框缩小 --------------------------
  const CodeBlock = ({ language, code }) => {
    const [buttonText, setButtonText] = useState('复制代码');
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef(null);

    const handleCopy = () => {
      const codeText = typeof code === 'string' ? code.trim() : '';
      navigator.clipboard.writeText(codeText)
        .then(() => {
          setButtonText('已复制');
          setCopied(true);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setButtonText('复制代码');
            setCopied(false);
          }, 3000);
        })
        .catch(err => {
          console.error('复制失败:', err);
          setButtonText('复制失败');
          setTimeout(() => setButtonText('复制代码'), 2000);
        });
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    // 语言名称映射
    const languageMap = {
      'bash': 'Bash 命令',
      'python': 'Python 代码',
      'javascript': 'JavaScript 代码',
      'json': 'JSON 格式'
    };

    return (
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: UI_CONFIG.dimensions.codeBlockBorderRadius,
        // 移动端：缩小边距 + 居中
        margin: isMobile ? '0.5rem 0.5rem 1rem 0.5rem' : '1rem 0',
        maxWidth: isMobile ? '95%' : '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        boxSizing: 'border-box'
      }}>
        {/* 代码头部：移动端缩小内边距和字体 */}
        <div style={{
          padding: isMobile ? '0.5rem 0.75rem' : '0.85rem 1.25rem',
          fontSize: isMobile ? '0.75rem' : '0.85rem',
          color: '#e2e8f0',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#0f172a'
        }}>
          <span style={{ fontWeight: '500' }}>
            {languageMap[language] || language}
          </span>
          <button
            style={{
              background: copied ? UI_CONFIG.colors.success : '#334155',
              color: 'white',
              border: 'none',
              borderRadius: UI_CONFIG.dimensions.codeBlockBorderRadius,
              // 移动端：缩小按钮内边距和字体
              padding: isMobile ? '0.25rem 0.5rem' : '0.35rem 0.75rem',
              cursor: 'pointer',
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '0.25rem' : '0.35rem'
            }}
            onClick={handleCopy}
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span>{buttonText}</span>
          </button>
        </div>

        {/* 代码内容区域：移动端缩小字体和最大高度 */}
        <div style={{
          maxHeight: isMobile ? '300px' : '500px',
          overflow: 'auto'
        }}>
          <pre style={{ margin: 0 }}>
            <code style={{
              padding: isMobile ? '0.75rem 1rem' : '1.25rem',
              display: 'block',
              fontFamily: 'SFMono-Regular, Consolas, monospace',
              fontSize: isMobile ? '0.75rem' : '0.9rem',
              lineHeight: isMobile ? '1.5' : '1.6',
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {typeof code === 'string' ? code : ''}
            </code>
          </pre>
        </div>
      </div>
    );
  };

  // -------------------------- 3. 注入组件到子元素 --------------------------
  // 处理子元素：同时注入 CodeBlock 和 TipBox 组件
  const renderChildrenWithComponents = React.Children.map(renderChildrenWithHeadings, (child) => {
    // 1. 注入 CodeBlock（若子元素是代码块组件）
    if (child.type?.displayName === 'CodeBlock' || child.props?.isCodeBlock) {
      return React.cloneElement(child, {
        component: CodeBlock
      });
    }
    // 2. 注入 TipBox（若子元素是TipBox组件）
    if (child.type?.displayName === 'TipBox' || child.props?.isTipBox) {
      return React.cloneElement(child, {
        component: TipBox,
        isMobile: isMobile // 传递移动端状态
      });
    }
    // 3. 若子元素内包含TipBox（如直接使用<TipBox>标签），直接替换为自定义TipBox
    if (child.type === 'TipBox') {
      return <TipBox type={child.props.type}>{child.props.children}</TipBox>;
    }
    return child;
  });

  if (!currentDoc) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:pl-64 py-12">
        加载中...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      ></header>

      {/* 固定返回按钮和目录 */}
      <div className="fixed z-50">
        {/* 移动端返回按钮（仅移动端显示） */}
        <button
          onClick={handleBack}
          className="fixed bottom-6 right-6 md:hidden
                    inline-flex items-center justify-center
                    bg-indigo-600 text-white
                    w-12 h-12 rounded-full shadow-lg
                    hover:bg-indigo-700 transition-all"
          aria-label="返回文档列表"
        >
          <<i className="fa fa-arrow-left"></</i>
        </button>

        {/* 桌面端返回按钮（仅桌面端显示） */}
        <div className="hidden md:block ml-4 mt-[150px] w-[220px]">
          <button
            onClick={handleBack}
            className="flex items-center mb-6
                      text-indigo-600 hover:text-indigo-800
                      text-lg transition-colors"
          >
            <<i className="fa fa-arrow-left mr-2"></</i>
            <span>返回文档列表</span>
          </button>
        </div>

        {/* 目录区域（仅桌面端显示，xl断点：1280px以下隐藏） */}
        {headings.length > 0 && (
          <div className="hidden xl:block ml-4 w-[220px]">
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
                        className={`w-full text-leftonClick={() => scrollToHeading(headingId)}
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
        </div>
      )}

    </div>

    {/* 主要内容区域（注入响应式组件） */}
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
              <<i className="fa fa-calendar-o mr-1.5"></</i>
              <span>最后更新: {currentDoc.lastUpdated}</span>
            </span>
            <span className="flex items-center">
              <<i className="fa fa-folder-o mr-1.5"></</i>
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
              <<i className="fa fa-clock-o mr-1.5"></</i>
              <span>阅读时间: 10-15分钟</span>
            </span>
          </div>
        </div>

        {/* 文档内容区域（带移动端适配） */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="prose max-w-none prose-indigo">
            {/* 传递所有响应式组件到子内容 */}
            {React.Children.map(renderChildrenWithComponents, (child) => {
              // 若子元素需要CodeBlock或TipBox，直接传递组件
              if (child.props?.needCodeBlock) {
                return React.cloneElement(child, { CodeBlock });
              }
              if (child.props?.needTipBox) {
                return React.cloneElement(child, { TipBox });
              }
              return child;
            })}
          </div>
        </div>

        {/* 页脚区域 */}
        <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50 text-center text-gray-500 text-sm">
          <p>© 2025 技术文档中心 | 持续更新中</p >
        </div>
      </div>
    </div>
  </section>
);
};

export default DocLayout;
