export interface FileObjectImpl {
  size_text: string;
  size: number;
  url: string;
  name: string;
  isImage?: boolean;
}
export interface FileMaxStorageImpl {
  bucket: string;
  size_text: string;
  size: number;
  max_size_text: string;
  max_size: number;
}
