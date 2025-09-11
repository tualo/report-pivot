Ext.define('Tualo.routes.reportPivot.Viewer', {
    statics: {
        load: async function () {
            return [
                {
                    name: 'Pivot Viewer ',
                    path: '#report-pivot(/:{table})(/:{id})'
                }
            ]
        }
    },
    url: 'report-pivot(/:{table})(/:{id})',
    handler: {

        action: function (values) {
            Ext.getApplication().addView('Tualo.reportPivot.lazy.views.PivotPanel', {
                documentId: values.id,
                tablename: values.table
            });
        },
        before: function (values, action) {
            action.resume();

        },


    }
});