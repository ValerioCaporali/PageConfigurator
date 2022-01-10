import { ActionTarget } from "./action-target";
import { HotspotProduct, HotspotProductVariant } from "./hotspot-product";
import { KRPanoMetadata } from "./krpano-metadata";
import { MatterportMetadata } from "./matterport-metadata";

export interface Showcase {

    Id: string;

    Kind: ShowcaseKind;

    Metadata: KRPanoMetadata | MatterportMetadata;

    MetadataVersion: number;

}


export enum ShowcaseKind {

    KRPano = 10,

    Matterport = 11

}


export interface BaseVTourHotspot {

    ActionKind: ActionTarget;

    Products?: HotspotProduct[];

    ProductVariants?: HotspotProductVariant[];

}
