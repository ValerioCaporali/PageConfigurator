export interface Style {

    Width?: string;

    Height?: string;

    Margin?: SpaceProperty;

    Background?: string;

    TextColor?: string;

    FontFamily?: string;

    FontSize?: string;

    Padding?: SpaceProperty;

    Borders?: BorderProperty[];

}

export interface SpaceProperty {

    Total?: string;

    Top?: string;

    Bottom?: string;

    Left?: string;

    Right?: string;

}

export interface BorderProperty {

    Type: BorderType;

    Style: string;

    Width: string;

    Color: string;

}

export enum BorderType {

    Total = 0,

    Left = 1,

    Right = 2,

    Top = 3,
    
    Bottom = 4

}