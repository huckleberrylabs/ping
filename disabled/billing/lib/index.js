"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
__export(require("./ioc"));
var stripe_1 = __importDefault(require("stripe"));
exports.secretApiKey = "sk_test_JgcFuDH8grNsHvZy3TbR0564001PPBzryV";
exports.publicApiKey = "pk_test_yoFeO5x15PPlisJIQdFgoWbG005bjq8KtN";
var stripe = new stripe_1.default(exports.secretApiKey);
stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    subscription_data: {
        items: [
            {
                plan: "plan_123",
            },
        ],
        trial_period_days: 14,
    },
    success_url: "https://text.huckleberry.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://text.huckleberry.com/cancel",
});
stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "setup",
    setup_intent_data: {
        metadata: {
            customer_id: "cus_FOsk5sbh3ZQpAU",
            subscription_id: "sub_8epEF0PuRhmltU",
        },
    },
    customer: "cus_123",
    success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://example.com/cancel",
});
//# sourceMappingURL=index.js.map