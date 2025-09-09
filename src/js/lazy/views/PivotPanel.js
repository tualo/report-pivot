Ext.define('Tualo.reportPivot.lazy.views.PivotPanel', {
    extend: 'Ext.Panel',
    requires: [
        'Tualo.reportPivot.lazy.controller.PivotPanel',
        'Tualo.reportPivot.lazy.models.PivotPanel',
    ],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    alias: 'widget.tualo-reportpivot-panel',
    controller: 'tualo-reportpivot-panel',
    viewModel: {
        type: 'tualo-reportpivot-panel'
    },


    config: {
        documentId: null
    },
    applyDocumentId: function (id) {
        console.log('PivotPanel: Document ID applied to:', id);
        this.getViewModel().set('documentId', id);
        // this.getController().onDocumentIdChange(id);
        // this.loadDocument(id);
    },
    layout: 'fit',
    items: [
        {
            hidden: false,
            xtype: 'panel',
            itemId: 'waitpanel',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'component',
                    cls: 'lds-container',
                    html: '<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'
                        + '<div><h3>Pivot wird erstellt</h3>'
                        + '<span>Einen Moment bitte ...</span></div>'
                }
            ]
        }
    ]
});