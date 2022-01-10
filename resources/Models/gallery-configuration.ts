import { BaseMediaConfiguration } from "./base-media-configuration";

export interface GalleryConfiguration extends BaseMediaConfiguration {

  ShowIndicator?: boolean;

  ShowNavButtons?: boolean;
  
  EnableLoop?: boolean;
  
  SlideshowDelay?: number;

  ServerSideScalingEnabled?: boolean;

  CacheEnabled?: boolean;

}
