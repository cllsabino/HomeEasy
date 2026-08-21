import { BadRequestException } from '@nestjs/common';

import { ReplaceScheduleDto } from './dto/replace-schedule.dto';

export function validateSchedule(schedule: ReplaceScheduleDto) {
  for (const period of schedule.periods) {
    if (period.startTime >= period.endTime) {
      throw new BadRequestException('O horário inicial deve ser anterior ao horário final.');
    }
  }
  const sortedPeriods = [...schedule.periods].sort(
    (first, second) => first.weekday - second.weekday || first.startTime.localeCompare(second.startTime)
  );
  for (let index = 1; index < sortedPeriods.length; index += 1) {
    const previous = sortedPeriods[index - 1];
    const current = sortedPeriods[index];
    if (previous.weekday === current.weekday && previous.endTime > current.startTime) {
      throw new BadRequestException('A agenda contém horários sobrepostos no mesmo dia.');
    }
  }
  const dates = new Set<string>();
  for (const exception of schedule.exceptions) {
    if (dates.has(exception.date)) {
      throw new BadRequestException('Existe mais de uma exceção para a mesma data.');
    }
    dates.add(exception.date);
    if (!exception.isUnavailable && (!exception.startTime || !exception.endTime)) {
      throw new BadRequestException('Informe início e fim para uma disponibilidade excepcional.');
    }
    if (exception.startTime && exception.endTime && exception.startTime >= exception.endTime) {
      throw new BadRequestException('O horário excepcional inicial deve ser anterior ao final.');
    }
  }
}
