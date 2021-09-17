import { Injectable } from '@angular/core';

interface PortalPalette {
  'red': PortalPaletteHue;
  'pink': PortalPaletteHue;
  'purple': PortalPaletteHue;
  'deepPurple': PortalPaletteHue;
  'indigo': PortalPaletteHue;
  'blue': PortalPaletteHue;
  'lightBlue': PortalPaletteHue;
  'cyan': PortalPaletteHue;
  'teal': PortalPaletteHue;
  'green': PortalPaletteHue;
  'lightGreen': PortalPaletteHue;
  'lime': PortalPaletteHue;
  'yellow': PortalPaletteHue;
  'amber': PortalPaletteHue;
  'orange': PortalPaletteHue;
  'deepOrange': PortalPaletteHue;
  'brown': PortalPaletteHue;
  'grey': PortalPaletteHue;
  'blueGrey': PortalPaletteHue;
}

export interface PortalPaletteHueColors {
  default: PortalPaletteColor;
  lighter: PortalPaletteColor;
  darker: PortalPaletteColor;
  secondary?: PortalPaletteColor;
}

interface PortalPaletteColor {
  hex: string;
  contrast: string;
}

type PortalPaletteHue = { [l in PortalPaletteHues]: PortalPaletteHueColors };

type PortalPaletteHues = '50' |
  '100' |
  '200' |
  '300' |
  '400' |
  '500' |
  '600' |
  '700' |
  '800' |
  '900' |
  'A100' |
  'A200' |
  'A400' |
  'A700';

@Injectable({
  providedIn: 'root'
})
export class StyleVariablesService {

  darkText = 'rgba(0, 0, 0, 0.87)';
  lightText = 'white';

