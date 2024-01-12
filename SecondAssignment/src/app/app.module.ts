import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './Home/home.component';
import { LoginComponent } from './Login/login.component';
import { PlayComponent } from './Play/play.component';
import { PreferencesComponent } from './Preferences/preferences.component';
import { RecordsComponent } from './Records/records.component';
import { RegisterComponent } from './Register/register.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { PreferencesService } from '../services/preferences.service';
import { TokenService } from '../services/token.service';
import { ScoreService } from '../services/score.service';
import { ProfileComponent } from './Profile/Profile.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    PlayComponent,
    PreferencesComponent,
    RecordsComponent,
    RegisterComponent,
    RouterModule,
    ProfileComponent,
  ],
  providers: [UserService, PreferencesService, TokenService, ScoreService],
  bootstrap: [AppComponent],
})
export class AppModule {}
