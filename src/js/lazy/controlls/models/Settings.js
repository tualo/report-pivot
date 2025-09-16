Ext.define('Tualo.reportPivot.lazy.controlls.models.Settings', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tualo-reportpivot-settings',
    data: {
        axisRecord: null,
        functionHidden: null,
        filterValue: null,
        pivotFunction: 'sum'
    },
    formulas: {

    },
    stores: {
        filter: {

            autoSync: true,
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
            model: 'Tualo.reportPivot.lazy.controlls.models.PivotGridFilters',
            data: [],
            listeners: {
                datachanged: 'onFilterDataChanged'
            }
        }
    }
});
