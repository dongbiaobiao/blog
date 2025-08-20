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
  const commentContainerRef = useRef(null);
  const valineInstance = useRef(null);
  const observerRef = useRef(null);
  const isUnmounted = useRef(false); // 跟踪组件是否已卸载

  // 邮箱和网址验证函数
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUrl = (url) => !url.trim() || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(url);

  useEffect(() => {
    // 组件卸载时标记
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (!commentContainerRef.current || initialized.current) return;
    initialized.current = true;

    // 初始化评论系统
    const initCommentSystem = (AV, Valine) => {
      // 检查组件是否已卸载
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

      // 先清空容器，避免重复渲染
      if (commentContainerRef.current) {
        commentContainerRef.current.innerHTML = '';
      }

      // 创建Valine实例
      valineInstance.current = new Valine({
        el: commentContainerRef.current,
        path: window.location.pathname,
        placeholder: '分享你的想法和建议吧～',
        avatar: 'mp',
        lang: 'zh-CN',
        pageSize: 10,
        enableQQ: true,
        appId: LEANCLOUD_CONFIG.appId,
        appKey: LEANCLOUD_CONFIG.appKey,
        serverURLs: LEANCLOUD_CONFIG.serverURLs,
        // 表情配置
        emojiCDN: "https://cdn.jsdelivr.net/npm/valine@1.4.18/dist/emojis/",
        emojiMaps: {
          "smile": "smile.png",
          "laugh": "laugh.png",
          "sad": "sad.png",
          "angry": "angry.png",
          "surprise": "surprise.png",
          "cry": "cry.png",
          "smiley": "smiley.png",
          "grin": "grin.png",
          "blush": "blush.png",
          "wink": "wink.png",
          "heart": "heart.png",
          "thumbsup": "thumbsup.png",
          "tada": "tada.png",
          "confused": "confused.png",
          "question": "question.png",
          "ok_hand": "ok_hand.png"
        },
        emojiTooltip: true
      });

      // 绑定提交事件
      const bindSubmitEvent = () => {
        if (isUnmounted.current || !commentContainerRef.current) return;

        const submitBtn = commentContainerRef.current.querySelector('.vsubmit');
        if (submitBtn) {
          submitBtn.onclick = handleSubmit;
        }
      };

      // 处理提交逻辑
      const handleSubmit = () => {
        if (isUnmounted.current) return;

        setSubmitError('');
        if (!commentContainerRef.current) return;

        const nick = commentContainerRef.current.querySelector('.vnick')?.value?.trim() || '';
        const mail = commentContainerRef.current.querySelector('.vmail')?.value?.trim() || '';
        const link = commentContainerRef.current.querySelector('.vlink')?.value?.trim() || '';
        const content = commentContainerRef.current.querySelector('.veditor textarea')?.value?.trim() || '';

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
        if (isUnmounted.current || !commentContainerRef.current) {
          observer.disconnect();
          return;
        }

        if (commentContainerRef.current.querySelector('.vsubmit')) {
          bindSubmitEvent();
          observer.disconnect();
        }
      });
      observer.observe(commentContainerRef.current, { childList: true, subtree: true });
      observerRef.current = observer;

      if (!isUnmounted.current) {
        setIsLoading(false);
      }
    };

    // 清理函数 - 关键修复
    const cleanup = () => {
      // 标记组件已卸载
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

      // 清理DOM - 关键修复
      if (commentContainerRef.current) {
        // 先移除事件监听器
        const submitBtn = commentContainerRef.current.querySelector('.vsubmit');
        if (submitBtn) {
          submitBtn.onclick = null;
        }

        // 安全清空容器
        while (commentContainerRef.current.firstChild) {
          try {
            commentContainerRef.current.removeChild(commentContainerRef.current.firstChild);
          } catch (err) {
            console.warn('移除子节点时出错:', err);
            break; // 避免无限循环
          }
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

      {/* 使用独立的容器来避免React虚拟DOM冲突 */}
      <div
        ref={commentContainerRef}
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
