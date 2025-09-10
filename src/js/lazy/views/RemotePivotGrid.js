Ext.define('Tualo.reportPivot.lazy.views.RemotePivotGrid', {
	alias: 'widget.tualo-reportpivot-remotepivotgrid',
	extend: 'Ext.panel.Panel',
	requires: [
		'Ext.grid.Panel',

		'Tualo.reportPivot.lazy.controller.RemotePivotGrid',
		'Tualo.reportPivot.lazy.models.RemotePivotGrid',

		'Tualo.reportPivot.lazy.controlls.PivotGridAxis',
		'Tualo.reportPivot.lazy.controlls.PivotGridFunctionSum',
		'Tualo.reportPivot.lazy.controlls.PivotGridFunctionCount',
		'Tualo.reportPivot.lazy.controlls.PivotGridFunctionAverage',
		'Tualo.reportPivot.lazy.controlls.PivotGridFunctionDistinctCount',
		'Tualo.reportPivot.lazy.controlls.PivotGridFunctionMin',
		'Tualo.reportPivot.lazy.controlls.PivotGridFunctionMax'
	],

	layout: 'border',
	config: {
		store: null,
		available: null,
	},
	onBoxReady: function () {
		console.log('onBoxReady', 'tualo-reportpivot-remotepivotgrid');
		this.getController().onBoxReady();
	},
	applyStore: function (store) {
		console.log('RemotePivotGrid: Store applied to:', store);
		this.getViewModel().set('aggregate', store);
	},
	applyAvailable: function (available) {
		console.log('RemotePivotGrid: Available applied to:', available);
		this.down('#available').setStore(available);
		this.getViewModel().set('availableStore', available);
	},
	controller: 'tualo-reportpivot-remotepivotgrid',
	viewModel: {
		type: 'tualo-reportpivot-remotepivotgrid'
	},
	items: [
		{
			region: 'center',
			border: false,
			layout: 'card',
			title: 'Pivot',
			xtype: 'gridpanel',
			columns: [],
			bind: {
				store: '{aggregate}'
			}
		},
		{
			region: 'east',
			xtype: 'panel',
			collapsible: true,
			//collapsed: (typeof this.collapsedAxisConfiguration==='undefined')?false:this.collapsedAxisConfiguration,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			border: false,
			// hidden: !this.showAxisConfiguration,
			width: 500,
			//width: (typeof this.axisConfigSize==='undefined')?500:this.axisConfigSize,
			split: true,
			items: [
				{
					xtype: 'panel',
					flex: 1,
					border: true,
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'tualo-reportpivot-pivotgridsaxis',
							// title: 'Verfügbar',
							border: true,
							itemId: 'available',
							text: 'Verfügbar',
							functionText: 'Funktion',
							filterText: 'Filter',
							showFilter: true,
							showFunction: false,
							listeners: {
								changed: 'onAxisChanged'
							},


						},
						{
							xtype: 'tualo-reportpivot-pivotgridsaxis',
							//title: 'Spalten',
							border: true,
							itemId: 'columns',
							text: 'Spalten',
							functionText: 'Funktion',
							filterText: 'Filter',
							showFilter: true,
							showFunction: false,


							bind: {
								store: '{columnsStore}'
							},
							listeners: {
								changed: 'onAxisChanged'
							}

						}
					]
				},
				{
					xtype: 'panel',
					flex: 1,
					border: true,
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'tualo-reportpivot-pivotgridsaxis',
							// title: 'Zeilen',
							border: true,
							itemId: 'rows',
							text: 'Zeilen',
							functionText: 'Funktion',
							filterText: 'Filter',
							showFilter: true,
							showFunction: false,
							bind: {
								store: '{rowsStore}'
							},
							listeners: {
								changed: 'onAxisChanged'
							}

						},
						{
							xtype: 'tualo-reportpivot-pivotgridsaxis',
							// title: 'Werte',
							border: true,
							itemId: 'values',
							text: 'Werte',
							functionText: 'Funktion',
							filterText: 'Filter',
							showFilter: true,
							showFunction: true,
							bind: {
								store: '{valuesStore}'
							},
							listeners: {
								changed: 'onAxisChanged'
							}
						}
					]
				}
			]
		}
	]
});