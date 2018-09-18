import { Component, OnInit } from '@angular/core';
//import for toastr
import { ToastrService } from 'ngx-toastr';
//for Service
import { AppService } from '../../app.service';
//for routing
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email: string;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  public sendResetLink = () => {

    this.appService.sendResetLinkFunction(this.email)
      .subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success("Mail Sent SuccessFully", "Success!");
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          this.toastr.error("Some Error Occurred", "Error!");
        });

  }//end of sendResetLink 
  public goToSignUp() {
    this.router.navigate(['/signup']);
  }//end goToSignUp
}