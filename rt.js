function CRuntime() {
	this.config = {
		limits: {
			'char': {
				max: 0x7f,
				min: 0x00,
				bytes: 1
			},
			'signed char': {
				max: 0x7f,
				min: -0x80,
				bytes: 1
			},
			'unsigned char': {
				max: 0xff,
				min: 0x00,
				bytes: 1
			},
			'short': {
				max: 0x7fff,
				min: -0x8000,
				bytes: 2
			},
			'unsigned short': {
				max: 0xffff,
				min: 0x0000,
				bytes: 2
			},
			'int': {
				max: 0x7fffffff,
				min: -0x80000000,
				bytes: 4
			},
			'unsigned': {
				max: 0xffffffff,
				min: 0x00000000,
				bytes: 4
			},
			'long': {
				max: 0x7fffffff,
				min: -0x80000000,
				bytes: 4
			},
			'unsigned long': {
				max: 0xffffffff,
				min: 0x00000000,
				bytes: 4
			},
			'long long': {
				max: 0x7fffffffffffffff,
				min: -0x8000000000000000,
				bytes: 8
			},
			'unsigned long long': {
				max: 0xffffffffffffffff,
				min: 0x0000000000000000,
				bytes: 8
			},
			'float': {
				max: 3.40282346638529e+038,
				min: -3.40282346638529e+038,
				bytes: 4
			},
			'double': {
				max: 1.79769313486232e+308,
				min: -1.79769313486232e+308,
				bytes: 8
			}
		}
	};
	this.config.limits['short int'] = this.config.limits['short'];
	this.config.limits['signed short'] = this.config.limits['short'];
	this.config.limits['signed short int'] = this.config.limits['short'];
	this.config.limits['unsigned short int'] = this.config.limits['unsigned short'];
	this.config.limits['signed int'] = this.config.limits['int'];
	this.config.limits['unsigned int'] = this.config.limits['unsigned'];
	this.config.limits['long int'] = this.config.limits['long'];
	this.config.limits['long int'] = this.config.limits['long'];
	this.config.limits['signed long'] = this.config.limits['long'];
	this.config.limits['signed long int'] = this.config.limits['long'];
	this.config.limits['unsigned long int'] = this.config.limits['unsigned long'];
	this.config.limits['long long int'] = this.config.limits['long long'];
	this.config.limits['long long int'] = this.config.limits['long long'];
	this.config.limits['signed long long'] = this.config.limits['long long'];
	this.config.limits['signed long long int'] = this.config.limits['long long'];
	this.config.limits['unsigned long long int'] = this.config.limits['unsigned long long'];
	this.m = null;
	this.numericTypeOrder = ['char', 'signed char', 'short', 'short int',
		'signed short', 'signed short int', 'int', 'signed int',
		'long', 'long int', 'long int', 'signed long', 'signed long int',
		'long long', 'long long int', 'long long int', 'signed long long',
		'signed long long int', 'float', 'double'
	];

	defaultOpHandler = {
		'*': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support * on ' + rt.makeTypeString(r.t);
				}
				ret = l.v * r.v;
				rett = rt.promoteNumeric(l.t, r.t);
				return rt.val(rett, ret);
			}
		},
		'/': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support / on ' + rt.makeTypeString(r.t);
				}
				ret = l.v / r.v;
				if (rt.isIntegerType(l.t) && rt.isIntegerType(r.t)) {
					ret = Math.floor(ret);
				}
				rett = rt.promoteNumeric(l.t, r.t);
				return rt.val(rett, ret);
			}
		},
		'%': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support % on ' + rt.makeTypeString(r.t);
				}
				ret = l.v % r.v;
				rett = rt.promoteNumeric(l.t, r.t);
				return rt.val(rett, ret);
			}
		},
		'+': {
			'#default': function(rt, l, r) {
				if (r === undefined) {
					// unary
					return l;
				} else {
					if (!rt.isNumericType(r.t)) {
						throw rt.makeTypeString(l.t) + ' does not support + on ' + rt.makeTypeString(r.t);
					}
					ret = l.v + r.v;
					rett = rt.promoteNumeric(l.t, r.t);
					return rt.val(rett, ret);
				}
			}
		},
		'-': {
			'#default': function(rt, l, r) {
				if (r === undefined) {
					// unary
					return rt.val(l.t, -l.v);
				} else {
					// binary
					if (!rt.isNumericType(r.t)) {
						throw rt.makeTypeString(l.t) + ' does not support - on ' + rt.makeTypeString(r.t);
					}
					ret = l.v - r.v;
					rett = rt.promoteNumeric(l.t, r.t);
					return rt.val(rett, ret);
				}

			}
		},
		'<<': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support << on ' + rt.makeTypeString(r.t);
				}
				ret = l.v << r.v;
				rett = l.t;
				return rt.val(rett, ret);
			}
		},
		'>>': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support >> on ' + rt.makeTypeString(r.t);
				}
				ret = l.v >> r.v;
				rett = l.t;
				return rt.val(rett, ret);
			}
		},
		'<': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support < on ' + rt.makeTypeString(r.t);
				}
				ret = l.v < r.v;
				rett = rt.boolTypeLiteral;
				return rt.val(rett, ret);
			}
		},
		'<=': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support <= on ' + rt.makeTypeString(r.t);
				}
				ret = l.v <= r.v;
				rett = rt.boolTypeLiteral;
				return rt.val(rett, ret);
			}
		},
		'>': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support > on ' + rt.makeTypeString(r.t);
				}
				ret = l.v > r.v;
				rett = rt.boolTypeLiteral;
				return rt.val(rett, ret);
			}
		},
		'>=': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support >= on ' + rt.makeTypeString(r.t);
				}
				ret = l.v >= r.v;
				rett = rt.boolTypeLiteral;
				return rt.val(rett, ret);
			}
		},
		'==': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support == on ' + rt.makeTypeString(r.t);
				}
				ret = l.v == r.v;
				rett = rt.boolTypeLiteral;
				return rt.val(rett, ret);
			}
		},
		'!=': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support != on ' + rt.makeTypeString(r.t);
				}
				ret = l.v != r.v;
				rett = rt.boolTypeLiteral;
				return rt.val(rett, ret);
			}
		},
		'&': {
			'#default': function(rt, l, r) {
				if (r === undefined) {
					if (l.array) {
						return rt.val(
							rt.arrayPointerType(l.t, l.array.length),
							rt.makeArrayPointerValue(l.array, l.arrayIndex)
						);
					} else {
						var t = rt.normalPointerType(l.t);
						return rt.val(t, rt.makeNormalPointerValue(l));
					}
				} else {
					if (!rt.isIntegerType(l.t) || !rt.isNumericType(r.t) || !rt.isIntegerType(r.t)) {
						throw rt.makeTypeString(l.t) + ' does not support & on ' + rt.makeTypeString(r.t);
					}
					ret = l.v & r.v;
					rett = rt.promoteNumeric(l.t, r.t);
					return rt.val(rett, ret);
				}
			}
		},
		'^': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support ^ on ' + rt.makeTypeString(r.t);
				}
				ret = l.v ^ r.v;
				rett = rt.promoteNumeric(l.t, r.t);
				return rt.val(rett, ret);
			}
		},
		'|': {
			'#default': function(rt, l, r) {
				if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
					throw rt.makeTypeString(l.t) + ' does not support | on ' + rt.makeTypeString(r.t);
				}
				ret = l.v | r.v;
				rett = rt.promoteNumeric(l.t, r.t);
				return rt.val(rett, ret);
			}
		},
		',': {
			'#default': function(rt, l, r) {
				return r;
			}
		},
		'=': {
			'#default': function(rt, l, r) {
				if (l.left) {
					l.v = rt.cast(l.t, r).v;
					return l;
				} else {
					throw rt.makeValString(l) + ' is not a left value';
				}
			}
		},
		'+=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['+']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'-=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['-']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'*=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['*']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'/=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['/']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'%=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['%']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'<<=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['<<']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'>>=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['>>']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'&=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['&']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'^=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['^']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'|=': {
			'#default': function(rt, l, r) {
				r = defaultOpHandler['|']['#default'](rt, l, r);
				return defaultOpHandler['=']['#default'](rt, l, r);
			}
		},
		'++': {
			'#default': function(rt, l, dummy) {
				if (!rt.isNumericType(l.t)) {
					throw rt.makeTypeString(l.t) + ' does not support increment';
				}
				if (!l.left) {
					throw rt.makeValString(l) + ' is not a left value';
				}
				if (dummy) {
					var b = l.v;
					l.v = l.v + 1;
					return rt.val(l.t, b);
				} else {
					l.v = l.v + 1;
					if (rt.inrange(l.t, l.v))
						return l;
					throw 'overflow during increment';
				}
			}
		},
		'--': {
			'#default': function(rt, l, dummy) {
				if (!rt.isNumericType(l.t)) {
					throw rt.makeTypeString(l.t) + ' does not support decrement';
				}
				if (!l.left) {
					throw rt.makeValString(l) + ' is not a left value';
				}
				if (dummy) {
					var b = l.v;
					l.v = l.v - 1;
					return rt.val(l.t, b);
				} else {
					l.v = l.v - 1;
					var b = l.v;
					if (rt.inrange(l.t, l.v))
						return l;
					throw 'overflow during decrement';
				}
			}
		},
	};

	boolHandler = {
		'==': {
			'#default': function(rt, l, r) {
				if (!r.t === 'bool') {
					throw rt.makeTypeString(l.t) + ' does not support == on ' + rt.makeTypeString(r.t);
				}
				ret = l.v == r.v;
				rett = rt.boolTypeLiteral;
				return rt.val(rett, ret);
			}
		},
		'!=': {
			'#default': function(rt, l, r) {
				if (!r.t === 'bool') {
					throw rt.makeTypeString(l.t) + ' does not support != on ' + rt.makeTypeString(r.t);
				}
				ret = l.v != r.v;
				rett = rt.boolTypeLiteral;
				return rt.val(rett, ret);
			}
		},
		',': {
			'#default': function(rt, l, r) {
				return r;
			}
		},
		'=': {
			'#default': function(rt, l, r) {
				if (l.left) {
					l.v = rt.cast(l.t, r).v;
					return l;
				} else {
					throw rt.makeValString(l) + ' is not a left value';
				}
			}
		},
	};

	this.types = {
		'global': {},
	};
	this.types[this.getTypeSigniture(this.primitiveType('char'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('signed char'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('unsigned char'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('short'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('short int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('signed short'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('signed short int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('unsigned short'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('unsigned short int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('signed int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('unsigned'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('unsigned int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('long'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('long int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('long int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('signed long'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('signed long int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('unsigned long'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('unsigned long int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('long long'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('long long int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('long long int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('signed long long'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('signed long long int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('unsigned long long'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('unsigned long long int'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('float'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('double'))] = defaultOpHandler;
	this.types[this.getTypeSigniture(this.primitiveType('bool'))] = boolHandler;

	this.types['pointer'] = {
		'==': {
			'#default': function(rt, l, r) {
				if (rt.isTypeEqualTo(l.t, r.t)) {
					if (l.t.ptrType === 'array') {
						return l.v.target === r.v.target && l.v.position === r.v.position;
					} else {
						return l.v.target === r.v.target;
					}
				}
				return false;
			}
		},
		'!=': {
			'#default': function(rt, l, r) {
				return !rt.types['pointer']['==']['#default'](rt, l, r);
			}
		},
		',': {
			'#default': function(rt, l, r) {
				return r;
			}
		},
		'=': {
			'#default': function(rt, l, r) {
				if (!l.left) {
					throw rt.makeValString(l) + ' is not a left value';
				}
				var t = rt.cast(l.t, r);
				l.t = t.t;
				l.v = t.v;
				return l;
			}
		},
		'&': {
			'#default': function(rt, l, r) {
				if (r === undefined) {
					if (l.array) {
						return rt.val(
							rt.arrayPointerType(l.t, l.array.length),
							rt.makeArrayPointerValue(l.array, l.arrayIndex)
						);
					} else {
						var t = rt.normalPointerType(l.t);
						return rt.val(t, rt.makeNormalPointerValue(l));
					}
				} else {
					throw 'you cannot cast bitwise and on pointer';
				}
			}
		},
	};
	this.types['pointer_function'] = {
		'()': {
			'#default': function(rt, l, args) {
				if (l.t.type !== 'pointer' || l.t.ptrType !== 'function') {
					throw rt.makeTypeString(l.v.type) + ' is not function';
				}
				return rt.getCompatibleFunc(l.v.defineType, l.v.name, args)(args);
			}
		},
	};
	this.types['pointer_normal'] = {
		'*': {
			'#default': function(rt, l, r) {
				if (r === undefined) {
					return l.v.target;
				} else {
					throw 'you cannot multiply a pointer';
				}
			}
		}
	};
	this.types['pointer_array'] = {
		'*': {
			'#default': function(rt, l, r) {
				if (r === undefined) {
					var arr = l.v.target;
					if (l.v.position >= arr.length) {
						throw 'index out of bound ' + l.v.position + ' >= ' + arr.length;
					} else if (l.v.position < 0) {
						throw 'negative index ' + l.v.position;
					}
					var ret = arr[l.v.position];
					ret.array = arr;
					ret.arrayIndex = l.v.position;
					return ret;
				} else {
					throw 'you cannot multiply a pointer';
				}
			}
		},
		'[]': {
			'#default': function(rt, l, r) {
				r = rt.types['pointer_array']['+']['#default'](rt, l, r);
				return rt.types['pointer_array']['*']['#default'](rt, r);
			}
		},
		'-': {
			'#default': function(rt, l, r) {
				if (rt.isArrayType(r.t)) {
					if (l.v.target === r.v.target) {
						return l.v.position - r.v.position;
					} else {
						throw 'you cannot perform minus on pointers pointing to different arrays';
					}
				} else {
					throw rt.makeTypeString(r.t) + ' is not an array pointer type';
				}
			},
		},
		'<': {
			'#default': function(rt, l, r) {
				if (rt.isArrayType(r.t)) {
					if (l.v.target === r.v.target) {
						return l.v.position < r.v.position;
					} else {
						throw 'you cannot perform compare on pointers pointing to different arrays';
					}
				} else {
					throw rt.makeTypeString(r.t) + ' is not an array pointer type';
				}
			},
		},
		'>': {
			'#default': function(rt, l, r) {
				if (rt.isArrayType(r.t)) {
					if (l.v.target === r.v.target) {
						return l.v.position > r.v.position;
					} else {
						throw 'you cannot perform compare on pointers pointing to different arrays';
					}
				} else {
					throw rt.makeTypeString(r.t) + ' is not an array pointer type';
				}
			},
		},
		'<=': {
			'#default': function(rt, l, r) {
				if (rt.isArrayType(r.t)) {
					if (l.v.target === r.v.target) {
						return l.v.position <= r.v.position;
					} else {
						throw 'you cannot perform compare on pointers pointing to different arrays';
					}
				} else {
					throw rt.makeTypeString(r.t) + ' is not an array pointer type';
				}
			},
		},
		'>=': {
			'#default': function(rt, l, r) {
				if (rt.isArrayType(r.t)) {
					if (l.v.target === r.v.target) {
						return l.v.position >= r.v.position;
					} else {
						throw 'you cannot perform compare on pointers pointing to different arrays';
					}
				} else {
					throw rt.makeTypeString(r.t) + ' is not an array pointer type';
				}
			},
		},
		'+': {
			'#default': function(rt, l, r) {
				if (rt.isNumericType(r.t)) {
					var i = rt.cast(rt.intTypeLiteral, r).v;
					return rt.val(
						l.t,
						rt.makeArrayPointerValue(l.v.target, l.v.position + i)
					);
				} else {
					throw 'cannot add non-numeric to a pointer';
				}
			},
		},
		'-': {
			'#default': function(rt, l, r) {
				if (rt.isNumericType(r.t)) {
					var i = rt.cast(rt.intTypeLiteral, r).v;
					return rt.val(
						l.t,
						rt.makeArrayPointerValue(l.v.target, l.v.position - i)
					);
				} else {
					throw 'cannot add non-numeric to a pointer';
				}
			},
		},
		'+=': {
			'#default': function(rt, l, r) {
				r = rt.types['pointer_array']['+']['#default'](rt, l, r);
				return rt.types['pointer']['=']['#default'](rt, l, r);
			},
		},
		'-=': {
			'#default': function(rt, l, r) {
				r = rt.types['pointer_array']['-']['#default'](rt, l, r);
				return rt.types['pointer']['=']['#default'](rt, l, r);
			},
		},
		'++': {
			'#default': function(rt, l, dummy) {
				if (!l.left) {
					throw rt.makeValString(l) + ' is not a left value';
				}
				if (dummy) {
					return rt.val(
						l.t,
						rt.makeArrayPointerValue(l.v.target, l.v.position++)
					);
				} else {
					l.v.position++;
					return l;
				}
			}
		},
		'--': {
			'#default': function(rt, l, dummy) {
				if (!l.left) {
					throw rt.makeValString(l) + ' is not a left value';
				}
				if (dummy) {
					return rt.val(
						l.t,
						rt.makeArrayPointerValue(l.v.target, l.v.position--)
					);
				} else {
					l.v.position--;
					return l;
				}
			}
		},
	};

	this.intTypeLiteral = this.primitiveType('int');
	this.floatTypeLiteral = this.primitiveType('float');
	this.doubleTypeLiteral = this.primitiveType('double');
	this.charTypeLiteral = this.primitiveType('char');
	this.boolTypeLiteral = this.primitiveType('bool');
	this.voidTypeLiteral = this.primitiveType('void');

	this.scope = [{
		'$name': 'global'
	}];
}

CRuntime.prototype.defFunc = function(lt, name, retType, argTypes, argNames, stmts, interp) {
	var f = function(rt, _this, args) {
		// logger.warn('calling function: %j', name);
		rt.enterScope('function ' + name);
		argNames.forEach(function(v, i) {
			rt.defVar(v, argTypes[i], args[i]);
		});
		ret = interp.run(stmts, {
			scope: 'function'
		});
		if (!rt.isTypeEqualTo(retType, rt.voidTypeLiteral)) {
			if (ret instanceof Array && ret[0] === 'return') {
				ret = rt.cast(retType, ret[1]);
			} else {
				throw 'you must return a value';
			}
		} else {
			if (typeof ret === 'Array') {
				if (ret[0] === 'return' && ret[1])
					throw 'you cannot return a value in a void function';
			}
			ret = undefined;
		}
		rt.exitScope('function ' + name);
		// logger.warn('function: returing %j', ret);
		return ret;
	};
	this.regFunc(f, lt, name, argTypes, retType);
}

CRuntime.prototype.makeValString = function(l) {
	var display = l.v;
	if (this.isTypeEqualTo(l.t, this.charTypeLiteral))
		display = String.fromCharCode(l.v);
	return display + '(' + this.makeTypeString(l.t) + ')';
};

CRuntime.prototype.makeParametersSigniture = function(args) {
	var ret = new Array(args.length);
	for (var i=0;i<args.length;i++){
		ret[i] = this.getTypeSigniture(args[i]);
	}
	return ret.join(',');
};

CRuntime.prototype.getCompatibleFunc = function(lt, name, args) {
	var ltsig = this.getTypeSigniture(lt);
	if (ltsig in this.types) {
		var t = this.types[ltsig];
		if (name in t) {
			// logger.info('method found');
			var ts = args.map(function(v) {
				return v.t;
			});
			var sig = this.makeParametersSigniture(ts);
			if (sig in t[name]) {
				return t[name][sig];
			} else {
				var compatibles = [];
				t[name]['reg'].forEach(function(dts) {
					if (dts.length == ts.length) {
						var ok = true;
						for (var i = 0; ok && i < ts.length; i++) {
							ok = rt.castable(ts[i], dts[i]);
						}
						if (ok) {
							compatibles.push(t[name][rt.makeParametersSigniture(dts)]);
						}
					}
				});
				if (compatibles.length == 0) {
					if ('#default' in t[name])
						return t[name]['#default'];
					throw 'no method ' + name + ' in ' + lt + ' accepts (' + sig + ')';
				} else if (compatibles.length > 1)
					throw 'ambiguous method invoking, ' + compatibles.length + 'compatible methods';
				else
					return compatibles[0];
			}
		} else {
			throw 'method ' + name + ' is not defined in ' + this.makeTypeString(lt);
		}
	} else {
		throw 'type ' + this.makeTypeString(lt) + ' is unknown';
	}
}

CRuntime.prototype.getFunc = function(lt, name, args) {
	if (this.isPointerType(lt)) {
		var f;
		if (this.isArrayType(lt)) {
			f = 'pointer_array';
		} else if (this.isFunctionType(lt)) {
			f = 'pointer_function';
		} else {
			f = 'pointer_normal';
		}
		var t = null;
		if (name in this.types[f]) {
			t = this.types[f];
		} else if (name in this.types['pointer']) {
			t = this.types['pointer'];
		}
		if (t) {
			var sig = this.makeParametersSigniture(args);
			if (sig in t[name]) {
				return t[name][sig];
			} else if ('#default' in t[name]) {
				return t[name]['#default'];
			} else {
				throw 'no method ' + name + ' in ' + this.makeTypeString(lt) + ' accepts (' + sig + ')';
			}
		}
	}
	var ltsig = this.getTypeSigniture(lt);
	if (ltsig in this.types) {
		var t = this.types[ltsig];
		if (name in t) {
			var sig = this.makeParametersSigniture(args);
			if (sig in t[name]) {
				return t[name][sig];
			} else if ('#default' in t[name]) {
				return t[name]['#default'];
			} else {
				throw 'no method ' + name + ' in ' + this.makeTypeString(lt) + ' accepts (' + sig + ')';
			}
		} else {
			throw 'method ' + name + ' is not defined in ' + this.makeTypeString(lt);
		}
	} else {
		if (this.isPointerType(lt))
			throw 'this pointer has no proper method overload';
		else
			throw 'type ' + this.makeTypeString(lt) + ' is not defined';
	}
};

CRuntime.prototype.regFunc = function(f, lt, name, args, retType) {
	var ltsig = this.getTypeSigniture(lt);
	if (ltsig in this.types) {
		t = this.types[ltsig];
		if (!(name in t)) {
			t[name] = {};
		}
		if (!('reg' in t[name])) {
			t[name]['reg'] = [];
		}
		sig = this.makeParametersSigniture(args);
		if (sig in t[name]) {
			throw 'method ' + name + ' with parameters (' + sig + ') is already defined';
		}
		var type = this.functionPointerType(retType, args);
		this.defVar(name, type, this.makeFunctionPointerValue(f, name, lt, args, retType));
		t[name][sig] = f;
		t[name]['reg'].push(args);
	} else {
		throw 'type ' + this.makeTypeString(lt) + ' is unknown';
	}
};

CRuntime.prototype.promoteNumeric = function(l, r) {
	if (!this.isNumericType(l) || !this.isNumericType(r)) {
		throw 'you cannot promote (to) a non numeric type';
	}
	if (this.isTypeEqualTo(l, r)) {
		return rett = l;
	} else if (this.isIntegerType(l) && this.isIntegerType(r)) {
		slt = this.getSignedType(l);
		srt = this.getSignedType(r);
		slti = this.numericTypeOrder.indexOf(slt.name);
		srti = this.numericTypeOrder.indexOf(srt.name);
		if (slti <= srti) {
			if (this.isUnsignedType(l) && this.isUnsignedType(r)) {
				rett = r;
			} else {
				rett = srt;
			}
		} else {
			if (this.isUnsignedType(l) && this.isUnsignedType(r)) {
				rett = l;
			} else {
				rett = slt;
			}
		}
		return rett = l;
	} else if (!this.isIntegerType(l) && this.isIntegerType(r)) {
		return rett = l;
	} else if (this.isIntegerType(l) && !this.isIntegerType(r)) {
		return rett = r;
	} else if (!this.isIntegerType(l) && !this.isIntegerType(r)) {
		return rett = this.primitiveType('double');
	}
};

CRuntime.prototype.readVar = function(varname) {
	for (i = this.scope.length - 1; i >= 0; i--) {
		vc = this.scope[i];
		if (vc[varname])
			return vc[varname];
	}
	throw 'variable ' + varname + ' does not exist';
};

CRuntime.prototype.defVar = function(varname, type, initval) {
	// logger.log('defining variable: %j, %j', varname, type);
	vc = this.scope[this.scope.length - 1];
	if (varname in vc) {
		throw 'variable ' + varname + ' already defined'
	}
	if (typeof initval === 'object' && 'v' in initval && 't' in initval) {
		initval = this.cast(type, initval).v;
	}

	if (initval === undefined) {
		if (this.isNumericType(type))
			initval = 0;
		else if (type === 'bool')
			initval = false;
		else
			initval = null;
	}
	vc[varname] = this.val(type, initval, true);
};

CRuntime.prototype.inrange = function(type, value) {
	if (this.isPrimitiveType(type)) {
		limit = this.config.limits[type.name];
		return value <= limit.max && value >= limit.min;
	}
	return true;
};

CRuntime.prototype.isNumericType = function(type) {
	return this.isFloatType(type) || this.isIntegerType(type);
};

CRuntime.prototype.isUnsignedType = function(type) {
	if (typeof type === 'string') {
		switch (type) {
			case 'unsigned char':
			case 'unsigned short':
			case 'unsigned short int':
			case 'unsigned':
			case 'unsigned int':
			case 'unsigned long':
			case 'unsigned long int':
			case 'unsigned long long':
			case 'unsigned long long int':
				return true;
			default:
				return false;
		}
	} else {
		return type.type === 'primitive' && this.isUnsignedType(type.name);
	}
};

CRuntime.prototype.isIntegerType = function(type) {
	if (typeof type === 'string') {
		switch (type) {
			case 'char':
			case 'signed char':
			case 'unsigned char':
			case 'short':
			case 'short int':
			case 'signed short':
			case 'signed short int':
			case 'unsigned short':
			case 'unsigned short int':
			case 'int':
			case 'signed int':
			case 'unsigned':
			case 'unsigned int':
			case 'long':
			case 'long int':
			case 'long int':
			case 'signed long':
			case 'signed long int':
			case 'unsigned long':
			case 'unsigned long int':
			case 'long long':
			case 'long long int':
			case 'long long int':
			case 'signed long long':
			case 'signed long long int':
			case 'unsigned long long':
			case 'unsigned long long int':
				return true;
			default:
				return false;
		}
	} else {
		return type.type === 'primitive' && this.isIntegerType(type.name);
	}
};

CRuntime.prototype.isFloatType = function(type) {
	if (typeof type === 'string') {
		switch (type) {
			case 'float':
			case 'double':
				return true;
			default:
				return false;
		}
	} else {
		return type.type === 'primitive' && this.isFloatType(type.name);
	}
};

CRuntime.prototype.getSignedType = function(type) {
	if (type !== 'unsigned')
		return this.primitiveType(type.name.substring('unsigned'.length).trim());
	else
		return this.primitiveType('int');
};

CRuntime.prototype.castable = function(type1, type2) {
	if (this.isTypeEqualTo(type1, type2))
		return true;
	if (this.isPrimitiveType(type1) && this.isPrimitiveType(type2))
		return this.isNumericType(type2) || !this.isNumericType(type1);
	else if (this.isPointerType(type1) && this.isPointerType(type2)) {
		if (this.isFunctionType(type1))
			return this.isPointerType(type2);
		return !this.isFunctionType(type2);
	} else {
		throw 'not implemented';
	}
};

CRuntime.prototype.cast = function(type, value) {
	// TODO: looking for global overload
	if (this.isTypeEqualTo(value.t, type))
		return value;
	if (this.isPrimitiveType(type) && this.isPrimitiveType(value.t)) {
		switch (type.name) {
			case 'bool':
				return this.val(type, value.v ? true : false);
				break;
			case 'float':
			case 'double':
				if (!this.isNumericType(value.t)) {
					throw 'cannot cast ' + this.makeTypeString(value.t) + ' to ' + this.makeTypeString(type);
				}
				if (this.inrange(type, value.v))
					return this.val(type, value.v);
				else
					throw 'overflow when casting ' + this.makeTypeString(value.t) + ' to ' + this.makeTypeString(type);
				break;
			case 'unsigned char':
			case 'unsigned short':
			case 'unsigned short int':
			case 'unsigned':
			case 'unsigned int':
			case 'unsigned long':
			case 'unsigned long int':
			case 'unsigned long long':
			case 'unsigned long long int':
				if (!this.isNumericType(value.t)) {
					throw 'cannot cast ' + this.makeTypeString(value.t) + ' to ' + this.makeTypeString(type);
				} else if (value.v < 0) {
					throw 'cannot cast negative value to ' + this.makeTypeString(type);
				}
			case 'char':
			case 'signed char':
			case 'short':
			case 'short int':
			case 'signed short':
			case 'signed short int':
			case 'int':
			case 'signed int':
			case 'long':
			case 'long int':
			case 'long int':
			case 'signed long':
			case 'signed long int':
			case 'long long':
			case 'long long int':
			case 'long long int':
			case 'signed long long':
			case 'signed long long int':
				if (!this.isNumericType(value.t)) {
					throw 'cannot cast ' + this.makeTypeString(value.t) + ' to ' + this.makeTypeString(type);
				}
				if (value.t.name === 'float' || value.t.name === 'double') {
					v = value.v > 0 ? Math.floor(value.v) : Math.ceil(value.v);
					if (this.inrange(type, v))
						return this.val(type, v);
					else
						throw 'overflow when casting ' + value.v + '(' + this.makeTypeString(value.t) + ') to ' + this.makeTypeString(type);
				} else {
					if (this.inrange(type, value.v))
						return this.val(type, value.v);
					else
						throw 'overflow when casting ' + value.v + '(' + this.makeTypeString(value.t) + ') to ' + this.makeTypeString(type);
				}
				break;
			default:
				throw 'cast from ' + value.v + '(' + this.makeTypeString(value.t) + ') to ' + this.makeTypeString(type) + ' is not supported'
		}
	} else if (this.isPointerType(type)) {
		if (this.isFunctionType(type)) {
			if (this.isFunctionType(value.t)) {
				return this.val(value.t, value.v);
			} else {
				throw 'cannot cast a regular pointer to a function';
			}
		} else if (this.isArrayType(value.t)) {
			if (this.isNormalPointerType(type)) {
				if (this.isTypeEqualTo(type.targetType, value.t.eleType))
					return value;
				else
					throw this.makeTypeString(type.targetType) + ' is not equal to array element type ' + this.makeTypeString(value.t.eleType);
			} else if (this.isArrayType(type)) {
				if (this.isTypeEqualTo(type.eleType, value.t.eleType))
					return value;
				else
					throw 'array element type ' + this.makeTypeString(type.eleType) + ' is not equal to array element type ' + this.makeTypeString(value.t.eleType);
			} else {
				throw 'cannot cast a function to a regular pointer';
			}
		} else {
			if (this.isNormalPointerType(type)) {
				if (this.isTypeEqualTo(type.targetType, value.t.targetType))
					return value;
				else
					throw this.makeTypeString(type.targetType) + ' is not equal to ' + this.makeTypeString(value.t.eleType);
			} else if (this.isArrayType(type)) {
				if (this.isTypeEqualTo(type.eleType, value.t.targetType))
					return value;
				else
					throw 'array element type ' + this.makeTypeString(type.eleType) + ' is not equal to ' + this.makeTypeString(value.t.eleType);
			} else {
				throw 'cannot cast a function to a regular pointer';
			}
		}
	} else if (this.isClassType(type)) {
		throw 'not implemented';
	} else if (this.isClassType(value.t)) {
		throw 'not implemented';
	} else {
		throw 'cast failed from type ' + this.makeTypeString(type) + ' to ' + this.makeTypeString(value.t);
	}
};

CRuntime.prototype.enterScope = function(scopename) {
	this.scope.push({
		"$name": scopename
	});
};

CRuntime.prototype.exitScope = function(scopename) {
	// logger.info('%j', this.scope);
	do {
		s = this.scope.pop();
	} while (scopename && this.scope.length > 1 && s['$name'] != scopename);
};

CRuntime.prototype.val = function(type, v, left) {
	if (this.isNumericType(type) && !this.inrange(type, v)) {
		throw 'overflow in ' + this.makeValString(v);
	}
	if (left === undefined)
		left = false;
	return {
		't': type,
		'v': v,
		'left': left
	}
};

CRuntime.prototype.isTypeEqualTo = function(type1, type2) {
	if (type1.type === type2.type) {
		switch (type1.type) {
			case 'primitive':
			case 'class':
				return type1.name === type2.name;
			case 'pointer':
				if (type1.ptrType === type2.ptrType ||
					type1.ptrType !== 'function' && type2.ptrType !== 'function') {
					switch (type1.ptrType) {
						case 'array':
							return this.isTypeEqualTo(type1.eleType, type2.eleType || type2.targetType);
						case 'function':
							if (this.isTypeEqualTo(type1.retType, type2.retType) &&
								type1.sigiture.length === type2.sigiture.length) {
								return type1.sigiture.every(function(type, index, arr) {
									return rt.isTypeEqualTo(type, type2.sigiture[index]);
								});
							}
							break;
						case 'normal':
							return this.isTypeEqualTo(type1.targetType, type2.eleType || type2.targetType);
					}
				}
		}
	}
	return false;
}

CRuntime.prototype.isBoolType = function(type) {
	if (typeof type === 'string')
		return type === 'bool';
	else
		return type.type === 'primitive' && this.isBoolType(type.name);
}

CRuntime.prototype.isPrimitiveType = function(type) {
	return this.isNumericType(type) || this.isBoolType(type);
};

CRuntime.prototype.isArrayType = function(type) {
	return this.isPointerType(type) && type.ptrType === 'array';
};

CRuntime.prototype.isFunctionType = function(type) {
	return this.isPointerType(type) && type.ptrType === 'function';
};

CRuntime.prototype.isNormalPointerType = function(type) {
	return this.isPointerType(type) && type.ptrType === 'normal';
};

CRuntime.prototype.isPointerType = function(type) {
	return type.type === 'pointer';
};

CRuntime.prototype.isClassType = function(type) {
	return type.type === 'class';
};

CRuntime.prototype.arrayPointerType = function(eleType, size) {
	return {
		type: 'pointer',
		ptrType: 'array',
		eleType: eleType,
		size: size
	};
};

CRuntime.prototype.makeArrayPointerValue = function(arr, position) {
	return {
		target: arr,
		position: position,
	};
};

CRuntime.prototype.functionPointerType = function(retType, sigiture) {
	return {
		type: 'pointer',
		ptrType: 'function',
		retType: retType,
		sigiture: sigiture
	};
};

CRuntime.prototype.makeFunctionPointerValue = function(f, name, lt, args, retType) {
	return {
		target: f,
		name: name,
		defineType: lt,
		args: args,
		retType: retType
	};
};

CRuntime.prototype.normalPointerType = function(targetType) {
	return {
		type: 'pointer',
		ptrType: 'normal',
		targetType: targetType
	};
};

CRuntime.prototype.makeNormalPointerValue = function(target) {
	return {
		target: target
	};
}

CRuntime.prototype.simpleType = function(type) {
	if (this.isPrimitiveType(type)) {
		return this.primitiveType(type);
	} else {
		var clsType = {
			type: 'class',
			name: type
		};
		if (this.getTypeSigniture(clsType) in this.types) {
			return clsType;
		} else {
			throw 'type ' + this.makeTypeString(type) + ' is not defined';
		}
	}
};

CRuntime.prototype.newClass = function(classname) {
	var clsType = {
		type: 'class',
		name: classname
	};
	var sig = this.getTypeSigniture(clsType);
	if (sig in this.types)
		throw this.makeTypeString(clsType) + ' is already defined';
	this.types[sig] = {};
	return clsType;
};

CRuntime.prototype.primitiveType = function(type) {
	return {
		type: 'primitive',
		name: type
	};
};

CRuntime.prototype.getTypeSigniture = function(type) {
	// (primitive), [class], {pointer}
	var ret = type;
	if (type.type === 'primitive') {
		ret = '(' + type.name + ')';
	} else if (type.type === 'class') {
		ret = '[' + type.name + ']';
	} else if (type.type === 'pointer') {
		// !targetType, @size!eleType, #retType!param1,param2,...
		ret = '{';
		if (type.ptrType === 'normal') {
			ret += '!' + this.getTypeSigniture(type.targetType);
		} else if (type.ptrType === 'array') {
			ret += '!' + this.getTypeSigniture(type.eleType);
		} else if (type.ptrType === 'function') {
			ret += '#' + this.getTypeSigniture(type.retType) + '!' + type.sigiture.map(function(e) {
				return this.getTypeSigniture(e);
			}).join(',');
		}
		ret += '}';
	}
	return ret;
};

CRuntime.prototype.makeTypeString = function(type) {
	// (primitive), [class], {pointer}
	var ret = '$' + type;
	if (type.type === 'primitive') {
		ret = type.name;
	} else if (type.type === 'class') {
		ret = type.name;
	} else if (type.type === 'pointer') {
		// !targetType, @size!eleType, #retType!param1,param2,...
		ret = '';
		if (type.ptrType === 'normal') {
			ret += this.makeTypeString(type.targetType) + '*';
		} else if (type.ptrType === 'array') {
			ret += this.makeTypeString(type.eleType) + '*';
		} else if (type.ptrType === 'function') {
			ret += this.makeTypeString(type.retType) + '(' + type.sigiture.map(function(e) {
				return this.makeTypeString(e);
			}).join(',') + ')';
		}
	}
	return ret;
};

CRuntime.prototype.defaultValue = function(type) {
	if (type.type === 'primitive') {
		if (this.isNumericType(type))
			return this.val(type, 0);
		else if (type.name === 'bool')
			return this.val(type, false);
	} else if (type.type === 'class') {
		throw 'no default value for object';
	} else if (type.type === 'pointer') {
		if (type.ptrType === 'normal') {
			return this.val(type, this.makeNormalPointerValue(null));
		} else if (type.ptrType === 'array') {
			return this.val(type, this.makeArrayPointerValue(null, 0));
		} else if (type.ptrType === 'function') {
			return this.val(type, this.makeFunctionPointerValue(null, null, null, null, null));
		}
	}
};

module.exports = CRuntime;