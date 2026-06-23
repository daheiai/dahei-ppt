# ADR 0031: Studio 前端技术栈

## 状态

Accepted

## 背景

Studio 第一版需要完整 UI：项目列表、文案输入、画面形态分区编辑器、制作计划确认、HTML 预览和 MP4 导出状态。项目主链路已经选择 Node/TypeScript、npm、Zod 和 HyperFrames。

## 决策

Studio 第一版使用 Vite + React + TypeScript。

本地服务由 Node/TypeScript 提供文件读写和 CLI 调用能力。

## 架构

```text
studio/
  app/          # Vite + React UI
  server/       # 本地 Node API
  projects/     # 本地项目文件
```

UI 通过本地 API 读取和写入项目文件：

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id/script`
- `PUT /api/projects/:id/visual-routing`
- `POST /api/projects/:id/segments`
- `POST /api/projects/:id/segments/:segmentId/render`

## 采用理由

- React 适合做左右双栏编辑器和状态管理。
- Vite 启动快，适合本地工作台。
- TypeScript 与 Zod schema 共用类型。
- Node API 可以安全地封装本地文件操作和渲染 CLI。

## 影响

- 根目录需要 `package.json`、`tsconfig.json` 和 npm scripts。
- Studio UI 与 CLI 共享 schema 包。
- 第一版以本地开发服务器运行 Studio。
- 后续打包桌面版时，可以复用同一套前端和本地 API。
