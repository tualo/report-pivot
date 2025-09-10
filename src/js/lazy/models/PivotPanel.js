Ext.define('Tualo.reportPivot.lazy.models.PivotPanel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tualo-reportpivot-panel',
    requires: [
        'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
    ],
    data: {
        documentId: null
    },
    formulas: {

    },
    stores: {
        aggregate: {
            pageSize: 25000,
            model: 'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'PATCH',
                    destroy: 'DELETE'
                },
                timeout: 600000,
                url: './report-pivot/aggregate',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total',
                    listeners: {
                        scope: this
                    }
                }
            }
        },
        available: {
            pageSize: 25000,
            fields: ['column_name', 'text', 'type'],
            model: 'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'PATCH',
                    destroy: 'DELETE'
                },
                timeout: 600000,
                url: './report-pivot/available',
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
                load: 'onAvailableLoad'
            }
        },


        columns: {
            pageSize: 25000,
            autoLoad: true,
            model: 'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'PATCH',
                    destroy: 'DELETE'
                },
                timeout: 600000,
                url: './report-pivot/columns',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total',
                    listeners: {
                        scope: this
                    }
                }
            }
        },

        rows: {
            pageSize: 25000,
            autoLoad: true,
            model: 'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'PATCH',
                    destroy: 'DELETE'
                },
                timeout: 600000,
                url: './report-pivot/rows',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total',
                    listeners: {
                        scope: this
                    }
                }
            }
        },



        values: {
            pageSize: 25000,
            autoLoad: true,
            model: 'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'PATCH',
                    destroy: 'DELETE'
                },
                timeout: 600000,
                url: './report-pivot/values',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total',
                    listeners: {
                        scope: this
                    }
                }
            }
        },
    }
});