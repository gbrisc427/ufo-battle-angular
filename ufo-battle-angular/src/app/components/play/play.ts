import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
selector: 'app-play',
standalone: true,
imports: [CommonModule],
templateUrl: './play.html',
styleUrl: './play.scss',
})
export class Play implements AfterViewInit, OnDestroy {

@ViewChild('container') containerRef!: ElementRef;
@ViewChild('missile') missileRef!: ElementRef;


score = 0;
timeLeft = 60;
totalTime = 60;
active = false;
timerInterval: any;


numUfos = 1;
doubleSpeed = false;
hnav = 100;


ufos: UFO[] = [];
missileObj!: Missile;


showEndPanel = false;
finalScore = 0;

message = '';
isError = false;

constructor(public api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {

    // Cargar preferencias
    if (typeof localStorage !== 'undefined') {
      const storedUfos = localStorage.getItem('ufo_num');
      this.numUfos = storedUfos ? parseInt(storedUfos) : 5;

      const storedTime = localStorage.getItem('gameTime');
      this.totalTime = storedTime ? parseInt(storedTime) : 60;
      this.timeLeft = this.totalTime;

      this.doubleSpeed = localStorage.getItem('doubleSpeedK') === 'true';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.startGame(), 0);
  }

  ngOnDestroy() {
    this.cleanUp();
  }

  startGame() {
    this.message = '';
    this.active = true;
    this.score = 0;
    this.showEndPanel = false;
    this.ufos = [];

    if(this.containerRef) this.containerRef.nativeElement.innerHTML = '';

    if (this.missileRef) {
      this.missileObj = new Missile(this.missileRef.nativeElement, this);
    }

    this.createUfos(this.numUfos);

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.cdr.detectChanges();

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  createUfos(count: number) {
    if (!this.containerRef) return;
    const container = this.containerRef.nativeElement;

    for (let i = 0; i < count; i++) {
      const ufoEl = document.createElement('img');
      ufoEl.src = 'assets/imgs/ufo.png';
      ufoEl.classList.add('ufo');
      ufoEl.style.position = 'absolute';
      ufoEl.style.width = '60px';
      ufoEl.style.height = '60px';

      const maxLeft = Math.max(0, window.innerWidth - 60);
      const left = Math.random() * maxLeft;
      const maxBottom = Math.max(0, window.innerHeight - this.hnav - 150);
      const bottom = Math.random() * maxBottom + 100;

      ufoEl.style.left = left + 'px';
      ufoEl.style.bottom = bottom + 'px';

      container.appendChild(ufoEl);

      const ufo = new UFO(ufoEl, this);
      ufo.start();
      this.ufos.push(ufo);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.active || !this.missileObj) return;

    switch (event.key) {
      case 'ArrowRight':
        this.missileObj.move('right');
        break;
      case 'ArrowLeft':
        this.missileObj.move('left');
        break;
      case ' ':
        this.missileObj.fire();
        break;
    }
  }

  updateScore(points: number) {
    this.score += points;
    this.cdr.detectChanges();
  }

  handleUfoHit(ufo: UFO) {
    ufo.element.src = 'assets/imgs/explosion.gif';

    setTimeout(() => {
      if (ufo.element.parentNode) {
        ufo.element.parentNode.removeChild(ufo.element);
      }

      const idx = this.ufos.indexOf(ufo);
      if (idx !== -1) {
        this.ufos.splice(idx, 1);
        ufo.stop();
      }

      const remaining = this.ufos.length;
      const half = Math.floor(this.numUfos / 2);

      if (this.doubleSpeed && remaining === half && remaining > 0) {
        this.ufos.forEach((rUfo) => rUfo.setSpeedMultiplier(2));
      }

      if (remaining === 0 && this.timeLeft > 0) {
        this.createUfos(this.numUfos);
        if(!this.doubleSpeed) {
             this.ufos.forEach((newUfo) => newUfo.setSpeedMultiplier(1));
        } else {
             this.ufos.forEach((newUfo) => newUfo.setSpeedMultiplier(2));
        }
      }
    }, 800);

    this.updateScore(100);
  }

  endGame() {
    this.active = false;
    this.cleanUp();

    const minutes = this.totalTime / 60;
    let final = this.score / minutes;

    if (this.numUfos > 1) final -= (this.numUfos - 1) * 50;
    if (this.doubleSpeed) final += 250;

    this.finalScore = Math.max(0, Math.round(final));
    this.showEndPanel = true;
    this.cdr.detectChanges();
  }

  cleanUp() {
    clearInterval(this.timerInterval);
    this.ufos.forEach(u => u.stop());
    if (this.missileObj) this.missileObj.stop();
  }

  saveScore() {
    const token = this.api.getToken();
    if(token) {
        const recordData = {
            punctuation: this.finalScore,
            ufos: this.numUfos,
            disposedTime: this.totalTime
        };

        this.api.saveScore(recordData, token).subscribe({
            next: () => {
                // Mensaje de éxito en verde
                this.showMessage('¡Puntuación guardada correctamente!', false);

                // Redirigir tras 2 segundos
                setTimeout(() => {
                    this.router.navigate(['/rankings']);
                }, 2000);
            },
            error: (err: any) => {
                console.error(err);
                // Mensaje de error en rosa/rojo
                this.showMessage('Error al guardar: ' + (err.statusText || 'Error desconocido'), true);
            }
        });
    } else {
        this.showMessage('No hay sesión activa', true);
    }
  }

  showMessage(msg: string, error: boolean) {
    this.message = msg;
    this.isError = error;
    this.cdr.detectChanges(); // Forzar actualización de la vista
  }

  returnMenu() {
      this.router.navigate(['/']);
  }
}


class UFO {
  interval: any;
  speed = 5;
  speedMultiplier = 1;
  direction = Math.random() < 0.5 ? -1 : 1;

  constructor(public element: HTMLImageElement, private game: Play) {}

  start() {
    this.interval = setInterval(() => this.move(), 25);
  }

  move() {
    if (!this.game.active) return;

    let left = parseInt(this.element.style.left) || 0;
    left += this.speed * this.speedMultiplier * this.direction;

    if (left > window.innerWidth - 60 || left < 0) {
      this.direction *= -1;
      left += this.direction * (this.speed * this.speedMultiplier);
    }

    this.element.style.left = left + 'px';
  }

  stop() {
    clearInterval(this.interval);
  }

  setSpeedMultiplier(mult: number) {
    this.speedMultiplier = mult;
  }
}

class Missile {
  interval: any;
  inFlight = false;
  speed = 10;

  constructor(public element: HTMLElement, private game: Play) {}

  move(dir: string) {
    if (this.inFlight || !this.game.active) return;

    const step = 15;
    let left = parseInt(this.element.style.left) || 300;
    const width = 50;
    const limit = window.innerWidth;

    if (dir === 'right' && left + width < limit) left += step;
    if (dir === 'left' && left > 0) left -= step;

    this.element.style.left = left + 'px';
  }

  fire() {
    if (this.inFlight || !this.game.active) return;
    this.inFlight = true;
    this.interval = setInterval(() => this.launch(), 20);
  }

launch() {
    const uLimit = window.innerHeight - this.game.hnav;
    let vpos = parseInt(this.element.style.bottom) || 10;

    const step = this.speed;
    const nextVpos = vpos + step;

    this.element.style.bottom = nextVpos + 'px';

    if (this.checkCollision()) {
        this.reset();
    } else if (nextVpos > uLimit) {
        this.reset();
        this.game.updateScore(-25);
    }
  }

  reset() {
      clearInterval(this.interval);
      this.inFlight = false;
      this.element.style.bottom = '10px';
  }

  stop() {
      clearInterval(this.interval);
  }

  checkCollision(): boolean {
    const rectMissile = this.element.getBoundingClientRect();

    for (const ufo of [...this.game.ufos]) {
      const rectUfo = ufo.element.getBoundingClientRect();

      const overlap = !(
        rectUfo.right < rectMissile.left ||
        rectUfo.left > rectMissile.right ||
        rectUfo.bottom < rectMissile.top ||
        rectUfo.top > rectMissile.bottom
      );

      if (overlap) {
        if (ufo.element.src.includes('explosion.gif')) return false;

        this.game.handleUfoHit(ufo);
        return true;
      }
    }
    return false;
  }
}
