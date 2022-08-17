import inherits from 'inherits';

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';


import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';
import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';

import TitleProps from './parts/TitleProps';
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

function createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate) {

    var generalGroup = {
        id: 'general',
        label: 'General',
        entries: []
    };
    idProps(generalGroup, element, translate);
    nameProps(generalGroup, element, bpmnFactory, canvas, translate);
    processProps(generalGroup, element, translate);

    var detailsGroup = {
        id: 'details',
        label: 'Details',
        entries: []
    };
    linkProps(detailsGroup, element, translate);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

    var documentationGroup = {
        id: 'documentation',
        label: 'Documentation',
        entries: []
    };

    documentationProps(documentationGroup, element, bpmnFactory, translate);

    return [
        generalGroup,
        detailsGroup,
        documentationGroup
    ];
}

function createRoleTabGroups(element) {
    var editRoleGroup = {
        id: 'edit-Role',
        label: '编辑权限',
        entries: []
    }

    // 每个属性都有自己的props方法
    TitleProps(editRoleGroup, element);
    // OtherProps1(editRoleGroup, element);
    // OtherProps2(editRoleGroup, element);

    return [
        editRoleGroup
    ];
}

function createUserTabGroups(element) {
    var editRoleGroup = {
        id: 'edit-User',
        label: '选择用户',
        entries: []
    }

    // 每个属性都有自己的props方法
    TitleProps(editRoleGroup, element);

    editRoleGroup.entries.push(entryFactory.selectBox(
        {
            id: 'title',
            description: '权限的标题',
            label: '标题',
            modelProperty: 'title',
            selectOptions: [ { name: 'a111111111111', value: '1111' }, { name: 'b111111111111', value: '2222' } ]
        },{}));
    // OtherProps1(editRoleGroup, element);
    // OtherProps2(editRoleGroup, element);

    return [
        editRoleGroup
    ];
}


// 这里是要用到什么就引入什么
export default function RolePropertiesProvider(
    eventBus, bpmnFactory, canvas,
    elementRegistry, translate
) {
    PropertiesActivator.call(this, eventBus);

    this.getTabs = function(element) {
        var generalTab = {
            id: 'general',
            label: 'General',
            groups: createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate)
        };

        var UserTab = {
            id: 'User',
            label: '用户',
            groups: createUserTabGroups(element)
        };

        var RoleTab = {
            id: 'Role',
            label: '角色',
            groups: createRoleTabGroups(element)
        };
        return [
            generalTab,
            UserTab,
            RoleTab
        ];
    }
}

inherits(RolePropertiesProvider, PropertiesActivator);