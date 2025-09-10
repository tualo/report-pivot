Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridFunctionSum', {
	extend: 'Tualo.reportPivot.lazy.controlls.PivotGridFunction',
	alias: 'pivotfunction.sum',
	value: 0,
	titleTemplate: 'Summe ({text})',
	calculate: function (value) {
		this.value += value;
	},
	getValue: function () {
		return this.value;
	}
});