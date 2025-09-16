
Ext.define('Tualo.reportPivot.lazy.controlls.controller.PivotGridAxis', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tualo-reportpivot-pivotgridsaxis',

    onBoxReady: function () {

        Tualo.reportPivot.Logger.log('onBoxReady', 'tualo-reportpivot-pivotgridsaxis');

    },

    onDropped: function (node, data, dropRec, dropPosition) {
        Tualo.reportPivot.Logger.log('onDropped', this.getView().getStore().getRange());
        this.getView().fireEvent('changed', this.getView());
    },

    onDataChanged: function () {
        Tualo.reportPivot.Logger.log('onDataChanged', arguments);
        this.getView().fireEvent('changed', this.getView());
    }


});