import type { BoundaryAction, UserStatus, VisualMode, VisualRoutingSegment } from "../lib/projects-api.js";
import { VISUAL_MODE_OPTIONS, getVisualModeMeta } from "../lib/visualMode.js";

interface SegmentPanelProps {
  segment: VisualRoutingSegment | null;
  saving: boolean;
  actionStatus: string;
  onChange(update: Partial<VisualRoutingSegment>): void;
  onSave(): void;
  onCreateSegment(): void;
}

const boundaryActions: Array<{ value: BoundaryAction; label: string }> = [
  { value: "keep", label: "保留" },
  { value: "split", label: "拆开" },
  { value: "merge", label: "合并" }
];

const userStatuses: Array<{ value: UserStatus; label: string }> = [
  { value: "pending", label: "待确认" },
  { value: "accepted", label: "已确认" },
  { value: "edited", label: "已编辑" }
];

export function SegmentPanel({
  segment,
  saving,
  actionStatus,
  onChange,
  onSave,
  onCreateSegment
}: SegmentPanelProps) {
  if (!segment) {
    return (
      <section className="panel segment-panel" aria-labelledby="segment-panel-title">
        <div className="panel-heading">
          <h2 id="segment-panel-title">片段</h2>
          <span>空</span>
        </div>
        <div className="empty-state">暂无片段</div>
      </section>
    );
  }

  const modeMeta = getVisualModeMeta(segment.visual_mode);

  return (
    <section className="panel segment-panel" aria-labelledby="segment-panel-title">
      <div className="panel-heading">
        <h2 id="segment-panel-title">片段</h2>
        <span className={`mode-badge ${modeMeta.toneClass}`}>{modeMeta.label}</span>
      </div>

      <div className="segment-form">
        <label>
          <span>边界</span>
          <select
            value={segment.boundary_action}
            onChange={(event) => onChange({ boundary_action: event.target.value as BoundaryAction })}
          >
            {boundaryActions.map((action) => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>画面</span>
          <select
            value={segment.visual_mode}
            onChange={(event) => onChange({ visual_mode: event.target.value as VisualMode })}
          >
            {VISUAL_MODE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>状态</span>
          <select
            value={segment.user_status}
            onChange={(event) => onChange({ user_status: event.target.value as UserStatus })}
          >
            {userStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-field">
          <span>边界理由</span>
          <textarea
            value={segment.boundary_reason}
            onChange={(event) => onChange({ boundary_reason: event.target.value })}
          />
        </label>

        <label className="text-field">
          <span>画面理由</span>
          <textarea
            value={segment.visual_mode_reason}
            onChange={(event) => onChange({ visual_mode_reason: event.target.value })}
          />
        </label>

        <label className="checkbox-field">
          <input
            checked={segment.animation_candidate}
            onChange={(event) => onChange({ animation_candidate: event.target.checked })}
            type="checkbox"
          />
          <span>动画候选</span>
        </label>

        <div className="segment-actions">
          <button className="primary-action" disabled={saving} onClick={onSave} type="button">
            保存分区
          </button>
          <button
            className="secondary-action"
            disabled={saving || segment.visual_mode !== "animation"}
            onClick={onCreateSegment}
            type="button"
          >
            进入动画制作
          </button>
        </div>
        {actionStatus ? <p className="action-status">{actionStatus}</p> : null}
      </div>
    </section>
  );
}
