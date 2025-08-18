sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'bpwf',
            componentId: 'ZR_BPCT_NList',
            contextPath: '/ZR_BPCT_N'
        },
        CustomPageDefinitions
    );
});