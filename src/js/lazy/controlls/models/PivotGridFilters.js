Ext.define('Tualo.reportPivot.lazy.controlls.models.PivotGridFilters', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json'
    ],

    idProperty: 'id',

    fields: [
        {
            name: 'table', type: 'string'
        },
        {
            name: 'column', type: 'string'
        },
        {
            name: 'func', type: 'string'
        },
        {
            name: 'type', type: 'string'
        },
        {
            name: 'value'
        },
        {
            name: 'operator', type: 'string', defaultValue: '='
        }

    ]
});
