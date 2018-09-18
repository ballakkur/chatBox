import { Component, OnInit, Input } from '@angular/core';
import { Cookie } from '../../../../node_modules/ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  @Input() userFirstName: string;
  @Input() userLastName: string;
  @Input() userStatus: string;
  @Input() messageRead: string;

  public firstChar: string;

  constructor(public toastr: ToastrService) { }

  ngOnInit() {
  
    this.firstChar = this.userFirstName[0]

  }

  public showGroupName = (name: string) => {

    this.toastr.success("You are in group " + name);
  }//end showGroupName
}