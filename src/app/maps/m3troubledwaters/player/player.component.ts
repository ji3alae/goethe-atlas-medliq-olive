import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { delay, first, switchMap, tap } from 'rxjs/operators';
import { Player } from 'src/app/player';
import { PlayerService } from 'src/app/player.service';
import { Scroller } from '../scroller';
import { AnimationManagerService } from '../../../animation-manager.service';
import { TroubledwatersService } from '../troubledwaters.service';
import { LayoutService } from 'src/app/layout.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-troubledwaters-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less']
})
export class TroubledwatersPlayerComponent implements OnInit, AfterViewInit {

  segments = [];
  segment: any = {};
  segmentIndex = -1;

  intervieweeColor = 'black';
  @ViewChild('interviewees', {static: true}) interviewees: ElementRef;
  
  scroller: Scroller = null;
  player: Player = null;
  players = {};
  expanded = -1;
  // observer: IntersectionObserver;

  constructor(public troubledWaters: TroubledwatersService, public playerService: PlayerService,
              private animationManager: AnimationManagerService, private layout: LayoutService) {
    troubledWaters.data.pipe(
      first(),
      tap((data) => {
        this.segments = data;
        let index = 0;
        for (const segment of data) {
          segment.segmentIndex = index;
          segment.size = this.playerSize;
          index++;
        }
      }),
      delay(0),
      tap((data) => {
        const el = this.interviewees.nativeElement as HTMLElement;
        this.animationManager.register('player:scroll', () => {
          this.updateBubbleSizes();
        });
        fromEvent(el, 'scroll').subscribe((event) => {
          animationManager.enable('player:scroll')
          animationManager.go();
        });
      }),
      switchMap(() => this.troubledWaters.position),
      delay(0),
      tap(({segment, timestamp, offset}) => {
        offset /= 10;
        if (segment.id !== this.segment.id) {
          this.pause();
          this.segment = segment;
          this.intervieweeColor = segment.interviewee.color;
          this.initPlayer();
          this.player.seekTime(offset).then(() => {
            this.play();
          });
        } else {
          if (this.player.audio && Math.abs(offset - this.player.audio.currentTime) > 2) {
            this.player.seekTime(offset).then(() => {
              this.play();
            });
          }
        }
        for (let idx = 0 ; idx < this.segments.length ; idx++) {
          const s = this.segments[idx];
          if (segment.id === s.id) {
            this.segmentIndex = idx;
            this.updateBubbleSizes();
            this.scroller.update(this.offset(idx));
          }
        }
      })
    ).subscribe(() => {
    });
    fromEvent(window, 'blur').subscribe(() => {
      if (this.player !== null) {
        this.pause();
      }  
    })
  }

  offset(idx) {
    return idx * (this.playerSize + 32);
  }

  ngAfterViewInit(): void {
    this.scroller = new Scroller(this.interviewees.nativeElement, '.interviewee .photo', this.animationManager,  () => this.layout.mobile());
  }

  ngOnInit(): void {
    
  }

  pause() {
    if (this.player !== null) {
      this.troubledWaters.playing = false;
      this.player.pause();
    }
  }

  play() {
    if (this.player !== null) {
      this.player.play();
      this.troubledWaters.playing = true;  
    }
  }

  toggle() {
    if (this.player !== null) {
      if (this.troubledWaters.playing) {
        this.pause();
      } else {
        this.play();
      }
    }
  }

  initPlayer() {
    if (this.player !== null) {
      // console.log('cleanup PLAYER', this.player.url);
      this.player.pause();
    }
    // console.log('init PLAYER', this.segment.audio);
    this.player = this.players[this.segment.audio];
    if (!this.player) {
      const player = new Player(this.segment.audio_s3url || this.segment.audio, this.playerService);
      player.hiResTimestamp.subscribe((offset) => {
        if (player !== this.player) {
          return;
        }
        if (this.troubledWaters.playing) {
          this.troubledWaters.setPosition({segment: this.segment, offset, who: 'play-position'});
        }
      });
      player.ended.subscribe(() => {
        if (player !== this.player) {
          return;
        }
        if (this.segment.segmentIndex + 1 < this.segments.length) {
          this.troubledWaters.setPosition({segment: this.segments[this.segment.segmentIndex + 1], who: 'play-ended'});
        } else {
          this.troubledWaters.playing = false;
        }
      });
      this.player = player
      this.players[this.segment.audio] = player;
    }
    this.player.audio.currentTime = 0;
  }

  get playerSize() {
    return this.layout.desktop() ? 64 : 40;
  }

  updateBubbleSizes() {
    const el = this.interviewees.nativeElement as HTMLElement;
    const edge = (this.layout.desktop() ? el.offsetHeight / 2 : el.offsetWidth / 2) - this.playerSize;
    el.querySelectorAll('.interviewee > .photo').forEach((child: HTMLElement) => {
      const childRect = child.getBoundingClientRect();                
      const segmentId = child.getAttribute('data-segment-id');
      for (const segment of this.segments) {
        if (segment.id === segmentId) {
          let ratio = 1;
          if (this.layout.desktop()) {
            ratio = 1 - (Math.abs(childRect.top - edge) / this.playerSize);
          } else {
            ratio = 1 - (Math.abs(childRect.left - edge) / this.playerSize);
          }
          if (ratio < 0) { ratio = 0; }
          segment.size = this.playerSize * (1 + ratio);
        }
      }
    });
  }
}
