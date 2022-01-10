import { GalleryConfiguration } from '../../multimedia/models/gallery-configuration';
import { HTMLConfiguration } from '../../multimedia/models/html-configuration';
import { VideoConfiguration } from '../../multimedia/models/video-configuration';
import { ShowcaseConfiguration } from '../../multimedia/models/showcase-configuration';
import { Style } from './style';
import { PageWidgetText } from './page-widget-text';
import { BaseClickAction } from './click-action';
import { MapConfiguration } from '../../multimedia/models/map-configuration';


export interface PageWidget {

    Id?: string;

    Row: number;

    MobileRow?: number;

    RowSpan?: number;

    Column: number;

    ColumnSpan?: number;

    Type: WidgetType;

    Content: HTMLConfiguration | GalleryConfiguration | VideoConfiguration | ShowcaseConfiguration | MapConfiguration;

    ClickAction?: BaseClickAction;

    Text?: PageWidgetText;

    Style?: Style;

    MobileStyle?: Style;

    Hover?: HoverBehaviour;

}


export enum WidgetType {
    Text = 0,
    Gallery = 1,
    Video = 2,
    Pdf = 3,
    Tour = 4,
    Map = 5,
    WebPage = 6,
    HorizontalScrollGallery = 101, // Custom widget used for Falc marketing section
    GridGallery = 102
}

export enum HoverBehaviour {
    None = 0,
    Default = 1,
    Underline = 2,
    Expand = 3
}