  palette: PortalPalette = {
    'red': {
      '50': {
        'default': {
          'hex': '#ffebee',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ccb9bc',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#ffcdd2',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cb9ca1',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#ef9a9a',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffcccb',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ba6b6c',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#e57373',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffa4a2',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#af4448',
          'contrast': 'white'
        }
      },
      '400': {
        'default': {
          'hex': '#ef5350',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ff867c',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b61827',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#f44336',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff7961',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ba000d',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#e53935',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff6f60',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ab000d',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#d32f2f',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff6659',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#9a0007',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#c62828',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff5f52',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#8e0000',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#b71c1c',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#f05545',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#7f0000',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#ff8a80',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffbcaf',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c85a54',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#ff5252',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff867f',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c50e29',
          'contrast': 'white'
        }
      },
      'A400': {
        'default': {
          'hex': '#ff1744',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff616f',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c4001d',
          'contrast': 'white'
        }
      },
      'A700': {
        'default': {
          'hex': '#d50000',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff5131',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#9b0000',
          'contrast': 'white'
        }
      }
    },
    'pink': {
      '50': {
        'default': {
          'hex': '#fce4ec',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c9b2ba',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#f8bbd0',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffeeff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c48b9f',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#f48fb1',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffc1e3',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bf5f82',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#f06292',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ff94c2',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ba2d65',
          'contrast': 'white'
        }
      },
      '400': {
        'default': {
          'hex': '#ec407a',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ff77a9',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b4004e',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#e91e63',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff6090',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b0003a',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#d81b60',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff5c8d',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#a00037',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#c2185b',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#fa5788',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#8c0032',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#ad1457',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#e35183',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#78002e',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#880e4f',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#bc477b',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#560027',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#ff80ab',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffb2dd',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c94f7c',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#ff4081',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff79b0',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c60055',
          'contrast': 'white'
        }
      },
      'A400': {
        'default': {
          'hex': '#f50057',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff5983',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bb002f',
          'contrast': 'white'
        }
      },
      'A700': {
        'default': {
          'hex': '#c51162',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#fd558f',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#8e0038',
          'contrast': 'white'
        }
      }
    },
    'purple': {
      '50': {
        'default': {
          'hex': '#f3e5f5',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c0b3c2',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#e1bee7',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fff1ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#af8eb5',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#ce93d8',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffc4ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#9c64a6',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#ba68c8',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ee98fb',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#883997',
          'contrast': 'white'
        }
      },
      '400': {
        'default': {
          'hex': '#ab47bc',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#df78ef',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#790e8b',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#9c27b0',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#d05ce3',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#6a0080',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#8e24aa',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#c158dc',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#5c007a',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#7b1fa2',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ae52d4',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4a0072',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#6a1b9a',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#9c4dcc',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#38006b',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#4a148c',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#7c43bd',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#12005e',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#ea80fc',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffb2ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b64fc8',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#e040fb',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff79ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#aa00c7',
          'contrast': 'white'
        }
      },
      'A400': {
        'default': {
          'hex': '#d500f9',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff5bff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#9e00c5',
          'contrast': 'white'
        }
      },
      'A700': {
        'default': {
          'hex': '#aa00ff',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#e254ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#7200ca',
          'contrast': 'white'
        }
      }
    },
    'deepPurple': {
      '50': {
        'default': {
          'hex': '#ede7f6',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bbb5c3',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#d1c4e9',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fff7ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#a094b7',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#b39ddb',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e6ceff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#836fa9',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#9575cd',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#c7a4ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#65499c',
          'contrast': 'white'
        }
      },
      '400': {
        'default': {
          'hex': '#7e57c2',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#b085f5',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4d2c91',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#673ab7',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#9a67ea',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#320b86',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#5e35b1',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#9162e4',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#280680',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#512da8',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#8559da',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#140078',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#4527a0',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#7953d2',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#000070',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#311b92',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#6746c3',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#000063',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#b388ff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e7b9ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#805acb',
          'contrast': 'white'
        }
      },
      'A200': {
        'default': {
          'hex': '#7c4dff',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#b47cff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#3f1dcb',
          'contrast': 'white'
        }
      },
      'A400': {
        'default': {
          'hex': '#651fff',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#a255ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0100ca',
          'contrast': 'white'
        }
      },
      'A700': {
        'default': {
          'hex': '#6200ea',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#9d46ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0a00b6',
          'contrast': 'white'
        }
      }
    },
    'indigo': {
      '50': {
        'default': {
          'hex': '#e8eaf6',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b6b8c3',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#c5cae9',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#f8fdff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#9499b7',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#9fa8da',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#d1d9ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#6f79a8',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#7986cb',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#aab6fe',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#49599a',
          'contrast': 'white'
        }
      },
      '400': {
        'default': {
          'hex': '#5c6bc0',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#8e99f3',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#26418f',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#3f51b5',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#757de8',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#002984',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#3949ab',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#6f74dd',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00227b',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#303f9f',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#666ad1',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#001970',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#283593',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#5f5fc4',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#001064',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#1a237e',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#534bae',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#000051',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#8c9eff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#c0cfff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#5870cb',
          'contrast': 'white'
        }
      },
      'A200': {
        'default': {
          'hex': '#536dfe',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#8f9bff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0043ca',
          'contrast': 'white'
        }
      },
      'A400': {
        'default': {
          'hex': '#3d5afe',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#8187ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0031ca',
          'contrast': 'white'
        }
      },
      'A700': {
        'default': {
          'hex': '#304ffe',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#7a7cff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0026ca',
          'contrast': 'white'
        }
      }
    },
    'blue': {
      '50': {
        'default': {
          'hex': '#e3f2fd',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b1bfca',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#bbdefb',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#eeffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#8aacc8',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#90caf9',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#c3fdff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#5d99c6',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#64b5f6',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#9be7ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#2286c3',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#42a5f5',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#80d6ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0077c2',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#2196f3',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#6ec6ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0069c0',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#1e88e5',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#6ab7ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#005cb2',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#1976d2',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#63a4ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#004ba0',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#1565c0',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#5e92f3',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#003c8f',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#0d47a1',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#5472d3',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#002171',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#82b1ff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#b6e3ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4d82cb',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#448aff',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#83b9ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#005ecb',
          'contrast': 'white'
        }
      },
      'A400': {
        'default': {
          'hex': '#2979ff',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#75a7ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#004ecb',
          'contrast': 'white'
        }
      },
      'A700': {
        'default': {
          'hex': '#2962ff',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#768fff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0039cb',
          'contrast': 'white'
        }
      }
    },
    'lightBlue': {
      '50': {
        'default': {
          'hex': '#e1f5fe',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#afc2cb',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#b3e5fc',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e6ffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#82b3c9',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#81d4fa',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#b6ffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4ba3c7',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#4fc3f7',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#8bf6ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0093c4',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#29b6f6',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#73e8ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0086c3',
          'contrast': 'black'
        }
      },
      '500': {
        'default': {
          'hex': '#03a9f4',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#67daff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#007ac1',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#039be5',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#63ccff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#006db3',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#0288d1',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#5eb8ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#005b9f',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#0277bd',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#58a5f0',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#004c8c',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#01579b',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#4f83cc',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#002f6c',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#80d8ff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#b5ffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#49a7cc',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#40c4ff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#82f7ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0094cc',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#00b0ff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#69e2ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0081cb',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#0091ea',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#64c1ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0064b7',
          'contrast': 'white'
        }
      }
    },
    'cyan': {
      '50': {
        'default': {
          'hex': '#e0f7fa',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#aec4c7',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#b2ebf2',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e5ffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#81b9bf',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#80deea',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#b4ffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4bacb8',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#4dd0e1',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#88ffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#009faf',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#26c6da',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#6ff9ff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0095a8',
          'contrast': 'black'
        }
      },
      '500': {
        'default': {
          'hex': '#00bcd4',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#62efff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#008ba3',
          'contrast': 'black'
        }
      },
      '600': {
        'default': {
          'hex': '#00acc1',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#5ddef4',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#007c91',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#0097a7',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#56c8d8',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#006978',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#00838f',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#4fb3bf',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#005662',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#006064',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#428e92',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00363a',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#84ffff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#baffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4bcbcc',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#18ffff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#76ffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00cbcc',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#00e5ff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#6effff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00b2cc',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#00b8d4',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#62ebff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#0088a3',
          'contrast': 'black'
        }
      }
    },
    'teal': {
      '50': {
        'default': {
          'hex': '#e0f2f1',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#aebfbe',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#b2dfdb',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e5ffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#82ada9',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#80cbc4',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#b2fef7',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4f9a94',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#4db6ac',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#82e9de',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00867d',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#26a69a',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#64d8cb',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00766c',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#009688',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#52c7b8',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00675b',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#00897b',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#4ebaaa',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#005b4f',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#00796b',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#48a999',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#004c40',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#00695c',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#439889',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#003d33',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#004d40',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#39796b',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#00251a',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#a7ffeb',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#dbffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#75ccb9',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#64ffda',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#9effff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#14cba8',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#1de9b6',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#6effe8',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00b686',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#00bfa5',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#5df2d6',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#008e76',
          'contrast': 'black'
        }
      }
    },
    'green': {
      '50': {
        'default': {
          'hex': '#e8f5e9',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b6c2b7',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#c8e6c9',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fbfffc',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#97b498',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#a5d6a7',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#d7ffd9',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#75a478',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#81c784',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#b2fab4',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#519657',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#66bb6a',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#98ee99',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#338a3e',
          'contrast': 'black'
        }
      },
      '500': {
        'default': {
          'hex': '#4caf50',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#80e27e',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#087f23',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#43a047',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#76d275',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00701a',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#388e3c',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#6abf69',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00600f',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#2e7d32',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#60ad5e',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#005005',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#1b5e20',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#4c8c4a',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#003300',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#b9f6ca',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ecfffd',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#88c399',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#69f0ae',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#9fffe0',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#2bbd7e',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#00e676',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#66ffa6',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#00b248',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#00c853',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#5efc82',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#009624',
          'contrast': 'black'
        }
      }
    },
    'lightGreen': {
      '50': {
        'default': {
          'hex': '#f1f8e9',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bec5b7',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#dcedc8',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fffffb',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#aabb97',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#c5e1a5',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#f8ffd7',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#94af76',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#aed581',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e1ffb1',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#7da453',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#9ccc65',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#cfff95',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#6b9b37',
          'contrast': 'black'
        }
      },
      '500': {
        'default': {
          'hex': '#8bc34a',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#bef67a',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#5a9216',
          'contrast': 'black'
        }
      },
      '600': {
        'default': {
          'hex': '#7cb342',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#aee571',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4b830d',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#689f38',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#99d066',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#387002',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#558b2f',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#85bb5c',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#255d00',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#33691e',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#629749',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#003d00',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#ccff90',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffc2',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#99cc60',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#b2ff59',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e7ff8c',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#7ecb20',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#76ff03',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#b0ff57',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#32cb00',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#64dd17',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#9cff57',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#1faa00',
          'contrast': 'black'
        }
      }
    },
    'lime': {
      '50': {
        'default': {
          'hex': '#f9fbe7',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c6c8b5',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#f0f4c3',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fffff6',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bdc192',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#e6ee9c',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffce',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b3bc6d',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#dce775',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffa6',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#a8b545',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#d4e157',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff89',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#a0af22',
          'contrast': 'black'
        }
      },
      '500': {
        'default': {
          'hex': '#cddc39',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff6e',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#99aa00',
          'contrast': 'black'
        }
      },
      '600': {
        'default': {
          'hex': '#c0ca33',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#f5fd67',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#8c9900',
          'contrast': 'black'
        }
      },
      '700': {
        'default': {
          'hex': '#afb42b',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e4e65e',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#7c8500',
          'contrast': 'black'
        }
      },
      '800': {
        'default': {
          'hex': '#9e9d24',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#d2ce56',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#6c6f00',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#827717',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#b4a647',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#524c00',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#f4ff81',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffb3',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bfcc50',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#eeff41',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff78',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b8cc00',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#c6ff00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fdff58',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#90cc00',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#aeea00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e4ff54',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#79b700',
          'contrast': 'black'
        }
      }
    },
    'yellow': {
      '50': {
        'default': {
          'hex': '#fffde7',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cccab5',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#fff9c4',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fffff7',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cbc693',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#fff59d',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffcf',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cbc26d',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#fff176',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffa8',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cabf45',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#ffee58',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff8b',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c9bc1f',
          'contrast': 'black'
        }
      },
      '500': {
        'default': {
          'hex': '#ffeb3b',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff72',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c8b900',
          'contrast': 'black'
        }
      },
      '600': {
        'default': {
          'hex': '#fdd835',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff6b',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c6a700',
          'contrast': 'black'
        }
      },
      '700': {
        'default': {
          'hex': '#fbc02d',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fff263',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c49000',
          'contrast': 'black'
        }
      },
      '800': {
        'default': {
          'hex': '#f9a825',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffd95a',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c17900',
          'contrast': 'black'
        }
      },
      '900': {
        'default': {
          'hex': '#f57f17',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffb04c',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bc5100',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#ffff8d',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffbf',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cacc5d',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#ffff00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff5a',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c7cc00',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#ffea00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff56',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c7b800',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#ffd600',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff52',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c7a500',
          'contrast': 'black'
        }
      }
    },
    'amber': {
      '50': {
        'default': {
          'hex': '#fff8e1',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ccc5af',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#ffecb3',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffe5',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cbba83',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#ffe082',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffb3',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#caae53',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#ffd54f',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff81',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c8a415',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#ffca28',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fffd61',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c79a00',
          'contrast': 'black'
        }
      },
      '500': {
        'default': {
          'hex': '#ffc107',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fff350',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c79100',
          'contrast': 'black'
        }
      },
      '600': {
        'default': {
          'hex': '#ffb300',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffe54c',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c68400',
          'contrast': 'black'
        }
      },
      '700': {
        'default': {
          'hex': '#ffa000',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffd149',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c67100',
          'contrast': 'black'
        }
      },
      '800': {
        'default': {
          'hex': '#ff8f00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffc046',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c56000',
          'contrast': 'black'
        }
      },
      '900': {
        'default': {
          'hex': '#ff6f00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffa040',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c43e00',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#ffe57f',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffb0',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cab350',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#ffd740',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffff74',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c8a600',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#ffc400',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fff64f',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c79400',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#ffab00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffdd4b',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c67c00',
          'contrast': 'black'
        }
      }
    },
    'orange': {
      '50': {
        'default': {
          'hex': '#fff3e0',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ccc0ae',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#ffe0b2',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffe4',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cbae82',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#ffcc80',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffb0',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ca9b52',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#ffb74d',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffe97d',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c88719',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#ffa726',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffd95b',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c77800',
          'contrast': 'black'
        }
      },
      '500': {
        'default': {
          'hex': '#ff9800',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffc947',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c66900',
          'contrast': 'black'
        }
      },
      '600': {
        'default': {
          'hex': '#fb8c00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffbd45',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c25e00',
          'contrast': 'black'
        }
      },
      '700': {
        'default': {
          'hex': '#f57c00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffad42',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bb4d00',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#ef6c00',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff9d3f',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b53d00',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#e65100',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff833a',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ac1900',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#ffd180',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffb1',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#caa052',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#ffab40',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffdd71',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c77c02',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#ff9100',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffc246',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c56200',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#ff6d00',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ff9e40',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c43c00',
          'contrast': 'white'
        }
      }
    },
    'deepOrange': {
      '50': {
        'default': {
          'hex': '#fbe9e7',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c8b7b5',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#ffccbc',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffee',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cb9b8c',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#ffab91',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffddc1',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c97b63',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#ff8a65',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffbb93',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c75b39',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#ff7043',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffa270',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c63f17',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#ff5722',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff8a50',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c41c00',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#f4511e',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff844c',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#b91400',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#e64a19',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff7d47',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#ac0800',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#d84315',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff7543',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#9f0000',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#bf360c',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#f9683a',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#870000',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#ff9e80',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffd0b0',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c96f53',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#ff6e40',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffa06d',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c53d13',
          'contrast': 'white'
        }
      },
      'A400': {
        'default': {
          'hex': '#ff3d00',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff7539',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c30000',
          'contrast': 'white'
        }
      },
      'A700': {
        'default': {
          'hex': '#dd2c00',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#ff6434',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#a30000',
          'contrast': 'white'
        }
      }
    },
    'brown': {
      '50': {
        'default': {
          'hex': '#efebe9',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bdb9b7',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#d7ccc8',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fffffb',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#a69b97',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#bcaaa4',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#efdcd5',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#8c7b75',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#a1887f',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#d3b8ae',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#725b53',
          'contrast': 'white'
        }
      },
      '400': {
        'default': {
          'hex': '#8d6e63',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#be9c91',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#5f4339',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#795548',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#a98274',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4b2c20',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#6d4c41',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#9c786c',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#40241a',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#5d4037',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#8b6b61',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#321911',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#4e342e',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#7b5e57',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#260e04',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#3e2723',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#6a4f4b',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#1b0000',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#d7ccc8',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#fffffb',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#a69b97',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#bcaaa4',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#efdcd5',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#8c7b75',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#8d6e63',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#be9c91',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#5f4339',
          'contrast': 'white'
        }
      },
      'A700': {
        'default': {
          'hex': '#5d4037',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#8b6b61',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#321911',
          'contrast': 'white'
        }
      }
    },
    'grey': {
      '50': {
        'default': {
          'hex': '#fafafa',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c7c7c7',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#f5f5f5',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#c2c2c2',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#eeeeee',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bcbcbc',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#e0e0e0',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#aeaeae',
          'contrast': 'black'
        }
      },
      '400': {
        'default': {
          'hex': '#bdbdbd',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#efefef',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#8d8d8d',
          'contrast': 'black'
        }
      },
      '500': {
        'default': {
          'hex': '#9e9e9e',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#cfcfcf',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#707070',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#757575',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#a4a4a4',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#494949',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#616161',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#8e8e8e',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#373737',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#424242',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#6d6d6d',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#1b1b1b',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#212121',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#484848',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#000000',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#cccccc',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#eeeeee',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#bcbcbc',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#bdbdbd',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#efefef',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#8d8d8d',
          'contrast': 'black'
        }
      },
      'A700': {
        'default': {
          'hex': '#616161',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#8e8e8e',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#373737',
          'contrast': 'white'
        }
      }
    },
    'blueGrey': {
      '50': {
        'default': {
          'hex': '#eceff1',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#babdbe',
          'contrast': 'black'
        }
      },
      '100': {
        'default': {
          'hex': '#cfd8dc',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#9ea7aa',
          'contrast': 'black'
        }
      },
      '200': {
        'default': {
          'hex': '#b0bec5',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e2f1f8',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#808e95',
          'contrast': 'black'
        }
      },
      '300': {
        'default': {
          'hex': '#90a4ae',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#c1d5e0',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#62757f',
          'contrast': 'white'
        }
      },
      '400': {
        'default': {
          'hex': '#78909c',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#a7c0cd',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4b636e',
          'contrast': 'white'
        }
      },
      '500': {
        'default': {
          'hex': '#607d8b',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#8eacbb',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#34515e',
          'contrast': 'white'
        }
      },
      '600': {
        'default': {
          'hex': '#546e7a',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#819ca9',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#29434e',
          'contrast': 'white'
        }
      },
      '700': {
        'default': {
          'hex': '#455a64',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#718792',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#1c313a',
          'contrast': 'white'
        }
      },
      '800': {
        'default': {
          'hex': '#37474f',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#62727b',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#102027',
          'contrast': 'white'
        }
      },
      '900': {
        'default': {
          'hex': '#263238',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#4f5b62',
          'contrast': 'white'
        },
        'darker': {
          'hex': '#000a12',
          'contrast': 'white'
        }
      },
      'A100': {
        'default': {
          'hex': '#cfd8dc',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#ffffff',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#9ea7aa',
          'contrast': 'black'
        }
      },
      'A200': {
        'default': {
          'hex': '#b0bec5',
          'contrast': 'black'
        },
        'lighter': {
          'hex': '#e2f1f8',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#808e95',
          'contrast': 'black'
        }
      },
      'A400': {
        'default': {
          'hex': '#78909c',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#a7c0cd',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#4b636e',
          'contrast': 'white'
        }
      },
      'A700': {
        'default': {
          'hex': '#455a64',
          'contrast': 'white'
        },
        'lighter': {
          'hex': '#718792',
          'contrast': 'black'
        },
        'darker': {
          'hex': '#1c313a',
          'contrast': 'white'
        }
      }
    }
  };

