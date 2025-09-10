Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridAxisModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json'
    ],

    idProperty: 'dataIndex',
    fields: [
        { name: 'dataIndex', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'table', type: 'string' },
        { name: 'column', type: 'string' },
        { name: 'func', type: 'string' },


        { name: 'align', type: 'string', defaultValue: 'left' },
        // { name: 'type', type: 'string', defaultValue: 'string' },
        // { name: 'width', type: 'int', defaultValue: 100 },
        // { name: 'hidden', type: 'boolean', defaultValue: false },
        { name: 'pivotFunction', type: 'string', defaultValue: null }
    ],
});
