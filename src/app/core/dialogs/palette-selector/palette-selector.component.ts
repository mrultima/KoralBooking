import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaletteSelectorService } from './palette-selector.service';

import {
  PortalPaletteHueColors,
  AppService,
  StyleManager,
  ApiService,
  DialogService,
  PortalService,
  StyleVariablesService,
} from '../../shared';

import { MatDialogRef } from '@angular/material/dialog';
import { ColorPickerPalettes, ColorPickerColor } from '../../components/color-picker';

@Component({
  selector: 'ta-core-palette-selector',
  templateUrl: './palette-selector.component.html',
  styleUrls: ['./palette-selector.component.scss']
})
export class PaletteSelectorComponent implements OnInit {

  primary: PortalPaletteHueColors;
  accent: PortalPaletteHueColors;
  warn: PortalPaletteHueColors;

  focus = new BehaviorSubject<'primary' | 'accent' | 'warn'>('primary');

  focusMap = this.focus.pipe(map(value => {
    switch (value) {
      case 'primary':
        return this.primary ? this.primary.default.hex : undefined;
      case 'accent':
        return this.accent ? this.accent.default.hex : undefined;
      // case 'warn':
      //   return this.warn ? this.warn.default.hex : undefined;
    }
  }));

  constructor(
    public dialogRef: MatDialogRef<PaletteSelectorComponent>,
    private appService: AppService,
    private variableService: StyleVariablesService,
    private styleManager: StyleManager,
    private paletteSelectorService: PaletteSelectorService,
    private apiService: ApiService,
    private dialogService: DialogService,
    private portalService: PortalService,
  ) {
  }

  ngOnInit() {
    this.init();
  }

  init(hardReset = false) {
    let theme = this.appService._currentTheme.getValue();
    if (hardReset) {
      theme = this.paletteSelectorService.defaultTheme;
    }
    if (!this.paletteSelectorService.defaultTheme) {
      this.paletteSelectorService.defaultTheme = JSON.parse(JSON.stringify(theme));
    }
    this.primary = theme.primary;
    this.accent = theme.accent;
    if (hardReset) {
      this.appService.currentTheme.next(theme);
    }
  }

  onColorSet({color, palette}: { palette: ColorPickerPalettes; color: ColorPickerColor }) {
    const theme = this.appService._currentTheme.getValue();
    switch (this.focus.getValue()) {
      case 'primary':
        this.primary = this.variableService.getColorFromPalette(palette.name, color.hue);
        theme.primary = this.primary;
        break;
      case 'accent':
        this.accent = this.variableService.getColorFromPalette(palette.name, color.hue);
        theme.accent = this.accent;
        break;
      // case 'warn':
      //   this.warn = this.variableService.getColorFromPalette(palette.name, color.hue);
      //   break;
    }
    this.appService.currentTheme.next(theme);
  }

  async onSave() {
    const ref = await this.dialogService.openFullscreenLoading('change-theme');

    const resp = await this.apiService.execSP({
      Object: 'SP_PORTALV4_SETCOLORS',
      Parameters: {
        COLORS: JSON.stringify(this.appService._currentTheme.getValue()),
        PORTAL_DOMAINID: this.portalService.portalConfig.PORTALDOMAINID,
        HOTELID: this.appService.hotelID
      }
    });

    ref.detach();
  }

  onClose() {
    this.dialogRef.close();
  }
}
