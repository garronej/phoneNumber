
//Trick browserify so it does not bundle.
const default_: ()=> void = ()=> require((() => "../../res/utils")());

export default default_;

