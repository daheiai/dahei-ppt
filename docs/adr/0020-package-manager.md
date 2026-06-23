# ADR 0020: 包管理器

## 状态

Accepted

## 背景

第一版 `dahei-ppt` 项目化升级需要 Node/TypeScript、CLI、Studio 和 HyperFrames 调用。包管理器应优先降低安装和维护成本。

## 决策

使用 npm 作为第一版包管理器。

## 影响

- 使用 `package-lock.json` 锁定依赖。
- 安装命令为 `npm install`。
- 本地命令通过 `npm run ...` 执行。
- 后续如依赖管理变复杂，可以再评估 pnpm 或 bun。
- Studio 使用 Vite + React，见 ADR 0031。
