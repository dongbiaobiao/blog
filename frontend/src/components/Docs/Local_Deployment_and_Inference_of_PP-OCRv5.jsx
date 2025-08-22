import React, { useState, useRef, useEffect } from 'react';
import DocLayout from '../DocLayout';
import { docs } from '../StudyDocs';
// 导入通用UI配置（删除组件内硬编码的COLORS）
import uiConfig from './json/uiConfig.json';

// 文档专属常量（与文档强绑定，不放入通用UI配置）
const DOC_TITLE = "OCR本地部署与PP-OCRv5推理实践";
const TARGET_DOC_TITLE = "OCR本地部署与PP-OCRv5推理实践";
const HEADINGS = [
  "进入conda环境",
  "1. 安装PaddlePaddle 3.0",
  "2. 安装paddleocr",
  "3. 下载PaddleOCR项目",
  "4. PP-OCRv5推理测试",
  "5. 模型部署"
];

// 新增：统一ID生成函数，与DocLayout保持一致
const generateHeadingId = (headingText) => {
  return headingText.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

// 显示文档最后更新时间的组件（UI参数来自uiConfig）
const LastUpdatedTime = () => {
  const ocrDoc = docs.find(doc => doc.title === TARGET_DOC_TITLE);
  const lastUpdated = ocrDoc ? ocrDoc.lastUpdated : '未知';

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
      color: uiConfig.colors.secondary,
      fontSize: '0.9rem',
      marginBottom: '1.5rem',
      fontStyle: 'italic',
      padding: '0.5rem 0',
      borderBottom: `1px solid ${uiConfig.colors.border}`
    }}>
      最后更新时间：{formatDate(lastUpdated)}
    </div>
  );
};

