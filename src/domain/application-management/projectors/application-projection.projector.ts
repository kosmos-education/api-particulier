import {ApplicationId} from 'src/domain/application-id';
import {ApplicationCreated} from 'src/domain/application-management/events/application-created.event';
import {ApplicationImported} from 'src/domain/application-management/events/application-imported.event';
import {ApplicationProjection} from 'src/domain/application-management/projections/application.projection';
import {ApplicationProjectionRepository} from 'src/domain/application-management/repositories/application-projection.repository';

export class ApplicationProjector {
  constructor(
    private readonly applicationProjectionRepository: ApplicationProjectionRepository
  ) {}

  async onApplicationCreated(event: ApplicationCreated): Promise<void> {
    return this.saveNewApplicationProjection(event);
  }

  async onApplicationImported(event: ApplicationImported): Promise<void> {
    return this.saveNewApplicationProjection(event);
  }

  private async saveNewApplicationProjection(
    event: ApplicationCreated | ApplicationImported
  ): Promise<void> {
    const applicationProjection = new ApplicationProjection(
      event.aggregateId as ApplicationId,
      event.name,
      event.userEmails,
      event.scopes,
      event.subscriptions,
      event.dataPassId,
      event.date
    );

    return this.applicationProjectionRepository.save(applicationProjection);
  }
}