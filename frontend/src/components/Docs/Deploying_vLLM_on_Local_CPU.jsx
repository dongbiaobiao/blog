import React, { useState, useRef, useEffect } from 'react';
import DocLayout from '../DocLayout';
import { docs } from '../StudyDocs';

// 假设LLaMAFactory.jsx使用的主题颜色配置
const COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#10b981',
  dark: '#1e293b',
  light: '#f1f5f9',
  body: '#334155',
  heading: '#0f172a',
  border: '#e2e8f0',
  info: '#0ea5e9',
  warning: '#f59e0b',
  danger: '#ef4444',
  success: '#10b981',
  // LLaMAFactory风格的代码主题
  codeBg: '#1e293b',
  codeText: '#e2e8f0'
};

// 显示文档最后更新时间的组件
const LastUpdatedTime = () => {
  const vllmDoc = docs.find(doc => doc.title === '本地CPU部署vLLM');
  const lastUpdated = vllmDoc ? vllmDoc.lastUpdated : '未知';

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
      color: COLORS.secondary,
      fontSize: '0.9rem',
      marginBottom: '1.5rem',
      fontStyle: 'italic',
      padding: '0.5rem 0',
      borderBottom: `1px solid ${COLORS.border}`
    }}>
      最后更新时间：{formatDate(lastUpdated)}
    </div>
  );
};

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
          {children}
        </div>
      </div>
    </div>
  );
};

// 提示框组件
const TipBox = ({ type = 'info', children }) => {
  const styles = {
    info: {
      background: '#eff6ff',
      borderLeft: `4px solid ${COLORS.info}`,
      color: '#0369a1'
    },
    warning: {
      background: '#fffbeb',
      borderLeft: `4px solid ${COLORS.warning}`,
      color: '#b45309'
    },
    danger: {
      background: '#fee2e2',
      borderLeft: `4px solid ${COLORS.danger}`,
      color: '#b91c1c'
    }
  };

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '❌'
  };

  return (
    <div style={{
      ...styles[type],
      padding: '1rem 1.25rem',
      margin: '1.25rem 0',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem'
    }}>
      <div style={{ fontSize: '1.25rem', marginTop: '0.1rem' }}>{icons[type]}</div>
      <div style={{ lineHeight: '1.7' }}>{children}</div>
    </div>
  );
};

// 图片组件
const ImageViewer = ({ src, alt, style }) => {
  return (
    <div style={{
      ...style,
      textAlign: 'center',
      margin: '1.5rem 0',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        padding: '0.75rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: `1px solid ${COLORS.border}`,
        maxWidth: '100%'
      }}>
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: '600px',
            borderRadius: '4px'
          }}
        />
        <div style={{
          marginTop: '0.75rem',
          fontSize: '0.9rem',
          color: COLORS.secondary,
          fontStyle: 'italic'
        }}>
          {alt}
        </div>
      </div>
    </div>
  );
};

