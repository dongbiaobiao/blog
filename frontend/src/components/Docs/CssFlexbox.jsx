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

  return (
    <DocLayout title="模型微调">
      <h2>模型微调</h2>
      <hr />

      <h3>1 环境安装</h3>

      <h4>1.1 创建环境(Python=3.10)</h4>
      <pre><code>conda create -n dbb python=3.10</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250806101510729.png" alt="创建环境" style={{ zoom: '50%' }} /></p>

      <h4>1.2 查看现有环境</h4>
      <pre><code>conda env list</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250806101848068.png" alt="查看环境" style={{ zoom: '67%' }} /></p>

      <h4>1.3 激活环境</h4>
      <pre><code>conda activate dbb</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250806102551208.png" alt="激活环境" style={{ zoom: '50%' }} /></p>

      <h4>1.4 安装PyTorch</h4>
      <pre><code>conda install pytorch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 pytorch-cuda=12.4 -c pytorch -c nvidia</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250806102412614.png" alt="安装PyTorch" style={{ zoom: '33%' }} /></p>

      <h4>1.5 安装Transformers库</h4>
      <pre><code>pip install transformers==4.49.0 -i https://pypi.tuna.tsinghua.edu.cn/simple</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250806102726326.png" alt="安装Transformers" style={{ zoom: '33%' }} /></p>

      <h4>1.6 验证GPU可用性</h4>
      <p>运行以下Python代码验证GPU是否可用：</p>
      <pre><code>import torch
print(torch.cuda.is_available())  # 显示True表示GPU可用
print(torch.cuda.device_count())  # 显示可用GPU数量</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807082619025.png" alt="验证GPU" style={{ zoom: '67%' }} /></p>

      <h4>1.7 下载LLaMA-Factory代码</h4>
      <h5>1.7.1 克隆LLaMA-Factory仓库到本地</h5>
      <pre><code>git clone https://github.com/hiyouga/LLaMA-Factory.git</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807082817978.png" alt="克隆仓库" style={{ zoom: '50%' }} /></p>

      <h5>1.7.2 安装依赖</h5>
      <p>进入代码根目录，安装相关依赖：</p>
      <pre><code>cd /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory
pip install -e ".[torch,metrics]"</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807083021130.png" alt="安装依赖" style={{ zoom: '33%' }} /></p>

      <h4>1.8 下载微调模型</h4>
      <pre><code>pip install modelscope</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807083100914.png" alt="安装modelscope" style={{ zoom: '33%' }} /></p>

      <p>将模型下载到指定目录（以qwen14B为例，模型保存路径local_dir根据实际情况进行修改）：</p>
      <pre><code>modelscope download --model Qwen/Qwen2.5-14B-Instruct --local_dir '/data/models/Qwen2.5-14B-Instruct'</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807083150963.png" alt="下载模型" style={{ zoom: '33%' }} /></p>

      <hr />

      <h3>2 模型微调</h3>

      <h4>2.1 手动编写脚本</h4>
      <p>LLaMA-Factory提供了示例配置文件，位于<code>examples/train_lora</code>目录下。可参考<code>llama3_lora_sft.yaml</code>编写自定义配置文件，如<code>qwen7b_lora_sft.yaml</code>。</p>

      <pre><code>### model
model_name_or_path: /data/models/Qwen2.5-7B-Instruct
trust_remote_code: true

### method
stage: sft
do_train: true
finetuning_type: lora
lora_rank: 8
lora_target: all

### dataset
dataset: identity,alpaca_en_demo
template: qwen
cutoff_len: 2048
max_samples: 1000
overwrite_cache: true
preprocessing_num_workers: 16
dataloader_num_workers: 4

### output
output_dir: /data/models/dbb-qwen2.5-7b-sft
logging_steps: 10
save_steps: 500
plot_loss: true
overwrite_output_dir: true
save_only_model: false

### train
per_device_train_batch_size: 1
gradient_accumulation_steps: 8
learning_rate: 1.0e-4
num_train_epochs: 3.0
lr_scheduler_type: cosine
warmup_ratio: 0.1
bf16: true
ddp_timeout: 180000000
resume_from_checkpoint: null</code></pre>

      <p>在LLaMA-Factory目录下运行llamafactory-cli指令</p>
      <pre><code>cd /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory</code></pre>

      <p>若服务器有多张显卡，可通过以下命令指定使用的显卡：</p>
      <pre><code>CUDA_VISIBLE_DEVICES=7</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807084523649.png" alt="指定显卡" /></p>

      <p>运行llamafactory-cli指令</p>
      <pre><code>llamafactory-cli train examples/train_lora/qwen7b_lora_sft.yaml</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807083931060.png" alt="运行训练指令" style={{ zoom: '33%' }} /></p>

      <p>训练完成</p>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807085035490.png" alt="训练完成" /></p>

      <h4>2.2 可视化界面操作</h4>
      <p>在LLaMA-Factory根目录运行以下命令启动Web服务：</p>
      <pre><code>llamafactory-cli webui</code></pre>

      <p>启动后，可通过浏览器访问<code>http://10.10.20.119:7860</code>进行可视化参数配置。</p>

      <p>若服务器有多张显卡，可通过以下命令指定使用的显卡：</p>
      <pre><code>nvidia-smi</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807085846147.png" alt="查看显卡" /></p>

      <p>指定7860端口</p>
      <pre><code>CUDA_VISIBLE_DEVICES=1,2,7 GRADIO_SERVER_PORT=7860 llamafactory-cli webui</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807085755709.png" alt="指定端口" /></p>

      <p>启动后，可通过浏览器访问<code>http://10.10.20.119:7860</code>进行可视化参数配置。</p>

      <p><strong>若服务器有多张显卡，前面几张在跑的别大模型，可以指定后面的显卡，否则训练过程中使用前面的显卡可能会报显存不足</strong>。</p>

      <p>Web界面如下：</p>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807084646974.png" alt="Web界面" /></p>

      <p>主要配置参数包括：</p>
      <ol>
        <li>选择正确的模型名称和模型保存路径。</li>
        <li>选择训练类型：指令微调（SFT）或预训练微调（PreTraining）。</li>
        <li>选择数据集，并确保数据集格式与训练类型匹配。</li>
        <li>调整训练轮数，通常范围为3~30轮（每一轮会把完整样本跑一遍更新一次参数，若参数能够收敛，每一轮的损失率会下降）。</li>
      </ol>

      <p><img src="../../../public/Fig/CssFlexbox/image-20250807090153771.png" alt="配置参数" /></p>

      <p>页面最下面有“开始”按钮，点击“开始”即可训练，建议同时监控后台控制台，以便及时排查错误。</p>

      <h4>2.3 对话验证</h4>
      <h5>2.3.1 模型加载</h5>
      <p>对于大语言模型的验证，通常采用直接的问答方式进行测试。以下是模型加载和验证的步骤：</p>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250807090720965.png" alt="模型加载" /></p>
      <p>在LLaMA-Factory的可视化界面中，输入基础模型路径和微调后的检查点路径（即增量参数保存路径），然后加载模型。加载完成后，模型会占用显存，因此调试完成后需及时卸载模型以释放资源。</p>

      <hr />

      <h3>3 模型部署</h3>
      <p>Ollama支持部分模型在LoRA微调后直接导入，但目前尚不支持Qwen系列模型。因此，需要将LoRA参数合并到基础模型中，生成一个新的独立模型。</p>

      <h4>3.1 模型合并</h4>
      <p>模型合并操作与微调类似，可以通过可视化界面或编写YAML脚本完成。以下是具体步骤：</p>

      <h5>3.1.1 可视化界面操作</h5>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250808093621642.png" alt="导出界面" /></p>
      <p>上图是导出的操作界面，对于图中各步骤说明如下：</p>
      <ol>
        <li><strong>选择基础模型路径</strong>：在可视化界面中选择基础模型的路径。</li>
        <li><strong>选择检查点路径</strong>：选择微调后的增量参数保存路径（即检查点路径）。</li>
        <li><strong>加载模型并切换到导出页签</strong>：先在<code>Chat</code>页签加载模型，然后切换到<code>Export</code>页签准备合并导出。</li>
        <li><strong>选择导出设备</strong>：默认使用CPU，建议选择<code>auto</code>以自动使用GPU。</li>
        <li><strong>选择导出目录</strong>：指定合并后模型的导出目录。</li>
        <li><strong>开始导出</strong>：点击“开始导出”按钮，同时建议监控后台日志，以便及时处理可能的错误。</li>
      </ol>

      <h5>3.1.2 手动编写脚本</h5>
      <pre><code>llamafactory-cli export \
    --model_name_or_path path_to_base_model \
    --adapter_name_or_path path_to_adapter \
    --template qwen \
    --finetuning_type lora \
    --export_dir path_to_export \
    --export_size 2 \
    --export_legacy_format False</code></pre>

      <p>在本文档中，命令如下：</p>
      <p>合并模型保存在<code>/home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory/output</code>中</p>
      <pre><code>llamafactory-cli export \
    --model_name_or_path /data/models/Qwen2.5-7B-Instruct \
    --adapter_name_or_path /data/models/dbb-qwen2.5-7b-sft/checkpoint-135 \
    --template qwen \
    --finetuning_type lora \
    --export_dir /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory/output \
    --export_size 2 \
    --export_legacy_format False</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250808084127787.png" alt="模型合并" style={{ zoom: '33%' }} /></p>

      <h4>3.2 开启服务端</h4>
      <p>模型使用合并模型</p>
      <pre><code>vllm serve /home/ubuntu/dbb_LLaMA-Factory/LLaMA-Factory/output --host=127.0.0.1  --port=8089</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250808090524931.png" alt="开启服务端" style={{ zoom: '33%' }} /></p>

      <h4>3.3 开启客户端</h4>
      <pre><code>{`curl http://127.0.0.1:8089/v1/completions   -H "Content-Type: application/json"   -d '{"prompt": "hi", "max_tokens": 7, "temperature": 0}'`}</code></pre>
      <p><img src="../../../public/Fig/CssFlexbox/image-20250808090749766.png" alt="开启客户端" style={{ zoom: '33%' }} /></p>
    </DocLayout>
  );
};

export default CssFlexbox;
