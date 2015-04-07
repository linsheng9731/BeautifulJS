//工具函数
function log(s) {
	console.log(s)
}

var add = function(a, b) {
	return a + b
}

//在js中，函数总共有四种被调用的方式
//分别是：函数调用，方法调用，构造器调用，和apply调用。
//不同调用之间this变量的含义不一样。
var myObject = {
	value: 0,
	increment: function(inc) {
		this.value += typeof inc === 'number' ? inc : 1;
	}
};

/*
 *方法调用
 */
myObject.increment()
myObject.increment()
myObject.double = function() {
		//用that保存this，当内部函数被以函数的形式调用的时候，避免this指向不正确问题。
		var that = this
		var helper = function(argument) {
				// body...
				that.value = add(that.value, that.value)
			}
			//以函数的形式调用double()
			//函数调用的时候，函数内部的this是被绑定到全局对象上的，如果不处理直接使用this对象，
			//那么我们访问的实际上是全局对象。在浏览器中是window。
		helper()

	}
//测试
myObject.double()
log(myObject.value)

/*
 *构造器调用
 */
//在js里面 函数即对象，一个函数被创建只是用来生成其他对象，那我么称他为构造函数。
//在这种模式下this被绑定到新创建的对象。
var quo = function(string) {
	this.status = string
}
quo.prototype.get_status = function() {
	return this.status
}
var myquo = new quo('confused')
log(myquo.get_status())

/*
 *apply调用
 */
//apply模式调用可以更该this的绑定对象，apply传递两个参数，一个是要绑定的对象，另一个是参数数组。
var statusObject = {
	status: 'a-ok'
}
var status = quo.prototype.get_status.apply(statusObject)
	//测试
log(status)

//可以编写没有参数的函数，因为每个函数被声明的时候会有一个隐藏的参数
//即aurguments
var sum = function() {
		var i, sum = 0
		for (var i = arguments.length - 1; i >= 0; i--) {
			sum += arguments[i]
		};
		return sum;
	}
	//测试
log(sum(1, 2, 3, 4))

/*
 *抛出异常
 */
var add = function(a, b) {
	if (typeof a != 'number' || typeof b != 'number') {
		throw {
			name: 'typeError',
			message: 'add needs numbers'
		}
		return a + b;
	};
}
var try_it = function() {
	try {
		add('seven')
	} catch (e) {
		log(e)
	}
}

//测试
try_it()


/*
 *扩展功能
 */
//我们可以给fucntion.prototype增加方法，使得该方法对所有function都可用。
Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
}
Number.method('integer', function() {
	return Math[this < 0 ? 'ceil' : 'floor'](this);
})

//测试
log((10 / 3).integer())

/*
 *闭包特性
 */
//准确的讲，js没有私有，共有之分。但是，闭包弥补了这一空缺。
//通过闭包我们可以构造出对象的私有属性,从而达到隐藏的目的
var myObject = (function() {
	var value = 0;

	return {
		//内部函数可以访问外部的对象
		//闭包就是利用了这一点，使得下面的函数可以访问到value
		increment: function(inc) {
			log('increment')
			value += typeof inc === 'number' ? inc : 1;
		},

		getvalue: function() {
			return value;
		}
	}
}())

//测试
//现在value属性好像是myObject的一样，但是事实上他术语创建
//他的匿名函数，除了通过increment函数之外，我们无法访问到value。
myObject.increment(1)
log(myObject.getvalue())

/*
 *模块化
 */
//通过闭包，我们可以创建模块
var serial_maker = function() {
		var prefix = '';
		var seq = 0;
		return {
			set_prefix: function(p) {
				prefix = p
			},
			set_seq: function(s) {
				seq = s
			},
			gensym: function() {
				var result = prefix + seq;
				seq += 1
				return result
			}
		}
	}

//测试
var seqer = serial_maker()
seqer.set_prefix('a')
seqer.set_seq(100)
var unique = seqer.gensym()
log(unique)