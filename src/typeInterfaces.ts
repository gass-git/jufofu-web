interface Position {
  x: number;
  y: number;
  frameCount: number;
}

interface BlockImage {
  [key: string]: object
}

export { Position, BlockImage }