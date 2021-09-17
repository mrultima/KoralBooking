import { Observable, Subject } from 'rxjs';
import { ApiSelectOptions } from '../services/api.service';

export interface AppLookupConfigModel {
    request?: ApiSelectOptions;
    requestFn?: (searchTerm: string, cancelSubject?: Subject<void>) => Observable<any[]> | Promise<any[]>;
    searchMode?: 'contains' | 'endsWith' | 'manual';
    keyField: string;
    displayField: string;
    additionalFields?: any;
    label?: string;
    required?: boolean;
    minLength?: number;
    delay?: number;
    auditTime?: number;
    limit?: number;
    recordFn?: (value: any) => void;
    gridFn?: (value: any) => void;
    formatter?: (value: any) => string;
    displayer?: (value: any) => any[];
    optionStyle?: { [k: string]: string };
    panelWidth?: string;
    returnField?: string;
    customButton?: {
        icon: string;
        tooltip?: string;
        callbackFn: (e: Event) => void
    }
}
