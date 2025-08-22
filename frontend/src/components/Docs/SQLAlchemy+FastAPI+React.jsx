import React, { useState, useRef, useEffect } from 'react';
import DocLayout from '../DocLayout';
import { docs } from '../StudyDocs';
// 导入通用UI配置（删除组件内硬编码的COLORS）
import uiConfig from './json/uiConfig.json';

// 文档专属常量（与文档强绑定，不放入通用UI配置）
const DOC_TITLE = "用户认证系统前端实现";
const TARGET_DOC_TITLE = "SQLAlchemy + FastAPI + React 项目教程";
const HEADINGS = [
  "1. 安装Node.js",
  "2. 创建项目结构",
  "3. 后端核心实现",
  "4. 前端核心实现",
  "5. 前后端联调",
  "6. 最终效果展示"
];

// 新增：统一ID生成函数，与DocLayout保持一致
const generateHeadingId = (headingText) => {
  return headingText.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

// 最后更新时间组件（UI参数来自uiConfig）
const LastUpdatedTime = () => {
  const sqlDoc = docs.find(doc => doc.title === TARGET_DOC_TITLE) || {};
  const lastUpdated = sqlDoc.lastUpdated || '未知';

  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div style={{
      textAlign: 'right',
      color: uiConfig.colors.secondary,
      fontSize: '0.9rem',
      marginBottom: '1.5rem',
      fontStyle: 'italic',
      padding: '0.5rem 0',
      borderBottom: `1px solid ${uiConfig.colors.border}`
    }}>
      最后更新时间：{formatDate(lastUpdated)}
    </div>
  );
};

