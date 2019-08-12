import { ProductModel } from '../../products/shared/product.model';

export class OrderModel {
    status: Boolean;
    order_date: Date;
    order_id: String;
    placed_by: any;
    placed_to: any;
    products: [{ accepted: number, product: ProductModel, quantity: number }];
    _id: String;
}