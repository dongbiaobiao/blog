import React, { useEffect, useState, useRef } from 'react';
import './CommentSection.css';

const CommentSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitError, setSubmitError] = useState('');
  const initialized = useRef(false);
  const nickRef = useRef(null);
  const mailRef = useRef(null);
  const linkRef = useRef(null);
  const contentRef = useRef(null);

  // 邮箱和网址验证函数
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUrl = (url) => !url.trim() || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(url);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initCommentSystem = (AV, Valine) => {
      if (!AV.applicationId) {
        AV.init({
          appId: 'nZCZLRsUoF6bUak4STegPS1d-gzGzoHsz',
          appKey: 'FkyYQstKUDsYatd1jT7uUgbX',
          serverURLs: 'https://nzczlrsu.lc-cn-n1-shared.com'
        });
      }

      const valine = new Valine({
        el: '#valine-comment',
        path: window.location.pathname,
        placeholder: '分享你的想法和建议吧～',
        avatar: 'mp',
        lang: 'zh-CN',
        pageSize: 10,
        enableQQ: true,
        appId: 'nZCZLRsUoF6bUak4STegPS1d-gzGzoHsz',
        appKey: 'FkyYQstKUDsYatd1jT7uUgbX',
        serverURLs: 'https://nzczlrsu.lc-cn-n1-shared.com'
      });

      const bindSubmitEvent = () => {
        const submitBtn = document.querySelector('.vsubmit');
        if (submitBtn) {
          submitBtn.onclick = () => {
            setSubmitError('');
            const nick = nickRef.current?.value?.trim() || '';
            const mail = mailRef.current?.value?.trim() || '';
            const link = linkRef.current?.value?.trim() || '';
            const content = contentRef.current?.value?.trim() || '';

            if (!content) return setSubmitError('请输入评论内容～');
            if (mail && !isValidEmail(mail)) return setSubmitError('请输入有效的邮箱地址');
            if (link && !isValidUrl(link)) return setSubmitError('请输入有效的网址');

            valine.submit();
            if (nick || mail || link) {
              localStorage.setItem('Valine::vuser', JSON.stringify({ nick, mail, link }));
            }
          };
        }
      };

      const bindFormRefs = () => {
        nickRef.current = document.querySelector('.vnick');
        mailRef.current = document.querySelector('.vmail');
        linkRef.current = document.querySelector('.vlink');
        contentRef.current = document.querySelector('.veditor textarea');
        bindSubmitEvent();
      };

      // 延迟绑定确保DOM存在
      const timer = setTimeout(bindFormRefs, 100);
      setIsLoading(false);

      // 清理定时器
      return () => clearTimeout(timer);
    };

    // 优化清理函数，避免DOM操作冲突
    const cleanup = () => {
      window.removeEventListener('error', handleGlobalError);
      // 安全移除脚本
      ['leancloud-storage', 'valine'].forEach(key => {
        const scripts = document.querySelectorAll(`script[src*="${key}"]`);
        scripts.forEach(script => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        });
      });
      const container = document.getElementById('valine-comment');
      if (container) {
        // 用React状态控制清空，而非直接操作DOM
        container.innerHTML = '';
      }
    };

    // 修复全局错误监听中的includes判断（关键修复）
    const handleGlobalError = (msg, source, lineno, colno, error) => {
      // 先判断source是否存在再调用includes
      if (source && (source.includes('Valine.min.js') || source.includes('av-min.js'))) {
        setErrorMsg(`脚本错误: ${error?.message || msg}`);
        setIsLoading(false);
      }
      return false;
    };
    window.addEventListener('error', handleGlobalError);

    const loadAV = () => {
      if (window.AV) return Promise.resolve(window.AV);
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://fastly.jsdelivr.net/npm/leancloud-storage@3.1.1/dist/av-min.js';
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
        script.src = 'https://fastly.jsdelivr.net/npm/valine@1.4.18/dist/Valine.min.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => window.Valine ? resolve(window.Valine) : reject(new Error('Valine 未加载'));
        script.onerror = () => reject(new Error('Valine 加载失败'));
        document.body.appendChild(script);
      });
    };

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
                <li>1. 确保页面中只加载了一次 LeanCloud 和 Valine</li>
                <li>2. 检查是否有其他组件也在使用 LeanCloud SDK</li>
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