import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  testJson = null;
  email = null;

  constructor(private commonService : CommonService, public authService : AuthService) { }

  ngOnInit(): void {
    this.commonService.getTestJson().subscribe(testJson => {
      this.testJson = testJson;
    });

    this.authService.getEmail().subscribe(email => {
      this.email = email;
    });
  }

}
