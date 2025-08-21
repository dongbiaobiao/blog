import React, { useEffect, useState, useRef } from 'react';
import DocLayout from '../DocLayout';
// 导入文档数据
import { docs } from '../StudyDocs'; // 假设StudyDocs.jsx与CssFlexbox.jsx在同级目录，路径需根据实际情况调整

// 显示文档最后更新时间的组件
const LastUpdatedTime = () => {
  // 从文档数据中获取CSS Flexbox的最后更新时间
  const flexboxDoc = docs.find(doc => doc.title === 'CSS Flexbox 布局全解析');
  const lastUpdated = flexboxDoc ? flexboxDoc.lastUpdated : '未知';

  // 格式化日期为"年-月-日"格式（如果需要更详细格式可扩展）
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
      color: '#666',
      fontSize: '0.9rem',
      marginBottom: '1rem',
      fontStyle: 'italic'
    }}>
      最后更新时间：{formatDate(lastUpdated)}
    </div>
  );
};

// 折叠面板组件
const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div style={{ margin: '1rem 0', border: '1px solid #eee', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div
        style={{
          padding: '0.8rem 1rem',
          background: '#f8f9fa',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: '600'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span style={{ transition: 'transform 0.3s ease' }}>{isOpen ? '▼' : '▲'}</span>
      </div>
      {isOpen && (
        <div style={{ padding: '1rem', borderTop: '1px solid #eee' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// 提示框组件
const TipBox = ({ type = 'info', children }) => {
  const styles = {
    info: { background: '#e3f2fd', borderLeft: '4px solid #2196f3' },
    warning: { background: '#fff8e1', borderLeft: '4px solid #ffc107' },
    danger: { background: '#ffebee', borderLeft: '4px solid #f44336' }
  };
  return (
    <div style={{ ...styles[type], padding: '1rem', margin: '1rem 0', borderRadius: '4px' }}>
      {children}
    </div>
  );
};

// 图片查看器组件（点击放大功能）
const ImageViewer = ({ src, alt, style }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      {/* 缩略图 */}
      <div
        style={{ ...style, cursor: 'zoom-in', textAlign: 'center', margin: '1rem 0' }}
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={src}
          alt={alt}
          style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
        <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>点击图片放大查看</p>
      </div>

      {/* 放大后的图片模态框 */}
      {isZoomed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '4px'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}>
            ×
          </div>
        </div>
      )}
    </>
  );
};

// 代码框组件
const CodeBlock = ({ language, children }) => {
  const [buttonText, setButtonText] = useState('复制代码');
  const timeoutRef = useRef(null);

  const handleCopy = () => {
    // 复制代码到剪贴板
    navigator.clipboard.writeText(children.trim())
      .then(() => {
        // 更改按钮文本为"已复制"
        setButtonText('已复制');

        // 清除之前的定时器
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // 3秒后恢复按钮文本
        timeoutRef.current = setTimeout(() => {
          setButtonText('复制代码');
        }, 3000);
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      margin: '0.5rem 0 1rem 0',
      overflow: 'auto'
    }}>
      <div style={{
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
        color: '#666',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{language}</span>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: buttonText === '已复制' ? '#4caf50' : '#666',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'color 0.3s ease'
          }}
          onClick={handleCopy}
        >
          {buttonText}
        </button>
      </div>
      <pre style={{ margin: 0 }}>
        <code style={{
          padding: '1rem',
          display: 'block',
          fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          {children}
        </code>
      </pre>
    </div>
  );
};

const CssFlexbox = () => {
  // 组件挂载时自动滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <DocLayout title="模型微调">
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        {/* 显示文档最后更新时间（从StudyDocs中获取） */}
        <LastUpdatedTime />

        <h2 style={{ margin: '1.5rem 0', color: '#2d3748' }}>模型微调</h2>
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />
        <p style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>
          本文档详细介绍基于LLaMA-Factory进行大模型（以Qwen2.5为例）微调的完整流程，包括环境准备、微调操作、模型合并与部署等步骤，适合初学者快速上手。
        </p>

        {/* 文档其他内容保持不变 */}
        <h3 style={{ margin: '1.5rem 0 1rem 0', color: '#2d3748', borderLeft: '4px solid #3182ce', paddingLeft: '0.75rem' }}>1 环境安装</h3>
        <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
          环境安装是模型微调的基础，本节将从虚拟环境创建到模型下载，逐步完成所有前置准备工作。
        </p>

        <Collapsible title="1.1 创建环境(Python=3.10)">
          <p style={{ lineHeight: '1.7' }}>创建指定Python版本的虚拟环境，隔离项目依赖：</p>
          <CodeBlock language="bash">
conda create -n dbb python=3.10
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250806101510729.png"
            alt="创建环境"
          />
        </Collapsible>

        <Collapsible title="1.2 查看现有环境">
          <p style={{ lineHeight: '1.7' }}>确认环境是否创建成功：</p>
          <CodeBlock language="bash">
conda env list
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250806101848068.png"
            alt="查看环境"
          />
        </Collapsible>

        <Collapsible title="1.3 激活环境">
          <p style={{ lineHeight: '1.7' }}>进入创建的虚拟环境以使用隔离的依赖：</p>
          <CodeBlock language="bash">
conda activate dbb
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250806102551208.png"
            alt="激活环境"
          />
        </Collapsible>

        <Collapsible title="1.4 安装PyTorch">
          <p style={{ lineHeight: '1.7' }}>安装支持CUDA的PyTorch框架（GPU加速必备）：</p>
          <CodeBlock language="bash">
conda install pytorch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 pytorch-cuda=12.4 -c pytorch -c nvidia
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250806102412614.png"
            alt="安装PyTorch"
          />
        </Collapsible>

        <Collapsible title="1.5 安装Transformers库">
          <p style={{ lineHeight: '1.7' }}>安装Hugging Face的Transformers库，用于加载和处理预训练模型：</p>
          <CodeBlock language="bash">
pip install transformers==4.49.0 -i https://pypi.tuna.tsinghua.edu.cn/simple
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250806102726326.png"
            alt="安装Transformers"
          />
        </Collapsible>

        <Collapsible title="1.6 验证GPU可用性">
          <p style={{ lineHeight: '1.7' }}>运行以下Python代码验证GPU是否可用（大模型微调需GPU支持）：</p>
          <CodeBlock language="python">
import torch
print(torch.cuda.is_available())  # 显示True表示GPU可用
print(torch.cuda.device_count())  # 显示可用GPU数量
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807082619025.png"
            alt="验证GPU"
          />
        </Collapsible>

        <Collapsible title="1.7 下载LLaMA-Factory代码">
          <div>
            <h5 style={{ margin: '1rem 0 0.5rem 0' }}>1.7.1 克隆LLaMA-Factory仓库到本地</h5>
            <p style={{ lineHeight: '1.7' }}>LLaMA-Factory是一个集成了多种微调方法的工具库：</p>
            <CodeBlock language="bash">
git clone https://github.com/hiyouga/LLaMA-Factory.git
            </CodeBlock>
            <ImageViewer
              src="/Fig/CssFlexbox/image-20250807082817978.png"
              alt="克隆仓库"
            />

            <h5 style={{ margin: '1rem 0 0.5rem 0' }}>1.7.2 安装依赖</h5>
            <p style={{ lineHeight: '1.7' }}>进入代码根目录，安装库所需的额外依赖：</p>
            <CodeBlock language="bash">
cd /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory
pip install -e ".[torch,metrics]"
            </CodeBlock>
            <ImageViewer
              src="/Fig/CssFlexbox/image-20250807083021130.png"
              alt="安装依赖"
            />
          </div>
        </Collapsible>

        <Collapsible title="1.8 下载微调模型">
          <p style={{ lineHeight: '1.7' }}>使用modelscope工具下载Qwen2.5模型（需确保有足够存储空间）：</p>
          <CodeBlock language="bash">
pip install modelscope
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807083100914.png"
            alt="安装modelscope"
          />

          <p style={{ lineHeight: '1.7' }}>将模型下载到指定目录（local_dir根据实际情况修改）：</p>
          <CodeBlock language="bash">
modelscope download --model Qwen/Qwen2.5-14B-Instruct --local_dir '/data/models/Qwen2.5-14B-Instruct'
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807083150963.png"
            alt="下载模型"
          />
        </Collapsible>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />

        <h3 style={{ margin: '1.5rem 0 1rem 0', color: '#2d3748', borderLeft: '4px solid #3182ce', paddingLeft: '0.75rem' }}>2 模型微调</h3>
        <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
          模型微调支持两种方式：手动编写配置脚本或通过可视化界面操作，可根据个人习惯选择。
        </p>

        <Collapsible title="2.1 手动编写脚本">
          <p style={{ lineHeight: '1.7' }}>LLaMA-Factory提供示例配置文件，可参考修改为自定义配置（以Qwen7B为例）：</p>

          <CodeBlock language="yaml">
### model
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
resume_from_checkpoint: null
          </CodeBlock>

          <p style={{ lineHeight: '1.7' }}>进入LLaMA-Factory目录并运行训练指令：</p>
          <CodeBlock language="bash">
cd /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory
          </CodeBlock>

          <TipBox type="info">
            <p style={{ lineHeight: '1.7' }}>若服务器有多张显卡，可通过以下命令指定使用的显卡（例如使用第7张）：</p>
            <CodeBlock language="bash">
CUDA_VISIBLE_DEVICES=7
            </CodeBlock>
          </TipBox>

          <p style={{ lineHeight: '1.7' }}>运行训练指令：</p>
          <CodeBlock language="bash">
llamafactory-cli train examples/train_lora/qwen7b_lora_sft.yaml
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807083931060.png"
            alt="运行训练指令"
          />

          <p style={{ lineHeight: '1.7' }}>训练完成状态：</p>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807085035490.png"
            alt="训练完成"
          />
        </Collapsible>

        <Collapsible title="2.2 可视化界面操作">
          <p style={{ lineHeight: '1.7' }}>通过Web界面操作更直观，适合新手：</p>
          <CodeBlock language="bash">
llamafactory-cli webui
          </CodeBlock>

          <p style={{ lineHeight: '1.7' }}>启动后，通过浏览器访问<code>http://10.10.20.119:7860</code>进行配置。</p>

          <p style={{ lineHeight: '1.7' }}>查看服务器显卡使用情况（避免使用已占用显卡）：</p>
          <CodeBlock language="bash">
nvidia-smi
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807085846147.png"
            alt="查看显卡"
          />

          <p style={{ lineHeight: '1.7' }}>指定显卡和端口启动WebUI：</p>
          <CodeBlock language="bash">
CUDA_VISIBLE_DEVICES=1,2,7 GRADIO_SERVER_PORT=7860 llamafactory-cli webui
          </CodeBlock>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807085755709.png"
            alt="指定端口"
          />

          <TipBox type="warning">
            <strong>注意：</strong>若服务器有多张显卡，建议指定未被占用的显卡（通常是编号较大的），否则可能因显存不足导致训练失败。
          </TipBox>

          <p style={{ lineHeight: '1.7' }}>Web界面如下：</p>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807084646974.png"
            alt="Web界面"
          />

          <p style={{ lineHeight: '1.7' }}>主要配置参数说明：</p>
          <ol style={{ lineHeight: '1.7', margin: '1rem 0 1rem 1.5rem' }}>
            <li>选择正确的模型名称和模型保存路径；</li>
            <li>选择训练类型：指令微调（SFT）或预训练微调（PreTraining）；</li>
            <li>选择数据集，确保格式与训练类型匹配；</li>
            <li>调整训练轮数（通常3~30轮，损失率下降表示参数收敛）。</li>
          </ol>

          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807090153771.png"
            alt="配置参数"
          />

          <p style={{ lineHeight: '1.7' }}>点击页面底部“开始”按钮启动训练，建议同时监控后台控制台以排查错误。</p>
        </Collapsible>

        <Collapsible title="2.3 对话验证">
          <h5 style={{ margin: '1rem 0 0.5rem 0' }}>2.3.1 模型加载</h5>
          <p style={{ lineHeight: '1.7' }}>微调后通过问答测试模型效果，步骤如下：</p>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250807090720965.png"
            alt="模型加载"
          />
          <p style={{ lineHeight: '1.7' }}>在可视化界面中输入基础模型路径和微调检查点路径，加载模型后即可测试。模型加载会占用显存，调试完成后需及时卸载以释放资源。</p>
        </Collapsible>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />

        <h3 style={{ margin: '1.5rem 0 1rem 0', color: '#2d3748', borderLeft: '4px solid #3182ce', paddingLeft: '0.75rem' }}>3 模型部署</h3>
        <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
          微调后的模型需合并LoRA参数为独立模型，再通过服务端部署供客户端调用。
        </p>

        <Collapsible title="3.1 模型合并">
          <p style={{ lineHeight: '1.7' }}>将LoRA微调参数合并到基础模型中（支持可视化或脚本方式）：</p>

          <h5 style={{ margin: '1rem 0 0.5rem 0' }}>3.1.1 可视化界面操作</h5>
          <ImageViewer
            src="/Fig/CssFlexbox/image-20250808093621642.png"
            alt="导出界面"
          />
          <p style={{ lineHeight: '1.7' }}>操作步骤说明：</p>
          <ol style={{ lineHeight: '1.7', margin: '1rem 0 1rem 1.5rem' }}>
            <li><strong>选择基础模型路径</strong>：指定原始预训练模型的存放路径；</li>
            <li><strong>选择检查点路径</strong>：指定微调后增量参数的保存路径；</li>
            <li><strong>加载模型并切换页签</strong>：先在<code>Chat</code>页签加载模型，再切换到<code>Export</code>页签；</li>
            <li><strong>选择导出设备</strong>：建议选<code>auto</code>以自动使用GPU加速；</li>
            <li><strong>指定导出目录</strong>：设置合并后模型的保存路径；</li>
            <li><strong>开始导出</strong>：点击“开始导出”，同时监控后台日志处理错误。</li>
          </ol>

          <h5 style={{ margin: '1rem 0 0.5rem 0' }}>3.1.2 手动编写脚本</h5>
          <CodeBlock language="bash">
llamafactory-cli export \
    --model_name_or_path path_to_base_model \
    --adapter_name_or_path path_to_adapter \
    --template qwen \
    --finetuning_type lora \
    --export_dir path_to_export \
          </CodeBlock>
        </Collapsible>
      </div>
    </DocLayout>
  );
};

export default CssFlexbox;