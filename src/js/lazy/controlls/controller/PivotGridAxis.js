
Ext.define('Tualo.reportPivot.lazy.controlls.controller.PivotGridAxis', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tualo-reportpivot-pivotgridsaxis',

    onBoxReady: function () {

        console.log('onBoxReady', 'tualo-reportpivot-pivotgridsaxis');

    },

    onDropped: function (node, data, dropRec, dropPosition) {
        console.log('onDropped', this.getView().getStore().getRange());
        this.getView().fireEvent('changed', this.getView());
    }


});