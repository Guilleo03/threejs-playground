export const desktopStages = [
  // Stage 1: Vertical and horizontal aligned (center)
  { position: [0, 0, 0], rotation: [0, Math.PI / 1.5, 0], scale: [1, 1, 1] },
  // Stage 2: Aligned to the left
  { position: [1.5, 0, 0], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1] },
  // Stage 3: Aligned to the right
  {
    position: [-1, 0, 0],
    rotation: [Math.PI / 1.8, 0, -Math.PI / 0.9],
    scale: [0.8, 0.8, 0.8],
  },
  // Stage 4: Vertical and horizontal aligned (center)
  { position: [0, 0, 0], rotation: [0, Math.PI / 1.5, 0], scale: [1, 1, 1] },
];

export const mobileStages = [
  // Stage 1: Vertical and horizontal aligned (center)
  {
    position: [0, 0, 0],
    rotation: [0, Math.PI / 1.5, 0],
    scale: [0.4, 0.4, 0.4],
  },
  // Stage 2: Aligned to the left
  {
    position: [1.5, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
    scale: [0.4, 0.4, 0.4],
  },
  // Stage 3: Aligned to the right
  {
    position: [-1, 0, 0],
    rotation: [Math.PI / 1.8, 0, -Math.PI / 0.9],
    scale: [0.8, 0.8, 0.8],
  },
  // Stage 4: Vertical and horizontal aligned (center)
  {
    position: [0, 0, 0],
    rotation: [0, Math.PI / 1.5, 0],
    scale: [0.4, 0.4, 0.4],
  },
];
