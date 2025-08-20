import React, { useEffect } from 'react';
import DocLayout from '../DocLayout';

const NodejsMiddleware = () => {
  // 组件挂载时自动滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // 基本中间件示例
  const basicMiddlewareExample = `// 简单的日志中间件
const logger = (req, res, next) => {
  console.log(\`\${new Date().toISOString()} - \${req.method} \${req.url}\`);
  next(); // 调用下一个中间件
};

// 在Express应用中使用
const express = require('express');
const app = express();

// 应用中间件
app.use(logger);

// 路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`;

  // 中间件链示例
  const middlewareChainExample = `// 验证中间件
const validateUser = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send('用户名和密码不能为空');
  }
  
  next(); // 验证通过，调用下一个中间件
};

// 授权中间件
const authorize = (req, res, next) => {
  // 假设这里有验证用户权限的逻辑
  const isAuthorized = true;
  
  if (!isAuthorized) {
    return res.status(403).send('没有访问权限');
  }
  
  next(); // 授权通过，调用下一个中间件
};

// 路由处理函数
const handleLogin = (req, res) => {
  res.send('登录成功');
};

// 应用中间件链
app.post('/login', validateUser, authorize, handleLogin);`;

  // 错误处理中间件
  const errorHandlingExample = `// 错误处理中间件（注意有四个参数）
const errorHandler = (err, req, res, next) => {
  console.error('发生错误:', err.stack);
  
  // 根据错误类型返回不同响应
  if (err.type === 'validation') {
    return res.status(400).json({
      error: '验证错误',
      message: err.message
    });
  }
  
  // 未知错误返回500
  res.status(500).json({
    error: '服务器错误',
    message: '服务器发生未知错误'
  });
};

// 在所有路由之后应用错误处理中间件
app.use(errorHandler);

// 使用错误处理中间件的路由示例
app.get('/data', (req, res, next) => {
  try {
    // 模拟可能出错的操作
    if (Math.random() > 0.5) {
      throw new Error('随机错误发生');
    }
    res.send('成功获取数据');
  } catch (err) {
    next(err); // 将错误传递给错误处理中间件
  }
});`;

  // 常用中间件示例
  const commonMiddlewareExamples = `// 内置中间件
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体
app.use(express.static('public')); // 提供静态文件

// 第三方中间件
const morgan = require('morgan');
app.use(morgan('combined')); // HTTP请求日志

const cors = require('cors');
app.use(cors()); // 处理跨域请求

const helmet = require('helmet');
app.use(helmet()); // 增强HTTP头安全性

const compression = require('compression');
app.use(compression()); // 压缩响应数据`;

  // 中间件封装示例
  const middlewareWrapperExample = `// 带配置的日志中间件
const createLogger = (options = {}) => {
  const { level = 'info' } = options;
  
  // 返回实际的中间件函数
  return (req, res, next) => {
    const logMessage = \`\${new Date().toISOString()} - \${req.method} \${req.url}\`;
    
    if (level === 'info') {
      console.log(logMessage);
    } else if (level === 'debug') {
      console.debug(logMessage, { query: req.query, body: req.body });
    }
    
    next();
  };
};

// 使用带配置的中间件
app.use(createLogger({ level: 'debug' }));`;

  return (
    <DocLayout title="Node.js中间件完全指南">
      <p>中间件是Node.js Web开发中的核心概念，尤其是在Express、Koa等框架中被广泛使用。它允许开发者在请求-响应周期中插入自定义逻辑，实现诸如日志记录、身份验证、错误处理等功能。本文将全面介绍Node.js中间件的工作原理、类型、实现方式及最佳实践。</p>

      <h2>一、中间件基本概念</h2>
      <p>中间件是一个函数，它可以访问请求对象（req）、响应对象（res）以及应用程序请求-响应周期中的下一个中间件函数（通常命名为next）。</p>

      <h3>中间件的基本结构</h3>
      <pre><code>{`(req, res, next) => {
  // 中间件逻辑
  next(); // 调用下一个中间件
}`}</code></pre>
      <p>如果中间件是错误处理中间件，则需要四个参数：</p>
      <pre><code>{`(err, req, res, next) => {
  // 错误处理逻辑
  next(err); // 传递错误给下一个错误处理中间件
}`}</code></pre>

      <h3>中间件的作用</h3>
      <ul>
        <li>执行任何代码</li>
        <li>修改请求和响应对象</li>
        <li>终止请求-响应周期</li>
        <li>调用栈中的下一个中间件</li>
      </ul>
      <p className="text-red-600">注意：如果当前中间件没有终止请求-响应周期，必须调用<code>next()</code>以将控制权传递给下一个中间件，否则请求将被挂起。</p>

      <h2>二、中间件的工作流程</h2>
      <p>中间件按照定义的顺序依次执行，形成一个处理管道：</p>
      <ol>
        <li>客户端发送请求到服务器</li>
        <li>请求进入第一个中间件</li>
        <li>中间件处理请求，可能修改req或res对象</li>
        <li>调用<code>next()</code>将控制权传递给下一个中间件</li>
        <li>重复步骤3-4，直到到达路由处理函数</li>
        <li>路由处理函数生成响应并发送给客户端</li>
        <li>如果过程中发生错误，错误处理中间件将捕获并处理错误</li>
      </ol>

      <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-bold mb-2">中间件执行顺序示意图</h4>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <div className="w-32 bg-blue-100 p-2 text-center rounded">客户端请求</div>
            <div className="w-8 text-center">→</div>
            <div className="w-32 bg-green-100 p-2 text-center rounded">中间件1</div>
            <div className="w-8 text-center">→</div>
            <div className="w-32 bg-green-100 p-2 text-center rounded">中间件2</div>
            <div className="w-8 text-center">→</div>
            <div className="w-32 bg-yellow-100 p-2 text-center rounded">路由处理</div>
            <div className="w-8 text-center">→</div>
            <div className="w-32 bg-blue-100 p-2 text-center rounded">客户端响应</div>
          </div>
        </div>
      </div>

      <h2>三、中间件类型</h2>
      <p>在Express框架中，中间件主要分为以下几类：</p>

      <h3>1. 应用级中间件</h3>
      <p>绑定到app对象的中间件，使用<code>app.use()</code>和<code>app.METHOD()</code>：</p>
      <pre><code>{basicMiddlewareExample}</code></pre>

      <h3>2. 路由级中间件</h3>
      <p>与应用级中间件类似，但绑定到<code>express.Router()</code>实例：</p>
      <pre><code>{`const express = require('express');
const app = express();
const router = express.Router();

// 路由级中间件
router.use((req, res, next) => {
  console.log('路由中间件被调用');
  next();
});

// 路由
router.get('/', (req, res) => {
  res.send('路由首页');
});

// 将路由挂载到应用
app.use('/api', router);`}</code></pre>

      <h3>3. 错误处理中间件</h3>
      <p>专门用于处理错误的中间件，具有四个参数：</p>
      <pre><code>{errorHandlingExample}</code></pre>

      <h3>4. 内置中间件</h3>
      <p>Express内置的中间件，如处理JSON请求体、静态文件等：</p>
      <pre><code>{`// Express 4.x内置中间件
express.json() // 解析JSON请求体
express.urlencoded() // 解析URL编码的请求体
express.static() // 提供静态文件`}</code></pre>

      <h3>5. 第三方中间件</h3>
      <p>由社区开发的中间件，需通过npm安装：</p>
      <pre><code>{`// 安装第三方中间件
npm install morgan

// 使用第三方中间件
const morgan = require('morgan');
app.use(morgan('dev')); // 日志中间件`}</code></pre>

      <h2>四、中间件链与顺序</h2>
      <p>中间件按照定义的顺序执行，这一点非常重要：</p>
      <pre><code>{middlewareChainExample}</code></pre>

      <h3>中间件顺序的重要性</h3>
      <pre><code>{`// 正确的顺序
app.use(logger); // 日志中间件
app.use(express.json()); // 解析请求体
app.use('/api/users', userRoutes); // 路由

// 错误的顺序 - 路由无法使用请求体解析
app.use('/api/users', userRoutes); // 路由
app.use(express.json()); // 解析请求体 - 路由无法使用此中间件`}</code></pre>

      <h3>路径特定中间件</h3>
      <p>可以为中间件指定路径，使其只对该路径的请求生效：</p>
      <pre><code>{`// 只对/admin路径生效的中间件
app.use('/admin', authMiddleware);

// 只对GET请求的/user路径生效
app.get('/user', validateUserMiddleware, (req, res) => {
  // 处理逻辑
});`}</code></pre>

      <h2>五、常用中间件示例</h2>
      <p>以下是一些常用中间件的使用示例：</p>
      <pre><code>{commonMiddlewareExamples}</code></pre>

      <h3>自定义认证中间件</h3>
      <pre><code>{`// JWT认证中间件
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // 从请求头获取token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('未提供认证token');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 将用户信息添加到请求对象
    next();
  } catch (err) {
    return res.status(401).send('无效的token');
  }
};

// 使用认证中间件保护路由
app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user, message: '个人资料' });
});`}</code></pre>

      <h2>六、中间件最佳实践</h2>
      <ul>
        <li><strong>保持中间件简洁</strong>：每个中间件只做一件事</li>
        <li><strong>正确处理错误</strong>：使用错误处理中间件统一处理错误</li>
        <li><strong>注意中间件顺序</strong>：按照依赖关系排序</li>
        <li><strong>释放资源</strong>：如果中间件使用了资源（如数据库连接），确保在错误时释放</li>
        <li><strong>命名中间件</strong>：为中间件函数命名，便于调试</li>
        <li><strong>参数验证</strong>：对请求参数进行验证的中间件应放在前面</li>
        <li><strong>避免重复代码</strong>：将通用逻辑提取为中间件</li>
        <li><strong>记录日志</strong>：关键操作应在中间件中记录日志</li>
      </ul>

      <h2>七、中间件封装与复用</h2>
      <p>可以将中间件封装为可配置的模块，提高复用性：</p>
      <pre><code>{middlewareWrapperExample}</code></pre>

      <h3>中间件工厂函数</h3>
      <p>创建可以生成中间件的工厂函数，增加灵活性：</p>
      <pre><code>{`// 权限检查中间件工厂
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // 假设用户权限存储在req.user.permissions中
    if (!req.user || !req.user.permissions.includes(requiredPermission)) {
      return res.status(403).send('没有足够的权限');
    }
    next();
  };
};

// 使用权限中间件
app.post('/admin/users', 
  authenticate, 
  checkPermission('create:user'), 
  (req, res) => {
    // 创建用户的逻辑
  }
);

app.delete('/admin/users/:id', 
  authenticate, 
  checkPermission('delete:user'), 
  (req, res) => {
    // 删除用户的逻辑
  }
);`}</code></pre>

      <h2>八、Koa中间件与Express中间件的区别</h2>
      <p>Koa是另一个流行的Node.js框架，其使用洋葱模型的中间件机制：</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        <div>
          <h4 className="font-bold mb-2">Express中间件</h4>
          <pre><code>{`app.use((req, res, next) => {
  console.log('1. 中间件开始');
  next();
  console.log('4. 中间件结束');
});

app.use((req, res, next) => {
  console.log('2. 第二个中间件');
  next();
  console.log('3. 第二个中间件结束');
});`}</code></pre>
          <p>执行顺序：1 → 2 → 3 → 4</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Koa中间件（洋葱模型）</h4>
          <pre><code>{`app.use(async (ctx, next) => {
  console.log('1. 中间件开始');
  await next();
  console.log('4. 中间件结束');
});

app.use(async (ctx, next) => {
  console.log('2. 第二个中间件');
  await next();
  console.log('3. 第二个中间件结束');
});`}</code></pre>
          <p>执行顺序：1 → 2 → 3 → 4（与Express相同，但机制不同）</p>
        </div>
      </div>
      <p>Koa中间件使用async/await，能够更好地处理异步操作，在<code>await next()</code>前后分别处理进入和退出阶段的逻辑。</p>

      <h2>九、总结</h2>
      <p>中间件是Node.js Web开发中不可或缺的部分，它提供了一种灵活的方式来处理请求、添加功能和组织代码。掌握中间件的工作原理和使用技巧，能够帮助你构建更模块化、更易维护的Node.js应用。</p>
      <p>无论是简单的日志记录，还是复杂的身份验证，中间件都能提供优雅的解决方案。通过组合不同的中间件，可以快速构建功能完善的Web应用，同时保持代码的清晰和可维护性。</p>
    </DocLayout>
  );
};

export default NodejsMiddleware;
