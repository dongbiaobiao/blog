import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { docs } from './StudyDocs'; // 从StudyDocs导入docs数组

const DocDetail = () => {
  const { docId } = useParams();
  
  // 根据路由参数查找对应的文档（处理link中的"/docs/"前缀）
  const doc = docs.find(item => item.link === `/docs/${docId}`);

  // 如果文档不存在
  if (!doc) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">文档不存在</h2>
          <p className="text-gray-600 mb-6">找不到请求的文档内容</p>
          <Link to="/#study-docs" className="text-indigo-600 hover:underline">
            返回文档列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 面包屑导航 */}
      <div className="mb-8 text-sm text-gray-500">
        <Link to="/#study-docs" className="hover:text-indigo-600">文档列表</Link>
        <span className="mx-2">/</span>
        <span>{doc.title}</span>
      </div>

      {/* 文档标题 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{doc.title}</h1>

      {/* 文档元信息 */}
      <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
        <span>
          <i className="fa fa-calendar-o mr-1"></i>
          发布日期: {doc.date}
        </span>
        <span>
          <i className="fa fa-refresh mr-1"></i>
          最后更新: {doc.lastUpdated}
        </span>
        <div className="flex gap-2">
          {doc.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 文档图片 */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <img
          src={doc.image}
          alt={doc.title}
          className="w-full max-h-96 object-cover"
        />
      </div>

      {/* 文档内容 */}
      <div className="prose prose-lg max-w-none">
        <h2>概述</h2>
        <p>{doc.description}</p>
        
        {/* 这里可以根据文档ID显示不同的详细内容 */}
        {doc.id === 1 && (
          <>
            <h2>React 组件生命周期详解</h2>
            <p>React 组件的生命周期分为三个主要阶段：挂载、更新和卸载。</p>
            <h3>挂载阶段</h3>
            <p>挂载阶段是组件从创建到首次渲染到DOM中的过程，主要包括以下方法：</p>
            <ul>
              <li>constructor：初始化组件状态</li>
              <li>render：渲染组件UI</li>
              <li>componentDidMount：组件挂载后执行</li>
            </ul>
            {/* 更多React相关内容... */}
          </>
        )}

        {doc.id === 2 && (
          <>
            <h2>MySQL 索引优化详解</h2>
            <p>索引是提高MySQL查询性能的关键，本章节将详细介绍索引的工作原理和优化方法。</p>
            <h3>索引类型</h3>
            <p>MySQL支持多种索引类型，包括：</p>
            <ul>
              <li>B-Tree索引：最常用的索引类型</li>
              <li>Hash索引：适用于等值查询</li>
              <li>全文索引：用于文本搜索</li>
            </ul>
            {/* 更多MySQL相关内容... */}
          </>
        )}

        {/* 为其他文档ID添加对应的内容... */}
        {doc.id === 3 && <div>{/* Node.js 中间件内容 */}</div>}
        {doc.id === 4 && <div>{/* Python 数据分析内容 */}</div>}
        {doc.id === 5 && <div>{/* CSS Flexbox 内容 */}</div>}
      </div>
    </div>
  );
};

export default DocDetail;
    