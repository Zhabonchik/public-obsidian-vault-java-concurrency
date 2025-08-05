import { QuartzTransformerPlugin } from "../types"

// ViewImage.js灯箱插件
// 简化版实现
export const ViewImage: QuartzTransformerPlugin = () => {
  return {
    name: "ViewImage",
    externalResources() {
      return {
        js: [
          {
            src: "https://cdn.jsdelivr.net/gh/Tokinx/ViewImage/view-image.min.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
          {
            script: `
              // 简单的初始化代码
              document.addEventListener('DOMContentLoaded', function() {
                if (window.ViewImage) {
                  // 使用更通用的选择器
                  ViewImage.init('article img, .content img');
                  // 添加视觉反馈
                  const style = document.createElement('style');
                  style.textContent = 'article img, .content img { cursor: zoom-in; border: 2px dashed #284b63; }';
                  document.head.appendChild(style);
                  console.log('ViewImage灯箱插件已初始化');
                } else {
                  console.error('ViewImage库未加载成功');
                }
              });
            `,
            loadTime: "afterDOMReady",
            contentType: "inline",
          },
        ],
      }
    },
  }
}

// 告诉TypeScript我们添加的内容
declare module "vfile" {
  interface DataMap {
    viewImage?: boolean
  }
}
