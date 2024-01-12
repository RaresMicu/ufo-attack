import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ScoreService } from '../../services/score.service';
import { TokenService } from '../../services/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordsComponent implements OnInit, OnDestroy {
  records: any[] = [];
  personalRecords: any[] = [];
  private recordsSubscription!: Subscription;
  private personalRecordsSubscription!: Subscription;

  constructor(
    private scoreService: ScoreService,
    private cdr: ChangeDetectorRef,
    public tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.getRecords();
    if (localStorage.getItem('token') != null) {
      this.getUserRecords();
    }
  }

  getRecords(): void {
    this.recordsSubscription = this.scoreService.getRecords().subscribe({
      next: (records: any[]) => {
        this.records = records;
        this.cdr.detectChanges();
      },
      error: () => {
        console.log('Error fetching records.');
      },
    });
  }

  getUserRecords(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.personalRecordsSubscription = this.scoreService
        .getPersonalRecords(username)
        .subscribe({
          next: (personalRecords: any[]) => {
            this.personalRecords = personalRecords;
            this.cdr.detectChanges();
          },
          error: () => {
            console.log('Error fetching personal records.');
          },
        });
    }
  }

  // delete() {
  //   this.scoreService.deleteRecords().subscribe({
  //     next: (): void => {
  //       window.alert('Personal records deleted successfully.');
  //     },
  //     error: () => {
  //       console.log('Error while deleting personal records.');
  //     },
  //   });
  // }

  ngOnDestroy(): void {
    if (this.recordsSubscription) {
      this.recordsSubscription.unsubscribe();
    }

    if (this.personalRecordsSubscription) {
      this.personalRecordsSubscription.unsubscribe();
    }
  }
}
