import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Link, useLocation } from 'react-router-dom';

// 文档数据数组 - 导出供其他组件使用
export const docs = [
  {
    id: 1,
    title: 'React 组件生命周期详解',
    category: 'frontend',
    date: '2023-06-18',
    lastUpdated: '2023-06-18',
    color: 'bg-blue-500',
    tags: ['React', '前端', '组件'],
    link: '/docs/react-lifecycle',
    image: 'https://picsum.photos/seed/react-lifecycle/600/300',
    description: '详细讲解React组件的生命周期方法，包括挂载、更新和卸载三个阶段。'
  },
  {
    id: 2,
    title: 'MySQL 索引优化步骤',
    category: 'database',
    date: '2023-06-10',
    lastUpdated: '2023-06-12',
    color: 'bg-yellow-500',
    tags: ['MySQL', '数据库', '优化'],
    link: '/docs/mysql-index-optimization',
    image: 'https://picsum.photos/seed/mysql-index/600/300',
    description: '通过实际案例介绍MySQL索引的工作原理及优化技巧。'
  },
  {
    id: 3,
    title: 'Node.js 中间件开发指南',
    category: 'backend',
    date: '2023-05-28',
    lastUpdated: '2023-06-01',
    color: 'bg-green-500',
    tags: ['Node.js', 'Express', '后端'],
    link: '/docs/nodejs-middleware',
    image: 'https://picsum.photos/seed/node-middleware/600/300',
    description: '深入探讨Node.js中间件的设计模式和实现原理。'
  },
  {
    id: 4,
    title: 'Python 数据分析入门',
    category: 'ai',
    date: '2023-05-15',
    lastUpdated: '2023-05-20',
    color: 'bg-purple-500',
    tags: ['Python', '数据分析', 'AI'],
    link: '/docs/python-data-analysis',
    image: 'https://picsum.photos/seed/python-data/600/300',
    description: '从零开始学习使用Python进行数据分析。'
  },
  {
    id: 5,
    title: 'CSS Flexbox 布局全解析',
    category: 'frontend',
    date: '2023-05-10',
    lastUpdated: '2023-05-10',
    color: 'bg-blue-500',
    tags: ['CSS', '布局', '前端'],
    link: '/docs/css-flexbox',
    image: 'https://picsum.photos/seed/css-flexbox/600/300',
    description: '全面解析CSS Flexbox布局模型及实例演示。'
  }
];

const StudyDocs = () => {
  // 状态管理
  const location = useLocation();
  // 从路由状态获取之前的分类，如果没有则默认"all"
  const [activeCategory, setActiveCategory] = useState(
    location.state?.activeCategory || 'all'
  );
  const [userInitiatedChange, setUserInitiatedChange] = useState(false);
  const chartRef = useRef(null);
  const sectionRef = useRef(null);
  const docsListRef = useRef(null);

  // 文档分类
  const categories = [
    { id: 'all', name: '全部', color: 'bg-indigo-600' },
    { id: 'frontend', name: '前端开发', color: 'bg-blue-500' },
    { id: 'backend', name: '后端开发', color: 'bg-green-500' },
    { id: 'database', name: '数据库', color: 'bg-yellow-500' },
    { id: 'ai', name: '人工智能', color: 'bg-purple-500' }
  ];

  // 筛选文档
  const filteredDocs = activeCategory === 'all'
    ? docs
    : docs.filter(doc => doc.category === activeCategory);

  // 滚动到文档列表区域的函数
  const scrollToDocsList = () => {
    if (docsListRef.current) {
      const targetPosition = docsListRef.current.getBoundingClientRect().top +
                            window.pageYOffset - 80;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  // 只有用户主动切换分类时才滚动
  useEffect(() => {
    if (userInitiatedChange) {
      const timer = setTimeout(() => {
        scrollToDocsList();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [activeCategory, userInitiatedChange]);

  // 处理分类切换
  const handleCategoryChange = (categoryId) => {
    setUserInitiatedChange(true);
    setActiveCategory(categoryId);
  };

  // 初始化学习统计图表
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          initStatsChart();
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [docs]);

  // 初始化统计图表
  const initStatsChart = () => {
    const ctx = document.getElementById('learningStatsChart');
    if (!ctx) return;

    const categoryCounts = categories
      .filter(cat => cat.id !== 'all')
      .map(cat => ({
        ...cat,
        count: docs.filter(doc => doc.category === cat.id).length
      }));

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categoryCounts.map(c => c.name),
        datasets: [{
          label: '文档数量',
          data: categoryCounts.map(c => c.count),
          backgroundColor: categoryCounts.map(c => c.color.replace('bg-', '#').replace('-500', '')),
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  };

  return (
    <section ref={sectionRef} id="study-docs" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-4 text-gray-800">学习文档资源</h2>
          <span className="block w-12 h-2 bg-indigo-600 rounded mx-auto mt-5"></span>

          <p className="text-gray-600 max-w-2xl mx-auto">点击下方链接查看详细学习文档，包含各类技术知识点和实践指南</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧边栏 - 分类和统计 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-800">文档分类</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                        activeCategory === category.id
                          ? `${category.color} text-white shadow-sm`
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeCategory === category.id ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        {docs.filter(doc => doc.category === category.id || (category.id === 'all')).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧主内容 - 文档链接列表 */}
          <div ref={docsListRef} className="lg:col-span-3">
            {filteredDocs.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <i className="fa fa-file-text-o text-gray-300 text-5xl mb-4"></i>
                <h3 className="text-xl font-medium text-gray-800 mb-2">没有找到文档</h3>
                <p className="text-gray-500 mb-6">该分类下暂无学习文档</p>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <i className="fa fa-th-list mr-2"></i>查看全部文档
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDocs.map(doc => (
                  <Link
                    key={doc.id}
                    to={doc.link}
                    // 关键修改：导航时传递当前活跃的分类
                    state={{ activeCategory: activeCategory }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 group"
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`w-3 h-3 rounded-full ${doc.color}`}></span>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {doc.title}
                        </h3>
                      </div>

                      <div className="mb-4 rounded-lg overflow-hidden h-40 relative">
                        <img
                          src={doc.image}
                          alt={doc.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {doc.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {doc.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          <i className="fa fa-calendar-o mr-1"></i>
                          最后更新: {doc.lastUpdated}
                        </span>

                        <span className="text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          <span>查看详情</span>
                          <i className="fa fa-arrow-right text-sm"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyDocs;
    