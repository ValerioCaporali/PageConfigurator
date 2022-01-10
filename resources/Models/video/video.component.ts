import { Component, Input } from '@angular/core';
import { VideoConfiguration } from '../models/video-configuration';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'core-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent {

  videoConfiguration: VideoConfiguration;

  loopValue: string;
  autoplayValue: string;
  disableControlsValue: string;

  youTubeUrl: SafeResourceUrl;
  vimeoUrl: SafeResourceUrl;

  @Input()
  set configuration(value: VideoConfiguration) {
    this.videoConfiguration = value;
    this.configureComponente();
  }

  constructor(private sanitizer: DomSanitizer) { }

  private configureComponente() {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const source = this.videoConfiguration.Source[0];
    if (source.match(regExp) || source.indexOf("www.youtube-nocookie") != -1)
      this.youTubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(source);
    else if (source.indexOf("player.vimeo") != -1)
      this.vimeoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(source);
    else {
      this.disableControlsValue = this.videoConfiguration.DisableControls ? '' : 'controls';
      this.autoplayValue = this.videoConfiguration.EnableAutoplay ? 'autoplay' : '';
      this.loopValue = this.videoConfiguration.EnableLoop ? 'loop' : '';
    }
  }

}
