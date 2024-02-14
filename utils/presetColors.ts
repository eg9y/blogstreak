export const presetColors = [
  ["red", "#ef4444"], //red
  ["orange", "#f97316"], // orange
  ["amber", "#f59e0b"], // amber
  ["yellow", "#fde047"], // yellow
  ["lime", "#bef264"], // lime
  ["green", "#22c55e"], // green
  ["emerald", "#34d399"], // emerald
  ["teal", "#2dd4bf"], // teal
  ["cyan", "#67e8f9"], // cyan
  ["sky", "#7dd3fc"], // sky
  ["blue", "#3b82f6"], // blue
  ["indigo", "#6366f1"], // indigo
  ["violet", "#8b5cf6"], // violet
  ["purple", "#a855f7"], // purple
  ["fuchsia", "#d946ef"], // fuchsia
  ["pink", "#ec4899"], // pink
  ["rose", "#fb7185"], // rose
  ["zinc", "#71717a"], // zinc
];

export const getHexColor = (displayName: string) => {
  return presetColors.find((presetColor) => {
    return presetColor[0] === displayName;
  });
};
