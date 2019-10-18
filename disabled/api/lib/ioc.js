"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var inversify_1 = require("inversify");
var core_1 = require("@huckleberryai/core");
var log_1 = require("@huckleberryai/log");
var web_analytics_1 = require("@huckleberryai/web-analytics");
var widget_1 = require("@huckleberryai/widget");
var utilities_1 = require("./utilities");
var repositories_1 = require("./repositories");
var APIModule = new inversify_1.ContainerModule(function (bind) {
    bind(utilities_1.DocumentStore)
        .toSelf()
        .inSingletonScope();
    bind(core_1.TextingClientType)
        .to(utilities_1.TextingClient)
        .inSingletonScope();
    bind(log_1.LogEntryRepositoryType).to(repositories_1.LogEntryRepository);
    bind(web_analytics_1.WebAnalyticsRepositoryType).to(repositories_1.WebAnalyticsRepository);
    bind(widget_1.WidgetSettingsRepositoryType).to(repositories_1.WidgetSettingsRepository);
    bind(widget_1.WidgetMessageRepositoryType).to(repositories_1.WidgetMessageRepository);
});
var IoC = new inversify_1.Container();
exports.IoC = IoC;
IoC.load(APIModule, log_1.LogModule, web_analytics_1.WebAnalyticsModule, widget_1.WidgetModule);
//# sourceMappingURL=ioc.js.map