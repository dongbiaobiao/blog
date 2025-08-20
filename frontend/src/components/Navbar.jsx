import React, { useState } from 'react';

const Navbar = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 导航项配置：统一管理导航文本和对应目标ID，确保与各模块ID匹配
  const navItems = [
    { label: '首页', target: 'home' },
    { label: '简历', target: 'resume' },
    { label: '学习文档', target: 'study-docs' },
    { label: '未来规划', target: 'future-plan' },
    { label: 'GitHub', target: 'github-projects' },
    { label: '联系我', target: 'gitalk-container' }
  ];

  return (
    <header
      id="navbar"
      className={`fixed w-full ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-br from-indigo-500/90 to-purple-400/90 backdrop-blur-sm shadow-sm py-4'
      } z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="/#home" className="text-2xl font-bold flex items-center gap-2 group">
            <i className={`fa fa-code transition-transform duration-300 group-hover:rotate-12 ${scrolled ? 'text-indigo-600' : 'text-white'}`}></i>
            <span className={scrolled ? 'text-gray-800' : 'text-white'}>技术博客</span>
          </a>

          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={`/#${item.target}`}
                className={`font-medium transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:transition-all hover:after:w-full 
                  ${
                    scrolled 
                      ? 'text-gray-700 hover:text-indigo-600 after:bg-indigo-600' 
                      : 'text-white/90 hover:text-white after:bg-white'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 移动端菜单按钮 */}
          <button
            id="menu-toggle"
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
          >
            <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl ${scrolled ? 'text-gray-800' : 'text-white'}`}></i>
          </button>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'block' : 'hidden'
        } ${scrolled ? 'bg-white border-t border-gray-100' : 'bg-indigo-600'}`}
      >
        <div className="container mx-auto px-4 py-3 space-y-3">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={`/#${item.target}`}
              className={`block py-2 font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white/90 hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;