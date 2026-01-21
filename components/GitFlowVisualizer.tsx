
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitArea, GitState } from '../types';
import { ArrowRight } from 'lucide-react';

interface GitFlowVisualizerProps {
  state: GitState;
  activeCommandId?: string;
}

const GitFlowVisualizer: React.FC<GitFlowVisualizerProps> = ({ state, activeCommandId }) => {
  const areas: { id: GitArea; label: string; desc: string; color: string }[] = [
    { id: 'working', label: '工作区', desc: 'Working Dir', color: 'bg-red-500/10 border-red-500/50' },
    { id: 'staging', label: '暂存区', desc: 'Staging Area', color: 'bg-yellow-500/10 border-yellow-500/50' },
    { id: 'local', label: '本地仓库', desc: 'Local Repo', color: 'bg-blue-500/10 border-blue-500/50' },
    { id: 'remote', label: '远程仓库', desc: 'Remote Repo', color: 'bg-green-500/10 border-green-500/50' },
  ];

  const getAnimation = (cmd?: string): { from: GitArea; to: GitArea; color: string; label: string } | null => {
    switch (cmd) {
      case 'add': return { from: 'working', to: 'staging', color: 'bg-yellow-400', label: 'Stage' };
      case 'commit': return { from: 'staging', to: 'local', color: 'bg-blue-400', label: 'Commit' };
      case 'push': return { from: 'local', to: 'remote', color: 'bg-green-400', label: 'Push' };
      case 'pull': return { from: 'remote', to: 'working', color: 'bg-red-400', label: 'Pull' };
      case 'fetch': return { from: 'remote', to: 'local', color: 'bg-blue-300', label: 'Fetch' };
      case 'restore': return { from: 'staging', to: 'working', color: 'bg-red-300', label: 'Restore' };
      case 'clone': return { from: 'remote', to: 'local', color: 'bg-blue-400', label: 'Clone' };
      default: return null;
    }
  };

  const anim = getAnimation(activeCommandId);

  return (
    <div className="relative w-full h-80 flex items-center justify-between px-2 gap-2 overflow-hidden bg-gray-950/50 rounded-2xl border border-gray-800 p-4">
      {areas.map((area, index) => (
        <React.Fragment key={area.id}>
          <div 
            className={`flex-1 h-64 border-2 rounded-xl flex flex-col items-center justify-start p-3 ${area.color} ${activeCommandId && (anim?.from === area.id || anim?.to === area.id) ? 'ring-4 ring-white/20' : ''} transition-all duration-500 relative`}
          >
            <div className="text-center mb-3">
              <span className="block text-sm font-bold text-white">{area.label}</span>
              <span className="block text-[10px] text-gray-500 font-mono uppercase">{area.desc}</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 justify-center overflow-y-auto max-h-40 p-1">
              {area.id === 'working' && state.workingFiles.map(f => <FileIcon key={f} name={f} color="bg-red-500" />)}
              {area.id === 'staging' && state.stagedFiles.map(f => <FileIcon key={f} name={f} color="bg-yellow-500" />)}
              {area.id === 'local' && state.localCommits.slice(-4).map(c => <CommitIcon key={c.id} hash={c.hash} color="bg-blue-500" />)}
              {area.id === 'remote' && state.remoteCommits.slice(-4).map(c => <CommitIcon key={c.id} hash={c.hash} color="bg-green-500" />)}
            </div>
          </div>
          {index < areas.length - 1 && (
            <div className="flex flex-col items-center text-gray-700">
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Animation Overlay */}
      <AnimatePresence>
        {anim && (
          <motion.div
            key={`${activeCommandId}-particle`}
            initial={{ left: getPos(anim.from), opacity: 0, scale: 0.5, y: '-50%' }}
            animate={{ left: getPos(anim.to), opacity: 1, scale: 1.2, y: '-50%' }}
            exit={{ opacity: 0, scale: 2, y: '-50%' }}
            transition={{ duration: 1, ease: "circInOut" }}
            className={`absolute top-1/2 w-16 h-16 rounded-2xl shadow-2xl z-50 flex flex-col items-center justify-center ${anim.color} border-2 border-white/40`}
          >
             <span className="text-[10px] font-black text-gray-900 leading-tight">DATA</span>
             <span className="text-[8px] font-bold text-gray-900/70">{anim.label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getPos = (area: GitArea) => {
  const map = { working: '10%', staging: '37%', local: '63%', remote: '90%' };
  return map[area];
};

const FileIcon: React.FC<{ name: string; color: string }> = ({ name, color }) => (
  <motion.div 
    layout
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className={`${color} px-2 py-1 rounded shadow-sm flex items-center justify-center text-[10px] font-mono border border-white/20 text-white truncate max-w-[60px]`}
    title={name}
  >
    {name.split('.')[0]}
  </motion.div>
);

const CommitIcon: React.FC<{ hash: string; color: string }> = ({ hash, color }) => (
  <motion.div 
    layout
    initial={{ scale: 0, rotate: -45 }}
    animate={{ scale: 1, rotate: 0 }}
    className={`${color} w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono border-2 border-white/40 shadow-lg text-white`}
  >
    {hash.substring(0, 4)}
  </motion.div>
);

export default GitFlowVisualizer;
