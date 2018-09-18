import { Component, OnInit, ViewContainerRef } from '@angular/core';

//import for service
import { AppService } from '../../app.service';
//import for toastr
import { ToastrService } from 'ngx-toastr';
//import for Routing
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public mobileNumber: number;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
  }

  public goToSignIn(): any {
    this.router.navigate(['/']);
  }//end of goToSign function
  public signupFunction(): any {

    if (!this.firstName) {
      this.toastr.warning("First Name is required", "Warning!");
    }
    else if (!this.lastName) {
      this.toastr.warning("Last Name is required", "Warning!");
    }
    else if (!this.mobileNumber) {
      this.toastr.warning("Mobile Number is required", "Warning!");
    }
    else if (!this.email) {
      this.toastr.warning("Email is required", "Warning!");
    }
    else if (!this.password) {
      this.toastr.warning("Password is required", "Warning!");
    }
    else {

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.mobileNumber,
        email: this.email,
        password: this.password
      }

      this.appService.signUpFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
            this.toastr.success("Signed Up", "!SuccesFull");
            setTimeout(() => {
              this.goToSignIn();
            }, 2000);//redirecting to signIn page
          }
          else {
            this.toastr.error(apiResponse.message, "Error!");
          }
        },
          (error) => {
            this.toastr.error("Some Error Occurred", "Error!");
          });//end calling signUpFunction
    }
  }//end signUp function
}