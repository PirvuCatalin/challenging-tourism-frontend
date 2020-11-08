import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';

export class Challenge {
  numOfWaypoints: number;
  name: string;
  isActive: boolean;
  bonusPoints: number;
  expiresInSeconds: number;
  currentNumOfWaypoints: number;
  city: string;
}

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})


export class ChallengesComponent implements OnInit {
  constructor(private router: Router, private commonService: CommonService) { }

  challenges: Challenge[] = [
    { numOfWaypoints: 10, name: "Visit 10 waypoints in Bucharest in the timeframe to get 100 bonus points.", isActive: false, bonusPoints: 100, expiresInSeconds: 20, currentNumOfWaypoints: 0, city: "Bucharest" }
  ];

  ngOnInit(): void {
  }

  subscribeTimer = 0;
  timeLeft = 5;

  buttonClicked(challenge: Challenge) {
    challenge.isActive = true;
    this.commonService.activeChallenge = challenge;

    this.router.navigateByUrl('/dashboard');

    // const source = timer(1000, 1000);
    // const abc = source.subscribe(val => {
    //   this.subscribeTimer = this.timeLeft - val;
    //   if (this.subscribeTimer == 0) {
    //     console.log("done");
    //   }
    // });
  }
}
