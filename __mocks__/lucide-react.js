const React = require('react');

const iconCache = new Map();

const createIcon = (name) => {
  if (iconCache.has(name)) {
    return iconCache.get(name);
  }

  const Icon = React.forwardRef(function LucideIcon(props, ref) {
    return React.createElement('svg', { ref, 'data-lucide-icon': name, ...props });
  });

  Icon.displayName = `LucideIcon(${name})`;
  iconCache.set(name, Icon);
  return Icon;
};

const handler = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === '__esModule') {
        return true;
      }

      if (prop === 'default') {
        return handler;
      }

      return createIcon(String(prop));
    },
  }
);

module.exports = handler;
