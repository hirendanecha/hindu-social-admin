import { AfterContentInit, Component, Input } from '@angular/core';
declare var jwplayer: any;

@Component({
  selector: 'app-re-post-card',
  templateUrl: './re-post-card.component.html',
  styleUrls: ['./re-post-card.component.scss'],
})
export class RePostCardComponent implements AfterContentInit {
  @Input('parentPost') parentPost: any = {};
  player: any;

  constructor() {}

  ngAfterContentInit(): void {
    if ((this.parentPost?.id && this.parentPost?.posttype === 'V') || this.parentPost?.posttype === 'R') {
      setTimeout(() => {
        this.playVideo(this.parentPost?.id);
      }, 100);
    }
  }
  
  playVideo(id: number) {
    if (this.player) {
      this.player.remove();
    }
    const config = {
      file: this.parentPost?.streamname,
      image: this.parentPost?.thumbfilename,
      mute: false,
      autostart: false,
      volume: 30,
      height: '300px',
      width: 'auto',
      pipIcon: 'disabled',
      displaydescription: true,
      playbackRateControls: false,
      aspectratio: '16:9',
      autoPause: {
        viewability: false,
      },
      controls: true,
    };
    if (id) {
      const jwPlayer = jwplayer('jwVideo-' + id);
      if (jwPlayer) {
        this.player = jwPlayer?.setup({
          ...config,
        });
        this.player?.load();
      }
    }
  }
}
