import React, { useEffect, useState, useRef } from 'react';
import './CommentSection.css';

const CommentSection = () => {
  // 配置常量提取到顶部
  const LEANCLOUD_CONFIG = {
    appId: 'nZCZLRsUoF6bUak4STegPS1d-gzGzoHsz',
    appKey: 'FkyYQstKUDsYatd1jT7uUgbX',
    serverURLs: 'https://nzczlrsu.lc-cn-n1-shared.com'
  };

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitError, setSubmitError] = useState('');
  const initialized = useRef(false);
  const nickRef = useRef(null);
  const mailRef = useRef(null);
  const linkRef = useRef(null);
  const contentRef = useRef(null);
  const valineInstance = useRef(null);
  const observerRef = useRef(null); // 用于安全监听DOM变化

  // 邮箱和网址验证函数
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUrl = (url) => !url.trim() || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(url);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 初始化评论系统
    const initCommentSystem = (AV, Valine) => {
      // 初始化AV，强制使用正确的服务器地址
      if (!AV.applicationId) {
        AV.init({
          appId: LEANCLOUD_CONFIG.appId,
          appKey: LEANCLOUD_CONFIG.appKey,
          serverURLs: LEANCLOUD_CONFIG.serverURLs
        });
      } else {
        AV.setServerURLs(LEANCLOUD_CONFIG.serverURLs);
      }

      // 创建Valine实例
      valineInstance.current = new Valine({
        el: '#valine-comment',
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
        const submitBtn = document.querySelector('.vsubmit');
        if (submitBtn) {
          submitBtn.onclick = handleSubmit;
        }
      };

      // 处理提交逻辑
      const handleSubmit = () => {
        setSubmitError('');
        const nick = nickRef.current?.value?.trim() || '';
        const mail = mailRef.current?.value?.trim() || '';
        const link = linkRef.current?.value?.trim() || '';
        const content = contentRef.current?.value?.trim() || '';

        if (!content) return setSubmitError('请输入评论内容～');
        if (mail && !isValidEmail(mail)) return setSubmitError('请输入有效的邮箱地址');
        if (link && !isValidUrl(link)) return setSubmitError('请输入有效的网址');

        valineInstance.current?.submit();
        if (nick || mail || link) {
          localStorage.setItem('Valine::vuser', JSON.stringify({ nick, mail, link }));
        }
      };

      // 绑定表单引用
      const bindFormRefs = () => {
        nickRef.current = document.querySelector('.vnick');
        mailRef.current = document.querySelector('.vmail');
        linkRef.current = document.querySelector('.vlink');
        contentRef.current = document.querySelector('.veditor textarea');
        bindSubmitEvent();
      };

      // 使用MutationObserver安全监听DOM变化，替代setTimeout
      const container = document.getElementById('valine-comment');
      if (container) {
        const observer = new MutationObserver((mutations) => {
          if (document.querySelector('.vsubmit')) {
            bindFormRefs();
            observer.disconnect(); // 完成后停止监听
          }
        });
        observer.observe(container, { childList: true, subtree: true });
        observerRef.current = observer;
      }

      setIsLoading(false);
    };

    // 安全的清理函数 - 移除直接DOM操作
    const cleanup = () => {
      window.removeEventListener('error', handleGlobalError);

      // 断开观察者连接
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // 只清理实例引用，不直接操作DOM
      valineInstance.current = null;
    };

    // 修复includes错误：先检查source是否存在
    const handleGlobalError = (msg, source, lineno, colno, error) => {
      // 关键修复：先判断source是否为字符串再调用includes
      if (typeof source === 'string' &&
          (source.includes('Valine.min.js') || source.includes('av-min.js'))) {
        setErrorMsg(`脚本错误: ${error?.message || msg}`);
        setIsLoading(false);
      }
      return false;
    };
    window.addEventListener('error', handleGlobalError);

    // 加载LeanCloud SDK
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

    // 加载Valine
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

  return (
    <div className="comment-section">
      <h3 className="comment-title">评论区</h3>
      <p className="comment-desc">欢迎留下你的宝贵意见</p>

      <div id="valine-comment" className={isLoading ? 'comment-loading' : ''}>
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
    </div>
  );
};

export default CommentSection;
    