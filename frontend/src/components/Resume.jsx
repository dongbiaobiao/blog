import React, { useEffect, useRef } from 'react';

const Resume = () => {
  const skillBarsRef = useRef([]);
  const skillPercentagesRef = useRef([]);

  // 技能条动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const bar = skillBarsRef.current[index];
            const percentage = skillPercentagesRef.current[index];
            const targetPercent = bar.dataset.percent;

            setTimeout(() => {
              bar.style.width = targetPercent;
              percentage.innerText = targetPercent;
            }, 300);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillBarsRef.current.forEach((bar) => {
      if (bar) observer.observe(bar);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="resume" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-4 text-gray-800">个人简历</h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">记录我的教育背景、工作经历和专业技能，展现我的成长历程</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 左侧：个人信息 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm sticky top-24 hover:shadow-md transition-all">
              <div className="text-center mb-6">
                <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md">
                  <img src="https://picsum.photos/200/200?random=2" alt="个人照片" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">开发者</h3>
                <p className="text-indigo-600">全栈工程师</p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: 'fa-envelope-o', title: '邮箱', content: 'developer@example.com' },
                  { icon: 'fa-phone', title: '电话', content: '138-xxxx-xxxx' },
                  { icon: 'fa-map-marker', title: '地址', content: '北京市海淀区' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <i className={`fa ${item.icon} text-indigo-600 mt-1 group-hover:scale-110 transition-transform`}></i>
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-gray-600">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-6 border-gray-200" />

              {/* 专业技能 */}
              <div>
                <h4 className="font-bold mb-4 text-gray-800">专业技能</h4>
                <div className="space-y-4">
                  {[
                    { name: '前端开发', percent: '90%', color: 'bg-indigo-600' },
                    { name: '后端开发', percent: '75%', color: 'bg-purple-600' },
                    { name: '数据库', percent: '80%', color: 'bg-blue-500' },
                    { name: '移动开发', percent: '60%', color: 'bg-teal-500' }
                  ].map((skill, index) => (
                    <div key={index} className="skill-progress">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{skill.name}</span>
                        <span ref={el => skillPercentagesRef.current[index] = el} className="text-gray-600 skill-percentage">0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          ref={el => skillBarsRef.current[index] = el}
                          className={`skill-bar ${skill.color} h-2 rounded-full`}
                          data-percent={skill.percent}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* 语言能力 */}
              <div>
                <h4 className="font-bold mb-4 text-gray-800">语言能力</h4>
                <div className="space-y-4">
                  {[
                    { name: '中文', percent: '100%', color: 'bg-red-500' },
                    { name: '英语', percent: '85%', color: 'bg-blue-500' }
                  ].map((lang, index) => (
                    <div key={index} className="skill-progress">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{lang.name}</span>
                        <span
                          ref={el => skillPercentagesRef.current[4 + index] = el}
                          className="text-gray-600 skill-percentage"
                        >
                          0%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          ref={el => skillBarsRef.current[4 + index] = el}
                          className={`skill-bar ${lang.color} h-2 rounded-full`}
                          data-percent={lang.percent}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="resume.pdf"
                download="我的简历.pdf"
                className="mt-8 inline-block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center rounded-lg hover:opacity-90 transition-all group"
              >
                <i className="fa fa-download mr-2 group-hover:translate-x-[-2px] transition-transform"></i>
                下载简历 PDF
              </a>
            </div>
          </div>

          {/* 右侧：教育和工作经历 */}
          <div className="lg:col-span-2 space-y-10">
            {/* 教育背景 */}
            <div className="section-animate">
              <h3 className="text-2xl font-bold mb-6 flex items-center group">
                <i className="fa fa-graduation-cap text-indigo-600 mr-3 group-hover:rotate-6 transition-transform"></i>
                教育背景
              </h3>
              <div className="space-y-6">
                {/* 硕士教育背景 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all border-l-4 border-indigo-600">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-800">计算机科学与技术</h4>
                    <span className="text-indigo-600 font-medium">2022.09 - 2025.06</span>
                  </div>
                  <p className="text-gray-600 mb-3">中北大学 - 硕士</p>
                  <p className="text-gray-700">研究方向：移动机器人路径规划。</p>
                  <p className="mt-2 text-gray-700">GPA：3.8/4.0，获得校级优秀毕业生称号。</p>
                </div>

                {/* 本科教育背景 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all border-l-4 border-purple-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-800">物联网工程</h4>
                    <span className="text-purple-600 font-medium">2018.09 - 2022.06</span>
                  </div>
                  <p className="text-gray-600 mb-3">中北大学 - 本科</p>
                  <p className="text-gray-700">主修课程：数据结构、操作系统、计算机网络等。</p>
                  <p className="mt-2 text-gray-700">GPA：3.6/4.0，多次获得校级奖学金。</p>
                </div>
              </div>
            </div>

            {/* 工作经历 */}
            <div className="section-animate">
              <h3 className="text-2xl font-bold mb-6 flex items-center group">
                <i className="fa fa-briefcase text-indigo-600 mr-3 group-hover:rotate-6 transition-transform"></i>
                工作经历
              </h3>
              <div className="space-y-6">
                {/* 中航电测 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all border-l-4 border-blue-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-gray-800">中航电测仪器（西安）有限公司</h4>
                        <span className="text-primary font-medium mt-2 md:mt-0">2025.07 - 至今</span>
                    </div>

                    <p className="text-gray-600 mb-5 flex items-center">
                        <i className="fa fa-building-o mr-2 opacity-70"></i>
                        大模型调优工程师
                    </p>

                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="font-semibold text-gray-800 mb-2">项目名称：企业级大模型应用与系统性能优化</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            项目背景：针对工业测量领域专业需求，构建并调优行业大模型，开发配套应用系统，提升测量数据分析效率与智能化水平，支撑企业数字化转型。
                        </p>
                    </div>

                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                            <span>负责公司核心产品的前后端开发与维护，使用React和Node.js技术栈，保障系统稳定运行与功能迭代。</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                            <span>优化现有系统架构，通过代码重构与算法改进，提升系统性能30%，减少服务器负载25%，降低运维成本。</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                            <span>参与制定前端开发规范与大模型调优流程，统一技术标准，提高团队协作效率40%，减少代码冲突与维护成本。</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                            <span>主导3个重要项目的开发，包括需求分析、技术选型与团队协调，确保项目按时交付率100%，用户满意度达95%以上。</span>
                        </li>
                    </ul>
                </div>

                {/* 网易实习 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all border-l-4 border-green-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-800">网易（杭州）网络有限公司</h4>
                    <span className="text-primary font-medium mt-2 md:mt-0">2024.10 - 2025.03</span>
                  </div>

                  <p className="text-gray-600 mb-5 flex items-center">
                    <i className="fa fa-building-o mr-2 opacity-70"></i>
                    机器人算法实习生
                  </p>

                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-semibold text-gray-800 mb-2">项目名称：智能交通多智能体协同仿真与轨迹预测系统开发</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      项目背景：本项目基于V2V通信技术，通过轨迹预测与智能提醒，提供对有人车的预警和无人车的智能避障。系统实时交换车辆数据，预测轨迹并评估碰撞风险，从而为有人车提供预警，对无人车进行智能避障，确保交通安全与效率。
                    </p>
                  </div>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">仿真平台搭建：</span>
                      <span>基于 Carla 平台构建含十字路口、三岔路口、环岛的混合交通系统，支持行人、摩托车、汽车等参与者及 GNSS、IMU 传感器，实现多智能体协同交通流仿真。</span>
                    </div>
                  </li>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">基于阿克曼模型的改进EKF算法：</span>
                      <span>融合阿克曼模型与改进 EKF 算法，以前轮转角 (±0.5°) 和车速为输入，通过运动学方程完成位姿估计；在 Carla 中 1s 内横向 FDE 达 0.4m（较原模型降 43.5%），单帧处理仅 10.2ms。</span>
                    </div>
                  </li>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">基于MANTRA模型的多模态轨迹预测系统：</span>
                      <span>采用 MANTRA 模型结合地图信息实现多模态轨迹预测：自建数据集（含十字路口等场景）中 4s 内 FDE≤2.0m，部署 Carla 后端到端推理耗时 80ms，支持复杂场景实时预测。</span>
                    </div>
                  </li>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">数据采集与系统接口标准化：</span>
                      <span>构建含十字路口、三岔路口、环岛的交通数据集（超 60 万条轨迹），实现轨迹预测算法与 Carla 解耦，提供真实环境部署接口。</span>
                    </div>
                  </li>
                </div>

                {/* 联启实习 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all border-l-4 border-green-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-800">山西联启科技有限公司</h4>
                      <span className="text-primary font-medium mt-2 md:mt-0">2021.12 - 2022.01</span>
                  </div>

                  <p className="text-gray-600 mb-5 flex items-center">
                      <i className="fa fa-building-o mr-2 opacity-70"></i>
                      前端开发实习生
                  </p>

                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="font-semibold text-gray-800 mb-2">项目名称：企业官网改版与内部管理系统前端开发</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                          项目背景：构建一款在线购物平台，实现商品展示、搜索、购物车等关键功能模块，并于后端进行数据交互，优化动态加载，提升用户体验。
                      </p>
                  </div>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">商品浏览与购物车功能开发：</span>
                      <span>使用HTML5、CSS3、JavaScript开发商品浏览和购物车功能，优化页面响应速度和用户体验，并支持商品操作与数据同步。</span>
                    </div>
                  </li>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">用户账户管理与数据安全：</span>
                      <span>实现用户注册、登录功能，通过Oracle数据库保证用户数据一致性。</span>
                    </div>
                  </li>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">数据交互与动态加载优化：</span>
                      <span>与后端Oracle数据库进行搞笑数据交互，使用WebBuilder优化动态加载，提升页面加载速度与响应性能。</span>
                    </div>
                  </li>
                </div>
              </div>
            </div>
            {/* 竞赛经历 */}
            <div className="section-animate">
              <h3 className="text-2xl font-bold mb-6 flex items-center group">
                <i className="fa fa-briefcase text-indigo-600 mr-3 group-hover:rotate-6 transition-transform"></i>
                竞赛经历
              </h3>
              <div className="space-y-6">
                {/* 百度Apollo城市道路自动驾驶 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all border-l-4 border-blue-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-gray-800">中国机器人及人工智能大赛</h4>
                        <span className="text-primary font-medium mt-2 md:mt-0">2024.05 - 2024.09</span>
                    </div>

                    <p className="text-gray-600 mb-5 flex items-center">
                        <i className="fa fa-building-o mr-2 opacity-70"></i>
                        百度Apollo城市道路自动驾驶
                    </p>

                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="font-semibold text-gray-800 mb-2 text-base">项目背景:</span>
                        <span className="text-base text-gray-600 leading-relaxed">
                            该项目为百度Apollo城市道路自动驾驶赛项中的PNC(Planning and Control)赛项，致力于研究和开发自动驾驶算法，确保自动驾驶车辆能够在复杂的城市道路中，进行实时决策和精确控制。
                        </span>
                    </div>

                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start flex-wrap">
                          <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800">交通场景分析与决策策略制定：</span>
                            <span>针对城市道路中的各种交通场景(如交叉路口、行人、非机动车等)，制定灵活的驾驶策略和决策，确保车辆在动态变化的环境中能做出精确反应。</span>
                          </div>
                        </li>

                        <li className="flex items-start flex-wrap">
                          <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800">实时行驶行为控制：</span>
                            <span>在实时决策的基础上，控制车辆的行驶行为，包括避障、跟车、加速度等，确保车辆能够在复杂路况下高效、安全地完成预定任务。</span>
                          </div>
                        </li>

                        <li className="flex items-start flex-wrap">
                          <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800">仿真平台调试与优化：</span>
                            <span>在实时决策的基础上，控制车辆的行驶行为，包括避障、跟车、加速度等，确保车辆能够在复杂路况下高效、安全地完成预定任务。</span>
                          </div>
                        </li>
                    </ul>
                </div>

                {/* 网易实习 */}
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all border-l-4 border-green-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-800">网易（杭州）网络有限公司</h4>
                    <span className="text-primary font-medium mt-2 md:mt-0">2024.10 - 2025.03</span>
                  </div>

                  <p className="text-gray-600 mb-5 flex items-center">
                    <i className="fa fa-building-o mr-2 opacity-70"></i>
                    机器人算法实习生
                  </p>

                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-semibold text-gray-800 mb-2">项目名称：智能交通多智能体协同仿真与轨迹预测系统开发</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      项目背景：本项目基于V2V通信技术，通过轨迹预测与智能提醒，提供对有人车的预警和无人车的智能避障。系统实时交换车辆数据，预测轨迹并评估碰撞风险，从而为有人车提供预警，对无人车进行智能避障，确保交通安全与效率。
                    </p>
                  </div>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">仿真平台搭建：</span>
                      <span>基于 Carla 平台构建含十字路口、三岔路口、环岛的混合交通系统，支持行人、摩托车、汽车等参与者及 GNSS、IMU 传感器，实现多智能体协同交通流仿真。</span>
                    </div>
                  </li>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">基于阿克曼模型的改进EKF算法：</span>
                      <span>融合阿克曼模型与改进 EKF 算法，以前轮转角 (±0.5°) 和车速为输入，通过运动学方程完成位姿估计；在 Carla 中 1s 内横向 FDE 达 0.4m（较原模型降 43.5%），单帧处理仅 10.2ms。</span>
                    </div>
                  </li>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">基于MANTRA模型的多模态轨迹预测系统：</span>
                      <span>采用 MANTRA 模型结合地图信息实现多模态轨迹预测：自建数据集（含十字路口等场景）中 4s 内 FDE≤2.0m，部署 Carla 后端到端推理耗时 80ms，支持复杂场景实时预测。</span>
                    </div>
                  </li>

                  <li className="flex items-start flex-wrap">
                    <span className="text-primary mr-2 mt-1"><i className="fa fa-check-circle-o"></i></span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">数据采集与系统接口标准化：</span>
                      <span>构建含十字路口、三岔路口、环岛的交通数据集（超 60 万条轨迹），实现轨迹预测算法与 Carla 解耦，提供真实环境部署接口。</span>
                    </div>
                  </li>
                </div>

              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
