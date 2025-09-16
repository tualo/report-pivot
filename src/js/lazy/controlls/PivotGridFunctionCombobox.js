Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridFunctionCombobox', {
    extend: 'Ext.form.field.ComboBox',
    alias: ['widget.tualo-reportpivot-pivotgrid-functioncombobox'],
    valueField: 'id',
    displayField: 'name',
    anchor: '100%',
    queryMode: 'local',
    initComponent: function () {
        var list = [];

        for (var name in Ext.ClassManager.aliasToName) {
            if (name.indexOf('pivotfunction.') == 0) {
                if (typeof Ext.ClassManager.aliasToName[name] == 'string') {
                    let label = Ext.ClassManager.getByAlias(name).comboboxText?.();

                    if (label) {
                        list.push([name, label]);
                    }
                }
            }

        }
        this.store = Ext.create('Ext.data.ArrayStore', {
            autoLoad: false,
            autoSync: false,
            remoteFilter: false,
            remoteSort: false,
            pageSize: 5000,
            fields: [
                { name: 'id', type: 'string' },
                { name: 'name', type: 'string' }
            ],
            data: list
        });
        this.callParent(arguments);
    }

});
