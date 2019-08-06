import { OrderModuleModule } from './order-module.module';

describe('OrderModuleModule', () => {
  let orderModuleModule: OrderModuleModule;

  beforeEach(() => {
    orderModuleModule = new OrderModuleModule();
  });

  it('should create an instance', () => {
    expect(orderModuleModule).toBeTruthy();
  });
});
