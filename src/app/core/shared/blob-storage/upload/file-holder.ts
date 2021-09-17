export interface IUploadResponse {
  originalFilename: string;
  filename: string;
  progress: number;
  container: string;
  url: string;
  thumbnailUrl?: string;
}

export interface IExtraParams {
  [k: string]: any
}

export class FileHolder {
  pending = false;
  progress = 0;
  filesize?: number;
  size?: ImageSize;
  type?: string;
  extension?: string;
  thumbnail?: ImageThumbnail;
  params?: IExtraParams;
  existing?: boolean;
  default?: boolean;
  caption?: string;
  constructor(public src: string, public file: File, public uploaded = true) { }
}

export class ImageThumbnail {
  file?: File;
  size?: ImageSize;
  src?: string;
}

export interface IUploadedFile extends UploadedFile {
  blob?: Blob
}

export interface ImageDimensionSettings {
  maxWidth?: number;
  maxHeight?: number;
}

export interface SupportedImageDimensions extends ImageDimensionSettings {
  minWidth?: number;
  minHeight?: number;
}

export class ImageSize {
  width: number;
  height: number;
}

export class UploadedFile {
  url: string;
  filename: string;
  type?: string;
  size?: ImageSize;
  filesize?: number;
  extension?: string;
  thumbnail?: {
    url: string;
    size?: ImageSize;
  };
  params?: IExtraParams;
  default?: boolean;
  caption?: string;
}

export type IStyleProps = {
  [k: string]: string
}

export interface HolderStyle {
  selectButton?: IStyleProps;
  uploadButton?: IStyleProps;
  saveButton?: IStyleProps;
  clearButton?: IStyleProps;
  layout?: IStyleProps;
  previewPanel?: IStyleProps;
  snapPhoto?: IStyleProps;
}
