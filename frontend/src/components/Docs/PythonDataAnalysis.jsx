import React, { useEffect } from 'react';
import DocLayout from '../DocLayout';

const PythonDataAnalysis = () => {
  // 组件挂载时自动滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // 环境配置示例
  const environmentSetup = `# 安装必要的数据分析库
pip install numpy pandas matplotlib seaborn scikit-learn jupyter

# 创建虚拟环境（推荐）
python -m venv data-env
# Windows激活虚拟环境
data-env\\Scripts\\activate
# macOS/Linux激活虚拟环境
source data-env/bin/activate

# 在虚拟环境中安装库
pip install numpy pandas matplotlib seaborn`;

  // NumPy基础示例
  const numpyExamples = `import numpy as np

# 创建数组
a = np.array([1, 2, 3, 4, 5])
b = np.array([[1, 2, 3], [4, 5, 6]])

# 数组属性
print("形状:", b.shape)    # 输出 (2, 3)
print("维度:", b.ndim)     # 输出 2
print("数据类型:", b.dtype) # 输出 int64
print("大小:", b.size)     # 输出 6

# 数组操作
c = a + 10                # 每个元素加10
d = a * 2                 # 每个元素乘2
e = np.mean(a)            # 计算平均值
f = np.sum(b, axis=0)     # 按列求和
g = np.reshape(b, (3, 2)) # 重塑数组形状`;

  // Pandas基础示例
  const pandasExamples = `import pandas as pd

# 创建Series
s = pd.Series([1, 3, 5, np.nan, 6, 8])

# 创建DataFrame
dates = pd.date_range('20230101', periods=6)
df = pd.DataFrame(np.random.randn(6, 4), index=dates, columns=list('ABCD'))

# 从文件读取数据
df_csv = pd.read_csv('data.csv')          # 读取CSV文件
df_excel = pd.read_excel('data.xlsx')     # 读取Excel文件
df_json = pd.read_json('data.json')       # 读取JSON文件

# 数据查看
print(df.head())     # 查看前5行
print(df.tail(3))    # 查看后3行
print(df.describe()) # 查看统计摘要
print(df.info())     # 查看数据信息

# 数据选择
df['A']              # 选择A列
df[0:3]              # 选择前3行
df.loc[dates[0]]     # 按标签选择
df.iloc[3]           # 按位置选择

# 数据清洗
df.dropna(how='any') # 删除包含缺失值的行
df.fillna(value=5)   # 填充缺失值
df.isnull()          # 检查缺失值`;

  // 数据可视化示例
  const visualizationExamples = `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# 设置中文字体
plt.rcParams["font.family"] = ["SimHei", "WenQuanYi Micro Hei", "Heiti TC"]
sns.set(font='SimHei', font_scale=1.2)

# 创建示例数据
data = pd.DataFrame({
    '类别': ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'],
    '数值': [1, 3, 2, 5, 4, 6, 8, 7, 9],
    '分组': ['X', 'X', 'X', 'Y', 'Y', 'Y', 'Z', 'Z', 'Z']
})

# 折线图
plt.figure(figsize=(10, 6))
x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.plot(x, y)
plt.title('正弦曲线')
plt.xlabel('X轴')
plt.ylabel('Y轴')
plt.grid(True)
plt.show()

# 柱状图
plt.figure(figsize=(10, 6))
sns.barplot(x='类别', y='数值', hue='分组', data=data)
plt.title('不同类别和分组的数值对比')
plt.xlabel('类别')
plt.ylabel('数值')
plt.show()

# 散点图
plt.figure(figsize=(10, 6))
sns.scatterplot(x='A', y='B', hue='C', size='D', data=df)
plt.title('散点图示例')
plt.show()

# 热图（相关性矩阵）
plt.figure(figsize=(10, 8))
correlation = df.corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm')
plt.title('相关性矩阵热图')
plt.show()`;

  // 数据分析流程示例
  const analysisWorkflow = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# 设置中文字体
plt.rcParams["font.family"] = ["SimHei", "WenQuanYi Micro Hei", "Heiti TC"]

# 1. 数据加载
df = pd.read_csv('customer_data.csv')

# 2. 数据探索
print("数据集形状:", df.shape)
print("\n前5行数据:")
print(df.head())
print("\n数据统计摘要:")
print(df.describe())
print("\n数据信息:")
print(df.info())

# 3. 数据清洗
# 检查缺失值
print("\n缺失值统计:")
print(df.isnull().sum())

# 处理缺失值
df = df.dropna(subset=['关键列1', '关键列2'])  # 删除关键列缺失的行
df['其他列'] = df['其他列'].fillna(df['其他列'].mean())  # 填充其他列缺失值

# 检查并处理异常值
plt.figure(figsize=(12, 6))
df[['数值列1', '数值列2']].boxplot()
plt.title('数值列箱线图（检测异常值）')
plt.savefig('boxplot.png')
plt.close()

# 4. 探索性数据分析
# 相关性分析
plt.figure(figsize=(10, 8))
correlation = df[['数值列1', '数值列2', '数值列3']].corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm')
plt.title('数值列相关性矩阵')
plt.savefig('correlation.png')
plt.close()

# 分组分析
group_analysis = df.groupby('类别列')['数值列1'].agg(['mean', 'median', 'count'])
print("\n分组分析结果:")
print(group_analysis)

# 5. 特征工程
# 标准化数值特征
scaler = StandardScaler()
df[['数值列1', '数值列2']] = scaler.fit_transform(df[['数值列1', '数值列2']])

# 创建新特征
df['新特征'] = df['数值列1'] / (df['数值列2'] + 1e-6)  # 避免除零错误

# 6. 建模分析（聚类示例）
kmeans = KMeans(n_clusters=3, random_state=42)
df['聚类标签'] = kmeans.fit_predict(df[['数值列1', '数值列2']])

# 可视化聚类结果
plt.figure(figsize=(10, 8))
sns.scatterplot(x='数值列1', y='数值列2', hue='聚类标签', data=df, palette='viridis')
plt.title('客户聚类结果')
plt.savefig('clustering.png')
plt.close()

# 7. 结果保存
df.to_csv('processed_customer_data.csv', index=False)
print("\n分析完成，处理后的数据已保存。")`;

  return (
    <DocLayout title="Python数据分析完全指南">
      <p>Python已成为数据分析领域的首选工具，凭借其丰富的库生态系统和简洁的语法，使数据处理、分析和可视化变得高效而直观。本文将全面介绍Python数据分析的核心库、基本流程和实战技巧，帮助你掌握从数据加载到结果可视化的完整数据分析工作流。</p>

      <h2>一、数据分析核心库</h2>
      <p>Python数据分析生态系统包含多个强大的库，它们相互配合，形成了完整的数据分析工具链：</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-3 text-blue-600">NumPy</h3>
          <p>提供高性能的多维数组对象和数学函数，是Python科学计算的基础。</p>
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            <li>高效的数值计算</li>
            <li>多维数组操作</li>
            <li>线性代数、傅里叶变换等数学运算</li>
          </ul>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-3 text-green-600">Pandas</h3>
          <p>提供DataFrame数据结构和数据分析工具，是数据分析的核心库。</p>
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            <li>灵活的数据结构（Series和DataFrame）</li>
            <li>数据清洗和预处理</li>
            <li>分组、合并和重塑数据</li>
            <li>时间序列分析</li>
          </ul>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-3 text-orange-600">Matplotlib</h3>
          <p>Python的基础绘图库，提供各种可视化图表。</p>
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            <li>线图、柱状图、散点图等基本图表</li>
            <li>高度可定制的图表元素</li>
            <li>支持多种输出格式</li>
          </ul>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-3 text-purple-600">Seaborn</h3>
          <p>基于Matplotlib的高级可视化库，提供更美观的统计图表。</p>
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            <li>内置多种主题和颜色方案</li>
            <li>简化的统计图表绘制</li>
            <li>支持复杂的多变量可视化</li>
          </ul>
        </div>
      </div>

      <h3>其他常用库</h3>
      <ul>
        <li><strong>Scikit-learn</strong>：机器学习库，提供各种分类、回归和聚类算法</li>
        <li><strong>Statsmodels</strong>：统计建模和计量经济学</li>
        <li><strong>Plotly</strong>：交互式可视化库</li>
        <li><strong>XGBoost/LightGBM</strong>：高性能梯度提升算法库</li>
        <li><strong>Jupyter Notebook</strong>：交互式计算环境，便于数据分析和展示</li>
      </ul>

      <h2>二、环境搭建</h2>
      <p>开始Python数据分析前，需要搭建合适的开发环境：</p>
      <pre><code>{environmentSetup}</code></pre>

      <h3>推荐开发环境</h3>
      <ul>
        <li><strong>Jupyter Notebook</strong>：适合探索性数据分析和结果展示</li>
        <li><strong>JupyterLab</strong>：Jupyter的增强版，提供更丰富的功能</li>
        <li><strong>PyCharm</strong>：功能强大的Python IDE，适合大型项目</li>
        <li><strong>VS Code + Python插件</strong>：轻量级编辑器，支持Jupyter笔记本</li>
      </ul>

      <h2>三、NumPy基础</h2>
      <p>NumPy提供了高性能的多维数组对象，是Python数据分析的基础：</p>
      <pre><code>{numpyExamples}</code></pre>

      <h3>NumPy的优势</h3>
      <ul>
        <li>比Python列表更快的数值运算（基于C扩展）</li>
        <li>简洁的语法，支持向量化操作，避免循环</li>
        <li>丰富的数学函数库，适合科学计算</li>
        <li>与其他科学计算库良好集成</li>
      </ul>

      <h2>四、Pandas核心操作</h2>
      <p>Pandas是数据分析的核心库，提供了灵活的数据结构和数据分析工具：</p>
      <pre><code>{pandasExamples}</code></pre>

      <h3>数据清洗常用操作</h3>
      <pre><code>{`# 处理重复数据
df.drop_duplicates()

# 数据类型转换
df['数值列'] = df['数值列'].astype(float)
df['日期列'] = pd.to_datetime(df['日期列'])

# 替换值
df['类别列'] = df['类别列'].replace({'旧值1': '新值1', '旧值2': '新值2'})

# 应用自定义函数
df['新列'] = df['现有列'].apply(lambda x: x * 2 + 1)

# 分组聚合
grouped = df.groupby('类别列')
grouped.agg({
    '数值列1': 'mean',
    '数值列2': 'sum',
    '数值列3': 'count'
})`}</code></pre>

      <h3>时间序列处理</h3>
      <pre><code>{`# 创建时间序列
dates = pd.date_range('2023-01-01', periods=365, freq='D')
ts = pd.Series(np.random.randn(365), index=dates)

# 时间重采样
monthly_mean = ts.resample('M').mean()  # 按月重采样，计算平均值
quarterly_sum = ts.resample('Q').sum()  # 按季度重采样，计算总和

# 时间偏移
ts.shift(7)  # 向前偏移7天
ts.shift(-7) # 向后偏移7天

# 滚动窗口计算
rolling_mean = ts.rolling(window=7).mean()  # 7天滚动平均值`}</code></pre>

      <h2>五、数据可视化</h2>
      <p>数据可视化是数据分析的重要环节，帮助理解数据模式和趋势：</p>
      <pre><code>{visualizationExamples}</code></pre>

      <h3>常用图表类型及适用场景</h3>
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 border-b text-left">图表类型</th>
              <th className="py-3 px-4 border-b text-left">适用场景</th>
              <th className="py-3 px-4 border-b text-left">主要库</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-4 border-b">折线图</td>
              <td className="py-3 px-4 border-b">展示趋势和变化率</td>
              <td className="py-3 px-4 border-b">Matplotlib, Seaborn</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-3 px-4 border-b">柱状图</td>
              <td className="py-3 px-4 border-b">比较不同类别数据</td>
              <td className="py-3 px-4 border-b">Matplotlib, Seaborn</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b">散点图</td>
              <td className="py-3 px-4 border-b">展示变量间关系</td>
              <td className="py-3 px-4 border-b">Matplotlib, Seaborn</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-3 px-4 border-b">直方图</td>
              <td className="py-3 px-4 border-b">展示数据分布</td>
              <td className="py-3 px-4 border-b">Matplotlib, Seaborn</td>
            </tr>
            <tr>
              <td className="py-3 px-4 border-b">箱线图</td>
              <td className="py-3 px-4 border-b">展示数据分布和异常值</td>
              <td className="py-3 px-4 border-b">Matplotlib, Seaborn</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-3 px-4 border-b">热图</td>
              <td className="py-3 px-4 border-b">展示相关性矩阵</td>
              <td className="py-3 px-4 border-b">Seaborn</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>六、数据分析完整流程</h2>
      <p>一个典型的数据分析项目包含以下步骤：</p>
      <ol className="list-decimal pl-6 my-4">
        <li><strong>问题定义</strong>：明确分析目标和要解决的问题</li>
        <li><strong>数据收集</strong>：获取相关数据集</li>
        <li><strong>数据清洗</strong>：处理缺失值、异常值和不一致的数据</li>
        <li><strong>探索性数据分析</strong>：了解数据特征和分布</li>
        <li><strong>特征工程</strong>：创建适合建模的特征</li>
        <li><strong>建模分析</strong>：应用统计或机器学习方法</li>
        <li><strong>结果可视化</strong>：以直观方式展示发现</li>
        <li><strong>结论与建议</strong>：基于分析结果得出结论</li>
      </ol>

      <pre><code>{analysisWorkflow}</code></pre>

      <h2>七、实战技巧与最佳实践</h2>

      <h3>1. 提升性能的技巧</h3>
      <ul>
        <li>使用向量化操作代替循环</li>
        <li>选择合适的数据类型（如用category类型存储字符串类别）</li>
        <li>对大型数据集使用分块处理</li>
        <li>使用inplace=True参数减少内存占用</li>
        <li>对频繁访问的数据使用缓存</li>
      </ul>

      <h3>2. 代码可读性与可维护性</h3>
      <ul>
        <li>使用有意义的变量和函数名</li>
        <li>添加清晰的注释解释复杂逻辑</li>
        <li>将代码组织成函数和模块</li>
        <li>使用Jupyter Notebook的Markdown单元格记录分析思路</li>
        <li>遵循PEP 8代码风格指南</li>
      </ul>

      <h3>3. 数据处理常见问题</h3>
      <pre><code>{`# 处理大型CSV文件（分块读取）
chunk_size = 10000
chunk_iter = pd.read_csv('large_file.csv', chunksize=chunk_size)

for chunk in chunk_iter:
    # 处理每个数据块
    process_chunk(chunk)

# 处理内存不足问题
# 1. 只读取需要的列
df = pd.read_csv('data.csv', usecols=['必要列1', '必要列2'])

# 2. 转换为更节省内存的数据类型
df['整数列'] = pd.to_numeric(df['整数列'], downcast='integer')
df['浮点列'] = pd.to_numeric(df['浮点列'], downcast='float')

# 3. 清理不再需要的数据
del unused_variable
gc.collect()  # 手动触发垃圾回收`}</code></pre>

      <h2>八、高级主题</h2>
      <ul>
        <li><strong>并行计算</strong>：使用Dask或Swifter处理大型数据集</li>
        <li><strong>数据库交互</strong>：使用SQLAlchemy连接数据库</li>
        <li><strong>自动化报告</strong>：使用Jinja2和WeasyPrint生成PDF报告</li>
        <li><strong>交互式仪表板</strong>：使用Streamlit或Dash构建数据分析应用</li>
        <li><strong>深度学习</strong>：使用TensorFlow或PyTorch进行复杂模式识别</li>
      </ul>

      <h2>九、总结</h2>
      <p>Python提供了强大而灵活的工具集，使数据分析工作变得高效而直观。从数据加载、清洗到探索性分析、建模和可视化，Python生态系统中的库（如NumPy、Pandas、Matplotlib和Seaborn）提供了完整的解决方案。</p>
      <p>掌握Python数据分析不仅需要了解各个库的使用方法，更重要的是培养数据分析思维，能够清晰定义问题、选择合适的方法，并从数据中提取有价值的见解。通过不断实践和探索，你将能够应对各种数据分析挑战，为决策提供数据支持。</p>
    </DocLayout>
  );
};

export default PythonDataAnalysis;
