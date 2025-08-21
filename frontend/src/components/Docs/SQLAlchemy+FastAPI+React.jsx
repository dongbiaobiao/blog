import React, { useEffect } from 'react';
import DocLayout from '../DocLayout';

const SQLAlchemyFastAPIReact = () => {
  // 组件挂载时自动滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <DocLayout title="SQLAlchemy + FastAPI + React 项目教程">
      <p>该项目是一个基于 React 前端和 FastAPI 后端的用户认证与任务管理系统，前端使用 React 框架搭建页面并通过 React Router 实现路由管理，借助 Axios 处理与后端的 HTTP 交互；后端采用 FastAPI 框架构建接口，结合 SQLAlchemy 进行数据库操作（使用 SQLite 作为数据库），通过 JWT 实现用户身份认证，整体实现了用户注册、登录、密码修改、账号注销等核心功能，并预留了任务管理模块的扩展空间。</p>

      <hr />

      <h2>1 安装node.js</h2>

      <ol>
        <li>
          <p>打开浏览器，访问 Node.js 官网：https://nodejs.org/</p>
        </li>
        <li>
          <p>下载 <strong>LTS 版本</strong>（长期支持版，更稳定，适合开发），选择 Windows 系统 64 位 。</p>
        </li>
        <li>
          <p>运行安装包，按照提示完成安装（<strong>勾选 “Add to PATH” 选项</strong>，这样可以在命令行直接使用 <code>node</code>、<code>npm</code>、<code>npx</code>）。</p>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808155148503.png" alt="node.js安装界面1" style={{ zoom: '33%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808155918937.png" alt="node.js安装界面2" style={{ zoom: '100%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808155936738.png" alt="node.js安装界面3" style={{ zoom: '100%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160050331.png" alt="node.js安装界面4" style={{ zoom: '100%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160419346.png" alt="node.js安装界面5" style={{ zoom: '100%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160403578.png" alt="node.js安装界面6" style={{ zoom: '100%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160448919.png" alt="node.js安装界面7" style={{ zoom: '100%' }} />
          <p>等待ing...</p>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160528509.png" alt="node.js安装进度" style={{ zoom: '100%' }} />
          <p>安装完成</p>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160558917.png" alt="node.js安装完成" style={{ zoom: '100%' }} />
        </li>
        <li>
          <h4>验证安装是否成功</h4>
          <ul>
            <li>关闭之前的命令提示符（CMD）或 PowerShell，<strong>重新打开一个新的窗口</strong>（确保环境变量生效）。</li>
            <li>执行以下命令，查看版本号（出现版本号说明安装成功）</li>
          </ul>
          <pre><code>{`node -v  # 查看 Node.js 版本 
npm -v   # 查看 npm 版本 
npx -v   # 查看 npx 版本`}</code></pre>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160747018.png" alt="验证node.js安装" style={{ zoom: '33%' }} />
        </li>
        <li>
          <h4>Node.js环境配置</h4>
          <p>在<code>D:\\node.js</code>目录下创建两个空的文件夹，分别是<code>node_cache</code>还有<code>node_global</code>文件夹</p>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808160922265.png" alt="创建node缓存和全局文件夹" style={{ zoom: '33%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808161128017.png" alt="文件夹创建完成" style={{ zoom: '33%' }} />
          <p>设置npm的路径定位到这两个文件下，目的是为了后面node下载一些文件的时候可以下载到D盘这两个文件夹中（全局文件、缓存文件），这样不会占用太多C盘</p>
          <pre><code>{`npm config set prefix "D:\\node.js\\node_global"
npm config set cache "D:\\node.js\\node_cache"`}</code></pre>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808161357767.png" alt="npm路径配置" style={{ zoom: '33%' }} />
          <p>以记事本格式打开.npmrc文件，把下面两行命令放进去</p>
          <pre><code>{`prefix=D:\\node.js\\node_global

cache=D:\\node.js\\node_cache`}</code></pre>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808161846303.png" alt=".npmrc文件配置" style={{ zoom: '33%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808161809730.png" alt=".npmrc文件内容" style={{ zoom: '33%' }} />
          <p>打开系统环境变量，进行配置，配置截图如下</p>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808162134919.png" alt="系统环境变量配置" style={{ zoom: '33%' }} />
          <p>把用户变量下的Path路径中npm修改为D:\nodejs\node_global</p>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808162619116.png" alt="用户变量配置" style={{ zoom: '100%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808162644970.png" alt="编辑路径" style={{ zoom: '100%' }} />
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808162730088.png" alt="路径配置完成" style={{ zoom: '100%' }} />
          <p>Pycharm环境配置</p>
          <p>进入Pycharm的设置中，按照下面步骤：</p>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808170039109.png" alt="Pycharm配置node.js" style={{ zoom: '33%' }} />
          <p>编写一个test.js文件</p>
          <pre><code>{`function add(a, b){
    return a + b;
}

console.log(add(1, 2))`}</code></pre>
          <p>运行test.js文件，可以看到输出3，至此nodejs环境配置成功</p>
          <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808170305129.png" alt="测试node.js环境" style={{ zoom: '33%' }} />
        </li>
      </ol>

      <h2>2 创建项目</h2>

      <p>管理员身份打开cmd，进入项目根目录（<code>SQLAlchemy + FastAPI + React</code>），执行：</p>
      <p><strong>(如果使用Pycharm，需要使用管理员身份打开)</strong></p>
      <pre><code>{`# 进入项目根目录（\`SQLAlchemy + FastAPI + React\`）
cd C:\\Users\\dbb\\Desktop\\SQLAlchemy + FastAPI + React
# 创建 React 项目 
npx create-react-app frontend 
`}</code></pre>
      <p>使用 Create React App 创建一个新的项目，项目名为 <code>frontend</code>：</p>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808164020313.png" alt="创建React项目" style={{ zoom: '50%' }} />
      <p>当前项目目录如下</p>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808165211685.png" alt="项目目录结构" style={{ zoom: '33%' }} />
      <p>App.js 是主组件文件，定义了一个基础的 React 组件，后期主要改这个文件。</p>
      <p>创建项目后，进入项目目录：</p>
      <pre><code>{`# 进入前端目录 
cd frontend 
`}</code></pre>
      <p>在项目目录中，运行以下命令来启动开发服务器：</p>
      <pre><code>{`# 启动前端项目 
npm start
`}</code></pre>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808165409938.png" alt="启动前端项目" style={{ zoom: '50%' }} />
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250808165401938.png" alt="前端项目启动成功" style={{ zoom: '33%' }} />
      <pre><code>{`# 安装所需依赖 
npm install axios react-router-dom bootstrap 
`}</code></pre>

      <h2>3 前端框架</h2>

      <h3>3.1 项目启动</h3>
      <p>进入<code>C:\\Users\\dbb\\Desktop\\SQLAlchemy + FastAPI + React\\frontend</code>目录中，运行<code>npm start</code>，启动前端项目。</p>
      <pre><code>{`cd C:\\Users\\dbb\\Desktop\\SQLAlchemy + FastAPI + React\\frontend

npm start`}</code></pre>

      <h3>3.2 项目结构</h3>
      <pre><code>{`前端项目
├── public/                 # 静态资源
├── src/
│   ├── pages/              # 页面组件
│   │   ├── Login.js        # 登录页面
│   │   ├── Register.js     # 注册页面
│   │   ├── ForgotPassword.js  # 忘记密码页面
│   │   └── TaskList.js     # 任务列表页面（登录后主页）
│   ├── components/         # 通用组件（预留）
│   │   ├── PrivateRoute.js # 路由保护组件（控制登录权限）
│   │   └── Modal.js        # 弹窗组件（如注销确认弹窗）
│   ├── App.js              # 根组件（路由配置）
│   ├── index.js            # 入口文件
│   └── utils/              # 工具函数（预留）
│       └── api.js          # API请求封装（如Axios配置）`}</code></pre>

      <h2>4 后端框架</h2>

      <h3>4.1 项目启动</h3>
      <p>进入<code>C:\\Users\\dbb\\Desktop\\SQLAlchemy + FastAPI + React\\backend</code>中，运行<code>uvicorn src.main:app --reload</code>，启动后端项目。</p>
      <pre><code>{`cd C:\\Users\\dbb\\Desktop\\SQLAlchemy + FastAPI + React\\backend

uvicorn src.main:app --reload`}</code></pre>
      <p>注意：在 FastAPI 后端中配置跨域资源共享（CORS）中间件，解决前端（通常运行在不同域名 / 端口）与后端通信时的跨域限制问题，具体说明如下：</p>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>配置项</th>
            <th>作用</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>allow_origins=["http://localhost:3000"]</code></td>
            <td>允许来自 <code>http://localhost:3000</code>（前端开发服务器地址）的请求访问后端接口，防止因域名 / 端口不同导致的跨域拦截。</td>
          </tr>
          <tr>
            <td><code>allow_credentials=True</code></td>
            <td>允许前端请求携带认证信息（如 cookies、JWT 令牌等），确保登录状态等身份信息能正常传递。</td>
          </tr>
          <tr>
            <td><code>allow_methods=["*"]</code></td>
            <td>允许所有 HTTP 方法（GET、POST、PUT、DELETE 等）的跨域请求，无需逐个指定。</td>
          </tr>
          <tr>
            <td><code>allow_headers=["*"]</code></td>
            <td>允许前端请求携带任意类型的请求头（如 <code>Authorization</code> 认证头、自定义头信息等）。</td>
          </tr>
          <tr>
            <td><code>expose_headers=["*"]</code></td>
            <td>允许前端访问后端响应中的所有头信息，确保前端能获取到后端返回的自定义响应头（如分页信息、令牌等）。</td>
          </tr>
        </tbody>
      </table>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250812164144308.png" alt="CORS配置" style={{ zoom: '33%' }} />

      <h3>4.2 项目结构</h3>
      <pre><code>{`后端项目
├── src/
│   ├── main.py             # 主程序入口（路由定义）
│   ├── database.py         # 数据库配置（连接、会话创建）
│   ├── models.py           # 数据库模型
│   │   └── User            # 用户表模型（id、username、密码哈希等）
│   ├── schemas.py          # Pydantic模型（请求/响应数据格式）
│   │   ├── UserCreate      # 注册请求模型
│   │   ├── UserResponse    # 用户信息响应模型
│   │   └── Token           # 登录令牌响应模型
│   ├── crud.py             # 数据库操作函数
│   │   ├── create_user     # 创建用户
│   │   ├── get_user_by_username  # 通过用户名查询用户
│   │   ├── update_user_password  # 更新用户密码
│   │   └── delete_user     # 删除用户
│   ├── auth.py             # 认证相关功能
│   │   ├── get_password_hash     # 密码哈希处理
│   │   ├── verify_password       # 密码验证
│   │   ├── create_access_token   # 生成JWT令牌
│   │   └── get_current_user      # 获取当前登录用户（依赖注入）
│   └── dependencies.py     # 依赖项（如数据库会话依赖）
└── sql_app.db              # SQLite数据库文件`}</code></pre>

      <h2>5 前后端联调</h2>

      <h3>5.1 注册用户(/register)</h3>

      <h4>5.1.1 接口说明</h4>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>信息</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>请求方式</strong></td>
            <td><code>POST</code></td>
          </tr>
          <tr>
            <td><strong>URL</strong></td>
            <td><code>http://127.0.0.1:8000/register</code></td>
          </tr>
          <tr>
            <td><strong>参数</strong></td>
            <td>
              - <code>username</code>：用户名（字符串，必填，唯一）<br/>
              - <code>password</code>：密码（字符串，必填）
            </td>
          </tr>
          <tr>
            <td><strong>请求体示例</strong></td>
            <td>
              <code>json</code> 格式包含两个字段：<br/>
              - username: 'dbb'<br/>
              - password: 'dbb'
            </td>
          </tr>
          <tr>
            <td><strong>响应示例</strong></td>
            <td>
              <code>json</code> 格式包含三个字段：<br/>
              - id: 1<br/>
              - username: 'dbb'<br/>
              - created_at: '2025-8-12T03:15:27'
            </td>
          </tr>
          <tr>
            <td><strong>异常</strong></td>
            <td>- 400：用户名已存在 - 422：参数缺失（如未填用户名或密码）</td>
          </tr>
        </tbody>
      </table>

      <h4>5.1.2 实例</h4>
      <ul>
        <li>下图为注册成功</li>
      </ul>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250812152757693.png" alt="注册成功示例" style={{ zoom: '33%' }} />
      <ul>
        <li>下图注册失败（已注册）</li>
      </ul>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250812152811732.png" alt="注册失败示例" style={{ zoom: '33%' }} />

      <h3>5.2 登录获取令牌（/login）</h3>

      <h4>5.2.1 接口说明</h4>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>信息</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>请求方式</strong></td>
            <td><code>POST</code></td>
          </tr>
          <tr>
            <td><strong>URL</strong></td>
            <td><code>http://127.0.0.1:8000/login</code></td>
          </tr>
          <tr>
            <td><strong>参数</strong></td>
            <td>
              - <code>username</code>：用户名（字符串，必填）<br/>
              - <code>password</code>：密码（字符串，必填）
            </td>
          </tr>
          <tr>
            <td><strong>请求体示例</strong></td>
            <td>
              <code>json</code> 格式包含两个字段：<br/>
              - username: 'dbb'<br/>
              - password: 'dbb'
            </td>
          </tr>
          <tr>
            <td><strong>响应示例</strong></td>
            <td>
              <code>json</code> 格式包含两个字段：<br/>
              - access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'<br/>
              - token_type: 'bearer'
            </td>
          </tr>
          <tr>
            <td><strong>异常</strong></td>
            <td>- 401：用户名或密码错误 - 422：参数缺失</td>
          </tr>
        </tbody>
      </table>

      <h4>5.2.2 实例</h4>
      <ul>
        <li>下图为登录成功</li>
      </ul>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250812153223880.png" alt="登录成功示例" style={{ zoom: '33%' }} />
      <ul>
        <li>下图为登录失败（账户名或密码错误）</li>
      </ul>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250812153337129.png" alt="登录失败示例" style={{ zoom: '33%' }} />

      <h3>5.3 查询当前用户（/users/me）</h3>

      <h4>5.3.1 接口说明</h4>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>信息</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>请求方式</strong></td>
            <td><code>GET</code></td>
          </tr>
          <tr>
            <td><strong>URL</strong></td>
            <td><code>http://127.0.0.1:8000/users/me</code></td>
          </tr>
          <tr>
            <td><strong>请求头</strong></td>
            <td><code>Authorization: Bearer &lt;access_token&gt;</code>（登录后获取的令牌）</td>
          </tr>
          <tr>
            <td><strong>响应示例</strong></td>
            <td>
              <code>json</code> 格式包含三个字段：<br/>
              - id: 9<br/>
              - username: 'dbb'<br/>
              - created_at: '2025-08-12T07:32:04'
            </td>
          </tr>
          <tr>
            <td><strong>异常</strong></td>
            <td>- 401：令牌无效或已过期 - 404：用户不存在</td>
          </tr>
        </tbody>
      </table>

      <h3>5.4 修改密码（/users/me/password）</h3>

      <h4>5.4.1 接口说明</h4>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>信息</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>请求方式</strong></td>
            <td><code>POST</code></td>
          </tr>
          <tr>
            <td><strong>URL</strong></td>
            <td><code>http://127.0.0.1:8000/forgot-password</code></td>
          </tr>
          <tr>
            <td><strong>参数</strong></td>
            <td>
              - <code>username</code>：用户名（字符串，必填）<br/>
              - <code>oldPassword</code>：原密码（字符串，必填）<br/>
              - <code>newPassword</code>：新密码（字符串，必填）
            </td>
          </tr>
          <tr>
            <td><strong>请求体示例</strong></td>
            <td>
              <code>json</code> 格式包含三个字段：<br/>
              - username: 'testuser'<br/>
              - oldPassword: 'testpass123'<br/>
              - newPassword: 'newpass456'
            </td>
          </tr>
          <tr>
            <td><strong>响应示例</strong></td>
            <td><code>json</code> 格式包含一个字段：detail: '密码修改成功'</td>
          </tr>
          <tr>
            <td><strong>异常</strong></td>
            <td>- 400：用户不存在 / 原密码错误 / 原密码与新密码相同 - 422：参数缺失</td>
          </tr>
        </tbody>
      </table>

      <h3>5.5 删除用户（/users/me）</h3>

      <h4>5.5.1 接口说明</h4>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>信息</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>请求方式</strong></td>
            <td><code>DELETE</code></td>
          </tr>
          <tr>
            <td><strong>URL</strong></td>
            <td><code>http://127.0.0.1:8000/users/me</code></td>
          </tr>
          <tr>
            <td><strong>请求头</strong></td>
            <td><code>Authorization: Bearer xxx.xxx.xxx</code></td>
          </tr>
          <tr>
            <td><strong>响应示例</strong></td>
            <td><code>json</code> 格式包含一个字段：detail: '用户删除成功'</td>
          </tr>
          <tr>
            <td><strong>异常</strong></td>
            <td>- 401：令牌无效 - 400：删除失败（如数据库错误）</td>
          </tr>
        </tbody>
      </table>

      <h2>6 前端页面关键代码示例</h2>

      <h3>6.1 登录页面(Login.js)关键代码</h3>
      <pre><code>{`import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // 存储表单输入值 - 正确使用对象存储但分别访问属性
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 处理输入变化 - 更新对象的特定属性
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 验证输入 - 检查每个属性而非整个对象
    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8000/login', formData);
      // 存储令牌并跳转
      localStorage.setItem('token', response.data.access_token);
      navigate('/tasks');
    } catch (err) {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="login-container">
      <h2>登录</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>用户名</label>
          <input
            type="text"
            name="username"
            value={formData.username}  // 访问具体属性
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>密码</label>
          <input
            type="password"
            name="password"
            value={formData.password}  // 访问具体属性
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">登录</button>
      </form>
    </div>
  );
};

export default Login;`}</code></pre>

      <h3>6.2 注册页面(Register.js)关键代码</h3>
      <pre><code>{`import React, { useState } from 'react';
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
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('用户名已被注册');
      } else {
        setError('注册失败，请稍后再试');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>注册</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>用户名</label>
          <input
            type="text"
            name="username"
            value={formData.username}  // 访问具体属性
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>密码</label>
          <input
            type="password"
            name="password"
            value={formData.password}  // 访问具体属性
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">注册</button>
      </form>
    </div>
  );
};

export default Register;`}</code></pre>

      <h2>7 最终效果展示</h2>

      <h3>7.1 登录页面</h3>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250812143037942.png" alt="登录页面" style={{ zoom: '50%' }} />

      <h3>7.2 注册页面</h3>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250812144959247.png" alt="注册页面" style={{ zoom: '50%' }} />

      <h3>7.3 忘记密码页面</h3>
      <img src="/Fig/SQLAlchemy+FastAPI+React/image-20250812150252126.png" alt="忘记密码页面" style={{ zoom: '50%' }} />
    </DocLayout>
  );
};

export default SQLAlchemyFastAPIReact;
