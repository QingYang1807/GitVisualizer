
import React, { useState, useEffect, useCallback } from 'react';
import { GIT_COMMANDS } from './constants';
import { GitState, GitCommandMeta, GitNode } from './types';
import GitFlowVisualizer from './components/GitFlowVisualizer';
import { getGitExplanation } from './services/geminiService';
import { 
  Terminal, 
  BookOpen, 
  GitBranch, 
  RefreshCw, 
  Play, 
  Info, 
  Cpu, 
  HelpCircle,
  Zap,
  MousePointer2
} from 'lucide-react';

const INITIAL_STATE: GitState = {
  workingFiles: ['main.py', 'style.css', 'app.js'],
  stagedFiles: [],
  localCommits: [
    { id: '1', message: 'Initial commit', hash: 'a1b2c3d', branch: 'main' }
  ],
  remoteCommits: [
    { id: '1', message: 'Initial commit', hash: 'a1b2c3d', branch: 'main' }
  ],
  currentBranch: 'main',
};

const App: React.FC = () => {
  const [state, setState] = useState<GitState>(INITIAL_STATE);
  const [selectedCmd, setSelectedCmd] = useState<GitCommandMeta | null>(null);
  const [activeCommandId, setActiveCommandId] = useState<string | undefined>();
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['$ git 欢迎学习 Git！', '提示：从左侧选择一个命令开始吧。']);

  const executeCommand = useCallback(async (cmd: GitCommandMeta) => {
    setActiveCommandId(cmd.id);
    setTerminalHistory(prev => [...prev.slice(-5), `$ ${cmd.name}`]);
    
    // 模拟数据流逻辑
    setTimeout(() => {
      setState(prev => {
        const newState = { ...prev };
        switch (cmd.id) {
          case 'add':
            if (prev.workingFiles.length > 0) {
              const file = prev.workingFiles[0];
              newState.stagedFiles = [...prev.stagedFiles, file];
              newState.workingFiles = prev.workingFiles.filter(f => f !== file);
            }
            break;
          case 'commit':
            if (prev.stagedFiles.length > 0) {
              const newHash = Math.random().toString(36).substring(7);
              const newNode: GitNode = { 
                id: Date.now().toString(), 
                message: '新提交', 
                hash: newHash, 
                branch: prev.currentBranch 
              };
              newState.localCommits = [...prev.localCommits, newNode];
              newState.stagedFiles = [];
            }
            break;
          case 'push':
            newState.remoteCommits = [...newState.localCommits];
            break;
          case 'pull':
            newState.localCommits = [...newState.remoteCommits];
            if (!prev.workingFiles.includes('update.ts')) {
                newState.workingFiles = [...prev.workingFiles, 'update.ts'];
            }
            break;
          case 'clone':
            newState.remoteCommits = [{ id: 'rem-1', message: 'Origin', hash: '777aaaa', branch: 'main' }];
            newState.localCommits = [...newState.remoteCommits];
            newState.workingFiles = ['README.md', 'main.ts'];
            break;
          case 'init':
            return { ...INITIAL_STATE, workingFiles: ['README.md'] };
        }
        return newState;
      });
      setActiveCommandId(undefined);
    }, 1200);

    // 获取 AI 解释
    setIsExplaining(true);
    const explanation = await getGitExplanation(cmd.name);
    setAiExplanation(explanation || '');
    setIsExplaining(false);
  }, []);

  const resetState = () => {
    setState(INITIAL_STATE);
    setTerminalHistory(['$ git reset --hard initial', '状态已重置。']);
    setSelectedCmd(null);
    setAiExplanation('');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-950 text-gray-100 font-sans">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Git 交互式动画学习机</h1>
            <p className="text-xs text-gray-500">可视化理解 Git 工作流</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs border border-yellow-500/20">
            <HelpCircle className="w-3 h-3" />
            点击左侧命令看动画演示
          </div>
          <button 
            onClick={resetState}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-all border border-transparent hover:border-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            重置练习
          </button>
        </div>
      </header>

      {/* 主体布局 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧栏：命令列表 */}
        <aside className="w-64 border-r border-gray-800 flex flex-col bg-gray-900/40">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">常用命令库</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
            {(['start', 'work', 'examine', 'grow', 'collaborate'] as const).map(cat => (
              <div key={cat} className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-600 uppercase px-2 py-1 tracking-tighter">
                  {cat === 'start' ? '项目启动' : cat === 'work' ? '日常工作' : cat === 'examine' ? '状态检查' : cat === 'grow' ? '提交管理' : '远程协作'}
                </h3>
                {GIT_COMMANDS.filter(c => c.category === cat).map(cmd => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                        setSelectedCmd(cmd);
                        executeCommand(cmd); // 点击即执行，简化流程
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${
                      selectedCmd?.id === cmd.id 
                      ? 'bg-indigo-600 text-white shadow-lg ring-1 ring-white/20' 
                      : 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-100'
                    }`}
                  >
                    <span className="font-medium">{cmd.name}</span>
                    <Play className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${selectedCmd?.id === cmd.id ? 'opacity-100' : ''}`} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* 右侧主显示区 */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
          
          {/* 上半部：动画演示区 */}
          <section className="h-[55%] p-6 flex flex-col relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-3">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-widest">当前分支</span>
                    <div className="px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/20 flex items-center gap-2">
                      <GitBranch className="w-3 h-3" /> {state.currentBranch}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-widest">最近版本</span>
                    <div className="px-3 py-1 rounded bg-green-500/10 text-green-400 text-xs font-mono border border-green-500/20">
                      HEAD -&gt; {state.localCommits[state.localCommits.length-1]?.hash}
                    </div>
                </div>
              </div>

              {activeCommandId && (
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/50 rounded-full text-indigo-400 text-xs font-bold animate-pulse">
                  <Zap className="w-3 h-3" /> 正在执行动画演练...
                </div>
              )}
            </div>

            <GitFlowVisualizer state={state} activeCommandId={activeCommandId} />
            
            <div className="mt-8 grid grid-cols-4 text-center opacity-40 pointer-events-none border-t border-gray-800/50 pt-4">
               <div className="text-[10px] font-bold text-gray-500">硬盘物理文件</div>
               <div className="text-[10px] font-bold text-gray-500">缓存索引区</div>
               <div className="text-[10px] font-bold text-gray-500">快照数据库</div>
               <div className="text-[10px] font-bold text-gray-500">远程服务器</div>
            </div>
          </section>

          {/* 下半部：解说与终端 */}
          <section className="h-[45%] flex gap-4 p-6 border-t border-gray-800 bg-gray-900/20">
            {/* AI解说卡片 */}
            <div className="w-1/2 flex flex-col">
              {selectedCmd ? (
                <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700/50 h-full flex flex-col shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Info className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-black text-white">{selectedCmd.name} <span className="text-xs font-normal text-gray-500 ml-2">{selectedCmd.description}</span></h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 bg-white/5 p-3 rounded-lg border border-white/5">
                    {selectedCmd.details}
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                       <Cpu className="w-4 h-4 text-green-400" />
                       <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Gemini 深度解说</span>
                    </div>
                    <div className="text-sm text-gray-300 bg-black/40 p-4 rounded-xl border border-white/5 min-h-[100px] relative overflow-hidden">
                      {isExplaining ? (
                        <div className="flex flex-col gap-2">
                            <div className="h-4 bg-gray-700 w-3/4 rounded animate-pulse" />
                            <div className="h-4 bg-gray-700 w-1/2 rounded animate-pulse" />
                        </div>
                      ) : (
                        aiExplanation || "点击命令后，我将为你生成实时解说..."
                      )}
                      {!isExplaining && aiExplanation && (
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Cpu className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20 text-gray-600 gap-4 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center animate-bounce">
                    <MousePointer2 className="w-8 h-8 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-400 text-lg">欢迎来到 Git 实验室</p>
                    <p className="text-sm">点击左侧列表中的任何命令，我将为您演示它的魔力。</p>
                  </div>
                </div>
              )}
            </div>

            {/* 虚拟终端 */}
            <div className="w-1/2 bg-black rounded-2xl border border-gray-800 overflow-hidden flex flex-col font-mono text-sm shadow-2xl">
              <div className="bg-gray-800/80 px-4 py-3 flex items-center gap-2 border-b border-gray-700 justify-between">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">命令输出窗口</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
              </div>
              <div className="p-5 flex-1 overflow-y-auto text-green-400 leading-relaxed custom-scrollbar">
                {terminalHistory.map((line, i) => (
                  <div key={i} className="mb-2 flex gap-2">
                    <span className="text-indigo-500 font-bold">❯</span>
                    <span className="text-gray-300">{line}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-indigo-500 font-bold animate-pulse">❯</span>
                  <span className="w-2 h-5 bg-indigo-500/50 animate-blink" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>
    </div>
  );
};

export default App;
