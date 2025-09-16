
Ext.define('Tualo.reportPivot.lazy.controlls.Operators', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.tualo-reportpivot-operators',
    store: {
        autoSync: true,
        type: 'store',
        fields: ['value', 'text'],
        data: [
            { value: '=', text: 'gleich' },
            { value: '<>', text: 'ungleich' },
            { value: '<', text: 'kleiner als' },
            { value: '<=', text: 'kleiner gleich' },
            { value: '>', text: 'größer als' },
            { value: '>=', text: 'größer gleich' },
            { value: 'like', text: 'enthält' },
            { value: 'not like', text: 'nicht enthält' },
            { value: 'in', text: 'in' },
            { value: 'not in', text: 'nicht in' },
            { value: 'is null', text: 'ist null' },
            { value: 'is not null', text: 'ist nicht null' },
            { value: 'start', text: 'beginnt mit' },
            { value: 'end', text: 'endet mit' }
        ],
        queryMode: 'local',
        displayField: 'text',
        valueField: 'value',
        editable: false,
        forceSelection: true,
        value: '='
    }
});
