import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, Menu, X, Trash2, Check, Copy } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Standalone component for code highlighting to fix ESLint Hook rules
const CodeHighlight = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative group rounded-md overflow-hidden my-4 border border-white/10">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#1E293B] text-xs text-gray-400">
        <span className="font-mono uppercase tracking-wider">{match[1]}</span>
        <button onClick={handleCopy} className="hover:text-white transition-colors duration-200">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        customStyle={{ margin: 0, padding: '1.5rem', background: '#0B0F19' }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="bg-white/10 text-primary-300 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
      {children}
    </code>
  );
};

// Component for Typewriter Effect
const TypewriterText = ({ text, delay = 15 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(intervalId);
    }, delay);
    return () => clearInterval(intervalId);
  }, [text, delay]);

  return <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code: CodeHighlight,
      p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-[15px]">{children}</p>,
      ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
      li: ({ children }) => <li className="text-[15px] p-0 m-0">{children}</li>,
    }}
  >
    {displayedText}
  </ReactMarkdown>;
};

function App() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useState([]);
  
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/ai/tasks/");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.results || data);
      }
    } catch (e) {
      console.log("Error fetching history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleInput = (e) => {
    setPrompt(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  const sendMessage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a message", { style: { borderRadius: '10px', background: '#1f2937', color: '#fff' } });
      return;
    }

    const userMessage = { type: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    if (textareaRef.current) {
        textareaRef.current.style.height = '56px'; // Reset height
    }
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ai/process/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Server disconnected");

      const data = await res.json();
      const aiMessage = { type: "ai", text: data.ai_response || "No response" };
      setMessages((prev) => [...prev, aiMessage]);
      fetchHistory(); // refresh sidebar silently

      if (data.ai_response && data.ai_response.includes("Served from cache")) {
         toast.success("Lightning fast response loaded from cache! ⚡", { style: { borderRadius: '10px', background: '#10b981', color: '#fff' } });
      }

    } catch (err) {
      toast.error("Error connecting to Nexus Servers.", { icon: '🚨', style: { borderRadius: '10px', background: '#ef4444', color: '#fff' }});
      setMessages((prev) => [...prev, { type: "ai", text: "Connection error. Is the Django backend running?" }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="h-[100dvh] w-full bg-background flex text-white relative overflow-hidden font-sans selection:bg-primary-500 selection:text-white">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Sidebar - Always Left, Edge to Edge */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.4, type: 'spring', damping: 25 }}
        className="absolute md:relative z-40 w-72 h-[100dvh] glass-panel bg-surface/95 border-r border-white/5 flex flex-col shadow-2xl md:shadow-none"
      >
        <div className="p-6 pt-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-gray-200 font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary-400 shrink-0" /> Session History
          </h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {history.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full opacity-40 gap-2">
                 <Bot className="w-8 h-8" />
                 <p className="text-sm">No History Yet</p>
             </div>
          ) : history.map((item, id) => (
            <div key={id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-transparent hover:border-white/10 transition-all group">
              <p className="text-sm text-gray-200 truncate font-medium">{item.user_prompt}</p>
              <p className="text-xs text-gray-500 mt-1 truncate">{item.ai_response}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Chat Interface - Fills Remaining Right Side */}
      <div className="flex-1 flex flex-col h-[100dvh] relative z-20 w-full transition-all bg-background/50">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 w-full flex flex-col overflow-hidden relative"
        >
          {/* Header - Fixed Top Clipping */}
          <header className="px-5 py-4 pt-6 md:pt-8 border-b border-white/10 flex items-center justify-between bg-surface/80 backdrop-blur-xl z-50 flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 rounded-lg shrink-0 hover:bg-white/10 transition-colors hidden max-md:block md:block">
                <Menu className="w-6 h-6 text-gray-300" />
              </button>
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Sparkles size={22} className="text-white" />
              </div>
              <div className="flex flex-col shrink-0 min-w-[120px]">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Nexus AI</h1>
                <div className="flex items-center gap-2 text-xs text-primary-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                  System Online
                </div>
              </div>
            </div>
          </header>

            {/* Chat Flow */}
            <div className="flex-1 overflow-y-auto scroll-smooth relative z-10">
              <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 min-h-full flex flex-col pt-6 sm:pt-8">
                {messages.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500/60 gap-4 mt-[-5%] text-center">
                    <Bot className="w-20 h-20 opacity-40 drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
                    <p className="text-lg font-medium">Nexus is ready. Ask anything.</p>
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-4 w-full ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl flex items-center justify-center mt-1 shadow-md ${
                        msg.type === "user" ? "bg-white/10" : "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                      }`}>
                        {msg.type === "user" ? <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Bot className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
                      </div>

                      <div className={`p-4 sm:p-5 max-w-[85%] text-[15px] sm:text-[16px] leading-relaxed shadow-sm overflow-x-auto ${
                        msg.type === "user"
                          ? "bg-primary-600 text-white rounded-2xl rounded-tr-sm shadow-primary-600/20"
                          : "bg-surface/90 sm:bg-surface/60 text-gray-200 rounded-2xl rounded-tl-sm border border-white/5 shadow-black/10"
                      }`}>
                        {msg.type === "user" ? (
                          msg.text.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)
                        ) : (
                          <TypewriterText text={msg.text} delay={10} />
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex gap-4 w-full">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl flex items-center justify-center mt-1 bg-primary-500/20 text-primary-400 border border-primary-500/30">
                        <Bot className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </div>
                      <div className="p-4 sm:p-5 bg-surface/90 sm:bg-surface/60 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
                        <span className="text-gray-400 font-medium">Processing...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 bg-surface/60 sm:bg-transparent border-t border-white/5 backdrop-blur-xl relative z-20">
              <div className="flex gap-3 relative max-w-4xl mx-auto items-end shadow-2xl">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  className="flex-1 min-h-[56px] max-h-[300px] py-4 pl-6 pr-16 rounded-2xl bg-[#1A2235]/90 border border-white/10 focus:border-primary-500 focus:bg-[#1E293B] transition-colors duration-300 outline-none text-white placeholder-gray-400 text-[15px] sm:text-[16px] resize-none scrollbar-thin scrollbar-thumb-gray-600"
                  placeholder="Ask Nexus anything... (Shift+Enter for new line)"
                  value={prompt}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!prompt.trim() || loading}
                  className="absolute right-2 bottom-2 aspect-square h-10 w-10 flex items-center justify-center bg-primary-600 hover:bg-primary-500 disabled:bg-white/5 disabled:text-gray-600 text-white rounded-xl transition-colors duration-200 shadow-[0_0_12px_rgba(99,102,241,0.4)] disabled:shadow-none"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-[2px]" />
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-3 font-medium tracking-wide">Nexus AI may produce inaccurate information. Please verify important details.</p>
            </div>
          </motion.div>
        </div>
    </div>
  );
}

export default App;