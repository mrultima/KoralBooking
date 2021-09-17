import { InjectionToken } from "@angular/core";
import { SimpleDialog } from "./simple-dialog";

export const SIMPLE_DIALOG_REF = new InjectionToken<SimpleDialog>('*');