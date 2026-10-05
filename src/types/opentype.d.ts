declare module "opentype.js" {
  export interface FontBoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
  export interface Path {
    toPathData(decimalPlaces?: number): string;
    getBoundingBox(): FontBoundingBox;
  }
  export interface Font {
    supported: boolean;
    numGlyphs: number;
    getPath(
      text: string,
      x: number,
      y: number,
      fontSize: number,
      options?: {
        kerning?: boolean;
        letterSpacing?: number;
        features?: Record<string, boolean>;
      }
    ): Path;
  }
  export function parse(buffer: ArrayBuffer | Uint8Array): Font;
  export function load(url: string): Promise<Font>;
}
