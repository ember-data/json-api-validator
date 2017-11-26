import DS from 'ember-data';
import Model from './animal';

const { attr, belongsTo } = DS;

export default Model.extend({
  name: attr(),
  person: belongsTo('person', { inverse: 'pets', polymorphic: false })
});
