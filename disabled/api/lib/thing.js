"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@huckleberryai/core");
var widget_1 = __importDefault(require("@huckleberryai/widget"));
var pipeable_1 = require("fp-ts/lib/pipeable");
var Either_1 = require("/fp-ts/lib/Either");
exports.thing = function (req, res) {
    var path = req.url;
    if (path === core_1.PathNameFromEvent(widget_1.default.Message.UseCases.AddName.Command.Name)) {
        pipeable_1.pipe(widget_1.default.Message.UseCases.AddName.Command.Codec.decode(req.body), Either_1.mapLeft(function () { return res.status(core_1.StatusCode.BAD_REQUEST).send(null); }), Either_1.map(function (command) { return widget_1.default.Message.UseCases.AddName.Handler()(command); }));
    }
};
//# sourceMappingURL=thing.js.map