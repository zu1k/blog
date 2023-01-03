# 一些我刚学到的GIT技巧


### git reflog

git reflog 可以查看所有分支的所有操作记录（包括（包括commit和reset的操作），包括已经被删除的commit记录，git log则不能察看已经删除了的commit记录，而且跟进结果可以回退道某一个修改

有时候想要删除reflog记录，可以使用下面的命令

首先确保所有分支都没有引用该提交，包括HEAD也不指向这个提交。

然后 git reflog expire --expire=now --all (这会清除分支变更历史)

然后 git gc --prune=now (不用调整时间，加上--prune=now命令即可)

### git rebase

参考文章：http://jartto.wang/2018/12/11/git-rebase/

可以合并多次提交记录: git rebase -i HEAD~4

可以合并分支而不产生merge记录

