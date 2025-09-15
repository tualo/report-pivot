Ext.define('Tualo.reportPivot.lazy.controller.RemotePivotGrid', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tualo-reportpivot-remotepivotgrid',

    onBoxReady: function () {

        console.log('RemotePivotGrid', 'tualo-reportpivot-remotepivotgrid');
    },
    onAxisChanged: function (axis) {
        this.getView().fireEvent('changed', this.getView());
    }

});
