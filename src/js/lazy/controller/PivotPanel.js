Ext.define('Tualo.reportPivot.lazy.controller.PivotPanel', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tualo-reportpivot-panel',

    onBoxReady: function () {

        console.log('onBoxReady', 'tualo-reportpivot-panel');
        this.getView().down('#pivotgrid').setVisible(true);
        this.getView().down('#waitpanel').setVisible(false);
    },

    onAvailableLoad: function (store, records, successful, operation, eOpts) {
        console.log('onAvailableLoad', store, records, successful, operation, eOpts);
        let recordsData = [];
        for (let i = 0; i < records.length; i++) {
            let o = { ...records[i].data };
            delete o['id'];
            recordsData.push(o);
        }
        this.getView().down('#available').getStore().loadData(recordsData);
    },

    onPivotChanged: async function (pivot) {
        console.log('onPivotChanged', pivot);
        this.getPivotParams();
        let x = await (await fetch('./report-pivot/aggregate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.getPivotParams())
        })).json();
        console.log('onPivotChanged', x);
    },
    getPreFilters: function () {
        return [];
    },

    getColumnsByAxis: function (axis) {
        let result = [];
        let store = this.getView().down('#' + axis).getStore();
        store.getRange().forEach(function (rec) {
            result.push({
                dataIndex: rec.data.dataIndex,
                column: rec.data.column,
                table: rec.data.table,
                align: rec.data.align,
                pivotFunction: rec.data.pivotFunction,
                filter: rec.data.filter,
                number_filter: rec.data.number_filter,
                func: rec.data.func
            });
        });
        return result;
    },

    getPivotParams: function () {
        let result = {
            documentId: this.getViewModel().get('documentId'),
            preFilters: this.getPreFilters(),
            pivot: {
                top: this.getColumnsByAxis('columns'),
                left: this.getColumnsByAxis('rows'),
                values: this.getColumnsByAxis('values'),
                available: this.getColumnsByAxis('available')
            }
        };
        return result;
    }

});
