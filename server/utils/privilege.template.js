module.exports = (p=false)=>({
    //User Operations
    GET_ALL_USERS:p,
    GET_USER_BY_ROLE:p,
    ADD_NEW_USER:p,
    DELETE_USER:p,
    UPDATE_USER:p,
    //Product Privilege
    GET_ALL_PRODUCTS:p,
    GET_PRODUCT:p,
    ADD_NEW_PRODUCT:p,
    DELETE_PRODUCT:p,
    UPDATE_PRODUCT:p,
    //Order Operations Privilege
    GET_ALL_ORDERS:p,
    GET_ORDER:p,
    ADD_NEW_ORDER:p,
    DELETE_ORDER:p,
    //Return Order Privilege
    GET_ALL_RETURN_ORDERS:p,
    GET_RETURN_ORDER:p,
    ADD_NEW_RETURN_ORDER:p,
    DELETE_RETURN_ORDER:p,
    //Challan Privilege
    GET_ALL_CHALLAN:p,
    GET_CHALLAN:p,
    ADD_NEW_CHALLAN:p,
    DELETE_CHALLAN:p
})