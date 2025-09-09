Ext.define('Tualo.routes.reportPivot.Viewer', {
    statics: {
        load: async function () {
            return [
                {
                    name: 'Pivot Viewer ',
                    path: '#report-pivot(/:{id})'
                }
            ]
        }
    },
    url: 'report-pivot(/:{id})',
    handler: {

        action: function (values) {
            Ext.getApplication().addView('Tualo.reportPivot.lazy.views.PivotPanel', {
                documentId: values.id
            });
        },
        before: function (values, action) {
            action.resume();

        },


    }
});

Ext.define('Tualo.routes.FibuConv', {
    url: 'binary-docx',
    handler: {
        action: function (token) {
            console.log('onAnyRoute', token);
            alert('fibuconv', 'ok');
        },
        before: function (action) {
            console.log('onBeforeToken', action);
            console.log(new Date());
            action.resume();
        }
    }
});