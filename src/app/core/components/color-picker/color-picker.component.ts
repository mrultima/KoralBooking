import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StyleVariablesService } from '../../shared';

export interface ColorPickerPalettes {
  name: string;
  values: Array<ColorPickerColor>;
}

export interface ColorPickerColor {
  hue: string;
  hex: string;
  contrast: string;
}

@Component({
  selector: 'ta-core-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  _selectedHex: string;
  @Input() set selectedHex(selectedHex: string) {
    if (selectedHex) {
      this._selectedHex = selectedHex;
    } else {
      this._selectedHex = undefined;
    }
  }

  get selectedHex() {
    return this._selectedHex;
  }

  @Output() colorChanges = new EventEmitter<{ palette: ColorPickerPalettes, color: ColorPickerColor }>();

  palettes: ColorPickerPalettes[] = [];
  hues = [
    {val: '50', isA: false},
    {val: '100', isA: false},
    {val: '200', isA: false},
    {val: '300', isA: false},
    {val: '400', isA: false},
    {val: '500', isA: false},
    {val: '600', isA: false},
    {val: '700', isA: false},
    {val: '800', isA: false},
    {val: '900', isA: false},
    {val: '100', isA: true},
    {val: '200', isA: true},
    {val: '400', isA: true},
    {val: '700', isA: true}
  ];
  labels = [
    'red',
    'pink',
    'purple',
    'deepPurple',
    'indigo',
    'blue',
    'lightBlue',
    'cyan',
    'teal',
    'green',
    'lightGreen',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deepOrange',
    'brown',
    'grey',
    'blueGrey'
  ];

  constructor(private variables: StyleVariablesService) {
    for (const palette of Object.keys(this.variables.palette)) {
      this.palettes.push({
        name: palette,
        values: [
          ...Object.keys(this.variables.palette[palette]).map(x => {
            return {
              hue: x,
              ...{
                hex: this.variables.palette[palette][x].default.hex,
                contrast: this.variables.getTextColor(this.variables.palette[palette][x].default.contrast)
              }
            };
          })
        ]
      });
    }
  }

  ngOnInit() {
  }

  onColorSelect(palette: ColorPickerPalettes, color: ColorPickerColor) {
    this.colorChanges.emit({palette, color});
    this.selectedHex = color.hex;
  }
}
