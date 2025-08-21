import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Link, useLocation } from 'react-router-dom';
// 从JSON文件导入初始文档数据
import initialDocs from './Docs/json/docs.json';

// 工具函数：获取当前日期（YYYY-MM-DD格式）
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// 基于JSON导入的数据初始化docs数组，导出供其他组件使用
export let docs = [...initialDocs];

// 导出更新文档的函数，供其他组件使用
export const updateDoc = (docId, updates) => {
  const index = docs.findIndex(doc => doc.id === docId);
  if (index !== -1) {
    // 如果是新文档（没有date），设置创建时间
    const isNewDoc = !docs[index].date;
    if (isNewDoc) {
      updates.date = getCurrentDate();
    }

    // 无论是否新文档，都更新最后修改时间
    updates.lastUpdated = getCurrentDate();

    // 创建新数组而非直接修改原数组，确保引用变化
    docs = [
      ...docs.slice(0, index),
      { ...docs[index], ...updates },
      ...docs.slice(index + 1)
    ];
    return docs[index];
  }
  return null;
};

// 导出添加新文档的函数
export const addNewDoc = (newDocData) => {
  const newId = Math.max(...docs.map(doc => doc.id), 0) + 1;
  const newDoc = {
    id: newId,
    date: getCurrentDate(),
    lastUpdated: getCurrentDate(),
    ...newDocData
  };
  docs = [...docs, newDoc];
  return newDoc;
};

const StudyDocs = () => {
  // 状态管理
  const location = useLocation();
  // 从路由状态获取之前的分类，如果没有则默认"all"
  const [activeCategory, setActiveCategory] = useState(
    location.state?.activeCategory || 'all'
  );
  const [userInitiatedChange, setUserInitiatedChange] = useState(false);
  const [documentList, setDocumentList] = useState(docs); // 本地状态管理文档列表
  const chartRef = useRef(null);
  const sectionRef = useRef(null);
  const docsListRef = useRef(null);

  // 当原始docs数组变化时更新本地状态
  useEffect(() => {
    setDocumentList([...docs]);
  }, [docs]);

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
    ? documentList
    : documentList.filter(doc => doc.category === activeCategory);

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
  }, [documentList]);

  // 初始化统计图表
  const initStatsChart = () => {
    const ctx = document.getElementById('learningStatsChart');
    if (!ctx) return;

    const categoryCounts = categories
      .filter(cat => cat.id !== 'all')
      .map(cat => ({
        ...cat,
        count: documentList.filter(doc => doc.category === cat.id).length
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
                        {documentList.filter(doc => doc.category === category.id || (category.id === 'all')).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 图表容器 */}
              <div className="h-64">
                <canvas id="learningStatsChart"></canvas>
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
                    // 导航时传递当前活跃的分类和文档ID
                    state={{
                      activeCategory: activeCategory,
                      docId: doc.id  // 传递文档ID
                    }}
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
