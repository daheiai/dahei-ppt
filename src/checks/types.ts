export interface QualityIssue {
  code: string;
  message: string;
  path: string;
  severity: "error" | "warning";
}

export interface QualityCheckResult {
  ok: boolean;
  issues: QualityIssue[];
}

export function createResult(issues: QualityIssue[]): QualityCheckResult {
  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    issues
  };
}
