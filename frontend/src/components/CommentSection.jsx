import React, { useEffect, useState, useRef } from 'react';
import './CommentSection.css';

const CommentSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitError, setSubmitError] = useState('');
  const initialized = useRef(false); // 标记是否已初始化
  const nickRef = useRef(null);
  const mailRef = useRef(null);
  const linkRef = useRef(null);
  const contentRef = useRef(null);
  // 新增：存储Valine实例引用
  const valineInstance = useRef(null);

  // 邮箱和网址验证函数
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUrl = (url) => !url.trim() || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(url);

  useEffect(() => {
    // 防止重复初始化
    if (initialized.current) return;
    initialized.current = true;

    // 1. 先定义初始化函数
    const initCommentSystem = (AV, Valine) => {
      // 防止重复初始化AV，强制配置服务器地址
      if (!AV.applicationId) {
        AV.init({
          appId: 'nZCZLRsUoF6bUak4STegPS1d-gzGzoHsz',
          appKey: 'FkyYQstKUDsYatd1jT7uUgbX',
          // 明确指定服务器地址，防止使用默认域名
          serverURLs: 'https://nzczlrsu.lc-cn-n1-shared.com'
        });
      } else {
        // 如果已初始化，强制更新服务器地址
        AV.setServerURLs('https://nzczlrsu.lc-cn-n1-shared.com');
      }

      // 创建Valine实例并存储引用
      valineInstance.current = new Valine({
        el: '#valine-comment',
        path: window.location.pathname,
        placeholder: '分享你的想法和建议吧～',
        avatar: 'mp',
        lang: 'zh-CN',
        pageSize: 10,
        enableQQ: true,
        appId: 'nZCZLRsUoF6bUak4STegPS1d-gzGzoHsz',
        appKey: 'FkyYQstKUDsYatd1jT7uUgbX',
        // 关键：配置serverURLs为正确地址
        serverURLs: 'https://nzczlrsu.lc-cn-n1-shared.com'
      });

      // 绑定提交按钮事件
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

            // 使用存储的实例提交
            valineInstance.current.submit();
            if (nick || mail || link) {
              localStorage.setItem('Valine::vuser', JSON.stringify({ nick, mail, link }));
            }
          };
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

      // 延长超时时间确保DOM加载完成
      setTimeout(bindFormRefs, 300);
      setIsLoading(false);
    };

    // 2. 定义清理函数
    const cleanup = () => {
      window.removeEventListener('error', handleGlobalError);
      // 移除已加载的脚本
      ['leancloud-storage', 'valine'].forEach(key => {
        const scripts = document.querySelectorAll(`script[src*="${key}"]`);
        scripts.forEach(script => script.remove());
      });
      const container = document.getElementById('valine-comment');
      if (container) container.innerHTML = '';
      // 清除Valine实例
      valineInstance.current = null;
    };

    // 3. 定义全局错误监听
    const handleGlobalError = (msg, source, lineno, colno, error) => {
      if (source.includes('Valine.min.js') || source.includes('av-min.js')) {
        setErrorMsg(`脚本错误: ${error?.message || msg}`);
        setIsLoading(false);
      }
      return false;
    };
    window.addEventListener('error', handleGlobalError);

    // 4. 定义加载LeanCloud的函数
    const loadAV = () => {
      if (window.AV) return Promise.resolve(window.AV);
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/leancloud-storage@3.11.1/dist/av-min.js';
        // 更新SDK版本到较新的3.11.1，修复可能的旧版本域名问题
        script.crossOrigin = 'anonymous';
        script.onload = () => window.AV ? resolve(window.AV) : reject(new Error('LeanCloud SDK 未加载'));
        script.onerror = () => reject(new Error('LeanCloud 加载失败'));
        document.body.appendChild(script);
      });
    };

    // 5. 定义加载Valine的函数
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

    // 执行流程
    setIsLoading(true);
    setErrorMsg('');

    // 检查全局是否已加载
    if (window.AV && window.Valine) {
      try {
        initCommentSystem(window.AV, window.Valine);
      } catch (err) {
        setErrorMsg(`初始化失败: ${err.message}`);
        setIsLoading(false);
      }
      return cleanup;
    }

    // 加载并初始化
    Promise.all([loadAV(), loadValine()])
      .then(([AV, Valine]) => initCommentSystem(AV, Valine))
      .catch(err => {
        setErrorMsg(`初始化失败: ${err.message}`);
        setIsLoading(false);
      });

    return cleanup;
  }, []); // 空依赖数组，确保只执行一次

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
                <li>3. 确认网络连接正常</li>
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