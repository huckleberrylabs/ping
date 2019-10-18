"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_1 = require("@google-cloud/firestore");
var core_1 = require("@huckleberryai/core");
var pipeable_1 = require("fp-ts/lib/pipeable");
var Either_1 = require("@huckleberryai/core/node_modules/fp-ts/lib/Either");
exports.DocumentStore = function () {
    return pipeable_1.pipe(process.env.GCLOUD_CREDENTIALS, function (credentials) {
        return credentials
            ? Either_1.right(credentials)
            : Either_1.left(new core_1.Errors.Environment("google cloud service account"));
    }, Either_1.map(function (credentials) {
        return JSON.parse(Buffer.from(credentials, "base64").toString());
    }), Either_1.map(function (credentials) {
        return new firestore_1.Firestore({
            projectId: credentials.project_id,
            credentials: credentials,
        });
    }));
};
//# sourceMappingURL=index.js.map