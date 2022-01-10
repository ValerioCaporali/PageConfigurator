export interface BaseHotspotProduct {

    Code: string;

}


export interface HotspotProduct extends BaseHotspotProduct { }


export interface HotspotProductVariant extends BaseHotspotProduct {

    ProductCode: string;
    
}