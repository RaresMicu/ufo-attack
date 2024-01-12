import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  OnInit,
  HostListener,
  ElementRef,
  Renderer2,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { TokenService } from '../../services/token.service';
import { PreferencesService } from '../../services/preferences.service';
import { ScoreService } from '../../services/score.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayComponent implements OnInit, OnDestroy {
  score: number = 0;
  countdown: number = 60;
  countdownSaved: number = 60;
  noUFOs: number = 1;
  ufoRange: number[] = [];
  ufoPositions: number[] = [];
  hstepUFOs: number[] = [];
  timerEnd: boolean = false;
  gameover: string = '';

  @ViewChild('rocket') rocket!: ElementRef;

  conf = {
    rLimit: window.innerWidth,
    uLimit: 580,
  };
  hpos = 720;
  hstep = 5;
  vpos = 0;
  vstep = 5;
  pid = 0;
  timer = 1;
  movepid = 2;
  triggered = false;

  @ViewChildren('ufo', { read: ElementRef }) ufos!: QueryList<ElementRef>;

  limiteD = window.innerWidth;
  hposUFO = 10;
  ufoWidth = 90;
  hstepUFO = 4;

  constructor(
    private tokenService: TokenService,
    public preferencesService: PreferencesService,
    private scoreService: ScoreService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.score = 0;
    this.countdown = 60;
    this.countdownSaved = 60;
    this.noUFOs = 1;

    if (this.preferencesService.getCountdown()) {
      this.countdown = this.preferencesService.getCountdown();
      this.countdownSaved = this.countdown;
    }

    if (this.preferencesService.getUfos()) {
      this.noUFOs = this.preferencesService.getUfos();
    }

    this.ufoRange = Array.from({ length: this.noUFOs }, (_, index) => index);
    this.ufoPositions = Array.from({ length: this.noUFOs }, () => this.hposUFO);
    this.hstepUFOs = Array.from({ length: this.noUFOs }, () => this.hstepUFO);

    this.cdr.detectChanges();

    this.ufos.forEach((ufo, index) => {
      this.ufoPositions[index] = this.randomPosition();
      ufo.nativeElement.style.left = this.ufoPositions[index] + 'px';
    });

    this.timerInterval();
  }

  ngAfterViewInit() {
    this.ufos.changes.subscribe((ufos: QueryList<ElementRef>) => {
      // Perform actions when the ufos change
      ufos.forEach((ufo, index) => {
        this.renderer.setStyle(
          ufo.nativeElement,
          'left',
          this.ufoPositions[index] + 'px'
        );
      });
    });

    if (!this.timerEnd) {
      this.movepid = window.setInterval(() => {
        this.move();
      }, 25);
    } else {
      clearInterval(this.movepid);
    }

    window.onresize = () => {
      this.limiteD = window.innerWidth;
    };
  }

  @HostListener('document:keydown', ['$event'])
  keypressed(theEvent: KeyboardEvent) {
    switch (theEvent.key) {
      case 'ArrowRight':
        if (!this.triggered && !this.timerEnd) {
          this.moveHorizontal(this.hstep);
        }
        break;
      case 'ArrowLeft':
        if (!this.triggered && !this.timerEnd) {
          this.moveHorizontal(-1 * this.hstep);
        }
        break;
      case ' ':
        if (!this.triggered && !this.timerEnd) {
          this.triggered = true;
          this.pid = window.setInterval(() => {
            this.trigger();
          }, 15);
        }
        break;
    }
  }

  moveHorizontal(step: number) {
    this.hpos = this.hpos + step;
    this.rocket.nativeElement.style.left = this.hpos + 'px';
  }

  newMissile() {
    this.vpos = 0;
    this.hpos = 720;
    this.rocket.nativeElement.style.left = this.hpos + 'px';
    this.rocket.nativeElement.style.bottom = this.vpos + 'px';
    this.triggered = false;
  }

  trigger() {
    if (this.vpos > this.conf.uLimit) {
      clearInterval(this.pid);
      this.newMissile();
    } else {
      this.checkCollisions();
      this.vpos = this.vpos + this.vstep;
    }
    this.rocket.nativeElement.style.bottom = this.vpos + 'px';
    if (this.vpos > 580 && this.score != 0) {
      this.score -= 25;
    }
  }

  move() {
    if (!this.timerEnd) {
      this.ufos.forEach((ufo, index) => {
        let currentLeft = this.ufoPositions[index] || 0;
        let currentStep = this.hstepUFOs[index] || 0;

        if (currentLeft > this.limiteD - this.ufoWidth - 8 || currentLeft < 0) {
          currentStep = -1 * currentStep;
        }

        let newLeft = currentLeft + currentStep;
        this.ufoPositions[index] = newLeft;
        ufo.nativeElement.style.left = newLeft + 'px';
        this.hstepUFOs[index] = currentStep; // Update the step value
      });
    }
  }

  randomPosition() {
    let random = Math.floor(Math.random() * 1000);
    return random;
  }

  changeUFOImage(ufo: HTMLImageElement): void {
    ufo.src = '../../assets/imgs/explosion.png';
    ufo.classList.add('hit-ufo');
    ufo.classList.remove('UFO');

    setTimeout(() => {
      ufo.src = '../../assets/imgs/ufo.png';
      ufo.classList.add('UFO');
      ufo.classList.remove('hit-ufo');
    }, 2000);
  }

  checkCollisions() {
    let rocketRect = this.rocket.nativeElement.getBoundingClientRect();

    this.ufos.forEach((ufo, index) => {
      let ufoRect = ufo.nativeElement.getBoundingClientRect();

      if (
        rocketRect.top < ufoRect.bottom &&
        rocketRect.bottom > ufoRect.top &&
        rocketRect.left < ufoRect.right &&
        rocketRect.right > ufoRect.left
      ) {
        this.changeUFOImage(ufo.nativeElement);
        this.handleScore();

        this.rocket.nativeElement.style.display = 'none';

        clearInterval(this.pid);
        this.vpos = 0;
        this.rocket.nativeElement.style.bottom = this.vpos;
        this.rocket.nativeElement.style.display = 'block';
        this.triggered = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleScore() {
    this.score += 100;
    this.cdr.detectChanges();
  }

  timerInterval() {
    this.timer = window.setInterval(() => this.setUp(), 1000);
  }

  setUp() {
    this.countdown--;
    this.cdr.detectChanges();
    console.log(this.countdown);

    if (this.countdown == 0) {
      this.timerEnd = true;
      this.gameover = 'Game Over!';
      clearInterval(this.timer);

      if (this.countdownSaved == 60) {
        //every thing fine
      } else if (this.countdownSaved == 120) {
        this.score /= 2;
      } else {
        this.score /= 3;
      }

      //Substract 50 points for each UFO-1
      this.score -= 50 * (this.noUFOs - 1);
      console.log(this.score);

      if (this.score < 0) {
        this.score = 0;
      }
      this.cdr.detectChanges();
      console.log(this.score);

      if (this.tokenService.isToken() && this.countdown == 0) {
        let saveScore = confirm('Do you want to save your score?');
        if (saveScore) {
          this.scoreService
            .saveScore(this.score, this.noUFOs, this.countdownSaved)
            .subscribe({
              next: (response) => {
                alert('Score saved succesfully:');
              },
              error: () => {
                console.error('SaveScoreError');
              },
            });
        } else {
          alert('The score was not saved.');
        }
      }
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    clearInterval(this.movepid);
  }
}
