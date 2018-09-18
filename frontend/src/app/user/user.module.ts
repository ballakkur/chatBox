import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

//for routing
import { RouterModule, Routes } from '@angular/router';
//for toast message
//for toast message
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//for using forms
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'signup', component: SignupComponent },
      { path: 'forgotPassword', component: ForgotPasswordComponent },
      { path: 'resetPassword/:userId', component: ResetPasswordComponent }
    ])

  ],
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, ResetPasswordComponent]
})
export class UserModule { }