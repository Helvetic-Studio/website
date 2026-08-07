"use client";

import { cn } from "@website/ui/lib/utils";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import type { TooltipValueType } from "recharts";

// Format: [THEME_NAME, CSS_SELECTOR]
const THEME_ENTRIES = [
  ["light", ""],
  ["dark", ".dark"],
] as const;
export type ChartTheme = (typeof THEME_ENTRIES)[number][0];

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;
const EMPTY_CHART_PAYLOAD = [] as const;
export type TooltipNameType = number | string;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<ChartTheme, string> }
  )
>;

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

interface ChartIndicatorStyle extends React.CSSProperties {
  "--color-bg"?: string | undefined;
  "--color-border"?: string | undefined;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getDisplayKey = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
  }

  return "value";
};

const getIndicatorColor = (
  color: string | undefined,
  payload: unknown,
  fallbackColor: string | undefined
): string | undefined => {
  if (color !== undefined) {
    return color;
  }

  if (isRecord(payload) && typeof payload["fill"] === "string") {
    return payload["fill"];
  }

  return fallbackColor;
};

const getPayloadConfigFromPayload = (
  config: ChartConfig,
  payload: unknown,
  key: string
): ChartConfig[string] | undefined => {
  if (!isRecord(payload)) {
    return undefined;
  }

  const nestedPayload = isRecord(payload["payload"])
    ? payload["payload"]
    : undefined;
  const payloadKey = payload[key];
  const nestedPayloadKey = nestedPayload?.[key];
  let configLabelKey = key;
  if (typeof payloadKey === "string") {
    configLabelKey = payloadKey;
  } else if (typeof nestedPayloadKey === "string") {
    configLabelKey = nestedPayloadKey;
  }

  return config[configLabelKey] ?? config[key];
};

const useChart = () => {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
};

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) =>
      itemConfig.theme !== undefined || itemConfig.color !== undefined
  );

  if (colorConfig.length === 0) {
    return null;
  }

  const stylesheet = THEME_ENTRIES.map(
    ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme] ?? itemConfig.color;
    return typeof color === "string" && color.length > 0
      ? `  --color-${key}: ${color};`
      : null;
  })
  .join("\n")}
}
`
  ).join("\n");

  return <style>{stylesheet}</style>;
};

const ChartContainer = ({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
  initialDimension?: {
    width: number;
    height: number;
  };
}) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replaceAll(":", "")}`;
  const contextValue = React.useMemo(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = ({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) => {
  const { config } = useChart();
  const tooltipPayload = payload ?? EMPTY_CHART_PAYLOAD;

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || tooltipPayload.length === 0) {
      return null;
    }

    const [item] = tooltipPayload;
    const key = getDisplayKey(labelKey, item?.dataKey, item?.name);
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const hasLabelKey = typeof labelKey === "string" && labelKey.length > 0;
    const value =
      !hasLabelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter !== undefined) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, tooltipPayload)}
        </div>
      );
    }

    if (
      value === null ||
      value === undefined ||
      value === false ||
      value === ""
    ) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    tooltipPayload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (active !== true || tooltipPayload.length === 0) {
    return null;
  }

  const nestLabel = tooltipPayload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-none border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {nestLabel ? null : tooltipLabel}
      <div className="grid gap-1.5">
        {tooltipPayload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = getDisplayKey(nameKey, item.name, item.dataKey);
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = getIndicatorColor(
              color,
              item.payload,
              item.color
            );
            const indicatorStyle: ChartIndicatorStyle = {
              "--color-bg": indicatorColor,
              "--color-border": indicatorColor,
            };
            const itemName = item.name;
            const hasItemName =
              typeof itemName === "string" || typeof itemName === "number";

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter !== undefined &&
                item.value !== undefined &&
                hasItemName ? (
                  formatter(item.value, itemName, item, index, tooltipPayload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={indicatorStyle}
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value !== null && item.value !== undefined && (
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = ({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps) => {
  const { config } = useChart();
  const legendPayload = payload ?? [];

  if (legendPayload.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {legendPayload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = getDisplayKey(nameKey, item.dataKey);
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon !== undefined && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
};

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
