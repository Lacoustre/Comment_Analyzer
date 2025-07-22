import React from 'react';
import { Brain, Mail, Phone, MapPin, Twitter, Github, Linkedin, Shield, Zap, Users } from 'lucide-react';

export default function CommentAnalyzerFooter() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 cursor-pointer">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Comment Analyzer</h3>
                  <p className="text-xs sm:text-sm text-blue-400">AI Content Analysis</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                Advanced AI-powered platform for real-time content moderation and toxicity detection, helping create safer digital spaces.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="p-1.5 sm:p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-all duration-300 hover:scale-110 group">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="p-1.5 sm:p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-110 group">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="p-1.5 sm:p-2 bg-gray-800 hover:bg-blue-700 rounded-lg transition-all duration-300 hover:scale-110 group">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* How it Works Section */}
            <div id="how-it-works">
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white flex items-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                How it Works
              </h4>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-400 text-xs sm:text-sm font-semibold">1</span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                    Enter your text content in our analyzer
                  </p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-400 text-xs sm:text-sm font-semibold">2</span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                    AI processes content using advanced models
                  </p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-400 text-xs sm:text-sm font-semibold">3</span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                    Receive detailed toxicity analysis results
                  </p>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div id="footer-features">
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white flex items-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                Features
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center space-x-2 text-xs sm:text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Real-time Analysis</span>
                </li>
                <li className="flex items-center space-x-2 text-xs sm:text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Multi-language Support</span>
                </li>
                <li className="flex items-center space-x-2 text-xs sm:text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>API Integration</span>
                </li>
                <li className="flex items-center space-x-2 text-xs sm:text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Privacy Protection</span>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div id="contact">
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                Get in Touch
              </h4>
              <div className="space-y-3 sm:space-y-4">
                <a href="mailto:info@commentanalyzer.com" className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
                  <div className="p-1.5 sm:p-2 bg-gray-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm md:text-base text-gray-300 hover:text-blue-400 transition-colors font-medium">
                      rabbiperez007@gmail.com
                    </span>
                    <p className="text-xs text-gray-500">General inquiries</p>
                  </div>
                </a>
                
                <a href="tel:+1-800-555-1234" className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
                  <div className="p-1.5 sm:p-2 bg-gray-800 rounded-lg group-hover:bg-green-600 transition-colors">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">+233550861566</span>
                    <p className="text-xs text-gray-500">Support hotline</p>
                  </div>
                </a>

                <a href="https://maps.google.com/?q=San+Francisco,CA" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
                  <div className="p-1.5 sm:p-2 bg-gray-800 rounded-lg group-hover:bg-purple-600 transition-colors">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm md:text-base text-gray-300 font-medium">Ashanti Region</span>
                    <p className="text-xs text-gray-500">Kumasi, Ghana</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <div className="flex items-center space-x-6 cursor-pointer">
                <p className="text-xs sm:text-sm text-gray-400">
                  © {new Date().getFullYear()} Comment Analyzer. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
