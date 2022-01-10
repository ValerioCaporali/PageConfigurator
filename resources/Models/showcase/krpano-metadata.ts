import { BaseVTourHotspot } from "./showcase";
import { TagPosition } from "./tag-position";


export interface KRPanoMetadata {

    Scenes: KRPanoScene[];
    
}


export interface KRPanoScene {
    
    Name: string;

    Hotspots: KRPanoHotspot[];

}


export interface KRPanoHotspot extends BaseVTourHotspot {
    
    Position: TagPosition;

    Scale: number;
    
}
