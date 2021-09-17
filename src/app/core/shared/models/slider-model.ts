enum SliderType {
    Banner,
    ThreeBoxSlide,
    Content
  }

  export interface Slider {
    Type: SliderType;
    SliderItems: SliderItems[];
  }

  export interface SliderItems {
    Url: string;
    Active: boolean;
    Title?: string;
    Content?: string;
    RouterLink?: string;
  }