// 折叠面板组件（UI参数来自uiConfig）
const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div style={{
      margin: uiConfig.dimensions.collapsibleMargin,
      border: `1px solid ${uiConfig.colors.border}`,
      borderRadius: uiConfig.dimensions.codeBlockBorderRadius,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }}>
      <div
        style={{
          padding: uiConfig.dimensions.collapsibleHeaderPadding,
          background: uiConfig.colors.light,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: '600',
          color: uiConfig.colors.heading,
          borderRadius: `${uiConfig.dimensions.codeBlockBorderRadius} ${uiConfig.dimensions.codeBlockBorderRadius} 0 0`,
          transition: 'background 0.2s ease'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
        onMouseOut={(e) => e.currentTarget.style.background = uiConfig.colors.light}
      >
        <span>{title}</span>
        <span style={{
          transition: 'transform 0.3s ease',
          color: uiConfig.colors.primary,
          fontWeight: 'bold'
        }}>
          {isOpen ? uiConfig.controls.collapsibleIcons.open : uiConfig.controls.collapsibleIcons.close}
        </span>
      </div>
      <div
        style={{
          maxHeight: isOpen ? uiConfig.controls.collapsibleMaxHeightOpen : uiConfig.controls.collapsibleMaxHeightClose,
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
          borderTop: isOpen ? `1px solid ${uiConfig.colors.border}` : 'none'
        }}
      >
        <div style={{
          padding: uiConfig.dimensions.collapsibleContentPadding,
          backgroundColor: 'white'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// 提示框组件（UI参数来自uiConfig）
const TipBox = ({ type = 'info', children }) => {
  const styles = {
    info: {
      background: '#eff6ff',
      borderLeft: `4px solid ${uiConfig.colors.info}`,
      color: '#0369a1'
    },
    warning: {
      background: '#fffbeb',
      borderLeft: `4px solid ${uiConfig.colors.warning}`,
      color: '#b45309'
    },
    danger: {
      background: '#fee2e2',
      borderLeft: `4px solid ${uiConfig.colors.danger}`,
      color: '#b91c1c'
    }
  };

  return (
    <div style={{
      ...styles[type],
      padding: uiConfig.dimensions.tipBoxPadding,
      margin: uiConfig.dimensions.tipBoxMargin,
      borderRadius: uiConfig.dimensions.codeBlockBorderRadius,
      display: 'flex',
      alignItems: 'flex-start',
      gap: uiConfig.dimensions.tipBoxGap
    }}>
      <div style={{
        fontSize: '1.25rem',
        marginTop: '0.1rem'
      }}>{uiConfig.controls.tipBoxIcons[type]}</div>
      <div style={{
        lineHeight: '1.7',
        color: styles[type].color
      }}>{children}</div>
    </div>
  );
};

// 图片组件（UI参数来自uiConfig）
const ImageViewer = ({ src, alt, style = {} }) => {
  return (
    <div style={{
      ...style,
      textAlign: 'center',
      margin: uiConfig.dimensions.imageViewerMargin,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        padding: uiConfig.dimensions.imageViewerPadding,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: `1px solid ${uiConfig.colors.border}`,
        maxWidth: '100%'
      }}>
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: uiConfig.dimensions.imageViewerMaxHeight,
            borderRadius: '4px'
          }}
        />
        <div style={{
          marginTop: uiConfig.dimensions.imageViewerPadding,
          fontSize: '0.9rem',
          color: uiConfig.colors.secondary,
          fontStyle: 'italic'
        }}>
          {alt}
        </div>
      </div>
    </div>
  );
};

// 代码框组件（UI参数来自uiConfig，带复制功能）
const CodeBlock = ({ language, children }) => {
  const [buttonText, setButtonText] = useState(uiConfig.controls.copyButtonTexts.default);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleCopy = () => {
    // 复制代码到剪贴板
    navigator.clipboard.writeText(children.trim())
      .then(() => {
        setButtonText(uiConfig.controls.copyButtonTexts.copied);
        setCopied(true);

        // 清除之前的定时器
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // 3秒后恢复按钮文本
        timeoutRef.current = setTimeout(() => {
          setButtonText(uiConfig.controls.copyButtonTexts.default);
          setCopied(false);
        }, uiConfig.controls.copyTimeout);
      })
      .catch(err => {
        console.error('复制失败:', err);
        setButtonText(uiConfig.controls.copyButtonTexts.failed);
        setTimeout(() => setButtonText(uiConfig.controls.copyButtonTexts.default), uiConfig.controls.failedTimeout);
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
      backgroundColor: uiConfig.colors.codeBg,
      borderRadius: uiConfig.dimensions.codeBlockBorderRadius,
      margin: uiConfig.dimensions.codeBlockMargin,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {/* 固定的代码头部 */}
      <div style={{
        padding: uiConfig.dimensions.codeHeaderPadding,
        fontSize: uiConfig.dimensions.codeHeaderFontSize,
        color: uiConfig.colors.codeText,
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
          {uiConfig.controls.languageMap[language] || language}
        </span>
        <button
          style={{
            background: copied ? uiConfig.colors.success : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: uiConfig.dimensions.codeBlockBorderRadius,
            padding: uiConfig.dimensions.copyButtonPadding,
            cursor: 'pointer',
            fontSize: uiConfig.dimensions.copyButtonFontSize,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: uiConfig.dimensions.copyButtonGap
          }}
          onClick={handleCopy}
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{buttonText}</span>
        </button>
      </div>
      {/* 可滚动的代码内容 */}
      <div style={{
        maxHeight: uiConfig.controls.codeMaxHeight,
        overflow: 'auto'
      }}>
        <pre style={{ margin: 0 }}>
          <code style={{
            padding: uiConfig.dimensions.codeContentPadding,
            display: 'block',
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: uiConfig.dimensions.codeContentFontSize,
            lineHeight: uiConfig.dimensions.codeContentLineHeight,
            color: uiConfig.colors.codeText,
          }}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

const Local_Deployment_and_Inference_of_PPOCRv5 = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: uiConfig.controls.scrollBehavior });
  }, []);

  return (
    <DocLayout title={DOC_TITLE} headings={HEADINGS}>
      <div style={{
        maxWidth: uiConfig.dimensions.containerMaxWidth,
        margin: '0 auto',
        padding: uiConfig.dimensions.containerPadding,
        color: uiConfig.colors.body,
        lineHeight: '1.8'
      }}>
        {/* 介绍性提示框 */}
        <div style={{
          background: '#f8fafc',
          borderLeft: `4px solid ${uiConfig.colors.accent}`,
          padding: uiConfig.dimensions.tipBoxPadding,
          marginBottom: '2rem',
          borderRadius: `0 ${uiConfig.dimensions.codeBlockBorderRadius} ${uiConfig.dimensions.codeBlockBorderRadius} 0`,
        }}>
          <p style={{
            lineHeight: '1.7',
            fontSize: '1.05rem',
            color: '#334155',
            margin: 0
          }}>
            本文详细介绍了在本地环境中通过 conda 创建环境，安装 PaddlePaddle 3.0 和 PaddleOCR，下载 PaddleOCR 项目并进行 PP-OCRv5 模型的命令行与 Python 脚本推理测试相关步骤。
          </p>
        </div>

        {/*<LastUpdatedTime />*/}

        {/* 进入conda环境 */}
        <h3
          id={generateHeadingId("进入conda环境")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >进入conda环境</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          首先激活之前创建的conda环境：
        </p>

        <Collapsible title="激活conda环境">
          <CodeBlock language="bash">
conda activate dbb
          </CodeBlock>
          <ImageViewer
            src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250813090044996.png"
            alt="图1：激活conda环境的命令行界面"
          />
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 1. 安装PaddlePaddle 3.0 */}
        <h3
          id={generateHeadingId("1. 安装PaddlePaddle 3.0")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >1 安装PaddlePaddle 3.0</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          在conda环境中，使用以下命令安装GPU版本的PaddlePaddle（PP-OCR依赖3.0及以上版本）：
        </p>

        <Collapsible title="安装GPU版本PaddlePaddle">
          <CodeBlock language="bash">
python -m pip install paddlepaddle-gpu==3.0.0 -i https://www.paddlepaddle.org.cn/packages/stable/cu118/
          </CodeBlock>
            <p style={{ margin: `${uiConfig.dimensions.paragraphMarginBottom} 0` }}>如果您的环境没有GPU，可以安装CPU版本：</p>
            <CodeBlock language="bash">
python -m pip install paddlepaddle==3.0.0 -i https://www.paddlepaddle.org.cn/packages/stable/cpu/
            </CodeBlock>
          <ImageViewer
            src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812083400731.png"
            alt="图2：PaddlePaddle安装过程"
          />
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 2. 安装paddleocr */}
        <h3
          id={generateHeadingId("2. 安装paddleocr")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >2 安装paddleocr</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          使用pip安装paddleocr包：
        </p>

        <Collapsible title="安装paddleocr包">
          <CodeBlock language="bash">
pip install paddleocr
          </CodeBlock>
          <ImageViewer
            src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812083631046.png"
            alt="图3：paddleocr安装过程"
          />
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 3. 下载PaddleOCR项目 */}
        <h3
          id={generateHeadingId("3. 下载PaddleOCR项目")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >3 下载PaddleOCR项目</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          克隆PaddleOCR项目代码库并安装相关依赖：
        </p>

        <Collapsible title="克隆项目代码库">
          <CodeBlock language="bash">
git clone https://github.com/PaddlePaddle/PaddleOCR.git
          </CodeBlock>
          <ImageViewer
            src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812091108194.png"
            alt="图4：克隆PaddleOCR项目到本地"
          />
        </Collapsible>

        <Collapsible title="安装项目依赖">
          <CodeBlock language="bash">
pip install -r requirements.txt
          </CodeBlock>
          <ImageViewer
            src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812091030772.png"
            alt="图5：安装PaddleOCR项目依赖"
          />
        </Collapsible>

        <Collapsible title="创建输出目录">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>进入PaddleOCR目录并创建output目录用于保存结果：</p>
          <ImageViewer
            src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250814170458350.png"
            alt="图6：创建output目录用于存储识别结果"
          />
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 4. PP-OCRv5推理测试 */}
        <h3
          id={generateHeadingId("4. PP-OCRv5推理测试")}
          style={{
            margin: uiConfig.dimensions.headingMargin,
            color: uiConfig.colors.primary,
            borderLeft: `4px solid ${uiConfig.colors.primary}`,
            paddingLeft: uiConfig.dimensions.headingPaddingLeft,
            fontSize: uiConfig.dimensions.headingFontSizeH3,
            fontWeight: '600'
          }}
        >4 PP-OCRv5推理测试</h3>
        <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
          PP-OCRv5是PP-OCR新一代文字识别解决方案，聚焦于多场景、多文字类型的文字识别。
          支持简体中文、中文拼音、繁体中文、英文、日文5大主流文字类型，
          升级了中英复杂手写体、竖排文本、生僻字等多种挑战性场景的识别能力。
          在内部多场景复杂评估集上，PP-OCRv5较PP-OCRv4端到端提升13个百分点。
        </p>

        <h4 style={{
          margin: '1.5rem 0 1rem 0',
          color: uiConfig.colors.heading,
          fontSize: uiConfig.dimensions.headingFontSizeH4,
          fontWeight: '600'
        }}>4.1 命令行方式</h4>

        <Collapsible title="4.1.1 参数介绍">
          <CodeBlock language="bash">
# 默认使用 PP-OCRv5 模型
paddleocr ocr -i https://paddle-model-ecology.bj.bcebos.com/paddlex/imgs/demo_image/general_ocr_002.png \
--use_doc_orientation_classify False \
--use_doc_unwarping False \
--use_textline_orientation False \
--save_path ./output \
--device gpu:0
          </CodeBlock>

          <ul style={{
            margin: uiConfig.dimensions.listMargin,
            lineHeight: '1.8'
          }}>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>paddleocr ocr</code>：启动 PaddleOCR 的文字识别功能（检测 + 识别）
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>-i [URL]</code>：指定输入图片（可以是在线示例图，也可替换为本地路径）
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>--use_doc_orientation_classify False</code>：关闭文档方向检测（适合无旋转图片）
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>--use_doc_unwarping False</code>：关闭文档弯曲矫正（适合平整图片）
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>--use_textline_orientation False</code>：关闭文本行方向检测（适合横向文字）
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>--save_path ./output</code>：识别结果（标注图 + 文本）保存到<code>./output</code>目录
            </li>
            <li>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>--device gpu:0</code>：使用第 0 号 GPU 运行（需 GPU 环境，无 GPU 可改为<code>cpu</code>）
            </li>
          </ul>

          <ImageViewer
            src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812085753627.png"
            alt="图7：命令行推理参数说明"
          />
        </Collapsible>

        <Collapsible title="4.1.2 运行结果">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>命令行输出结果示例：</p>
          <CodeBlock language="bash">
{`{'res': {'input_path': '/home/ubuntu/.paddlex/predict_input/general_ocr_002.png', 'page_index': None, 'model_settings': {'use_doc_preprocessor': True, 'use_textline_orientation': False}, 'doc_preprocessor_res': {'input_path': None, 'page_index': None, 'model_settings': {'use_doc_orientation_classify': False, 'use_doc_unwarping': False}, 'angle': -1}, 'dt_polys': array([[[152,  22],
        ...,
        [153,  77]],
	   ...,

       [[ 99, 455],
        ...,
        [ 99, 480]]], shape=(33, 4, 2), dtype=int16), 'text_det_params': {'limit_side_len': 64, 'limit_type': 'min', 'thresh': 0.3, 'max_side_limit': 4000, 'box_thresh': 0.6, 'unclip_ratio': 1.5}, 'text_type': 'general', 'textline_orientation_angles': array([-1, ..., -1], shape=(33,)), 'text_rec_score_thresh': 0.0, 'rec_texts': ['登机牌', 'BOARDING', 'PASS',期DATE', '舱位', 'CLASS', '序号', 'SERIALNO.', '座位号', 'SEAT NO.', '航班FLIGHT', 'MU 2379 03DEC', 'W', '035', '始发地', 'FROM', '登机口', 'GATE', '登机时间', 'BDT', '目的地TO', 'N', 'G11', 'FUZHOU', '身份识别IDNO.', '姓名NAME', 'ZHANGQIWEI', '票号TKTNO.', '张祺伟', '票价FARE', 'ETKT7813699238489/1', '登机口于起飞前1O分钟关闭GATESCLOSE1OMINUTESBEFORE DEPART array([0.9971115 , ..., 0.97326761], shape=(33,)), 'rec_polys': array([[[152,  22],
        ...,
        [153,  77]],

       ...,

       [[ 99, 455],
        ...,
        [ 99, 480]]], shape=(33, 4, 2), dtype=int16), 'rec_boxes': array([[152, ...,  77],
       ...,
       [ 99, ..., 480]], shape=(33, 4), dtype=int16)}}`}
          </CodeBlock>

          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>
            若指定了<code style={{
              background: `${uiConfig.colors.light}`,
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
              color: uiConfig.colors.primary,
              fontSize: '0.9rem'
            }}>save_path</code>，则会保存可视化结果在该目录下：
          </p>
          <ImageViewer
            src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812085825736.png"
            alt="图8：OCR识别结果可视化示例"
          />

          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>其他图片识别效果：</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: uiConfig.dimensions.gridGap,
            margin: '1rem 0'
          }}>
            <ImageViewer
              src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812091912328.png"
              alt="图9：不同场景OCR识别效果示例1"
              style={{ margin: 0 }}
            />
            <ImageViewer
              src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812092256505.png"
              alt="图10：不同场景OCR识别效果示例2"
              style={{ margin: 0 }}
            />
            <ImageViewer
              src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812092654160.png"
              alt="图11：不同场景OCR识别效果示例3"
              style={{ margin: 0 }}
            />
            <ImageViewer
              src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250812092750097.png"
              alt="图12：不同场景OCR识别效果示例4"
              style={{ margin: 0 }}
            />
          </div>
        </Collapsible>

        <h4 style={{
          margin: '1.5rem 0 1rem 0',
          color: uiConfig.colors.heading,
          fontSize: uiConfig.dimensions.headingFontSizeH4,
          fontWeight: '600'
        }}>4.2 Python脚本文件</h4>

        <Collapsible title="4.2.1 参数介绍">
          <CodeBlock language="python">
# Initialize PaddleOCR instance
from paddleocr import PaddleOCR
ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False)

# Run OCR inference on a sample image
result = ocr.predict(
    input="/home/ubuntu/dbb/OCR/PaddleOCR/tests/test_files/table.jpg")

# Visualize the results and save the JSON results
for res in result:
    res.print()
    res.save_to_img("output")
    res.save_to_json("output")
          </CodeBlock>

          <ul style={{
            margin: uiConfig.dimensions.listMargin,
            lineHeight: '1.8'
          }}>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>use_doc_orientation_classify=False</code>：不启用文档方向分类（不自动判断文档旋转角度）
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>use_doc_unwarping=False</code>：不启用文档矫正（不对弯曲文档进行平整处理）
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>use_textline_orientation=False</code>：不启用文本行方向检测（不单独判断每行文字的旋转角度）
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>input="..."</code>：指定待识别的图片路径
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>res.print()</code>：在控制台打印识别结果
            </li>
            <li style={{ marginBottom: uiConfig.dimensions.listItemMarginBottom }}>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>res.save_to_img("output")</code>：将标注识别结果的图片保存到output目录
            </li>
            <li>
              <code style={{
                background: `${uiConfig.colors.light}`,
                padding: '0.15rem 0.35rem',
                borderRadius: '3px',
                color: uiConfig.colors.primary,
                fontSize: '0.9rem'
              }}>res.save_to_json("output")</code>：将识别结果以JSON格式保存到output目录
            </li>
          </ul>
        </Collapsible>

        <Collapsible title="4.2.2 运行结果">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>脚本输出结果示例：</p>
          <CodeBlock language="bash">
{`{'res': {'input_path': '/home/ubuntu/dbb/OCR/PaddleOCR/tests/test_files/table.jpg', 'page_index': None, 'model_settings': {'use_doc_preprocessor': True, 'use_textline_orientation': False}, 'doc_preprocessor_res': {'input_path': None, 'page_index': None, 'model_settings': {'use_doc_orientation_classify': False, 'use_doc_unwarping': False}, 'angle': -1}, 'dt_polys': array([[[235,   6],
        ...,
        [235,  25]],
        ...,
        [[446, 100],
        ...,
        [446, 122]]], shape=(12, 4, 2), dtype=int16), 'text_det_params': {'limit_side_len': 64, 'limit_type': 'min', 'thresh': 0.3, 'max_side_limit': 4000, 'box_thresh': 0.6, 'unclip_ratio': 1.5}, 'text_type': 'general', 'textline_orientation_angles': array([-1, ..., -1], shape=(12,)), 'text_rec_score_thresh': 0.0, 'rec_texts': ['CRuncover', 'Dres', '连续工作 '取出来放在网上，没想', '江、鳌江等八大', 'Abstr', 'rSrivi', '$709.', 'cludingGiv', '2.72', 'Ingcubic', '$744.78'], 'rec_scores': array([0.99867278, ..., 0.99815047], shape=(12,))ray([[[235,   6],
        ...,
    	[235,  25]],
    	...,

   		[[446, 100],
   	 	...,
    	[446, 122]]], shape=(12, 4, 2), dtype=int16), 'rec_boxes': array([[235, ...,  25],
   		...,
   		[446, ..., 122]], shape=(12, 4), dtype=int16)}}`}
          </CodeBlock>

          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>可视化结果：</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: uiConfig.dimensions.gridGap,
            margin: '1rem 0'
          }}>
            <ImageViewer
              src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250813085450520.png"
              alt="图13：Python脚本识别结果示例1"
              style={{ margin: 0 }}
            />
            <ImageViewer
              src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250813085635513.png"
              alt="图14：Python脚本识别结果示例2"
              style={{ margin: 0 }}
            />
            <ImageViewer
              src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250813085746262.png"
              alt="图15：Python脚本识别结果示例3"
              style={{ margin: 0 }}
            />
          </div>
        </Collapsible>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${uiConfig.colors.border}, transparent)`,
          margin: uiConfig.dimensions.separatorMargin
        }}></div>

        {/* 5 模型部署 */}
        <h3 style={{
          margin: uiConfig.dimensions.headingMargin,
          color: uiConfig.colors.primary,
          borderLeft: `4px solid ${uiConfig.colors.primary}`,
          paddingLeft: uiConfig.dimensions.headingPaddingLeft,
          fontSize: uiConfig.dimensions.headingFontSizeH3,
          fontWeight: '600'
        }}>5 模型部署</h3>

        <Collapsible title="5.1 模型转换成ONNX">
          <p style={{ marginBottom: uiConfig.dimensions.paragraphMarginBottom }}>安装paddle2onnx工具用于模型转换：</p>
          <CodeBlock language="bash">
paddlex --install paddle2onnx
          </CodeBlock>
          <TipBox type="info">
            ONNX格式的模型可以在多种框架中运行，包括TensorFlow、PyTorch等，便于跨平台部署。
          </TipBox>
          <ImageViewer
            src="/Fig/Local_Deployment_and_Inference_of_PP-OCRv5/image-20250813090518611.png"
            alt="图16：安装paddle2onnx工具过程"
          />
        </Collapsible>
      </div>
    </DocLayout>
  );
};

export default Local_Deployment_and_Inference_of_PPOCRv5;