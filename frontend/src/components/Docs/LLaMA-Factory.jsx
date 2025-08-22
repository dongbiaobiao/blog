import React, { useEffect, useState, useRef } from 'react';
import DocLayout from '../DocLayout';
import { docs } from '../StudyDocs';

// 新增：统一ID生成函数，与DocLayout保持一致
const generateHeadingId = (headingText) => {
  return headingText.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

// 颜色主题配置
const COLORS = {
  primary: '#2563eb',       // 主色调：深蓝色
  secondary: '#4f46e5',     // 辅助色：靛蓝色
  accent: '#0ea5e9',        // 强调色：亮蓝色
  success: '#10b981',       // 成功色：绿色
  warning: '#f59e0b',       // 警告色：橙色
  danger: '#ef4444',        // 危险色：红色
  dark: '#1e293b',          // 深色文本
  medium: '#64748b',        // 中等强度文本
  light: '#f1f5f9',         // 浅色背景
  border: '#cbd5e1',        // 边框色
  textBase: '#334155'       // 基础文本色
};

// 基础文本样式
const baseTextStyle = {
  display: 'block',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  lineHeight: '1.7',
  color: COLORS.textBase,
  margin: '0',
  padding: '0',
  visibility: 'visible',
  opacity: '1',
  height: 'auto',
  width: '100%'
};

// 最后更新时间组件
const LastUpdatedTime = () => {
  const flexboxDoc = docs.find(doc => doc.title === '基于 LLaMA-Factory 的 Qwen2.5 模型微调全流程');
  const lastUpdated = flexboxDoc ? flexboxDoc.lastUpdated : '未知';

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
      ...baseTextStyle,
      textAlign: 'right',
      color: COLORS.medium,
      fontSize: '0.9rem',
      marginBottom: '1rem',
      fontStyle: 'italic',
      padding: '0.5rem 0',
      borderBottom: `1px solid ${COLORS.border}`,
      zIndex: 10
    }}>
      最后更新时间：{formatDate(lastUpdated)}
    </div>
  );
};

// 段落组件
const Paragraph = ({ children, style = {} }) => (
  <div style={{
    ...baseTextStyle,
    marginBottom: '1rem'
  }}>
    <p style={{
      ...baseTextStyle,
      marginBottom: '0',
      ...style
    }}>
      {children}
    </p>
  </div>
);

// 折叠面板组件
const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div style={{
      margin: '1.5rem 0',
      border: `1px solid ${COLORS.border}`,
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }}>
      <div
        style={{
          padding: '1rem 1.25rem',
          background: COLORS.light,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: '600',
          color: COLORS.heading,
          borderRadius: '6px 6px 0 0',
          transition: 'background 0.2s ease'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
        onMouseOut={(e) => e.currentTarget.style.background = COLORS.light}
      >
        <span>{title}</span>
        <span style={{
          transition: 'transform 0.3s ease',
          color: COLORS.primary,
          fontWeight: 'bold'
        }}>
          {isOpen ? '−' : '+'}
        </span>
      </div>
      <div
        style={{
          maxHeight: isOpen ? '2000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
          borderTop: isOpen ? `1px solid ${COLORS.border}` : 'none'
        }}
      >
        <div style={{ padding: '1.25rem', backgroundColor: 'white' }}>
          {Array.isArray(children) ? children : [children]}
        </div>
      </div>
    </div>
  );
};

