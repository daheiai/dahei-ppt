import type { ProjectDetail, VisualRoutingSegment } from "../lib/projects-api.js";
import { getVisualModeMeta } from "../lib/visualMode.js";
import { SegmentPanel } from "./SegmentPanel.js";

interface VisualRoutingEditorProps {
  project: ProjectDetail | null;
  selectedSegmentId: string | null;
  saving: boolean;
  actionStatus: string;
  onSelectSegment(segmentId: string): void;
  onChangeSegment(segmentId: string, update: Partial<VisualRoutingSegment>): void;
  onSave(): void;
  onCreateSegment(segmentId: string): void;
}

export function VisualRoutingEditor({
  project,
  selectedSegmentId,
  saving,
  actionStatus,
  onSelectSegment,
  onChangeSegment,
  onSave,
  onCreateSegment
}: VisualRoutingEditorProps) {
  const segments = project?.visualRouting?.segments ?? [];
  const selectedSegment = segments.find((segment) => segment.id === selectedSegmentId) ?? segments[0] ?? null;

  return (
    <div className="routing-grid">
      <section className="panel routing-panel" aria-labelledby="routing-panel-title">
        <div className="panel-heading">
          <h2 id="routing-panel-title">视觉分区</h2>
          <span>{segments.length}</span>
        </div>

        {segments.length > 0 ? (
          <div className="routing-segments">
            {segments.map((segment, index) => {
              const modeMeta = getVisualModeMeta(segment.visual_mode);
              const isActive = selectedSegment?.id === segment.id;

              return (
                <button
                  className={`routing-segment ${modeMeta.toneClass}${isActive ? " is-active" : ""}`}
                  key={segment.id}
                  onClick={() => onSelectSegment(segment.id)}
                  type="button"
                >
                  <span className="segment-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="segment-text">{segment.source_text}</span>
                  <span className="segment-mode">{modeMeta.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">暂无视觉分区</div>
        )}
      </section>

      <SegmentPanel
        actionStatus={actionStatus}
        onChange={(update) => {
          if (selectedSegment) {
            onChangeSegment(selectedSegment.id, update);
          }
        }}
        onCreateSegment={() => {
          if (selectedSegment) {
            onCreateSegment(selectedSegment.id);
          }
        }}
        onSave={onSave}
        saving={saving}
        segment={selectedSegment}
      />
    </div>
  );
}
