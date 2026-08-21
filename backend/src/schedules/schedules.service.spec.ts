import { BadRequestException } from '@nestjs/common';

import { validateSchedule } from './schedule.utils';

describe('SchedulesService', () => {
  it('rejects overlapping periods on the same weekday', () => {
    expect(() =>
      validateSchedule({
        periods: [
          { weekday: 1, startTime: '08:00', endTime: '12:00' },
          { weekday: 1, startTime: '11:30', endTime: '15:00' }
        ],
        exceptions: []
      })
    ).toThrow(BadRequestException);
  });

  it('accepts adjacent periods and a complete exceptional period', () => {
    expect(() =>
      validateSchedule({
        periods: [
          { weekday: 1, startTime: '08:00', endTime: '12:00' },
          { weekday: 1, startTime: '12:00', endTime: '16:00' }
        ],
        exceptions: [{ date: '2026-09-01', isUnavailable: false, startTime: '09:00', endTime: '11:00' }]
      })
    ).not.toThrow();
  });
});
