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
        args={args}
        result={result}
        toolCallId={toolCallId}
        toolName={toolName}
      />
    );
  }

  if (!result) {
    return (
      <ToolTrace
        args={args}
        result={result}
        toolCallId={toolCallId}
        toolName={toolName}
      />
    );
  }

  if ("error" in result) {
    return (
      <ToolTrace
        args={args}
        result={result}
        toolCallId={toolCallId}
        toolName={toolName}
      />
    );
  }

  const component = getToolComponent(toolName, args, result);
  if (component) {
    return <>{component}</>;
  }

  return (
    <ToolTrace
      args={args}
      result={result}
      toolCallId={toolCallId}
      toolName={toolName}
    />
  );
}
