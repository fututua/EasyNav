# 社交分享图片指南

为了让你的网站在社交媒体上分享时有更好的展示效果，你需要创建以下图片：

## 需要的图片

### 1. Open Graph 图片 (og-image.jpg)
- **尺寸**: 1200 x 630 像素
- **格式**: JPG 或 PNG
- **位置**: `/public/og-image.jpg`
- **用途**: Facebook、LinkedIn、微信等平台分享

**设计建议**:
- 使用品牌主色（indigo #6366f1）
- 包含网站名称 "EasyNav"
- 添加简短描述 "精选网址导航站"
- 确保文字清晰可读
- 避免在边缘放置重要内容（可能被裁剪）

### 2. Twitter 卡片图片 (twitter-image.jpg)
- **尺寸**: 1200 x 675 像素（16:9 比例）
- **格式**: JPG 或 PNG
- **位置**: `/public/twitter-image.jpg`
- **用途**: Twitter/X 平台分享

**设计建议**:
- 与 OG 图片风格保持一致
- 可以使用相同设计，调整尺寸即可

## 快速创建方法

### 方法 1: 使用在线工具
- [Canva](https://www.canva.com/) - 免费设计工具
- [Figma](https://www.figma.com/) - 专业设计工具
- [OG Image Generator](https://og-image.vercel.app/) - 快速生成 OG 图片

### 方法 2: 使用 AI 工具
- ChatGPT + DALL-E
- Midjourney
- Stable Diffusion

### 方法 3: 代码生成
使用 HTML Canvas 或 SVG 动态生成图片

## 设计模板建议

```
┌─────────────────────────────────────┐
│                                     │
│         [Compass Icon]              │
│                                     │
│           EasyNav                   │
│       精选网址导航站                  │
│                                     │
│   收录影视、工具、开发、设计、        │
│      AI、资讯等优质网站              │
│                                     │
│    [渐变背景: indigo to violet]      │
│                                     │
└─────────────────────────────────────┘
```

## 验证图片

创建图片后，使用以下工具验证：

1. **Facebook Sharing Debugger**
   https://developers.facebook.com/tools/debug/

2. **Twitter Card Validator**
   https://cards-dev.twitter.com/validator

3. **LinkedIn Post Inspector**
   https://www.linkedin.com/post-inspector/

## 更新 index.html

创建图片后，更新 `index.html` 中的 URL：

```html
<!-- 将 example.com 替换为你的实际域名 -->
<meta property="og:image" content="https://你的域名.com/og-image.jpg" />
<meta name="twitter:image" content="https://你的域名.com/twitter-image.jpg" />
```

## 注意事项

- 图片文件大小建议小于 1MB
- 使用 HTTPS 协议
- 确保图片可公开访问
- 定期检查图片是否正常显示
