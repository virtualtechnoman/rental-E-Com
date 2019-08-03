var current_time = new Date();
export class UserModel {
    _id: string;
    full_name: string;
    email: string;
    is_active: boolean;
    role: string;
    mobile_phone: string;
}

export class UserRoleModel {
    _id: string;
    user_role: String;
    can_access_bu: boolean;
    can_access_city: boolean;
    can_access_country: boolean;
    can_access_customer: boolean;
    can_access_customer_type: boolean;
    can_access_district: boolean;
    can_access_ditirbutor: boolean;
    can_access_g2n: boolean;
    can_access_inventory: boolean;
    can_access_incentive_period: boolean;
    can_access_incentive_share: boolean;
    can_access_products: boolean;
    can_access_region: boolean;
    can_access_reports: boolean;
    can_access_sales: boolean;
    can_access_therapy: boolean;
    can_access_target_setting: boolean;
    can_access_target_forecasting: boolean;
    can_access_users: boolean;
    can_access_user_roles: boolean;
}