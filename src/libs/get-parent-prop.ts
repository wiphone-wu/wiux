export default function getParentProp(self: any, name: string): unknown {
  if (self.$parent && typeof self.$parent[name] !== "undefined") {
    return self.$parent[name];
  }
  if (
    self.$parent &&
    self.$parent.$parent &&
    typeof self.$parent.$parent[name] !== "undefined"
  ) {
    return self.$parent.$parent[name];
  }
  return undefined;
}
