Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridFilterButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.tualo-reportpivot-pivotgridfilterbutton',

    config: {
        filterValue: null
    },
    applyFilterValue: function (v) {
        this.filterValue = v;
        Tualo.reportPivot.Logger.log('applyFilterValue', v);
        return v;
    },
    iconCls: 'x-fa fa-solid fa-gear',
    ui: 'pivot-iconbutton',
    handler: function (btn) {
        var rec = btn.getWidgetRecord();

        let windowWidth = window.innerWidth * 0.50;
        let windowHeight = window.innerHeight * 0.50;

        var myWindow = Ext.create('Ext.window.Window', {
            title: 'Filter for ' + rec.get('text'),
            height: windowHeight,
            width: windowWidth,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'panel',
                border: false,
            }
        });

        myWindow.show();
        myWindow.on('close', function () {
            Tualo.reportPivot.Logger.log('Window closed');
        });
        myWindow.center();
    }
});