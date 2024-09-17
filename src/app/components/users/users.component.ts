import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit ,OnDestroy{
  constructor(private userService: UserService) { }
  usersArray: any[] = [];
  subscriptions:Subscription[]=[]



  ngOnInit(): void {
  const getAllUsersSubscription= this.userService.getAllUsers().subscribe({
      next: response => {
        console.log(response.data.users, "all user data response ")
        this.usersArray = response.data.users
      }, error: err => {
        console.log(err, "error")
      }
    })

    this.subscriptions.push(getAllUsersSubscription)
  }

  trackById(index: number, user: any): any {
    return user.id;
  }

  deleteUser(id: any) {
   const deleteUserSubscription=  this.userService.deleteUser(id).subscribe({
      next: response => {
        console.log(response, "delete user response")
        this.usersArray = this.usersArray.filter(user => user.id !== id);
      }, error: err => {
        console.log(err, "error")
      }
    })

    this.subscriptions.push(deleteUserSubscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions=[]
  }
}
