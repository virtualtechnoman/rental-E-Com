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
    ADD_NEW_ORDER:p,
    DELETE_ORDER:p,
    ACCEPT_ORDER:p,
    RECIEVE_ORDER:p,
    BILL_ORDER:p,
    //Return Order Privilege
    GET_ALL_RETURN_ORDERS:p,
    GET_ALL_RETURN_ORDERS_OWN:p,
    GET_RETURN_ORDER:p,
    ADD_NEW_RETURN_ORDER:p,
    // ACCEPT_RETURN_ORDER:p,
    RECIEVE_RETURN_ORDER:p,
    DELETE_RETURN_ORDER:p,
    //Challan Privilege
    // GET_ALL_CHALLAN:p,
    GET_ALL_CHALLAN_OWN:p,
    GET_ALL_CHALLAN_ASSIGNED:p,
    GET_CHALLAN:p,
    GENERATE_ORDER_CHALLAN:p,
    GENERATE_RETURN_ORDER_CHALLAN:p,
    DELETE_CHALLAN:p,
    ACCEPT_CHALLAN:p,
    //Vehicle Privilege
    GET_ALL_VEHICLES:p,
    DELETE_VEHICLE:p,
    UPDATE_VEHICLE:p,
    ADD_NEW_VEHICLE:p,
    //Driver Privilege
    // GET_ALL_DRIVERS:p,
    // DELETE_DRIVER:p,
    // UPDATE_DRIVER:p,
    // ADD_NEW_DRIVER:p,
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
    UPDATE_QUANTITY_IN_CART:p,
    //Product Category Privilege
    GET_ALL_PRODUCT_CATEGORY:p,
    GET_PRODUCT_CATEGORY:p,
    ADD_NEW_PRODUCT_CATEGORY:p,
    UPDATE_PRODUCT_CATEGORY:p,
    DELETE_PRODUCT_CATEGORY:p,
    //State Privilege
    GET_ALL_STATES:p,
    ADD_NEW_STATE:p,
    UPDATE_STATE:p,
    DELETE_STATE:p,
    //City Privilege
    GET_ALL_CITIES:p,
    ADD_NEW_CITY:p,
    UPDATE_CITY:p,
    DELETE_CITY:p,
    //Area Privilege
    GET_ALL_AREAS:p,
    ADD_NEW_AREA:p,
    UPDATE_AREA:p,
    DELETE_AREA:p,
    //Ticket Privilege
    GET_TICKETS_OWN:p,
    GET_TICKET_OWN:p,
    GET_TICKETS_ALL:p,
    ADD_NEW_TICKET:p,
    DELETE_TICKET:p,
    ADD_NEW_MESSAGE_ON_TICKET_EXECUTIVE:p,
    ADD_NEW_MESSAGE_ON_TICKET_CUSTOMER:p,
    CLOSE_TICKET:p,
    //Chat Privilege
    CREATE_NEW_CHAT:p,
    ADD_NEW_MESSAGE_ON_CHAT_EXECUTIVE:p,
    ADD_NEW_MESSAGE_ON_CHAT_CUSTOMER:p,
    CLOSE_CHAT:p,
    GET_ALL_NON_CLOSED_CHATS:p
})