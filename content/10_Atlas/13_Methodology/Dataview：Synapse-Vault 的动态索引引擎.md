---
type: tech-note
topic: 生产力工具
tags:
  - Methodology
  - tool
  - dataview
  - automation
created: 2026-02-10
version: "1.0"
---
# 🚀 技术专题：Dataview：Synapse-Vault 的动态索引引擎

> **MOC（Map of Content，内容地图） 关联：**  [🗺️ Atlas_MOC](🗺️%20Atlas_MOC.md) | [🗺️ Methodology_MOC](🗺️%20Methodology_MOC.md)
> 
> **版本：** 1.0

## 📖 核心概念 (Definition)

> Dataview 是 Obsidian 的数据库级查询插件，它通过解析笔记中的 YAML 属性和标签，将静态的 Markdown 文件转化为可动态排序、筛选和聚合的实时数据视图。

## ⚙️ 核心逻辑/原理 (Logic)

- **数据抓取（Scanning）**：实时扫描全库中的元数据（YAML Properties）和内联字段。 
- **动态感应（Live-Update）**：当新笔记满足 `FROM` 和 `WHERE` 条件时，索引页会自动“感知”并展示，无需手动维护链接。 
- **逻辑解耦**：彻底分离了笔记的“物理存放位置（文件夹）”与“逻辑组织方式（MOC）”。

## 💻 自动化构建 MOC 实践 (Implementation)

### 方案 A：基础列表（最常用）

```dataview
LIST
FROM #Methodology
SORT file.mtime DESC
```

### 方案 B：表格展示（带元数据）

```dataview
TABLE created AS "创建日期", status AS "状态", tags AS "标签"
FROM #Methodology
SORT created DESC
```
### 方案 C：按文件夹排除 MOC 本身的索引

```dataview
LIST
FROM "10_Atlas/13_Methodology"
WHERE !contains(file.name, "MOC")
```

### 方案 D：实现“生产力工具”自动分组预览

```dataview
LIST rows.file.link FROM #Methodology WHERE topic = "生产力工具" GROUP BY topic
```

---

## 🔗 扩展链接 (Connections)

- **上游知识:** [🗺️ Methodology_MOC](🗺️%20Methodology_MOC.md) (方法论内容地图)
    
- **相关资源:** [Dataview 官方文档](https://blacksmithgu.github.io/obsidian-dataview/)
    
- **待解决疑问:** 如何结合 `Templater` 在创建笔记时自动生成符合 Dataview 检索要求的 `topic` 字段？


---
#tool #Methodology #automation #dataview
