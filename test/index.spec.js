const { createStore } = require('..');
const { todosReducer, unknownAction, addTodo } = require('./helpers');

const reducers = {
	todos: todosReducer,
};

describe('createStore', () => {
	it('exposes the public API', () => {
		const store = createStore(reducers.todos)

		const methods = Object.keys(store);
		expect(methods.length).toBe(4)
		expect(methods).toContain('subscribe')
		expect(methods).toContain('dispatch')
		expect(methods).toContain('getState')
		expect(methods).toContain('replaceReducer')
	})

	it('throws if reducer is not a function', () => {
		// @ts-expect-error
		expect(() => createStore(undefined)).toThrow()
		// @ts-expect-error
		expect(() => createStore('test')).toThrow()
		// @ts-expect-error
		expect(() => createStore({})).toThrow()

		expect(() => createStore(() => {})).not.toThrow()
	})

	it('passes the initial state', () => {
		const store = createStore(reducers.todos, [
			{
				id: 1,
				text: 'Hello'
			}
		])
		expect(store.getState()).toEqual([
			{
				id: 1,
				text: 'Hello'
			}
		])
	})

	it('applies the reducer to the previous state', () => {
		const store = createStore(reducers.todos)
		expect(store.getState()).toEqual([])

		store.dispatch(unknownAction())
		expect(store.getState()).toEqual([])

		store.dispatch(addTodo('Hello'))
		expect(store.getState()).toEqual([
			{
				id: 1,
				text: 'Hello'
			}
		])

		store.dispatch(addTodo('World'))
		expect(store.getState()).toEqual([
			{
				id: 1,
				text: 'Hello'
			},
			{
				id: 2,
				text: 'World'
			}
		])
	})

	it('applies the reducer to the initial state', () => {
		const store = createStore(reducers.todos, [
			{
				id: 1,
				text: 'Hello'
			}
		])
		expect(store.getState()).toEqual([
			{
				id: 1,
				text: 'Hello'
			}
		])

		store.dispatch(unknownAction())
		expect(store.getState()).toEqual([
			{
				id: 1,
				text: 'Hello'
			}
		])

		store.dispatch(addTodo('World'))
		expect(store.getState()).toEqual([
			{
				id: 1,
				text: 'Hello'
			},
			{
				id: 2,
				text: 'World'
			}
		])
	})

	it('preserves the state when replacing a reducer', () => {
		const store = createStore(reducers.todos)
		store.dispatch(addTodo('Hello'))
		store.dispatch(addTodo('World'))
		expect(store.getState()).toEqual([
			{
				id: 1,
				text: 'Hello'
			},
			{
				id: 2,
				text: 'World'
			}
		])

		store.replaceReducer(reducers.todosReverse)
		expect(store.getState()).toEqual([
			{
				id: 1,
				text: 'Hello'
			},
			{
				id: 2,
				text: 'World'
			}
		])

		store.dispatch(addTodo('Perhaps'))
		expect(store.getState()).toEqual([
			{
				id: 3,
				text: 'Perhaps'
			},
			{
				id: 1,
				text: 'Hello'
			},
			{
				id: 2,
				text: 'World'
			}
		])

		store.replaceReducer(reducers.todos)
		expect(store.getState()).toEqual([
			{
				id: 3,
				text: 'Perhaps'
			},
			{
				id: 1,
				text: 'Hello'
			},
			{
				id: 2,
				text: 'World'
			}
		])

		store.dispatch(addTodo('Surely'))
		expect(store.getState()).toEqual([
			{
				id: 3,
				text: 'Perhaps'
			},
			{
				id: 1,
				text: 'Hello'
			},
			{
				id: 2,
				text: 'World'
			},
			{
				id: 4,
				text: 'Surely'
			}
		])
	})

	it('supports multiple subscriptions', () => {
		const store = createStore(reducers.todos)
		const listenerA = jest.fn()
		const listenerB = jest.fn()

		let unsubscribeA = store.subscribe(listenerA)
		store.dispatch(unknownAction())
		expect(listenerA.mock.calls.length).toBe(1)
		expect(listenerB.mock.calls.length).toBe(0)

		store.dispatch(unknownAction())
		expect(listenerA.mock.calls.length).toBe(2)
		expect(listenerB.mock.calls.length).toBe(0)

		const unsubscribeB = store.subscribe(listenerB)
		expect(listenerA.mock.calls.length).toBe(2)
		expect(listenerB.mock.calls.length).toBe(0)

		store.dispatch(unknownAction())
		expect(listenerA.mock.calls.length).toBe(3)
		expect(listenerB.mock.calls.length).toBe(1)

		unsubscribeA()
		expect(listenerA.mock.calls.length).toBe(3)
		expect(listenerB.mock.calls.length).toBe(1)

		store.dispatch(unknownAction())
		expect(listenerA.mock.calls.length).toBe(3)
		expect(listenerB.mock.calls.length).toBe(2)

		unsubscribeB()
		expect(listenerA.mock.calls.length).toBe(3)
		expect(listenerB.mock.calls.length).toBe(2)

		store.dispatch(unknownAction())
		expect(listenerA.mock.calls.length).toBe(3)
		expect(listenerB.mock.calls.length).toBe(2)

		unsubscribeA = store.subscribe(listenerA)
		expect(listenerA.mock.calls.length).toBe(3)
		expect(listenerB.mock.calls.length).toBe(2)

		store.dispatch(unknownAction())
		expect(listenerA.mock.calls.length).toBe(4)
		expect(listenerB.mock.calls.length).toBe(2)
	})

	it('only removes listener once when unsubscribe is called', () => {
		const store = createStore(reducers.todos)
		const listenerA = jest.fn()
		const listenerB = jest.fn()

		const unsubscribeA = store.subscribe(listenerA)
		store.subscribe(listenerB)

		unsubscribeA()
		unsubscribeA()

		store.dispatch(unknownAction())
		expect(listenerA.mock.calls.length).toBe(0)
		expect(listenerB.mock.calls.length).toBe(1)
	})

	it('only removes relevant listener when unsubscribe is called', () => {
		const store = createStore(reducers.todos)
		const listener = jest.fn()

		store.subscribe(listener)
		const unsubscribeSecond = store.subscribe(listener)

		unsubscribeSecond()
		unsubscribeSecond()

		store.dispatch(unknownAction())
		expect(listener.mock.calls.length).toBe(1)
	})

	it('supports removing a subscription within a subscription', () => {
		const store = createStore(reducers.todos)
		const listenerA = jest.fn()
		const listenerB = jest.fn()
		const listenerC = jest.fn()

		store.subscribe(listenerA)
		const unSubB = store.subscribe(() => {
			listenerB()
			unSubB()
		})
		store.subscribe(listenerC)

		store.dispatch(unknownAction())
		store.dispatch(unknownAction())

		expect(listenerA.mock.calls.length).toBe(2)
		expect(listenerB.mock.calls.length).toBe(1)
		expect(listenerC.mock.calls.length).toBe(2)
	})

	it('notifies all subscribers about current dispatch regardless if any of them gets unsubscribed in the process', () => {
		const store = createStore(reducers.todos)

		const unsubscribeHandles = []
		const doUnsubscribeAll = () =>
			unsubscribeHandles.forEach(unsubscribe => unsubscribe())

		const listener1 = jest.fn()
		const listener2 = jest.fn()
		const listener3 = jest.fn()

		unsubscribeHandles.push(store.subscribe(() => listener1()))
		unsubscribeHandles.push(
			store.subscribe(() => {
				listener2()
				doUnsubscribeAll()
			})
		)
		unsubscribeHandles.push(store.subscribe(() => listener3()))

		store.dispatch(unknownAction())
		expect(listener1.mock.calls.length).toBe(1)
		expect(listener2.mock.calls.length).toBe(1)
		expect(listener3.mock.calls.length).toBe(1)

		store.dispatch(unknownAction())
		expect(listener1.mock.calls.length).toBe(1)
		expect(listener2.mock.calls.length).toBe(1)
		expect(listener3.mock.calls.length).toBe(1)
	})

	it('notifies only subscribers active at the moment of current dispatch', () => {
		const store = createStore(reducers.todos)

		const listener1 = jest.fn()
		const listener2 = jest.fn()
		const listener3 = jest.fn()

		let listener3Added = false
		const maybeAddThirdListener = () => {
			if (!listener3Added) {
				listener3Added = true
				store.subscribe(() => listener3())
			}
		}

		store.subscribe(() => listener1())
		store.subscribe(() => {
			listener2()
			maybeAddThirdListener()
		})

		store.dispatch(unknownAction())
		expect(listener1.mock.calls.length).toBe(1)
		expect(listener2.mock.calls.length).toBe(1)
		expect(listener3.mock.calls.length).toBe(0)

		store.dispatch(unknownAction())
		expect(listener1.mock.calls.length).toBe(2)
		expect(listener2.mock.calls.length).toBe(2)
		expect(listener3.mock.calls.length).toBe(1)
	})

	it('uses the last snapshot of subscribers during nested dispatch', () => {
		const store = createStore(reducers.todos)

		const listener1 = jest.fn()
		const listener2 = jest.fn()
		const listener3 = jest.fn()
		const listener4 = jest.fn()

		let unsubscribe4;
		const unsubscribe1 = store.subscribe(() => {
			listener1()
			expect(listener1.mock.calls.length).toBe(1)
			expect(listener2.mock.calls.length).toBe(0)
			expect(listener3.mock.calls.length).toBe(0)
			expect(listener4.mock.calls.length).toBe(0)

			unsubscribe1()
			unsubscribe4 = store.subscribe(listener4)
			store.dispatch(unknownAction())

			expect(listener1.mock.calls.length).toBe(1)
			expect(listener2.mock.calls.length).toBe(1)
			expect(listener3.mock.calls.length).toBe(1)
			expect(listener4.mock.calls.length).toBe(1)
		})
		store.subscribe(listener2)
		store.subscribe(listener3)

		store.dispatch(unknownAction())
		expect(listener1.mock.calls.length).toBe(1)
		expect(listener2.mock.calls.length).toBe(2)
		expect(listener3.mock.calls.length).toBe(2)
		expect(listener4.mock.calls.length).toBe(1)

		unsubscribe4()
		store.dispatch(unknownAction())
		expect(listener1.mock.calls.length).toBe(1)
		expect(listener2.mock.calls.length).toBe(3)
		expect(listener3.mock.calls.length).toBe(3)
		expect(listener4.mock.calls.length).toBe(1)
	})

	it('provides an up-to-date state when a subscriber is notified', done => {
		const store = createStore(reducers.todos)
		store.subscribe(() => {
			expect(store.getState()).toEqual([
				{
					id: 1,
					text: 'Hello'
				}
			])
			done()
		})
		store.dispatch(addTodo('Hello'))
	})

	// it('does not leak private listeners array', done => {
	//   const store = createStore(reducers.todos)
	//   store.subscribe(function (this) {
	//     expect(this).toBe(undefined)
	//     done()
	//   })
	//   store.dispatch(addTodo('Hello'))
	// })

	it('only accepts plain object actions', () => {
		const store = createStore(reducers.todos)
		expect(() => store.dispatch(unknownAction())).not.toThrow()

		function AwesomeMap() {}
		// @ts-expect-error
		;[null, undefined, 42, 'hey', new AwesomeMap()].forEach(nonObject =>
			expect(() => store.dispatch(nonObject)).toThrow(/plain/)
		)
	})

	it('does not allow dispatch() from within a reducer', () => {
		const store = createStore(reducers.dispatchInTheMiddleOfReducer)

		expect(() =>
			store.dispatch(
				dispatchInMiddle(store.dispatch.bind(store, unknownAction()))
			)
		).toThrow(/may not dispatch/)

		expect(() => store.dispatch(dispatchInMiddle(() => {}))).not.toThrow()
	})

	it('does not allow getState() from within a reducer', () => {
		const store = createStore(reducers.getStateInTheMiddleOfReducer)

		expect(() =>
			store.dispatch(getStateInMiddle(store.getState.bind(store)))
		).toThrow(/You may not call store.getState()/)

		expect(() => store.dispatch(getStateInMiddle(() => {}))).not.toThrow()
	})

	it('does not allow subscribe() from within a reducer', () => {
		const store = createStore(reducers.subscribeInTheMiddleOfReducer)

		expect(() =>
			store.dispatch(subscribeInMiddle(store.subscribe.bind(store, () => {})))
		).toThrow(/You may not call store.subscribe()/)

		expect(() => store.dispatch(subscribeInMiddle(() => {}))).not.toThrow()
	})

	it('does not allow unsubscribe from subscribe() from within a reducer', () => {
		const store = createStore(reducers.unsubscribeInTheMiddleOfReducer)
		const unsubscribe = store.subscribe(() => {})

		expect(() =>
			store.dispatch(unsubscribeInMiddle(unsubscribe.bind(store)))
		).toThrow(/You may not unsubscribe from a store/)

		expect(() => store.dispatch(unsubscribeInMiddle(() => {}))).not.toThrow()
	})

	it('recovers from an error within a reducer', () => {
		const store = createStore(reducers.errorThrowingReducer)
		expect(() => store.dispatch(throwError())).toThrow()

		expect(() => store.dispatch(unknownAction())).not.toThrow()
	})

	it('throws if action type is missing', () => {
		const store = createStore(reducers.todos)
		// @ts-expect-error
		expect(() => store.dispatch({})).toThrow(
			/Actions may not have an undefined "type" property/
		)
	})

	it('throws an error that correctly describes the type of item dispatched', () => {
		const store = createStore(reducers.todos)
		// @ts-ignore
		expect(() => store.dispatch(Promise.resolve(42))).toThrow(
			/the actual type was: 'Promise'/
		)

		// @ts-ignore
		expect(() => store.dispatch(() => {})).toThrow(
			/the actual type was: 'function'/
		)

		// @ts-ignore
		expect(() => store.dispatch(new Date())).toThrow(
			/the actual type was: 'date'/
		)

		// @ts-ignore
		expect(() => store.dispatch(null)).toThrow(/the actual type was: 'null'/)

		// @ts-ignore
		expect(() => store.dispatch(undefined)).toThrow(
			/the actual type was: 'undefined'/
		)
	})

	it('throws if action type is undefined', () => {
		const store = createStore(reducers.todos)
		expect(() => store.dispatch({ type: undefined })).toThrow(
			/Actions may not have an undefined "type" property/
		)
	})

	it('does not throw if action type is falsy', () => {
		const store = createStore(reducers.todos)
		expect(() => store.dispatch({ type: false })).not.toThrow()
		expect(() => store.dispatch({ type: 0 })).not.toThrow()
		expect(() => store.dispatch({ type: null })).not.toThrow()
		expect(() => store.dispatch({ type: '' })).not.toThrow()
	})
})
