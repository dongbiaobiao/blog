import React, { useState } from 'react';

const Navbar = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      id="navbar"
      className={`fixed w-full ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-r from-indigo-500/90 to-purple-600/90 backdrop-blur-sm shadow-sm py-4'
      } z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="#home" className="text-2xl font-bold flex items-center gap-2 group">
            <i className={`fa fa-code transition-transform duration-300 group-hover:rotate-12 ${scrolled ? 'text-indigo-600' : 'text-white'}`}></i>
            <span className={scrolled ? 'text-gray-800' : 'text-white'}>技术博客</span>
          </a>

          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-8">
            {['首页', '简历', '学习文档', '未来规划', 'GitHub', '联系我'].map((item, index) => (
              <a
                key={index}
                href={`#${['home', 'resume', 'studies', 'plans', 'github', 'contact'][index]}`}
                className={`font-medium transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:transition-all hover:after:w-full ${
                  scrolled 
                    ? 'text-gray-700 hover:text-indigo-600 after:bg-indigo-600' 
                    : 'text-white/90 hover:text-white after:bg-white'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* 移动端菜单按钮 */}
          <button
            id="menu-toggle"
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl ${scrolled ? 'text-gray-800' : 'text-white'}`}></i>
          </button>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <div
        id="mobile-menu"
        className={`md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'block' : 'hidden'
        } ${scrolled ? 'bg-white border-t border-gray-100' : 'bg-indigo-600'}`}
      >
        <div className="container mx-auto px-4 py-3 space-y-3">
          {['首页', '简历', '学习文档', '未来规划', 'GitHub', '联系我'].map((item, index) => (
            <a
              key={index}
              href={`#${['home', 'resume', 'studies', 'plans', 'github', 'contact'][index]}`}
              className={`block py-2 font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white/90 hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
