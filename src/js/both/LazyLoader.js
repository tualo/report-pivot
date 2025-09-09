Ext.define('Tualo.reportPivot.LazyLoader', {
    singleton: true,
    requires: [
        'Ext.Loader'
    ]
});
Ext.Loader.setPath('Tualo.reportPivot.lazy', './jsreport-pivot');
