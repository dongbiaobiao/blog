import React, { useEffect } from 'react';
import DocLayout from '../DocLayout';

const CssFlexbox = () => {
  // 组件挂载时自动滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // 代码示例模板 - 使用模板字符串并正确转义
  const basicFlexExample = `.container {
  display: flex; /* 将容器设置为Flex容器 */
  width: 100%;
  height: 300px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
}

.item {
  flex: 1; /* 每个项目平均分配空间 */
  background-color: #4285f4;
  color: white;
  padding: 20px;
  margin: 0 10px;
  border-radius: 4px;
  text-align: center;
}`;

  const flexDirectionExample = `.row {
  display: flex;
  flex-direction: row; /* 默认值，水平方向，从左到右 */
}

.row-reverse {
  display: flex;
  flex-direction: row-reverse; /* 水平方向，从右到左 */
}

.column {
  display: flex;
  flex-direction: column; /* 垂直方向，从上到下 */
}

.column-reverse {
  display: flex;
  flex-direction: column-reverse; /* 垂直方向，从下到上 */
}`;

  const justifyContentExample = `.flex-start {
  display: flex;
  justify-content: flex-start; /* 默认值，左对齐 */
}

.center {
  display: flex;
  justify-content: center; /* 居中对齐 */
}

.flex-end {
  display: flex;
  justify-content: flex-end; /* 右对齐 */
}

.space-between {
  display: flex;
  justify-content: space-between; /* 两端对齐，项目之间间隔相等 */
}

.space-around {
  display: flex;
  justify-content: space-around; /* 每个项目两侧的间隔相等 */
}

.space-evenly {
  display: flex;
  justify-content: space-evenly; /* 项目之间和边缘的间隔相等 */
}`;

  const alignItemsExample = `.flex-start {
  display: flex;
  align-items: flex-start; /* 交叉轴的起点对齐 */
}

.center {
  display: flex;
  align-items: center; /* 交叉轴的中点对齐 */
}

.flex-end {
  display: flex;
  align-items: flex-end; /* 交叉轴的终点对齐 */
}

.stretch {
  display: flex;
  align-items: stretch; /* 默认值，项目被拉伸填满容器 */
}

.baseline {
  display: flex;
  align-items: baseline; /* 项目的第一行文字的基线对齐 */
}`;

  const flexItemProperties = `.item-1 {
  flex-grow: 1; /* 定义项目的放大比例，默认0 */
}

.item-2 {
  flex-grow: 2; /* 会占据比item-1多一倍的剩余空间 */
}

.item-shrink {
  flex-shrink: 0; /* 定义项目的缩小比例，默认1，0表示不缩小 */
}

.item-basis {
  flex-basis: 200px; /* 定义项目在分配多余空间前的默认大小 */
}

/* 复合属性: flex-grow, flex-shrink 和 flex-basis的简写 */
.item {
  flex: 0 1 auto; /* 默认值 */
  flex: 1; /* 相当于 flex: 1 1 0% */
  flex: auto; /* 相当于 flex: 1 1 auto */
  flex: none; /* 相当于 flex: 0 0 auto */
}

.order-1 {
  order: -1; /* 定义项目的排列顺序，数值越小越靠前，默认0 */
}

.align-self {
  align-self: center; /* 允许单个项目有与其他项目不同的对齐方式 */
}`;

  const practicalExamples = `/* 1. 导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

/* 2. 卡片网格 */
.card-container {
  display: flex;
  flex-wrap: wrap; /* 允许项目换行 */
  gap: 1rem;
  padding: 1rem;
}

.card {
  flex: 1 1 300px; /* 最小宽度300px，自动扩展 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
  border-radius: 4px;
}

/* 3. 居中对齐 */
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background-color: #f5f5f5;
}

.centered-content {
  text-align: center;
}

/* 4. 响应式布局 */
@media (max-width: 768px) {
  .responsive-container {
    flex-direction: column;
  }
}`;

  return (
    <DocLayout title="CSS Flexbox 布局全解析">
      <p>CSS Flexbox（弹性盒子）是一种强大的布局模型，旨在提供一种更高效的方式来布局、对齐和分配容器中项目的空间，即使它们的大小未知或动态变化。本文全面解析Flexbox布局的核心概念、属性和实际应用，帮助你快速掌握这一现代CSS布局技术。</p>

      <h2>一、Flexbox基本概念</h2>
      <p>Flexbox布局由容器（container）和项目（items）组成：</p>
      <ul>
        <li><strong>Flex容器</strong>：设置了<code>display: flex</code>或<code>display: inline-flex</code>的元素</li>
        <li><strong>Flex项目</strong>：容器的直接子元素，自动成为Flex项目</li>
        <li><strong>主轴（Main Axis）</strong>：项目排列的主要轴线，默认水平方向</li>
        <li><strong>交叉轴（Cross Axis）</strong>：与主轴垂直的轴线，默认垂直方向</li>
        <li><strong>主轴起点/终点</strong>：项目开始和结束的位置</li>
        <li><strong>交叉轴起点/终点</strong>：与主轴垂直方向的开始和结束位置</li>
      </ul>

      <h2>二、Flex容器属性</h2>
      <p>通过在容器上设置以下属性来控制项目的布局方式：</p>

      <h3>1. display: 定义Flex容器</h3>
      <pre><code>{`.container {
  display: flex; /* 块级Flex容器 */
  /* 或 */
  display: inline-flex; /* 行内级Flex容器 */
}`}</code></pre>
      <p>设置后，容器的子元素自动成为Flex项目，浮动、clear和vertical-align等属性将失效。</p>

      <h3>2. flex-direction: 定义主轴方向</h3>
      <pre><code>{flexDirectionExample}</code></pre>

      <h3>3. flex-wrap: 控制项目是否换行</h3>
      <pre><code>{`.nowrap {
  display: flex;
  flex-wrap: nowrap; /* 默认值，不换行 */
}

.wrap {
  display: flex;
  flex-wrap: wrap; /* 换行，第一行在上方 */
}

.wrap-reverse {
  display: flex;
  flex-wrap: wrap-reverse; /* 换行，第一行在下方 */
}`}</code></pre>

      <h3>4. flex-flow: flex-direction和flex-wrap的简写</h3>
      <pre><code>{`.container {
  flex-flow: row wrap; /* 相当于 flex-direction: row; flex-wrap: wrap; */
  flex-flow: column nowrap; /* 相当于 flex-direction: column; flex-wrap: nowrap; */
}`}</code></pre>

      <h3>5. justify-content: 主轴上的对齐方式</h3>
      <pre><code>{justifyContentExample}</code></pre>

      <h3>6. align-items: 交叉轴上的对齐方式</h3>
      <pre><code>{alignItemsExample}</code></pre>

      <h3>7. align-content: 多根轴线的对齐方式（仅当项目换行时有效）</h3>
      <pre><code>{`.stretch {
  display: flex;
  flex-wrap: wrap;
  align-content: stretch; /* 默认值，轴线占满整个交叉轴 */
}

.center {
  display: flex;
  flex-wrap: wrap;
  align-content: center; /* 轴线在交叉轴居中对齐 */
}

.flex-start {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start; /* 轴线在交叉轴起点对齐 */
}

.flex-end {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end; /* 轴线在交叉轴终点对齐 */
}

.space-between {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between; /* 轴线两端对齐，轴线间间隔平均 */
}

.space-around {
  display: flex;
  flex-wrap: wrap;
  align-content: space-around; /* 每个轴线两侧的间隔相等 */
}`}</code></pre>

      <h2>三、Flex项目属性</h2>
      <p>通过在项目上设置以下属性来控制单个项目的行为：</p>
      <pre><code>{flexItemProperties}</code></pre>

      <h2>四、基本Flex布局示例</h2>
      <p>一个简单的Flex布局示例，展示容器和项目的基本关系：</p>
      <pre><code>{basicFlexExample}</code></pre>
      <p>对应的HTML结构：</p>
      <pre><code>{`&lt;div class="container"&gt;
  &lt;div class="item"&gt;项目 1&lt;/div&gt;
  &lt;div class="item"&gt;项目 2&lt;/div&gt;
  &lt;div class="item"&gt;项目 3&lt;/div&gt;
&lt;/div&gt;`}</code></pre>

      <h2>五、Flexbox实战案例</h2>
      <p>以下是一些常见布局场景的Flexbox实现：</p>
      <pre><code>{practicalExamples}</code></pre>

      <h3>1. 导航栏布局解析</h3>
      <p>使用<code>justify-content: space-between</code>实现Logo和导航链接的左右分布，<code>align-items: center</code>确保垂直居中对齐，这是现代网站导航的常见实现方式。</p>

      <h3>2. 响应式卡片网格</h3>
      <p>通过<code>flex-wrap: wrap</code>和<code>flex: 1 1 300px</code>实现自适应的卡片布局，在不同屏幕尺寸下自动调整每行显示的卡片数量，300px是卡片的最小宽度。</p>

      <h3>3. 完美居中</h3>
      <p>Flexbox使元素居中变得异常简单，只需在容器上同时设置<code>justify-content: center</code>和<code>align-items: center</code>，即可实现子元素在水平和垂直方向上的完美居中。</p>

      <h2>六、Flexbox常见问题与解决方案</h2>

      <h3>1. 浏览器兼容性</h3>
      <p>Flexbox在现代浏览器中支持良好，但在旧版本浏览器（如IE10及以下）中存在兼容性问题。可使用Autoprefixer自动添加浏览器前缀，或通过caniuse.com查询具体支持情况。</p>
      <pre><code>{`/* Autoprefixer会自动添加必要的前缀 */
.container {
  display: flex;
  justify-content: center;
}`}</code></pre>

      <h3>2. 项目高度不一致问题</h3>
      <p>Flex项目默认会被拉伸以填满容器的高度（<code>align-items: stretch</code>）。如需保持项目自身高度，可设置<code>align-items: flex-start</code>或在项目上设置<code>align-self: flex-start</code>。</p>

      <h3>3. 控制项目的精确尺寸</h3>
      <p>使用<code>flex-basis</code>设置项目的初始大小，结合<code>flex-grow</code>和<code>flex-shrink</code>控制项目在空间充足或不足时的行为。</p>

      <h2>七、Flexbox与其他布局方式的比较</h2>
      <ul>
        <li><strong>与浮动布局相比</strong>：Flexbox更简洁，无需清除浮动，更适合复杂布局</li>
        <li><strong>与网格布局相比</strong>：Flexbox是一维布局（要么行要么列），Grid是二维布局；Flexbox更适合组件内部布局，Grid更适合整体页面布局</li>
        <li><strong>与表格布局相比</strong>：Flexbox更灵活，内容可以动态调整，而表格布局更适合展示表格数据</li>
      </ul>

      <h2>八、总结</h2>
      <p>Flexbox布局模型彻底改变了CSS布局的方式，它提供了一种直观、灵活的方式来处理各种布局场景，从简单的居中对齐到复杂的响应式布局。</p>
      <p>掌握Flexbox的关键在于理解主轴和交叉轴的概念，以及容器和项目各自的属性。通过实际练习不同的布局场景，你将能够熟练运用Flexbox解决各种布局挑战，编写出更简洁、更易于维护的CSS代码。</p>
    </DocLayout>
  );
};

export default CssFlexbox;