  constructor() {
  }

  isColor(color: string) {
    return this.palette.hasOwnProperty(color);
  }

  getSecondaryColor(color: string) {
    return this.getColor(color, { default: 'A200', lighter: 'A100', darker: 'A400' });
  }

  getColor(colorName: string, options = { 'default': '500', 'lighter': '100', 'darker': '700' }): undefined
    | PortalPaletteHueColors {
    if (!this.isColor(colorName)) {
      return;
    }

    const color = this.palette[colorName] as PortalPaletteHue;

    return {
      default: { hex: color[options.default].default.hex, contrast: this.getTextColor(color[options.default].default.contrast) },
      lighter: { hex: color[options.lighter].default.hex, contrast: this.getTextColor(color[options.lighter].default.contrast) },
      darker: { hex: color[options.darker].default.hex, contrast: this.getTextColor(color[options.darker].default.contrast) }
    };
  }

  getColorFromPalette(name: string, hue: string): PortalPaletteHueColors {
    const color = this.palette[name][hue] as PortalPaletteHueColors;

    return {
      default: { hex: color.default.hex, contrast: this.getTextColor(color.default.contrast) },
      lighter: { hex: color.lighter.hex, contrast: this.getTextColor(color.lighter.contrast) },
      darker: { hex: color.darker.hex, contrast: this.getTextColor(color.darker.contrast) }
    };
  }

  getTextColor(color: string) {
    return color === 'white' ? this.lightText : this.darkText;
  }
}
