---
type: tech-note
topic: 知识管理（PKM）
tags:
  - evergreen
  - workflow
  - obsidian
created: 2026-02-10
version: "1.0"
---
# 🚀 技术专题：Synapse-Vault 搭建全指南：从零构建你的第二大脑

> **MOC（Map of Content，内容地图） 关联：** [🗺️ Methodology_MOC](🗺️%20Methodology_MOC.md) | [🗺️ Atlas_MOC](🗺️%20Atlas_MOC.md)
> 
> **版本：** 1.0（底层架构完工版）

## 🌟 核心概念 (Definition)

**Synapse-Vault** (神经突触保险库) 是基于”原子化、关联化、自动化“原则构建的数字第二大脑。它不仅是一个存储仓库，更是一个能够自动同步、图床分离、结构严谨的思维化系统。

---
## 🛠️ 技术栈与自动化方案

### 1. 数据同步：Git 全自动工作流
- **工具：** Obsidian Git 插件 + GitHub Private Repo（GitHub 私有仓）。
- **实现：** 配置 `Auto commit-and-sync`。
- **价值：** 实现了版本控制与多端数据冗余，确保知识资产永不丢失，并具备时间回溯能力。
![插件](https://jsd.onmicrosoft.cn/gh/witty-hamster/Bed-of-Synapse/images/202602101052758.png)
![Git查询核心配置参数](https://jsd.onmicrosoft.cn/gh/witty-hamster/Bed-of-Synapse/images/202602101056893.png)

### 2. 视觉记忆：图床分离方案
- **工具：** PicList（或 PicGo）+ GitHub 图床 + Image Auto Upload 插件。
- **实现：** 粘贴图片时自动触发上传，并在文档中生成 `https://` 链接。
- **价值：** 保持本地仓库极度轻量化（仅存 Markdown），确保在任何 Web 环境下图片均可正常预览。

![Image Auto Upload 插件](https://jsd.onmicrosoft.cn/gh/witty-hamster/Bed-of-Synapse/images/20260210112243287.png)

![Image Auto Upload 插件使用 PicList 配置方式](https://jsd.onmicrosoft.cn/gh/witty-hamster/Bed-of-Synapse/images/20260210112323162.png)


---
## 🏛️ 文件夹分层架构（PARA 优化版）

- **`00_Inbox`**：神经入口，存放所有待处理的碎片。
- **`10_Atlas`**：知识地图，按领域存放结构化知识（如 CS、AI、方法论等）。
- **`20_Projects`**：正在进行的具体任务，有明确的截止日期。
- **`30_Daily`**：时间线记录，作为知识点的”胶水“和任务中枢。
- **`80_System`**：系统底层，存放模板（`Templates`）、资源（`Assets`）和配置文件。

---
## 📝 核心工作流（Workflow）

### 第一步：开启每日脉冲（The Trigger）

 每天通过 `Daily Note` 插件生成日期笔记，在 **”核心目标“** 模块通过 `[[ ]]` 双链预设今日要产出的知识点。

### 第二步：知识录入（The Input）

使用 `Tech-Note-Template` 快速创建笔记，强调：

- **双向链接：** 必须链接至对应的 MOC 或项目页面。
- **标签：** 使用 `#seed` 或 `#evergreen` 标记笔记成熟度。

### 第三步：自动同步（The Backup）

无需人工干预，Obsidian Git 插件会在后台定时将所有更改推送到远程仓库。

---
## 💡维护与演进建议

1. **定期修剪：** 每周末检查 `00_Inbox` 文件夹下的内容，将碎片化笔记归档到 `10_Atlas` 文件夹中。
2. **保持原子性：** 一篇笔记只解决一个问题，复杂的课题通过 MOC 进行组织。
3. **以写促学：** 如果没有笔记产出，今天的待办就不算真正完成。

---
#Methodology #SecondBrain #Workflow 