// 提示框组件
const TipBox = ({ type = 'info', children }) => {
  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '❗'
  };

  const styles = {
    info: {
      background: '#eff6ff',
      borderLeft: `4px solid ${COLORS.primary}`,
      color: '#1e40af'
    },
    warning: {
      background: '#fffbeb',
      borderLeft: `4px solid ${COLORS.warning}`,
      color: '#92400e'
    },
    danger: {
      background: '#fee2e2',
      borderLeft: `4px solid ${COLORS.danger}`,
      color: '#b91c1c'
    }
  };

  return (
    <div style={{
      ...styles[type],
      padding: '1rem 1.25rem',
      margin: '1.25rem 0',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      ...baseTextStyle,
      color: styles[type].color
    }}>
      <span style={{ fontSize: '1.25rem', marginTop: '-2px', flexShrink: 0 }}>{icons[type]}</span>
      <div style={{
        ...baseTextStyle,
        color: styles[type].color,
        flex: 1
      }}>
        {children}
      </div>
    </div>
  );
};

// 图片组件
const ImageViewer = ({ src, alt }) => {
  return (
    <div style={{
      ...baseTextStyle,
      textAlign: 'center',
      margin: '1.5rem 0',
      padding: '1rem',
      border: `1px solid ${COLORS.border}`,
      borderRadius: '6px',
      background: '#f8fafc'
    }}>
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          maxHeight: '500px',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        loading="lazy"
      />
      {alt && (
        <p style={{
          ...baseTextStyle,
          marginTop: '0.75rem',
          fontSize: '0.9rem',
          color: COLORS.medium,
          fontStyle: 'italic'
        }}>
          {alt}
        </p>
      )}
    </div>
  );
};

