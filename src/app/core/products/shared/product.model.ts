import { ProductTypeModel } from "../types/shared/product.types.model";

export class ProductModel {
    _id: String;
    brand: String;
    category: CategoryModel;
    created_by: String;
    created_date: Date;
    details: String;
    image: String;
    is_active: Boolean;
    is_available: Boolean;
    name: String;
    product_dms: String;
    product_id: String;
    selling_price: Number;
    stock: Number;
    type: any;
    varients: any[] = [];
}
export class CategoryModel {
    _id: string;
    name: string;
    is_active: boolean;
}
export class Category {
    is_active: boolean;
    name: string;
    _id: string;
}

