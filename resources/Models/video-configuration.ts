import { BaseMediaConfiguration } from "./base-media-configuration";

export interface VideoConfiguration extends BaseMediaConfiguration {
  
  Width?: number | string;
  
  Height?: number | string;
  
  EnableLoop?: boolean;
  
  EnableAutoplay?: boolean;
  
  DisableControls?: boolean;

  Responsive?: boolean;

}