// 代码框组件
const CodeBlock = ({ language, code }) => {
  const [buttonText, setButtonText] = useState('复制代码');
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleCopy = () => {
    const codeText = typeof code === 'string' ? code.trim() : '';
    navigator.clipboard.writeText(codeText)
      .then(() => {
        setButtonText('已复制');
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setButtonText('复制代码');
          setCopied(false);
        }, 3000);
      })
      .catch(err => {
        console.error('复制失败:', err);
        setButtonText('复制失败');
        setTimeout(() => setButtonText('复制代码'), 2000);
      });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const languageMap = {
    'bash': 'Bash 命令',
    'python': 'Python 代码',
    'yaml': 'YAML 配置'
  };

  return (
    <div style={{
      backgroundColor: '#1e293b',
      borderRadius: '6px',
      margin: '1rem 0 1.5rem 0',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        padding: '0.85rem 1.25rem',
        fontSize: '0.85rem',
        color: '#e2e8f0',
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        background: '#0f172a',
      }}>
        <span style={{ fontWeight: '500' }}>
          {languageMap[language] || language}
        </span>
        <button
          style={{
            background: copied ? COLORS.success : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.35rem 0.75rem',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          onClick={handleCopy}
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{buttonText}</span>
        </button>
      </div>
      <div style={{
        maxHeight: '500px',
        overflow: 'auto'
      }}>
        <pre style={{ margin: 0 }}>
          <code style={{
            padding: '1.25rem',
            display: 'block',
            fontFamily: 'SFMono-Regular, Consolas, monospace',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: '#e2e8f0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {typeof code === 'string' ? code : ''}
          </code>
        </pre>
      </div>
    </div>
  );
};

const LLaMAFactory = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  // 新增：目录结构定义
  const headings = [
    "1. 环境安装",
    "2. 模型微调",
    "3. 模型部署",
    "4. 常见问题与解决方案"
  ];


  return (
    <DocLayout title="基于 LLaMA-Factory 的 Qwen2.5 模型微调全流程" headings={headings}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 1.5rem',
        color: COLORS.body,
        lineHeight: '1.8',
        whiteSpace: 'normal'
      }}>
        {/*<LastUpdatedTime />*/}

        <h1 style={{
          ...baseTextStyle,
          margin: '2rem 0 1.5rem 0',
          color: COLORS.dark,
          fontSize: '2rem',
          lineHeight: '1.3',
          fontWeight: 700
        }}>
          {/*基于 LLaMA-Factory 的 Qwen2.5 模型微调全流程*/}
        </h1>

        <div style={{
          background: '#f8fafc',
          borderLeft: `4px solid ${COLORS.accent}`,
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          borderRadius: '0 6px 6px 0',
          whiteSpace: 'normal'
        }}>
          <p style={{
            lineHeight: '1.7',
            fontSize: '1.05rem',
            color: '#334155',
            margin: 0,
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}>
            本文档详细介绍基于LLaMA-Factory进行大模型（以Qwen2.5为例）微调的完整流程，包括环境准备、微调操作、模型合并与部署等步骤，适合初学者快速上手。
          </p>
        </div>




        {/* 1. 环境安装 */}
        <h2 id={generateHeadingId("1. 环境安装")}
            style={{
          ...baseTextStyle,
          margin: '2.5rem 0 1.25rem 0',
          color: COLORS.dark,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          1 环境安装
        </h2>
        <Paragraph>
          环境安装是模型微调的基础，本节将从虚拟环境创建到模型下载，逐步完成所有前置准备工作。
        </Paragraph>

        <Collapsible title="1.1 创建环境(Python=3.10)">
          <Paragraph>
            创建指定Python版本的虚拟环境，隔离项目依赖：
          </Paragraph>
          <CodeBlock language="bash" code={`conda create -n dbb python=3.10`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250806101510729.png"
            alt="创建Python 3.10虚拟环境的命令执行结果"
          />
        </Collapsible>

        <Collapsible title="1.2 查看现有环境">
          <Paragraph>
            确认环境是否创建成功：
          </Paragraph>
          <CodeBlock language="bash" code={`conda env list`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250806101848068.png"
            alt="查看所有conda环境的命令执行结果"
          />
        </Collapsible>

        <Collapsible title="1.3 激活环境">
          <Paragraph>
            进入创建的虚拟环境以使用隔离的依赖：
          </Paragraph>
          <CodeBlock language="bash" code={`conda activate dbb`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250806102551208.png"
            alt="激活dbb虚拟环境的命令执行结果"
          />
        </Collapsible>

        <Collapsible title="1.4 安装PyTorch">
          <Paragraph>
            安装支持CUDA的PyTorch框架（GPU加速必备）：
          </Paragraph>
          <CodeBlock language="bash" code={`conda install pytorch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 pytorch-cuda=12.4 -c pytorch -c nvidia`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250806102412614.png"
            alt="安装PyTorch和CUDA的命令执行结果"
          />
        </Collapsible>

        <Collapsible title="1.5 安装Transformers库">
          <Paragraph>
            安装Hugging Face的Transformers库，用于加载和处理预训练模型：
          </Paragraph>
          <CodeBlock language="bash" code={`pip install transformers==4.49.0 -i https://pypi.tuna.tsinghua.edu.cn/simple`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250806102726326.png"
            alt="安装Transformers库的命令执行结果"
          />
        </Collapsible>

        <Collapsible title="1.6 验证GPU可用性">
          <Paragraph>
            运行以下Python代码验证GPU是否可用（大模型微调需GPU支持）：
          </Paragraph>
          <CodeBlock language="python" code={`import torch
print(torch.cuda.is_available())  # 显示True表示GPU可用
print(torch.cuda.device_count())  # 显示可用GPU数量`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807082619025.png"
            alt="验证GPU可用性的Python代码执行结果"
          />
        </Collapsible>

        <Collapsible title="1.7 下载LLaMA-Factory代码">
          <div style={baseTextStyle}>
            <h5 style={{
              ...baseTextStyle,
              margin: '1.25rem 0 0.75rem 0',
              color: COLORS.dark,
              fontSize: '1.1rem',
              fontWeight: 600
            }}>1.7.1 克隆LLaMA-Factory仓库到本地</h5>
            <Paragraph>
              LLaMA-Factory是一个集成了多种微调方法的工具库：
            </Paragraph>
            <CodeBlock language="bash" code={`git clone https://github.com/hiyouga/LLaMA-Factory.git`} />
            <ImageViewer
              src="/Fig/LLaMA-Factory/image-20250807082817978.png"
              alt="克隆LLaMA-Factory仓库的命令执行结果"
            />

            <h5 style={{
              ...baseTextStyle,
              margin: '1.25rem 0 0.75rem 0',
              color: COLORS.dark,
              fontSize: '1.1rem',
              fontWeight: 600
            }}>1.7.2 安装依赖</h5>
            <Paragraph>
              进入代码根目录，安装库所需的额外依赖：
            </Paragraph>
            <CodeBlock language="bash" code={`cd /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory
pip install -e ".[torch,metrics]"`} />
            <ImageViewer
              src="/Fig/LLaMA-Factory/image-20250807083021130.png"
              alt="安装LLaMA-Factory依赖的命令执行结果"
            />
          </div>
        </Collapsible>

        <Collapsible title="1.8 下载微调模型">
          <Paragraph>
            使用modelscope工具下载Qwen2.5模型（需确保有足够存储空间）：
          </Paragraph>
          <CodeBlock language="bash" code={`pip install modelscope`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807083100914.png"
            alt="安装modelscope的命令执行结果"
          />

          <Paragraph>
            将模型下载到指定目录（local_dir根据实际情况修改）：
          </Paragraph>
          <CodeBlock language="bash" code={`modelscope download --model Qwen/Qwen2.5-14B-Instruct --local_dir '/data/models/Qwen2.5-14B-Instruct'`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807083150963.png"
            alt="下载Qwen2.5模型的命令执行结果"
          />
        </Collapsible>

        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #cbd5e1, transparent)',
          margin: '2.5rem 0'
        }}></div>

        {/* 2. 模型微调 */}
        <h2  id={generateHeadingId("2. 模型微调")}
          style={{
          ...baseTextStyle,
          margin: '2.5rem 0 1.25rem 0',
          color: COLORS.dark,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          2 模型微调
        </h2>
        <Paragraph>
          模型微调支持两种方式：手动编写配置脚本或通过可视化界面操作，可根据个人习惯选择。
        </Paragraph>

        <Collapsible title="2.1 手动编写脚本">
          <Paragraph>
            LLaMA-Factory提供示例配置文件，可参考修改为自定义配置（以Qwen7B为例）：
          </Paragraph>

          <CodeBlock language="yaml" code={`### model
model_name_or_path: /data/models/Qwen2.5-7B-Instruct
trust_remote_code: true

### method
stage: sft  # 指令微调阶段
do_train: true
finetuning_type: lora  # 使用LoRA轻量化微调
lora_rank: 8  # LoRA秩，影响微调效果和参数规模
lora_target: all

### dataset
dataset: identity,alpaca_en_demo  # 训练数据集
template: qwen  # 适配Qwen模型的模板
cutoff_len: 2048  # 文本截断长度
max_samples: 1000  # 最大样本数
overwrite_cache: true
preprocessing_num_workers: 16
dataloader_num_workers: 4

### output
output_dir: /data/models/dbb-qwen2.5-7b-sft  # 模型保存路径
logging_steps: 10  # 日志打印间隔
save_steps: 500  # 模型保存间隔
plot_loss: true  # 绘制损失曲线
overwrite_output_dir: true
save_only_model: false

### train
per_device_train_batch_size: 1  # 单设备batch size
gradient_accumulation_steps: 8  # 梯度累积步数
learning_rate: 1.0e-4  # 学习率
num_train_epochs: 3.0  # 训练轮数
lr_scheduler_type: cosine  # 学习率调度器
warmup_ratio: 0.1  # 预热比例
bf16: true  # 使用bf16混合精度训练
ddp_timeout: 180000000
resume_from_checkpoint: null`} />

          <Paragraph>
            进入LLaMA-Factory目录并运行训练指令：
          </Paragraph>
          <CodeBlock language="bash" code={`cd /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory`} />

          <TipBox type="info">
            <Paragraph style={{ marginBottom: 0 }}>
              若服务器有多张显卡，可通过以下命令指定使用的显卡（例如使用第7张）：
            </Paragraph>
            <CodeBlock language="bash" code={`CUDA_VISIBLE_DEVICES=7`} />
          </TipBox>

          <Paragraph>
            运行训练指令：
          </Paragraph>
          <CodeBlock language="bash" code={`llamafactory-cli train examples/train_lora/qwen7b_lora_sft.yaml`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807083931060.png"
            alt="运行模型训练指令的执行结果"
          />

          <Paragraph>
            训练完成状态：
          </Paragraph>
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807085035490.png"
            alt="模型训练完成的状态显示"
          />
        </Collapsible>

        <Collapsible title="2.2 可视化界面操作">
          <Paragraph>
            通过Web界面操作更直观，适合新手：
          </Paragraph>
          <CodeBlock language="bash" code={`llamafactory-cli webui`} />

          <Paragraph>
            启动后，通过浏览器访问<code style={{
              background: '#e2e8f0',
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
              fontSize: '0.95rem',
              color: '#1e293b'
            }}>http://10.10.20.119:7860</code>进行配置。
          </Paragraph>

          <Paragraph>
            查看服务器显卡使用情况（避免使用已占用显卡）：
          </Paragraph>
          <CodeBlock language="bash" code={`nvidia-smi`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807085846147.png"
            alt="使用nvidia-smi命令查看显卡状态"
          />


          <Paragraph>
            指定显卡和端口启动WebUI：
          </Paragraph>
          <CodeBlock language="bash" code={`CUDA_VISIBLE_DEVICES=1,2,7 GRADIO_SERVER_PORT=7860 llamafactory-cli webui`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807085755709.png"
            alt="指定显卡和端口启动WebUI的命令执行结果"
          />

          <TipBox type="warning">
            <Paragraph style={{ marginBottom: 0 }}>
              <strong>注意：</strong>若服务器有多张显卡，建议指定未被占用的显卡（通常是编号较大的），否则可能因显存不足导致训练失败。
            </Paragraph>
          </TipBox>

          <Paragraph>
            Web界面如下：
          </Paragraph>
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807084646974.png"
            alt="LLaMA-Factory的WebUI界面"
          />

          <Paragraph>
            主要配置参数说明：
          </Paragraph>
          <ol style={{
            ...baseTextStyle,
            margin: '1rem 0 1rem 1.5rem',
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>选择正确的模型名称和模型保存路径；</li>
            <li style={{ marginBottom: '0.5rem' }}>选择训练类型：指令微调（SFT）或预训练微调（PreTraining）；</li>
            <li style={{ marginBottom: '0.5rem' }}>选择数据集，确保格式与训练类型匹配；</li>
            <li>调整训练轮数（通常3~30轮，损失率下降表示参数收敛）。</li>
          </ol>

          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807090153771.png"
            alt="WebUI中的模型配置参数界面"
          />

          <Paragraph>
            点击页面底部“开始”按钮启动训练，建议同时监控后台控制台以排查错误。
          </Paragraph>
        </Collapsible>

        <Collapsible title="2.3 对话验证">
          <h5 style={{
            ...baseTextStyle,
            margin: '1.25rem 0 0.75rem 0',
            color: COLORS.dark,
            fontSize: '1.1rem',
            fontWeight: 600
          }}>2.3.1 模型加载</h5>
          <Paragraph>
            微调后通过问答测试模型效果，步骤如下：
          </Paragraph>
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250807090720965.png"
            alt="模型加载和对话验证界面"
          />
          <Paragraph>
            在可视化界面中输入基础模型路径和微调检查点路径，加载模型后即可测试。模型加载会占用显存，调试完成后需及时卸载以释放资源。
          </Paragraph>
        </Collapsible>

        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #cbd5e1, transparent)',
          margin: '2.5rem 0'
        }}></div>

        {/* 3. 模型部署 */}
        <h2 id={generateHeadingId("3. 模型部署")}
          style={{
          ...baseTextStyle,
          margin: '2.5rem 0 1.25rem 0',
          color: COLORS.dark,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          3 模型部署
        </h2>
        <Paragraph>
          Ollama支持部分模型在LoRA微调后直接导入，但目前尚不支持Qwen系列模型。因此，需要将LoRA参数合并到基础模型中，生成一个新的独立模型，再通过服务端部署供客户端调用。
        </Paragraph>

        <Collapsible title="3.1 模型合并">
          <Paragraph>
            模型合并操作与微调类似，可以通过可视化界面或编写YAML脚本完成。以下是具体步骤：
          </Paragraph>

          <h5 style={{
            ...baseTextStyle,
            margin: '1.25rem 0 0.75rem 0',
            color: COLORS.dark,
            fontSize: '1.1rem',
            fontWeight: 600
          }}>3.1.1 可视化界面操作</h5>
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250808093621642.png"
            alt="模型导出和合并的可视化界面"
          />
          <Paragraph>
            上图是导出的操作界面，对于图中各步骤说明如下：
          </Paragraph>
          <ol style={{
            ...baseTextStyle,
            margin: '1rem 0 1rem 1.5rem',
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: COLORS.dark }}>1. 选择基础模型路径</strong>：指定原始预训练模型的存放路径；
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: COLORS.dark }}>2. 选择检查点路径</strong>：指定微调后增量参数的保存路径；
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: COLORS.dark }}>3. 加载模型并切换页签</strong>：先在<code style={{
                background: '#e2e8f0',
                padding: '0.1rem 0.3rem',
                borderRadius: '2px',
                color: '#1e293b'
              }}>Chat</code>页签加载模型，再切换到<code style={{
                background: '#e2e8f0',
                padding: '0.1rem 0.3rem',
                borderRadius: '2px',
                color: '#1e293b'
              }}>Export</code>页签；
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: COLORS.dark }}>4. 选择导出设备</strong>：建议选<code style={{
                background: '#e2e8f0',
                padding: '0.1rem 0.3rem',
                borderRadius: '2px',
                color: '#1e293b'
              }}>auto</code>以自动使用GPU加速；
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: COLORS.dark }}>5. 指定导出目录</strong>：设置合并后模型的保存路径；
            </li>
            <li>
              <strong style={{ color: COLORS.dark }}>6. 开始导出</strong>：点击“开始导出”，同时监控后台日志处理错误。
            </li>
          </ol>

          <h5 style={{
            ...baseTextStyle,
            margin: '1.25rem 0 0.75rem 0',
            color: COLORS.dark,
            fontSize: '1.1rem',
            fontWeight: 600
          }}>3.1.2 手动编写脚本</h5>
          <CodeBlock language="bash" code={`llamafactory-cli export \\
    --model_name_or_path path_to_base_model \\
    --adapter_name_or_path path_to_adapter \\
    --template qwen \\
    --finetuning_type lora \\
    --export_dir path_to_export \\
    --export_size 2 \\
    --export_legacy_format False`} />
          <p>
            合并模型保存在`/home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory/output`中：
          </p>
          <CodeBlock language="bash" code={`llamafactory-cli export \\
    --model_name_or_path /data/models/Qwen2.5-7B-Instruct \\
    --adapter_name_or_path /data/models/dbb-qwen2.5-7b-sft/checkpoint-135 \\
    --template qwen \\
    --finetuning_type lora \\
    --export_dir /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory/output \\
    --export_size 2 \\
    --export_legacy_format False`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250808084127787.png"
            alt="合并模型"
          />
        </Collapsible>

        <Collapsible title="3.2 模型部署与测试">
          <h5 style={{
            ...baseTextStyle,
            margin: '1.25rem 0 0.75rem 0',
            color: COLORS.dark,
            fontSize: '1.1rem',
            fontWeight: 600
          }}>3.2.1 开启服务端</h5>
          <Paragraph>
            使用vLLM部署合并后的模型：
          </Paragraph>
          <CodeBlock language="bash" code={`vllm serve /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory/output --host=127.0.0.1  --port=8089`} />
          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250808090524931.png"
            alt="开启服务端"
          />
          <h5 style={{
            ...baseTextStyle,
            margin: '1.25rem 0 0.75rem 0',
            color: COLORS.dark,
            fontSize: '1.1rem',
            fontWeight: 600
          }}>3.2.2 开启客户端</h5>
          <Paragraph>
            测试部署的模型服务，使用curl命令发送测试请求：
          </Paragraph>
          <CodeBlock language="bash" code={`curl http://127.0.0.1:8089/v1/completions   -H "Content-Type: application/json"   -d '{     "prompt": "hi",     "max_tokens": 7,     "temperature": 0`} />

          <ImageViewer
            src="/Fig/LLaMA-Factory/image-20250808090749766.png"
            alt="测试结果"
          />
        </Collapsible>

        {/* 4 常见问题与解决方案 */}
        <h2 id={generateHeadingId("4. 常见问题与解决方案")}
          style={{
          ...baseTextStyle,
          margin: '2.5rem 0 1.25rem 0',
          color: COLORS.dark,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          4 常见问题与解决方案
        </h2>

        <Collapsible title="4.1 训练过程中出现CUDA Out of Memory错误">
          <Paragraph>
            解决方案：
          </Paragraph>
          <ul style={{
            ...baseTextStyle,
            margin: '1rem 0 1rem 1.5rem',
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>减小batch size（如将per_device_train_batch_size从2改为1）</li>
            <li style={{ marginBottom: '0.5rem' }}>启用梯度累积（增大gradient_accumulation_steps）</li>
            <li style={{ marginBottom: '0.5rem' }}>使用更小的模型（如从14B换成7B或更小）</li>
            <li>启用量化训练（如load_in_4bit或load_in_8bit参数）</li>
          </ul>
          <CodeBlock language="yaml" code={`# 修改配置文件示例
per_device_train_batch_size: 1
gradient_accumulation_steps: 16
load_in_4bit: true`} />
        </Collapsible>

        <Collapsible title="4.2 模型合并失败或合并后无法加载">
          <Paragraph>
            解决方案：
          </Paragraph>
          <ul style={{
            ...baseTextStyle,
            margin: '1rem 0 1rem 1.5rem',
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>检查基础模型路径是否正确，确保模型文件完整</li>
            <li style={{ marginBottom: '0.5rem' }}>确认LoRA检查点与基础模型匹配（同一模型的不同版本可能不兼容）</li>
            <li style={{ marginBottom: '0.5rem' }}>尝试使用最新版本的LLaMA-Factory代码</li>
            <li>合并时确保有足够的内存（合并14B模型需要至少32GB内存）</li>
          </ul>
        </Collapsible>

        <Collapsible title="4.3 训练速度过慢">
          <Paragraph>
            解决方案：
          </Paragraph>
          <ul style={{
            ...baseTextStyle,
            margin: '1rem 0 1rem 1.5rem',
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>确保CUDA和PyTorch版本兼容（推荐CUDA 11.7+）</li>
            <li style={{ marginBottom: '0.5rem' }}>使用bf16或fp16混合精度训练</li>
            <li style={{ marginBottom: '0.5rem' }}>增加batch size（在显存允许的情况下）</li>
            <li>清理缓存或重启服务器释放碎片化显存</li>
          </ul>
          <CodeBlock language="bash" code={`# 清理GPU缓存
nvidia-smi --gpu-reset -i 0  # 重置第0块显卡`} />
        </Collapsible>
      </div>
    </DocLayout>
  );
};

export default LLaMAFactory;
