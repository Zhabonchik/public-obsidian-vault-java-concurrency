---
type: evergreen
topic: 生产力工具
tags:
  - "#quartz"
  - "#github-actions"
  - "#static-site"
  - "#automation"
created: 2026-02-10 15:37
updated: 2026-02-10 15:37
version: "1.0"
---
# 🌲 知识原子：Quartz + GitHub Actions 部署实战

> [!quote] 核心观点
> Quartz + GitHub Actions 的组合是目前 Obsidian 用户实现“数字花园”公网发布的最优免费方案，它实现了“本地创作，全网同步”的无缝闭环。

## 🔍 详细定义

- **Quartz 4.0**：一个基于 Node.js 的静态站点生成引擎，原生支持 Obsidian 的双向链接、正文预览和多种复杂语法。
- **GitHub Actions**：自动化工作流工具，负责监听代码库变动，自动触发编译并将渲染后的 HTML 推送至 GitHub Pages 托管。

## 💡 深度见解（Insight）

- **解耦优势**：通过 GitHub Actions，你可以将“源码库（Private）”与“发布库（Public）”分离。这既保护了你的隐私笔记不被泄露，又享受了公网访问的便利。
- **低成本运维**：该方案完全基于 GitHub 基础设施，零服务器成本，且具备极高的抗并发能力和全球访问速度。

## ⚙️ 工程实践（Step-by-Step）

### 1. 环境初始化 
1. Fork [Quartz 官方仓库](https://github.com/jackyzha0/quartz)。 
2. 本地执行 `npx quartz create`，选择你的 **Synapse-Vault** 作为内容源。

### 2. 跨仓库自动化同步脚本（Action YAML）

在你的 **Synapse-Vault** 仓库中创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Quartz
on: 
	push: 
		branches: [ main ] 
jobs: 
	build: 
		runs-on: ubuntu-latest 
	steps: 
		- name: Checkout Vault 
		  uses: actions/checkout@v3 
		- name: Push to Quartz Content 
		  run: | 
		  # 此处编写逻辑：将本地内容拉取并覆盖到 Quartz 仓库的 content 目录 
		  # 建议使用 API 或专门的 Sync Action 触发
```

### 3. 私密性过滤（Privacy Filter）

在 Quartz 配置中排除 `30_Daily` 文件夹，仅开放 `10_Atlas`：

- 修改 `quartz.config.ts` 中的过滤逻辑。
    
- 在笔记 YAML 区加入 `publish: false` 实现个体过滤。

## ⛓️ 知识网络 (Context)

- **上层概念**：[Synapse-Vault 搭建全指南：从零构建你的第二大脑](Synapse-Vault%20搭建全指南：从零构建你的第二大脑.md)
- **应用场景**：个人技术博客、公开的知识索引库、面试作品集展示。
- **进一步实践**：[Quartz V4 部署实战：从本地到公网的数字花园](Quartz%20V4%20部署实战：从本地到公网的数字花园.md)

---
#Knowledge #Structure #automation #quartz 