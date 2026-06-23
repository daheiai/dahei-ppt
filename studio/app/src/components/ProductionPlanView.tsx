import type { SegmentDetail } from "../lib/projects-api.js";

interface ProductionPlanViewProps {
  segmentDetail: SegmentDetail | null;
}

export function ProductionPlanView({ segmentDetail }: ProductionPlanViewProps) {
  const pages = Array.isArray(segmentDetail?.productionPlan?.pages) ? segmentDetail.productionPlan.pages : [];

  return (
    <section className="panel production-panel" aria-labelledby="production-plan-title">
      <div className="panel-heading">
        <h2 id="production-plan-title">动画计划</h2>
        <span>{pages.length}</span>
      </div>

      {pages.length > 0 ? (
        <div className="page-plan-list">
          {pages.map((page, index) => (
            <article className="page-plan-item" key={String(page.id ?? index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{String(page.text?.title ?? page.visual_subject ?? page.id)}</strong>
                <p>{String(page.purpose ?? page.keep_reason ?? "")}</p>
              </div>
              <small>{Number(page.duration ?? 0)}s</small>
            </article>
          ))}
        </div>
      ) : (
        <div className="markdown-plan">{segmentDetail?.productionPlanMarkdown ?? "暂无动画计划"}</div>
      )}
    </section>
  );
}
