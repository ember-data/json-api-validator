import DS from 'ember-data';
import Model from './pet';

const { attr } = DS;

export default Model.extend({
  kind: attr(),
  age: attr()
});
