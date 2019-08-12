var current_time = new Date();
export class CustomerModel {
    _id: string;
    city_name: string;
    created_date = new Date();
    customer_id: string = "CUSTYP" + current_time.getFullYear() + current_time.getMonth() + current_time.getDate + current_time.getHours() + current_time.getMinutes() + current_time.getSeconds();
    customer_name: string;
    distirbutor_1_name: string;
    distirbutor_2_name: string;
    distirbutor_3_name: string;
    share_1: number;
    share_2: number;
    share_3: number;
    district_name: string;
    is_active: boolean;
    notes: string;
    region_name: string;
    sector: string;
    customer_type: string;
}

export class CustomerTypeModel {
    _id: string;
    is_active: boolean;
    customer_type: string;
    customer_id: string;
}


export class DistirbutorModel {
    is_active: boolean;
    distirbutor_name: string;
    distirbutor_id:string
}

export class SectorModel {
    is_active: boolean;
    sector_name: string;
    sector_id:string
}