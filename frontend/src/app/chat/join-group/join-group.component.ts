import { Component, OnInit } from '@angular/core';

//cookie
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.css']
})
export class JoinGroupComponent implements OnInit {

  constructor(
    public router: Router,
    public _route: ActivatedRoute
  ) { }

  ngOnInit() {
    let receiverId: string = this._route.snapshot.paramMap.get('receiverId');
    let receiverName: string = this._route.snapshot.paramMap.get('receiverName');
    Cookie.set('receiverId', receiverId);
    Cookie.set('receiverName', receiverName);
    Cookie.set('callMethod', 'true');

    this.router.navigate(['/chat']);
  }

}