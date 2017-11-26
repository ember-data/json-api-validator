import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({
  firstName: attr(),
  lastName: attr(),
  pets: hasMany('pet', { inverse: 'person', polymorphic: true })
});
