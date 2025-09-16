Ext.define('Tualo.reportPivot.lazy.models.PivotPanel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tualo-reportpivot-panel',
    requires: [
        'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
        'Tualo.reportPivot.lazy.controlls.models.PivotGridFilters'
    ],
    data: {
        documentId: null,
        tablename: null
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
            model: 'Tualo.reportPivot.lazy.controlls.PivotGridAxisModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'PATCH',
                    destroy: 'DELETE'
                },
                timeout: 600000,

                /*
                bind: {
                    url: './report-pivot/available/{tablename}',
                },
                */
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


        top: {
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
            },
            listeners: {
                load: 'onTopLoad'
            }
        },

        left: {
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
                load: 'onLeftLoad'
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
                load: 'onValuesLoad',
                datachanged: 'onDataChanged'
            }
        },
        filters: {
            pageSize: 25000,
            model: 'Tualo.reportPivot.lazy.controlls.models.PivotGridFilters',
            proxy: {
                type: 'ajax',
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
                load: 'onFiltersLoad'
            }
        },
    }
});