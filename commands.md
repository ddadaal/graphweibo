```bash
# clone整个仓库到本地
git clone https://github.com/ddadaal/graphweibo

# clone之后，切换到已有的分支(master/shimin/fxb)
git checkout master
git checkout shimin
git checkout fxb

# 拉取远端有的新commit
# 建议每次在开始开发之前，都执行一下pull
git pull

# 下面两个步骤是创建commit的步骤，可以使用vscode的工具来创建

# 1. 把当前目录中所有修改过的文件加入暂存区（最后有个.）
git add .
# 2. commit当前加入暂存区的文件，-m后的引号中输入commit的说明
git commit -m "这个commit做了什么"

# 如果add之后又修改了文件，记得再运行一次git add .，把之后修改的文件也加入暂存区
# 不然commit不会记住前一次add .之后的文件修改

# 把本地的当前分支的新commit发到远端去
git push

# 如果你们需要对方的分支，先找我把你们分支合并到master，然后我会把master再合并回你们自己的分支
```