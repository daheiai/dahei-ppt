import { useEffect, useState } from "react";
import { fetchProjects, type StudioProject } from "./lib/projects-api.js";
import "./styles.css";

type LoadState = "loading" | "ready" | "error";

export function App() {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void fetchProjects()
      .then((nextProjects) => {
        if (!active) {
          return;
        }

        setProjects(nextProjects);
        setSelectedProjectId(nextProjects[0]?.id ?? null);
        setLoadState("ready");
      })
      .catch(() => {
        if (active) {
          setLoadState("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;

  return (
    <main className="studio-shell">
      <aside className="project-rail">
        <div className="brand-block">
          <span className="brand-mark">dp</span>
          <div>
            <h1>dahei-ppt Studio</h1>
            <p>3:2 动画工作台</p>
          </div>
        </div>

        <section className="panel project-panel" aria-labelledby="project-list-title">
          <div className="panel-heading">
            <h2 id="project-list-title">项目</h2>
            <span>{projects.length}</span>
          </div>
          <div className="project-list">
            {loadState === "loading" ? <p className="muted">读取中</p> : null}
            {loadState === "error" ? <p className="status-error">API 连接失败</p> : null}
            {loadState === "ready" && projects.length === 0 ? <p className="muted">暂无项目</p> : null}
            {projects.map((project) => (
              <button
                className={project.id === selectedProjectId ? "project-item is-active" : "project-item"}
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                type="button"
              >
                <span>{project.title}</span>
                <small>{project.id}</small>
              </button>
            ))}
          </div>
        </section>
      </aside>

      <section className="workspace">
        <div className="workspace-header">
          <div>
            <p className="eyebrow">脚本到动画</p>
            <h2>{selectedProject?.title ?? "选择项目"}</h2>
          </div>
          <div className="format-pill">3840 × 2560 · 60fps</div>
        </div>

        <div className="work-grid">
          <section className="panel script-panel" aria-labelledby="script-panel-title">
            <div className="panel-heading">
              <h2 id="script-panel-title">讲稿</h2>
              <span>原文分段</span>
            </div>
            <div className="script-surface">
              <p>
                把完整文案放进这里后，Studio 会进入视觉分区：绿色出镜，红色动画，黄色网络素材，紫色拍摄。
              </p>
            </div>
          </section>

          <section className="panel flow-panel" aria-labelledby="flow-panel-title">
            <div className="panel-heading">
              <h2 id="flow-panel-title">制作阶段</h2>
              <span>v1</span>
            </div>
            <ol className="flow-list">
              <li>
                <span className="flow-dot tone-green"></span>
                <div>
                  <strong>视觉分区</strong>
                  <p>按讲清楚的目标分配画面类型</p>
                </div>
              </li>
              <li>
                <span className="flow-dot tone-red"></span>
                <div>
                  <strong>动画计划</strong>
                  <p>把红色片段拆成单主角页面</p>
                </div>
              </li>
              <li>
                <span className="flow-dot tone-orange"></span>
                <div>
                  <strong>HTML 预览</strong>
                  <p>手动控制节奏，确认视觉重心</p>
                </div>
              </li>
              <li>
                <span className="flow-dot tone-purple"></span>
                <div>
                  <strong>MP4 导出</strong>
                  <p>输出每个项目自己的 exports</p>
                </div>
              </li>
            </ol>
          </section>
        </div>
      </section>
    </main>
  );
}
