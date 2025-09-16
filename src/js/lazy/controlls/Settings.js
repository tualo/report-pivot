Ext.define('Tualo.reportPivot.lazy.controlls.Settings', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tualo-reportpivot-settings',
    requires: [
        'Tualo.reportPivot.lazy.controlls.PivotGridFunctionCombobox',
        'Tualo.reportPivot.lazy.controlls.controller.Settings',
        'Tualo.reportPivot.lazy.controlls.models.Settings',
        'Tualo.reportPivot.lazy.controlls.Operators'
    ],
    config: {
        axisRecord: null,
        pivotFunction: null,
        filterValue: null,
        functionHidden: null
    },
    bbar: [
        '->',
        {
            xtype: 'button',
            text: 'Übernehmen',
            glyph: 'xf00c@FontAwesome',
            listeners: {
                click: function (btn) {
                    var win = btn.up('window');
                    win.fireEvent('apply');
                }
            }
        },
        {
            xtype: 'button',
            text: 'Abbrechen',
            glyph: 'xf00d@FontAwesome',
            listeners: {
                click: function (btn) {
                    var win = btn.up('window');
                    win.close();
                }
            }
        }
    ],
    viewModel: {
        type: 'tualo-reportpivot-settings',
    },
    controller: 'tualo-reportpivot-settings',
    applyAxisRecord: function (value) {
        Tualo.reportPivot.Logger.log('Axis record:', value);
        this.getViewModel().set('axisRecord', value);
        this.getController().onApplyAxisRecord(value);
        return value;
    },
    applyFunctionHidden: function (value) {
        Tualo.reportPivot.Logger.log('Function hidden:', value);
        this.getViewModel().set('functionHidden', value);
        return value;
    },
    applyFilterValue: function (value) {
        Tualo.reportPivot.Logger.log('Filter value:', value);
        this.getViewModel().set('filterValue', value);
        return value;
    },
    applyPivotFunction: function (value) {
        Tualo.reportPivot.Logger.log('Pivot function:', value);
        this.getViewModel().set('pivotFunction', value);
        return value;
    },
    border: false,
    bodyPadding: 10,
    fieldDefaults: {
        labelAlign: 'top',
        labelWidth: 100,
        anchor: '100%'
    },
    items: [

        {
            // Fieldset in Column 1 - collapsible via toggle button
            xtype: 'fieldset',
            title: 'Aggregatfunktion',
            bind: {
                collapsed: '{functionHidden}'
            },
            collapsible: true,
            collapsed: false,
            layout: 'anchor',
            items: [
                {
                    xtype: 'tualo-reportpivot-pivotgrid-functioncombobox',
                    fieldLabel: 'Funktion',
                    // value: rec.get('pivotFunction'),
                    bind: {
                        value: '{pivotFunction}',
                        disabled: '{functionHidden}'
                    },
                    listeners: {
                        change: function (field, newValue, oldValue, eOpts) {
                            Tualo.reportPivot.Logger.log('change', newValue);
                            // rec.set('pivotFunction', newValue.replace('pivotfunction.', '') || null);
                        }
                    }
                }
            ]
        },
        {
            // Fieldset in Column 1 - collapsible via toggle button
            xtype: 'fieldset',
            title: 'Filter',
            collapsible: true,
            collapsed: false,
            layout: 'anchor',
            items: [
                {
                    xtype: 'grid',
                    reference: 'filterGrid',
                    fieldLabel: 'Filterwert',
                    plugins: [
                        {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        }
                    ],
                    tbar: [{
                        xtype: 'button',
                        glyph: 'xf067@FontAwesome',
                        text: 'Hinzufügen',
                        listeners: {
                            click: 'onAddClick'
                        }
                    }, {
                        xtype: 'button',
                        glyph: 'xf068@FontAwesome',
                        text: 'Entfernen',
                        listeners: {
                            click: 'onRemoveClick'
                        }
                    }],
                    // value: rec.get('filterValue'),
                    bind: {
                        store: '{filter}'
                    },
                    columns: [
                        {
                            text: 'Tabelle',
                            dataIndex: 'table',
                            hidden: true,
                            flex: 1
                        },
                        {
                            text: 'Spalte',
                            dataIndex: 'column',
                            hidden: true,
                            flex: 1
                        },
                        {
                            text: 'Operator',
                            dataIndex: 'operator',

                            editor: {
                                xtype: 'tualo-reportpivot-operators',
                                allowBlank: false
                            },


                            flex: 1
                        },
                        {
                            text: 'Wert',
                            dataIndex: 'value',
                            flex: 2,
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }
                    ],
                    height: 200
                }
            ]
        },

    ]

})
