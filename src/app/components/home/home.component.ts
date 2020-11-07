import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  testJson = null;
  
  constructor(private commonService : CommonService) { }

  ngOnInit(): void {
    this.commonService.getTestJson().subscribe(testJson => {
      this.testJson = testJson;
    });
  }

}
