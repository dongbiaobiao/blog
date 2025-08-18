import React, { useEffect, useRef } from 'react';
import 'gitalk/dist/gitalk.css';
import Gitalk from 'gitalk';
import './CommentSection.css';

const CommentSection = () => {
  const commentRef = useRef(null);

  // 确保DOM加载完成后再初始化Gitalk
  useEffect(() => {
    // 创建样式容器，确保样式优先级
    const style = document.createElement('style');
    style.id = 'gitalk-custom-style';
    style.textContent = `
      /* 核心样式 - 确保覆盖默认样式 */
      #gitalk-container {
        background-color: #ffffff !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 12px !important;
        padding: 2rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
      }
      
      /* 强制覆盖Gitalk默认样式 */
      #gitalk-container .gt-header {
        border-bottom: 1px solid #f3f4f6 !important;
        padding-bottom: 1rem !important;
        margin-bottom: 1.5rem !important;
      }
      
      #gitalk-container .gt-container .gt-editor {
        border: 1px solid #d1d5db !important;
        border-radius: 8px !important;
        transition: all 0.2s ease !important;
      }
      
      #gitalk-container .gt-container .gt-editor:focus-within {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 256, 0.1) !important;
      }
      
      #gitalk-container .gt-btn {
        background-color: #3b82f6 !important;
        color: white !important;
        border-radius: 6px !important;
        padding: 0.5rem 1.25rem !important;
        transition: background-color 0.2s !important;
      }
      
      #gitalk-container .gt-btn:hover {
        background-color: #2563eb !important;
      }
      
      #gitalk-container .gt-comment {
        padding: 1.25rem 0 !important;
        border-bottom: 1px solid #f3f4f6 !important;
      }
      
      #gitalk-container .gt-comment-name {
        color: #1e40af !important;
        font-weight: 600 !important;
      }
      
      #gitalk-container .gt-comment-time {
        color: #9ca3af !important;
        font-size: 0.875rem !important;
      }
      
      #gitalk-container .gt-comment-body {
        color: #374151 !important;
        line-height: 1.6 !important;
      }
      
      #gitalk-container .gt-reply {
        color: #3b82f6 !important;
        transition: color 0.2s !important;
      }
      
      #gitalk-container .gt-reply:hover {
        color: #2563eb !important;
        text-decoration: underline !important;
      }
    `;

    // 添加样式到头部
    document.head.appendChild(style);

    // 初始化Gitalk
    const gitalk = new Gitalk({
      clientID: 'Ov23liPLxUu6i4YaNZvQ',
      clientSecret: '773dd3140d2b73fe5d938089fb272b8c9bc8b800',
      repo: 'blog',
      owner: 'dongbiaobiao',
      admin: ['dongbiaobiao'],
      id: window.location.pathname,
      distractionFreeMode: false,
      language: 'zh-CN'
    });

    // 渲染评论区
    gitalk.render('gitalk-container');

    // 清理函数
    return () => {
      const styleElement = document.getElementById('gitalk-custom-style');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <section ref={commentRef} className="comment-section">
      <div className="container">
        <h2 className="comment-title">加入讨论</h2>
        <p className="comment-description">
          分享你的想法和建议，与其他读者一起交流学习
        </p>

        {/* Gitalk评论容器 */}
        <div id="gitalk-container" className="mt-6"></div>
      </div>
    </section>
  );
};

export default CommentSection;
