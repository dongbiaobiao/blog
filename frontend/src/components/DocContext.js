import React, { createContext, useState, useContext } from 'react';

// 初始化文档数据
const initialDocs = [
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

const DocContext = createContext();

export const DocProvider = ({ children }) => {
  const [docs, setDocs] = useState(initialDocs);

  // 统一更新文档的方法（自动处理lastUpdated）
  const updateDoc = (docId, updates) => {
    setDocs(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
         ? {
             ...doc,
             ...updates,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : doc
      )
    );
  };

  return (
    <DocContext.Provider value={{ docs, updateDoc }}>
      {children}
    </DocContext.Provider>
  );
};

// 自定义Hook简化Context调用
export const useDocs = () => {
  return useContext(DocContext);
};
