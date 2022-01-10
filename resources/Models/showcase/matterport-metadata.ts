import { BaseVTourHotspot } from "./showcase";
import { TagPosition } from "./tag-position";

export interface MatterportMetadata {

    ApiKey: string;

    SpaceId: string;

    Hotspots: MatterportHotspot[];

}


export interface MatterportHotspot extends BaseVTourHotspot {

    Sid: string;

    Color: MatterportHotspotColor;

    Enabled: boolean;

    FloorInfo: MatterportFloorInfo;

    FloorIndex: number;

    StemVisible: boolean;

    StemVector: TagPosition;

    AnchorPosition: TagPosition;

}


export interface MatterportHotspotColor {
    
    R: number;

    G: number;

    B: number;

}


export interface MatterportFloorInfo {
    
    Id: string;

    Sequence: number;

}
