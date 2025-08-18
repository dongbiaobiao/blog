import React from 'react';

const FuturePlan = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        {/* 标题区域，设置标题下边框和标题文字颜色等，和按键主色呼应 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative ">
            未来规划
            <span className="block w-12 h-2 bg-indigo-600 rounded mx-auto mt-2"></span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            技术之路永无止境，这是我的短期和长期学习与发展计划
          </p>
        </div>

        {/* 规划内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* 短期规划 */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-indigo-800 mb-4">
                短期规划 (6-12个月)
              </h3>
            </div>

            {/* 每个卡片设置和按键类似主色的背景、标题文字色等 */}
            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg md:text-xl font-semibold text-indigo-700 mb-3">
                深入学习TypeScript
              </h4>
              <p className="text-gray-600 leading-relaxed">
                掌握TypeScript高级特性，将现有项目逐步迁移到TypeScript，
                提高代码质量和可维护性。
              </p>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg md:text-xl font-semibold text-indigo-700 mb-3">
                学习React Native
              </h4>
              <p className="text-gray-600 leading-relaxed">
                掌握React Native跨平台开发技术，开发一个完整的移动应用，
                扩展技术广度。
              </p>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg md:text-xl font-semibold text-indigo-700 mb-3">
                云原生技术实践
              </h4>
              <p className="text-gray-600 leading-relaxed">
                学习Docker和Kubernetes，掌握容器化部署和微服务架构，
                提升DevOps技能。
              </p>
            </div>
          </div>

          {/* 长期规划 */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-indigo-800 mb-4">
                长期规划 (1-3年)
              </h3>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg md:text-xl font-semibold text-indigo-700 mb-3">
                AI技术与前端结合
              </h4>
              <p className="text-gray-600 leading-relaxed">
                研究AI技术在前端开发中的应用，学习TensorFlow.js，
                开发智能交互界面和应用。
              </p>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg md:text-xl font-semibold text-indigo-700 mb-3">
                技术领导力培养
              </h4>
              <p className="text-gray-600 leading-relaxed">
                提升技术团队管理能力，学习项目管理方法，
                带领团队完成更复杂的技术项目。
              </p>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg md:text-xl font-semibold text-indigo-700 mb-3">
                技术分享与沉淀
              </h4>
              <p className="text-gray-600 leading-relaxed">
                建立个人技术品牌，定期发表技术文章，
                参与技术社区分享，编写技术书籍。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FuturePlan;