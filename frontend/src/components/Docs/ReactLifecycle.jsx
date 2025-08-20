import React, { useEffect } from 'react';
import DocLayout from '../DocLayout'; // 确保路径正确

const ReactLifecycle = () => {
  // 组件挂载时自动滚动到页面顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动效果
    });
  }, []); // 空依赖数组确保只在组件挂载时执行一次

  // 使用字符串模板定义代码示例，避免 Babel 误解析
  const constructorCode = `constructor(props) {
  super(props); // 必须调用，否则无法访问 this.props
  // 直接赋值初始化 state（不可用 setState()）
  this.state = {
    count: 0,
    userInfo: null
  };
  // 绑定事件处理函数的 this 指向
  this.handleCountIncrement = this.handleCountIncrement.bind(this);
}`;

  const getDerivedStateFromPropsCode = `static getDerivedStateFromProps(props, state) {
  // 当传入的初始值变化时，同步更新组件内部 state
  if (props.initialCount !== state.lastInitialCount) {
    return {
      count: props.initialCount,
      lastInitialCount: props.initialCount
    };
  }
  return null; // 返回 null 表示不更新 state
}`;

  const renderCode = `render() {
  const { count } = this.state;
  return (
    <div className="count-wrapper">
      <p className="count-text">当前计数：{count}</p>
      <button 
        className="count-btn" 
        onClick={this.handleCountIncrement}
      >
        点击增加
      </button>
    </div>
  );
}`;

  const componentDidMountCode = `componentDidMount() {
  // 1. 发起网络请求（获取用户信息）
  fetch('https://api.example.com/user')
    .then(response => response.json())
    .then(data => this.setState({ userInfo: data }))
    .catch(error => console.error('用户信息请求失败：', error));

  // 2. 绑定全局事件监听
  window.addEventListener('resize', this.handleWindowResize);

  // 3. 初始化第三方库（如图表、地图）
  this.initEcharts();
}`;

  const shouldComponentUpdateCode = `shouldComponentUpdate(nextProps, nextState) {
  // 仅当 count 或 userInfo 变化时，才允许重新渲染
  return (
    nextState.count !== this.state.count ||
    nextState.userInfo !== this.state.userInfo
  );
}`;

  const getSnapshotBeforeUpdateCode = `getSnapshotBeforeUpdate(prevProps, prevState) {
  // 消息列表新增内容时，保存当前滚动高度
  if (prevState.messages.length < this.state.messages.length) {
    const messageList = this.refs.messageList;
    return messageList.scrollHeight - messageList.scrollTop;
  }
  return null;
}`;

  const componentDidUpdateCode = `componentDidUpdate(prevProps, prevState, snapshot) {
  // 1. 当 props.userId 变化时，重新请求用户数据
  if (prevProps.userId !== this.props.userId) {
    this.fetchUserInfo(this.props.userId);
  }

  // 2. 使用 snapshot 恢复滚动位置
  if (snapshot !== null) {
    const messageList = this.refs.messageList;
    messageList.scrollTop = messageList.scrollHeight - snapshot;
  }
}`;

  const componentWillUnmountCode = `componentWillUnmount() {
  // 1. 清除定时器/计时器
  clearInterval(this.timer);
  clearTimeout(this.timeout);

  // 2. 移除全局事件监听
  window.removeEventListener('resize', this.handleWindowResize);

  // 3. 取消未完成的网络请求
  if (this.abortController) {
    this.abortController.abort();
  }

  // 4. 销毁第三方库实例
  if (this.echartsInstance) {
    this.echartsInstance.dispose();
  }
}`;

  const functionComponentCode = `import { useState, useEffect } from 'react';

const CountComponent = () => {
  const [count, setCount] = useState(0);

  // 模拟 componentDidMount + componentDidUpdate
  useEffect(() => {
    document.title = \`当前计数：\${count}\`;
  }, [count]);

  // 模拟 componentDidMount + componentWillUnmount
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);

    // 清理函数（模拟 componentWillUnmount）
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="count-container">
      <p>自动计数：{count}</p>
      <button 
        onClick={() => setCount(prev => prev + 1)}
        className="count-btn"
      >
        手动增加
      </button>
    </div>
  );
};

export default CountComponent;`;

  return (
    <DocLayout title="React 组件生命周期详解">
      {/* 固定定位的返回按钮 - 始终显示在视野内 */}
      {/*<div className="fixed top-20 left-4 z-50 md:top-24 md:left-8">*/}
      {/*  <a*/}
      {/*    href="/#study-docs"*/}
      {/*    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all"*/}
      {/*  >*/}
      {/*    <i className="fa fa-arrow-left"></i>*/}
      {/*    <span>返回文档列表</span>*/}
      {/*  </a>*/}
      {/*</div>*/}

      <p>React 组件的生命周期是指组件从创建、渲染到销毁的完整过程，理解生命周期可帮助开发者精准控制组件行为、优化性能并避免资源泄漏。本文将系统讲解类组件生命周期的核心方法及函数组件中的替代方案。</p>

      <h2>一、生命周期三大核心阶段</h2>
      <p>React 类组件的生命周期分为三个不可逆阶段，每个阶段对应专属钩子函数，执行顺序固定：</p>
      <ol>
        <li><strong>挂载阶段（Mounting）</strong>：组件从初始化到首次插入 DOM 的过程</li>
        <li><strong>更新阶段（Updating）</strong>：props 或 state 变化触发组件重新渲染的过程</li>
        <li><strong>卸载阶段（Unmounting）</strong>：组件从 DOM 中移除并清理资源的过程</li>
      </ol>

      <h2>二、挂载阶段生命周期方法</h2>
      <p>挂载阶段仅执行一次，依次触发以下方法：</p>

      <h3>1. constructor(props)</h3>
      <p>组件实例化时最先调用，用于初始化状态和绑定事件上下文：</p>
      <pre><code>{constructorCode}</code></pre>

      <h3>2. static getDerivedStateFromProps(props, state)</h3>
      <p>静态方法（无 this 访问权限），用于根据 props 同步更新 state：</p>
      <pre><code>{getDerivedStateFromPropsCode}</code></pre>

      <h3>3. render()</h3>
      <p>类组件唯一必须实现的方法，返回 React 元素：</p>
      <pre><code>{renderCode}</code></pre>
      <p className="text-gray-600 text-sm italic">注意：render 中不可修改 state、发起网络请求或操作 DOM，仅负责“描述 UI 结构”。</p>

      <h3>4. componentDidMount()</h3>
      <p>组件挂载完成（DOM 已生成）后调用，适合执行副作用操作：</p>
      <pre><code>{componentDidMountCode}</code></pre>

      <h2>三、更新阶段生命周期方法</h2>
      <p>props 或 state 变化时触发，可多次执行：</p>

      <h3>1. static getDerivedStateFromProps(props, state)</h3>
      <p>与挂载阶段功能一致，优先根据新 props 同步更新 state。</p>

      <h3>2. shouldComponentUpdate(nextProps, nextState)</h3>
      <p>控制组件是否需要重新渲染，返回布尔值（性能优化关键）：</p>
      <pre><code>{shouldComponentUpdateCode}</code></pre>

      <h3>3. render()</h3>
      <p>根据新的 props/state 重新渲染 UI。</p>

      <h3>4. getSnapshotBeforeUpdate(prevProps, prevState)</h3>
      <p>DOM 更新前调用，用于捕获 DOM 状态（如滚动位置）：</p>
      <pre><code>{getSnapshotBeforeUpdateCode}</code></pre>

      <h3>5. componentDidUpdate(prevProps, prevState, snapshot)</h3>
      <p>DOM 更新完成后调用，可根据前后状态差异执行操作：</p>
      <pre><code>{componentDidUpdateCode}</code></pre>

      <h2>四、卸载阶段生命周期方法</h2>
      <p>组件被销毁并从 DOM 移除时执行，用于清理资源：</p>

      <h3>componentWillUnmount()</h3>
      <pre><code>{componentWillUnmountCode}</code></pre>

      <h2>五、函数组件中的生命周期（Hooks 方案）</h2>
      <p>函数组件无内置生命周期，但可通过 useEffect Hook 模拟所有阶段：</p>
      <pre><code>{functionComponentCode}</code></pre>

      <h2>六、核心总结</h2>
      <ul>
        <li><strong>类组件</strong>：适合维护旧项目，生命周期方法清晰但代码繁琐；</li>
        <li><strong>函数组件 + Hooks</strong>：推荐用于新项目，useEffect 可灵活模拟所有生命周期；</li>
        <li><strong>性能优化</strong>：类组件用 shouldComponentUpdate/PureComponent，函数组件用 useMemo/useCallback；</li>
        <li><strong>资源清理</strong>：类组件在 componentWillUnmount 清理，函数组件在 useEffect 清理函数中处理。</li>
      </ul>
    </DocLayout>
  );
};

export default ReactLifecycle;
