import { Injectable } from '@angular/core';

//importing socket io
import * as io from 'socket.io-client';
import { Observable, throwError } from 'rxjs';

//for cookie
import { Cookie } from 'ng2-cookies/ng2-cookies';

//for http requests
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = "http://localhost:3000";

  private socket;

  constructor(public http: HttpClient) {
    //first step where connection is established. i.e. Handshake moment
    this.socket = io(this.url);
  }

  //events to be listened
  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      });//end socket
    });//end return of Observable
  }//end verifyUser
  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

      });//end socket
    });//end Observable
  }//end onlineUserList
  public authError = () => {
    return Observable.create((observer) => {

      this.socket.on('auth-error', (data) => {

        observer.next(data);

      })//end socket
    });//end observer
  }//end authError
  public typingInRoom = () => {

    return Observable.create((observer) => {

      this.socket.on("typing", (data) => {

        observer.next(data);

      });//endsocket 
    });//end Observable
  }//end typingInRoom
  public groupAdded = (data) => {

    this.socket.emit("newGroup", data);//endsocket 
  }//end Group Added
  public groupClosed = (data) => {

    this.socket.emit("GroupClosed", data);//endsocket 
  }//end Group Closed
  public groupCreated = () => {

    return Observable.create((observer) => {

      this.socket.on("GroupCreated", (data) => {

        observer.next(data);

      });//endsocket 
    });//end Observable
  }//end activeInRoom
  public closedGroup = () => {

    return Observable.create((observer) => {

      this.socket.on("closedGroup", (data) => {

        observer.next(data);

      });//endsocket 
    });//end Observable
  }//end activeInRoom
  public groupDeleted = (data) => {

    this.socket.emit("GrpDeleted", data);//endsocket 
  }//end Group Deleted
  public groupRemoved = () => {

    return Observable.create((observer) => {

      this.socket.on("GroupRemoved", (data) => {

        observer.next(data);

      });//endsocket 
    });//end Observable
  }//end activeInRoom

  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      });//end Socket
    });//end Observable
  }//end disconnectedSocket
  //end events to be listened
  //events to be emitted
  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  }//end setUser 
  public joinGroup = (data) => {

    this.socket.emit(data.userId, data);

  }//end joinGroup
  public userTyping = (data) => {

    this.socket.emit("userTyping", data);

  }//end userTyping
  //end of events to be emitted
  //chatting related events
  public groupChatMessage = () => {

    return Observable.create((observer) => {

      this.socket.on('message', (data) => {

        observer.next(data);

      });//end socket
    });//end observable
  }//end groupChatMessage
  public sendChatMessage = (chatMsgObject) => {

    this.socket.emit('chat-msg', chatMsgObject);

  }//end getChatMessage
  public exitSocket = () => {

    this.socket.disconnect();

  }//end exit socket
  private handleError(err: HttpErrorResponse) {

    let errorMessage = "";

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    }//end if
    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }//end handleError
}