Ext.define('Tualo.reportPivot.lazy.controlls.models.PivotGridAxis', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tualo-reportpivot-pivotgridsaxis',
    data: {
        text: 'Zeile',
        showFunction: false,
        showFilter: false,
        showNumberFilter: false,
        functionText: 'Funktion',
        filterText: 'Filter',
        selectText: 'ausw&auml;hlen',
        unselectText: 'aufheben',
        unfilteredText: 'Ungefiltert',
        applyFilterText: 'Anwenden',
        clearFilterText: 'nicht Filtern',
        cancelFilterText: 'Abbrechen',
    },
    formulas: {
        hideFilter: function (get) {
            return !get('showFilter');
        }
        , hideNumberFilter: function (get) {
            return !get('showNumberFilter');
        }
        ,
        hideFunction: function (get) {
            return !get('showFunction');
        }
    },
    stores: {

        columns: {
            pageSize: 25000,
            autoLoad: true,
            model: 'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total',
                    listeners: {
                        scope: this
                    }
                }
            },
            listeners: {
                datachanged: 'onDataChanged'
            },

        }
    }
});
