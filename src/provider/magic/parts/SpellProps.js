import { html } from 'htm/preact';
import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';

export default function(element) {
  return [
    {
      id: 'spell',
      element,
      component: Spell,
      isEdited: isSelectEntryEdited
    }
  ];
}

function Spell(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const moddle = useService('moddle');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    const extensionElements = element.businessObject.extensionElements;
    return extensionElements 
      && extensionElements.values 
      && extensionElements.values[0] 
      && extensionElements.values[0].spellValue 
      || '';
  };

  const setValue = (value) => {
    const extensionElements = moddle.create('bpmn:ExtensionElements', {
      values: [
        moddle.create('magic:SpellExtension', {
          spellValue: value
        })
      ]
    });

    modeling.updateProperties(element, {
      extensionElements
    });
  };

  const [ spells, setSpells ] = useState([
    'Test 1',
    'Test 2',
    'Test 3',
    'Test 4',
  ]);

  const getOptions = () => {
    return [
      { label: '<none>', value: undefined },
      ...spells.map(spell => ({
        label: spell,
        value: spell
      }))
    ];
  };

  return html`<${SelectEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Apply test props') }
    label=${ translate('Test Type') }
    getValue=${ getValue }
    setValue=${ setValue }
    getOptions=${ getOptions }
    debounce=${ debounce }
  />`;
}