interface RenderPanelProps {
  busy: boolean;
  status: string;
  onGenerateHtml(): void;
  onRender(): void;
}

export function RenderPanel({ busy, status, onGenerateHtml, onRender }: RenderPanelProps) {
  return (
    <section className="panel render-panel" aria-labelledby="render-panel-title">
      <div className="panel-heading">
        <h2 id="render-panel-title">导出</h2>
        <span>MP4</span>
      </div>
      <div className="render-actions">
        <button className="primary-action" disabled={busy} onClick={onGenerateHtml} type="button">
          生成 HTML
        </button>
        <button className="secondary-action" disabled={busy} onClick={onRender} type="button">
          渲染 MP4
        </button>
        {status ? <p className="action-status">{status}</p> : null}
      </div>
    </section>
  );
}
