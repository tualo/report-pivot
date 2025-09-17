
Ext.define('Tualo.reportPivot.lazy.controlls.controller.Settings', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tualo-reportpivot-settings',

    onBoxReady: function () {

        Tualo.reportPivot.Logger.log('onBoxReady', 'tualo-reportpivot-settings');

    },

    onPivotFunctionChange: function (field, newValue, oldValue, eOpts) {
        let vm = this.getViewModel();
        let rec = vm.get('axisRecord');
        Tualo.reportPivot.Logger.log('onPivotFunctionChange', newValue);
        rec.set('pivotFunction', newValue.replace('pivotfunction.', '') || null);
    },

    onApplyAxisRecord: function (rec) {
        let vm = this.getViewModel();
        let store = vm.getStore('filter');
        store.removeAll();

        if (
            (rec.get('filterValue') != '{}') && (rec.get('filterValue') != '[]') && (rec.get('filterValue') != '')
        ) {
            let l = JSON.parse(rec.get('filterValue'));
            l.forEach(f => {
                let o = { ...f };
                store.add(o);
            });
        }

    },

    onAddClick: function () {
        let vm = this.getViewModel();
        let store = vm.getStore('filter');
        let rec = vm.get('axisRecord');


        let o = { ...rec.data };
        delete o.id;

        o.operator = '=';
        o.value = null;

        store.add(o);


        /*
        store.add({
            table: rec.get('table'),
            column: rec.get('column'),
            pivotFunction: rec.get('pivotFunction'),
            type: rec.get('type'),

            value: rec.get('filterValue'),
            operator: '='
        });
        */
    },
    onRemoveClick: function () {
        let vm = this.getViewModel();
        let store = vm.getStore('filter');
        let sm = this.lookupReference('filterGrid').getSelection();
        store.remove(sm);
    },

    getDataList: function (storeName) {
        let result = [];

        let store = this.getViewModel().getStore(storeName);

        store.getRange().forEach(function (rec) {
            let c = { ...rec.data };
            delete c.id;
            result.push(c);
        });
        return result;
    },

    onFilterDataChanged: function () {
        let vm = this.getViewModel();
        let dataList = this.getDataList('filter');
        let rec = vm.get('axisRecord');

        Tualo.reportPivot.Logger.log('onFilterDataChanged', dataList);
        rec.set('filterValue', JSON.stringify(dataList));

        /*
        let filters = store.queryBy(function (rec) {
            return rec.get('table') === rec.get('dataIndex');
        });
        
        if (filters.length > 0) {
            rec.set('filterValue', filters.first().get('value'));
        } else {
            rec.set('filterValue', null);
        }
            */
    }
});