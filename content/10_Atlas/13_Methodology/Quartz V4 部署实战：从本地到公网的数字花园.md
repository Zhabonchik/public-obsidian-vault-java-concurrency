---
type: engineering
topic: 生产力工具
project_status: 进行中
tags:
  - "#project"
  - "#engineering"
  - "#demo"
created: 2026-02-10 16:35
updated: 2026-02-10 16:35
version: "1.0"
---
# 🏗️ 工程实战：Quartz V4 部署实战：从本地到公网的数字花园

> [!abstract] 项目意图
> - **目标**：将 Synapse-Vault 笔记库通过 Quartz v4 渲染成静态网站，并发布至 GitHub Pages。
> - **核心工具链**：Node.js (v18.14+), Quartz v4, GitHub Actions.
> - **当前版本**：V`=this.version`

## 🏁 环境准备 (Prerequisites)

- **运行环境**：(如 Node.js v18.14+, Python 3.10)
- **依赖安装**：
```bash
# 在克隆好的 quartz 目录下执行
npm install
```

## 💻 核心实现 (Core Implementation)

### 1. 初始化链接

在终端执行初始化向导，将 Quartz 代码仓库与 Obsidian 笔记库物理关联。

```Bash
npx quartz create
```

![](https://jsd.onmicrosoft.cn/gh/witty-hamster/Bed-of-Synapse/images/20260210171212776.png)

#### 🔍 选项深度对比
| 选项                         | 对应行为                                                                  | 适合场景                                           |
| -------------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| Empty Quartz               | 建立一个空的内容目录                                                            | 从零开始在 Quartz 文件夹里写笔记                           |
| Copy an existing folder    | **物理复制**。把你的笔记文件夹里的文件全部拷贝一份到 `quartz/content`                         | **推荐新手使用**。最稳定，不破坏原笔记库，也不怕路径权限问题               |
| Symlink an existing folder | **软链接**。即 `Link an existing Obsidian vault` 的本质。在 macOS 系统层建立一个“快捷方式” | **进阶使用**。实现“实时同步”，你在 Obsidian 改完，网页浏览直接刷新，无需复制 |

这里选择：`Link an existing Obsidian vault`（即第三个选项） 并输入笔记库绝对路径。

### 2. 跨仓库自动同步脚本 (GitHub Action)

在笔记仓库（Synapse-Vault）的 `.github/workflows/sync.yml` 中配置以下逻辑：

```Yaml
name: Sync to Quartz
on:
  push:
    branches: [ main ]
jobs:
  repo-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Pushing to Quartz Repo
        uses: cpina/github-action-push-to-another-repository@main
        env:
          API_TOKEN_GITHUB: ${{ secrets.QUARTZ_SYNC_TOKEN }}
        with:
          source-directory: '.'
          destination-github-username: '你的用户名'
          destination-repository-name: 'quartz'
          user-email: your-email@example.com
          target-directory: 'content'
```

## 🚩 关键步骤与坑点 (Key Steps & Pitfalls)

1. **Node 版本**：Quartz v4 依赖较高版本的 Node，若 `npm i` 报错，请检查 `node -v`。
    
2. **符号链接 (Symlink)**：
    
    - ⚠️ **踩坑提示**：Windows 系统下执行 `npx quartz create` 必须使用 **管理员权限** 运行终端，否则无法建立链接，导致 `content` 文件夹为空。
        

## 🧪 测试与验收 (Testing)

- **预期结果**：执行 `npx quartz build --serve` 后，本地 8081 端口可访问美化后的笔记网页。
    
- **实际表现**：
    

## 📓 复盘与迭代 (Review)

- **优化空间**：默认主题颜色需根据 Synapse-Vault 的风格进行 CSS 微调。
    
- **下一步计划**: [[下个迭代笔记名]]

---
#project #engineering 