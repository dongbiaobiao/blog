import React, { useEffect, useRef } from 'react';

const Home = () => {
  const countersRef = useRef([]);
  const introTextRef = useRef(null);
  const actionButtonsRef = useRef(null);

  // 数字增长动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            let count = 0;
            const updateCount = () => {
              const increment = target / 30;
              if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 50);
              } else {
                counter.innerText = target;
              }
            };
            updateCount();
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    countersRef.current.forEach((counter) => {
      if (counter) observer.observe(counter);
    });

    // 文字渐入动画
    setTimeout(() => {
      if (introTextRef.current) {
        introTextRef.current.classList.add('opacity-100', 'transition-opacity', 'duration-1000');
      }
      setTimeout(() => {
        if (actionButtonsRef.current) {
          actionButtonsRef.current.classList.add('opacity-100', 'transition-opacity', 'duration-1000');
        }
      }, 300);
    }, 300);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="pt-28 pb-20 md:pt-36 md:pb-32 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left animate-fade-in">
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-shadow mb-6">
              你好，我是<span className="text-indigo-600 relative inline-block group">
                开发者
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-purple-500 rounded-full transform scale-x-0 transition-transform origin-left duration-300 group-hover:scale-x-100"></span>
              </span>
            </h1>
            <p
              ref={introTextRef}
              className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0 opacity-0"
            >
              热衷于技术探索与创新，这里记录了我的学习历程、项目经验和未来规划。欢迎交流与指导！
            </p>
            <div
              ref={actionButtonsRef}
              className="flex flex-wrap gap-4 justify-center md:justify-start opacity-0"
            >
              <a href="/#resume" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200/50 transition-all flex items-center gap-2 group">
                <i className="fa fa-file-text-o group-hover:rotate-6 transition-transform"></i>
                <span>查看简历</span>
              </a>
              <a href="/#github-projects" className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 shadow-lg hover:shadow-gray-200/50 transition-all flex items-center gap-2 group">
                <i className="fa fa-github group-hover:rotate-6 transition-transform"></i>
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl hover:shadow-indigo-200/50 transition-all">
                <img src="https://picsum.photos/400/400?random=1" alt="个人头像" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105">
                <p className="font-bold">持续学习中</p>
              </div>
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { value: 24, label: '完成项目', color: 'from-blue-500 to-indigo-500' },
            { value: 48, label: '学习文档', color: 'from-purple-500 to-pink-500' },
            { value: 16, label: '掌握技能', color: 'from-green-500 to-teal-500' },
            { value: 72, label: 'GitHub仓库', color: 'from-yellow-500 to-orange-500' }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
              <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r ${item.color}`}>
                <p
                  ref={el => countersRef.current[index] = el}
                  className="text-2xl font-bold text-white counter"
                  data-target={item.value}
                >
                  0
                </p>
              </div>
              <p className="text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
