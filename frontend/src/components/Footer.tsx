import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#0f172a]/50 to-[#1e293b]/50 backdrop-blur-xl border-t border-white/10 mt-auto relative z-10">
      <div className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold text-white">
                Intervue.ai
              </span>
            </div>
            <p className="text-base text-gray-400 max-w-md mb-6">
              Master your technical interviews with AI-powered mock interviews. Practice, improve, and land your dream job.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a
                href="mailto:intervuedotai@gmail.com"
                className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                <Mail className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/interview"
                  className="text-base text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Start Interview
                </Link>
              </li>
              <li>
                <Link
                  to="/sessions"
                  className="text-base text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Session History
                </Link>
              </li>
              <li>
                <Link
                  to="/developers"
                  className="text-base text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Developers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="mailto:intervuedotai@gmail.com"
                  className="text-base text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Intervue.ai. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Powered by Gemini 1.5 AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}