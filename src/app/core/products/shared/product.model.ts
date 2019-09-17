export class ProductModel {
    _id: String;
    name: String;
    product_id: String;
    image: String;
    category: String;
    is_active: Boolean;
    farm_price: Number;
    selling_price: Number;
    product_dms: String;
    brand: String;
    details: String;
    created_by: String;
    available_for: String;
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

