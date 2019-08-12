import { ProductModel } from '../../products/shared/product.model';

export class OrderModel {
    accepted: Boolean;
    order_date: Date;
    order_id: String;
    placed_by: any;
    placed_to: any;
    products: [{ accpected: number, product: ProductModel, quantity: number }];
    _id: String;
}