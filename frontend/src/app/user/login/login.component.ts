import { Component, OnInit } from '@angular/core';

//import for toastr
import { ToastrService } from 'ngx-toastr';
//for Service
import { AppService } from '../../app.service';
//for routing
import { ActivatedRoute, Router } from '@angular/router';
//for cookies
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  public goToSignUp() {
    this.router.navigate(['/signup']);
  }//end goToSignUp
  public signInFunction(): any {
    let data: any = {
      email: this.email,
      password: this.password
    }

    if (!this.email) {
      this.toastr.warning("Email is required", "Warning");
    }
    else if (!this.password) {
      this.toastr.warning("Password is required", "Warning");
    }
    else {
      this.appService.signInFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
            this.toastr.success("Signed In", "Success");
            console.log(apiResponse);

            Cookie.set('authToken', apiResponse.data.authToken);
            Cookie.set('receiverId', apiResponse.data.userDetails.userId);
            Cookie.set('receiverName', `${apiResponse.data.userDetails.firstName} ${apiResponse.data.userDetails.lastName}`);
            this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);

            setTimeout(() => {
              this.router.navigate(['/chat']);
            }, 2000);
          }
          else {
            this.toastr.error(apiResponse.message);
          }
        },
          (error) => {
            this.toastr.error("Some error occured");
          });
    }
  }//end of signIn function
}