module.exports = (p=false)=>({
    //User Operations
    GET_ALL_USERS:p,
    GET_USER_BY_ROLE:p,
    ADD_NEW_USER:p,
    DELETE_USER:p,
    UPDATE_USER:p,
    //Product Privilege
    GET_ALL_PRODUCTS:p,
    GET_ALL_PRODUCTS_OWN:p,
    GET_PRODUCT:p,
    ADD_NEW_PRODUCT:p,
    DELETE_PRODUCT:p,
    UPDATE_PRODUCT:p,
    //Order Operations Privilege
    GET_ALL_ORDERS:p,
    GET_ALL_ORDERS_OWN:p,
    GET_ORDER:p,
    UPDATE_ORDER:p,
    ADD_NEW_ORDER:p,
    DELETE_ORDER:p,
    //Return Order Privilege
    GET_ALL_RETURN_ORDERS:p,
    GET_ALL_RETURN_ORDERS_OWN:p,
    GET_RETURN_ORDER:p,
    UPDATE_RETURN_ORDER:p,
    ADD_NEW_RETURN_ORDER:p,
    DELETE_RETURN_ORDER:p,
    //Challan Privilege
    GET_ALL_CHALLAN:p,
    GET_ALL_CHALLAN_OWN:p,
    GET_CHALLAN:p,
    ADD_NEW_CHALLAN:p,
    DELETE_CHALLAN:p,
    //Vehicle Privilege
    GET_ALL_VEHICLES:p,
    DELETE_VEHICLE:p,
    UPDATE_VEHICLE:p,
    ADD_NEW_VEHICLE:p,
    //Driver Privilege
    GET_ALL_DRIVERS:p,
    DELETE_DRIVER:p,
    UPDATE_DRIVER:p,
    ADD_NEW_DRIVER:p,
    //Customer Privilege
    GET_ALL_CUSTOMERS:p,
    UPDATE_CUSTOMER:p,
    ADD_NEW_CUSTOMER:p,
    DELETE_CUSTOMER:p,
    //Customer Order Privilege
    UPDATE_CUSTOMER_ORDER:p,
    GET_CUSTOMER_ORDER:p,
    DELETE_CUSTOMER_ORDER:p,
    GET_ALL_CUSTOMER_ORDERS:p,
    GET_ALL_CUSTOMER_ORDERS_OWN:p,
    CANCEL_CUSTOMER_ORDER:p,
    //Cart Privilege
    GET_CART:p,
    ADD_PRODUCT_TO_CART:p,
    DELETE_PRODUCT_FROM_CART:p,
    PLACE_ORDER:p,
    UPDATE_QUANTITY_IN_CART:p
})