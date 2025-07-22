import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader,
  BarChart3,
  TrendingUp,
  Mic,
  Menu,
  X
} from 'lucide-react';
import Footer from './components/Footer';

export default function CommentAnalysis() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [microphoneSupported, setMicrophoneSupported] = useState(true);
  const [language, setLanguage] = useState('en-US');
  const [languageMismatch, setLanguageMismatch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const recognitionRef = useRef(null);

  const setupSpeechRecognition = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError('');
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onresult = (event) => {
          if (event.results && event.results[0]) {
            const transcript = event.results[0][0].transcript;
            setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onerror = (e) => {
          console.error('Speech recognition error', e);
          
          if (e.error === 'not-allowed') {
            setError('Microphone access denied. Please allow microphone access in your browser settings.');
            setMicrophoneSupported(false);
          } else if (e.error === 'no-speech') {
            setError('No speech detected. Please try again and speak clearly.');
          } else if (e.error === 'network') {
            setError('Network error occurred. Please check your connection.');
          } else {
            setError('Voice recognition error. Please try again.');
          }
          
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        console.warn('Speech Recognition not supported');
        setMicrophoneSupported(false);
      }
    } catch (err) {
      console.error('Speech recognition setup error:', err);
    }
  };
  
  useEffect(() => {
    document.title = 'Comment Analyzer';
    setupSpeechRecognition();
  }, []);
  
  useEffect(() => {
    if (recognitionRef.current) {
      setupSpeechRecognition();
    }
  }, [language]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.contains(event.target) && 
          !event.target.closest('[aria-label="Menu"]')) {
        setMobileMenuOpen(false);
      }
    };
    
    // Close menu when pressing escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setError('Could not start voice recognition. Please try again.');
      }
    } else if (!recognitionRef.current) {
      setError('Speech recognition is not available in your browser.');
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Failed to stop speech recognition:', err);
      }
    }
  };

  const analyzeText = async (text) => {
    setIsAnalyzing(true);
    setError('');
    setResults(null);
    setLanguageMismatch(false);

    try {
      const response = await fetch('https://server-v4bh.onrender.com/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, selectedLanguage: language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze text');
      }

      const analysisResult = await response.json();
      setResults(analysisResult);
      
      if (analysisResult.detectedLanguage) {
        const isEnglishSelected = language === 'en-US';
        const isEnglishDetected = analysisResult.detectedLanguage === 'English';
        const isTwiSelected = language === 'ak-GH';
        const isTwiDetected = analysisResult.detectedLanguage === 'Twi (Ghana)';
        
        // Disable language mismatch detection for smell-related phrases
        const lowerText = text.toLowerCase();
        if (lowerText.includes('smell') || lowerText.includes('bɔn') || lowerText.includes('nka')) {
          setLanguageMismatch(false);
        } else {
          // Standard language mismatch detection
          const shouldShowMismatch = (isEnglishSelected && !isEnglishDetected) || 
                                    (isTwiSelected && !isTwiDetected);
          
          setLanguageMismatch(shouldShowMismatch);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }
    analyzeText(inputText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (value) => {
    if (value > 70) return 'bg-red-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <a href="#" className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl group-hover:-translate-y-0.5 transition-transform">
              <Shield className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 group-hover:-translate-y-0.5 transition-transform">Comment Analyzer</h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-none group-hover:-translate-y-0.5 transition-transform">AI-Powered Content Analysis</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 font-medium">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How it works</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition" 
            aria-label="Menu" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden absolute right-4 top-16 bg-white rounded-lg shadow-lg border border-gray-100 z-50 min-w-[200px] overflow-hidden animate-fadeIn">
            <div className="py-2">
              <a 
                href="#features" 
                className="block py-2.5 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="block py-2.5 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </a>
              <a 
                href="#contact" 
                className="block py-2.5 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Comment Analyzer</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered analysis to detect harmful content, toxicity levels, and sentiment in real-time
          </p>
        </div>

        {/* Language Mismatch Warning */}
        {languageMismatch && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-yellow-800">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm sm:text-base">Language mismatch detected</p>
              <p className="text-xs sm:text-sm">The selected input language doesn't match the detected language. Consider switching to {results?.detectedLanguage || 'the appropriate language'}.</p>
            </div>
          </div>
        )}
        
        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="text-input" className="block text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
              Enter text to analyze
            </label>
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or paste your text here for toxicity analysis... (Press Enter to submit)"
              className="w-full h-28 sm:h-32 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none text-gray-700 text-sm sm:text-base"
              disabled={isAnalyzing}
            />
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mt-2 text-xs sm:text-sm text-gray-500 gap-1">
              <div className="flex items-center">
                <span>{inputText.length} characters</span>
                {isListening && (
                  <span className="ml-2 flex items-center text-blue-600">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-1"></span>
                    Listening...
                  </span>
                )}
              </div>
              <span>Maximum: 2000 characters</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isAnalyzing || !microphoneSupported}
                className={`p-2 sm:p-3 rounded-full border-2 ${isListening ? 'bg-blue-100 border-blue-500' : !microphoneSupported ? 'bg-gray-100 border-gray-300 opacity-50' : 'border-gray-300'} hover:bg-blue-50 transition flex-shrink-0`}
                title={!microphoneSupported ? "Microphone access required" : isListening ? "Click to stop" : "Click to speak"}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'text-blue-600 animate-pulse' : !microphoneSupported ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              
              <div className="ml-2 flex items-center">
                <label htmlFor="language-select" className="text-xs text-gray-500 mr-1">Language:</label>
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setLanguageMismatch(false);
                  }}
                  className="text-xs sm:text-sm border border-gray-300 rounded-md py-1 px-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isListening || isAnalyzing}
                >
                  <option value="en-US">English</option>
                  <option value="ak-GH">Twi (Ghana)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isAnalyzing || !inputText.trim()}
              className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Analyze Text</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <div className="flex items-start sm:items-center gap-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span>{error}</span>
              </div>
              
              {(error.includes('Microphone access denied') || !microphoneSupported) && (
                <div className="mt-3 text-xs sm:text-sm">
                  <p className="font-medium mb-2">How to enable microphone access:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Click the lock/info icon in your browser's address bar</li>
                    <li>Find "Microphone" in the site permissions</li>
                    <li>Change the setting to "Allow"</li>
                    <li>Refresh this page</li>
                  </ol>
                  <p className="mt-2">Alternatively, you can type your text directly in the input field above.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Processing your text...</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Our AI is analyzing the content for toxicity patterns</p>
            <div className="max-w-md mx-auto">
              <div className="bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                <span>Sentiment</span>
                <span>Toxicity</span>
                <span>Risk</span>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && !isAnalyzing && (
          <div className="space-y-6">
            {/* Summary Results */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Analysis Results</h3>
                  {results.detectedLanguage && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Detected Language: {results.detectedLanguage}</p>
                  )}
                </div>
                <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 font-semibold text-sm sm:text-base ${getRiskColor(results.riskLevel)}`}>
                  Risk Level: {results.riskLevel.charAt(0).toUpperCase() + results.riskLevel.slice(1)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-xl">
                  {results.isToxic ? (
                    <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-2 sm:mb-3" />
                  ) : (
                    <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-2 sm:mb-3" />
                  )}
                  <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                    {results.isToxic ? 'Toxic Content Detected' : 'Content appears Clean'}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600">Confidence: {results.confidence.toFixed(1)}%</p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-xl">
                  <TrendingUp className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 ${results.sentiment === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
                  <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                    Sentiment: {results.sentiment.charAt(0).toUpperCase() + results.sentiment.slice(1)}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600">Overall emotional tone</p>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Toxicity Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(results.toxicityLevels).map(([category, value]) => (
                  <div key={category} className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 capitalize text-sm sm:text-base">{category.replace('_', ' ')}</span>
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">{value.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className={`h-2 sm:h-3 rounded-full transition-all duration-1000 ${getProgressColor(value)}`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl text-xs sm:text-sm text-blue-800">
                <strong>Note:</strong> These percentages represent the likelihood of each type of toxic content. Lower percentages indicate safer content.
              </div>
              
              {results.feedback && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <h4 className="font-semibold text-indigo-800 mb-1 text-sm sm:text-base">Feedback:</h4>
                  <p className="text-indigo-700 text-xs sm:text-sm">{results.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section id="features" className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Real-time Analysis</h3>
            <p className="text-sm sm:text-base text-gray-600">Instant toxicity detection powered by advanced AI models</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center">
            <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Detailed Metrics</h3>
            <p className="text-sm sm:text-base text-gray-600">Comprehensive breakdown of different toxicity categories</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">AI-Powered</h3>
            <p className="text-sm sm:text-base text-gray-600">Leveraging advanced language models for accurate analysis</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}