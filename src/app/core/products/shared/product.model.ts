export class ProductModel {
    _id: String;
    available_for: String;
    brand: String;
    category: String;
    created_by: String;
    created_date: Date;
    details: String;
    farm_price: Number;
    image: String;
    is_active: Boolean;
    is_available: Boolean;
    name: String;
    product_dms: String;
    product_id: String;
    selling_price: Number;
    stock: Number;
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

