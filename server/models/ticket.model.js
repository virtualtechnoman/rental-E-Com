const mongoose = require("mongoose");
module.exports = mongoose.model("ticket", new mongoose.Schema({
    ticket_number: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId,ref:'user', required: true },
    issues: {
        issue_with_previous_order:{ type: Boolean, default:false },
        recharge_or_tech_related_issue:{ type: Boolean, default:false },
        delivery_issue:{ type: Boolean, default:false },
        quality_issue:{ type: Boolean, default:false },
        timing_issue:{ type: Boolean, default:false },
        other:{ type: Boolean, default:false }
    },
    note: { type: String, required: true },
    created_at: { type: Date, default:Date.now },
    status:{type:String, default:"Pending"}
}, {
        versionKey: false
    }))