"use client";

import { ToolTrace } from "../vf-ui/ToolTrace";
import { AgentDelegationCard } from "./agent-delegation-card";
import { getToolComponent } from "./tool-component-map";

interface ToolResultRouterProps {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: Record<string, unknown>;
}

const AGENT_TOOLS = new Set([
  "investigateData",
  "analyzeGeography",
  "medicalReasoning",
  "researchWeb",
]);

export function ToolResultRouter({
  toolCallId,
  toolName,
  args,
  result,
}: ToolResultRouterProps) {
  if (AGENT_TOOLS.has(toolName)) {
    return (
      <AgentDelegationCard
        toolCallId={toolCallId}
        toolName={toolName}
        args={args}
        result={result}
      />
    );
  }

  if (!result) {
    return (
      <ToolTrace
        toolCallId={toolCallId}
        toolName={toolName}
        args={args}
        result={result}
      />
    );
  }

  if ("error" in result) {
    return (
      <ToolTrace
        toolCallId={toolCallId}
        toolName={toolName}
        args={args}
        result={result}
      />
    );
  }

  const component = getToolComponent(toolName, args, result);
  if (component) {
    return <>{component}</>;
  }

  return (
    <ToolTrace
      toolCallId={toolCallId}
      toolName={toolName}
      args={args}
      result={result}
    />
  );
}

