import React, { useState, useRef, useEffect } from 'react';
import DocLayout from '../DocLayout';
import { docs } from '../StudyDocs';

// 新增：统一ID生成函数，与DocLayout保持一致
const generateHeadingId = (headingText) => {
  return headingText.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

// 主题颜色配置
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
  // 代码主题
  codeBg: '#1e293b',
  codeText: '#e2e8f0'
};

// 最后更新时间组件
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
          {Array.isArray(children) ? children : [children]}
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
      <div style={{ lineHeight: '1.7', whiteSpace: 'normal' }}>
        {typeof children === 'string' ? <span>{children}</span> : children}
      </div>
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
          loading="lazy"
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

// 代码框组件 - 修复版
const CodeBlock = ({ language, code }) => {
  const [buttonText, setButtonText] = useState('复制代码');
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleCopy = () => {
    // 确保处理的是字符串类型，避免trim错误
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
      backgroundColor: COLORS.codeBg,
      borderRadius: '6px',
      margin: '1rem 0 1.5rem 0',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      <div style={{
        padding: '0.85rem 1.25rem',
        fontSize: '0.85rem',
        color: COLORS.codeText,
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
            color: COLORS.codeText,
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

const Deploying_vLLM_on_Local_CPU = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 定义文章小标题列表（用于生成目录）
  const headings = [
    "1. 安装conda",
    "2. 从源代码构建Wheel",
    "3. 使用预构建的镜像",
    "4. 模型下载",
    "5. 模型推理-API调用推理",
    "6. 模型推理-Python代码推理"
  ];

  // 所有代码内容
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

  const dockerCommandsCode = `# 拉取镜像
docker pull public.ecr.aws/q9t5s3a7/vllm-cpu-release-repo:v0.10.0.0

# 查看本地镜像
docker images

# 重命名镜像
docker tag public.ecr.aws/q9t5s3a7/vllm-cpu-release-repo:v0.10.0 vllm:latest`;

  const downloadModelCode = `# 克隆Qwen2-0.5B-Instruct模型
git clone https://www.modelscope.cn/Qwen/Qwen2-0.5B-Instruct.git`;

  const startServerCode = `docker run --rm \\
--privileged=true \\
--shm-size=4g \\
-p 8000:8000 \\
-v /mnt/c/Users/dbb/modelscope/Qwen3-0.6B:/model \\
vllm:latest \\
--model=/model --dtype=bfloat16 --max-model-len=1024`;

  const clientRequestCode = `curl -s http://localhost:8000/v1/chat/completions \\
-H "Content-Type: application/json" \\
-d '{"model":"/model","messages":[{"role":"user","content":"我的名字是"}]}' \\
| jq -r '.choices[0].message.content'`;

  const inferenceCode = `# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: Copyright contributors to the vLLM project
from vllm import LLM, SamplingParams

# Sample prompts.
# prompts = [
#     "Hello, my name is",
#     "The president of the United States is",
#     "The capital of France is",
#     "The future of AI is",
# ]
prompts = [
    "请介绍一下人工智能的应用领域",
    "写一首关于秋天的短诗"
]

# Create a sampling params object.
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)

def main():
    # Create an LLM.
    # llm = LLM(model="facebook/opt-125m")
    llm = LLM(model="/mnt/c/Users/dbb/modelscope/Qwen2-0.5B-Instruct")
    # Generate texts from the prompts.
    # The output is a list of RequestOutput objects
    # that contain the prompt, generated text, and other information.
    outputs = llm.generate(prompts, sampling_params)

    # Print the outputs.
    print("\\nGenerated Outputs:\\n" + "-" * 60)
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
    // 将标题列表传递给DocLayout组件
    <DocLayout title="本地CPU部署vLLM" headings={headings}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 1.5rem',
        color: COLORS.body,
        lineHeight: '1.8',
        whiteSpace: 'normal'
      }}>

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
            本文档详细介绍了在本地 CPU 环境下，通过安装 conda、从源代码构建 Wheel 或使用预构建镜像的方式部署 vllm，下载 Qwen2-0.5B-Instruct 模型后运行镜像实现服务端与客户端交互及进行模型推理的过程。
          </p>
        </div>

        {/* 1. 安装conda - 新增id属性 */}
        <h3
          id={generateHeadingId("1. 安装conda")}
          style={{
            margin: '2rem 0 1.25rem 0',
            color: COLORS.primary,
            borderLeft: `4px solid ${COLORS.primary}`,
            paddingLeft: '0.75rem',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}
        >1. 安装conda</h3>
        <p style={{ marginBottom: '1.25rem', whiteSpace: 'normal' }}>
          使用conda创建独立的Python环境，避免依赖冲突。
        </p>

        <Collapsible title="1.1 下载并安装Anaconda">
          <p style={{ whiteSpace: 'normal' }}>通过命令行下载Anaconda并创建vllm专用环境：</p>
          <CodeBlock language="bash" code={installCondaCode} />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250804164734123.png"
            alt="安装conda的命令执行界面"
          />
        </Collapsible>

        <Collapsible title="1.2 查看conda版本和环境">
          <p style={{ whiteSpace: 'normal' }}>安装完成后可通过相应命令验证conda安装状态及已创建的环境：</p>
          <CodeBlock language="bash" code={`# 查看conda版本
conda --version

# 查看所有环境
conda env list

# 激活vllm环境
conda activate vllm`} />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250804150943985.png"
            alt="查看conda环境的命令输出结果"
          />
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        {/* 2. 从源代码构建Wheel - 新增id属性 */}
        <h3
          id={generateHeadingId("2. 从源代码构建Wheel")}
          style={{
            margin: '2rem 0 1.25rem 0',
            color: COLORS.primary,
            borderLeft: `4px solid ${COLORS.primary}`,
            paddingLeft: '0.75rem',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}
        >2. 从源代码构建Wheel</h3>
        <p style={{ marginBottom: '1.25rem', whiteSpace: 'normal' }}>
          通过源码编译方式安装vLLM的CPU版本，需要先安装必要的编译工具。
        </p>

        <Collapsible title="2.1 安装推荐的编译器">
          <p style={{ whiteSpace: 'normal' }}>安装vLLM编译所需的系统工具和编译器：</p>
          <CodeBlock language="bash" code={installCompilerCode} />
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
          <p style={{ whiteSpace: 'normal' }}>克隆vLLM源码并编译安装CPU版本：</p>
          <CodeBlock language="bash" code={buildVllmCode} />
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

        {/* 后续章节内容保持不变 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        {/* 3. 使用预构建的镜像 - 新增id属性 */}
        <h3
          id={generateHeadingId("3. 使用预构建的镜像")}
          style={{
            margin: '2rem 0 1.25rem 0',
            color: COLORS.primary,
            borderLeft: `4px solid ${COLORS.primary}`,
            paddingLeft: '0.75rem',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}
        >3. 使用预构建的镜像</h3>
        <p style={{ marginBottom: '1.25rem', whiteSpace: 'normal' }}>
          如果不想从源码编译，可以直接使用预构建的Docker镜像，简化安装流程。
        </p>

        <Collapsible title="3.1 Docker镜像操作">
          <p style={{ whiteSpace: 'normal' }}>拉取并重命名vLLM CPU版本镜像：</p>
          <CodeBlock language="bash" code={dockerCommandsCode} />
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
            <p style={{ whiteSpace: 'normal' }}>若Docker拉取速度慢，可配置国内镜像源加速：</p>
            <CodeBlock language="bash" code={dockerMirrorConfigCode} />
        </Collapsible>

        {/* 4. 模型下载 - 新增id属性 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        <h3
          id={generateHeadingId("4. 模型下载")}
          style={{
            margin: '2rem 0 1.25rem 0',
            color: COLORS.primary,
            borderLeft: `4px solid ${COLORS.primary}`,
            paddingLeft: '0.75rem',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}
        >4. 模型下载</h3>
        <p style={{ marginBottom: '1.25rem', whiteSpace: 'normal' }}>
          下载Qwen2-0.5B-Instruct模型到本地目录，用于后续部署和推理。
        </p>

        <Collapsible title="4.1 下载Qwen2模型">
          <p style={{ whiteSpace: 'normal' }}>通过modelscope或git克隆方式获取模型文件：</p>
          <CodeBlock language="bash" code={downloadModelCode} />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805141757953.png"
            alt="下载模型的过程"
          />
          <p style={{ whiteSpace: 'normal' }}>模型较大（约1GB），下载时间取决于网络速度。也可使用modelscope工具下载：</p>
          <CodeBlock language="bash" code={`pip install modelscope
modelscope download --model Qwen/Qwen2-0.5B-Instruct --local_dir ./Qwen2-0.5B-Instruct`} />
        </Collapsible>

        {/* 5. 模型推理-API调用推理 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        <h3
          id={generateHeadingId("5. 模型推理-API调用推理")}
          style={{
            margin: '2rem 0 1.25rem 0',
            color: COLORS.primary,
            borderLeft: `4px solid ${COLORS.primary}`,
            paddingLeft: '0.75rem',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}
        >5. 模型推理-API调用推理</h3>
        <p style={{ marginBottom: '1.25rem', whiteSpace: 'normal' }}>

          <TipBox type="info">
            <p style={{ whiteSpace: 'normal' }}>
              **工作流程**：<br/>
              1. 在5.1中，先运行第一条命令启动 vLLM 服务（服务器会一直运行等待请求）<br/>
              2. 在5.2中，再在另一个终端运行第二条命令发送提问（客户端请求）<br/>
              3. 服务器收到请求后，用加载的 Qwen 模型计算回答并返回<br/>
              4. 客户端接收并显示回答<br/>
            </p>
          </TipBox>

        </p>


        <Collapsible title="5.1 启动服务端">
          <p style={{ whiteSpace: 'normal' }}>使用Docker命令启动vLLM服务，映射模型目录和端口：</p>
          <CodeBlock language="bash" code={startServerCode} />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805151529067.png"
            alt="启动vLLM服务的命令输出"
          />
          <TipBox type="info">
            <p style={{ whiteSpace: 'normal' }}>
              --基于 vllm 的 CPU 镜像创建容器，加载 Qwen2-0.5B-Instruct 模型。<br />
              --shm-size=4g 参数用于设置共享内存大小，避免内存不足问题。<br />
              -p 8000:8000 将容器的8000端口映射到主机的8000端口。<br />
              -v 参数用于将本地模型目录挂载到容器中。
            </p>
          </TipBox>
        </Collapsible>

        <Collapsible title="5.2 启动客户端">
          <CodeBlock language="bash" code={`curl -s http://localhost:8000/v1/chat/completions   -H "Content-Type: application/json"   -d '{"model":"/model","messages":[{"role":"user","content":"我的名字是"}]}'   | jq -r
'.choices[0].message.content'`} />

          <TipBox type="info">
            <p style={{ whiteSpace: 'normal' }}>
              - 通过 HTTP POST 请求访问本地 8000 端口的 v1/chat/completions 接口。<br />
              - 发送 "我的名字是" 的提问给 AI 模型。<br />
              - 使用`jq`工具解析返回结果，提取并显示 AI 的回答内容。
            </p>
          </TipBox>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805151622701.png"
            alt="启动客户端"
          />
        </Collapsible>

        <Collapsible title="5.3 结果分析">

          <TipBox type="info">
            <p style={{ whiteSpace: 'normal' }}>
              - `Avg prompt throughput: 1.1 tokens/s`：提示词处理平均速度（每秒处理 1.1 个 token）。<br />
              - `Avg generation throughput: 10.7 tokens/s`：文本生成平均速度（每秒生成 10.7 个 token）。
            </p>
          </TipBox>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805151835984.png"
            alt="结果分析"
          />
        </Collapsible>

        {/* 6. 模型推理-Python代码推理 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          margin: '2rem 0'
        }}></div>

        <h3
          id={generateHeadingId("6. 模型推理-Python代码推理")}
          style={{
            margin: '2rem 0 1.25rem 0',
            color: COLORS.primary,
            borderLeft: `4px solid ${COLORS.primary}`,
            paddingLeft: '0.75rem',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}
        >6. 模型推理-Python代码推理</h3>
        <p style={{ marginBottom: '1.25rem', whiteSpace: 'normal' }}>
          `LLM`类提供了主要的 Python 接口，用于离线推理，即在不使用独立推理服务器的情况下与模型交互。
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805153312450.png"
            alt="Python 接口"
          />
        </p>

        <Collapsible title="使用Python代码推理">
          <p style={{ whiteSpace: 'normal' }}>使用vLLM的Python SDK进行模型推理，以basic.py为例：</p>
          <CodeBlock language="python" code={inferenceCode} />
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805141708844.png"
            alt="Python代码推理结果"
          />
          <p style={{ whiteSpace: 'normal' }}>结果分析：</p>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805141947293.png"
            alt="Python代码推理结果"
          />

          <TipBox type="info">
             <p style={{ whiteSpace: 'normal' }}>
              - 输入`"Hello, my name is"`，输出续写了名字和背景；<br />
              - 输入`"The capital of France is"`，输出中包含正确答案`"Paris"`。
            </p>
          </TipBox>

          <p style={{ whiteSpace: 'normal' }}>重新运行，修改测试样例:</p>
          <ImageViewer
            src="/Fig/Deploying_vLLM_on_Local_CPU/image-20250805142633563.png"
            alt="Python代码推理结果"
          />

          <TipBox type="info">
             <p style={{ whiteSpace: 'normal' }}>
              - 输入 “请介绍一下人工智能的应用领域”，输出开始列举多行业；<br />
              - 输入 “写一首关于秋天的短诗”，输出答案包含“主题”的诗句。
            </p>
          </TipBox>

        </Collapsible>

        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: '#f8fafc',
          borderRadius: '8px',
          border: `1px solid ${COLORS.border}`
        }}>
          <h4 style={{
            margin: '0 0 1rem 0',
            color: COLORS.heading,
            fontSize: '1.1rem'
          }}>总结</h4>
          <p style={{ margin: '0', whiteSpace: 'normal' }}>
            本文介绍了在本地CPU环境部署vLLM的两种方式：从源码构建和使用预构建镜像。通过conda管理环境，下载Qwen2-0.5B-Instruct模型后，可通过Docker快速启动服务，并通过API或Python代码进行推理。对于CPU环境，建议选择较小的模型以获得更好的性能。
          </p>
        </div>
      </div>
    </DocLayout>
  );
};

export default Deploying_vLLM_on_Local_CPU;