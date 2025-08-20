import React, { useState, useEffect, useCallback } from 'react';

const GitHubProjects = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  // 配置信息
  const GITHUB_USERNAME = "dongbiaobiao";
  // 从环境变量获取令牌（推荐）或直接填入（不推荐公开代码）
  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN ; // 替换为你的令牌

  // CORS代理列表
  const CORS_PROXIES = [
    "https://proxy.cors.sh/"
  ];
  const [currentProxyIndex, setCurrentProxyIndex] = useState(0);

  // 获取项目数据
  const fetchRepos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('开始请求GitHub API...');

      // 构建基础API URL
      const apiUrl = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=10`;

      // 处理不同代理的URL格式
      let proxiedUrl;
      if (CORS_PROXIES[currentProxyIndex].includes('allorigins')) {
        proxiedUrl = `${CORS_PROXIES[currentProxyIndex]}${encodeURIComponent(apiUrl)}`;
      } else {
        proxiedUrl = `${CORS_PROXIES[currentProxyIndex]}${apiUrl}`;
      }

      setDebugInfo(`使用代理: ${CORS_PROXIES[currentProxyIndex]} 发送请求...`);

      // 构建请求头
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Origin': window.location.origin
      };

      // 如果有令牌，添加到请求头（提高API限制）
      if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        setDebugInfo(prev => prev + '（使用访问令牌）');
      }

      const response = await Promise.race([
        fetch(proxiedUrl, {
          method: 'GET',
          headers: headers,
          mode: 'cors',
          cache: 'no-cache'
        }),
        // 10秒超时处理
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('请求超时')), 10000)
        )
      ]);

      setDebugInfo(`API响应状态: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        // 处理常见错误状态
        if (response.status === 401) {
          throw new Error('访问令牌无效或已过期');
        } else if (response.status === 403) {
          throw new Error('请求被拒绝，API速率限制可能已达上限');
        } else if (response.status === 404) {
          throw new Error('未找到用户，请检查GitHub用户名');
        } else {
          throw new Error(`请求失败: ${response.status} ${response.statusText}`);
        }
      }

      // 处理不同代理的响应格式
      let data;
      if (CORS_PROXIES[currentProxyIndex].includes('allorigins')) {
        const responseData = await response.json();
        data = JSON.parse(responseData.contents);
      } else {
        data = await response.json();
      }

      setDebugInfo(`成功获取 ${data.length} 个项目`);
      setRepos(data);
    } catch (err) {
      setError(`加载失败: ${err.message}`);
      setDebugInfo(`错误详情: ${err.message}`);
      console.error('获取GitHub仓库失败:', err);
    } finally {
      setLoading(false);
    }
  }, [currentProxyIndex]);

  // 初始加载
  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // 刷新项目列表
  const refreshProjects = () => {
    fetchRepos();
  };

  // 切换到下一个代理
  const tryNextProxy = () => {
    setCurrentProxyIndex(prev => (prev + 1) % CORS_PROXIES.length);
    setDebugInfo(`切换到代理 ${CORS_PROXIES[(currentProxyIndex + 1) % CORS_PROXIES.length]}`);
  };

  // 备用静态项目列表
  const showFallbackProjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">blog</h3>
        <p className="text-gray-600 mb-4">个人博客项目</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">JavaScript</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            <i className="fa fa-star-o mr-1"></i>0
          </span>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <a
            href="https://github.com/dongbiaobiao/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <span>查看项目</span>
            <i className="fa fa-external-link ml-2 text-sm"></i>
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-3">
          <i className="fa fa-code-fork mr-1"></i>Forked
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-800">all-in-rag</h3>
        <p className="text-gray-600 mb-4">RAG相关项目</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Python</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            <i className="fa fa-star-o mr-1"></i>0
          </span>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <a
            href="https://github.com/dongbiaobiao/all-in-rag"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <span>查看项目</span>
            <i className="fa fa-external-link ml-2 text-sm"></i>
          </a>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section id="github-projects" className="py-40 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 mb-2">正在加载GitHub项目...</p>
          <p className="text-sm text-gray-500">{debugInfo}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="github-projects" className="py-40 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">GitHub 项目</h2>
        <span className="block w-12 h-2 bg-indigo-600 rounded mx-auto mt-5 mb-10"></span>

        {/* 错误提示和操作按钮 */}
        {error && (
          <div className="text-center mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-sm text-gray-500 mb-3">{debugInfo}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={refreshProjects}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm transition-colors"
              >
                <i className="fa fa-refresh mr-1"></i>重试
              </button>
              <button
                onClick={tryNextProxy}
                className="px-4 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition-colors"
              >
                <i className="fa fa-random mr-1"></i>切换代理
              </button>
              {!GITHUB_TOKEN && (
                <button
                  onClick={() => alert('请配置GitHub访问令牌以提高请求成功率')}
                  className="px-4 py-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm transition-colors"
                >
                  <i className="fa fa-key mr-1"></i>配置令牌
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          我的开源项目和代码仓库，欢迎Star和Fork
        </p>

        {/* 项目列表展示 */}
        {repos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {repos.map((repo) => (
              <div key={repo.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
                {repo.fork && (
                  <div className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-3">
                    <i className="fa fa-code-fork mr-1"></i>Forked
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-3 text-gray-800">{repo.name}</h3>
                <p className="text-gray-600 mb-4">
                  {repo.description || '无项目描述'}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.language && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {repo.language}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    <i className="fa fa-star-o mr-1"></i>{repo.stargazers_count}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    <span>查看项目</span>
                    <i className="fa fa-external-link ml-2 text-sm"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          showFallbackProjects()
        )}

        <div className="text-center mt-12">
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <i className="fa fa-github mr-2"></i>
            访问我的GitHub主页
          </a>
        </div>
      </div>
    </section>
  );
};

export default GitHubProjects;
