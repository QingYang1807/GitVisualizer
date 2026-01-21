
export type GitArea = 'working' | 'staging' | 'local' | 'remote';

export interface GitNode {
  id: string;
  message: string;
  hash: string;
  parentId?: string;
  branch: string;
}

export interface GitState {
  workingFiles: string[];
  stagedFiles: string[];
  localCommits: GitNode[];
  remoteCommits: GitNode[];
  currentBranch: string;
  activeCommand?: string;
}

export interface GitCommandMeta {
  id: string;
  name: string;
  description: string;
  category: 'start' | 'work' | 'examine' | 'grow' | 'collaborate';
  details: string;
}
