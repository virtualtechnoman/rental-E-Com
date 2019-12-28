import { TruckModule } from './truck.module';

describe('TruckModule', () => {
  let truckModule: TruckModule;

  beforeEach(() => {
    truckModule = new TruckModule();
  });

  it('should create an instance', () => {
    expect(truckModule).toBeTruthy();
  });
});
