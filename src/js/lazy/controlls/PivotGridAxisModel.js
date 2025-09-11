Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridAxisModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json'
    ],

    idProperty: 'dataIndex',
    fields: [
        {
            name: 'dataIndex', type: 'string', calculate: function (data) {
                return data.column_name;
            }
        },
        {
            name: 'column', type: 'string', calculate: function (data) {
                return data.column_name;
            }
        },

        {
            name: 'text', type: 'string', calculate: function (data) {
                return data.label;
            }
        },

        {
            name: 'table', type: 'string', calculate: function (data) {
                return data.table_name;
            }
        },

        { name: 'type', type: 'string' },
        { name: 'label', type: 'string' },
        { name: 'table_name', type: 'string' },
        { name: 'column_name', type: 'string' },
        { name: 'renderer', type: 'string' },

        { name: 'func', type: 'string', defaultValue: null },
        { name: 'align', type: 'string', defaultValue: 'left' },
        { name: 'pivotFunction', type: 'string', defaultValue: "Ext.tualo.PivotGridFunctionSum" }
    ],

});
