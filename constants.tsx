
import { GitCommandMeta } from './types';

export const GIT_COMMANDS: GitCommandMeta[] = [
  // 开始
  { id: 'init', name: 'git init', description: '初始化仓库', category: 'start', details: '在当前文件夹创建一个隐藏的 .git 目录，从此 Git 开始记录你的一举一动。' },
  { id: 'clone', name: 'git clone', description: '克隆远程仓库', category: 'start', details: '从服务器（如 GitHub）完整下载一份项目到你的电脑上。' },
  
  // 工作
  { id: 'add', name: 'git add', description: '添加到暂存区', category: 'work', details: '把你修改的文件放入“待审区”，准备进行下一步的提交。' },
  { id: 'mv', name: 'git mv', description: '移动或重命名', category: 'work', details: '在 Git 的监控下移动或重命名文件，确保历史记录不丢失。' },
  { id: 'restore', name: 'git restore', description: '撤销修改', category: 'work', details: '觉得写错了？用这个命令把文件恢复到之前的状态。' },
  { id: 'rm', name: 'git rm', description: '删除文件', category: 'work', details: '从工作目录和 Git 的记录中同时移除该文件。' },

  // 状态查看
  { id: 'status', name: 'git status', description: '查看当前状态', category: 'examine', details: '告诉你哪些文件改了没保存，哪些文件还没被 Git 管起来。' },
  { id: 'log', name: 'git log', description: '查看提交历史', category: 'examine', details: '翻看过去的“日记本”，看看谁在什么时候改了什么。' },
  { id: 'diff', name: 'git diff', description: '对比差异', category: 'examine', details: '精确查看你到底改了哪几行代码。' },

  // 提交与分支
  { id: 'commit', name: 'git commit', description: '提交保存', category: 'grow', details: '给当前的修改拍一张“快照”，永久保存在本地仓库中。' },
  { id: 'branch', name: 'git branch', description: '管理分支', category: 'grow', details: '像平行时空一样创建新的开发线路，互不干扰。' },
  { id: 'switch', name: 'git switch', description: '切换分支', category: 'grow', details: '在不同的开发线路（平行时空）之间来回穿梭。' },
  { id: 'merge', name: 'git merge', description: '合并分支', category: 'grow', details: '把另一个分支的修改“吸纳”到当前分支里。' },
  { id: 'reset', name: 'git reset', description: '回退版本', category: 'grow', details: '让时光倒流，回到过去的某个提交状态。' },

  // 协作
  { id: 'fetch', name: 'git fetch', description: '拉取更新', category: 'collaborate', details: '去服务器看看有没有别人的新进展，但先不合并到你的代码里。' },
  { id: 'pull', name: 'git pull', description: '拉取并合并', category: 'collaborate', details: '一步到位：下载别人的更新并直接合进你的代码。' },
  { id: 'push', name: 'git push', description: '推送上传', category: 'collaborate', details: '把你本地的好东西分享到服务器上，让队友也能看到。' },
];
