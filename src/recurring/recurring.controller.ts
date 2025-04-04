import { RecurringService } from '@core/recurring/application/recurring.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('recurring')
export class RecurringController {
  constructor(private recurringService: RecurringService) {}

  // @Get()
  // async list() {
  //   return this.recurringService.list();
  // }

  @Post()
  create(@Body() body: { individualId: string }) {
    return this.recurringService.createNewRecurring({
      individualId: body.individualId,
    });
  }
}
