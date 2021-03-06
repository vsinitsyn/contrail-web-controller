/*
 * Copyright (c) 2017 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-view',
    'knockback'
], function (_, ContrailView, Knockback) {
    var prefixId = ctwc.DATABASE_NODE_PREFIX_ID;
    var modalId = 'configure-' + prefixId;
    var self;
    var databaseNodeEditView = ContrailView.extend({
        renderAddEditDatabaseNode: function (options) {
            var editTemplate =
                contrail.getTemplate4Id(cowc.TMPL_EDIT_FORM);
            var editLayout = editTemplate({prefixId: prefixId});
            self = this;

            cowu.createModal({'modalId': modalId, 'className': 'modal-700',
                'title': options['title'], 'body': editLayout,
                 'onSave': function () {
                        self.configEditDatabaseNode(options);
            }, 'onCancel': function () {
                Knockback.release(self.model, document.getElementById(modalId));
                kbValidation.unbind(self);
                $("#" + modalId).modal('hide');
            }});
            self.databaseNodeRenderView4Config(options);
        },

        configEditDatabaseNode : function(options) {
            self.model.addEditDatabaseNodeCfg({
                init: function () {
                    cowu.enableModalLoading(modalId);
                },
                success: function () {
                    options['callback']();
                    $("#" + modalId).modal('hide');
                },
                error: function (error) {
                    cowu.disableModalLoading(modalId, function () {
                        self.model.showErrorAttr(prefixId + cowc.FORM_SUFFIX_ID,
                                                 error.responseText);
                    });
                }
            }, options.mode === ctwl.CREATE_ACTION ? 'POST' : 'PUT');
        },

        databaseNodeRenderView4Config : function(options) {
            var disableFlag =
                (options.mode === ctwl.CREATE_ACTION) ?  false : true;
            self.renderView4Config($("#" + modalId).find("#" + prefixId + "-form"),
                self.model,
                self.getDatabaseNodeViewConfig(disableFlag),
                "databaseNodeValidations", null, null,
                function () {
                    self.model.showErrorAttr(prefixId + cowc.FORM_SUFFIX_ID,
                                             false);
                    Knockback.applyBindings(self.model,
                        document.getElementById(modalId));
                   kbValidation.bind(self);
                }, null, false
            );
        },

        renderDeleteDatabaseNodes: function(options) {
            var delTemplate =
                contrail.getTemplate4Id('core-generic-delete-form-template');
            var self = this;

            var delLayout = delTemplate({prefixId: prefixId});
            cowu.createModal({'modalId': modalId, 'className': 'modal-480',
                             'title': options['title'], 'btnName': 'Confirm',
                             'body': delLayout,
               'onSave': function () {
                self.model.deleteDatabaseNodes(options['checkedRows'], {
                    init: function () {
                        cowu.enableModalLoading(modalId);
                    },
                    success: function () {
                        options['callback']();
                        $("#" + modalId).modal('hide');
                    },
                    error: function (error) {
                        cowu.disableModalLoading(modalId, function () {
                            self.model.showErrorAttr(prefixId +
                                                     cowc.FORM_SUFFIX_ID,
                                                     error.responseText);
                        });
                    }
                });
            }, 'onCancel': function () {
                Knockback.release(self.model, document.getElementById(modalId));
                kbValidation.unbind(self);
                $("#" + modalId).modal('hide');
            }});
            self.model.showErrorAttr(prefixId + cowc.FORM_SUFFIX_ID, false);
            Knockback.applyBindings(self.model, document.getElementById(modalId));
            kbValidation.bind(self);
        },

        getDatabaseNodeViewConfig : function(disableId) {
            var databaseNodeViewConfig = {
                elementId: cowu.formatElementId([prefixId,
                                   ctwl.TITLE_DATABASE_NODE]),
                title: ctwl.TITLE_DATABASE_NODE,
                view: "SectionView",
                viewConfig :{
                    rows : [
                        {
                            columns : [
                                {
                                    elementId: "display_name",
                                    view: "FormInputView",
                                    viewConfig: {
                                        disabled: disableId,
                                        path: "display_name",
                                        dataBindValue: "display_name",
                                        label: "Name",
                                        class: "col-xs-6"
                                    }
                                }, {
                                    elementId: "database_node_ip_address",
                                    view: "FormInputView",
                                    viewConfig: {
                                        path: "database_node_ip_address",
                                        dataBindValue: "database_node_ip_address",
                                        label: "IP Address",
                                        class: "col-xs-6"
                                    }
                                }
                            ]
                        }
                    ]
                }
            };
            return databaseNodeViewConfig;
        }
    });

    return databaseNodeEditView;
});

