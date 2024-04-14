"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = astify;

var t = _interopRequireWildcard(require("@babel/types"));

var babylon = _interopRequireWildcard(require("@babel/parser"));

var _traverse = _interopRequireDefault(require("@babel/traverse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function astify(literal) {
  if (literal === null) {
    return t.nullLiteral();
  }

  switch (typeof literal) {
    case 'function':
      var ast = babylon.parse(literal.toString(), {
        allowReturnOutsideFunction: true,
        allowSuperOutsideMethod: true
      });
      return _traverse.default.removeProperties(ast);

    case 'number':
      return t.numericLiteral(literal);

    case 'string':
      return t.stringLiteral(literal);

    case 'boolean':
      return t.booleanLiteral(literal);

    case 'undefined':
      return t.unaryExpression('void', t.numericLiteral(0), true);

    default:
      if (Array.isArray(literal)) {
        return t.arrayExpression(literal.map(astify));
      }

      return t.objectExpression(Object.keys(literal).filter(function (k) {
        return typeof literal[k] !== 'undefined';
      }).map(function (k) {
        return t.objectProperty(t.stringLiteral(k), astify(literal[k]));
      }));
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJhc3RpZnkiLCJsaXRlcmFsIiwidCIsIm51bGxMaXRlcmFsIiwiYXN0IiwiYmFieWxvbiIsInBhcnNlIiwidG9TdHJpbmciLCJhbGxvd1JldHVybk91dHNpZGVGdW5jdGlvbiIsImFsbG93U3VwZXJPdXRzaWRlTWV0aG9kIiwicmVtb3ZlUHJvcGVydGllcyIsIm51bWVyaWNMaXRlcmFsIiwic3RyaW5nTGl0ZXJhbCIsImJvb2xlYW5MaXRlcmFsIiwidW5hcnlFeHByZXNzaW9uIiwiQXJyYXkiLCJpc0FycmF5IiwiYXJyYXlFeHByZXNzaW9uIiwibWFwIiwib2JqZWN0RXhwcmVzc2lvbiIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJrIiwib2JqZWN0UHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsU0FBU0EsTUFBVCxDQUFnQkMsT0FBaEIsRUFBeUI7QUFDdEMsTUFBSUEsWUFBWSxJQUFoQixFQUFzQjtBQUNwQixXQUFPQyxFQUFFQyxXQUFGLEVBQVA7QUFDRDs7QUFDRCxVQUFRLE9BQU9GLE9BQWY7QUFDQSxTQUFLLFVBQUw7QUFDRSxVQUFNRyxNQUFNQyxRQUFRQyxLQUFSLENBQWNMLFFBQVFNLFFBQVIsRUFBZCxFQUFrQztBQUM1Q0Msb0NBQTRCLElBRGdCO0FBRTVDQyxpQ0FBeUI7QUFGbUIsT0FBbEMsQ0FBWjtBQUlBLGFBQU8sa0JBQVNDLGdCQUFULENBQTBCTixHQUExQixDQUFQOztBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU9GLEVBQUVTLGNBQUYsQ0FBaUJWLE9BQWpCLENBQVA7O0FBQ0YsU0FBSyxRQUFMO0FBQ0UsYUFBT0MsRUFBRVUsYUFBRixDQUFnQlgsT0FBaEIsQ0FBUDs7QUFDRixTQUFLLFNBQUw7QUFDRSxhQUFPQyxFQUFFVyxjQUFGLENBQWlCWixPQUFqQixDQUFQOztBQUNGLFNBQUssV0FBTDtBQUNFLGFBQU9DLEVBQUVZLGVBQUYsQ0FBa0IsTUFBbEIsRUFBMEJaLEVBQUVTLGNBQUYsQ0FBaUIsQ0FBakIsQ0FBMUIsRUFBK0MsSUFBL0MsQ0FBUDs7QUFDRjtBQUNFLFVBQUlJLE1BQU1DLE9BQU4sQ0FBY2YsT0FBZCxDQUFKLEVBQTRCO0FBQzFCLGVBQU9DLEVBQUVlLGVBQUYsQ0FBa0JoQixRQUFRaUIsR0FBUixDQUFZbEIsTUFBWixDQUFsQixDQUFQO0FBQ0Q7O0FBQ0QsYUFBT0UsRUFBRWlCLGdCQUFGLENBQW1CQyxPQUFPQyxJQUFQLENBQVlwQixPQUFaLEVBQ3ZCcUIsTUFEdUIsQ0FDaEIsVUFBQ0MsQ0FBRCxFQUFPO0FBQ2IsZUFBTyxPQUFPdEIsUUFBUXNCLENBQVIsQ0FBUCxLQUFzQixXQUE3QjtBQUNELE9BSHVCLEVBSXZCTCxHQUp1QixDQUluQixVQUFDSyxDQUFELEVBQU87QUFDVixlQUFPckIsRUFBRXNCLGNBQUYsQ0FDTHRCLEVBQUVVLGFBQUYsQ0FBZ0JXLENBQWhCLENBREssRUFFTHZCLE9BQU9DLFFBQVFzQixDQUFSLENBQVAsQ0FGSyxDQUFQO0FBSUQsT0FUdUIsQ0FBbkIsQ0FBUDtBQW5CRjtBQThCRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHQgZnJvbSAnQGJhYmVsL3R5cGVzJztcbmltcG9ydCAqIGFzIGJhYnlsb24gZnJvbSAnQGJhYmVsL3BhcnNlcic7XG5pbXBvcnQgdHJhdmVyc2UgZnJvbSAnQGJhYmVsL3RyYXZlcnNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXN0aWZ5KGxpdGVyYWwpIHtcbiAgaWYgKGxpdGVyYWwgPT09IG51bGwpIHtcbiAgICByZXR1cm4gdC5udWxsTGl0ZXJhbCgpO1xuICB9XG4gIHN3aXRjaCAodHlwZW9mIGxpdGVyYWwpIHtcbiAgY2FzZSAnZnVuY3Rpb24nOlxuICAgIGNvbnN0IGFzdCA9IGJhYnlsb24ucGFyc2UobGl0ZXJhbC50b1N0cmluZygpLCB7XG4gICAgICBhbGxvd1JldHVybk91dHNpZGVGdW5jdGlvbjogdHJ1ZSxcbiAgICAgIGFsbG93U3VwZXJPdXRzaWRlTWV0aG9kOiB0cnVlLFxuICAgIH0pO1xuICAgIHJldHVybiB0cmF2ZXJzZS5yZW1vdmVQcm9wZXJ0aWVzKGFzdCk7XG4gIGNhc2UgJ251bWJlcic6XG4gICAgcmV0dXJuIHQubnVtZXJpY0xpdGVyYWwobGl0ZXJhbCk7XG4gIGNhc2UgJ3N0cmluZyc6XG4gICAgcmV0dXJuIHQuc3RyaW5nTGl0ZXJhbChsaXRlcmFsKTtcbiAgY2FzZSAnYm9vbGVhbic6XG4gICAgcmV0dXJuIHQuYm9vbGVhbkxpdGVyYWwobGl0ZXJhbCk7XG4gIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgcmV0dXJuIHQudW5hcnlFeHByZXNzaW9uKCd2b2lkJywgdC5udW1lcmljTGl0ZXJhbCgwKSwgdHJ1ZSk7XG4gIGRlZmF1bHQ6XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobGl0ZXJhbCkpIHtcbiAgICAgIHJldHVybiB0LmFycmF5RXhwcmVzc2lvbihsaXRlcmFsLm1hcChhc3RpZnkpKTtcbiAgICB9XG4gICAgcmV0dXJuIHQub2JqZWN0RXhwcmVzc2lvbihPYmplY3Qua2V5cyhsaXRlcmFsKVxuICAgICAgLmZpbHRlcigoaykgPT4ge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGxpdGVyYWxba10gIT09ICd1bmRlZmluZWQnO1xuICAgICAgfSlcbiAgICAgIC5tYXAoKGspID0+IHtcbiAgICAgICAgcmV0dXJuIHQub2JqZWN0UHJvcGVydHkoXG4gICAgICAgICAgdC5zdHJpbmdMaXRlcmFsKGspLFxuICAgICAgICAgIGFzdGlmeShsaXRlcmFsW2tdKVxuICAgICAgICApO1xuICAgICAgfSkpO1xuICB9XG59XG4iXX0=