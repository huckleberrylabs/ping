"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var log_1 = require("@huckleberryai/log");
var utilities_1 = require("../../utilities");
var base_1 = require("../base");
var LogEntryRepository = (function () {
    function LogEntryRepository(store) {
        var _this = this;
        this.store = store;
        this.collection = "log-entries";
        this.add = function (event) {
            return base_1.add(_this.store.store)(_this.collection)(event.id, event);
        };
        this.get = base_1.get(this.store.store)(this.collection)(log_1.IsLogEntryEvent);
        this.getByCorrID = base_1.getByProperty(this.store.store)(this.collection)("corr", log_1.IsLogEntryEvent);
    }
    var _a;
    LogEntryRepository = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [typeof (_a = typeof utilities_1.DocumentStore !== "undefined" && utilities_1.DocumentStore) === "function" ? _a : Object])
    ], LogEntryRepository);
    return LogEntryRepository;
}());
exports.LogEntryRepository = LogEntryRepository;
//# sourceMappingURL=index.js.map