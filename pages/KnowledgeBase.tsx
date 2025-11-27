
import React from 'react';
import ReactMarkdown from 'react-markdown';
import * as LucideIcons from 'lucide-react';
import { ViewState } from '../types';

const Icon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  // @ts-ignore
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} size={size} /> : null;
};

const GIT_CONTENT = `
# Git Expert Cheat Sheet

## Configuration & Setup
- **Global Identity**: \`git config --global user.name "Name"\`
- **Global Editor**: \`git config --global core.editor code\`
- **List Config**: \`git config --list\`

## Staging & Committing
- **Stage All**: \`git add .\`
- **Stage Specific**: \`git add -p\` (Interactive patching)
- **Commit**: \`git commit -m "feat: message"\`
- **Amend Last**: \`git commit --amend\`

## Branching Strategy
- **New Branch**: \`git checkout -b feature/name\`
- **Switch**: \`git switch feature/name\`
- **List Merged**: \`git branch --merged\`
- **Delete**: \`git branch -d branch_name\`

## Undo & Reset
- **Unstage**: \`git reset HEAD <file>\`
- **Discard Changes**: \`git checkout -- <file>\`
- **Soft Reset**: \`git reset --soft HEAD~1\` (Keep changes staged)
- **Hard Reset**: \`git reset --hard HEAD~1\` (Destroy changes)

## Advanced
- **Stash**: \`git stash save "wip"\`
- **Pop Stash**: \`git stash pop\`
- **Cherry Pick**: \`git cherry-pick <commit_hash>\`
- **Rebase**: \`git rebase -i HEAD~3\` (Interactive rebase)
`;

const LINUX_CONTENT = `
# Essential Linux Commands

## File Operations
- **List All**: \`ls -la\`
- **Size**: \`du -sh folder_name\`
- **Find**: \`find . -name "*.js"\`
- **Copy w/ Progress**: \`rsync -ah --progress source dest\`

## Permissions
- **Change Owner**: \`chown user:group file\`
- **Executable**: \`chmod +x script.sh\`
- **Numeric**: \`chmod 755 folder\`

## Processes
- **List Running**: \`ps aux | grep node\`
- **Kill by ID**: \`kill -9 <pid>\`
- **Kill by Name**: \`pkill -f node\`
- **Top Processes**: \`htop\`

## Network
- **Listen Ports**: \`lsof -i :3000\`
- **Curl POST**: \`curl -X POST -d '{"a":1}' url\`
- **SSH Key Gen**: \`ssh-keygen -t ed25519\`

## System
- **Disk Space**: \`df -h\`
- **Memory**: \`free -m\`
- **Logs**: \`journalctl -u service_name -f\`
`;

const KnowledgeBase = ({ view }: { view: ViewState }) => {
  const content = view === ViewState.GIT_CHEAT_SHEET ? GIT_CONTENT : LINUX_CONTENT;
  const title = view === ViewState.GIT_CHEAT_SHEET ? 'GIT_CHEAT_SHEET' : 'LINUX_OPS_MANUAL';
  const icon = view === ViewState.GIT_CHEAT_SHEET ? 'GitBranch' : 'Terminal';
  const color = view === ViewState.GIT_CHEAT_SHEET ? 'text-neon-red' : 'text-neon-green';

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-3">
          <Icon name={icon} className={color} />
          {title}
        </h2>
        <div className="text-xs font-mono text-zinc-500">READ_ONLY_MODE</div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-900/30 border border-zinc-800 p-8 rounded-sm">
        <div className="markdown-body font-sans">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
