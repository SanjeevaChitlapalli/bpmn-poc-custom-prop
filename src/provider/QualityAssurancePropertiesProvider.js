// QualityAssurancePropertiesProvider.js
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

export default function QualityAssurancePropertiesProvider(propertiesPanel) {
  this.getGroups = function(element) {
    return function(groups) {
      // Only add quality assurance properties for elements that have a parent
      // (excludes the root process element)
      if (element.parent) {
        groups.push({
          id: 'quality-assurance',
          label: 'Quality Assurance',
          entries: QualityAssuranceProperties(element)
        });
      }
      return groups;
    }
  };
}

function QualityAssuranceProperties(element) {
  const businessObject = getBusinessObject(element);
  
  return [
    {
      id: 'suitabilityScore',
      element,
      component: SuitabilityScore,
      isEdited: isTextFieldEntryEdited
    },
    {
      id: 'lastChecked',
      element,
      component: LastChecked,
      isEdited: () => false // read-only field
    }
  ];
}

function SuitabilityScore(props) {
  const { element, id } = props;
  const businessObject = getBusinessObject(element);

  const getValue = () => {
    return businessObject.get('suitable') || '';
  };

  const setValue = (value) => {
    if (value === '') {
      value = undefined;
    } else {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return;
      }
      value = numValue;
    }

    // Update the business object
    return {
      cmd: 'element.updateProperties',
      context: {
        element: element,
        properties: {
          suitable: value
        }
      }
    };
  };

  return TextFieldEntry({
    id: id,
    element: element,
    label: 'Suitability Score',
    getValue: getValue,
    setValue: setValue,
    validate: (value) => {
      if (value && isNaN(Number(value))) {
        return 'Must be a number';
      }
    }
  });
}

function LastChecked(props) {
  const { element, id } = props;
  const businessObject = getBusinessObject(element);
  
  let analysisDetails = getExtensionElement(businessObject, 'qa:AnalysisDetails');
  
  const getValue = () => {
    return analysisDetails ? analysisDetails.lastChecked : '-';
  };

  return TextFieldEntry({
    id: id,
    element: element,
    label: 'Last Checked',
    getValue: getValue,
    disabled: true
  });
}

function getExtensionElement(element, type) {
  if (!element.extensionElements) {
    return;
  }

  return element.extensionElements.values.filter((extensionElement) => {
    return extensionElement.$instanceOf(type);
  })[0];
}

QualityAssurancePropertiesProvider.$inject = [ 'propertiesPanel' ];