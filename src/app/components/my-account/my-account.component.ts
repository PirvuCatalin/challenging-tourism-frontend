import { Component, OnInit } from '@angular/core';
import { MyAccountService } from 'src/app/service/my-account.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  myInfo  = null;

  constructor(private myAccountService: MyAccountService) { }

  ngOnInit(): void {
    this.myAccountService.getMyInfo().subscribe(res => {
      this.myInfo = res;
    })
  }
}
