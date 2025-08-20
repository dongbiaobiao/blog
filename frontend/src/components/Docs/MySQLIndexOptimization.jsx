import React, { useEffect } from 'react';
import DocLayout from '../DocLayout';

const MySQLIndexOptimization = () => {
  // 组件挂载时自动滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // 索引创建示例
  const createIndexExamples = `-- 创建普通索引
CREATE INDEX idx_username ON users(username);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_email ON users(email);

-- 创建主键索引（通常在建表时指定）
ALTER TABLE users ADD PRIMARY KEY (id);

-- 创建复合索引
CREATE INDEX idx_name_age ON users(name, age);

-- 创建前缀索引（适用于长字符串）
CREATE INDEX idx_title ON articles(title(10));`;

  // 索引使用示例
  const indexUsageExamples = `-- 有效使用索引
SELECT * FROM users WHERE username = 'john_doe';

-- 复合索引遵循最左匹配原则
SELECT * FROM users WHERE name = 'John' AND age = 30;

-- 范围条件后的列无法使用索引
SELECT * FROM users WHERE name = 'John' AND age > 30 AND city = 'New York';
-- 只有name和age列会使用索引，city不会

-- 强制使用指定索引
SELECT * FROM users USE INDEX (idx_username) WHERE username = 'john_doe';`;

  // 索引失效情况示例
  const indexFailureExamples = `-- 1. 使用函数操作索引列
SELECT * FROM users WHERE SUBSTR(username, 1, 3) = 'joh';

-- 2. 使用不等于操作符
SELECT * FROM users WHERE age != 30;

-- 3. 使用LIKE以通配符开头
SELECT * FROM articles WHERE title LIKE '%optimization';

-- 4. 字符串不加引号导致类型转换
SELECT * FROM users WHERE username = 123;

-- 5. 使用OR连接不包含索引的列
SELECT * FROM users WHERE username = 'john' OR email = 'john@example.com';
-- 如果只有username有索引，整个查询可能不会使用索引`;

  // 索引优化策略
  const optimizationStrategies = `-- 1. 选择合适的索引类型
-- 普通索引：适用于大多数查询场景
-- 唯一索引：确保列值唯一性，比普通索引查询更快
-- 复合索引：优化多列查询，注意顺序（选择性高的列放前面）

-- 2. 定期维护索引
-- 分析索引使用情况
SELECT * FROM sys.schema_unused_indexes;

-- 优化表和索引
OPTIMIZE TABLE users;

-- 重建索引
ALTER TABLE users DROP INDEX idx_username;
CREATE INDEX idx_username ON users(username);`;

  return (
    <DocLayout title="MySQL索引优化完全指南">
      <p>索引是MySQL数据库优化中最基础也最重要的技术之一，合理的索引设计能够显著提升查询性能。本文将深入讲解MySQL索引的工作原理、创建策略、优化技巧以及常见问题解决方案，帮助你构建高效的数据库查询系统。</p>

      <h2>一、索引的基本原理</h2>
      <p>索引是一种特殊的数据结构，它就像书籍的目录，可以帮助数据库快速定位到所需的数据，而无需扫描整个表。</p>

      <h3>1. 索引的工作机制</h3>
      <p>MySQL中最常用的索引类型是B+树索引，它具有以下特点：</p>
      <ul>
        <li>所有数据都存储在叶子节点，并且叶子节点之间形成有序链表</li>
        <li>非叶子节点仅用于索引，不存储实际数据</li>
        <li>支持范围查询和排序操作</li>
        <li>层数通常在3-4层，可支持千万级数据的快速查询</li>
      </ul>

      <h3>2. 索引的优缺点</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-bold text-blue-800 mb-2">优点</h4>
          <ul className="list-disc pl-5">
            <li>显著提高查询速度</li>
            <li>加速表连接操作</li>
            <li>加速排序和分组操作</li>
          </ul>
        </div>
        <div className="bg-red-50 p-4 rounded">
          <h4 className="font-bold text-red-800 mb-2">缺点</h4>
          <ul className="list-disc pl-5">
            <li>占用额外存储空间</li>
            <li>降低INSERT、UPDATE、DELETE操作性能</li>
            <li>需要定期维护以保持性能</li>
          </ul>
        </div>
      </div>

      <h2>二、MySQL索引类型</h2>
      <p>MySQL提供多种索引类型，适用于不同的场景：</p>

      <h3>1. 按功能分类</h3>
      <ul>
        <li><strong>普通索引（INDEX）</strong>：最基本的索引类型，没有任何限制</li>
        <li><strong>唯一索引（UNIQUE）</strong>：要求索引列的值必须唯一，但允许为空</li>
        <li><strong>主键索引（PRIMARY KEY）</strong>：特殊的唯一索引，不允许为空，一个表只能有一个</li>
        <li><strong>全文索引（FULLTEXT）</strong>：用于全文搜索，适用于长文本</li>
        <li><strong>空间索引（SPATIAL）</strong>：用于地理空间数据类型</li>
      </ul>

      <h3>2. 按物理结构分类</h3>
      <ul>
        <li><strong>B+树索引</strong>：MySQL默认索引类型，适用于大多数场景</li>
        <li><strong>哈希索引</strong>：适用于精确匹配，不支持范围查询</li>
        <li><strong>R树索引</strong>：主要用于空间索引</li>
      </ul>

      <h3>3. 按索引列数量分类</h3>
      <ul>
        <li><strong>单列索引</strong>：只包含单个列的索引</li>
        <li><strong>复合索引（多列索引）</strong>：包含多个列的索引，遵循最左匹配原则</li>
      </ul>

      <h2>三、索引创建与管理</h2>
      <p>合理创建索引是优化的第一步，以下是常见的索引创建示例：</p>
      <pre><code>{createIndexExamples}</code></pre>

      <h3>索引创建原则</h3>
      <ul>
        <li>为经常出现在WHERE、JOIN、ORDER BY、GROUP BY中的列创建索引</li>
        <li>避免为很少查询的列创建索引</li>
        <li>避免为数据量少的表创建索引</li>
        <li>对于字符串，考虑使用前缀索引以减少索引大小</li>
        <li>复合索引中，将选择性高（区分度大）的列放在前面</li>
      </ul>

      <h3>删除索引</h3>
      <pre><code>{`-- 删除索引
DROP INDEX idx_username ON users;

-- 删除主键索引
ALTER TABLE users DROP PRIMARY KEY;`}</code></pre>

      <h2>四、索引使用技巧</h2>
      <p>正确使用索引可以最大化查询性能：</p>
      <pre><code>{indexUsageExamples}</code></pre>

      <h3>复合索引最左匹配原则</h3>
      <p>复合索引<code>(a, b, c)</code>能有效匹配以下查询条件：</p>
      <ul>
        <li>WHERE a = ?</li>
        <li>WHERE a = ? AND b = ?</li>
        <li>WHERE a = ? AND b = ? AND c = ?</li>
        <li>WHERE a = ? AND b > ? AND c = ? （c无法使用索引）</li>
      </ul>
      <p>但无法匹配以下查询条件：</p>
      <ul>
        <li>WHERE b = ? （缺少a）</li>
        <li>WHERE b = ? AND c = ? （缺少a）</li>
        <li>WHERE a > ? AND b = ? （a是范围查询，b无法使用索引）</li>
      </ul>

      <h2>五、索引失效常见情况</h2>
      <p>以下情况可能导致索引失效，需要特别注意：</p>
      <ul>
        <li>使用函数操作索引列（如SUBSTR、DATE_FORMAT等）</li>
        <li>使用不等于（!=、&lt;&gt;）、NOT IN、NOT EXISTS等操作符</li>
        <li>使用LIKE以通配符开头（如'%keyword'）</li>
        <li>字符串不加引号导致类型转换</li>
        <li>复合索引不满足最左匹配原则</li>
        <li>使用OR连接没有索引的列</li>
        <li>MySQL优化器认为全表扫描比索引查询更快</li>
      </ul>

      <pre><code>{indexFailureExamples}</code></pre>

      <h2>六、索引优化策略</h2>
      <p>索引优化是一个持续的过程，需要结合业务场景不断调整：</p>
      <pre><code>{optimizationStrategies}</code></pre>

      <h3>1. 慢查询分析</h3>
      <p>通过开启慢查询日志定位需要优化的SQL：</p>
      <pre><code>{`-- 开启慢查询日志
SET GLOBAL slow_query_log = ON;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
SET GLOBAL long_query_time = 1; -- 执行时间超过1秒的查询`}</code></pre>

      <h3>2. 使用EXPLAIN分析查询</h3>
      <p>EXPLAIN可以帮助分析索引使用情况：</p>
      <pre><code>{`EXPLAIN SELECT * FROM users WHERE username = 'john_doe';`}</code></pre>
      <p>关键字段解析：</p>
      <ul>
        <li><code>type</code>：访问类型，ALL（全表扫描）、index（索引扫描）、range（范围扫描）、ref（索引查找）、const（常量查找）等，性能依次提升</li>
        <li><code>key</code>：实际使用的索引</li>
        <li><code>rows</code>：预估扫描行数</li>
        <li><code>Extra</code>：额外信息，如Using index（覆盖索引）、Using where（需要回表查询）等</li>
      </ul>

      <h3>3. 覆盖索引</h3>
      <p>当查询的所有列都包含在索引中时，MySQL可以直接通过索引获取数据，无需回表：</p>
      <pre><code>{`-- 创建包含所需列的复合索引
CREATE INDEX idx_name_age_email ON users(name, age, email);

-- 查询可以使用覆盖索引
SELECT name, age, email FROM users WHERE name = 'John';`}</code></pre>

      <h2>七、索引设计最佳实践</h2>
      <ul>
        <li><strong>保持适度索引</strong>：不是越多越好，每个表建议不超过5-6个索引</li>
        <li><strong>定期审查索引</strong>：移除未使用或很少使用的索引</li>
        <li><strong>考虑数据分布</strong>：对于性别等选择性低的列，索引可能不起作用</li>
        <li><strong>批量操作时临时禁用索引</strong>：大量插入数据前可先删除索引，完成后重建</li>
        <li><strong>分区表索引策略</strong>：大型表考虑分区，每个分区有自己的索引</li>
        <li><strong>监控索引性能</strong>：结合实际业务查询优化索引</li>
      </ul>

      <h2>八、总结</h2>
      <p>索引优化是MySQL性能调优的核心环节，需要在查询性能和写入性能之间找到平衡。优秀的索引设计应该基于对业务查询模式的深入理解，而非简单的规则套用。</p>
      <p>记住，没有放之四海而皆准的索引策略，最佳实践是持续监控、分析和调整。通过慢查询日志和EXPLAIN工具，结合业务场景不断优化索引，才能构建高效、稳定的数据库系统。</p>
    </DocLayout>
  );
};

export default MySQLIndexOptimization;
