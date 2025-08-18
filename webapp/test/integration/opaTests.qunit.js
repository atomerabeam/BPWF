sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'bpwf/test/integration/FirstJourney',
		'bpwf/test/integration/pages/ZR_BPCT_NList',
		'bpwf/test/integration/pages/ZR_BPCT_NObjectPage'
    ],
    function(JourneyRunner, opaJourney, ZR_BPCT_NList, ZR_BPCT_NObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('bpwf') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZR_BPCT_NList: ZR_BPCT_NList,
					onTheZR_BPCT_NObjectPage: ZR_BPCT_NObjectPage
                }
            },
            opaJourney.run
        );
    }
);