import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

export interface AvailabilityPeriod {
  weekday: number;
  startTime: string;
  endTime: string;
}

export interface ProfessionalSchedule {
  periods: AvailabilityPeriod[];
  exceptions: Array<{
    date: string;
    isUnavailable: boolean;
    startTime?: string;
    endTime?: string;
  }>;
}

const weekdayIndexes: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  constructor(private http: HttpClient) {}

  getOwnSchedule() {
    return this.http.get<ProfessionalSchedule>(`${environment.apiUrl}/schedules/me`);
  }

  replaceWeeklySchedule(weekdays: string[], startTime: string, endTime: string) {
    const periods = weekdays.map(weekday => ({
      weekday: weekdayIndexes[weekday],
      startTime,
      endTime
    }));
    return firstValueFrom(
      this.http.put<ProfessionalSchedule>(`${environment.apiUrl}/schedules/me`, {
        periods,
        exceptions: []
      })
    );
  }

  toWeekdayNames(periods: AvailabilityPeriod[]) {
    const weekdayNames = Object.keys(weekdayIndexes);
    const activeWeekdays = new Set(periods.map(period => period.weekday));
    return weekdayNames.filter(weekday => activeWeekdays.has(weekdayIndexes[weekday]));
  }
}
