Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridFunctionCount', {
	extend: 'Tualo.reportPivot.lazy.controlls.PivotGridFunction',
	statics: {
		comboboxText: function () {
			return 'Anzahl';
		}
	},
	alias: 'pivotfunction.count',
	value: 0,
	titleTemplate: 'Anzahl ({text})',
	calculate: function (value) {
		this.value += 1;
	},
	getValue: function () {
		return this.value;
	}
});