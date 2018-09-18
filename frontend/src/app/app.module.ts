import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';

//for routing
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';

//for Http service
import { HttpClientModule } from '@angular/common/http';
import { AppService } from './app.service';

//for toast message
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketService } from './socket.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ChatModule,
    UserModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', component: LoginComponent },
      { path: "*", component: LoginComponent }
    ])
  ],
  providers: [AppService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }