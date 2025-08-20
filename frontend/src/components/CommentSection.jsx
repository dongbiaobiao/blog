import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import './CommentSection.css';

const CommentSection = () => {
  // 配置常量
  const LEANCLOUD_CONFIG = {
    appId: 'nZCZLRsUoF6bUak4STegPS1d-gzGzoHsz',
    appKey: 'FkyYQstKUDsYatd1jT7uUgbX',
    serverURLs: 'https://nzczlrsu.lc-cn-n1-shared.com'
  };

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitError, setSubmitError] = useState('');
  const initialized = useRef(false);
  const containerRef = useRef(null); // Portal容器引用
  const valineInstance = useRef(null);
  const observerRef = useRef(null);

  // 邮箱和网址验证函数
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUrl = (url) => !url.trim() || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(url);

  // 创建独立的DOM容器，避免干扰React的DOM树
  useEffect(() => {
    // 创建一个不在React根节点下的容器
    const container = document.createElement('div');
    container.id = 'valine-portal-container';
    document.body.appendChild(container); // 添加到body而非React管理的节点
    containerRef.current = container;

    // 组件卸载时清理容器
    return () => {
      if (containerRef.current && document.body.contains(containerRef.current)) {
        document.body.removeChild(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;
    initialized.current = true;

    // 初始化评论系统
    const initCommentSystem = (AV, Valine) => {
      // 初始化AV
      if (!AV.applicationId) {
        AV.init({
          appId: LEANCLOUD_CONFIG.appId,
          appKey: LEANCLOUD_CONFIG.appKey,
          serverURLs: LEANCLOUD_CONFIG.serverURLs
        });
      } else {
        AV.setServerURLs(LEANCLOUD_CONFIG.serverURLs);
      }

      // 创建Valine实例，绑定到portal容器
      valineInstance.current = new Valine({
        el: containerRef.current, // 使用独立容器
        path: window.location.pathname,
        placeholder: '分享你的想法和建议吧～',
        avatar: 'mp',
        lang: 'zh-CN',
        pageSize: 10,
        enableQQ: true,
        appId: LEANCLOUD_CONFIG.appId,
        appKey: LEANCLOUD_CONFIG.appKey,
        serverURLs: LEANCLOUD_CONFIG.serverURLs
      });

      // 绑定提交事件
      const bindSubmitEvent = () => {
        const submitBtn = containerRef.current.querySelector('.vsubmit');
        if (submitBtn) {
          submitBtn.onclick = handleSubmit;
        }
      };

      // 处理提交逻辑
      const handleSubmit = () => {
        setSubmitError('');
        const nick = containerRef.current.querySelector('.vnick')?.value?.trim() || '';
        const mail = containerRef.current.querySelector('.vmail')?.value?.trim() || '';
        const link = containerRef.current.querySelector('.vlink')?.value?.trim() || '';
        const content = containerRef.current.querySelector('.veditor textarea')?.value?.trim() || '';

        if (!content) return setSubmitError('请输入评论内容～');
        if (mail && !isValidEmail(mail)) return setSubmitError('请输入有效的邮箱地址');
        if (link && !isValidUrl(link)) return setSubmitError('请输入有效的网址');

        valineInstance.current?.submit();
        if (nick || mail || link) {
          localStorage.setItem('Valine::vuser', JSON.stringify({ nick, mail, link }));
        }
      };

      // 使用MutationObserver监听DOM变化
      const observer = new MutationObserver((mutations) => {
        if (containerRef.current.querySelector('.vsubmit')) {
          bindSubmitEvent();
          observer.disconnect();
        }
      });
      observer.observe(containerRef.current, { childList: true, subtree: true });
      observerRef.current = observer;

      setIsLoading(false);
    };

    // 清理函数
    const cleanup = () => {
      window.removeEventListener('error', handleGlobalError);

      // 断开观察者
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // 销毁Valine实例
      if (valineInstance.current && typeof valineInstance.current.destroy === 'function') {
        valineInstance.current.destroy();
      }
    };

    // 错误处理
    const handleGlobalError = (msg, source, lineno, colno, error) => {
      if (typeof source === 'string' &&
          (source.includes('Valine.min.js') || source.includes('av-min.js'))) {
        setErrorMsg(`脚本错误: ${error?.message || msg}`);
        setIsLoading(false);
      }
      return false;
    };
    window.addEventListener('error', handleGlobalError);

    // 加载SDK
    const loadAV = () => {
      if (window.AV) return Promise.resolve(window.AV);
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/leancloud-storage@3.11.1/dist/av-min.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => window.AV ? resolve(window.AV) : reject(new Error('LeanCloud SDK 未加载'));
        script.onerror = () => reject(new Error('LeanCloud 加载失败'));
        document.body.appendChild(script);
      });
    };

    const loadValine = () => {
      if (window.Valine) return Promise.resolve(window.Valine);
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/valine@1.4.18/dist/Valine.min.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => window.Valine ? resolve(window.Valine) : reject(new Error('Valine 未加载'));
        script.onerror = () => reject(new Error('Valine 加载失败'));
        document.body.appendChild(script);
      });
    };

    // 执行初始化
    setIsLoading(true);
    setErrorMsg('');

    if (window.AV && window.Valine) {
      try {
        initCommentSystem(window.AV, window.Valine);
      } catch (err) {
        setErrorMsg(`初始化失败: ${err.message}`);
        setIsLoading(false);
      }
      return cleanup;
    }

    Promise.all([loadAV(), loadValine()])
      .then(([AV, Valine]) => initCommentSystem(AV, Valine))
      .catch(err => {
        setErrorMsg(`初始化失败: ${err.message}`);
        setIsLoading(false);
      });

    return cleanup;
  }, []);

  const handleRetry = () => window.location.reload(true);

  // 通过Portal将评论区渲染到独立容器，但在视觉上保持原位
  return (
    <div className="comment-section">
      <h3 className="comment-title">评论区</h3>
      <p className="comment-desc">欢迎留下你的宝贵意见</p>

      {/* 占位元素，保持布局位置 */}
      <div className="comment-placeholder" style={{ minHeight: '300px' }}>
        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>评论加载中...</p>
          </div>
        )}

        {submitError && (
          <div className="submit-error" style={{ color: '#d9534f', padding: '8px', marginBottom: '10px' }}>
            ⚠️ {submitError}
          </div>
        )}

        {errorMsg && (
          <div className="error-state">
            <p>评论系统加载失败：{errorMsg}</p>
            <div className="error-guide">
              <p>排查建议：</p>
              <ul>
                <li>1. 确认LeanCloud服务地址正确</li>
                <li>2. 检查网络连接是否正常</li>
                <li>3. 刷新页面重试</li>
              </ul>
            </div>
            <button className="retry-btn" onClick={handleRetry}>重试</button>
          </div>
        )}
      </div>

      {/* 使用Portal将Valine渲染到独立DOM节点 */}
      {containerRef.current && !errorMsg && (
        createPortal(
          <div id="valine-comment" style={{ display: isLoading ? 'none' : 'block' }} />,
          containerRef.current
        )
      )}
    </div>
  );
};

export default CommentSection;
    