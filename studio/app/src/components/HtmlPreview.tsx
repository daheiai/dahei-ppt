interface HtmlPreviewProps {
  html: string | null;
}

export function HtmlPreview({ html }: HtmlPreviewProps) {
  return (
    <section className="panel html-preview-panel" aria-labelledby="html-preview-title">
      <div className="panel-heading">
        <h2 id="html-preview-title">HTML 预览</h2>
        <span>3:2</span>
      </div>

      <div className="preview-frame-wrap">
        {html ? <iframe className="preview-frame" srcDoc={html} title="slides.html preview" /> : <p>暂无预览</p>}
      </div>
    </section>
  );
}
