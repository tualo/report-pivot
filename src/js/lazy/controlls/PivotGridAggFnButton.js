Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridAggFnButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.tualo-reportpivot-pivotgridaggfnbutton',
    requires: [
        'Tualo.reportPivot.lazy.controlls.Settings'
    ],
    config: {
        pivotFunction: null,
        filterValue: null,
        functionHidden: false,
        text: null
    },

    applyText: function (v) {
        this.text = null;
        Tualo.reportPivot.Logger.log('applyText >>>>>>>>>>> ', v);
        return v;
    },
    setText: function (v) {
        this.text = null;
        Tualo.reportPivot.Logger.log('setText >>>>>>>>>>> ', v);
        this.callParent([v]);
    },
    updateText: function (v) {
        this.text = null;
        Tualo.reportPivot.Logger.log('updateText >>>>>>>>>>> ', v);
        this.callParent([v]);
    },

    applyPivotFunction: function (v) {
        this.pivotFunction = v;
        Tualo.reportPivot.Logger.log('applyPivotFunction', v);
        return v;
    },
    applyFilterValue: function (v) {
        this.filterValue = v;
        Tualo.reportPivot.Logger.log('applyFilterValue', v);
        return v;
    },
    applyFunctionHidden: function (v) {
        this.functionHidden = v;
        Tualo.reportPivot.Logger.log('applyFunctionHidden', v);
        return v;
    },


    iconCls: 'x-fa fa-solid fa-gear',
    ui: 'pivot-iconbutton',
    handler: function (btn) {
        var rec = btn.getWidgetRecord(),
            col = btn.getWidgetColumn();

        let windowWidth = window.innerWidth * 0.50;
        let windowHeight = window.innerHeight * 0.50;

        var myWindow = Ext.create('Ext.window.Window', {
            title: 'Einstellungen für ' + rec.get('text'),
            height: windowHeight,
            width: windowWidth,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'tualo-reportpivot-settings',
                axisRecord: rec,
                functionHidden: btn.getFunctionHidden()
            }
        });

        myWindow.show();
        myWindow.on('apply', function () {
            myWindow.close();
            Tualo.reportPivot.Logger.log('Apply clicked', col.getView());
            col.getView().grid.getController().onDataChanged();
        });
        myWindow.on('close', function () {
            Tualo.reportPivot.Logger.log('Window closed');
        });
        myWindow.center();
    }
});