// 折叠面板组件（UI参数来自uiConfig）
const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div style={{
      margin: uiConfig.dimensions.collapsibleMargin,
      border: `1px solid ${uiConfig.colors.border}`,
      borderRadius: uiConfig.dimensions.codeBlockBorderRadius,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }}>
      <div
        style={{
          padding: uiConfig.dimensions.collapsibleHeaderPadding,
          background: uiConfig.colors.light,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: '600',
          color: uiConfig.colors.heading,
          borderRadius: `${uiConfig.dimensions.codeBlockBorderRadius} ${uiConfig.dimensions.codeBlockBorderRadius} 0 0`,
          transition: 'background 0.2s ease'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
        onMouseOut={(e) => e.currentTarget.style.background = uiConfig.colors.light}
      >
        <span>{title}</span>
        <span style={{
          transition: 'transform 0.3s ease',
          color: uiConfig.colors.primary,
          fontWeight: 'bold'
        }}>
          {isOpen ? uiConfig.controls.collapsibleIcons.open : uiConfig.controls.collapsibleIcons.close}
        </span>
      </div>
      <div
        style={{
          maxHeight: isOpen ? uiConfig.controls.collapsibleMaxHeightOpen : uiConfig.controls.collapsibleMaxHeightClose,
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
          borderTop: isOpen ? `1px solid ${uiConfig.colors.border}` : 'none'
        }}
      >
        <div style={{
          padding: uiConfig.dimensions.collapsibleContentPadding,
          backgroundColor: 'white'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// 提示框组件（UI参数来自uiConfig）
const TipBox = ({ type = 'info', children }) => {
  const styles = {
    info: {
      background: '#eff6ff',
      borderLeft: `4px solid ${uiConfig.colors.info}`,
      color: '#0369a1'
    },
    warning: {
      background: '#fffbeb',
      borderLeft: `4px solid ${uiConfig.colors.warning}`,
      color: '#b45309'
    },
    danger: {
      background: '#fee2e2',
      borderLeft: `4px solid ${uiConfig.colors.danger}`,
      color: '#b91c1c'
    }
  };

  return (
    <div style={{
      ...styles[type],
      padding: uiConfig.dimensions.tipBoxPadding,
      margin: uiConfig.dimensions.tipBoxMargin,
      borderRadius: uiConfig.dimensions.codeBlockBorderRadius,
      display: 'flex',
      alignItems: 'flex-start',
      gap: uiConfig.dimensions.tipBoxGap
    }}>
      <div style={{
        fontSize: '1.25rem',
        marginTop: '0.1rem'
      }}>{uiConfig.controls.tipBoxIcons[type]}</div>
      <div style={{
        lineHeight: '1.7',
        color: styles[type].color
      }}>{children}</div>
    </div>
  );
};

// 图片组件（UI参数来自uiConfig）
const ImageViewer = ({ src, alt, style = {} }) => {
  return (
    <div style={{
      ...style,
      textAlign: 'center',
      margin: uiConfig.dimensions.imageViewerMargin,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        padding: uiConfig.dimensions.imageViewerPadding,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: `1px solid ${uiConfig.colors.border}`,
        maxWidth: '100%'
      }}>
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: uiConfig.dimensions.imageViewerMaxHeight,
            borderRadius: '4px'
          }}
        />
        <div style={{
          marginTop: uiConfig.dimensions.imageViewerPadding,
          fontSize: '0.9rem',
          color: uiConfig.colors.secondary,
          fontStyle: 'italic'
        }}>
          {alt}
        </div>
      </div>
    </div>
  );
};

// 代码框组件（UI参数来自uiConfig，带复制功能）
const CodeBlock = ({ language, children }) => {
  const [buttonText, setButtonText] = useState(uiConfig.controls.copyButtonTexts.default);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim())
      .then(() => {
        setButtonText(uiConfig.controls.copyButtonTexts.copied);
        setCopied(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setButtonText(uiConfig.controls.copyButtonTexts.default);
          setCopied(false);
        }, uiConfig.controls.copyTimeout);
      })
      .catch(err => console.error('复制失败:', err));
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div style={{
      backgroundColor: uiConfig.colors.codeBg,
      borderRadius: uiConfig.dimensions.codeBlockBorderRadius,
      margin: uiConfig.dimensions.codeBlockMargin,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      <div style={{
        padding: uiConfig.dimensions.codeHeaderPadding,
        fontSize: uiConfig.dimensions.codeHeaderFontSize,
        color: uiConfig.colors.codeText,
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#0f172a',
      }}>
        <span style={{ fontWeight: '500' }}>
          {uiConfig.controls.languageMap[language] || language}
        </span>
        <button
          style={{
            background: copied ? uiConfig.colors.success : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: uiConfig.dimensions.codeBlockBorderRadius,
            padding: uiConfig.dimensions.copyButtonPadding,
            cursor: 'pointer',
            fontSize: uiConfig.dimensions.copyButtonFontSize,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: uiConfig.dimensions.copyButtonGap
          }}
          onClick={handleCopy}
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{buttonText}</span>
        </button>
      </div>
      <div style={{
        maxHeight: uiConfig.controls.codeMaxHeight,
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <pre style={{ margin: 0 }}>
          <code style={{
            padding: uiConfig.dimensions.codeContentPadding,
            display: 'block',
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: uiConfig.dimensions.codeContentFontSize,
            lineHeight: uiConfig.dimensions.codeContentLineHeight,
            color: uiConfig.colors.codeText,
          }}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

const SQLAlchemyFastAPIReact = () => {
  // 组件挂载滚动到顶部（使用uiConfig的滚动行为）
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: uiConfig.controls.scrollBehavior });
  }, []);

  // 代码内容（文档专属业务逻辑，保留在组件内）
  const installNodeCommands = `# 验证Node.js安装
node -v  # 查看Node.js版本
npm -v   # 查看npm版本
npx -v   # 查看npx版本

# 配置npm路径
npm config set prefix "D:\\node.js\\node_global"
npm config set cache "D:\\node.js\\node_cache"`;

  const createProjectCommands = `# 进入项目根目录
cd C:\\Users\\dbb\\Desktop\\SQLAlchemy + FastAPI + React

# 创建React前端项目
npx create-react-app frontend

# 进入前端目录
cd frontend

# 安装依赖
npm install axios react-router-dom bootstrap

# 启动前端项目
npm start`;

  const backendStartCommands = `# 进入后端目录
cd C:\\Users\\dbb\\Desktop\\SQLAlchemy + FastAPI + React\\backend

# 启动FastAPI后端
uvicorn src.main:app --reload`;

  const loginCode = `import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/login', formData);
      localStorage.setItem('token', response.data.access_token);
      navigate('/tasks');
    } catch (err) {
      setError('用户名或密码错误');
    }
  };



  return (
    <div className="container mt-5">
      <h2>用户登录</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">用户名</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">密码</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">登录</button>
      </form>
    </div>
  );
};

export default Login;`;

  const registerCode = `import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      await axios.post('http://localhost:8000/register', formData);
      setSuccess('注册成功，即将跳转到登录页');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || '注册失败，请稍后再试');
    }
  };

  return (
    <div className="container mt-5">
      <h2>用户注册</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">用户名</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">密码</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">注册</button>
      </form>
    </div>
  );
};

export default Register;`;

  return (
    <DocLayout title={DOC_TITLE} headings={HEADINGS}>
      <div style={{
        maxWidth: uiConfig.dimensions.containerMaxWidth,
        margin: '0 auto',
        padding: uiConfig.dimensions.containerPadding,
        color: uiConfig.colors.body,
        lineHeight: '1.8'
      }}>
        {/*<LastUpdatedTime />*/}

        {/* 引言卡片 */}
        <div style={{
          background: '#f8fafc',
          borderLeft: `4px solid ${uiConfig.colors.accent}`,
          padding: uiConfig.dimensions.tipBoxPadding,
          marginBottom: '2rem',
          borderRadius: `0 ${uiConfig.dimensions.codeBlockBorderRadius} ${uiConfig.dimensions.codeBlockBorderRadius} 0`,
        }}>
          <p style={{
            lineHeight: '1.7',
            fontSize: '1.05rem',
            color: '#334155',
            margin: 0
          }}>
            本文档详细介绍SQLAlchemy + FastAPI + React全栈项目的用户认证系统搭建流程，包括环境安装配置、前后端项目结构创建，以及登录、注册页面的具体开发代码和功能实现，涉及表单处理、接口请求、JWT 令牌存储与路由跳转等核心逻辑，适合初学者快速掌握全栈开发核心流程。
          </p>
        </div>

        {/* 1. 安装Node.js */}
        <h3
          id={generateHeadingId("1. 安装Node.js")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >1. 安装Node.js</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          前端基于React开发，需先安装Node.js环境（包含npm包管理工具），确保前端项目正常构建与运行。
        </p>

        <Collapsible title="1.1 下载与安装">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
            访问Node.js官网下载LTS版本，安装时需勾选「Add to PATH」选项，确保命令行可直接调用node、npm命令：
          </p>
          <ol style={{ lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              打开浏览器，访问 <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" style={{ color: uiConfig.colors.primary }}>Node.js官网</a>
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>下载「Windows 64位 LTS版本」</li>
            <li>运行安装包，按提示完成安装（务必勾选「Add to PATH」）</li>
          </ol>
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250808155148503.png"
            alt="Node.js安装界面"
          />
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160558917.png"
            alt="Node.js安装完成"
          />
        </Collapsible>

        <Collapsible title="1.2 验证与配置">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
            安装完成后验证版本，并配置npm全局路径（避免占用C盘空间）：
          </p>
          <CodeBlock language="bash">
{installNodeCommands}
          </CodeBlock>
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160747018.png"
            alt="Node.js版本验证"
          />
          <TipBox type="info">
            <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>环境变量配置说明：</p>
            <ul style={{ margin: uiConfig.dimensions.listMargin }}>
              <li>用户变量Path：将默认npm路径修改为 <code>D:\\node.js\\node_global</code></li>
              <li>系统变量Node_PATH（可选）：新增 <code>D:\\node.js\\node_global\\node_modules</code></li>
            </ul>
          </TipBox>
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250808162134919.png"
            alt="系统环境变量配置"
          />
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 2. 创建项目结构 */}
        <h3
          id={generateHeadingId("2. 创建项目结构")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >2. 创建项目结构</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          项目分为frontend（前端React）和backend（后端FastAPI）两个目录，需分别创建并初始化。
        </p>

        <Collapsible title="2.1 创建前端项目">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
            使用Create React App快速创建前端项目，安装核心依赖：
          </p>
          <CodeBlock language="bash">
{createProjectCommands}
          </CodeBlock>
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250808164020313.png"
            alt="创建React项目"
          />
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250808165401938.png"
            alt="前端项目启动成功"
          />
        </Collapsible>

        <Collapsible title="2.2 项目目录结构">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
            前端核心目录说明（与后端目录对应）：
          </p>
          <div style={{
            display: 'flex',
            gap: uiConfig.dimensions.gridGap,
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: uiConfig.dimensions.minWidth300 }}>
              <h5 style={{
                color: uiConfig.colors.heading,
                fontSize: uiConfig.dimensions.headingFontSizeH5,
                marginBottom: uiConfig.dimensions.paragraphMarginBottom
              }}>前端目录（frontend）</h5>
              <CodeBlock language="bash">
{`src/
├── pages/              # 页面组件
│   ├── Login.js        # 登录页面
│   ├── Register.js     # 注册页面
│   └── TaskList.js     # 任务列表（登录后主页）
├── components/         # 通用组件
│   ├── PrivateRoute.js # 路由保护
│   └── Modal.js        # 弹窗组件
├── utils/              # 工具函数
│   └── api.js          # Axios请求封装
├── App.js              # 根组件（路由配置）
└── index.js            # 入口文件`}
              </CodeBlock>
            </div>
            <div style={{ flex: 1, minWidth: uiConfig.dimensions.minWidth300 }}>
              <h5 style={{
                color: uiConfig.colors.heading,
                fontSize: uiConfig.dimensions.headingFontSizeH5,
                marginBottom: uiConfig.dimensions.paragraphMarginBottom
              }}>后端目录（backend）</h5>
              <CodeBlock language="bash">
{`src/
├── main.py             # 主程序（路由）
├── database.py         # 数据库配置
├── models.py           # 数据模型（User表）
├── schemas.py          # Pydantic模型
├── crud.py             # 数据库操作
├── auth.py             # JWT认证
└── dependencies.py     # 依赖注入
└── sql_app.db          # SQLite数据库`}
              </CodeBlock>
            </div>
          </div>
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 3. 后端核心实现 */}
        <h3
          id={generateHeadingId("3. 后端核心实现")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >3. 后端核心实现</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          后端基于FastAPI构建，结合SQLAlchemy实现数据库操作，通过JWT实现用户认证，需先启动后端服务确保接口可用。
        </p>

        <Collapsible title="3.1 启动后端服务">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
            进入backend目录，通过uvicorn启动FastAPI开发服务器：
          </p>
          <CodeBlock language="bash">
{backendStartCommands}
          </CodeBlock>
          <p style={{ margin: `${uiConfig.dimensions.paragraphMarginBottom} 0` }}>后端依赖安装：需先安装核心包</p>
          <CodeBlock language="bash">
pip install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt]
          </CodeBlock>
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250812164144308.png"
            alt="FastAPI CORS配置"
          />
        </Collapsible>

        <Collapsible title="3.2 核心接口设计">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
            后端提供用户认证相关接口，支持注册、登录、密码修改等功能：
          </p>
          <table
            border="1"
            cellPadding={uiConfig.dimensions.tableCellPadding}
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: uiConfig.dimensions.paragraphMarginBottom
            }}
          >
            <thead>
              <tr style={{ background: uiConfig.colors.light }}>
                <th style={{ border: `1px solid ${uiConfig.colors.border}` }}>接口路径</th>
                <th style={{ border: `1px solid ${uiConfig.colors.border}` }}>请求方式</th>
                <th style={{ border: `1px solid ${uiConfig.colors.border}` }}>功能描述</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}><code>/register</code></td>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}>POST</td>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}>用户注册</td>
              </tr>
              <tr>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}><code>/login</code></td>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}>POST</td>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}>用户登录（获取JWT令牌）</td>
              </tr>
              <tr>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}><code>/users/me</code></td>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}>GET</td>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}>查询当前登录用户信息</td>
              </tr>
              <tr>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}><code>/forgot-password</code></td>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}>POST</td>
                <td style={{ border: `1px solid ${uiConfig.colors.border}` }}>修改用户密码</td>
              </tr>
            </tbody>
          </table>
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 4. 前端核心实现 */}
        <h3
          id={generateHeadingId("4. 前端核心实现")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >4. 前端核心实现</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          前端基于React Router实现路由管理，Axios处理HTTP请求，核心页面包括登录、注册、忘记密码等。
        </p>

        <Collapsible title="4.1 登录页面（Login.js）">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
            实现用户登录逻辑，包含表单验证、JWT令牌存储：
          </p>
          <CodeBlock language="javascript">
{loginCode}
          </CodeBlock>
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250812143037942.png"
            alt="登录页面效果"
          />
        </Collapsible>

        <Collapsible title="4.2 注册页面（Register.js）">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
            实现用户注册逻辑，包含重复用户名检测：
          </p>
          <CodeBlock language="javascript">
{registerCode}
          </CodeBlock>
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250812144959247.png"
            alt="注册页面效果"
          />
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 5. 前后端联调 */}
        <h3
          id={generateHeadingId("5. 前后端联调")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >5. 前后端联调</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          联调需确保前端请求地址与后端一致，处理跨域问题，并验证各接口功能正常。
        </p>

        <Collapsible title="5.1 接口联调示例">
          <div style={{
            display: 'flex',
            gap: uiConfig.dimensions.gridGap,
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: uiConfig.dimensions.minWidth300 }}>
              <h5 style={{
                color: uiConfig.colors.heading,
                fontSize: uiConfig.dimensions.headingFontSizeH5,
                marginBottom: uiConfig.dimensions.paragraphMarginBottom
              }}>注册接口联调</h5>
              <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>请求体示例：</p>
              <CodeBlock language="json">
{`{
  "username": "dbb",
  "password": "dbb123"
}`}
              </CodeBlock>
              <p style={{ marginTop: uiConfig.dimensions.paragraphMarginBottom }}>成功响应：</p>
              <CodeBlock language="json">
{`{
  "id": 1,
  "username": "dbb",
  "created_at": "2025-08-12T07:32:04"
}`}
              </CodeBlock>
            </div>
            <div style={{ flex: 1, minWidth: uiConfig.dimensions.minWidth300 }}>
              <h5 style={{
                color: uiConfig.colors.heading,
                fontSize: uiConfig.dimensions.headingFontSizeH5,
                marginBottom: uiConfig.dimensions.paragraphMarginBottom
              }}>登录接口联调</h5>
              <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>请求体示例：</p>
              <CodeBlock language="json">
{`{
  "username": "dbb",
  "password": "dbb123"
}`}
              </CodeBlock>
              <p style={{ marginTop: uiConfig.dimensions.paragraphMarginBottom }}>成功响应：</p>
              <CodeBlock language="json">
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}`}
              </CodeBlock>
            </div>
          </div>
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250812152757693.png"
            alt="注册接口联调成功"
          />
          <ImageViewer
            src="/Fig/SQLAlchemy+FastAPI+React/image-20250812153223880.png"
            alt="登录接口联调成功"
          />
        </Collapsible>

        <Collapsible title="5.2 常见问题处理">
          <TipBox type="danger">
            <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>跨域问题：</p>
            <p>在FastAPI后端配置 CORS 中间件，允许前端地址(http://localhost:3000)的请求。</p>
          </TipBox>
          <TipBox type="warning">
            <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>令牌失效问题：</p>
            <p>JWT令牌过期后需重新登录，前端可通过拦截器统一处理401错误，跳转登录页。</p>
          </TipBox>
          <TipBox type="info">
            <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>密码安全：</p>
            <p>后端需对密码进行哈希处理(使用bcrypt算法)，禁止存储明文密码。</p>
          </TipBox>
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 6. 最终效果展示 */}
        <h3
          id={generateHeadingId("6. 最终效果展示")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >6. 最终效果展示</h3>

        <Collapsible title="6.1 功能页面效果">
          <div style={{
            display: 'flex',
            gap: uiConfig.dimensions.gridGap,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div style={{ maxWidth: uiConfig.dimensions.maxWidth45 }}>
              <h5 style={{
                color: uiConfig.colors.heading,
                textAlign: 'center',
                fontSize: uiConfig.dimensions.headingFontSizeH5,
                marginBottom: uiConfig.dimensions.paragraphMarginBottom
              }}>登录页面</h5>
              <ImageViewer
                src="/Fig/SQLAlchemy+FastAPI+React/image-20250812143037942.png"
                alt="登录页面"
              />
            </div>
            <div style={{ maxWidth: uiConfig.dimensions.maxWidth45 }}>
              <h5 style={{
                color: uiConfig.colors.heading,
                textAlign: 'center',
                fontSize: uiConfig.dimensions.headingFontSizeH5,
                marginBottom: uiConfig.dimensions.paragraphMarginBottom
              }}>注册页面</h5>
              <ImageViewer
                src="/Fig/SQLAlchemy+FastAPI+React/image-20250812144959247.png"
                alt="注册页面"
              />
            </div>
            <div style={{ maxWidth: uiConfig.dimensions.maxWidth45 }}>
              <h5 style={{
                color: uiConfig.colors.heading,
                textAlign: 'center',
                fontSize: uiConfig.dimensions.headingFontSizeH5,
                marginBottom: uiConfig.dimensions.paragraphMarginBottom
              }}>忘记密码页面</h5>
              <ImageViewer
                src="/Fig/SQLAlchemy+FastAPI+React/image-20250812150252126.png"
                alt="忘记密码页面"
              />
            </div>
            <div style={{ maxWidth: uiConfig.dimensions.maxWidth45 }}>
              <h5 style={{
                color: uiConfig.colors.heading,
                textAlign: 'center',
                fontSize: uiConfig.dimensions.headingFontSizeH5,
                marginBottom: uiConfig.dimensions.paragraphMarginBottom
              }}>任务列表页面（登录后）</h5>
              <ImageViewer
                src="/Fig/SQLAlchemy+FastAPI+React/image-20250812150827727.png"
                alt="任务列表页面"
              />
            </div>
          </div>
        </Collapsible>
      </div>
    </DocLayout>
  );
};

export default SQLAlchemyFastAPIReact;