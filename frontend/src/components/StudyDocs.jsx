import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';

const StudyDocs = () => {
  // 状态管理
  const [activeCategory, setActiveCategory] = useState('all');
  const chartRef = useRef(null);
  const sectionRef = useRef(null);

  // 学习文档数据 - 包含图片和介绍
  const docs = [
    {
      id: 1,
      title: 'React 组件生命周期详解',
      category: 'frontend',
      date: '2023-06-18',
      lastUpdated: '2023-06-18',
      color: 'bg-blue-500',
      tags: ['React', '前端', '组件'],
      link: '/docs/react-lifecycle',
      // 新增图片和介绍
      image: 'https://picsum.photos/seed/react-lifecycle/600/300',
      description: '详细讲解React组件的生命周期方法，包括挂载、更新和卸载三个阶段，以及如何在不同阶段处理数据和副作用。'
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
      // 新增图片和介绍
      image: 'https://picsum.photos/seed/mysql-index/600/300',
      description: '通过实际案例介绍MySQL索引的工作原理，以及如何分析和优化索引，提升查询性能的实用技巧。'
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
      // 新增图片和介绍
      image: 'https://picsum.photos/seed/node-middleware/600/300',
      description: '深入探讨Node.js中间件的设计模式和实现原理，教你如何开发可重用的Express中间件。'
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
      // 新增图片和介绍
      image: 'https://picsum.photos/seed/python-data/600/300',
      description: '从零开始学习使用Python进行数据分析，包括NumPy、Pandas库的基础操作和数据可视化方法。'
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
      // 新增图片和介绍
      image: 'https://picsum.photos/seed/css-flexbox/600/300',
      description: '全面解析CSS Flexbox布局模型，通过实例演示如何快速实现各种复杂布局，解决常见的布局难题。'
    }
  ];

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

    // 计算各分类文档数量
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
                      onClick={() => setActiveCategory(category.id)}
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

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-800">快速访问</h3>
                <div className="space-y-2">
                  <Link
                    to="/docs/recent"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                  >
                    <i className="fa fa-clock-o text-indigo-500"></i>
                    <span>最近查看</span>
                  </Link>
                  <Link
                    to="/docs/favorites"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                  >
                    <i className="fa fa-star-o text-indigo-500"></i>
                    <span>收藏文档</span>
                  </Link>
                  <Link
                    to="/docs/downloads"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all text-gray-700"
                  >
                    <i className="fa fa-download text-indigo-500"></i>
                    <span>已下载文档</span>
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">学习统计</h3>
                <div className="h-64">
                  <canvas id="learningStatsChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧主内容 - 文档链接列表 */}
          <div className="lg:col-span-3">
            {filteredDocs.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <i className="fa fa-file-text-o text-gray-300 text-5xl mb-4"></i>
                <h3 className="text-xl font-medium text-gray-800 mb-2">没有找到文档</h3>
                <p className="text-gray-500 mb-6">该分类下暂无学习文档</p>
                <button
                  onClick={() => setActiveCategory('all')}
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
                    className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 group"
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`w-3 h-3 rounded-full ${doc.color}`}></span>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {doc.title}
                        </h3>
                      </div>

                      {/* 新增图片展示 */}
                      <div className="mb-4 rounded-lg overflow-hidden h-40 relative">
                        <img
                          src={doc.image}
                          alt={doc.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* 新增文档介绍 */}
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
