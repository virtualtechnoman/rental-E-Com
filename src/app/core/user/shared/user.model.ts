var current_time = new Date();
export class UserModel {
    _id: string;
    employee_id: string = "EMP" + current_time.getFullYear() + current_time.getMonth() + current_time.getDate + current_time.getHours() + current_time.getMinutes() + current_time.getSeconds();
    first_name: string;
    last_name: string;
    email: string;
    joining_date: Date;
    job_title: string;
    is_active: boolean;
    password: string;
    repeatPassword: string;
    therapy_line: string;
    therapy_line_id: string;
    manager_id: string;
    position: string;
    title: string;
    mobile_phone: string;
    home_phone: string;
    business_phone: string;
    business_extension: string;
    region: string;
    city: string;
    district: string;
    address: string;
    postal_code: string;
    notes: string;
    photo: string;
    attachments: string;
    user_role: string;
}

export class UserRoleModel {
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