Ext.define('Tualo.reportPivot.lazy.controller.RemotePivotGrid', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tualo-reportpivot-remotepivotgrid',

    onBoxReady: function () {

        Tualo.reportPivot.Logger.log('RemotePivotGrid', 'tualo-reportpivot-remotepivotgrid');
    },
    onAxisChanged: function (axis) {
        Tualo.reportPivot.Logger.log('onAxisChanged', 'tualo-reportpivot-remotepivotgrid');
        this.getView().fireEvent('changed', this.getView());
    },
    onDataChanged: function () {
        Tualo.reportPivot.Logger.log('onDataChanged', 'tualo-reportpivot-remotepivotgrid');
    }
});
