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
        this.onPivotChanged(this.getView().down('#pivotgrid'));
    },

    onLeftLoad: function (store, records, successful, operation, eOpts) {
        this.onPivotChanged(this.getView().down('#pivotgrid'));
    },
    onTopLoad: function (store, records, successful, operation, eOpts) {
        this.onPivotChanged(this.getView().down('#pivotgrid'));
    },
    onValuesLoad: function (store, records, successful, operation, eOpts) {
        this.onPivotChanged(this.getView().down('#pivotgrid'));
    },

    onPivotChanged: async function (pivot) {
        console.log('onPivotChanged', pivot);
        let params = this.getPivotParams();
        if (params.pivot.left.length === 0) return;
        if (params.pivot.top.length === 0) return;
        if (params.pivot.values.length === 0) return;
        let x = await (await fetch('./report-pivot/aggregate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })).json();


        console.log('onPivotChanged', x);
        this.reconfigureColumns(params, x);

        this.getView().down('#pivotgrid').down('#pivotgrid').getStore().loadData(x.data);
    },


    topColumns: function (remainingTops, responseMap, values, prefix) {
        let me = this,
            columns = [];
        if (remainingTops.length === 0) return null;

        let col = remainingTops[0];
        responseMap.filter((c) => c.dataindex == col.dataIndex).forEach(function (item) {
            console.log('topColumns', item);
            let topDef = values[0];

            let config = {
                text: item.value, // ggf rendern
                dataIndex: prefix + item.id,
                align: topDef.align,
                minWidth: 100,
                // renderer: Ext.util.Format[topDef.renderer]
            };
            let sub_columns = [];
            sub_columns = me.topColumns(remainingTops.slice(1), responseMap, values, prefix + item.id + '_');
            if (sub_columns && sub_columns.length > 0) {
                config.columns = sub_columns;
            } else {
                sub_columns = [];
                values.forEach(function (v) {
                    sub_columns.push({
                        text: v.text,
                        dataIndex: (prefix + item.id).replace('fld_', v.dataIndex + '_'),
                        align: v.align,
                        minWidth: 100,
                        renderer: Ext.util.Format[v.renderer]
                    });
                });
                config.columns = sub_columns;
            }
            columns.push(config);
        });


        return columns;
    },


    reconfigureColumns: function (params, response) {
        let columns = [];

        params.pivot.left.forEach(function (col) {
            columns.push({
                text: col.text,
                dataIndex: col.dataIndex,
                align: col.align,
                renderer: Ext.util.Format[col.renderer]
            });
        });

        let t = this.topColumns(params.pivot.top, response.map, params.pivot.values, 'fld_');
        columns.push(...t);


        var me = this.getView().down('#pivotgrid').down('#pivotgrid');
        if (columns) {
            me.headerCt.removeAll();
            // columns = this.reconfigureRenderer(columns);
            me.headerCt.add(columns);
        }
        me.getView().refresh();
    },


    getPreFilters: function () {
        return [];
    },

    getColumnsByAxis: function (axis) {
        let result = [];

        console.log('getColumnsByAxis', axis, this.getViewModel().getStore(axis));
        let store = this.getViewModel().getStore(axis);
        // this.getView().down('#' + axis).getStore();

        store.getRange().forEach(function (rec) {
            let c = { ...rec.data };
            result.push(c);
        });
        return result;
    },

    getPivotParams: function () {
        let result = {
            documentId: this.getViewModel().get('documentId'),
            preFilters: this.getPreFilters(),
            pivot: {
                top: this.getColumnsByAxis('top'),
                left: this.getColumnsByAxis('left'),
                values: this.getColumnsByAxis('values'),
                available: this.getColumnsByAxis('available')
            }
        };
        return result;
    },


});
