import {
  MENU_ITEM_STATUS,
  STOP_REASON_LABELS,
  STOP_REASONS,
  type MenuItem,
  type StopReason,
} from "@/entities/menu-item";

export const UNTIL_MODES = {
  SHIFT: "shift",
  DATETIME: "datetime",
} as const;

export type UntilMode = (typeof UNTIL_MODES)[keyof typeof UNTIL_MODES];

export type StopFormValues = {
  reason: StopReason | "";
  until: string | null;
};

export const STOP_REASON_OPTIONS = [
  {
    value: STOP_REASONS.OUT_OF_STOCK,
    label: STOP_REASON_LABELS[STOP_REASONS.OUT_OF_STOCK],
  },
  {
    value: STOP_REASONS.EQUIPMENT,
    label: STOP_REASON_LABELS[STOP_REASONS.EQUIPMENT],
  },
  {
    value: STOP_REASONS.QUALITY,
    label: STOP_REASON_LABELS[STOP_REASONS.QUALITY],
  },
  {
    value: STOP_REASONS.MENU_CHANGE,
    label: STOP_REASON_LABELS[STOP_REASONS.MENU_CHANGE],
  },
];

export const getStopFormValues = (item: MenuItem): StopFormValues => {
  if (item.status.kind === MENU_ITEM_STATUS.STOPPED) {
    return {
      reason: item.status.reason,
      until: item.status.until,
    };
  }

  return {
    reason: "",
    until: null,
  };
};

export const getUntilMode = (until: string | null): UntilMode => {
  return until === null ? UNTIL_MODES.SHIFT : UNTIL_MODES.DATETIME;
};

export const isStopFormComplete = (values: StopFormValues) =>
  values.reason !== "";