// 代码框组件（使用LLaMAFactory风格主题）
const CodeBlock = ({ language, children }) => {
  const [buttonText, setButtonText] = useState('复制代码');
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleCopy = () => {
    // 复制代码到剪贴板
    navigator.clipboard.writeText(children.trim())
      .then(() => {
        setButtonText('已复制');
        setCopied(true);

        // 清除之前的定时器
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // 3秒后恢复按钮文本
        timeoutRef.current = setTimeout(() => {
          setButtonText('复制代码');
          setCopied(false);
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

  // 语言名称映射表，让显示更友好
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
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {/* 固定的代码头部 */}
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
        zIndex: 10,
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
      {/* 可滚动的代码内容 */}
      <div style={{
        maxHeight: '500px',
        overflow: 'auto'
      }}>
        <pre style={{ margin: 0 }}>
          <code style={{
            padding: '1.25rem',
            display: 'block',
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: '#e2e8f0',
          }}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

const Deploying_vLLM_on_Local_CPU = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 代码内容
  const installCondaCode = `# 下载Anaconda安装包
wget -P download_dir https://repo.anaconda.com/archive/Anaconda3-2021.05-Linux-x86_64.sh

# 进入下载目录
cd /mnt/c/Users/dbb/Downloads/download_dir

# 执行安装脚本
bash Anaconda3-2021.05-Linux-x86_64.sh

# 创建vllm环境
conda create -n vllm python=3.12 -y`;

  const installCompilerCode = `sudo apt-get update  -y

sudo apt-get install -y --no-install-recommends ccache git curl wget ca-certificates gcc-12 g++-12 libtcmalloc-minimal4 libnuma-dev ffmpeg libsm6 libxext6 libgl1 jq lsof

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 10 --slave /usr/bin/g++ g++ /usr/bin/g++-12`;

  const buildVllmCode = `# 克隆vLLM项目
git clone https://github.com/vllm-project/vllm.git vllm_source
cd vllm_source

# 升级pip并安装依赖
pip install --upgrade pip
pip install -v -r requirements/cpu-build.txt --extra-index-url https://download.pytorch.org/whl/cpu
pip install -v -r requirements/cpu.txt --extra-index-url https://download.pytorch.org/whl/cpu

# 构建并安装CPU后端
VLLM_TARGET_DEVICE=cpu python setup.py install`;

  const dockerCommandsCode = `
# 拉取镜像
docker pull public.ecr.aws/q9t5s3a7/vllm-cpu-release-repo:v0.10.0.0

# 查看本地镜像
docker images

# 重命名镜像
docker tag public.ecr.aws/q9t5s3a7/vllm-cpu-release-repo:v0.10.0 vllm:latest`;

  const downloadModelCode = `# 克隆Qwen2-0.5B-Instruct模型
git clone https://www.modelscope.cn/Qwen/Qwen2-0.5B-Instruct.git`;

  const startServerCode = `docker run --rm \
--privileged=true \
--shm-size=4g \
-p 8000:8000 \
-v /mnt/c/Users/dbb/modelscope/Qwen3-0.6B:/model \
vllm:latest \
--model=/model --dtype=bfloat16 --max-model-len=1024`;

  const clientRequestCode = `curl -s http://localhost:8000/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{"model":"/model","messages":[{"role":"user","content":"我的名字是"}]}' \
| jq -r '.choices[0].message.content'`;

  const inferenceCode = `# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
from vllm import LLM, SamplingParams

# 测试提示词
prompts = [
    "请介绍一下人工智能的应用领域",
    "写一首关于秋天的短诗"
]

# 创建采样参数
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)

def main():
    # 初始化LLM
    llm = LLM(model="/mnt/c/Users/dbb/modelscope/Qwen2-0.5B-Instruct")
    
    # 生成文本
    outputs = llm.generate(prompts, sampling_params)

    # 打印输出结果
    print("\\nGenerated Outputs:\\
n" + "-" * 60)
    for output in outputs:
        prompt = output.prompt
        generated_text = output.outputs[0].text
        print(f"Prompt:    {prompt!r}")
        print(f"Output:    {generated_text!r}")
        print("-" * 60)

if __name__ == "__main__":
    main()`;

  const dockerMirrorConfigCode = `# 配置Docker镜像加速
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker`;

  return (
    <DocLayout title="本地CPU部署vLLM">
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 1.5rem',
        color: COLORS.body,
        lineHeight: '1.8'
      }}>

        <div style={{
          background: '#f8fafc',
          borderLeft: `4px solid ${COLORS.accent}`,
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          borderRadius: '0 6px 6px 0',
        }}>
          <p style={{
            lineHeight: '1.7',
            fontSize: '1.05rem',
            color: '#334155',
            margin: 0
          }}>
            本文档详细介绍基于LLaMA-Factory进行大模型（以Qwen2.5为例）微调的完整流程，包括环境准备、微调操作、模型合并与部署等步骤，适合初学者快速上手。
          </p>
        </div>

        {/* 章节标题样式增强 */}
        <h3 style={{
          margin: '2rem 0 1.25rem 0',
          color: COLORS.primary,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.4rem',
          fontWeight: '600'
        }}>1. 安装conda</h3>
        <p style={{ marginBottom: '1.25rem' }}>
          使用conda创建独立的Python环境，避免依赖冲突。
        </p>

        <Collapsible title="1.1 下载并安装Anaconda">
          <p>通过命令行下载Anaconda并创建vllm专用环境：</p>
          <CodeBlock language="bash">
{installCondaCode}
          </CodeBlock>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250804164734123.png"
            alt="安装conda的命令执行界面"
          />
        </Collapsible>

        <Collapsible title="1.2 查看conda版本和环境">
          <p>安装完成后可通过相应命令验证conda安装状态及已创建的环境：</p>
          <CodeBlock language="bash">
# 查看conda版本
conda --version

# 查看所有环境
conda env list

# 激活vllm环境
conda activate vllm
          </CodeBlock>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250804150943985.png"
            alt="查看conda环境的命令输出结果"
          />
        </Collapsible>

        {/* 增强的分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        <h3 style={{
          margin: '2rem 0 1.25rem 0',
          color: COLORS.primary,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.4rem',
          fontWeight: '600'
        }}>2. 从源代码构建Wheel</h3>
        <p style={{ marginBottom: '1.25rem' }}>
          通过源码编译方式安装vLLM的CPU版本，需要先安装必要的编译工具。
        </p>

        <Collapsible title="2.1 安装推荐的编译器">
          <p>安装vLLM编译所需的系统工具和编译器：</p>
          <CodeBlock language="bash">
{installCompilerCode}
          </CodeBlock>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250804170630836.png"
            alt="安装编译器的过程"
          />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250804170640615.png"
            alt="编译器安装完成的界面"
          />
        </Collapsible>

        <Collapsible title="2.2 克隆vLLM项目并构建">
          <TipBox type="warning">
            <strong>注意：</strong>构建过程可能需要较长时间，取决于CPU性能和网络状况，建议在稳定网络环境下进行。
          </TipBox>
          <p>克隆vLLM源码并编译安装CPU版本：</p>
          <CodeBlock language="bash">
{buildVllmCode}
          </CodeBlock>

          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250804170707933.png"
            alt="克隆vLLM项目的命令执行结果"
          />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250804170831966.png"
            alt="安装依赖包的过程"
          />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250804171925018.png"
            alt="构建vLLM完成的界面"
          />
        </Collapsible>

        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        <h3 style={{
          margin: '2rem 0 1.25rem 0',
          color: COLORS.primary,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.4rem',
          fontWeight: '600'
        }}>3. 使用预构建的镜像</h3>
        <p style={{ marginBottom: '1.25rem' }}>
          如果不想从源码编译，可以直接使用预构建的Docker镜像，简化安装流程。
        </p>

        <Collapsible title="3.1 Docker镜像操作">
          <p>拉取并重命名vLLM CPU版本镜像：</p>
          <CodeBlock language="bash">
{dockerCommandsCode}
          </CodeBlock>

          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805100545745.png"
            alt="拉取镜像中的进度显示"
          />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805133558014.png"
            alt="镜像拉取完成的提示"
          />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805140751687.png"
            alt="查看本地镜像列表"
          />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805151234827.png"
            alt="镜像重命名后的显示"
          />
          <TipBox type="info">
            <p>若Docker拉取速度慢，可配置国内镜像源加速：</p>
            <CodeBlock language="bash">
{dockerMirrorConfigCode}
            </CodeBlock>
          </TipBox>
        </Collapsible>

        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        <h3 style={{
          margin: '2rem 0 1.25rem 0',
          color: COLORS.primary,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.4rem',
          fontWeight: '600'
        }}>4. 模型下载</h3>

        <p style={{ marginBottom: '1.25rem' }}>
          下载Qwen2-0.5B-Instruct模型到本地目录，用于后续部署和推理。
        </p>

        <Collapsible title="4.1 下载Qwen2模型">
          <p>通过modelscope或git克隆方式获取模型文件：</p>
          <CodeBlock language="bash">
{downloadModelCode}
          </CodeBlock>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805141757953.png"
            alt="下载模型的过程"
          />
            <p>模型较大（约1GB），下载时间取决于网络速度。也可使用modelscope工具下载：</p>
            <CodeBlock language="bash">
pip install modelscope
modelscope download --model Qwen/Qwen2-0.5B-Instruct --local_dir ./Qwen2-0.5B-Instruct
            </CodeBlock>
        </Collapsible>

        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        <h3 style={{
          margin: '2rem 0 1.25rem 0',
          color: COLORS.primary,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.4rem',
          fontWeight: '600'
        }}>5. 运行镜像</h3>

        <p style={{ marginBottom: '1.25rem' }}>
          部署流程分为服务端启动和客户端请求两部分，下面详细介绍操作步骤。
        </p>

        <Collapsible title="5.1 开启服务端">
          <p>启动vLLM服务并加载指定模型：</p>
          <CodeBlock language="bash">
{startServerCode}
          </CodeBlock>
          <p>参数说明：</p>
          <ul style={{ margin: '1rem 0 1rem 1.5rem', lineHeight: '1.8' }}>
            <li><code style={{
              background: `${COLORS.light}`,
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
              color: COLORS.primary,
              fontSize: '0.9rem'
            }}>--shm-size=4g</code>：设置共享内存大小</li>
            <li><code style={{
              background: `${COLORS.light}`,
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
              color: COLORS.primary,
              fontSize: '0.9rem'
            }}>-p 8000:8000</code>：端口映射</li>
            <li><code style={{
              background: `${COLORS.light}`,
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
              color: COLORS.primary,
              fontSize: '0.9rem'
            }}>-v</code>：将本地模型目录挂载到容器内</li>

            <li><code style={{
              background: `${COLORS.light}`,
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
              color: COLORS.primary,
              fontSize: '0.9rem'
            }}>--dtype=bfloat16</code>：指定数据类型</li>
          </ul>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805151529067.png"
            alt="启动服务端的命令和输出"
          />
        </Collapsible>

        <Collapsible title="5.2 启动客户端">
          <p>通过curl命令发送请求测试服务：</p>
          <CodeBlock language="bash">
{clientRequestCode}
          </CodeBlock>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805151622701.png"
            alt="客户端请求及返回结果"
          />
        </Collapsible>

        <Collapsible title="5.3 结果分析">
          <p>服务端会显示处理性能指标，可用于评估系统性能：</p>
          <ul style={{ margin: '1rem 0 1rem 1.5rem', lineHeight: '1.8' }}>
            <li><code style={{
              background: `${COLORS.light}`,
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
              color: COLORS.primary,
              fontSize: '0.9rem'
            }}>Avg prompt throughput</code>：提示词处理平均速度（tokens/s）</li>

            <li><code style={{
              background: `${COLORS.light}`,
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
              color: COLORS.primary,
              fontSize: '0.9rem'
            }}>Avg generation throughput</code>：文本生成平均速度（tokens/s）</li>
          </ul>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805151835984.png"
            alt="服务端性能指标展示"
          />
        </Collapsible>

        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        <h3 style={{
          margin: '2rem 0 1.25rem 0',
          color: COLORS.primary,
          borderLeft: `4px solid ${COLORS.primary}`,
          paddingLeft: '0.75rem',
          fontSize: '1.4rem',
          fontWeight: '600'
        }}>6. 使用模型推理</h3>
        <p style={{ marginBottom: '1.25rem' }}>
          通过Python代码进行离线推理，无需启动独立服务器，适合开发和测试场景。
        </p>

        <Collapsible title="6.1 Python推理代码">
          <p>使用vLLM的LLM类加载模型，支持批量处理提示词：</p>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805153312450.png"
            alt="LLM类的说明文档截图"
          />

          <CodeBlock language="python">
{inferenceCode}
          </CodeBlock>
          <p>运行结果：</p>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805141708844.png"
            alt="推理执行过程的命令行输出"
          />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805141947293.png"
            alt="初始推理结果展示"
          />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805142633563.png"
            alt="修改样例后推理结果展示"
          />
          <TipBox type="info">
            <p>可根据需要调整采样参数控制输出随机性：</p>
            <ul style={{ margin: '0.5rem 0 0 1.5rem', lineHeight: '1.8' }}>
              <li><code style={{
                background: `${COLORS.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: COLORS.info,
                fontSize: '0.9rem'
              }}>temperature</code>：温度参数，值越大输出越随机（0-1）</li>
              <li><code style={{
                background: `${COLORS.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: COLORS.info,
                fontSize: '0.9rem'
              }}>top_p</code>：核采样参数，控制输出多样性（0-1）</li>
            </ul>
          </TipBox>

        </Collapsible>
      </div>
    </DocLayout>
  );
};

export default Deploying_vLLM_on_Local_CPU;