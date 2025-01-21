import { html } from 'htm/preact';

import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

// import hooks from the vendored preact package
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
  const translate = useService('translate');
  const debounce = useService('debounceInput');


  const getValue = () => {
    return element.businessObject.spell || '';
  };

  const setValue = value => {
    return modeling.updateProperties(element, {
      suitable: parseInt(value, 10)
    });
  };

  const [ spells, setSpells ] = useState([
  25,50,75,100
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
    description=${ translate('Add priority score') }
    label=${ translate('Score') }
    getValue=${ getValue }
    setValue=${ setValue }
    getOptions=${ getOptions }
    debounce=${ debounce }
  />`;
}
