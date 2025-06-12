export function createElement(type, config, ...children) {
  const props = { ...config };

  if (children.length === 1) {
    props.children = children[0];
  } else if (children.length > 1) {
    props.children = children;
  }

  return { type, props };
}
