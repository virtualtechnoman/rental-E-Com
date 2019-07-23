const Joi = require('joi');
const helper = require('../utils/helper');

const userroleSchema = Joi.object({
    user_role: Joi.string().required(),
    // bu_id: Joi.string().required(),
    can_access_bu: Joi.boolean().default(false),
    can_access_city: Joi.boolean().default(false),
    can_access_country: Joi.boolean().default(false),
    can_access_customer: Joi.boolean().default(false),
    can_access_customer_type: Joi.boolean().default(false),
    can_access_distirbutor: Joi.boolean().default(false),
    can_access_district: Joi.boolean().default(false),
    can_access_g2n: Joi.boolean().default(false),
    can_access_inventory: Joi.boolean().default(false),
    can_access_incentive_period: Joi.boolean().default(false),
    can_access_incentive_share: Joi.boolean().default(false),
    can_access_products: Joi.boolean().default(false),
    can_access_region: Joi.boolean().default(false),
    can_access_reports: Joi.boolean().default(false),
    can_access_sales: Joi.boolean().default(false),
    can_access_therapy: Joi.boolean().default(false),
    can_access_target_setting: Joi.boolean().default(false),
    can_access_target_forecasting: Joi.boolean().default(false),
    can_access_therapy: Joi.boolean().default(false),
    can_access_users: Joi.boolean().default(false),
    can_access_user_role: Joi.boolean().default(false),
})

module.exports = {
    insert
}

function insert(userrole) { return helper.validator(userrole, userroleSchema) }