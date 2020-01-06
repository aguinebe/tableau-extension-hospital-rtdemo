'use strict';

(function () {
  $(document).ready(function () {
    const table = $('#parameterTable');
    const tableBody = table.children('tbody');

    // This is the entry point into the extension.  It initializes the Tableau Extensions Api, and then
    // grabs all of the parameters in the workbook, processing each one individually.
    tableau.extensions.initializeAsync( {'configure': configure} ).then(function () {
      tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function (parameters) {
        adjustToSettings();
        $('#message').html( 'play' );
        setInterval( clock2000, 4000 );
      });
    });
  });

  function clock5000() {
    if ( document.getElementById("refresh").checked ) {
        $('#message2').html( Date.now() );
        let dashboard = tableau.extensions.dashboardContent.dashboard;
        dashboard.worksheets.find( w => w.name === "Bed utilization" ).getDataSourcesAsync().then( datasources => {
            for( let dataSource of datasources ) {
                dataSource.refreshAsync();
            }
        });
        dashboard.worksheets.find( w => w.name === "Room turnaround time" ).getDataSourcesAsync().then( datasources => {
          for( let dataSource of datasources ) {
              dataSource.refreshAsync();
          }
      });
    } else {
        $('#message2').html( "-" );
    }
  }

  var count = 0;

  function clock2000() {
    count = count + 1
    if ( document.getElementById("refresh").checked ) {
        // $('#message').html( count.toString() );
        tableau.extensions.dashboardContent.dashboard.findParameterAsync( "Clock" ).then( function( c_p ) {
            c_p.changeValueAsync( parseInt( c_p.currentValue.value ) + 2 );
            // $('#message').html( typeof c_p.currentValue.value );
        } )
            
    } else {
        // $('#message').html( " --- " + count.toString() );
    }
  }

  function adjustToSettings() {
  }

  function configure() {
    const popupUrl = `${window.location.origin}/skills-configure.html`;
    tableau.extensions.ui.displayDialogAsync( popupUrl , "", { height: 100, width: 300 }).then((closePayload) => {
      adjustToSettings();
    }).catch((error) => {
      // One expected error condition is when the popup is closed by the user (meaning the user
      // clicks the 'X' in the top right of the dialog).  This can be checked for like so:
      switch(error.errorCode) {
        case tableau.ErrorCodes.DialogClosedByUser:
          console.log("Dialog was closed by user");
          break;
        default:
          console.error(error.message);
      }
    });
  }
  //
  // DOM creation methods
  //

})();