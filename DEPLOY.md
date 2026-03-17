# EasyNav 部署与维护手册

> 适合完全没有部署经验的开发者，按步骤操作即可。

---

## 第一步：本地构建验证

在部署前，先确认项目能正常打包：

```bash
# 安装依赖（只需执行一次）
npm install

# 本地开发预览
npm run dev

# 生产构建（生成 dist/ 目录）
npm run build

# 预览构建产物（可选）
npm run preview
```

构建成功后，项目根目录会出现 `dist/` 文件夹，这就是要部署的静态文件。

---

## 第二步：推送代码到 GitHub

### 2.1 安装 Git

如果还没安装 Git，前往 https://git-scm.com 下载安装。

### 2.2 创建 GitHub 仓库

1. 打开 https://github.com，登录账号
2. 点击右上角 **"+"** → **"New repository"**
3. 填写仓库名（如 `easynav`），选择 **Public**，不要勾选 "Initialize this repository"
4. 点击 **"Create repository"**

### 2.3 本地初始化并推送

在项目根目录（`EasyNav/`）打开终端，依次执行：

```bash
git init
git add .
git commit -m "feat: initial EasyNav project"
git branch -M main
git remote add origin https://github.com/你的用户名/easynav.git
git push -u origin main
```

> 把 `你的用户名` 替换为你的 GitHub 用户名。

---

## 第三步：部署到 Vercel（推荐）

Vercel 是最简单的静态站部署平台，免费、自动 HTTPS、每次 push 自动更新。

### 3.1 注册并导入项目

1. 打开 https://vercel.com，用 GitHub 账号登录
2. 点击 **"Add New Project"**
3. 找到你的 `easynav` 仓库，点击 **"Import"**

### 3.2 配置构建参数

Vercel 会自动检测 Vite 项目，默认配置如下（无需修改）：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

点击 **"Deploy"**，等待约 1 分钟即可完成。

### 3.3 访问你的网站

部署完成后，Vercel 会分配一个免费域名，格式为：

```
https://easynav-xxx.vercel.app
```

### 3.4 自动更新

之后每次修改代码并 `git push`，Vercel 会自动重新构建并更新网站，无需任何手动操作。

---

## 第四步：部署到 Netlify（备选方案）

### 4.1 注册并导入

1. 打开 https://netlify.com，用 GitHub 账号登录
2. 点击 **"Add new site"** → **"Import an existing project"**
3. 选择 GitHub，授权后找到 `easynav` 仓库

### 4.2 配置构建参数

| 配置项 | 值 |
|--------|-----|
| Build command | `npm run build` |
| Publish directory | `dist` |

点击 **"Deploy site"**，等待完成。

---

## 第五步：配置自定义域名（可选）

如果你有自己的域名（如 `nav.yourdomain.com`），可以绑定到 Vercel 或 Netlify。

### Vercel 绑定域名

1. 进入项目 Dashboard → **Settings** → **Domains**
2. 输入你的域名，点击 **"Add"**
3. Vercel 会提示你在域名注册商处添加一条 DNS 记录：
   - 类型：`CNAME`
   - 名称：`nav`（或你想要的子域名）
   - 值：`cname.vercel-dns.com`
4. 在你的域名注册商（如阿里云、腾讯云、Cloudflare）控制台添加该 DNS 记录
5. 等待 DNS 生效（通常 5 分钟 ~ 24 小时），Vercel 会自动签发 HTTPS 证书

### Netlify 绑定域名

1. 进入 Site settings → **Domain management** → **Add custom domain**
2. 输入域名，按提示添加 DNS 记录（同上）

---

## 日常维护流程

```
修改代码
  ↓
git add .
git commit -m "描述你的修改"
git push
  ↓
Vercel/Netlify 自动检测到 push
  ↓
自动构建 + 部署（约 1 分钟）
  ↓
网站更新完成 ✓
```

---

## 常见问题

**Q: 构建失败怎么办？**
先在本地运行 `npm run build`，确认没有报错再推送。

**Q: 页面空白？**
检查 `vite.config.js` 中是否需要设置 `base` 路径（部署到子目录时需要）。

**Q: 如何回滚到上一个版本？**
Vercel/Netlify 都保留了每次部署的历史记录，在 Dashboard 中点击任意历史版本的 **"Promote to Production"** 即可回滚。
