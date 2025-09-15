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

        console.log('onBoxReady', 'tualo-reportpivot-panel');
        this.getController().onBoxReady();
    },
    applyDocumentId: function (id) {
        console.log('PivotPanel: Document ID applied to:', id);
        this.getViewModel().set('documentId', id);
        // this.getController().onDocumentIdChange(id);
        // this.loadDocument(id);
    },

    applyTablename: function (table) {
        console.log('PivotPanel: Table Name applied to:', table);
        this.getViewModel().set('tablename', table);

        this.getViewModel().set('tablename', table);


        let valuesStore = this.getViewModel().getStore('values');
        valuesStore.getProxy().setUrl('./report-pivot/values/' + table);
        valuesStore.load();

        let leftStore = this.getViewModel().getStore('left');
        leftStore.getProxy().setUrl('./report-pivot/left/' + table);
        leftStore.load();



        let topStore = this.getViewModel().getStore('top');
        topStore.getProxy().setUrl('./report-pivot/top/' + table);
        topStore.load();

        let availableStore = this.getViewModel().getStore('available');
        availableStore.getProxy().setUrl('./report-pivot/available/' + table);
        availableStore.load();

        let filtersStore = this.getViewModel().getStore('filters');
        filtersStore.getProxy().setUrl('./report-pivot/filters/' + table);
        filtersStore.load();



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