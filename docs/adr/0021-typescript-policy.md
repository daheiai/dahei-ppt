# ADR 0021: TypeScript 使用策略

## 状态

Accepted

## 背景

`dahei-ppt` 升级后会有制作计划 schema、模板输入、CLI 参数、渲染配置和 Studio 状态。字段结构多，类型错误会带来难查的问题。

## 决策

核心代码使用 TypeScript。临时脚本可以使用 JavaScript。

TypeScript 适用范围：

- CLI
- 制作计划 schema
- HTML 生成器
- 模板输入类型
- 渲染后端接口
- Studio 核心状态

JavaScript 适用范围：

- 临时文件处理脚本
- 一次性迁移脚本
- 小型调试工具

## 影响

- 第一版项目需要 `tsconfig.json`。
- npm scripts 需要支持 TypeScript 执行或编译。
- 制作计划字段可以获得类型检查。
- Codex 生成代码时有明确结构约束。

## 待继续追问

- TypeScript 执行工具使用 `tsx` 还是先编译再运行。
- schema 校验使用 Zod 还是 JSON Schema。
