import { Injectable } from '@angular/core';

//for using cookies
import { Cookie } from 'ng2-cookies/ng2-cookies';

//Importing the required files for http services.
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
/* import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
 */

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private baseUrl = "http://localhost:3000/api/v1/users";

  constructor(public _http: HttpClient) { }

  public signUpFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password);

    return this._http.post(`${this.baseUrl}/signup`, params);
  }//end of signUp function
  public signInFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this._http.post(`${this.baseUrl}/login`, params);
  }//end of signInFunction
  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }//end of setlocalstorage Function
  public getUserInfoFromLocalStorage: any = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }//end getlocalstorage function
  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'));

    let userdetails = this.getUserInfoFromLocalStorage();

    return this._http.post(`${this.baseUrl}/${userdetails.userId}/logout`, params);
  }//end of logout function
  public getChat(receiverid, skip): Observable<any> {

    return this._http.get(`${this.baseUrl}/getGroupChat?chatRoomId=${receiverid}&skip=${skip}&authToken=${Cookie.get('authToken')}`)

  }//end getChat function
  public sendResetLinkFunction(email: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${email}/forgotPassword`);
  }//end sendResetLink function
  public resetPassword(data: any): Observable<any> {
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('password', data.password);
    return this._http.post(`${this.baseUrl}/resetPassword`, params);

  }//end resetPassword Function
  public createGroup(data: any): Observable<any> {
    const params = new HttpParams()
      .set('userEmail', data.email)
      .set('roomName', data.grpname);

    return this._http.post(`${this.baseUrl}/createChatRoom`, params);

  }//end createGroup
  public getGroups(): Observable<any> {

    return this._http.get(`${this.baseUrl}/getChatRooms`);

  }//end getGroups
  public getGroup(data): Observable<any> {

    return this._http.get(`${this.baseUrl}/${data}/getChatRoom`);

  }//end getGroup
  public joinGroup(data: any): Observable<any> {

    const params = new HttpParams()
      .set('userEmail', data.userEmail)
      .set('chatRoomId', data.roomId);

    return this._http.post(`${this.baseUrl}/joinChatRoom`, params);
  }//end joinGroup
  public sendInvite(data: any): Observable<any> {

    const params = new HttpParams()
      .set('userEmail', data.userEmail)
      .set('chatRoomId', data.roomId);

    return this._http.post(`${this.baseUrl}/sendInvite`, params);
  }//end sendInvite
  public editGroup(data: any): Observable<any> {

    const params = new HttpParams()
      .set('roomName', data.roomName);

    return this._http.post(`${this.baseUrl}/${data.chatRoomId}/editChatRoom`, params);
  }//end editGroup
  public deleteGroup(data: any): Observable<any> {

    const params = new HttpParams()
      .set('chatRoomId', data);

    return this._http.put(`${this.baseUrl}/deleteChatRoom`, params);
  }//end deleteGroup
  public closeGroup(data): Observable<any> {

    return this._http.get(`${this.baseUrl}/${data}/closeGroup`);
  }//end closeGroup
  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if
    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError
}