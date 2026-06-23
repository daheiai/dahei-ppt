interface ScriptImportPanelProps {
  id: string;
  title: string;
  script: string;
  busy: boolean;
  status: string;
  onIdChange(value: string): void;
  onTitleChange(value: string): void;
  onScriptChange(value: string): void;
  onImport(): void;
}

export function ScriptImportPanel({
  id,
  title,
  script,
  busy,
  status,
  onIdChange,
  onTitleChange,
  onScriptChange,
  onImport
}: ScriptImportPanelProps) {
  return (
    <section className="panel import-panel" aria-labelledby="import-panel-title">
      <div className="panel-heading">
        <h2 id="import-panel-title">导入文案</h2>
        <span>AI 分区</span>
      </div>
      <div className="import-form">
        <label className="compact-field">
          <span>项目 ID</span>
          <input
            placeholder="my-video"
            value={id}
            onChange={(event) => onIdChange(toProjectId(event.target.value))}
            type="text"
          />
        </label>
        <label className="compact-field">
          <span>标题</span>
          <input value={title} onChange={(event) => onTitleChange(event.target.value)} type="text" />
        </label>
        <label className="compact-field import-script-field">
          <span>完整文案</span>
          <textarea
            placeholder="把整篇文章或视频文案粘贴到这里"
            value={script}
            onChange={(event) => onScriptChange(event.target.value)}
          />
        </label>
        <button className="primary-action" disabled={busy || !id || !script.trim()} onClick={onImport} type="button">
          导入并生成视觉分区
        </button>
        {status ? <p className="action-status">{status}</p> : null}
      </div>
    </section>
  );
}

function toProjectId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
