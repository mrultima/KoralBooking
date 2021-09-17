import { from, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface Window {
  NDEFMessage: NDEFMessage
}
declare class NDEFMessage {
  constructor(messageInit: NDEFMessageInit)
  records: ReadonlyArray<NDEFRecord>
}
declare interface NDEFMessageInit {
  records: NDEFRecordInit[]
}

declare type NDEFRecordDataSource = string | BufferSource | NDEFMessageInit

interface Window {
  NDEFRecord: NDEFRecord
}
declare class NDEFRecord {
  constructor(recordInit: NDEFRecordInit)
  readonly recordType: string
  readonly mediaType?: string
  readonly id?: string
  readonly data?: DataView
  readonly encoding?: string
  readonly lang?: string
  toRecords?: () => NDEFRecord[]
}
declare interface NDEFRecordInit {
  recordType: string
  mediaType?: string
  id?: string
  encoding?: string
  lang?: string
  data?: NDEFRecordDataSource
}

declare type NDEFMessageSource = string | BufferSource | NDEFMessageInit

interface Window {
  NDEFReader: NDEFReader
}
declare class NDEFReader extends EventTarget {
  constructor()
  onreading: (this: this, event: NDEFReadingEvent) => any
  onreadingerror: (this: this, error: Event) => any
  scan: (options?: NDEFScanOptions) => Promise<void>
  write: (
    message: NDEFMessageSource,
    options?: NDEFWriteOptions
  ) => Promise<void>
}

interface Window {
  NDEFReadingEvent: NDEFReadingEvent
}
declare class NDEFReadingEvent extends Event {
  constructor(type: string, readingEventInitDict: NDEFReadingEventInit)
  serialNumber: string
  message: NDEFMessage
}
interface NDEFReadingEventInit extends EventInit {
  serialNumber?: string
  message: NDEFMessageInit
}

interface NDEFWriteOptions {
  overwrite?: boolean
  signal?: AbortSignal
}
interface NDEFScanOptions {
  signal: AbortSignal
}

export class NfcReadingError extends Error {
  constructor(reason) {
    super(`NfcReadingError: ${reason}`);
  }
}

export function fromNfcReader(): Observable<string> {
  if (typeof NDEFReader === 'undefined') {
    return throwError(new NfcReadingError('No Reader'));
  }
  const scanner = new NDEFReader();
  return from(scanner.scan()).pipe(
    switchMap(() => {
      return new Observable<string>(subscriber => {
        const onNfcValidTag = ({ message, serialNumber }: NDEFReadingEvent): void => {
          const rfid = serialNumber.split(':').join('').toLowerCase();
          subscriber.next(rfid);
        };
        const onNfcInvalidTag = (): void => {
          subscriber.error(new NfcReadingError('Invalid Tag'));
        };
        scanner.addEventListener('reading', onNfcValidTag);
        scanner.addEventListener('readingerror', onNfcInvalidTag);
        return () => {
          scanner.removeEventListener('reading', onNfcValidTag);
          scanner.removeEventListener('readingerror', onNfcInvalidTag);
        };
      });
    }),
  );
}
