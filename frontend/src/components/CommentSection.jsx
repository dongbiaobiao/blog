import React, { useEffect, useState, useRef } from 'react';
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
  const containerRef = useRef(null); // React管理的容器引用
  const valineContainerRef = useRef(null); // Valine专用容器
  const valineInstance = useRef(null);
  const observerRef = useRef(null);
  const isUnmounted = useRef(false);

  // 邮箱和网址验证函数
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUrl = (url) => !url.trim() || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(url);

  // 创建独立的Valine容器，完全脱离React管理
  useEffect(() => {
    // 创建一个不在React虚拟DOM树中的容器
    const valineContainer = document.createElement('div');
    valineContainer.id = 'valine-standalone-container';
    document.body.appendChild(valineContainer);
    valineContainerRef.current = valineContainer;

    return () => {
      // 组件卸载时彻底移除这个容器
      if (valineContainerRef.current && document.body.contains(valineContainerRef.current)) {
        document.body.removeChild(valineContainerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // 标记组件卸载状态
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !valineContainerRef.current || initialized.current) return;
    initialized.current = true;

    // 初始化评论系统
    const initCommentSystem = (AV, Valine) => {
      if (isUnmounted.current) return;

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

      // 清空Valine容器
      valineContainerRef.current.innerHTML = '';

      // 创建Valine实例，绑定到独立容器
      valineInstance.current = new Valine({
        el: valineContainerRef.current,
        path: window.location.pathname,
        placeholder: '分享你的想法和建议吧～',
        avatar: 'mp',
        lang: 'zh-CN',
        pageSize: 10,
        enableQQ: true,
        appId: LEANCLOUD_CONFIG.appId,
        appKey: LEANCLOUD_CONFIG.appKey,
        serverURLs: LEANCLOUD_CONFIG.serverURLs,
        // 👇 表情配置修改部分
        emojiCDN: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/',
        emojiMaps: {
          'smile': '1f604.svg',       // 😄
          'laugh': '1f606.svg',       // 😆
          'sad': '1f622.svg',         // 😢
          'angry': '1f621.svg',       // 😡
          'surprise': '1f62f.svg',    // 😯
          'cry': '1f62d.svg',         // 😭
          'smiley': '1f603.svg',      // 😃
          'grin': '1f601.svg',        // 😁
          'blush': '1f60a.svg',       // 😊
          'wink': '1f609.svg',        // 😉
          'heart': '2764.svg',        // ❤️
          'thumbsup': '1f44d.svg',    // 👍
          'tada': '1f389.svg',        // 🎉
          'confused': '1f615.svg',    // 😕
          'question': '2753.svg',     // ❓
          'ok_hand': '1f44c.svg'      // 👌
        },
        emojiTooltip: true
        // 👆 表情配置修改结束
      });

      // 添加Twemoji加载和渲染代码
      const loadTwemoji = () => {
        if (window.twemoji) return Promise.resolve();
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/dist/twemoji.min.js';
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      };

      // 加载Twemoji后渲染表情
      loadTwemoji().then(() => {
        if (window.twemoji) {
          window.twemoji.parse(valineContainerRef.current, {
            folder: 'svg',
            ext: '.svg'
          });
        }
      });

      // 将Valine容器的内容移动到React容器中显示
      if (containerRef.current && valineContainerRef.current) {
        containerRef.current.appendChild(valineContainerRef.current);
      }

      // 绑定提交事件
      const bindSubmitEvent = () => {
        if (isUnmounted.current || !valineContainerRef.current) return;

        const submitBtn = valineContainerRef.current.querySelector('.vsubmit');
        if (submitBtn) {
          submitBtn.onclick = handleSubmit;
        }
      };

      // 处理提交逻辑
      const handleSubmit = () => {
        if (isUnmounted.current) return;

        setSubmitError('');
        if (!valineContainerRef.current) return;

        const nick = valineContainerRef.current.querySelector('.vnick')?.value?.trim() || '';
        const mail = valineContainerRef.current.querySelector('.vmail')?.value?.trim() || '';
        const link = valineContainerRef.current.querySelector('.vlink')?.value?.trim() || '';
        const content = valineContainerRef.current.querySelector('.veditor textarea')?.value?.trim() || '';

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
        if (isUnmounted.current || !valineContainerRef.current) {
          observer.disconnect();
          return;
        }

        if (valineContainerRef.current.querySelector('.vsubmit')) {
          bindSubmitEvent();
          observer.disconnect();
        }
      });
      observer.observe(valineContainerRef.current, { childList: true, subtree: true });
      observerRef.current = observer;

      if (!isUnmounted.current) {
        setIsLoading(false);
      }
    };

    // 清理函数 - 关键修复
    const cleanup = () => {
      isUnmounted.current = true;

      // 移除全局事件监听
      window.removeEventListener('error', handleGlobalError);

      // 断开观察者
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // 销毁Valine实例
      if (valineInstance.current) {
        if (typeof valineInstance.current.destroy === 'function') {
          try {
            valineInstance.current.destroy();
          } catch (err) {
            console.warn('Valine销毁时出错:', err);
          }
        }
        valineInstance.current = null;
      }

      // 从React容器中移除Valine容器，避免React尝试操作它
      if (containerRef.current && valineContainerRef.current &&
          containerRef.current.contains(valineContainerRef.current)) {
        try {
          containerRef.current.removeChild(valineContainerRef.current);
        } catch (err) {
          console.warn('从React容器移除Valine容器时出错:', err);
        }
      }
    };

    // 错误处理
    const handleGlobalError = (msg, source, lineno, colno, error) => {
      if (isUnmounted.current) return false;

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
        script.onload = () => {
          if (isUnmounted.current) return reject(new Error('组件已卸载'));
          window.AV ? resolve(window.AV) : reject(new Error('LeanCloud SDK 未加载'));
        };
        script.onerror = () => {
          if (!isUnmounted.current) reject(new Error('LeanCloud 加载失败'));
        };
        document.body.appendChild(script);
      });
    };

    const loadValine = () => {
      if (window.Valine) return Promise.resolve(window.Valine);
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/valine@1.4.18/dist/Valine.min.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          if (isUnmounted.current) return reject(new Error('组件已卸载'));
          window.Valine ? resolve(window.Valine) : reject(new Error('Valine 未加载'));
        };
        script.onerror = () => {
          if (!isUnmounted.current) reject(new Error('Valine 加载失败'));
        };
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
        if (!isUnmounted.current) {
          setErrorMsg(`初始化失败: ${err.message}`);
          setIsLoading(false);
        }
      }
      return cleanup;
    }

    Promise.all([loadAV(), loadValine()])
      .then(([AV, Valine]) => {
        if (!isUnmounted.current) {
          initCommentSystem(AV, Valine);
        }
      })
      .catch(err => {
        if (!isUnmounted.current) {
          setErrorMsg(`初始化失败: ${err.message}`);
          setIsLoading(false);
        }
      });

    return cleanup;
  }, []);

  const handleRetry = () => window.location.reload(true);

  return (
    <div className="comment-section">
      <h3 className="comment-title">评论区</h3>
      <p className="comment-desc">欢迎留下你的宝贵意见</p>

      {/* React只管理这个容器的存在，不干涉其内部内容 */}
      <div
        ref={containerRef}
        className="comment-content"
        style={{ minHeight: '300px' }}
      >
        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>评论加载中...</p>
          </div>
        )}

        {submitError && (
          <div className="submit-error alert alert-error">
            ⚠️ {submitError}
          </div>
        )}

        {errorMsg && (
          <div className="error-state alert alert-fatal">
            <p>评论系统加载失败：{errorMsg}</p>
            <div className="error-guide">
              <p>排查建议：</p>
              <ul>
                <li>1. 确认LeanCloud服务地址正确</li>
                <li>2. 检查网络连接是否正常</li>
                <li>3. 刷新页面重试</li>
              </ul>
            </div>
            <button className="retry-btn btn-retry" onClick={handleRetry}>重试</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;