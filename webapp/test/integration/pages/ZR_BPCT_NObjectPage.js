sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'bpwf',
            componentId: 'ZR_BPCT_NObjectPage',
            contextPath: '/ZR_BPCT_N'
        },
        CustomPageDefinitions
    );
});