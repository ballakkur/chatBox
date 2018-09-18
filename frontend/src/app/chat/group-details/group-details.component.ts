import { Component, OnInit } from '@angular/core';
//cookie
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  public roomId: string;
  public roomName: string;
  public members: any = [];
  public noTextBox: boolean = true;


  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public appService: AppService,
    public toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.roomId = Cookie.get('receiverId');
    console.log(this.roomId);
    this.roomName = Cookie.get('receiverName');

    this.appService.getGroup(this.roomId)
      .subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.members = apiResponse.data.members;
          console.log(apiResponse);
        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          this.toastr.error("Some Error Occurred", "Error!");
        })
  }

  public saveName() {

    let data: any = {}
    data.chatRoomId = this.roomId;
    data.roomName = this.roomName;

    this.appService.editGroup(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success("Group Name Changed", "Success!");
          this.noTextBox = true;
          Cookie.set('receiverName', data.roomName);
        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          this.toastr.error("Some Error Occurred", "Error!");
        }
      );//end subscribe
  }//end saveName
  public edit() {
    this.noTextBox = false;
  }//end edit
}