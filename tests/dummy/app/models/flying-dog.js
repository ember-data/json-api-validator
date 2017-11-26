import DS from 'ember-data';
import Model from './dog';

const { attr } = DS;

export default Model.extend({
  leap: attr()
});
