Ext.define('Tualo.reportPivot.lazy.controlls.PivotGridFunctionAverage', {
	statics: {
		comboboxText: function () {
			return 'Durchschnitt';
		}
	},
	extend: 'Tualo.reportPivot.lazy.controlls.PivotGridFunction',
	alias: 'pivotfunction.average',
	value: 0,
	count: 0,
	titleTemplate: 'Durchschnitt ({text})',
	calculate: function (value) {
		this.value += value;
		this.count += 1;
	},
	getValue: function () {
		return this.value / this.count;
	}
});