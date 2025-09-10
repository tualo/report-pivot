Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridFunctionDistinctCount', {
  extend: 'Tualo.reportPivot.lazy.controlls.PivotGridFunction',
  alias: 'pivotfunction.distinctcount',
  value: 0,
  titleTemplate: 'indiv. Anzahl ({text})',
  calculate: function (value) {
    this.value += 1;
  },
  getValue: function () {
    return this.value;
  }
});
