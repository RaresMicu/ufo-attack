import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DoCheck } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { AppRoutingModule } from '../app-routing.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AppRoutingModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements DoCheck {
  isLogged: boolean = false;

  constructor(public token: TokenService) {}

  ngDoCheck(): void {
    if (this.token.getIsLogged()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }
}
