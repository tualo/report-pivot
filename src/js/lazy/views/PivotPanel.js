Ext.define('Tualo.reportPivot.lazy.views.PivotPanel', {
    extend: 'Ext.Panel',
    requires: [
        'Tualo.reportPivot.lazy.controller.PivotPanel',
        'Tualo.reportPivot.lazy.models.PivotPanel',
        'Tualo.reportPivot.lazy.views.RemotePivotGrid'
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
        tablename: null,
        documentId: null
    },
    onBoxReady: function () {

        Tualo.reportPivot.Logger.log('onBoxReady', 'tualo-reportpivot-panel');
        this.getController().onBoxReady();
    },

    updateProxy: function (storeName) {
        let vm = this.getViewModel(),
            store = vm.getStore(storeName),
            documentId = vm.get('documentId'),
            table = vm.get('tablename'),
            parts = ['.', 'report-pivot', storeName, table, documentId];

        store.getProxy().setUrl(parts.join('/'));
        store.load()
    },

    applyDocumentId: function (id) {
        Tualo.reportPivot.Logger.log('PivotPanel: Document ID applied to:', id);
        this.getViewModel().set('documentId', id);
        this.updateProxy('values');
        this.updateProxy('left');
        this.updateProxy('top');
        this.updateProxy('filters');
        return id;
    },



    applyTablename: function (table) {
        Tualo.reportPivot.Logger.log('PivotPanel: Table Name applied to:', table);
        this.getViewModel().set('tablename', table);

        let vm = this.getViewModel(),
            storeName = 'available',
            store = vm.getStore(storeName),
            parts = ['.', 'report-pivot', storeName, table];


        this.updateProxy('values');
        this.updateProxy('left');
        this.updateProxy('top');
        this.updateProxy('filters');

        store.getProxy().setUrl(parts.join('/'));
        store.load();
        return table;

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
        },
        {
            hidden: true,
            xtype: 'tualo-reportpivot-remotepivotgrid',
            itemId: 'pivotgrid',
            bind: {
                store: '{aggregate}',
                values: '{values}',
                available: '{available}',
                left: '{left}',
                top: '{top}'
            },
            listeners: {
                changed: 'onPivotChanged'
            }


        }
    ]
});