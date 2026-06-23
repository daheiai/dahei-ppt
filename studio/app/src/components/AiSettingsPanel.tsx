import type { AiProviderId, PublicAiSettings } from "../lib/projects-api.js";

interface AiSettingsPanelProps {
  settings: PublicAiSettings | null;
  saving: boolean;
  status: string;
  onChange(settings: PublicAiSettings): void;
  onSave(): void;
}

const providerLabels: Record<AiProviderId, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic"
};

export function AiSettingsPanel({ settings, saving, status, onChange, onSave }: AiSettingsPanelProps) {
  if (!settings) {
    return (
      <section className="panel ai-settings-panel" aria-labelledby="ai-settings-title">
        <div className="panel-heading">
          <h2 id="ai-settings-title">AI 设置</h2>
          <span>读取中</span>
        </div>
      </section>
    );
  }

  function updateSelectedProvider(provider: AiProviderId): void {
    onChange({ ...settings!, selectedProvider: provider });
  }

  function updateProvider(provider: AiProviderId, field: "baseUrl" | "apiKey" | "model", value: string): void {
    onChange({
      ...settings!,
      providers: {
        ...settings!.providers,
        [provider]: {
          ...settings!.providers[provider],
          [field]: value
        }
      }
    });
  }

  return (
    <section className="panel ai-settings-panel" aria-labelledby="ai-settings-title">
      <div className="panel-heading">
        <h2 id="ai-settings-title">AI 设置</h2>
        <span>{providerLabels[settings.selectedProvider]}</span>
      </div>

      <div className="ai-settings-body">
        <label className="compact-field">
          <span>当前供应商</span>
          <select
            value={settings.selectedProvider}
            onChange={(event) => updateSelectedProvider(event.target.value as AiProviderId)}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>
        </label>

        {(["openai", "anthropic"] as AiProviderId[]).map((provider) => (
          <div className="provider-settings" key={provider}>
            <h3>{providerLabels[provider]}</h3>
            <label className="compact-field">
              <span>请求地址</span>
              <input
                value={settings.providers[provider].baseUrl}
                onChange={(event) => updateProvider(provider, "baseUrl", event.target.value)}
                type="url"
              />
            </label>
            <label className="compact-field">
              <span>模型名称</span>
              <input
                placeholder="手动填写"
                value={settings.providers[provider].model}
                onChange={(event) => updateProvider(provider, "model", event.target.value)}
                type="text"
              />
            </label>
            <label className="compact-field">
              <span>API Key</span>
              <input
                placeholder={settings.providers[provider].hasApiKey ? "已保存，留空保留" : "本机保存"}
                value={settings.providers[provider].apiKey}
                onChange={(event) => updateProvider(provider, "apiKey", event.target.value)}
                type="password"
              />
            </label>
          </div>
        ))}

        <button className="primary-action" disabled={saving} onClick={onSave} type="button">
          保存 AI 设置
        </button>
        {status ? <p className="action-status">{status}</p> : null}
      </div>
    </section>
  );
}
