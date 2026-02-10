---
type: universal
topic: <% tp.system.suggester(["生产力工具", "技术栈", "方法论", "生活"], ["生产力工具", "技术栈", "方法论", "生活"], false, "请选择一个主题") %>
tags:
  - seed
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
updated: <% tp.date.now("YYYY-MM-DD HH:mm") %>
version: "1.0"
status: seedling
---
# <% tp.file.title %>

> [!abstract] 节点信息
> - **主题**：`$= dv.current().topic` 
> - **版本**：V`=this.version`
> - **建立时间**：`$= dv.current().created` 

## 📝 内容描述

- 

## 🔗 关联引用 

- **归属 MOC**：[[<% tp.file.folder(true).split("/").pop() %>_MOC]] 
- **延伸阅读**：

---
#Notes