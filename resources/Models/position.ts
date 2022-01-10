export interface Position {

    Type: PositionType;

    Top?: string;

    Bottom?: string;

    Right?: string;

    Left?: string;

}


export enum PositionType {

    Center = 0,

    Absolute = 1

}
