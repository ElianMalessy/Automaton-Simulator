
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const key = Symbol();

    function e(){}function t(e){return e()}function i(){return Object.create(null)}function n(e){e.forEach(t);}function s(e){return "function"==typeof e}function o(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function r(e){e.parentNode.removeChild(e);}function a(e){return document.createElement(e)}function l(e,t,i,n){e.style.setProperty(t,i,n?"important":"");}let h;function c(e){h=e;}function u(){if(!h)throw new Error("Function called outside component initialization");return h}function d(){const e=u();return (t,i)=>{const n=e.$$.callbacks[t];if(n){const s=function(e,t){const i=document.createEvent("CustomEvent");return i.initCustomEvent(e,!1,!1,t),i}(t,i);n.slice().forEach((t=>{t.call(e,s);}));}}}const g=[],f=[],m=[],p=[],A$2=Promise.resolve();let C=!1;function v(){C||(C=!0,A$2.then(b));}function F(e){m.push(e);}let w=!1;const E=new Set;function b(){if(!w){w=!0;do{for(let e=0;e<g.length;e+=1){const t=g[e];c(t),$(t.$$);}for(c(null),g.length=0;f.length;)f.pop()();for(let e=0;e<m.length;e+=1){const t=m[e];E.has(t)||(E.add(t),t());}m.length=0;}while(g.length);for(;p.length;)p.pop()();C=!1,w=!1,E.clear();}}function $(e){if(null!==e.fragment){e.update(),n(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(F);}}const y=new Set;function B(o,a,l,u,d,f,m=[-1]){const p=h;c(o);const A=o.$$={fragment:null,ctx:null,props:f,update:e,not_equal:d,bound:i(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(p?p.$$.context:a.context||[]),callbacks:i(),dirty:m,skip_bound:!1};let C=!1;if(A.ctx=l?l(o,a.props||{},((e,t,...i)=>{const n=i.length?i[0]:t;return A.ctx&&d(A.ctx[e],A.ctx[e]=n)&&(!A.skip_bound&&A.bound[e]&&A.bound[e](n),C&&function(e,t){-1===e.$$.dirty[0]&&(g.push(e),v(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31;}(o,e)),t})):[],A.update(),C=!0,n(A.before_update),A.fragment=!!u&&u(A.ctx),a.target){if(a.hydrate){const e=function(e){return Array.from(e.childNodes)}(a.target);A.fragment&&A.fragment.l(e),e.forEach(r);}else A.fragment&&A.fragment.c();a.intro&&((w=o.$$.fragment)&&w.i&&(y.delete(w),w.i(E))),function(e,i,o,r){const{fragment:a,on_mount:l,on_destroy:h,after_update:c}=e.$$;a&&a.m(i,o),r||F((()=>{const i=l.map(t).filter(s);h?h.push(...i):n(i),e.$$.on_mount=[];})),c.forEach(F);}(o,a.target,a.anchor,a.customElement),b();}var w,E;c(p);}!function(){var e=function(){return this}();e||"undefined"==typeof window||(e=window);var t=function(e,i,n){"string"==typeof e?(2==arguments.length&&(n=i),t.modules[e]||(t.payloads[e]=n,t.modules[e]=null)):t.original?t.original.apply(this,arguments):(console.error("dropping module because define wasn't a string."),console.trace());};t.modules={},t.payloads={};var i,n,s=function(e,t,i){if("string"==typeof t){var n=a(e,t);if(null!=n)return i&&i(),n}else if("[object Array]"===Object.prototype.toString.call(t)){for(var s=[],r=0,l=t.length;r<l;++r){var h=a(e,t[r]);if(null==h&&o.original)return;s.push(h);}return i&&i.apply(null,s)||!0}},o=function(e,t){var i=s("",e,t);return null==i&&o.original?o.original.apply(this,arguments):i},r=function(e,t){if(-1!==t.indexOf("!")){var i=t.split("!");return r(e,i[0])+"!"+r(e,i[1])}if("."==t.charAt(0))for(t=e.split("/").slice(0,-1).join("/")+"/"+t;-1!==t.indexOf(".")&&n!=t;){var n=t;t=t.replace(/\/\.\//,"/").replace(/[^\/]+\/\.\.\//,"");}return t},a=function(e,i){i=r(e,i);var n=t.modules[i];if(!n){if("function"==typeof(n=t.payloads[i])){var o={},a={id:i,uri:"",exports:o,packaged:!0};o=n((function(e,t){return s(i,e,t)}),o,a)||a.exports,t.modules[i]=o,delete t.payloads[i];}n=t.modules[i]=o||n;}return n};n=e,(i="ace")&&(e[i]||(e[i]={}),n=e[i]),n.define&&n.define.packaged||(t.original=n.define,n.define=t,n.define.packaged=!0),n.acequire&&n.acequire.packaged||(o.original=n.acequire,n.acequire=o,n.acequire.packaged=!0);}(),ace.define("ace/lib/regexp",["require","exports","module"],(function(e,t,i){var n,s={exec:RegExp.prototype.exec,test:RegExp.prototype.test,match:String.prototype.match,replace:String.prototype.replace,split:String.prototype.split},o=void 0===s.exec.call(/()??/,"")[1],r=(n=/^/g,s.test.call(n,""),!n.lastIndex);function a(e){return (e.global?"g":"")+(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.extended?"x":"")+(e.sticky?"y":"")}function l(e,t,i){if(Array.prototype.indexOf)return e.indexOf(t,i);for(var n=i||0;n<e.length;n++)if(e[n]===t)return n;return -1}r&&o||(RegExp.prototype.exec=function(e){var t,i,n=s.exec.apply(this,arguments);if("string"==typeof e&&n){if(!o&&n.length>1&&l(n,"")>-1&&(i=RegExp(this.source,s.replace.call(a(this),"g","")),s.replace.call(e.slice(n.index),i,(function(){for(var e=1;e<arguments.length-2;e++)void 0===arguments[e]&&(n[e]=void 0);}))),this._xregexp&&this._xregexp.captureNames)for(var h=1;h<n.length;h++)(t=this._xregexp.captureNames[h-1])&&(n[t]=n[h]);!r&&this.global&&!n[0].length&&this.lastIndex>n.index&&this.lastIndex--;}return n},r||(RegExp.prototype.test=function(e){var t=s.exec.call(this,e);return t&&this.global&&!t[0].length&&this.lastIndex>t.index&&this.lastIndex--,!!t}));})),ace.define("ace/lib/es5-shim",["require","exports","module"],(function(e,t,i){function n(){}Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError("Function.prototype.bind called on incompatible "+t);var i=d.call(arguments,1),s=function(){if(this instanceof s){var n=t.apply(this,i.concat(d.call(arguments)));return Object(n)===n?n:this}return t.apply(e,i.concat(d.call(arguments)))};return t.prototype&&(n.prototype=t.prototype,s.prototype=new n,n.prototype=null),s});var s,o,r,a,l,h=Function.prototype.call,c=Array.prototype,u=Object.prototype,d=c.slice,g=h.bind(u.toString),f=h.bind(u.hasOwnProperty);if((l=f(u,"__defineGetter__"))&&(s=h.bind(u.__defineGetter__),o=h.bind(u.__defineSetter__),r=h.bind(u.__lookupGetter__),a=h.bind(u.__lookupSetter__)),2!=[1,2].splice(0).length)if(function(){function e(e){var t=new Array(e+2);return t[0]=t[1]=0,t}var t,i=[];if(i.splice.apply(i,e(20)),i.splice.apply(i,e(26)),t=i.length,i.splice(5,0,"XXX"),t+1==i.length)return !0}()){var m=Array.prototype.splice;Array.prototype.splice=function(e,t){return arguments.length?m.apply(this,[void 0===e?0:e,void 0===t?this.length-e:t].concat(d.call(arguments,2))):[]};}else Array.prototype.splice=function(e,t){var i=this.length;e>0?e>i&&(e=i):null==e?e=0:e<0&&(e=Math.max(i+e,0)),e+t<i||(t=i-e);var n=this.slice(e,e+t),s=d.call(arguments,2),o=s.length;if(e===i)o&&this.push.apply(this,s);else {var r=Math.min(t,i-e),a=e+r,l=a+o-r,h=i-a,c=i-r;if(l<a)for(var u=0;u<h;++u)this[l+u]=this[a+u];else if(l>a)for(u=h;u--;)this[l+u]=this[a+u];if(o&&e===c)this.length=c,this.push.apply(this,s);else for(this.length=c+o,u=0;u<o;++u)this[e+u]=s[u];}return n};Array.isArray||(Array.isArray=function(e){return "[object Array]"==g(e)});var p,A,C=Object("a"),v="a"!=C[0]||!(0 in C);if(Array.prototype.forEach||(Array.prototype.forEach=function(e){var t=R(this),i=v&&"[object String]"==g(this)?this.split(""):t,n=arguments[1],s=-1,o=i.length>>>0;if("[object Function]"!=g(e))throw new TypeError;for(;++s<o;)s in i&&e.call(n,i[s],s,t);}),Array.prototype.map||(Array.prototype.map=function(e){var t=R(this),i=v&&"[object String]"==g(this)?this.split(""):t,n=i.length>>>0,s=Array(n),o=arguments[1];if("[object Function]"!=g(e))throw new TypeError(e+" is not a function");for(var r=0;r<n;r++)r in i&&(s[r]=e.call(o,i[r],r,t));return s}),Array.prototype.filter||(Array.prototype.filter=function(e){var t,i=R(this),n=v&&"[object String]"==g(this)?this.split(""):i,s=n.length>>>0,o=[],r=arguments[1];if("[object Function]"!=g(e))throw new TypeError(e+" is not a function");for(var a=0;a<s;a++)a in n&&(t=n[a],e.call(r,t,a,i)&&o.push(t));return o}),Array.prototype.every||(Array.prototype.every=function(e){var t=R(this),i=v&&"[object String]"==g(this)?this.split(""):t,n=i.length>>>0,s=arguments[1];if("[object Function]"!=g(e))throw new TypeError(e+" is not a function");for(var o=0;o<n;o++)if(o in i&&!e.call(s,i[o],o,t))return !1;return !0}),Array.prototype.some||(Array.prototype.some=function(e){var t=R(this),i=v&&"[object String]"==g(this)?this.split(""):t,n=i.length>>>0,s=arguments[1];if("[object Function]"!=g(e))throw new TypeError(e+" is not a function");for(var o=0;o<n;o++)if(o in i&&e.call(s,i[o],o,t))return !0;return !1}),Array.prototype.reduce||(Array.prototype.reduce=function(e){var t=R(this),i=v&&"[object String]"==g(this)?this.split(""):t,n=i.length>>>0;if("[object Function]"!=g(e))throw new TypeError(e+" is not a function");if(!n&&1==arguments.length)throw new TypeError("reduce of empty array with no initial value");var s,o=0;if(arguments.length>=2)s=arguments[1];else for(;;){if(o in i){s=i[o++];break}if(++o>=n)throw new TypeError("reduce of empty array with no initial value")}for(;o<n;o++)o in i&&(s=e.call(void 0,s,i[o],o,t));return s}),Array.prototype.reduceRight||(Array.prototype.reduceRight=function(e){var t=R(this),i=v&&"[object String]"==g(this)?this.split(""):t,n=i.length>>>0;if("[object Function]"!=g(e))throw new TypeError(e+" is not a function");if(!n&&1==arguments.length)throw new TypeError("reduceRight of empty array with no initial value");var s,o=n-1;if(arguments.length>=2)s=arguments[1];else for(;;){if(o in i){s=i[o--];break}if(--o<0)throw new TypeError("reduceRight of empty array with no initial value")}do{o in this&&(s=e.call(void 0,s,i[o],o,t));}while(o--);return s}),Array.prototype.indexOf&&-1==[0,1].indexOf(1,2)||(Array.prototype.indexOf=function(e){var t=v&&"[object String]"==g(this)?this.split(""):R(this),i=t.length>>>0;if(!i)return -1;var n=0;for(arguments.length>1&&(n=L(arguments[1])),n=n>=0?n:Math.max(0,i+n);n<i;n++)if(n in t&&t[n]===e)return n;return -1}),Array.prototype.lastIndexOf&&-1==[0,1].lastIndexOf(0,-3)||(Array.prototype.lastIndexOf=function(e){var t=v&&"[object String]"==g(this)?this.split(""):R(this),i=t.length>>>0;if(!i)return -1;var n=i-1;for(arguments.length>1&&(n=Math.min(n,L(arguments[1]))),n=n>=0?n:i-Math.abs(n);n>=0;n--)if(n in t&&e===t[n])return n;return -1}),Object.getPrototypeOf||(Object.getPrototypeOf=function(e){return e.__proto__||(e.constructor?e.constructor.prototype:u)}),!Object.getOwnPropertyDescriptor){Object.getOwnPropertyDescriptor=function(e,t){if("object"!=typeof e&&"function"!=typeof e||null===e)throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object: "+e);if(f(e,t)){var i;if(i={enumerable:!0,configurable:!0},l){var n=e.__proto__;e.__proto__=u;var s=r(e,t),o=a(e,t);if(e.__proto__=n,s||o)return s&&(i.get=s),o&&(i.set=o),i}return i.value=e[t],i}};}(Object.getOwnPropertyNames||(Object.getOwnPropertyNames=function(e){return Object.keys(e)}),Object.create)||(p=null===Object.prototype.__proto__?function(){return {__proto__:null}}:function(){var e={};for(var t in e)e[t]=null;return e.constructor=e.hasOwnProperty=e.propertyIsEnumerable=e.isPrototypeOf=e.toLocaleString=e.toString=e.valueOf=e.__proto__=null,e},Object.create=function(e,t){var i;if(null===e)i=p();else {if("object"!=typeof e)throw new TypeError("typeof prototype["+typeof e+"] != 'object'");var n=function(){};n.prototype=e,(i=new n).__proto__=e;}return void 0!==t&&Object.defineProperties(i,t),i});function F(e){try{return Object.defineProperty(e,"sentinel",{}),"sentinel"in e}catch(e){}}if(Object.defineProperty){var w=F({}),E="undefined"==typeof document||F(document.createElement("div"));if(!w||!E)var b=Object.defineProperty;}if(!Object.defineProperty||b){Object.defineProperty=function(e,t,i){if("object"!=typeof e&&"function"!=typeof e||null===e)throw new TypeError("Object.defineProperty called on non-object: "+e);if("object"!=typeof i&&"function"!=typeof i||null===i)throw new TypeError("Property description must be an object: "+i);if(b)try{return b.call(Object,e,t,i)}catch(e){}if(f(i,"value"))if(l&&(r(e,t)||a(e,t))){var n=e.__proto__;e.__proto__=u,delete e[t],e[t]=i.value,e.__proto__=n;}else e[t]=i.value;else {if(!l)throw new TypeError("getters & setters can not be defined on this javascript engine");f(i,"get")&&s(e,t,i.get),f(i,"set")&&o(e,t,i.set);}return e};}Object.defineProperties||(Object.defineProperties=function(e,t){for(var i in t)f(t,i)&&Object.defineProperty(e,i,t[i]);return e}),Object.seal||(Object.seal=function(e){return e}),Object.freeze||(Object.freeze=function(e){return e});try{Object.freeze((function(){}));}catch(e){Object.freeze=(A=Object.freeze,function(e){return "function"==typeof e?e:A(e)});}if(Object.preventExtensions||(Object.preventExtensions=function(e){return e}),Object.isSealed||(Object.isSealed=function(e){return !1}),Object.isFrozen||(Object.isFrozen=function(e){return !1}),Object.isExtensible||(Object.isExtensible=function(e){if(Object(e)===e)throw new TypeError;for(var t="";f(e,t);)t+="?";e[t]=!0;var i=f(e,t);return delete e[t],i}),!Object.keys){var $=!0,y=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],B=y.length;for(var S in {toString:null})$=!1;Object.keys=function(e){if("object"!=typeof e&&"function"!=typeof e||null===e)throw new TypeError("Object.keys called on a non-object");var t=[];for(var i in e)f(e,i)&&t.push(i);if($)for(var n=0,s=B;n<s;n++){var o=y[n];f(e,o)&&t.push(o);}return t};}Date.now||(Date.now=function(){return (new Date).getTime()});var D="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff";if(!String.prototype.trim||D.trim()){D="["+D+"]";var x=new RegExp("^"+D+D+"*"),k=new RegExp(D+D+"*$");String.prototype.trim=function(){return String(this).replace(x,"").replace(k,"")};}function L(e){return (e=+e)!=e?e=0:0!==e&&e!==1/0&&e!==-1/0&&(e=(e>0||-1)*Math.floor(Math.abs(e))),e}var R=function(e){if(null==e)throw new TypeError("can't convert "+e+" to object");return Object(e)};})),ace.define("ace/lib/fixoldbrowsers",["require","exports","module","ace/lib/regexp","ace/lib/es5-shim"],(function(e,t,i){e("./regexp"),e("./es5-shim");})),ace.define("ace/lib/dom",["require","exports","module"],(function(e,t,i){t.getDocumentHead=function(e){return e||(e=document),e.head||e.getElementsByTagName("head")[0]||e.documentElement},t.createElement=function(e,t){return document.createElementNS?document.createElementNS(t||"http://www.w3.org/1999/xhtml",e):document.createElement(e)},t.hasCssClass=function(e,t){return -1!==(e.className+"").split(/\s+/g).indexOf(t)},t.addCssClass=function(e,i){t.hasCssClass(e,i)||(e.className+=" "+i);},t.removeCssClass=function(e,t){for(var i=e.className.split(/\s+/g);;){var n=i.indexOf(t);if(-1==n)break;i.splice(n,1);}e.className=i.join(" ");},t.toggleCssClass=function(e,t){for(var i=e.className.split(/\s+/g),n=!0;;){var s=i.indexOf(t);if(-1==s)break;n=!1,i.splice(s,1);}return n&&i.push(t),e.className=i.join(" "),n},t.setCssClass=function(e,i,n){n?t.addCssClass(e,i):t.removeCssClass(e,i);},t.hasCssString=function(e,t){var i,n=0;if((t=t||document).createStyleSheet&&(i=t.styleSheets)){for(;n<i.length;)if(i[n++].owningElement.id===e)return !0}else if(i=t.getElementsByTagName("style"))for(;n<i.length;)if(i[n++].id===e)return !0;return !1},t.importCssString=function(e,i,n){if(n=n||document,i&&t.hasCssString(i,n))return null;var s;i&&(e+="\n/*# sourceURL=ace/css/"+i+" */"),n.createStyleSheet?((s=n.createStyleSheet()).cssText=e,i&&(s.owningElement.id=i)):((s=t.createElement("style")).appendChild(n.createTextNode(e)),i&&(s.id=i),t.getDocumentHead(n).appendChild(s));},t.importCssStylsheet=function(e,i){if(i.createStyleSheet)i.createStyleSheet(e);else {var n=t.createElement("link");n.rel="stylesheet",n.href=e,t.getDocumentHead(i).appendChild(n);}},t.getInnerWidth=function(e){return parseInt(t.computedStyle(e,"paddingLeft"),10)+parseInt(t.computedStyle(e,"paddingRight"),10)+e.clientWidth},t.getInnerHeight=function(e){return parseInt(t.computedStyle(e,"paddingTop"),10)+parseInt(t.computedStyle(e,"paddingBottom"),10)+e.clientHeight},t.scrollbarWidth=function(e){var i=t.createElement("ace_inner");i.style.width="100%",i.style.minWidth="0px",i.style.height="200px",i.style.display="block";var n=t.createElement("ace_outer"),s=n.style;s.position="absolute",s.left="-10000px",s.overflow="hidden",s.width="200px",s.minWidth="0px",s.height="150px",s.display="block",n.appendChild(i);var o=e.documentElement;o.appendChild(n);var r=i.offsetWidth;s.overflow="scroll";var a=i.offsetWidth;return r==a&&(a=n.clientWidth),o.removeChild(n),r-a},"undefined"!=typeof document?(void 0!==window.pageYOffset?(t.getPageScrollTop=function(){return window.pageYOffset},t.getPageScrollLeft=function(){return window.pageXOffset}):(t.getPageScrollTop=function(){return document.body.scrollTop},t.getPageScrollLeft=function(){return document.body.scrollLeft}),window.getComputedStyle?t.computedStyle=function(e,t){return t?(window.getComputedStyle(e,"")||{})[t]||"":window.getComputedStyle(e,"")||{}}:t.computedStyle=function(e,t){return t?e.currentStyle[t]:e.currentStyle},t.setInnerHtml=function(e,t){var i=e.cloneNode(!1);return i.innerHTML=t,e.parentNode.replaceChild(i,e),i},"textContent"in document.documentElement?(t.setInnerText=function(e,t){e.textContent=t;},t.getInnerText=function(e){return e.textContent}):(t.setInnerText=function(e,t){e.innerText=t;},t.getInnerText=function(e){return e.innerText}),t.getParentWindow=function(e){return e.defaultView||e.parentWindow}):t.importCssString=function(){};})),ace.define("ace/lib/oop",["require","exports","module"],(function(e,t,i){t.inherits=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}});},t.mixin=function(e,t){for(var i in t)e[i]=t[i];return e},t.implement=function(e,i){t.mixin(e,i);};})),ace.define("ace/lib/keys",["require","exports","module","ace/lib/fixoldbrowsers","ace/lib/oop"],(function(e,t,i){e("./fixoldbrowsers");var n=e("./oop"),s=function(){var e,t,i={MODIFIER_KEYS:{16:"Shift",17:"Ctrl",18:"Alt",224:"Meta"},KEY_MODS:{ctrl:1,alt:2,option:2,shift:4,super:8,meta:8,command:8,cmd:8},FUNCTION_KEYS:{8:"Backspace",9:"Tab",13:"Return",19:"Pause",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"Print",45:"Insert",46:"Delete",96:"Numpad0",97:"Numpad1",98:"Numpad2",99:"Numpad3",100:"Numpad4",101:"Numpad5",102:"Numpad6",103:"Numpad7",104:"Numpad8",105:"Numpad9","-13":"NumpadEnter",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Numlock",145:"Scrolllock"},PRINTABLE_KEYS:{32:" ",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",59:";",61:"=",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",107:"+",109:"-",110:".",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",111:"/",106:"*"}};for(t in i.FUNCTION_KEYS)e=i.FUNCTION_KEYS[t].toLowerCase(),i[e]=parseInt(t,10);for(t in i.PRINTABLE_KEYS)e=i.PRINTABLE_KEYS[t].toLowerCase(),i[e]=parseInt(t,10);return n.mixin(i,i.MODIFIER_KEYS),n.mixin(i,i.PRINTABLE_KEYS),n.mixin(i,i.FUNCTION_KEYS),i.enter=i.return,i.escape=i.esc,i.del=i.delete,i[173]="-",function(){for(var e=["cmd","ctrl","alt","shift"],t=Math.pow(2,e.length);t--;)i.KEY_MODS[t]=e.filter((function(e){return t&i.KEY_MODS[e]})).join("-")+"-";}(),i.KEY_MODS[0]="",i.KEY_MODS[-1]="input-",i}();n.mixin(t,s),t.keyCodeToString=function(e){var t=s[e];return "string"!=typeof t&&(t=String.fromCharCode(e)),t.toLowerCase()};})),ace.define("ace/lib/useragent",["require","exports","module"],(function(e,t,i){if(t.OS={LINUX:"LINUX",MAC:"MAC",WINDOWS:"WINDOWS"},t.getOS=function(){return t.isMac?t.OS.MAC:t.isLinux?t.OS.LINUX:t.OS.WINDOWS},"object"==typeof navigator){var n=(navigator.platform.match(/mac|win|linux/i)||["other"])[0].toLowerCase(),s=navigator.userAgent;t.isWin="win"==n,t.isMac="mac"==n,t.isLinux="linux"==n,t.isIE="Microsoft Internet Explorer"==navigator.appName||navigator.appName.indexOf("MSAppHost")>=0?parseFloat((s.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1]):parseFloat((s.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1]),t.isOldIE=t.isIE&&t.isIE<9,t.isGecko=t.isMozilla=(window.Controllers||window.controllers)&&"Gecko"===window.navigator.product,t.isOldGecko=t.isGecko&&parseInt((s.match(/rv:(\d+)/)||[])[1],10)<4,t.isOpera=window.opera&&"[object Opera]"==Object.prototype.toString.call(window.opera),t.isWebKit=parseFloat(s.split("WebKit/")[1])||void 0,t.isChrome=parseFloat(s.split(" Chrome/")[1])||void 0,t.isAIR=s.indexOf("AdobeAIR")>=0,t.isIPad=s.indexOf("iPad")>=0,t.isChromeOS=s.indexOf(" CrOS ")>=0,t.isIOS=/iPad|iPhone|iPod/.test(s)&&!window.MSStream,t.isIOS&&(t.isMac=!0);}})),ace.define("ace/lib/event",["require","exports","module","ace/lib/keys","ace/lib/useragent"],(function(e,t,i){var n=e("./keys"),s=e("./useragent"),o=null,r=0;t.addListener=function(e,t,i){if(e.addEventListener)return e.addEventListener(t,i,!1);if(e.attachEvent){var n=function(){i.call(e,window.event);};i._wrapper=n,e.attachEvent("on"+t,n);}},t.removeListener=function(e,t,i){if(e.removeEventListener)return e.removeEventListener(t,i,!1);e.detachEvent&&e.detachEvent("on"+t,i._wrapper||i);},t.stopEvent=function(e){return t.stopPropagation(e),t.preventDefault(e),!1},t.stopPropagation=function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0;},t.preventDefault=function(e){e.preventDefault?e.preventDefault():e.returnValue=!1;},t.getButton=function(e){return "dblclick"==e.type?0:"contextmenu"==e.type||s.isMac&&e.ctrlKey&&!e.altKey&&!e.shiftKey?2:e.preventDefault?e.button:{1:0,2:2,4:1}[e.button]},t.capture=function(e,i,n){function s(e){i&&i(e),n&&n(e),t.removeListener(document,"mousemove",i,!0),t.removeListener(document,"mouseup",s,!0),t.removeListener(document,"dragstart",s,!0);}return t.addListener(document,"mousemove",i,!0),t.addListener(document,"mouseup",s,!0),t.addListener(document,"dragstart",s,!0),s},t.addTouchMoveListener=function(e,i){var n,s;t.addListener(e,"touchstart",(function(e){var t=e.touches[0];n=t.clientX,s=t.clientY;})),t.addListener(e,"touchmove",(function(e){var t=e.touches;if(!(t.length>1)){var o=t[0];e.wheelX=n-o.clientX,e.wheelY=s-o.clientY,n=o.clientX,s=o.clientY,i(e);}}));},t.addMouseWheelListener=function(e,i){"onmousewheel"in e?t.addListener(e,"mousewheel",(function(e){void 0!==e.wheelDeltaX?(e.wheelX=-e.wheelDeltaX/8,e.wheelY=-e.wheelDeltaY/8):(e.wheelX=0,e.wheelY=-e.wheelDelta/8),i(e);})):"onwheel"in e?t.addListener(e,"wheel",(function(e){switch(e.deltaMode){case e.DOM_DELTA_PIXEL:e.wheelX=.35*e.deltaX||0,e.wheelY=.35*e.deltaY||0;break;case e.DOM_DELTA_LINE:case e.DOM_DELTA_PAGE:e.wheelX=5*(e.deltaX||0),e.wheelY=5*(e.deltaY||0);}i(e);})):t.addListener(e,"DOMMouseScroll",(function(e){e.axis&&e.axis==e.HORIZONTAL_AXIS?(e.wheelX=5*(e.detail||0),e.wheelY=0):(e.wheelX=0,e.wheelY=5*(e.detail||0)),i(e);}));},t.addMultiMouseDownListener=function(e,i,n,o){var r,a,l,h=0,c={2:"dblclick",3:"tripleclick",4:"quadclick"};function u(e){if(0!==t.getButton(e)?h=0:e.detail>1?++h>4&&(h=1):h=1,s.isIE){var u=Math.abs(e.clientX-r)>5||Math.abs(e.clientY-a)>5;l&&!u||(h=1),l&&clearTimeout(l),l=setTimeout((function(){l=null;}),i[h-1]||600),1==h&&(r=e.clientX,a=e.clientY);}if(e._clicks=h,n[o]("mousedown",e),h>4)h=0;else if(h>1)return n[o](c[h],e)}function d(e){h=2,l&&clearTimeout(l),l=setTimeout((function(){l=null;}),i[h-1]||600),n[o]("mousedown",e),n[o](c[h],e);}Array.isArray(e)||(e=[e]),e.forEach((function(e){t.addListener(e,"mousedown",u),s.isOldIE&&t.addListener(e,"dblclick",d);}));};var a=s.isMac&&s.isOpera&&!("KeyboardEvent"in window)?function(e){return 0|(e.metaKey?1:0)|(e.altKey?2:0)|(e.shiftKey?4:0)|(e.ctrlKey?8:0)}:function(e){return 0|(e.ctrlKey?1:0)|(e.altKey?2:0)|(e.shiftKey?4:0)|(e.metaKey?8:0)};function l(e,t,i){var l=a(t);if(!s.isMac&&o){if(t.getModifierState&&(t.getModifierState("OS")||t.getModifierState("Win"))&&(l|=8),o.altGr){if(3==(3&l))return;o.altGr=0;}if(18===i||17===i){var h="location"in t?t.location:t.keyLocation;if(17===i&&1===h)1==o[i]&&(r=t.timeStamp);else if(18===i&&3===l&&2===h){t.timeStamp-r<50&&(o.altGr=!0);}}}if((i in n.MODIFIER_KEYS&&(i=-1),8&l&&i>=91&&i<=93&&(i=-1),!l&&13===i)&&(3===(h="location"in t?t.location:t.keyLocation)&&(e(t,l,-i),t.defaultPrevented)))return;if(s.isChromeOS&&8&l){if(e(t,l,i),t.defaultPrevented)return;l&=-9;}return !!(l||i in n.FUNCTION_KEYS||i in n.PRINTABLE_KEYS)&&e(t,l,i)}function h(){o=Object.create(null);}if(t.getModifierString=function(e){return n.KEY_MODS[a(e)]},t.addCommandKeyListener=function(e,i){var n=t.addListener;if(s.isOldGecko||s.isOpera&&!("KeyboardEvent"in window)){var r=null;n(e,"keydown",(function(e){r=e.keyCode;})),n(e,"keypress",(function(e){return l(i,e,r)}));}else {var a=null;n(e,"keydown",(function(e){o[e.keyCode]=(o[e.keyCode]||0)+1;var t=l(i,e,e.keyCode);return a=e.defaultPrevented,t})),n(e,"keypress",(function(e){a&&(e.ctrlKey||e.altKey||e.shiftKey||e.metaKey)&&(t.stopEvent(e),a=null);})),n(e,"keyup",(function(e){o[e.keyCode]=null;})),o||(h(),n(window,"focus",h));}},"object"==typeof window&&window.postMessage&&!s.isOldIE){t.nextTick=function(e,i){i=i||window;var n="zero-timeout-message-1";t.addListener(i,"message",(function s(o){o.data==n&&(t.stopPropagation(o),t.removeListener(i,"message",s),e());})),i.postMessage(n,"*");};}t.nextFrame="object"==typeof window&&(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame),t.nextFrame?t.nextFrame=t.nextFrame.bind(window):t.nextFrame=function(e){setTimeout(e,17);};})),ace.define("ace/lib/lang",["require","exports","module"],(function(e,t,i){t.last=function(e){return e[e.length-1]},t.stringReverse=function(e){return e.split("").reverse().join("")},t.stringRepeat=function(e,t){for(var i="";t>0;)1&t&&(i+=e),(t>>=1)&&(e+=e);return i};var n=/^\s\s*/,s=/\s\s*$/;t.stringTrimLeft=function(e){return e.replace(n,"")},t.stringTrimRight=function(e){return e.replace(s,"")},t.copyObject=function(e){var t={};for(var i in e)t[i]=e[i];return t},t.copyArray=function(e){for(var t=[],i=0,n=e.length;i<n;i++)e[i]&&"object"==typeof e[i]?t[i]=this.copyObject(e[i]):t[i]=e[i];return t},t.deepCopy=function e(t){if("object"!=typeof t||!t)return t;var i;if(Array.isArray(t)){i=[];for(var n=0;n<t.length;n++)i[n]=e(t[n]);return i}if("[object Object]"!==Object.prototype.toString.call(t))return t;for(var n in i={},t)i[n]=e(t[n]);return i},t.arrayToMap=function(e){for(var t={},i=0;i<e.length;i++)t[e[i]]=1;return t},t.createMap=function(e){var t=Object.create(null);for(var i in e)t[i]=e[i];return t},t.arrayRemove=function(e,t){for(var i=0;i<=e.length;i++)t===e[i]&&e.splice(i,1);},t.escapeRegExp=function(e){return e.replace(/([.*+?^${}()|[\]\/\\])/g,"\\$1")},t.escapeHTML=function(e){return e.replace(/&/g,"&#38;").replace(/"/g,"&#34;").replace(/'/g,"&#39;").replace(/</g,"&#60;")},t.getMatchOffsets=function(e,t){var i=[];return e.replace(t,(function(e){i.push({offset:arguments[arguments.length-2],length:e.length});})),i},t.deferredCall=function(e){var t=null,i=function(){t=null,e();},n=function(e){return n.cancel(),t=setTimeout(i,e||0),n};return n.schedule=n,n.call=function(){return this.cancel(),e(),n},n.cancel=function(){return clearTimeout(t),t=null,n},n.isPending=function(){return t},n},t.delayedCall=function(e,t){var i=null,n=function(){i=null,e();},s=function(e){null==i&&(i=setTimeout(n,e||t));};return s.delay=function(e){i&&clearTimeout(i),i=setTimeout(n,e||t);},s.schedule=s,s.call=function(){this.cancel(),e();},s.cancel=function(){i&&clearTimeout(i),i=null;},s.isPending=function(){return i},s};})),ace.define("ace/keyboard/textinput_ios",["require","exports","module","ace/lib/event","ace/lib/useragent","ace/lib/dom","ace/lib/lang","ace/lib/keys"],(function(e,t,i){var n=e("../lib/event"),s=e("../lib/useragent"),o=e("../lib/dom"),r=e("../lib/lang"),a=e("../lib/keys"),l=a.KEY_MODS,h=s.isChrome<18,c=s.isIE;t.TextInput=function(e,t){var i=o.createElement("textarea");i.className=s.isIOS?"ace_text-input ace_text-input-ios":"ace_text-input",s.isTouchPad&&i.setAttribute("x-palm-disable-auto-cap",!0),i.setAttribute("wrap","off"),i.setAttribute("autocorrect","off"),i.setAttribute("autocapitalize","off"),i.setAttribute("spellcheck",!1),i.style.opacity="0",e.insertBefore(i,e.firstChild);var u="\n aaaa a\n",d=!1,g=!1,f=!1,m=!1,p="",A=!0;try{var C=document.activeElement===i;}catch(e){}n.addListener(i,"blur",(function(e){t.onBlur(e),C=!1;})),n.addListener(i,"focus",(function(e){C=!0,t.onFocus(e),w();})),this.focus=function(){if(p)return i.focus();i.style.position="fixed",i.focus();},this.blur=function(){i.blur();},this.isFocused=function(){return C};var v=r.delayedCall((function(){C&&w(A);})),F=r.delayedCall((function(){m||(i.value=u,C&&w());}));function w(e){if(!m){if(m=!0,b)t=0,n=e?0:i.value.length-1;else var t=4,n=5;try{i.setSelectionRange(t,n);}catch(e){}m=!1;}}function E(){m||(i.value=u,s.isWebKit&&F.schedule());}s.isWebKit||t.addEventListener("changeSelection",(function(){t.selection.isEmpty()!=A&&(A=!A,v.schedule());})),E(),C&&t.onFocus();var b=null;this.setInputHandler=function(e){b=e;},this.getInputHandler=function(){return b};var $=!1,y=function(e){4===i.selectionStart&&5===i.selectionEnd||(b&&(e=b(e),b=null),f?(w(),e&&t.onPaste(e),f=!1):e==u.substr(0)&&4===i.selectionStart?$?t.execCommand("del",{source:"ace"}):t.execCommand("backspace",{source:"ace"}):d||(e.substring(0,9)==u&&e.length>u.length?e=e.substr(9):e.substr(0,4)==u.substr(0,4)?e=e.substr(4,e.length-u.length+1):e.charAt(e.length-1)==u.charAt(0)&&(e=e.slice(0,-1)),e==u.charAt(0)||e.charAt(e.length-1)==u.charAt(0)&&(e=e.slice(0,-1)),e&&t.onTextInput(e)),d&&(d=!1),$&&($=!1));},B=function(e){if(!m){var t=i.value;y(t),E();}},S=function(e,t,i){var n=e.clipboardData||window.clipboardData;if(n&&!h){var s=c||i?"Text":"text/plain";try{return t?!1!==n.setData(s,t):n.getData(s)}catch(e){if(!i)return S(e,t,!0)}}},D=function(e,o){var r=t.getCopyText();if(!r)return n.preventDefault(e);S(e,r)?(s.isIOS&&(g=o,i.value="\n aa"+r+"a a\n",i.setSelectionRange(4,4+r.length),d={value:r}),o?t.onCut():t.onCopy(),s.isIOS||n.preventDefault(e)):(d=!0,i.value=r,i.select(),setTimeout((function(){d=!1,E(),w(),o?t.onCut():t.onCopy();})));};n.addCommandKeyListener(i,t.onCommandKey.bind(t)),n.addListener(i,"select",(function(e){!function(e){return 0===e.selectionStart&&e.selectionEnd===e.value.length}(i)?b&&w(t.selection.isEmpty()):(t.selectAll(),w());})),n.addListener(i,"input",B),n.addListener(i,"cut",(function(e){D(e,!0);})),n.addListener(i,"copy",(function(e){D(e,!1);})),n.addListener(i,"paste",(function(e){var o=S(e);"string"==typeof o?(o&&t.onPaste(o,e),s.isIE&&setTimeout(w),n.preventDefault(e)):(i.value="",f=!0);}));var x,k=function(){if(m&&t.onCompositionUpdate&&!t.$readOnly){var e=i.value.replace(/\x01/g,"");if(m.lastValue!==e&&(t.onCompositionUpdate(e),m.lastValue&&t.undo(),m.canUndo&&(m.lastValue=e),m.lastValue)){var n=t.selection.getRange();t.insert(m.lastValue),t.session.markUndoGroup(),m.range=t.selection.getRange(),t.selection.setRange(n),t.selection.clearSelection();}}},L=function(e){if(t.onCompositionEnd&&!t.$readOnly){var n=m;m=!1;var o=setTimeout((function(){o=null;var e=i.value.replace(/\x01/g,"");m||(e==n.lastValue?E():!n.lastValue&&e&&(E(),y(e)));}));b=function(e){return o&&clearTimeout(o),(e=e.replace(/\x01/g,""))==n.lastValue?"":(n.lastValue&&o&&t.undo(),e)},t.onCompositionEnd(),t.removeListener("mousedown",L),"compositionend"==e.type&&n.range&&t.selection.setRange(n.range),(!!s.isChrome&&s.isChrome>=53||!!s.isWebKit&&s.isWebKit>=603)&&B();}},R=r.delayedCall(k,50);function M(){clearTimeout(x),x=setTimeout((function(){p&&(i.style.cssText=p,p=""),null==t.renderer.$keepTextAreaAtCursor&&(t.renderer.$keepTextAreaAtCursor=!0,t.renderer.$moveTextAreaToCursor());}),0);}n.addListener(i,"compositionstart",(function(e){m||!t.onCompositionStart||t.$readOnly||((m={}).canUndo=t.session.$undoManager,t.onCompositionStart(),setTimeout(k,0),t.on("mousedown",L),m.canUndo&&!t.selection.isEmpty()&&(t.insert(""),t.session.markUndoGroup(),t.selection.clearSelection()),t.session.markUndoGroup());})),s.isGecko?n.addListener(i,"text",(function(){R.schedule();})):(n.addListener(i,"keyup",(function(){R.schedule();})),n.addListener(i,"keydown",(function(){R.schedule();}))),n.addListener(i,"compositionend",L),this.getElement=function(){return i},this.setReadOnly=function(e){i.readOnly=e;},this.onContextMenu=function(e){$=!0,w(t.selection.isEmpty()),t._emit("nativecontextmenu",{target:t,domEvent:e}),this.moveToMouse(e,!0);},this.moveToMouse=function(e,r){p||(p=i.style.cssText),i.style.cssText=(r?"z-index:100000;":"")+"height:"+i.style.height+";"+(s.isIE?"opacity:0.1;":"");var a=t.container.getBoundingClientRect(),l=o.computedStyle(t.container),h=a.top+(parseInt(l.borderTopWidth)||0),c=a.left+(parseInt(a.borderLeftWidth)||0),u=a.bottom-h-i.clientHeight-2,d=function(e){i.style.left=e.clientX-c-2+"px",i.style.top=Math.min(e.clientY-h-2,u)+"px";};d(e),"mousedown"==e.type&&(t.renderer.$keepTextAreaAtCursor&&(t.renderer.$keepTextAreaAtCursor=null),clearTimeout(x),s.isWin&&n.capture(t.container,d,M));},this.onContextMenuClose=M;var T=function(e){t.textInput.onContextMenu(e),M();};if(n.addListener(i,"mouseup",T),n.addListener(i,"mousedown",(function(e){e.preventDefault(),M();})),n.addListener(t.renderer.scroller,"contextmenu",T),n.addListener(i,"contextmenu",T),s.isIOS){var _=null,O=!1;e.addEventListener("keydown",(function(e){_&&clearTimeout(_),O=!0;})),e.addEventListener("keyup",(function(e){_=setTimeout((function(){O=!1;}),100);}));var I=function(e){if(document.activeElement===i&&!O){if(g)return setTimeout((function(){g=!1;}),100);var n=i.selectionStart,s=i.selectionEnd;if(i.setSelectionRange(4,5),n==s)switch(n){case 0:t.onCommandKey(null,0,a.up);break;case 1:t.onCommandKey(null,0,a.home);break;case 2:t.onCommandKey(null,l.option,a.left);break;case 4:t.onCommandKey(null,0,a.left);break;case 5:t.onCommandKey(null,0,a.right);break;case 7:t.onCommandKey(null,l.option,a.right);break;case 8:t.onCommandKey(null,0,a.end);break;case 9:t.onCommandKey(null,0,a.down);}else {switch(s){case 6:t.onCommandKey(null,l.shift,a.right);break;case 7:t.onCommandKey(null,l.shift|l.option,a.right);break;case 8:t.onCommandKey(null,l.shift,a.end);break;case 9:t.onCommandKey(null,l.shift,a.down);}switch(n){case 0:t.onCommandKey(null,l.shift,a.up);break;case 1:t.onCommandKey(null,l.shift,a.home);break;case 2:t.onCommandKey(null,l.shift|l.option,a.left);break;case 3:t.onCommandKey(null,l.shift,a.left);}}}};document.addEventListener("selectionchange",I),t.on("destroy",(function(){document.removeEventListener("selectionchange",I);}));}};})),ace.define("ace/keyboard/textinput",["require","exports","module","ace/lib/event","ace/lib/useragent","ace/lib/dom","ace/lib/lang","ace/keyboard/textinput_ios"],(function(e,t,i){var n=e("../lib/event"),s=e("../lib/useragent"),o=e("../lib/dom"),r=e("../lib/lang"),a=s.isChrome<18,l=s.isIE,h=e("./textinput_ios").TextInput;t.TextInput=function(e,t){if(s.isIOS)return h.call(this,e,t);var i=o.createElement("textarea");i.className="ace_text-input",i.setAttribute("wrap","off"),i.setAttribute("autocorrect","off"),i.setAttribute("autocapitalize","off"),i.setAttribute("spellcheck",!1),i.style.opacity="0",e.insertBefore(i,e.firstChild);var c="\u2028\u2028",u=!1,d=!1,g=!1,f="",m=!0;try{var p=document.activeElement===i;}catch(e){}n.addListener(i,"blur",(function(e){t.onBlur(e),p=!1;})),n.addListener(i,"focus",(function(e){p=!0,t.onFocus(e),v();})),this.focus=function(){if(f)return i.focus();var e=i.style.top;i.style.position="fixed",i.style.top="0px",i.focus(),setTimeout((function(){i.style.position="","0px"==i.style.top&&(i.style.top=e);}),0);},this.blur=function(){i.blur();},this.isFocused=function(){return p};var A=r.delayedCall((function(){p&&v(m);})),C=r.delayedCall((function(){g||(i.value=c,p&&v());}));function v(e){if(!g){if(g=!0,w)var t=0,n=e?0:i.value.length-1;else t=e?2:1,n=2;try{i.setSelectionRange(t,n);}catch(e){}g=!1;}}function F(){g||(i.value=c,s.isWebKit&&C.schedule());}s.isWebKit||t.addEventListener("changeSelection",(function(){t.selection.isEmpty()!=m&&(m=!m,A.schedule());})),F(),p&&t.onFocus();var w=null;this.setInputHandler=function(e){w=e;},this.getInputHandler=function(){return w};var E=!1,b=function(e){w&&(e=w(e),w=null),d?(v(),e&&t.onPaste(e),d=!1):e==c.charAt(0)?E?t.execCommand("del",{source:"ace"}):t.execCommand("backspace",{source:"ace"}):(e.substring(0,2)==c?e=e.substr(2):e.charAt(0)==c.charAt(0)?e=e.substr(1):e.charAt(e.length-1)==c.charAt(0)&&(e=e.slice(0,-1)),e.charAt(e.length-1)==c.charAt(0)&&(e=e.slice(0,-1)),e&&t.onTextInput(e)),E&&(E=!1);},$=function(e){if(!g){var t=i.value;b(t),F();}},y=function(e,t,i){var n=e.clipboardData||window.clipboardData;if(n&&!a){var s=l||i?"Text":"text/plain";try{return t?!1!==n.setData(s,t):n.getData(s)}catch(e){if(!i)return y(e,t,!0)}}},B=function(e,s){var o=t.getCopyText();if(!o)return n.preventDefault(e);y(e,o)?(s?t.onCut():t.onCopy(),n.preventDefault(e)):(u=!0,i.value=o,i.select(),setTimeout((function(){u=!1,F(),v(),s?t.onCut():t.onCopy();})));},S=function(e){B(e,!0);},D=function(e){B(e,!1);},x=function(e){var o=y(e);"string"==typeof o?(o&&t.onPaste(o,e),s.isIE&&setTimeout(v),n.preventDefault(e)):(i.value="",d=!0);};n.addCommandKeyListener(i,t.onCommandKey.bind(t)),n.addListener(i,"select",(function(e){u?u=!1:!function(e){return 0===e.selectionStart&&e.selectionEnd===e.value.length}(i)?w&&v(t.selection.isEmpty()):(t.selectAll(),v());})),n.addListener(i,"input",$),n.addListener(i,"cut",S),n.addListener(i,"copy",D),n.addListener(i,"paste",x),"oncut"in i&&"oncopy"in i&&"onpaste"in i||n.addListener(e,"keydown",(function(e){if((!s.isMac||e.metaKey)&&e.ctrlKey)switch(e.keyCode){case 67:D(e);break;case 86:x(e);break;case 88:S(e);}}));var k,L=function(){if(g&&t.onCompositionUpdate&&!t.$readOnly){var e=i.value.replace(/\u2028/g,"");if(g.lastValue!==e&&(t.onCompositionUpdate(e),g.lastValue&&t.undo(),g.canUndo&&(g.lastValue=e),g.lastValue)){var n=t.selection.getRange();t.insert(g.lastValue),t.session.markUndoGroup(),g.range=t.selection.getRange(),t.selection.setRange(n),t.selection.clearSelection();}}},R=function(e){if(t.onCompositionEnd&&!t.$readOnly){var n=g;g=!1;var o=setTimeout((function(){o=null;var e=i.value.replace(/\u2028/g,"");g||(e==n.lastValue?F():!n.lastValue&&e&&(F(),b(e)));}));w=function(e){return o&&clearTimeout(o),(e=e.replace(/\u2028/g,""))==n.lastValue?"":(n.lastValue&&o&&t.undo(),e)},t.onCompositionEnd(),t.removeListener("mousedown",R),"compositionend"==e.type&&n.range&&t.selection.setRange(n.range),(!!s.isChrome&&s.isChrome>=53||!!s.isWebKit&&s.isWebKit>=603)&&$();}},M=r.delayedCall(L,50);function T(){clearTimeout(k),k=setTimeout((function(){f&&(i.style.cssText=f,f=""),null==t.renderer.$keepTextAreaAtCursor&&(t.renderer.$keepTextAreaAtCursor=!0,t.renderer.$moveTextAreaToCursor());}),0);}n.addListener(i,"compositionstart",(function(e){g||!t.onCompositionStart||t.$readOnly||((g={}).canUndo=t.session.$undoManager,t.onCompositionStart(),setTimeout(L,0),t.on("mousedown",R),g.canUndo&&!t.selection.isEmpty()&&(t.insert(""),t.session.markUndoGroup(),t.selection.clearSelection()),t.session.markUndoGroup());})),s.isGecko?n.addListener(i,"text",(function(){M.schedule();})):(n.addListener(i,"keyup",(function(){M.schedule();})),n.addListener(i,"keydown",(function(){M.schedule();}))),n.addListener(i,"compositionend",R),this.getElement=function(){return i},this.setReadOnly=function(e){i.readOnly=e;},this.onContextMenu=function(e){E=!0,v(t.selection.isEmpty()),t._emit("nativecontextmenu",{target:t,domEvent:e}),this.moveToMouse(e,!0);},this.moveToMouse=function(e,r){f||(f=i.style.cssText),i.style.cssText=(r?"z-index:100000;":"")+"height:"+i.style.height+";"+(s.isIE?"opacity:0.1;":"");var a=t.container.getBoundingClientRect(),l=o.computedStyle(t.container),h=a.top+(parseInt(l.borderTopWidth)||0),c=a.left+(parseInt(a.borderLeftWidth)||0),u=a.bottom-h-i.clientHeight-2,d=function(e){i.style.left=e.clientX-c-2+"px",i.style.top=Math.min(e.clientY-h-2,u)+"px";};d(e),"mousedown"==e.type&&(t.renderer.$keepTextAreaAtCursor&&(t.renderer.$keepTextAreaAtCursor=null),clearTimeout(k),s.isWin&&n.capture(t.container,d,T));},this.onContextMenuClose=T;var _=function(e){t.textInput.onContextMenu(e),T();};n.addListener(i,"mouseup",_),n.addListener(i,"mousedown",(function(e){e.preventDefault(),T();})),n.addListener(t.renderer.scroller,"contextmenu",_),n.addListener(i,"contextmenu",_);};})),ace.define("ace/mouse/default_handlers",["require","exports","module","ace/lib/dom","ace/lib/event","ace/lib/useragent"],(function(e,t,i){e("../lib/dom"),e("../lib/event");var n=e("../lib/useragent");function s(e){e.$clickSelection=null;var t=e.editor;t.setDefaultHandler("mousedown",this.onMouseDown.bind(e)),t.setDefaultHandler("dblclick",this.onDoubleClick.bind(e)),t.setDefaultHandler("tripleclick",this.onTripleClick.bind(e)),t.setDefaultHandler("quadclick",this.onQuadClick.bind(e)),t.setDefaultHandler("mousewheel",this.onMouseWheel.bind(e)),t.setDefaultHandler("touchmove",this.onTouchMove.bind(e));["select","startSelect","selectEnd","selectAllEnd","selectByWordsEnd","selectByLinesEnd","dragWait","dragWaitEnd","focusWait"].forEach((function(t){e[t]=this[t];}),this),e.selectByLines=this.extendSelectionBy.bind(e,"getLineRange"),e.selectByWords=this.extendSelectionBy.bind(e,"getWordRange");}function o(e,t){if(e.start.row==e.end.row)var i=2*t.column-e.start.column-e.end.column;else if(e.start.row!=e.end.row-1||e.start.column||e.end.column)i=2*t.row-e.start.row-e.end.row;else var i=t.column-4;return i<0?{cursor:e.start,anchor:e.end}:{cursor:e.end,anchor:e.start}}((function(){this.onMouseDown=function(e){var t=e.inSelection(),i=e.getDocumentPosition();this.mousedownEvent=e;var s=this.editor,o=e.getButton();if(0!==o){var r=s.getSelectionRange().isEmpty();return s.$blockScrolling++,(r||1==o)&&s.selection.moveToPosition(i),s.$blockScrolling--,void(2==o&&(s.textInput.onContextMenu(e.domEvent),n.isMozilla||e.preventDefault()))}return this.mousedownEvent.time=Date.now(),!t||s.isFocused()||(s.focus(),!this.$focusTimout||this.$clickSelection||s.inMultiSelectMode)?(this.captureMouse(e),this.startSelect(i,e.domEvent._clicks>1),e.preventDefault()):(this.setState("focusWait"),void this.captureMouse(e))},this.startSelect=function(e,t){e=e||this.editor.renderer.screenToTextCoordinates(this.x,this.y);var i=this.editor;i.$blockScrolling++,this.mousedownEvent.getShiftKey()?i.selection.selectToPosition(e):t||i.selection.moveToPosition(e),t||this.select(),i.renderer.scroller.setCapture&&i.renderer.scroller.setCapture(),i.setStyle("ace_selecting"),this.setState("select"),i.$blockScrolling--;},this.select=function(){var e,t=this.editor,i=t.renderer.screenToTextCoordinates(this.x,this.y);if(t.$blockScrolling++,this.$clickSelection){var n=this.$clickSelection.comparePoint(i);if(-1==n)e=this.$clickSelection.end;else if(1==n)e=this.$clickSelection.start;else {var s=o(this.$clickSelection,i);i=s.cursor,e=s.anchor;}t.selection.setSelectionAnchor(e.row,e.column);}t.selection.selectToPosition(i),t.$blockScrolling--,t.renderer.scrollCursorIntoView();},this.extendSelectionBy=function(e){var t,i=this.editor,n=i.renderer.screenToTextCoordinates(this.x,this.y),s=i.selection[e](n.row,n.column);if(i.$blockScrolling++,this.$clickSelection){var r=this.$clickSelection.comparePoint(s.start),a=this.$clickSelection.comparePoint(s.end);if(-1==r&&a<=0)t=this.$clickSelection.end,s.end.row==n.row&&s.end.column==n.column||(n=s.start);else if(1==a&&r>=0)t=this.$clickSelection.start,s.start.row==n.row&&s.start.column==n.column||(n=s.end);else if(-1==r&&1==a)n=s.end,t=s.start;else {var l=o(this.$clickSelection,n);n=l.cursor,t=l.anchor;}i.selection.setSelectionAnchor(t.row,t.column);}i.selection.selectToPosition(n),i.$blockScrolling--,i.renderer.scrollCursorIntoView();},this.selectEnd=this.selectAllEnd=this.selectByWordsEnd=this.selectByLinesEnd=function(){this.$clickSelection=null,this.editor.unsetStyle("ace_selecting"),this.editor.renderer.scroller.releaseCapture&&this.editor.renderer.scroller.releaseCapture();},this.focusWait=function(){var e,t,i,n,s=(e=this.mousedownEvent.x,t=this.mousedownEvent.y,i=this.x,n=this.y,Math.sqrt(Math.pow(i-e,2)+Math.pow(n-t,2))),o=Date.now();(s>0||o-this.mousedownEvent.time>this.$focusTimout)&&this.startSelect(this.mousedownEvent.getDocumentPosition());},this.onDoubleClick=function(e){var t=e.getDocumentPosition(),i=this.editor,n=i.session.getBracketRange(t);n?(n.isEmpty()&&(n.start.column--,n.end.column++),this.setState("select")):(n=i.selection.getWordRange(t.row,t.column),this.setState("selectByWords")),this.$clickSelection=n,this.select();},this.onTripleClick=function(e){var t=e.getDocumentPosition(),i=this.editor;this.setState("selectByLines");var n=i.getSelectionRange();n.isMultiLine()&&n.contains(t.row,t.column)?(this.$clickSelection=i.selection.getLineRange(n.start.row),this.$clickSelection.end=i.selection.getLineRange(n.end.row).end):this.$clickSelection=i.selection.getLineRange(t.row),this.select();},this.onQuadClick=function(e){var t=this.editor;t.selectAll(),this.$clickSelection=t.getSelectionRange(),this.setState("selectAll");},this.onMouseWheel=function(e){if(!e.getAccelKey()){e.getShiftKey()&&e.wheelY&&!e.wheelX&&(e.wheelX=e.wheelY,e.wheelY=0);var t=this.editor;this.$lastScroll||(this.$lastScroll={t:0,vx:0,vy:0,allowed:0});var i=this.$lastScroll,n=e.domEvent.timeStamp,s=n-i.t,o=e.wheelX/s,r=e.wheelY/s;s<250&&(o=(o+i.vx)/2,r=(r+i.vy)/2);var a=Math.abs(o/r),l=!1;if(a>=1&&t.renderer.isScrollableBy(e.wheelX*e.speed,0)&&(l=!0),a<=1&&t.renderer.isScrollableBy(0,e.wheelY*e.speed)&&(l=!0),l)i.allowed=n;else if(n-i.allowed<250){Math.abs(o)<=1.1*Math.abs(i.vx)&&Math.abs(r)<=1.1*Math.abs(i.vy)?(l=!0,i.allowed=n):i.allowed=0;}return i.t=n,i.vx=o,i.vy=r,l?(t.renderer.scrollBy(e.wheelX*e.speed,e.wheelY*e.speed),e.stop()):void 0}},this.onTouchMove=function(e){this.editor._emit("mousewheel",e);};})).call(s.prototype),t.DefaultHandlers=s;})),ace.define("ace/tooltip",["require","exports","module","ace/lib/oop","ace/lib/dom"],(function(e,t,i){e("./lib/oop");var n=e("./lib/dom");function s(e){this.isOpen=!1,this.$element=null,this.$parentNode=e;}((function(){this.$init=function(){return this.$element=n.createElement("div"),this.$element.className="ace_tooltip",this.$element.style.display="none",this.$parentNode.appendChild(this.$element),this.$element},this.getElement=function(){return this.$element||this.$init()},this.setText=function(e){n.setInnerText(this.getElement(),e);},this.setHtml=function(e){this.getElement().innerHTML=e;},this.setPosition=function(e,t){this.getElement().style.left=e+"px",this.getElement().style.top=t+"px";},this.setClassName=function(e){n.addCssClass(this.getElement(),e);},this.show=function(e,t,i){null!=e&&this.setText(e),null!=t&&null!=i&&this.setPosition(t,i),this.isOpen||(this.getElement().style.display="block",this.isOpen=!0);},this.hide=function(){this.isOpen&&(this.getElement().style.display="none",this.isOpen=!1);},this.getHeight=function(){return this.getElement().offsetHeight},this.getWidth=function(){return this.getElement().offsetWidth},this.destroy=function(){this.isOpen=!1,this.$element&&this.$element.parentNode&&this.$element.parentNode.removeChild(this.$element);};})).call(s.prototype),t.Tooltip=s;})),ace.define("ace/mouse/default_gutter_handler",["require","exports","module","ace/lib/dom","ace/lib/oop","ace/lib/event","ace/tooltip"],(function(e,t,i){var n=e("../lib/dom"),s=e("../lib/oop"),o=e("../lib/event"),r=e("../tooltip").Tooltip;function a(e){r.call(this,e);}s.inherits(a,r),function(){this.setPosition=function(e,t){var i=window.innerWidth||document.documentElement.clientWidth,n=window.innerHeight||document.documentElement.clientHeight,s=this.getWidth(),o=this.getHeight();(e+=15)+s>i&&(e-=e+s-i),(t+=15)+o>n&&(t-=20+o),r.prototype.setPosition.call(this,e,t);};}.call(a.prototype),t.GutterHandler=function(e){var t,i,s,r=e.editor,l=r.renderer.$gutterLayer,h=new a(r.container);function c(){t&&(t=clearTimeout(t)),s&&(h.hide(),s=null,r._signal("hideGutterTooltip",h),r.removeEventListener("mousewheel",c));}function u(e){h.setPosition(e.x,e.y);}e.editor.setDefaultHandler("guttermousedown",(function(t){if(r.isFocused()&&0==t.getButton()&&"foldWidgets"!=l.getRegion(t)){var i=t.getDocumentPosition().row,n=r.session.selection;if(t.getShiftKey())n.selectTo(i,0);else {if(2==t.domEvent.detail)return r.selectAll(),t.preventDefault();e.$clickSelection=r.selection.getLineRange(i);}return e.setState("selectByLines"),e.captureMouse(t),t.preventDefault()}})),e.editor.setDefaultHandler("guttermousemove",(function(o){var a=o.domEvent.target||o.domEvent.srcElement;if(n.hasCssClass(a,"ace_fold-widget"))return c();s&&e.$tooltipFollowsMouse&&u(o),i=o,t||(t=setTimeout((function(){t=null,i&&!e.isMousePressed?function(){var t=i.getDocumentPosition().row,n=l.$annotations[t];if(!n)return c();if(t==r.session.getLength()){var o=r.renderer.pixelToScreenCoordinates(0,i.y).row,a=i.$pos;if(o>r.session.documentToScreenRow(a.row,a.column))return c()}if(s!=n)if(s=n.text.join("<br/>"),h.setHtml(s),h.show(),r._signal("showGutterTooltip",h),r.on("mousewheel",c),e.$tooltipFollowsMouse)u(i);else {var d=i.domEvent.target.getBoundingClientRect(),g=h.getElement().style;g.left=d.right+"px",g.top=d.bottom+"px";}}():c();}),50));})),o.addListener(r.renderer.$gutter,"mouseout",(function(e){i=null,s&&!t&&(t=setTimeout((function(){t=null,c();}),50));})),r.on("changeSession",c);};})),ace.define("ace/mouse/mouse_event",["require","exports","module","ace/lib/event","ace/lib/useragent"],(function(e,t,i){var n=e("../lib/event"),s=e("../lib/useragent"),o=t.MouseEvent=function(e,t){this.domEvent=e,this.editor=t,this.x=this.clientX=e.clientX,this.y=this.clientY=e.clientY,this.$pos=null,this.$inSelection=null,this.propagationStopped=!1,this.defaultPrevented=!1;};(function(){this.stopPropagation=function(){n.stopPropagation(this.domEvent),this.propagationStopped=!0;},this.preventDefault=function(){n.preventDefault(this.domEvent),this.defaultPrevented=!0;},this.stop=function(){this.stopPropagation(),this.preventDefault();},this.getDocumentPosition=function(){return this.$pos||(this.$pos=this.editor.renderer.screenToTextCoordinates(this.clientX,this.clientY)),this.$pos},this.inSelection=function(){if(null!==this.$inSelection)return this.$inSelection;var e=this.editor.getSelectionRange();if(e.isEmpty())this.$inSelection=!1;else {var t=this.getDocumentPosition();this.$inSelection=e.contains(t.row,t.column);}return this.$inSelection},this.getButton=function(){return n.getButton(this.domEvent)},this.getShiftKey=function(){return this.domEvent.shiftKey},this.getAccelKey=s.isMac?function(){return this.domEvent.metaKey}:function(){return this.domEvent.ctrlKey};}).call(o.prototype);})),ace.define("ace/mouse/dragdrop_handler",["require","exports","module","ace/lib/dom","ace/lib/event","ace/lib/useragent"],(function(e,t,i){var n=e("../lib/dom"),s=e("../lib/event"),o=e("../lib/useragent");function r(e){var t=e.editor,i=n.createElement("img");i.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",o.isOpera&&(i.style.cssText="width:1px;height:1px;position:fixed;top:0;left:0;z-index:2147483647;opacity:0;");["dragWait","dragWaitEnd","startDrag","dragReadyEnd","onMouseDrag"].forEach((function(t){e[t]=this[t];}),this),t.addEventListener("mousedown",this.onMouseDown.bind(e));var r,l,h,c,u,d,g,f,m,p,A,C=t.container,v=0;function F(){var e=d;((function(e,i){var n=Date.now(),s=!i||e.row!=i.row,o=!i||e.column!=i.column;!p||s||o?(t.$blockScrolling+=1,t.moveCursorToPosition(e),t.$blockScrolling-=1,p=n,A={x:l,y:h}):a(A.x,A.y,l,h)>5?p=null:n-p>=200&&(t.renderer.scrollCursorIntoView(),p=null);}))(d=t.renderer.screenToTextCoordinates(l,h),e),function(e,i){var n=Date.now(),s=t.renderer.layerConfig.lineHeight,o=t.renderer.layerConfig.characterWidth,r=t.renderer.scroller.getBoundingClientRect(),a={x:{left:l-r.left,right:r.right-l},y:{top:h-r.top,bottom:r.bottom-h}},c=Math.min(a.x.left,a.x.right),u=Math.min(a.y.top,a.y.bottom),d={row:e.row,column:e.column};c/o<=2&&(d.column+=a.x.left<a.x.right?-3:2),u/s<=1&&(d.row+=a.y.top<a.y.bottom?-1:1);var g=e.row!=d.row,f=e.column!=d.column,p=!i||e.row!=i.row;g||f&&!p?m?n-m>=200&&t.renderer.scrollCursorIntoView(d):m=n:m=null;}(d,e);}function w(){u=t.selection.toOrientedRange(),r=t.session.addMarker(u,"ace_selection",t.getSelectionStyle()),t.clearSelection(),t.isFocused()&&t.renderer.$cursorLayer.setBlinking(!1),clearInterval(c),F(),c=setInterval(F,20),v=0,s.addListener(document,"mousemove",$);}function E(){clearInterval(c),t.session.removeMarker(r),r=null,t.$blockScrolling+=1,t.selection.fromOrientedRange(u),t.$blockScrolling-=1,t.isFocused()&&!f&&t.renderer.$cursorLayer.setBlinking(!t.getReadOnly()),u=null,d=null,v=0,m=null,p=null,s.removeListener(document,"mousemove",$);}this.onDragStart=function(e){if(this.cancelDrag||!C.draggable){var n=this;return setTimeout((function(){n.startSelect(),n.captureMouse(e);}),0),e.preventDefault()}u=t.getSelectionRange();var s=e.dataTransfer;s.effectAllowed=t.getReadOnly()?"copy":"copyMove",o.isOpera&&(t.container.appendChild(i),i.scrollTop=0),s.setDragImage&&s.setDragImage(i,0,0),o.isOpera&&t.container.removeChild(i),s.clearData(),s.setData("Text",t.session.getTextRange()),f=!0,this.setState("drag");},this.onDragEnd=function(e){if(C.draggable=!1,f=!1,this.setState(null),!t.getReadOnly()){var i=e.dataTransfer.dropEffect;g||"move"!=i||t.session.remove(t.getSelectionRange()),t.renderer.$cursorLayer.setBlinking(!0);}this.editor.unsetStyle("ace_dragging"),this.editor.renderer.setCursorStyle("");},this.onDragEnter=function(e){if(!t.getReadOnly()&&y(e.dataTransfer))return l=e.clientX,h=e.clientY,r||w(),v++,e.dataTransfer.dropEffect=g=B(e),s.preventDefault(e)},this.onDragOver=function(e){if(!t.getReadOnly()&&y(e.dataTransfer))return l=e.clientX,h=e.clientY,r||(w(),v++),null!==b&&(b=null),e.dataTransfer.dropEffect=g=B(e),s.preventDefault(e)},this.onDragLeave=function(e){if(--v<=0&&r)return E(),g=null,s.preventDefault(e)},this.onDrop=function(e){if(d){var i=e.dataTransfer;if(f)switch(g){case"move":u=u.contains(d.row,d.column)?{start:d,end:d}:t.moveText(u,d);break;case"copy":u=t.moveText(u,d,!0);}else {var n=i.getData("Text");u={start:d,end:t.session.insert(d,n)},t.focus(),g=null;}return E(),s.preventDefault(e)}},s.addListener(C,"dragstart",this.onDragStart.bind(e)),s.addListener(C,"dragend",this.onDragEnd.bind(e)),s.addListener(C,"dragenter",this.onDragEnter.bind(e)),s.addListener(C,"dragover",this.onDragOver.bind(e)),s.addListener(C,"dragleave",this.onDragLeave.bind(e)),s.addListener(C,"drop",this.onDrop.bind(e));var b=null;function $(){null==b&&(b=setTimeout((function(){null!=b&&r&&E();}),20));}function y(e){var t=e.types;return !t||Array.prototype.some.call(t,(function(e){return "text/plain"==e||"Text"==e}))}function B(e){var t=["copy","copymove","all","uninitialized"],i=o.isMac?e.altKey:e.ctrlKey,n="uninitialized";try{n=e.dataTransfer.effectAllowed.toLowerCase();}catch(e){}var s="none";return i&&t.indexOf(n)>=0?s="copy":["move","copymove","linkmove","all","uninitialized"].indexOf(n)>=0?s="move":t.indexOf(n)>=0&&(s="copy"),s}}function a(e,t,i,n){return Math.sqrt(Math.pow(i-e,2)+Math.pow(n-t,2))}((function(){this.dragWait=function(){Date.now()-this.mousedownEvent.time>this.editor.getDragDelay()&&this.startDrag();},this.dragWaitEnd=function(){this.editor.container.draggable=!1,this.startSelect(this.mousedownEvent.getDocumentPosition()),this.selectEnd();},this.dragReadyEnd=function(e){this.editor.renderer.$cursorLayer.setBlinking(!this.editor.getReadOnly()),this.editor.unsetStyle("ace_dragging"),this.editor.renderer.setCursorStyle(""),this.dragWaitEnd();},this.startDrag=function(){this.cancelDrag=!1;var e=this.editor;e.container.draggable=!0,e.renderer.$cursorLayer.setBlinking(!1),e.setStyle("ace_dragging");var t=o.isWin?"default":"move";e.renderer.setCursorStyle(t),this.setState("dragReady");},this.onMouseDrag=function(e){var t=this.editor.container;o.isIE&&"dragReady"==this.state&&(a(this.mousedownEvent.x,this.mousedownEvent.y,this.x,this.y)>3&&t.dragDrop());"dragWait"===this.state&&(a(this.mousedownEvent.x,this.mousedownEvent.y,this.x,this.y)>0&&(t.draggable=!1,this.startSelect(this.mousedownEvent.getDocumentPosition())));},this.onMouseDown=function(e){if(this.$dragEnabled){this.mousedownEvent=e;var t=this.editor,i=e.inSelection(),n=e.getButton();if(1===(e.domEvent.detail||1)&&0===n&&i){if(e.editor.inMultiSelectMode&&(e.getAccelKey()||e.getShiftKey()))return;this.mousedownEvent.time=Date.now();var s=e.domEvent.target||e.domEvent.srcElement;if("unselectable"in s&&(s.unselectable="on"),t.getDragDelay()){if(o.isWebKit)this.cancelDrag=!0,t.container.draggable=!0;this.setState("dragWait");}else this.startDrag();this.captureMouse(e,this.onMouseDrag.bind(this)),e.defaultPrevented=!0;}}};})).call(r.prototype),t.DragdropHandler=r;})),ace.define("ace/lib/net",["require","exports","module","ace/lib/dom"],(function(e,t,i){var n=e("./dom");t.get=function(e,t){var i=new XMLHttpRequest;i.open("GET",e,!0),i.onreadystatechange=function(){4===i.readyState&&t(i.responseText);},i.send(null);},t.loadScript=function(e,t){var i=n.getDocumentHead(),s=document.createElement("script");s.src=e,i.appendChild(s),s.onload=s.onreadystatechange=function(e,i){!i&&s.readyState&&"loaded"!=s.readyState&&"complete"!=s.readyState||(s=s.onload=s.onreadystatechange=null,i||t());};},t.qualifyURL=function(e){var t=document.createElement("a");return t.href=e,t.href};})),ace.define("ace/lib/event_emitter",["require","exports","module"],(function(e,t,i){var n={},s=function(){this.propagationStopped=!0;},o=function(){this.defaultPrevented=!0;};n._emit=n._dispatchEvent=function(e,t){this._eventRegistry||(this._eventRegistry={}),this._defaultHandlers||(this._defaultHandlers={});var i=this._eventRegistry[e]||[],n=this._defaultHandlers[e];if(i.length||n){"object"==typeof t&&t||(t={}),t.type||(t.type=e),t.stopPropagation||(t.stopPropagation=s),t.preventDefault||(t.preventDefault=o),i=i.slice();for(var r=0;r<i.length&&(i[r](t,this),!t.propagationStopped);r++);return n&&!t.defaultPrevented?n(t,this):void 0}},n._signal=function(e,t){var i=(this._eventRegistry||{})[e];if(i){i=i.slice();for(var n=0;n<i.length;n++)i[n](t,this);}},n.once=function(e,t){var i=this;t&&this.addEventListener(e,(function n(){i.removeEventListener(e,n),t.apply(null,arguments);}));},n.setDefaultHandler=function(e,t){var i=this._defaultHandlers;if(i||(i=this._defaultHandlers={_disabled_:{}}),i[e]){var n=i[e],s=i._disabled_[e];s||(i._disabled_[e]=s=[]),s.push(n);var o=s.indexOf(t);-1!=o&&s.splice(o,1);}i[e]=t;},n.removeDefaultHandler=function(e,t){var i=this._defaultHandlers;if(i){var n=i._disabled_[e];if(i[e]==t)i[e],n&&this.setDefaultHandler(e,n.pop());else if(n){var s=n.indexOf(t);-1!=s&&n.splice(s,1);}}},n.on=n.addEventListener=function(e,t,i){this._eventRegistry=this._eventRegistry||{};var n=this._eventRegistry[e];return n||(n=this._eventRegistry[e]=[]),-1==n.indexOf(t)&&n[i?"unshift":"push"](t),t},n.off=n.removeListener=n.removeEventListener=function(e,t){this._eventRegistry=this._eventRegistry||{};var i=this._eventRegistry[e];if(i){var n=i.indexOf(t);-1!==n&&i.splice(n,1);}},n.removeAllListeners=function(e){this._eventRegistry&&(this._eventRegistry[e]=[]);},t.EventEmitter=n;})),ace.define("ace/lib/app_config",["require","exports","module","ace/lib/oop","ace/lib/event_emitter"],(function(e,t,i){var n=e("./oop"),s=e("./event_emitter").EventEmitter,o={setOptions:function(e){Object.keys(e).forEach((function(t){this.setOption(t,e[t]);}),this);},getOptions:function(e){var t={};return e?Array.isArray(e)||(t=e,e=Object.keys(t)):e=Object.keys(this.$options),e.forEach((function(e){t[e]=this.getOption(e);}),this),t},setOption:function(e,t){if(this["$"+e]!==t){var i=this.$options[e];if(!i)return r('misspelled option "'+e+'"');if(i.forwardTo)return this[i.forwardTo]&&this[i.forwardTo].setOption(e,t);i.handlesSet||(this["$"+e]=t),i&&i.set&&i.set.call(this,t);}},getOption:function(e){var t=this.$options[e];return t?t.forwardTo?this[t.forwardTo]&&this[t.forwardTo].getOption(e):t&&t.get?t.get.call(this):this["$"+e]:r('misspelled option "'+e+'"')}};function r(e){"undefined"!=typeof console&&console.warn&&console.warn.apply(console,arguments);}function a(e,t){var i=new Error(e);i.data=t,"object"==typeof console&&console.error&&console.error(i),setTimeout((function(){throw i}));}var l=function(){this.$defaultOptions={};};((function(){n.implement(this,s),this.defineOptions=function(e,t,i){return e.$options||(this.$defaultOptions[t]=e.$options={}),Object.keys(i).forEach((function(t){var n=i[t];"string"==typeof n&&(n={forwardTo:n}),n.name||(n.name=t),e.$options[n.name]=n,"initialValue"in n&&(e["$"+n.name]=n.initialValue);})),n.implement(e,o),this},this.resetOptions=function(e){Object.keys(e.$options).forEach((function(t){var i=e.$options[t];"value"in i&&e.setOption(t,i.value);}));},this.setDefaultValue=function(e,t,i){var n=this.$defaultOptions[e]||(this.$defaultOptions[e]={});n[t]&&(n.forwardTo?this.setDefaultValue(n.forwardTo,t,i):n[t].value=i);},this.setDefaultValues=function(e,t){Object.keys(t).forEach((function(i){this.setDefaultValue(e,i,t[i]);}),this);},this.warn=r,this.reportError=a;})).call(l.prototype),t.AppConfig=l;})),ace.define("ace/config",["require","exports","module","ace/lib/lang","ace/lib/oop","ace/lib/net","ace/lib/app_config"],(function(e,t,i){var n=e("./lib/lang");e("./lib/oop");var s=e("./lib/net"),o=e("./lib/app_config").AppConfig;i.exports=t=new o;var r=function(){return this||"undefined"!=typeof window&&window}(),a={packaged:!1,workerPath:null,modePath:null,themePath:null,basePath:"",suffix:".js",$moduleUrls:{}};function l(n){if(r&&r.document){a.packaged=n||e.packaged||i.packaged||r.define&&(void 0).packaged;for(var s,o={},l="",h=document.currentScript||document._currentScript,c=(h&&h.ownerDocument||document).getElementsByTagName("script"),u=0;u<c.length;u++){var d=c[u],g=d.src||d.getAttribute("src");if(g){for(var f=d.attributes,m=0,p=f.length;m<p;m++){var A=f[m];0===A.name.indexOf("data-ace-")&&(o[(s=A.name.replace(/^data-ace-/,""),s.replace(/-(.)/g,(function(e,t){return t.toUpperCase()})))]=A.value);}var C=g.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);C&&(l=C[1]);}}for(var v in l&&(o.base=o.base||l,o.packaged=!0),o.basePath=o.base,o.workerPath=o.workerPath||o.base,o.modePath=o.modePath||o.base,o.themePath=o.themePath||o.base,delete o.base,o)void 0!==o[v]&&t.set(v,o[v]);}}t.get=function(e){if(!a.hasOwnProperty(e))throw new Error("Unknown config key: "+e);return a[e]},t.set=function(e,t){if(!a.hasOwnProperty(e))throw new Error("Unknown config key: "+e);a[e]=t;},t.all=function(){return n.copyObject(a)},t.moduleUrl=function(e,t){if(a.$moduleUrls[e])return a.$moduleUrls[e];var i=e.split("/"),n="snippets"==(t=t||i[i.length-2]||"")?"/":"-",s=i[i.length-1];if("worker"==t&&"-"==n){var o=new RegExp("^"+t+"[\\-_]|[\\-_]"+t+"$","g");s=s.replace(o,"");}(!s||s==t)&&i.length>1&&(s=i[i.length-2]);var r=a[t+"Path"];return null==r?r=a.basePath:"/"==n&&(t=n=""),r&&"/"!=r.slice(-1)&&(r+="/"),r+t+n+s+this.get("suffix")},t.setModuleUrl=function(e,t){return a.$moduleUrls[e]=t},t.$loading={},t.loadModule=function(i,n){var o,r;Array.isArray(i)&&(r=i[0],i=i[1]);try{o=e(i);}catch(e){}if(o&&!t.$loading[i])return n&&n(o);if(t.$loading[i]||(t.$loading[i]=[]),t.$loading[i].push(n),!(t.$loading[i].length>1)){var a=function(){e([i],(function(e){t._emit("load.module",{name:i,module:e});var n=t.$loading[i];t.$loading[i]=null,n.forEach((function(t){t&&t(e);}));}));};if(!t.get("packaged"))return a();s.loadScript(t.moduleUrl(i,r),a);}},l(!0),t.init=l;})),ace.define("ace/mouse/mouse_handler",["require","exports","module","ace/lib/event","ace/lib/useragent","ace/mouse/default_handlers","ace/mouse/default_gutter_handler","ace/mouse/mouse_event","ace/mouse/dragdrop_handler","ace/config"],(function(e,t,i){var n=e("../lib/event"),s=e("../lib/useragent"),o=e("./default_handlers").DefaultHandlers,r=e("./default_gutter_handler").GutterHandler,a=e("./mouse_event").MouseEvent,l=e("./dragdrop_handler").DragdropHandler,h=e("../config"),c=function(e){var t=this;this.editor=e,new o(this),new r(this),new l(this);var i=function(t){(!document.hasFocus||!document.hasFocus()||!e.isFocused()&&document.activeElement==(e.textInput&&e.textInput.getElement()))&&window.focus(),e.focus();},a=e.renderer.getMouseEventTarget();n.addListener(a,"click",this.onMouseEvent.bind(this,"click")),n.addListener(a,"mousemove",this.onMouseMove.bind(this,"mousemove")),n.addMultiMouseDownListener([a,e.renderer.scrollBarV&&e.renderer.scrollBarV.inner,e.renderer.scrollBarH&&e.renderer.scrollBarH.inner,e.textInput&&e.textInput.getElement()].filter(Boolean),[400,300,250],this,"onMouseEvent"),n.addMouseWheelListener(e.container,this.onMouseWheel.bind(this,"mousewheel")),n.addTouchMoveListener(e.container,this.onTouchMove.bind(this,"touchmove"));var h=e.renderer.$gutter;n.addListener(h,"mousedown",this.onMouseEvent.bind(this,"guttermousedown")),n.addListener(h,"click",this.onMouseEvent.bind(this,"gutterclick")),n.addListener(h,"dblclick",this.onMouseEvent.bind(this,"gutterdblclick")),n.addListener(h,"mousemove",this.onMouseEvent.bind(this,"guttermousemove")),n.addListener(a,"mousedown",i),n.addListener(h,"mousedown",i),s.isIE&&e.renderer.scrollBarV&&(n.addListener(e.renderer.scrollBarV.element,"mousedown",i),n.addListener(e.renderer.scrollBarH.element,"mousedown",i)),e.on("mousemove",(function(i){if(!t.state&&!t.$dragDelay&&t.$dragEnabled){var n=e.renderer.screenToTextCoordinates(i.x,i.y),s=e.session.selection.getRange(),o=e.renderer;!s.isEmpty()&&s.insideStart(n.row,n.column)?o.setCursorStyle("default"):o.setCursorStyle("");}}));};((function(){this.onMouseEvent=function(e,t){this.editor._emit(e,new a(t,this.editor));},this.onMouseMove=function(e,t){var i=this.editor._eventRegistry&&this.editor._eventRegistry.mousemove;i&&i.length&&this.editor._emit(e,new a(t,this.editor));},this.onMouseWheel=function(e,t){var i=new a(t,this.editor);i.speed=2*this.$scrollSpeed,i.wheelX=t.wheelX,i.wheelY=t.wheelY,this.editor._emit(e,i);},this.onTouchMove=function(e,t){var i=new a(t,this.editor);i.speed=1,i.wheelX=t.wheelX,i.wheelY=t.wheelY,this.editor._emit(e,i);},this.setState=function(e){this.state=e;},this.captureMouse=function(e,t){this.x=e.x,this.y=e.y,this.isMousePressed=!0;var i=this.editor.renderer;i.$keepTextAreaAtCursor&&(i.$keepTextAreaAtCursor=null);var o=this,r=function(e){if(e){if(s.isWebKit&&!e.which&&o.releaseMouse)return o.releaseMouse();o.x=e.clientX,o.y=e.clientY,t&&t(e),o.mouseEvent=new a(e,o.editor),o.$mouseMoved=!0;}},l=function(e){clearInterval(c),h(),o[o.state+"End"]&&o[o.state+"End"](e),o.state="",null==i.$keepTextAreaAtCursor&&(i.$keepTextAreaAtCursor=!0,i.$moveTextAreaToCursor()),o.isMousePressed=!1,o.$onCaptureMouseMove=o.releaseMouse=null,e&&o.onMouseEvent("mouseup",e);},h=function(){o[o.state]&&o[o.state](),o.$mouseMoved=!1;};if(s.isOldIE&&"dblclick"==e.domEvent.type)return setTimeout((function(){l(e);}));o.$onCaptureMouseMove=r,o.releaseMouse=n.capture(this.editor.container,r,l);var c=setInterval(h,20);},this.releaseMouse=null,this.cancelContextMenu=function(){var e=function(t){t&&t.domEvent&&"contextmenu"!=t.domEvent.type||(this.editor.off("nativecontextmenu",e),t&&t.domEvent&&n.stopEvent(t.domEvent));}.bind(this);setTimeout(e,10),this.editor.on("nativecontextmenu",e);};})).call(c.prototype),h.defineOptions(c.prototype,"mouseHandler",{scrollSpeed:{initialValue:2},dragDelay:{initialValue:s.isMac?150:0},dragEnabled:{initialValue:!0},focusTimout:{initialValue:0},tooltipFollowsMouse:{initialValue:!0}}),t.MouseHandler=c;})),ace.define("ace/mouse/fold_handler",["require","exports","module"],(function(e,t,i){t.FoldHandler=function(e){e.on("click",(function(t){var i=t.getDocumentPosition(),n=e.session,s=n.getFoldAt(i.row,i.column,1);s&&(t.getAccelKey()?n.removeFold(s):n.expandFold(s),t.stop());})),e.on("gutterclick",(function(t){if("foldWidgets"==e.renderer.$gutterLayer.getRegion(t)){var i=t.getDocumentPosition().row,n=e.session;n.foldWidgets&&n.foldWidgets[i]&&e.session.onFoldWidgetClick(i,t),e.isFocused()||e.focus(),t.stop();}})),e.on("gutterdblclick",(function(t){if("foldWidgets"==e.renderer.$gutterLayer.getRegion(t)){var i=t.getDocumentPosition().row,n=e.session,s=n.getParentFoldRangeData(i,!0),o=s.range||s.firstRange;if(o){i=o.start.row;var r=n.getFoldAt(i,n.getLine(i).length,1);r?n.removeFold(r):(n.addFold("...",o),e.renderer.scrollCursorIntoView({row:o.start.row,column:0}));}t.stop();}}));};})),ace.define("ace/keyboard/keybinding",["require","exports","module","ace/lib/keys","ace/lib/event"],(function(e,t,i){var n=e("../lib/keys"),s=e("../lib/event"),o=function(e){this.$editor=e,this.$data={editor:e},this.$handlers=[],this.setDefaultHandler(e.commands);};((function(){this.setDefaultHandler=function(e){this.removeKeyboardHandler(this.$defaultHandler),this.$defaultHandler=e,this.addKeyboardHandler(e,0);},this.setKeyboardHandler=function(e){var t=this.$handlers;if(t[t.length-1]!=e){for(;t[t.length-1]&&t[t.length-1]!=this.$defaultHandler;)this.removeKeyboardHandler(t[t.length-1]);this.addKeyboardHandler(e,1);}},this.addKeyboardHandler=function(e,t){if(e){"function"!=typeof e||e.handleKeyboard||(e.handleKeyboard=e);var i=this.$handlers.indexOf(e);-1!=i&&this.$handlers.splice(i,1),null==t?this.$handlers.push(e):this.$handlers.splice(t,0,e),-1==i&&e.attach&&e.attach(this.$editor);}},this.removeKeyboardHandler=function(e){var t=this.$handlers.indexOf(e);return -1!=t&&(this.$handlers.splice(t,1),e.detach&&e.detach(this.$editor),!0)},this.getKeyboardHandler=function(){return this.$handlers[this.$handlers.length-1]},this.getStatusText=function(){var e=this.$data,t=e.editor;return this.$handlers.map((function(i){return i.getStatusText&&i.getStatusText(t,e)||""})).filter(Boolean).join(" ")},this.$callKeyboardHandlers=function(e,t,i,n){for(var o,r=!1,a=this.$editor.commands,l=this.$handlers.length;l--&&!((o=this.$handlers[l].handleKeyboard(this.$data,e,t,i,n))&&o.command&&((r="null"==o.command||a.exec(o.command,this.$editor,o.args,n))&&n&&-1!=e&&1!=o.passEvent&&1!=o.command.passEvent&&s.stopEvent(n),r)););return r||-1!=e||(o={command:"insertstring"},r=a.exec("insertstring",this.$editor,t)),r&&this.$editor._signal&&this.$editor._signal("keyboardActivity",o),r},this.onCommandKey=function(e,t,i){var s=n.keyCodeToString(i);this.$callKeyboardHandlers(t,s,i,e);},this.onTextInput=function(e){this.$callKeyboardHandlers(-1,e);};})).call(o.prototype),t.KeyBinding=o;})),ace.define("ace/lib/bidiutil",["require","exports","module"],(function(e,t,i){var n=0,s=0,o=!1,r=!1,a=!1,l=[[0,3,0,1,0,0,0],[0,3,0,1,2,2,0],[0,3,0,17,2,0,1],[0,3,5,5,4,1,0],[0,3,21,21,4,0,1],[0,3,5,5,4,2,0]],h=[[2,0,1,1,0,1,0],[2,0,1,1,0,2,0],[2,0,2,1,3,2,0],[2,0,2,33,3,1,1]],c=11,u=18,d=[u,u,u,u,u,u,u,u,u,6,5,6,8,5,u,u,u,u,u,u,u,u,u,u,u,u,u,u,5,5,5,6,8,4,4,c,c,c,4,4,4,4,4,10,9,10,9,9,2,2,2,2,2,2,2,2,2,2,9,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,u,u,u,u,u,u,5,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,9,4,c,c,c,c,4,4,4,4,0,4,4,u,4,4,c,c,2,2,4,0,4,4,4,2,0,4,4,4,4,4],g=[8,8,8,8,8,8,8,8,8,8,8,u,u,u,0,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,8,5,13,14,15,16,17,9,c,c,c,c,c,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,8];function f(e,t,i){if(!(s<e))if(1!=e||1!=n||r)for(var o,a,l,h,c=i.length,u=0;u<c;){if(t[u]>=e){for(o=u+1;o<c&&t[o]>=e;)o++;for(a=u,l=o-1;a<l;a++,l--)h=i[a],i[a]=i[l],i[l]=h;u=o;}u++;}else i.reverse();}function m(e,t,i,s){var l,h,d,g,f=t[s];switch(f){case 0:case 1:o=!1;case 4:case 3:return f;case 2:return o?3:2;case 7:return o=!0,1;case 8:return 4;case 9:return s<1||s+1>=t.length||2!=(l=i[s-1])&&3!=l||2!=(h=t[s+1])&&3!=h?4:(o&&(h=3),h==l?h:4);case 10:return 2==(l=s>0?i[s-1]:5)&&s+1<t.length&&2==t[s+1]?2:4;case c:if(s>0&&2==i[s-1])return 2;if(o)return 4;for(g=s+1,d=t.length;g<d&&t[g]==c;)g++;return g<d&&2==t[g]?2:4;case 12:for(d=t.length,g=s+1;g<d&&12==t[g];)g++;if(g<d){var m=e[s],p=m>=1425&&m<=2303||64286==m;if(l=t[g],p&&(1==l||7==l))return 1}return s<1||5==(l=t[s-1])?4:i[s-1];case 5:return o=!1,r=!0,n;case 6:return a=!0,4;case 13:case 14:case 16:case 17:case 15:o=!1;case u:return 4}}function p(e){var t=e.charCodeAt(0),i=t>>8;return 0==i?t>191?0:d[t]:5==i?/[\u0591-\u05f4]/.test(e)?1:0:6==i?/[\u0610-\u061a\u064b-\u065f\u06d6-\u06e4\u06e7-\u06ed]/.test(e)?12:/[\u0660-\u0669\u066b-\u066c]/.test(e)?3:1642==t?c:/[\u06f0-\u06f9]/.test(e)?2:7:32==i&&t<=8287?g[255&t]:254==i&&t>=65136?7:4}t.L=0,t.R=1,t.EN=2,t.ON_R=3,t.AN=4,t.R_H=5,t.B=6,t.DOT="·",t.doBidiReorder=function(e,i,c){if(e.length<2)return {};var d=e.split(""),g=new Array(d.length),A=new Array(d.length),C=[];n=c?1:0,function(e,t,i,c){var u=n?h:l,d=null,g=null,f=null,A=0,C=null,v=-1,F=null,w=null,E=[];if(!c)for(F=0,c=[];F<i;F++)c[F]=p(e[F]);for(s=n,o=!1,r=!1,a=!1,w=0;w<i;w++){if(d=A,E[w]=g=m(e,c,E,w),C=240&(A=u[d][g]),A&=15,t[w]=f=u[A][5],C>0)if(16==C){for(F=v;F<w;F++)t[F]=1;v=-1;}else v=-1;if(u[A][6])-1==v&&(v=w);else if(v>-1){for(F=v;F<w;F++)t[F]=f;v=-1;}5==c[w]&&(t[w]=0),s|=f;}if(a)for(F=0;F<i;F++)if(6==c[F]){t[F]=n;for(var b=F-1;b>=0&&8==c[b];b--)t[b]=n;}}(d,C,d.length,i);for(var v=0;v<g.length;g[v]=v,v++);f(2,C,g),f(1,C,g);for(v=0;v<g.length-1;v++)3===i[v]?C[v]=t.AN:1===C[v]&&(i[v]>7&&i[v]<13||4===i[v]||i[v]===u)?C[v]=t.ON_R:v>0&&"ل"===d[v-1]&&/\u0622|\u0623|\u0625|\u0627/.test(d[v])&&(C[v-1]=C[v]=t.R_H,v++);d[d.length-1]===t.DOT&&(C[d.length-1]=t.B);for(v=0;v<g.length;v++)A[v]=C[g[v]];return {logicalFromVisual:g,bidiLevels:A}},t.hasBidiCharacters=function(e,t){for(var i=!1,n=0;n<e.length;n++)t[n]=p(e.charAt(n)),i||1!=t[n]&&7!=t[n]||(i=!0);return i},t.getVisualFromLogicalIdx=function(e,t){for(var i=0;i<t.logicalFromVisual.length;i++)if(t.logicalFromVisual[i]==e)return i;return 0};})),ace.define("ace/bidihandler",["require","exports","module","ace/lib/bidiutil","ace/lib/lang","ace/lib/useragent"],(function(e,t,i){var n=e("./lib/bidiutil"),s=e("./lib/lang"),o=e("./lib/useragent"),r=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,a=function(e){this.session=e,this.bidiMap={},this.currentRow=null,this.bidiUtil=n,this.charWidths=[],this.EOL="¬",this.showInvisibles=!0,this.isRtlDir=!1,this.line="",this.wrapIndent=0,this.isLastRow=!1,this.EOF="¶",this.seenBidi=!1;};((function(){this.isBidiRow=function(e,t,i){return !!this.seenBidi&&(e!==this.currentRow&&(this.currentRow=e,this.updateRowLine(t,i),this.updateBidiMap()),this.bidiMap.bidiLevels)},this.onChange=function(e){this.seenBidi?this.currentRow=null:"insert"==e.action&&r.test(e.lines.join("\n"))&&(this.seenBidi=!0,this.currentRow=null);},this.getDocumentRow=function(){var e=0,t=this.session.$screenRowCache;if(t.length){var i=this.session.$getRowCacheIndex(t,this.currentRow);i>=0&&(e=this.session.$docRowCache[i]);}return e},this.getSplitIndex=function(){var e=0,t=this.session.$screenRowCache;if(t.length)for(var i,n=this.session.$getRowCacheIndex(t,this.currentRow);this.currentRow-e>0&&(i=this.session.$getRowCacheIndex(t,this.currentRow-e-1))===n;)n=i,e++;return e},this.updateRowLine=function(e,t){if(void 0===e&&(e=this.getDocumentRow()),this.wrapIndent=0,this.isLastRow=e===this.session.getLength()-1,this.line=this.session.getLine(e),this.session.$useWrapMode){var i=this.session.$wrapData[e];i&&(void 0===t&&(t=this.getSplitIndex()),t>0&&i.length?(this.wrapIndent=i.indent,this.line=t<i.length?this.line.substring(i[t-1],i[i.length-1]):this.line.substring(i[i.length-1])):this.line=this.line.substring(0,i[t]));}var o,r=this.session,a=0;this.line=this.line.replace(/\t|[\u1100-\u2029, \u202F-\uFFE6]/g,(function(e,t){return "\t"===e||r.isFullWidth(e.charCodeAt(0))?(o="\t"===e?r.getScreenTabSize(t+a):2,a+=o-1,s.stringRepeat(n.DOT,o)):e}));},this.updateBidiMap=function(){var e=[],t=this.isLastRow?this.EOF:this.EOL,i=this.line+(this.showInvisibles?t:n.DOT);n.hasBidiCharacters(i,e)?this.bidiMap=n.doBidiReorder(i,e,this.isRtlDir):this.bidiMap={};},this.markAsDirty=function(){this.currentRow=null;},this.updateCharacterWidths=function(e){if(this.seenBidi&&this.characterWidth!==e.$characterSize.width){var t=this.characterWidth=e.$characterSize.width,i=e.$measureCharWidth("ה");this.charWidths[n.L]=this.charWidths[n.EN]=this.charWidths[n.ON_R]=t,this.charWidths[n.R]=this.charWidths[n.AN]=i,this.charWidths[n.R_H]=o.isChrome?i:.45*i,this.charWidths[n.B]=0,this.currentRow=null;}},this.getShowInvisibles=function(){return this.showInvisibles},this.setShowInvisibles=function(e){this.showInvisibles=e,this.currentRow=null;},this.setEolChar=function(e){this.EOL=e;},this.setTextDir=function(e){this.isRtlDir=e;},this.getPosLeft=function(e){e-=this.wrapIndent;var t=n.getVisualFromLogicalIdx(e>0?e-1:0,this.bidiMap),i=this.bidiMap.bidiLevels,s=0;0===e&&i[t]%2!=0&&t++;for(var o=0;o<t;o++)s+=this.charWidths[i[o]];return 0!==e&&i[t]%2==0&&(s+=this.charWidths[i[t]]),this.wrapIndent&&(s+=this.wrapIndent*this.charWidths[n.L]),s},this.getSelections=function(e,t){for(var i,s,o=this.bidiMap,r=o.bidiLevels,a=this.wrapIndent*this.charWidths[n.L],l=[],h=Math.min(e,t)-this.wrapIndent,c=Math.max(e,t)-this.wrapIndent,u=!1,d=!1,g=0,f=0;f<r.length;f++)s=o.logicalFromVisual[f],i=r[f],(u=s>=h&&s<c)&&!d?g=a:!u&&d&&l.push({left:g,width:a-g}),a+=this.charWidths[i],d=u;return u&&f===r.length&&l.push({left:g,width:a-g}),l},this.offsetToCol=function(e){var t=0,i=(e=Math.max(e,0),0),s=0,o=this.bidiMap.bidiLevels,r=this.charWidths[o[s]];for(this.wrapIndent&&(e-=this.wrapIndent*this.charWidths[n.L]);e>i+r/2;){if(i+=r,s===o.length-1){r=0;break}r=this.charWidths[o[++s]];}return s>0&&o[s-1]%2!=0&&o[s]%2==0?(e<i&&s--,t=this.bidiMap.logicalFromVisual[s]):s>0&&o[s-1]%2==0&&o[s]%2!=0?t=1+(e>i?this.bidiMap.logicalFromVisual[s]:this.bidiMap.logicalFromVisual[s-1]):this.isRtlDir&&s===o.length-1&&0===r&&o[s-1]%2==0||!this.isRtlDir&&0===s&&o[s]%2!=0?t=1+this.bidiMap.logicalFromVisual[s]:(s>0&&o[s-1]%2!=0&&0!==r&&s--,t=this.bidiMap.logicalFromVisual[s]),t+this.wrapIndent};})).call(a.prototype),t.BidiHandler=a;})),ace.define("ace/range",["require","exports","module"],(function(e,t,i){var n=function(e,t,i,n){this.start={row:e,column:t},this.end={row:i,column:n};};((function(){this.isEqual=function(e){return this.start.row===e.start.row&&this.end.row===e.end.row&&this.start.column===e.start.column&&this.end.column===e.end.column},this.toString=function(){return "Range: ["+this.start.row+"/"+this.start.column+"] -> ["+this.end.row+"/"+this.end.column+"]"},this.contains=function(e,t){return 0==this.compare(e,t)},this.compareRange=function(e){var t,i=e.end,n=e.start;return 1==(t=this.compare(i.row,i.column))?1==(t=this.compare(n.row,n.column))?2:0==t?1:0:-1==t?-2:-1==(t=this.compare(n.row,n.column))?-1:1==t?42:0},this.comparePoint=function(e){return this.compare(e.row,e.column)},this.containsRange=function(e){return 0==this.comparePoint(e.start)&&0==this.comparePoint(e.end)},this.intersects=function(e){var t=this.compareRange(e);return -1==t||0==t||1==t},this.isEnd=function(e,t){return this.end.row==e&&this.end.column==t},this.isStart=function(e,t){return this.start.row==e&&this.start.column==t},this.setStart=function(e,t){"object"==typeof e?(this.start.column=e.column,this.start.row=e.row):(this.start.row=e,this.start.column=t);},this.setEnd=function(e,t){"object"==typeof e?(this.end.column=e.column,this.end.row=e.row):(this.end.row=e,this.end.column=t);},this.inside=function(e,t){return 0==this.compare(e,t)&&(!this.isEnd(e,t)&&!this.isStart(e,t))},this.insideStart=function(e,t){return 0==this.compare(e,t)&&!this.isEnd(e,t)},this.insideEnd=function(e,t){return 0==this.compare(e,t)&&!this.isStart(e,t)},this.compare=function(e,t){return this.isMultiLine()||e!==this.start.row?e<this.start.row?-1:e>this.end.row?1:this.start.row===e?t>=this.start.column?0:-1:this.end.row===e?t<=this.end.column?0:1:0:t<this.start.column?-1:t>this.end.column?1:0},this.compareStart=function(e,t){return this.start.row==e&&this.start.column==t?-1:this.compare(e,t)},this.compareEnd=function(e,t){return this.end.row==e&&this.end.column==t?1:this.compare(e,t)},this.compareInside=function(e,t){return this.end.row==e&&this.end.column==t?1:this.start.row==e&&this.start.column==t?-1:this.compare(e,t)},this.clipRows=function(e,t){if(this.end.row>t)var i={row:t+1,column:0};else if(this.end.row<e)i={row:e,column:0};if(this.start.row>t)var s={row:t+1,column:0};else if(this.start.row<e)s={row:e,column:0};return n.fromPoints(s||this.start,i||this.end)},this.extend=function(e,t){var i=this.compare(e,t);if(0==i)return this;if(-1==i)var s={row:e,column:t};else var o={row:e,column:t};return n.fromPoints(s||this.start,o||this.end)},this.isEmpty=function(){return this.start.row===this.end.row&&this.start.column===this.end.column},this.isMultiLine=function(){return this.start.row!==this.end.row},this.clone=function(){return n.fromPoints(this.start,this.end)},this.collapseRows=function(){return 0==this.end.column?new n(this.start.row,0,Math.max(this.start.row,this.end.row-1),0):new n(this.start.row,0,this.end.row,0)},this.toScreenRange=function(e){var t=e.documentToScreenPosition(this.start),i=e.documentToScreenPosition(this.end);return new n(t.row,t.column,i.row,i.column)},this.moveBy=function(e,t){this.start.row+=e,this.start.column+=t,this.end.row+=e,this.end.column+=t;};})).call(n.prototype),n.fromPoints=function(e,t){return new n(e.row,e.column,t.row,t.column)},n.comparePoints=function(e,t){return e.row-t.row||e.column-t.column},n.comparePoints=function(e,t){return e.row-t.row||e.column-t.column},t.Range=n;})),ace.define("ace/selection",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/lib/event_emitter","ace/range"],(function(e,t,i){var n=e("./lib/oop"),s=e("./lib/lang"),o=e("./lib/event_emitter").EventEmitter,r=e("./range").Range,a=function(e){this.session=e,this.doc=e.getDocument(),this.clearSelection(),this.lead=this.selectionLead=this.doc.createAnchor(0,0),this.anchor=this.selectionAnchor=this.doc.createAnchor(0,0);var t=this;this.lead.on("change",(function(e){t._emit("changeCursor"),t.$isEmpty||t._emit("changeSelection"),t.$keepDesiredColumnOnChange||e.old.column==e.value.column||(t.$desiredColumn=null);})),this.selectionAnchor.on("change",(function(){t.$isEmpty||t._emit("changeSelection");}));};((function(){n.implement(this,o),this.isEmpty=function(){return this.$isEmpty||this.anchor.row==this.lead.row&&this.anchor.column==this.lead.column},this.isMultiLine=function(){return !this.isEmpty()&&this.getRange().isMultiLine()},this.getCursor=function(){return this.lead.getPosition()},this.setSelectionAnchor=function(e,t){this.anchor.setPosition(e,t),this.$isEmpty&&(this.$isEmpty=!1,this._emit("changeSelection"));},this.getSelectionAnchor=function(){return this.$isEmpty?this.getSelectionLead():this.anchor.getPosition()},this.getSelectionLead=function(){return this.lead.getPosition()},this.shiftSelection=function(e){if(this.$isEmpty)this.moveCursorTo(this.lead.row,this.lead.column+e);else {var t=this.getSelectionAnchor(),i=this.getSelectionLead(),n=this.isBackwards();n&&0===t.column||this.setSelectionAnchor(t.row,t.column+e),(n||0!==i.column)&&this.$moveSelection((function(){this.moveCursorTo(i.row,i.column+e);}));}},this.isBackwards=function(){var e=this.anchor,t=this.lead;return e.row>t.row||e.row==t.row&&e.column>t.column},this.getRange=function(){var e=this.anchor,t=this.lead;return this.isEmpty()?r.fromPoints(t,t):this.isBackwards()?r.fromPoints(t,e):r.fromPoints(e,t)},this.clearSelection=function(){this.$isEmpty||(this.$isEmpty=!0,this._emit("changeSelection"));},this.selectAll=function(){var e=this.doc.getLength()-1;this.setSelectionAnchor(0,0),this.moveCursorTo(e,this.doc.getLine(e).length);},this.setRange=this.setSelectionRange=function(e,t){t?(this.setSelectionAnchor(e.end.row,e.end.column),this.selectTo(e.start.row,e.start.column)):(this.setSelectionAnchor(e.start.row,e.start.column),this.selectTo(e.end.row,e.end.column)),this.getRange().isEmpty()&&(this.$isEmpty=!0),this.$desiredColumn=null;},this.$moveSelection=function(e){var t=this.lead;this.$isEmpty&&this.setSelectionAnchor(t.row,t.column),e.call(this);},this.selectTo=function(e,t){this.$moveSelection((function(){this.moveCursorTo(e,t);}));},this.selectToPosition=function(e){this.$moveSelection((function(){this.moveCursorToPosition(e);}));},this.moveTo=function(e,t){this.clearSelection(),this.moveCursorTo(e,t);},this.moveToPosition=function(e){this.clearSelection(),this.moveCursorToPosition(e);},this.selectUp=function(){this.$moveSelection(this.moveCursorUp);},this.selectDown=function(){this.$moveSelection(this.moveCursorDown);},this.selectRight=function(){this.$moveSelection(this.moveCursorRight);},this.selectLeft=function(){this.$moveSelection(this.moveCursorLeft);},this.selectLineStart=function(){this.$moveSelection(this.moveCursorLineStart);},this.selectLineEnd=function(){this.$moveSelection(this.moveCursorLineEnd);},this.selectFileEnd=function(){this.$moveSelection(this.moveCursorFileEnd);},this.selectFileStart=function(){this.$moveSelection(this.moveCursorFileStart);},this.selectWordRight=function(){this.$moveSelection(this.moveCursorWordRight);},this.selectWordLeft=function(){this.$moveSelection(this.moveCursorWordLeft);},this.getWordRange=function(e,t){if(void 0===t){var i=e||this.lead;e=i.row,t=i.column;}return this.session.getWordRange(e,t)},this.selectWord=function(){this.setSelectionRange(this.getWordRange());},this.selectAWord=function(){var e=this.getCursor(),t=this.session.getAWordRange(e.row,e.column);this.setSelectionRange(t);},this.getLineRange=function(e,t){var i,n="number"==typeof e?e:this.lead.row,s=this.session.getFoldLine(n);return s?(n=s.start.row,i=s.end.row):i=n,!0===t?new r(n,0,i,this.session.getLine(i).length):new r(n,0,i+1,0)},this.selectLine=function(){this.setSelectionRange(this.getLineRange());},this.moveCursorUp=function(){this.moveCursorBy(-1,0);},this.moveCursorDown=function(){this.moveCursorBy(1,0);},this.wouldMoveIntoSoftTab=function(e,t,i){var n=e.column,s=e.column+t;return i<0&&(n=e.column-t,s=e.column),this.session.isTabStop(e)&&this.doc.getLine(e.row).slice(n,s).split(" ").length-1==t},this.moveCursorLeft=function(){var e,t=this.lead.getPosition();if(e=this.session.getFoldAt(t.row,t.column,-1))this.moveCursorTo(e.start.row,e.start.column);else if(0===t.column)t.row>0&&this.moveCursorTo(t.row-1,this.doc.getLine(t.row-1).length);else {var i=this.session.getTabSize();this.wouldMoveIntoSoftTab(t,i,-1)&&!this.session.getNavigateWithinSoftTabs()?this.moveCursorBy(0,-i):this.moveCursorBy(0,-1);}},this.moveCursorRight=function(){var e,t=this.lead.getPosition();if(e=this.session.getFoldAt(t.row,t.column,1))this.moveCursorTo(e.end.row,e.end.column);else if(this.lead.column==this.doc.getLine(this.lead.row).length)this.lead.row<this.doc.getLength()-1&&this.moveCursorTo(this.lead.row+1,0);else {var i=this.session.getTabSize();t=this.lead;this.wouldMoveIntoSoftTab(t,i,1)&&!this.session.getNavigateWithinSoftTabs()?this.moveCursorBy(0,i):this.moveCursorBy(0,1);}},this.moveCursorLineStart=function(){var e=this.lead.row,t=this.lead.column,i=this.session.documentToScreenRow(e,t),n=this.session.screenToDocumentPosition(i,0),s=this.session.getDisplayLine(e,null,n.row,n.column).match(/^\s*/);s[0].length==t||this.session.$useEmacsStyleLineStart||(n.column+=s[0].length),this.moveCursorToPosition(n);},this.moveCursorLineEnd=function(){var e=this.lead,t=this.session.getDocumentLastRowColumnPosition(e.row,e.column);if(this.lead.column==t.column){var i=this.session.getLine(t.row);if(t.column==i.length){var n=i.search(/\s+$/);n>0&&(t.column=n);}}this.moveCursorTo(t.row,t.column);},this.moveCursorFileEnd=function(){var e=this.doc.getLength()-1,t=this.doc.getLine(e).length;this.moveCursorTo(e,t);},this.moveCursorFileStart=function(){this.moveCursorTo(0,0);},this.moveCursorLongWordRight=function(){var e=this.lead.row,t=this.lead.column,i=this.doc.getLine(e),n=i.substring(t);this.session.nonTokenRe.lastIndex=0,this.session.tokenRe.lastIndex=0;var s=this.session.getFoldAt(e,t,1);if(s)this.moveCursorTo(s.end.row,s.end.column);else {if(this.session.nonTokenRe.exec(n)&&(t+=this.session.nonTokenRe.lastIndex,this.session.nonTokenRe.lastIndex=0,n=i.substring(t)),t>=i.length)return this.moveCursorTo(e,i.length),this.moveCursorRight(),void(e<this.doc.getLength()-1&&this.moveCursorWordRight());this.session.tokenRe.exec(n)&&(t+=this.session.tokenRe.lastIndex,this.session.tokenRe.lastIndex=0),this.moveCursorTo(e,t);}},this.moveCursorLongWordLeft=function(){var e,t=this.lead.row,i=this.lead.column;if(e=this.session.getFoldAt(t,i,-1))this.moveCursorTo(e.start.row,e.start.column);else {var n=this.session.getFoldStringAt(t,i,-1);null==n&&(n=this.doc.getLine(t).substring(0,i));var o=s.stringReverse(n);if(this.session.nonTokenRe.lastIndex=0,this.session.tokenRe.lastIndex=0,this.session.nonTokenRe.exec(o)&&(i-=this.session.nonTokenRe.lastIndex,o=o.slice(this.session.nonTokenRe.lastIndex),this.session.nonTokenRe.lastIndex=0),i<=0)return this.moveCursorTo(t,0),this.moveCursorLeft(),void(t>0&&this.moveCursorWordLeft());this.session.tokenRe.exec(o)&&(i-=this.session.tokenRe.lastIndex,this.session.tokenRe.lastIndex=0),this.moveCursorTo(t,i);}},this.$shortWordEndIndex=function(e){var t,i=0,n=/\s/,s=this.session.tokenRe;if(s.lastIndex=0,this.session.tokenRe.exec(e))i=this.session.tokenRe.lastIndex;else {for(;(t=e[i])&&n.test(t);)i++;if(i<1)for(s.lastIndex=0;(t=e[i])&&!s.test(t);)if(s.lastIndex=0,i++,n.test(t)){if(i>2){i--;break}for(;(t=e[i])&&n.test(t);)i++;if(i>2)break}}return s.lastIndex=0,i},this.moveCursorShortWordRight=function(){var e=this.lead.row,t=this.lead.column,i=this.doc.getLine(e),n=i.substring(t),s=this.session.getFoldAt(e,t,1);if(s)return this.moveCursorTo(s.end.row,s.end.column);if(t==i.length){var o=this.doc.getLength();do{e++,n=this.doc.getLine(e);}while(e<o&&/^\s*$/.test(n));/^\s+/.test(n)||(n=""),t=0;}var r=this.$shortWordEndIndex(n);this.moveCursorTo(e,t+r);},this.moveCursorShortWordLeft=function(){var e,t=this.lead.row,i=this.lead.column;if(e=this.session.getFoldAt(t,i,-1))return this.moveCursorTo(e.start.row,e.start.column);var n=this.session.getLine(t).substring(0,i);if(0===i){do{t--,n=this.doc.getLine(t);}while(t>0&&/^\s*$/.test(n));i=n.length,/\s+$/.test(n)||(n="");}var o=s.stringReverse(n),r=this.$shortWordEndIndex(o);return this.moveCursorTo(t,i-r)},this.moveCursorWordRight=function(){this.session.$selectLongWords?this.moveCursorLongWordRight():this.moveCursorShortWordRight();},this.moveCursorWordLeft=function(){this.session.$selectLongWords?this.moveCursorLongWordLeft():this.moveCursorShortWordLeft();},this.moveCursorBy=function(e,t){var i,n=this.session.documentToScreenPosition(this.lead.row,this.lead.column);0===t&&(0!==e&&(this.session.$bidiHandler.isBidiRow(n.row,this.lead.row)?(i=this.session.$bidiHandler.getPosLeft(n.column),n.column=Math.round(i/this.session.$bidiHandler.charWidths[0])):i=n.column*this.session.$bidiHandler.charWidths[0]),this.$desiredColumn?n.column=this.$desiredColumn:this.$desiredColumn=n.column);var s=this.session.screenToDocumentPosition(n.row+e,n.column,i);0!==e&&0===t&&s.row===this.lead.row&&s.column===this.lead.column&&this.session.lineWidgets&&this.session.lineWidgets[s.row]&&(s.row>0||e>0)&&s.row++,this.moveCursorTo(s.row,s.column+t,0===t);},this.moveCursorToPosition=function(e){this.moveCursorTo(e.row,e.column);},this.moveCursorTo=function(e,t,i){var n=this.session.getFoldAt(e,t,1);n&&(e=n.start.row,t=n.start.column),this.$keepDesiredColumnOnChange=!0;var s=this.session.getLine(e);/[\uDC00-\uDFFF]/.test(s.charAt(t))&&s.charAt(t-1)&&(this.lead.row==e&&this.lead.column==t+1?t-=1:t+=1),this.lead.setPosition(e,t),this.$keepDesiredColumnOnChange=!1,i||(this.$desiredColumn=null);},this.moveCursorToScreen=function(e,t,i){var n=this.session.screenToDocumentPosition(e,t);this.moveCursorTo(n.row,n.column,i);},this.detach=function(){this.lead.detach(),this.anchor.detach(),this.session=this.doc=null;},this.fromOrientedRange=function(e){this.setSelectionRange(e,e.cursor==e.start),this.$desiredColumn=e.desiredColumn||this.$desiredColumn;},this.toOrientedRange=function(e){var t=this.getRange();return e?(e.start.column=t.start.column,e.start.row=t.start.row,e.end.column=t.end.column,e.end.row=t.end.row):e=t,e.cursor=this.isBackwards()?e.start:e.end,e.desiredColumn=this.$desiredColumn,e},this.getRangeOfMovements=function(e){var t=this.getCursor();try{e(this);var i=this.getCursor();return r.fromPoints(t,i)}catch(e){return r.fromPoints(t,t)}finally{this.moveCursorToPosition(t);}},this.toJSON=function(){if(this.rangeCount)var e=this.ranges.map((function(e){var t=e.clone();return t.isBackwards=e.cursor==e.start,t}));else (e=this.getRange()).isBackwards=this.isBackwards();return e},this.fromJSON=function(e){if(null==e.start){if(this.rangeList){this.toSingleRange(e[0]);for(var t=e.length;t--;){var i=r.fromPoints(e[t].start,e[t].end);e[t].isBackwards&&(i.cursor=i.start),this.addRange(i,!0);}return}e=e[0];}this.rangeList&&this.toSingleRange(e),this.setSelectionRange(e,e.isBackwards);},this.isEqual=function(e){if((e.length||this.rangeCount)&&e.length!=this.rangeCount)return !1;if(!e.length||!this.ranges)return this.getRange().isEqual(e);for(var t=this.ranges.length;t--;)if(!this.ranges[t].isEqual(e[t]))return !1;return !0};})).call(a.prototype),t.Selection=a;})),ace.define("ace/tokenizer",["require","exports","module","ace/config"],(function(e,t,i){var n=e("./config"),s=2e3,o=function(e){for(var t in this.states=e,this.regExps={},this.matchMappings={},this.states){for(var i=this.states[t],n=[],s=0,o=this.matchMappings[t]={defaultToken:"text"},r="g",a=[],l=0;l<i.length;l++){var h=i[l];if(h.defaultToken&&(o.defaultToken=h.defaultToken),h.caseInsensitive&&(r="gi"),null!=h.regex){h.regex instanceof RegExp&&(h.regex=h.regex.toString().slice(1,-1));var c=h.regex,u=new RegExp("(?:("+c+")|(.))").exec("a").length-2;Array.isArray(h.token)?1==h.token.length||1==u?h.token=h.token[0]:u-1!=h.token.length?(this.reportError("number of classes and regexp groups doesn't match",{rule:h,groupCount:u-1}),h.token=h.token[0]):(h.tokenArray=h.token,h.token=null,h.onMatch=this.$arrayTokens):"function"!=typeof h.token||h.onMatch||(h.onMatch=u>1?this.$applyToken:h.token),u>1&&(/\\\d/.test(h.regex)?c=h.regex.replace(/\\([0-9]+)/g,(function(e,t){return "\\"+(parseInt(t,10)+s+1)})):(u=1,c=this.removeCapturingGroups(h.regex)),h.splitRegex||"string"==typeof h.token||a.push(h)),o[s]=l,s+=u,n.push(c),h.onMatch||(h.onMatch=null);}}n.length||(o[0]=0,n.push("$")),a.forEach((function(e){e.splitRegex=this.createSplitterRegexp(e.regex,r);}),this),this.regExps[t]=new RegExp("("+n.join(")|(")+")|($)",r);}};((function(){this.$setMaxTokenCount=function(e){s=0|e;},this.$applyToken=function(e){var t=this.splitRegex.exec(e).slice(1),i=this.token.apply(this,t);if("string"==typeof i)return [{type:i,value:e}];for(var n=[],s=0,o=i.length;s<o;s++)t[s]&&(n[n.length]={type:i[s],value:t[s]});return n},this.$arrayTokens=function(e){if(!e)return [];var t=this.splitRegex.exec(e);if(!t)return "text";for(var i=[],n=this.tokenArray,s=0,o=n.length;s<o;s++)t[s+1]&&(i[i.length]={type:n[s],value:t[s+1]});return i},this.removeCapturingGroups=function(e){return e.replace(/\[(?:\\.|[^\]])*?\]|\\.|\(\?[:=!]|(\()/g,(function(e,t){return t?"(?:":e}))},this.createSplitterRegexp=function(e,t){if(-1!=e.indexOf("(?=")){var i=0,n=!1,s={};e.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g,(function(e,t,o,r,a,l){return n?n="]"!=a:a?n=!0:r?(i==s.stack&&(s.end=l+1,s.stack=-1),i--):o&&(i++,1!=o.length&&(s.stack=i,s.start=l)),e})),null!=s.end&&/^\)*$/.test(e.substr(s.end))&&(e=e.substring(0,s.start)+e.substr(s.end));}return "^"!=e.charAt(0)&&(e="^"+e),"$"!=e.charAt(e.length-1)&&(e+="$"),new RegExp(e,(t||"").replace("g",""))},this.getLineTokens=function(e,t){if(t&&"string"!=typeof t){var i=t.slice(0);"#tmp"===(t=i[0])&&(i.shift(),t=i.shift());}else i=[];var n=t||"start",o=this.states[n];o||(n="start",o=this.states[n]);var r=this.matchMappings[n],a=this.regExps[n];a.lastIndex=0;for(var l,h=[],c=0,u=0,d={type:null,value:""};l=a.exec(e);){var g=r.defaultToken,f=null,m=l[0],p=a.lastIndex;if(p-m.length>c){var A=e.substring(c,p-m.length);d.type==g?d.value+=A:(d.type&&h.push(d),d={type:g,value:A});}for(var C=0;C<l.length-2;C++)if(void 0!==l[C+1]){g=(f=o[r[C]]).onMatch?f.onMatch(m,n,i,e):f.token,f.next&&(n="string"==typeof f.next?f.next:f.next(n,i),(o=this.states[n])||(this.reportError("state doesn't exist",n),n="start",o=this.states[n]),r=this.matchMappings[n],c=p,(a=this.regExps[n]).lastIndex=p),f.consumeLineEnd&&(c=p);break}if(m)if("string"==typeof g)f&&!1===f.merge||d.type!==g?(d.type&&h.push(d),d={type:g,value:m}):d.value+=m;else if(g){d.type&&h.push(d),d={type:null,value:""};for(C=0;C<g.length;C++)h.push(g[C]);}if(c==e.length)break;if(c=p,u++>s){for(u>2*e.length&&this.reportError("infinite loop with in ace tokenizer",{startState:t,line:e});c<e.length;)d.type&&h.push(d),d={value:e.substring(c,c+=2e3),type:"overflow"};n="start",i=[];break}}return d.type&&h.push(d),i.length>1&&i[0]!==n&&i.unshift("#tmp",n),{tokens:h,state:i.length?i:n}},this.reportError=n.reportError;})).call(o.prototype),t.Tokenizer=o;})),ace.define("ace/mode/text_highlight_rules",["require","exports","module","ace/lib/lang"],(function(e,t,i){var n=e("../lib/lang"),s=function(){this.$rules={start:[{token:"empty_line",regex:"^$"},{defaultToken:"text"}]};};((function(){this.addRules=function(e,t){if(t)for(var i in e){for(var n=e[i],s=0;s<n.length;s++){var o=n[s];(o.next||o.onMatch)&&("string"==typeof o.next&&0!==o.next.indexOf(t)&&(o.next=t+o.next),o.nextState&&0!==o.nextState.indexOf(t)&&(o.nextState=t+o.nextState));}this.$rules[t+i]=n;}else for(var i in e)this.$rules[i]=e[i];},this.getRules=function(){return this.$rules},this.embedRules=function(e,t,i,s,o){var r="function"==typeof e?(new e).getRules():e;if(s)for(var a=0;a<s.length;a++)s[a]=t+s[a];else for(var l in s=[],r)s.push(t+l);if(this.addRules(r,t),i){var h=Array.prototype[o?"push":"unshift"];for(a=0;a<s.length;a++)h.apply(this.$rules[s[a]],n.deepCopy(i));}this.$embeds||(this.$embeds=[]),this.$embeds.push(t);},this.getEmbeds=function(){return this.$embeds};var e=function(e,t){return ("start"!=e||t.length)&&t.unshift(this.nextState,e),this.nextState},t=function(e,t){return t.shift(),t.shift()||"start"};this.normalizeRules=function(){var i=0,n=this.$rules;Object.keys(n).forEach((function s(o){var r=n[o];r.processed=!0;for(var a=0;a<r.length;a++){var l=r[a],h=null;Array.isArray(l)&&(h=l,l={}),!l.regex&&l.start&&(l.regex=l.start,l.next||(l.next=[]),l.next.push({defaultToken:l.token},{token:l.token+".end",regex:l.end||l.start,next:"pop"}),l.token=l.token+".start",l.push=!0);var c=l.next||l.push;if(c&&Array.isArray(c)){var u=l.stateName;u||("string"!=typeof(u=l.token)&&(u=u[0]||""),n[u]&&(u+=i++)),n[u]=c,l.next=u,s(u);}else "pop"==c&&(l.next=t);if(l.push&&(l.nextState=l.next||l.push,l.next=e,delete l.push),l.rules)for(var d in l.rules)n[d]?n[d].push&&n[d].push.apply(n[d],l.rules[d]):n[d]=l.rules[d];var g="string"==typeof l?l:l.include;if(g&&(h=Array.isArray(g)?g.map((function(e){return n[e]})):n[g]),h){var f=[a,1].concat(h);l.noEscape&&(f=f.filter((function(e){return !e.next}))),r.splice.apply(r,f),a--;}l.keywordMap&&(l.token=this.createKeywordMapper(l.keywordMap,l.defaultToken||"text",l.caseInsensitive),delete l.defaultToken);}}),this);},this.createKeywordMapper=function(e,t,i,n){var s=Object.create(null);return Object.keys(e).forEach((function(t){var o=e[t];i&&(o=o.toLowerCase());for(var r=o.split(n||"|"),a=r.length;a--;)s[r[a]]=t;})),Object.getPrototypeOf(s)&&(s.__proto__=null),this.$keywordList=Object.keys(s),e=null,i?function(e){return s[e.toLowerCase()]||t}:function(e){return s[e]||t}},this.getKeywords=function(){return this.$keywords};})).call(s.prototype),t.TextHighlightRules=s;})),ace.define("ace/mode/behaviour",["require","exports","module"],(function(e,t,i){var n=function(){this.$behaviours={};};((function(){this.add=function(e,t,i){switch(void 0){case this.$behaviours:this.$behaviours={};case this.$behaviours[e]:this.$behaviours[e]={};}this.$behaviours[e][t]=i;},this.addBehaviours=function(e){for(var t in e)for(var i in e[t])this.add(t,i,e[t][i]);},this.remove=function(e){this.$behaviours&&this.$behaviours[e]&&delete this.$behaviours[e];},this.inherit=function(e,t){if("function"==typeof e)var i=(new e).getBehaviours(t);else i=e.getBehaviours(t);this.addBehaviours(i);},this.getBehaviours=function(e){if(e){for(var t={},i=0;i<e.length;i++)this.$behaviours[e[i]]&&(t[e[i]]=this.$behaviours[e[i]]);return t}return this.$behaviours};})).call(n.prototype),t.Behaviour=n;})),ace.define("ace/token_iterator",["require","exports","module","ace/range"],(function(e,t,i){var n=e("./range").Range,s=function(e,t,i){this.$session=e,this.$row=t,this.$rowTokens=e.getTokens(t);var n=e.getTokenAt(t,i);this.$tokenIndex=n?n.index:-1;};((function(){this.stepBackward=function(){for(this.$tokenIndex-=1;this.$tokenIndex<0;){if(this.$row-=1,this.$row<0)return this.$row=0,null;this.$rowTokens=this.$session.getTokens(this.$row),this.$tokenIndex=this.$rowTokens.length-1;}return this.$rowTokens[this.$tokenIndex]},this.stepForward=function(){var e;for(this.$tokenIndex+=1;this.$tokenIndex>=this.$rowTokens.length;){if(this.$row+=1,e||(e=this.$session.getLength()),this.$row>=e)return this.$row=e-1,null;this.$rowTokens=this.$session.getTokens(this.$row),this.$tokenIndex=0;}return this.$rowTokens[this.$tokenIndex]},this.getCurrentToken=function(){return this.$rowTokens[this.$tokenIndex]},this.getCurrentTokenRow=function(){return this.$row},this.getCurrentTokenColumn=function(){var e=this.$rowTokens,t=this.$tokenIndex,i=e[t].start;if(void 0!==i)return i;for(i=0;t>0;)i+=e[t-=1].value.length;return i},this.getCurrentTokenPosition=function(){return {row:this.$row,column:this.getCurrentTokenColumn()}},this.getCurrentTokenRange=function(){var e=this.$rowTokens[this.$tokenIndex],t=this.getCurrentTokenColumn();return new n(this.$row,t,this.$row,t+e.value.length)};})).call(s.prototype),t.TokenIterator=s;})),ace.define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"],(function(e,t,i){var n,s=e("../../lib/oop"),o=e("../behaviour").Behaviour,r=e("../../token_iterator").TokenIterator,a=e("../../lib/lang"),l=["text","paren.rparen","punctuation.operator"],h=["text","paren.rparen","punctuation.operator","comment"],c={},u={'"':'"',"'":"'"},d=function(e){var t=-1;if(e.multiSelect&&(t=e.selection.index,c.rangeCount!=e.multiSelect.rangeCount&&(c={rangeCount:e.multiSelect.rangeCount})),c[t])return n=c[t];n=c[t]={autoInsertedBrackets:0,autoInsertedRow:-1,autoInsertedLineEnd:"",maybeInsertedBrackets:0,maybeInsertedRow:-1,maybeInsertedLineStart:"",maybeInsertedLineEnd:""};},g=function(e,t,i,n){var s=e.end.row-e.start.row;return {text:i+t+n,selection:[0,e.start.column+1,s,e.end.column+(s?0:1)]}},f=function(e){this.add("braces","insertion",(function(t,i,s,o,r){var l=s.getCursorPosition(),h=o.doc.getLine(l.row);if("{"==r){d(s);var c=s.getSelectionRange(),u=o.doc.getTextRange(c);if(""!==u&&"{"!==u&&s.getWrapBehavioursEnabled())return g(c,u,"{","}");if(f.isSaneInsertion(s,o))return /[\]\}\)]/.test(h[l.column])||s.inMultiSelectMode||e&&e.braces?(f.recordAutoInsert(s,o,"}"),{text:"{}",selection:[1,1]}):(f.recordMaybeInsert(s,o,"{"),{text:"{",selection:[1,1]})}else if("}"==r){if(d(s),"}"==h.substring(l.column,l.column+1))if(null!==o.$findOpeningBracket("}",{column:l.column+1,row:l.row})&&f.isAutoInsertedClosing(l,h,r))return f.popAutoInsertedClosing(),{text:"",selection:[1,1]}}else {if("\n"==r||"\r\n"==r){d(s);var m="";if(f.isMaybeInsertedClosing(l,h)&&(m=a.stringRepeat("}",n.maybeInsertedBrackets),f.clearMaybeInsertedClosing()),"}"===h.substring(l.column,l.column+1)){var p=o.findMatchingBracket({row:l.row,column:l.column+1},"}");if(!p)return null;var A=this.$getIndent(o.getLine(p.row));}else {if(!m)return void f.clearMaybeInsertedClosing();A=this.$getIndent(h);}var C=A+o.getTabString();return {text:"\n"+C+"\n"+A+m,selection:[1,C.length,1,C.length]}}f.clearMaybeInsertedClosing();}})),this.add("braces","deletion",(function(e,t,i,s,o){var r=s.doc.getTextRange(o);if(!o.isMultiLine()&&"{"==r){if(d(i),"}"==s.doc.getLine(o.start.row).substring(o.end.column,o.end.column+1))return o.end.column++,o;n.maybeInsertedBrackets--;}})),this.add("parens","insertion",(function(e,t,i,n,s){if("("==s){d(i);var o=i.getSelectionRange(),r=n.doc.getTextRange(o);if(""!==r&&i.getWrapBehavioursEnabled())return g(o,r,"(",")");if(f.isSaneInsertion(i,n))return f.recordAutoInsert(i,n,")"),{text:"()",selection:[1,1]}}else if(")"==s){d(i);var a=i.getCursorPosition(),l=n.doc.getLine(a.row);if(")"==l.substring(a.column,a.column+1))if(null!==n.$findOpeningBracket(")",{column:a.column+1,row:a.row})&&f.isAutoInsertedClosing(a,l,s))return f.popAutoInsertedClosing(),{text:"",selection:[1,1]}}})),this.add("parens","deletion",(function(e,t,i,n,s){var o=n.doc.getTextRange(s);if(!s.isMultiLine()&&"("==o&&(d(i),")"==n.doc.getLine(s.start.row).substring(s.start.column+1,s.start.column+2)))return s.end.column++,s})),this.add("brackets","insertion",(function(e,t,i,n,s){if("["==s){d(i);var o=i.getSelectionRange(),r=n.doc.getTextRange(o);if(""!==r&&i.getWrapBehavioursEnabled())return g(o,r,"[","]");if(f.isSaneInsertion(i,n))return f.recordAutoInsert(i,n,"]"),{text:"[]",selection:[1,1]}}else if("]"==s){d(i);var a=i.getCursorPosition(),l=n.doc.getLine(a.row);if("]"==l.substring(a.column,a.column+1))if(null!==n.$findOpeningBracket("]",{column:a.column+1,row:a.row})&&f.isAutoInsertedClosing(a,l,s))return f.popAutoInsertedClosing(),{text:"",selection:[1,1]}}})),this.add("brackets","deletion",(function(e,t,i,n,s){var o=n.doc.getTextRange(s);if(!s.isMultiLine()&&"["==o&&(d(i),"]"==n.doc.getLine(s.start.row).substring(s.start.column+1,s.start.column+2)))return s.end.column++,s})),this.add("string_dquotes","insertion",(function(e,t,i,n,s){var o=n.$mode.$quotes||u;if(1==s.length&&o[s]){if(this.lineCommentStart&&-1!=this.lineCommentStart.indexOf(s))return;d(i);var r=s,a=i.getSelectionRange(),l=n.doc.getTextRange(a);if(!(""===l||1==l.length&&o[l])&&i.getWrapBehavioursEnabled())return g(a,l,r,r);if(!l){var h=i.getCursorPosition(),c=n.doc.getLine(h.row),f=c.substring(h.column-1,h.column),m=c.substring(h.column,h.column+1),p=n.getTokenAt(h.row,h.column),A=n.getTokenAt(h.row,h.column+1);if("\\"==f&&p&&/escape/.test(p.type))return null;var C,v=p&&/string|escape/.test(p.type),F=!A||/string|escape/.test(A.type);if(m==r)(C=v!==F)&&/string\.end/.test(A.type)&&(C=!1);else {if(v&&!F)return null;if(v&&F)return null;var w=n.$mode.tokenRe;w.lastIndex=0;var E=w.test(f);w.lastIndex=0;var b=w.test(f);if(E||b)return null;if(m&&!/[\s;,.})\]\\]/.test(m))return null;C=!0;}return {text:C?r+r:"",selection:[1,1]}}}})),this.add("string_dquotes","deletion",(function(e,t,i,n,s){var o=n.doc.getTextRange(s);if(!s.isMultiLine()&&('"'==o||"'"==o)&&(d(i),n.doc.getLine(s.start.row).substring(s.start.column+1,s.start.column+2)==o))return s.end.column++,s}));};f.isSaneInsertion=function(e,t){var i=e.getCursorPosition(),n=new r(t,i.row,i.column);if(!this.$matchTokenType(n.getCurrentToken()||"text",l)){var s=new r(t,i.row,i.column+1);if(!this.$matchTokenType(s.getCurrentToken()||"text",l))return !1}return n.stepForward(),n.getCurrentTokenRow()!==i.row||this.$matchTokenType(n.getCurrentToken()||"text",h)},f.$matchTokenType=function(e,t){return t.indexOf(e.type||e)>-1},f.recordAutoInsert=function(e,t,i){var s=e.getCursorPosition(),o=t.doc.getLine(s.row);this.isAutoInsertedClosing(s,o,n.autoInsertedLineEnd[0])||(n.autoInsertedBrackets=0),n.autoInsertedRow=s.row,n.autoInsertedLineEnd=i+o.substr(s.column),n.autoInsertedBrackets++;},f.recordMaybeInsert=function(e,t,i){var s=e.getCursorPosition(),o=t.doc.getLine(s.row);this.isMaybeInsertedClosing(s,o)||(n.maybeInsertedBrackets=0),n.maybeInsertedRow=s.row,n.maybeInsertedLineStart=o.substr(0,s.column)+i,n.maybeInsertedLineEnd=o.substr(s.column),n.maybeInsertedBrackets++;},f.isAutoInsertedClosing=function(e,t,i){return n.autoInsertedBrackets>0&&e.row===n.autoInsertedRow&&i===n.autoInsertedLineEnd[0]&&t.substr(e.column)===n.autoInsertedLineEnd},f.isMaybeInsertedClosing=function(e,t){return n.maybeInsertedBrackets>0&&e.row===n.maybeInsertedRow&&t.substr(e.column)===n.maybeInsertedLineEnd&&t.substr(0,e.column)==n.maybeInsertedLineStart},f.popAutoInsertedClosing=function(){n.autoInsertedLineEnd=n.autoInsertedLineEnd.substr(1),n.autoInsertedBrackets--;},f.clearMaybeInsertedClosing=function(){n&&(n.maybeInsertedBrackets=0,n.maybeInsertedRow=-1);},s.inherits(f,o),t.CstyleBehaviour=f;})),ace.define("ace/unicode",["require","exports","module"],(function(e,t,i){t.packages={},function(e){var i=/\w{4}/g;for(var n in e)t.packages[n]=e[n].replace(i,"\\u$&");}({L:"0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05250531-055605590561-058705D0-05EA05F0-05F20621-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280904-0939093D09500958-0961097109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510D0-10FA10FC1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209421022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2D00-2D252D30-2D652D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A65FA662-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78BA78CA7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",Ll:"0061-007A00AA00B500BA00DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F0521052305250561-05871D00-1D2B1D62-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7C2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2D00-2D25A641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CFB00-FB06FB13-FB17FF41-FF5A",Lu:"0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E0520052205240531-055610A0-10C51E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CEDA640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BFF21-FF3A",Lt:"01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",Lm:"02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D611D781D9B-1DBF2071207F2090-20942C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A9CFAA70AADDFF70FF9EFF9F",Lo:"01BB01C0-01C3029405D0-05EA05F0-05F20621-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150904-0939093D09500958-096109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF12135-21382D30-2D652D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",M:"0300-036F0483-04890591-05BD05BF05C105C205C405C505C70610-061A064B-065E067006D6-06DC06DE-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0900-0903093C093E-094E0951-0955096209630981-098309BC09BE-09C409C709C809CB-09CD09D709E209E30A01-0A030A3C0A3E-0A420A470A480A4B-0A4D0A510A700A710A750A81-0A830ABC0ABE-0AC50AC7-0AC90ACB-0ACD0AE20AE30B01-0B030B3C0B3E-0B440B470B480B4B-0B4D0B560B570B620B630B820BBE-0BC20BC6-0BC80BCA-0BCD0BD70C01-0C030C3E-0C440C46-0C480C4A-0C4D0C550C560C620C630C820C830CBC0CBE-0CC40CC6-0CC80CCA-0CCD0CD50CD60CE20CE30D020D030D3E-0D440D46-0D480D4A-0D4D0D570D620D630D820D830DCA0DCF-0DD40DD60DD8-0DDF0DF20DF30E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F3E0F3F0F71-0F840F860F870F90-0F970F99-0FBC0FC6102B-103E1056-1059105E-10601062-10641067-106D1071-10741082-108D108F109A-109D135F1712-17141732-1734175217531772177317B6-17D317DD180B-180D18A91920-192B1930-193B19B0-19C019C819C91A17-1A1B1A55-1A5E1A60-1A7C1A7F1B00-1B041B34-1B441B6B-1B731B80-1B821BA1-1BAA1C24-1C371CD0-1CD21CD4-1CE81CED1CF21DC0-1DE61DFD-1DFF20D0-20F02CEF-2CF12DE0-2DFF302A-302F3099309AA66F-A672A67CA67DA6F0A6F1A802A806A80BA823-A827A880A881A8B4-A8C4A8E0-A8F1A926-A92DA947-A953A980-A983A9B3-A9C0AA29-AA36AA43AA4CAA4DAA7BAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1ABE3-ABEAABECABEDFB1EFE00-FE0FFE20-FE26",Mn:"0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065E067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0900-0902093C0941-0948094D0951-095509620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F90-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135F1712-17141732-1734175217531772177317B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1DC0-1DE61DFD-1DFF20D0-20DC20E120E5-20F02CEF-2CF12DE0-2DFF302A-302F3099309AA66FA67CA67DA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",Mc:"0903093E-09400949-094C094E0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1C24-1C2B1C341C351CE11CF2A823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BABE3ABE4ABE6ABE7ABE9ABEAABEC",Me:"0488048906DE20DD-20E020E2-20E4A670-A672",N:"0030-003900B200B300B900BC-00BE0660-066906F0-06F907C0-07C90966-096F09E6-09EF09F4-09F90A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BF20C66-0C6F0C78-0C7E0CE6-0CEF0D66-0D750E50-0E590ED0-0ED90F20-0F331040-10491090-10991369-137C16EE-16F017E0-17E917F0-17F91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C5920702074-20792080-20892150-21822185-21892460-249B24EA-24FF2776-27932CFD30073021-30293038-303A3192-31953220-32293251-325F3280-328932B1-32BFA620-A629A6E6-A6EFA830-A835A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",Nd:"0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",Nl:"16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",No:"00B200B300B900BC-00BE09F4-09F90BF0-0BF20C78-0C7E0D70-0D750F2A-0F331369-137C17F0-17F920702074-20792080-20892150-215F21892460-249B24EA-24FF2776-27932CFD3192-31953220-32293251-325F3280-328932B1-32BFA830-A835",P:"0021-00230025-002A002C-002F003A003B003F0040005B-005D005F007B007D00A100AB00B700BB00BF037E0387055A-055F0589058A05BE05C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E0964096509700DF40E4F0E5A0E5B0F04-0F120F3A-0F3D0F850FD0-0FD4104A-104F10FB1361-13681400166D166E169B169C16EB-16ED1735173617D4-17D617D8-17DA1800-180A1944194519DE19DF1A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601C3B-1C3F1C7E1C7F1CD32010-20272030-20432045-20512053-205E207D207E208D208E2329232A2768-277527C527C627E6-27EF2983-299829D8-29DB29FC29FD2CF9-2CFC2CFE2CFF2E00-2E2E2E302E313001-30033008-30113014-301F3030303D30A030FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFABEBFD3EFD3FFE10-FE19FE30-FE52FE54-FE61FE63FE68FE6AFE6BFF01-FF03FF05-FF0AFF0C-FF0FFF1AFF1BFF1FFF20FF3B-FF3DFF3FFF5BFF5DFF5F-FF65",Pd:"002D058A05BE140018062010-20152E172E1A301C303030A0FE31FE32FE58FE63FF0D",Ps:"0028005B007B0F3A0F3C169B201A201E2045207D208D23292768276A276C276E27702772277427C527E627E827EA27EC27EE2983298529872989298B298D298F299129932995299729D829DA29FC2E222E242E262E283008300A300C300E3010301430163018301A301DFD3EFE17FE35FE37FE39FE3BFE3DFE3FFE41FE43FE47FE59FE5BFE5DFF08FF3BFF5BFF5FFF62",Pe:"0029005D007D0F3B0F3D169C2046207E208E232A2769276B276D276F27712773277527C627E727E927EB27ED27EF298429862988298A298C298E2990299229942996299829D929DB29FD2E232E252E272E293009300B300D300F3011301530173019301B301E301FFD3FFE18FE36FE38FE3AFE3CFE3EFE40FE42FE44FE48FE5AFE5CFE5EFF09FF3DFF5DFF60FF63",Pi:"00AB2018201B201C201F20392E022E042E092E0C2E1C2E20",Pf:"00BB2019201D203A2E032E052E0A2E0D2E1D2E21",Pc:"005F203F20402054FE33FE34FE4D-FE4FFF3F",Po:"0021-00230025-0027002A002C002E002F003A003B003F0040005C00A100B700BF037E0387055A-055F058905C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E0964096509700DF40E4F0E5A0E5B0F04-0F120F850FD0-0FD4104A-104F10FB1361-1368166D166E16EB-16ED1735173617D4-17D617D8-17DA1800-18051807-180A1944194519DE19DF1A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601C3B-1C3F1C7E1C7F1CD3201620172020-20272030-2038203B-203E2041-20432047-205120532055-205E2CF9-2CFC2CFE2CFF2E002E012E06-2E082E0B2E0E-2E162E182E192E1B2E1E2E1F2E2A-2E2E2E302E313001-3003303D30FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFABEBFE10-FE16FE19FE30FE45FE46FE49-FE4CFE50-FE52FE54-FE57FE5F-FE61FE68FE6AFE6BFF01-FF03FF05-FF07FF0AFF0CFF0EFF0FFF1AFF1BFF1FFF20FF3CFF61FF64FF65",S:"0024002B003C-003E005E0060007C007E00A2-00A900AC00AE-00B100B400B600B800D700F702C2-02C502D2-02DF02E5-02EB02ED02EF-02FF03750384038503F604820606-0608060B060E060F06E906FD06FE07F609F209F309FA09FB0AF10B700BF3-0BFA0C7F0CF10CF20D790E3F0F01-0F030F13-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F13601390-139917DB194019E0-19FF1B61-1B6A1B74-1B7C1FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE20442052207A-207C208A-208C20A0-20B8210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B2140-2144214A-214D214F2190-2328232B-23E82400-24262440-244A249C-24E92500-26CD26CF-26E126E326E8-26FF2701-27042706-2709270C-27272729-274B274D274F-27522756-275E2761-276727942798-27AF27B1-27BE27C0-27C427C7-27CA27CC27D0-27E527F0-29822999-29D729DC-29FB29FE-2B4C2B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F309B309C319031913196-319F31C0-31E33200-321E322A-32503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A700-A716A720A721A789A78AA828-A82BA836-A839AA77-AA79FB29FDFCFDFDFE62FE64-FE66FE69FF04FF0BFF1C-FF1EFF3EFF40FF5CFF5EFFE0-FFE6FFE8-FFEEFFFCFFFD",Sm:"002B003C-003E007C007E00AC00B100D700F703F60606-060820442052207A-207C208A-208C2140-2144214B2190-2194219A219B21A021A321A621AE21CE21CF21D221D421F4-22FF2308-230B23202321237C239B-23B323DC-23E125B725C125F8-25FF266F27C0-27C427C7-27CA27CC27D0-27E527F0-27FF2900-29822999-29D729DC-29FB29FE-2AFF2B30-2B442B47-2B4CFB29FE62FE64-FE66FF0BFF1C-FF1EFF5CFF5EFFE2FFE9-FFEC",Sc:"002400A2-00A5060B09F209F309FB0AF10BF90E3F17DB20A0-20B8A838FDFCFE69FF04FFE0FFE1FFE5FFE6",Sk:"005E006000A800AF00B400B802C2-02C502D2-02DF02E5-02EB02ED02EF-02FF0375038403851FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE309B309CA700-A716A720A721A789A78AFF3EFF40FFE3",So:"00A600A700A900AE00B000B60482060E060F06E906FD06FE07F609FA0B700BF3-0BF80BFA0C7F0CF10CF20D790F01-0F030F13-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F13601390-1399194019E0-19FF1B61-1B6A1B74-1B7C210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B214A214C214D214F2195-2199219C-219F21A121A221A421A521A7-21AD21AF-21CD21D021D121D321D5-21F32300-2307230C-231F2322-2328232B-237B237D-239A23B4-23DB23E2-23E82400-24262440-244A249C-24E92500-25B625B8-25C025C2-25F72600-266E2670-26CD26CF-26E126E326E8-26FF2701-27042706-2709270C-27272729-274B274D274F-27522756-275E2761-276727942798-27AF27B1-27BE2800-28FF2B00-2B2F2B452B462B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F319031913196-319F31C0-31E33200-321E322A-32503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A828-A82BA836A837A839AA77-AA79FDFDFFE4FFE8FFEDFFEEFFFCFFFD",Z:"002000A01680180E2000-200A20282029202F205F3000",Zs:"002000A01680180E2000-200A202F205F3000",Zl:"2028",Zp:"2029",C:"0000-001F007F-009F00AD03780379037F-0383038B038D03A20526-05300557055805600588058B-059005C8-05CF05EB-05EF05F5-0605061C061D0620065F06DD070E070F074B074C07B2-07BF07FB-07FF082E082F083F-08FF093A093B094F095609570973-097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF00AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B72-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D290D3A-0D3C0D450D490D4E-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EDE-0EFF0F480F6D-0F700F8C-0F8F0F980FBD0FCD0FD9-0FFF10C6-10CF10FD-10FF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B-135E137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17B417B517DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BAB-1BAD1BBA-1BFF1C38-1C3A1C4A-1C4C1C80-1CCF1CF3-1CFF1DE7-1DFC1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF200B-200F202A-202E2060-206F20722073208F2095-209F20B9-20CF20F1-20FF218A-218F23E9-23FF2427-243F244B-245F26CE26E226E4-26E727002705270A270B2728274C274E2753-2755275F27602795-279727B027BF27CB27CD-27CF2B4D-2B4F2B5A-2BFF2C2F2C5F2CF2-2CF82D26-2D2F2D66-2D6E2D70-2D7F2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E32-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31B8-31BF31E4-31EF321F32FF4DB6-4DBF9FCC-9FFFA48D-A48FA4C7-A4CFA62C-A63FA660A661A674-A67BA698-A69FA6F8-A6FFA78D-A7FAA82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAE0-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-F8FFFA2EFA2FFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBB2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFD-FF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFFBFFFEFFFF",Cc:"0000-001F007F-009F",Cf:"00AD0600-060306DD070F17B417B5200B-200F202A-202E2060-2064206A-206FFEFFFFF9-FFFB",Co:"E000-F8FF",Cs:"D800-DFFF",Cn:"03780379037F-0383038B038D03A20526-05300557055805600588058B-059005C8-05CF05EB-05EF05F5-05FF06040605061C061D0620065F070E074B074C07B2-07BF07FB-07FF082E082F083F-08FF093A093B094F095609570973-097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF00AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B72-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D290D3A-0D3C0D450D490D4E-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EDE-0EFF0F480F6D-0F700F8C-0F8F0F980FBD0FCD0FD9-0FFF10C6-10CF10FD-10FF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B-135E137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BAB-1BAD1BBA-1BFF1C38-1C3A1C4A-1C4C1C80-1CCF1CF3-1CFF1DE7-1DFC1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF2065-206920722073208F2095-209F20B9-20CF20F1-20FF218A-218F23E9-23FF2427-243F244B-245F26CE26E226E4-26E727002705270A270B2728274C274E2753-2755275F27602795-279727B027BF27CB27CD-27CF2B4D-2B4F2B5A-2BFF2C2F2C5F2CF2-2CF82D26-2D2F2D66-2D6E2D70-2D7F2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E32-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31B8-31BF31E4-31EF321F32FF4DB6-4DBF9FCC-9FFFA48D-A48FA4C7-A4CFA62C-A63FA660A661A674-A67BA698-A69FA6F8-A6FFA78D-A7FAA82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAE0-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-D7FFFA2EFA2FFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBB2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFDFEFEFF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFF8FFFEFFFF"});})),ace.define("ace/mode/text",["require","exports","module","ace/tokenizer","ace/mode/text_highlight_rules","ace/mode/behaviour/cstyle","ace/unicode","ace/lib/lang","ace/token_iterator","ace/range"],(function(e,t,i){var n=e("../tokenizer").Tokenizer,s=e("./text_highlight_rules").TextHighlightRules,o=e("./behaviour/cstyle").CstyleBehaviour,r=e("../unicode"),a=e("../lib/lang"),l=e("../token_iterator").TokenIterator,h=e("../range").Range,c=function(){this.HighlightRules=s;};((function(){this.$defaultBehaviour=new o,this.tokenRe=new RegExp("^["+r.packages.L+r.packages.Mn+r.packages.Mc+r.packages.Nd+r.packages.Pc+"\\$_]+","g"),this.nonTokenRe=new RegExp("^(?:[^"+r.packages.L+r.packages.Mn+r.packages.Mc+r.packages.Nd+r.packages.Pc+"\\$_]|\\s])+","g"),this.getTokenizer=function(){return this.$tokenizer||(this.$highlightRules=this.$highlightRules||new this.HighlightRules(this.$highlightRuleConfig),this.$tokenizer=new n(this.$highlightRules.getRules())),this.$tokenizer},this.lineCommentStart="",this.blockComment="",this.toggleCommentLines=function(e,t,i,n){var s=t.doc,o=!0,r=!0,l=1/0,h=t.getTabSize(),c=!1;if(this.lineCommentStart){if(Array.isArray(this.lineCommentStart))m=this.lineCommentStart.map(a.escapeRegExp).join("|"),g=this.lineCommentStart[0];else m=a.escapeRegExp(this.lineCommentStart),g=this.lineCommentStart;m=new RegExp("^(\\s*)(?:"+m+") ?"),c=t.getUseSoftTabs();C=function(e,t){var i=e.match(m);if(i){var n=i[1].length,o=i[0].length;d(e,n,o)||" "!=i[0][o-1]||o--,s.removeInLine(t,n,o);}};var u=g+" ",d=(A=function(e,t){o&&!/\S/.test(e)||(d(e,l,l)?s.insertInLine({row:t,column:l},u):s.insertInLine({row:t,column:l},g));},v=function(e,t){return m.test(e)},function(e,t,i){for(var n=0;t--&&" "==e.charAt(t);)n++;if(n%h!=0)return !1;for(n=0;" "==e.charAt(i++);)n++;return h>2?n%h!=h-1:n%h==0});}else {if(!this.blockComment)return !1;var g=this.blockComment.start,f=this.blockComment.end,m=new RegExp("^(\\s*)(?:"+a.escapeRegExp(g)+")"),p=new RegExp("(?:"+a.escapeRegExp(f)+")\\s*$"),A=function(e,t){v(e,t)||o&&!/\S/.test(e)||(s.insertInLine({row:t,column:e.length},f),s.insertInLine({row:t,column:l},g));},C=function(e,t){var i;(i=e.match(p))&&s.removeInLine(t,e.length-i[0].length,e.length),(i=e.match(m))&&s.removeInLine(t,i[1].length,i[0].length);},v=function(e,i){if(m.test(e))return !0;for(var n=t.getTokens(i),s=0;s<n.length;s++)if("comment"===n[s].type)return !0};}function F(e){for(var t=i;t<=n;t++)e(s.getLine(t),t);}var w=1/0;F((function(e,t){var i=e.search(/\S/);-1!==i?(i<l&&(l=i),r&&!v(e,t)&&(r=!1)):w>e.length&&(w=e.length);})),l==1/0&&(l=w,o=!1,r=!1),c&&l%h!=0&&(l=Math.floor(l/h)*h),F(r?C:A);},this.toggleBlockComment=function(e,t,i,n){var s=this.blockComment;if(s){!s.start&&s[0]&&(s=s[0]);var o=(m=new l(t,n.row,n.column)).getCurrentToken();t.selection;var r,a,c=t.selection.toOrientedRange();if(o&&/comment/.test(o.type)){for(var u,d;o&&/comment/.test(o.type);){if(-1!=(p=o.value.indexOf(s.start))){var g=m.getCurrentTokenRow(),f=m.getCurrentTokenColumn()+p;u=new h(g,f,g,f+s.start.length);break}o=m.stepBackward();}var m;for(o=(m=new l(t,n.row,n.column)).getCurrentToken();o&&/comment/.test(o.type);){var p;if(-1!=(p=o.value.indexOf(s.end))){g=m.getCurrentTokenRow(),f=m.getCurrentTokenColumn()+p;d=new h(g,f,g,f+s.end.length);break}o=m.stepForward();}d&&t.remove(d),u&&(t.remove(u),r=u.start.row,a=-s.start.length);}else a=s.start.length,r=i.start.row,t.insert(i.end,s.end),t.insert(i.start,s.start);c.start.row==r&&(c.start.column+=a),c.end.row==r&&(c.end.column+=a),t.selection.fromOrientedRange(c);}},this.getNextLineIndent=function(e,t,i){return this.$getIndent(t)},this.checkOutdent=function(e,t,i){return !1},this.autoOutdent=function(e,t,i){},this.$getIndent=function(e){return e.match(/^\s*/)[0]},this.createWorker=function(e){return null},this.createModeDelegates=function(e){for(var t in this.$embeds=[],this.$modes={},e)e[t]&&(this.$embeds.push(t),this.$modes[t]=new e[t]);var i=["toggleBlockComment","toggleCommentLines","getNextLineIndent","checkOutdent","autoOutdent","transformAction","getCompletions"];for(t=0;t<i.length;t++)!function(e){var n=i[t],s=e[n];e[i[t]]=function(){return this.$delegator(n,arguments,s)};}(this);},this.$delegator=function(e,t,i){var n=t[0];"string"!=typeof n&&(n=n[0]);for(var s=0;s<this.$embeds.length;s++)if(this.$modes[this.$embeds[s]]){var o=n.split(this.$embeds[s]);if(!o[0]&&o[1]){t[0]=o[1];var r=this.$modes[this.$embeds[s]];return r[e].apply(r,t)}}var a=i.apply(this,t);return i?a:void 0},this.transformAction=function(e,t,i,n,s){if(this.$behaviour){var o=this.$behaviour.getBehaviours();for(var r in o)if(o[r][t]){var a=o[r][t].apply(this,arguments);if(a)return a}}},this.getKeywords=function(e){if(!this.completionKeywords){var t=this.$tokenizer.rules,i=[];for(var n in t)for(var s=t[n],o=0,r=s.length;o<r;o++)if("string"==typeof s[o].token)/keyword|support|storage/.test(s[o].token)&&i.push(s[o].regex);else if("object"==typeof s[o].token)for(var a=0,l=s[o].token.length;a<l;a++)if(/keyword|support|storage/.test(s[o].token[a])){n=s[o].regex.match(/\(.+?\)/g)[a];i.push(n.substr(1,n.length-2));}this.completionKeywords=i;}return e?i.concat(this.$keywordList||[]):this.$keywordList},this.$createKeywordList=function(){return this.$highlightRules||this.getTokenizer(),this.$keywordList=this.$highlightRules.$keywordList||[]},this.getCompletions=function(e,t,i,n){return (this.$keywordList||this.$createKeywordList()).map((function(e){return {name:e,value:e,score:0,meta:"keyword"}}))},this.$id="ace/mode/text";})).call(c.prototype),t.Mode=c;})),ace.define("ace/apply_delta",["require","exports","module"],(function(e,t,i){t.applyDelta=function(e,t,i){var n=t.start.row,s=t.start.column,o=e[n]||"";switch(t.action){case"insert":if(1===t.lines.length)e[n]=o.substring(0,s)+t.lines[0]+o.substring(s);else {var r=[n,1].concat(t.lines);e.splice.apply(e,r),e[n]=o.substring(0,s)+e[n],e[n+t.lines.length-1]+=o.substring(s);}break;case"remove":var a=t.end.column,l=t.end.row;n===l?e[n]=o.substring(0,s)+o.substring(a):e.splice(n,l-n+1,o.substring(0,s)+e[l].substring(a));}};})),ace.define("ace/anchor",["require","exports","module","ace/lib/oop","ace/lib/event_emitter"],(function(e,t,i){var n=e("./lib/oop"),s=e("./lib/event_emitter").EventEmitter,o=t.Anchor=function(e,t,i){this.$onChange=this.onChange.bind(this),this.attach(e),void 0===i?this.setPosition(t.row,t.column):this.setPosition(t,i);};(function(){function e(e,t,i){var n=i?e.column<=t.column:e.column<t.column;return e.row<t.row||e.row==t.row&&n}n.implement(this,s),this.getPosition=function(){return this.$clipPositionToDocument(this.row,this.column)},this.getDocument=function(){return this.document},this.$insertRight=!1,this.onChange=function(t){if(!(t.start.row==t.end.row&&t.start.row!=this.row||t.start.row>this.row)){var i=function(t,i,n){var s="insert"==t.action,o=(s?1:-1)*(t.end.row-t.start.row),r=(s?1:-1)*(t.end.column-t.start.column),a=t.start,l=s?a:t.end;if(e(i,a,n))return {row:i.row,column:i.column};if(e(l,i,!n))return {row:i.row+o,column:i.column+(i.row==l.row?r:0)};return {row:a.row,column:a.column}}(t,{row:this.row,column:this.column},this.$insertRight);this.setPosition(i.row,i.column,!0);}},this.setPosition=function(e,t,i){var n;if(n=i?{row:e,column:t}:this.$clipPositionToDocument(e,t),this.row!=n.row||this.column!=n.column){var s={row:this.row,column:this.column};this.row=n.row,this.column=n.column,this._signal("change",{old:s,value:n});}},this.detach=function(){this.document.removeEventListener("change",this.$onChange);},this.attach=function(e){this.document=e||this.document,this.document.on("change",this.$onChange);},this.$clipPositionToDocument=function(e,t){var i={};return e>=this.document.getLength()?(i.row=Math.max(0,this.document.getLength()-1),i.column=this.document.getLine(i.row).length):e<0?(i.row=0,i.column=0):(i.row=e,i.column=Math.min(this.document.getLine(i.row).length,Math.max(0,t))),t<0&&(i.column=0),i};}).call(o.prototype);})),ace.define("ace/document",["require","exports","module","ace/lib/oop","ace/apply_delta","ace/lib/event_emitter","ace/range","ace/anchor"],(function(e,t,i){var n=e("./lib/oop"),s=e("./apply_delta").applyDelta,o=e("./lib/event_emitter").EventEmitter,r=e("./range").Range,a=e("./anchor").Anchor,l=function(e){this.$lines=[""],0===e.length?this.$lines=[""]:Array.isArray(e)?this.insertMergedLines({row:0,column:0},e):this.insert({row:0,column:0},e);};((function(){n.implement(this,o),this.setValue=function(e){var t=this.getLength()-1;this.remove(new r(0,0,t,this.getLine(t).length)),this.insert({row:0,column:0},e);},this.getValue=function(){return this.getAllLines().join(this.getNewLineCharacter())},this.createAnchor=function(e,t){return new a(this,e,t)},0==="aaa".split(/a/).length?this.$split=function(e){return e.replace(/\r\n|\r/g,"\n").split("\n")}:this.$split=function(e){return e.split(/\r\n|\r|\n/)},this.$detectNewLine=function(e){var t=e.match(/^.*?(\r\n|\r|\n)/m);this.$autoNewLine=t?t[1]:"\n",this._signal("changeNewLineMode");},this.getNewLineCharacter=function(){switch(this.$newLineMode){case"windows":return "\r\n";case"unix":return "\n";default:return this.$autoNewLine||"\n"}},this.$autoNewLine="",this.$newLineMode="auto",this.setNewLineMode=function(e){this.$newLineMode!==e&&(this.$newLineMode=e,this._signal("changeNewLineMode"));},this.getNewLineMode=function(){return this.$newLineMode},this.isNewLine=function(e){return "\r\n"==e||"\r"==e||"\n"==e},this.getLine=function(e){return this.$lines[e]||""},this.getLines=function(e,t){return this.$lines.slice(e,t+1)},this.getAllLines=function(){return this.getLines(0,this.getLength())},this.getLength=function(){return this.$lines.length},this.getTextRange=function(e){return this.getLinesForRange(e).join(this.getNewLineCharacter())},this.getLinesForRange=function(e){var t;if(e.start.row===e.end.row)t=[this.getLine(e.start.row).substring(e.start.column,e.end.column)];else {(t=this.getLines(e.start.row,e.end.row))[0]=(t[0]||"").substring(e.start.column);var i=t.length-1;e.end.row-e.start.row==i&&(t[i]=t[i].substring(0,e.end.column));}return t},this.insertLines=function(e,t){return console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead."),this.insertFullLines(e,t)},this.removeLines=function(e,t){return console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead."),this.removeFullLines(e,t)},this.insertNewLine=function(e){return console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead."),this.insertMergedLines(e,["",""])},this.insert=function(e,t){return this.getLength()<=1&&this.$detectNewLine(t),this.insertMergedLines(e,this.$split(t))},this.insertInLine=function(e,t){var i=this.clippedPos(e.row,e.column),n=this.pos(e.row,e.column+t.length);return this.applyDelta({start:i,end:n,action:"insert",lines:[t]},!0),this.clonePos(n)},this.clippedPos=function(e,t){var i=this.getLength();void 0===e?e=i:e<0?e=0:e>=i&&(e=i-1,t=void 0);var n=this.getLine(e);return null==t&&(t=n.length),{row:e,column:t=Math.min(Math.max(t,0),n.length)}},this.clonePos=function(e){return {row:e.row,column:e.column}},this.pos=function(e,t){return {row:e,column:t}},this.$clipPosition=function(e){var t=this.getLength();return e.row>=t?(e.row=Math.max(0,t-1),e.column=this.getLine(t-1).length):(e.row=Math.max(0,e.row),e.column=Math.min(Math.max(e.column,0),this.getLine(e.row).length)),e},this.insertFullLines=function(e,t){var i=0;(e=Math.min(Math.max(e,0),this.getLength()))<this.getLength()?(t=t.concat([""]),i=0):(t=[""].concat(t),e--,i=this.$lines[e].length),this.insertMergedLines({row:e,column:i},t);},this.insertMergedLines=function(e,t){var i=this.clippedPos(e.row,e.column),n={row:i.row+t.length-1,column:(1==t.length?i.column:0)+t[t.length-1].length};return this.applyDelta({start:i,end:n,action:"insert",lines:t}),this.clonePos(n)},this.remove=function(e){var t=this.clippedPos(e.start.row,e.start.column),i=this.clippedPos(e.end.row,e.end.column);return this.applyDelta({start:t,end:i,action:"remove",lines:this.getLinesForRange({start:t,end:i})}),this.clonePos(t)},this.removeInLine=function(e,t,i){var n=this.clippedPos(e,t),s=this.clippedPos(e,i);return this.applyDelta({start:n,end:s,action:"remove",lines:this.getLinesForRange({start:n,end:s})},!0),this.clonePos(n)},this.removeFullLines=function(e,t){e=Math.min(Math.max(0,e),this.getLength()-1);var i=(t=Math.min(Math.max(0,t),this.getLength()-1))==this.getLength()-1&&e>0,n=t<this.getLength()-1,s=i?e-1:e,o=i?this.getLine(s).length:0,a=n?t+1:t,l=n?0:this.getLine(a).length,h=new r(s,o,a,l),c=this.$lines.slice(e,t+1);return this.applyDelta({start:h.start,end:h.end,action:"remove",lines:this.getLinesForRange(h)}),c},this.removeNewLine=function(e){e<this.getLength()-1&&e>=0&&this.applyDelta({start:this.pos(e,this.getLine(e).length),end:this.pos(e+1,0),action:"remove",lines:["",""]});},this.replace=function(e,t){return e instanceof r||(e=r.fromPoints(e.start,e.end)),0===t.length&&e.isEmpty()?e.start:t==this.getTextRange(e)?e.end:(this.remove(e),t?this.insert(e.start,t):e.start)},this.applyDeltas=function(e){for(var t=0;t<e.length;t++)this.applyDelta(e[t]);},this.revertDeltas=function(e){for(var t=e.length-1;t>=0;t--)this.revertDelta(e[t]);},this.applyDelta=function(e,t){var i="insert"==e.action;(i?e.lines.length<=1&&!e.lines[0]:!r.comparePoints(e.start,e.end))||(i&&e.lines.length>2e4&&this.$splitAndapplyLargeDelta(e,2e4),s(this.$lines,e,t),this._signal("change",e));},this.$splitAndapplyLargeDelta=function(e,t){for(var i=e.lines,n=i.length,s=e.start.row,o=e.start.column,r=0,a=0;;){r=a,a+=t-1;var l=i.slice(r,a);if(a>n){e.lines=l,e.start.row=s+r,e.start.column=o;break}l.push(""),this.applyDelta({start:this.pos(s+r,o),end:this.pos(s+a,o=0),action:e.action,lines:l},!0);}},this.revertDelta=function(e){this.applyDelta({start:this.clonePos(e.start),end:this.clonePos(e.end),action:"insert"==e.action?"remove":"insert",lines:e.lines.slice()});},this.indexToPosition=function(e,t){for(var i=this.$lines||this.getAllLines(),n=this.getNewLineCharacter().length,s=t||0,o=i.length;s<o;s++)if((e-=i[s].length+n)<0)return {row:s,column:e+i[s].length+n};return {row:o-1,column:i[o-1].length}},this.positionToIndex=function(e,t){for(var i=this.$lines||this.getAllLines(),n=this.getNewLineCharacter().length,s=0,o=Math.min(e.row,i.length),r=t||0;r<o;++r)s+=i[r].length+n;return s+e.column};})).call(l.prototype),t.Document=l;})),ace.define("ace/background_tokenizer",["require","exports","module","ace/lib/oop","ace/lib/event_emitter"],(function(e,t,i){var n=e("./lib/oop"),s=e("./lib/event_emitter").EventEmitter,o=function(e,t){this.running=!1,this.lines=[],this.states=[],this.currentLine=0,this.tokenizer=e;var i=this;this.$worker=function(){if(i.running){for(var e=new Date,t=i.currentLine,n=-1,s=i.doc,o=t;i.lines[t];)t++;var r=s.getLength(),a=0;for(i.running=!1;t<r;){i.$tokenizeRow(t),n=t;do{t++;}while(i.lines[t]);if(++a%5==0&&new Date-e>20){i.running=setTimeout(i.$worker,20);break}}i.currentLine=t,-1==n&&(n=t),o<=n&&i.fireUpdateEvent(o,n);}};};((function(){n.implement(this,s),this.setTokenizer=function(e){this.tokenizer=e,this.lines=[],this.states=[],this.start(0);},this.setDocument=function(e){this.doc=e,this.lines=[],this.states=[],this.stop();},this.fireUpdateEvent=function(e,t){var i={first:e,last:t};this._signal("update",{data:i});},this.start=function(e){this.currentLine=Math.min(e||0,this.currentLine,this.doc.getLength()),this.lines.splice(this.currentLine,this.lines.length),this.states.splice(this.currentLine,this.states.length),this.stop(),this.running=setTimeout(this.$worker,700);},this.scheduleStart=function(){this.running||(this.running=setTimeout(this.$worker,700));},this.$updateOnChange=function(e){var t=e.start.row,i=e.end.row-t;if(0===i)this.lines[t]=null;else if("remove"==e.action)this.lines.splice(t,i+1,null),this.states.splice(t,i+1,null);else {var n=Array(i+1);n.unshift(t,1),this.lines.splice.apply(this.lines,n),this.states.splice.apply(this.states,n);}this.currentLine=Math.min(t,this.currentLine,this.doc.getLength()),this.stop();},this.stop=function(){this.running&&clearTimeout(this.running),this.running=!1;},this.getTokens=function(e){return this.lines[e]||this.$tokenizeRow(e)},this.getState=function(e){return this.currentLine==e&&this.$tokenizeRow(e),this.states[e]||"start"},this.$tokenizeRow=function(e){var t=this.doc.getLine(e),i=this.states[e-1],n=this.tokenizer.getLineTokens(t,i,e);return this.states[e]+""!=n.state+""?(this.states[e]=n.state,this.lines[e+1]=null,this.currentLine>e+1&&(this.currentLine=e+1)):this.currentLine==e&&(this.currentLine=e+1),this.lines[e]=n.tokens};})).call(o.prototype),t.BackgroundTokenizer=o;})),ace.define("ace/search_highlight",["require","exports","module","ace/lib/lang","ace/lib/oop","ace/range"],(function(e,t,i){var n=e("./lib/lang");e("./lib/oop");var s=e("./range").Range,o=function(e,t,i){this.setRegexp(e),this.clazz=t,this.type=i||"text";};((function(){this.MAX_RANGES=500,this.setRegexp=function(e){this.regExp+""!=e+""&&(this.regExp=e,this.cache=[]);},this.update=function(e,t,i,o){if(this.regExp)for(var r=o.firstRow,a=o.lastRow,l=r;l<=a;l++){var h=this.cache[l];null==h&&((h=n.getMatchOffsets(i.getLine(l),this.regExp)).length>this.MAX_RANGES&&(h=h.slice(0,this.MAX_RANGES)),h=h.map((function(e){return new s(l,e.offset,l,e.offset+e.length)})),this.cache[l]=h.length?h:"");for(var c=h.length;c--;)t.drawSingleLineMarker(e,h[c].toScreenRange(i),this.clazz,o);}};})).call(o.prototype),t.SearchHighlight=o;})),ace.define("ace/edit_session/fold_line",["require","exports","module","ace/range"],(function(e,t,i){var n=e("../range").Range;function s(e,t){this.foldData=e,Array.isArray(t)?this.folds=t:t=this.folds=[t];var i=t[t.length-1];this.range=new n(t[0].start.row,t[0].start.column,i.end.row,i.end.column),this.start=this.range.start,this.end=this.range.end,this.folds.forEach((function(e){e.setFoldLine(this);}),this);}((function(){this.shiftRow=function(e){this.start.row+=e,this.end.row+=e,this.folds.forEach((function(t){t.start.row+=e,t.end.row+=e;}));},this.addFold=function(e){if(e.sameRow){if(e.start.row<this.startRow||e.endRow>this.endRow)throw new Error("Can't add a fold to this FoldLine as it has no connection");this.folds.push(e),this.folds.sort((function(e,t){return -e.range.compareEnd(t.start.row,t.start.column)})),this.range.compareEnd(e.start.row,e.start.column)>0?(this.end.row=e.end.row,this.end.column=e.end.column):this.range.compareStart(e.end.row,e.end.column)<0&&(this.start.row=e.start.row,this.start.column=e.start.column);}else if(e.start.row==this.end.row)this.folds.push(e),this.end.row=e.end.row,this.end.column=e.end.column;else {if(e.end.row!=this.start.row)throw new Error("Trying to add fold to FoldRow that doesn't have a matching row");this.folds.unshift(e),this.start.row=e.start.row,this.start.column=e.start.column;}e.foldLine=this;},this.containsRow=function(e){return e>=this.start.row&&e<=this.end.row},this.walk=function(e,t,i){var n,s,o=0,r=this.folds,a=!0;null==t&&(t=this.end.row,i=this.end.column);for(var l=0;l<r.length;l++){if(-1==(s=(n=r[l]).range.compareStart(t,i)))return void e(null,t,i,o,a);if(!e(null,n.start.row,n.start.column,o,a)&&e(n.placeholder,n.start.row,n.start.column,o)||0===s)return;a=!n.sameRow,o=n.end.column;}e(null,t,i,o,a);},this.getNextFoldTo=function(e,t){for(var i,n,s=0;s<this.folds.length;s++){if(-1==(n=(i=this.folds[s]).range.compareEnd(e,t)))return {fold:i,kind:"after"};if(0===n)return {fold:i,kind:"inside"}}return null},this.addRemoveChars=function(e,t,i){var n,s,o=this.getNextFoldTo(e,t);if(o)if(n=o.fold,"inside"==o.kind&&n.start.column!=t&&n.start.row!=e)window.console&&window.console.log(e,t,n);else if(n.start.row==e){var r=(s=this.folds).indexOf(n);for(0===r&&(this.start.column+=i);r<s.length;r++){if((n=s[r]).start.column+=i,!n.sameRow)return;n.end.column+=i;}this.end.column+=i;}},this.split=function(e,t){var i=this.getNextFoldTo(e,t);if(!i||"inside"==i.kind)return null;var n=i.fold,o=this.folds,r=this.foldData,a=o.indexOf(n),l=o[a-1];this.end.row=l.end.row,this.end.column=l.end.column;var h=new s(r,o=o.splice(a,o.length-a));return r.splice(r.indexOf(this)+1,0,h),h},this.merge=function(e){for(var t=e.folds,i=0;i<t.length;i++)this.addFold(t[i]);var n=this.foldData;n.splice(n.indexOf(e),1);},this.toString=function(){var e=[this.range.toString()+": ["];return this.folds.forEach((function(t){e.push("  "+t.toString());})),e.push("]"),e.join("\n")},this.idxToPosition=function(e){for(var t=0,i=0;i<this.folds.length;i++){var n=this.folds[i];if((e-=n.start.column-t)<0)return {row:n.start.row,column:n.start.column+e};if((e-=n.placeholder.length)<0)return n.start;t=n.end.column;}return {row:this.end.row,column:this.end.column+e}};})).call(s.prototype),t.FoldLine=s;})),ace.define("ace/range_list",["require","exports","module","ace/range"],(function(e,t,i){var n=e("./range").Range.comparePoints,s=function(){this.ranges=[];};((function(){this.comparePoints=n,this.pointIndex=function(e,t,i){for(var s=this.ranges,o=i||0;o<s.length;o++){var r=s[o],a=n(e,r.end);if(!(a>0)){var l=n(e,r.start);return 0===a?t&&0!==l?-o-2:o:l>0||0===l&&!t?o:-o-1}}return -o-1},this.add=function(e){var t=!e.isEmpty(),i=this.pointIndex(e.start,t);i<0&&(i=-i-1);var n=this.pointIndex(e.end,t,i);return n<0?n=-n-1:n++,this.ranges.splice(i,n-i,e)},this.addList=function(e){for(var t=[],i=e.length;i--;)t.push.apply(t,this.add(e[i]));return t},this.substractPoint=function(e){var t=this.pointIndex(e);if(t>=0)return this.ranges.splice(t,1)},this.merge=function(){for(var e,t=[],i=this.ranges,s=(i=i.sort((function(e,t){return n(e.start,t.start)})))[0],o=1;o<i.length;o++){e=s,s=i[o];var r=n(e.end,s.start);r<0||(0!=r||e.isEmpty()||s.isEmpty())&&(n(e.end,s.end)<0&&(e.end.row=s.end.row,e.end.column=s.end.column),i.splice(o,1),t.push(s),s=e,o--);}return this.ranges=i,t},this.contains=function(e,t){return this.pointIndex({row:e,column:t})>=0},this.containsPoint=function(e){return this.pointIndex(e)>=0},this.rangeAtPoint=function(e){var t=this.pointIndex(e);if(t>=0)return this.ranges[t]},this.clipRows=function(e,t){var i=this.ranges;if(i[0].start.row>t||i[i.length-1].start.row<e)return [];var n=this.pointIndex({row:e,column:0});n<0&&(n=-n-1);var s=this.pointIndex({row:t,column:0},n);s<0&&(s=-s-1);for(var o=[],r=n;r<s;r++)o.push(i[r]);return o},this.removeAll=function(){return this.ranges.splice(0,this.ranges.length)},this.attach=function(e){this.session&&this.detach(),this.session=e,this.onChange=this.$onChange.bind(this),this.session.on("change",this.onChange);},this.detach=function(){this.session&&(this.session.removeListener("change",this.onChange),this.session=null);},this.$onChange=function(e){if("insert"==e.action)var t=e.start,i=e.end;else i=e.start,t=e.end;for(var n=t.row,s=i.row-n,o=-t.column+i.column,r=this.ranges,a=0,l=r.length;a<l;a++){if(!((h=r[a]).end.row<n)){if(h.start.row>n)break;if(h.start.row==n&&h.start.column>=t.column&&(h.start.column==t.column&&this.$insertRight||(h.start.column+=o,h.start.row+=s)),h.end.row==n&&h.end.column>=t.column){if(h.end.column==t.column&&this.$insertRight)continue;h.end.column==t.column&&o>0&&a<l-1&&h.end.column>h.start.column&&h.end.column==r[a+1].start.column&&(h.end.column-=o),h.end.column+=o,h.end.row+=s;}}}if(0!=s&&a<l)for(;a<l;a++){var h;(h=r[a]).start.row+=s,h.end.row+=s;}};})).call(s.prototype),t.RangeList=s;})),ace.define("ace/edit_session/fold",["require","exports","module","ace/range","ace/range_list","ace/lib/oop"],(function(e,t,i){e("../range").Range;var n=e("../range_list").RangeList,s=e("../lib/oop"),o=t.Fold=function(e,t){this.foldLine=null,this.placeholder=t,this.range=e,this.start=e.start,this.end=e.end,this.sameRow=e.start.row==e.end.row,this.subFolds=this.ranges=[];};function r(e,t){e.row-=t.row,0==e.row&&(e.column-=t.column);}function a(e,t){0==e.row&&(e.column+=t.column),e.row+=t.row;}s.inherits(o,n),function(){this.toString=function(){return '"'+this.placeholder+'" '+this.range.toString()},this.setFoldLine=function(e){this.foldLine=e,this.subFolds.forEach((function(t){t.setFoldLine(e);}));},this.clone=function(){var e=this.range.clone(),t=new o(e,this.placeholder);return this.subFolds.forEach((function(e){t.subFolds.push(e.clone());})),t.collapseChildren=this.collapseChildren,t},this.addSubFold=function(e){if(!this.range.isEqual(e)){if(!this.range.containsRange(e))throw new Error("A fold can't intersect already existing fold"+e.range+this.range);var t,i;t=e,i=this.start,r(t.start,i),r(t.end,i);for(var n=e.start.row,s=e.start.column,o=0,a=-1;o<this.subFolds.length&&1==(a=this.subFolds[o].range.compare(n,s));o++);var l=this.subFolds[o];if(0==a)return l.addSubFold(e);n=e.range.end.row,s=e.range.end.column;var h=o;for(a=-1;h<this.subFolds.length&&1==(a=this.subFolds[h].range.compare(n,s));h++);if(this.subFolds[h],0==a)throw new Error("A fold can't intersect already existing fold"+e.range+this.range);return this.subFolds.splice(o,h-o,e),e.setFoldLine(this.foldLine),e}},this.restoreRange=function(e){return function(e,t){a(e.start,t),a(e.end,t);}(e,this.start)};}.call(o.prototype);})),ace.define("ace/edit_session/folding",["require","exports","module","ace/range","ace/edit_session/fold_line","ace/edit_session/fold","ace/token_iterator"],(function(e,t,i){var n=e("../range").Range,s=e("./fold_line").FoldLine,o=e("./fold").Fold,r=e("../token_iterator").TokenIterator;t.Folding=function(){this.getFoldAt=function(e,t,i){var n=this.getFoldLine(e);if(!n)return null;for(var s=n.folds,o=0;o<s.length;o++){var r=s[o];if(r.range.contains(e,t)){if(1==i&&r.range.isEnd(e,t))continue;if(-1==i&&r.range.isStart(e,t))continue;return r}}},this.getFoldsInRange=function(e){var t=e.start,i=e.end,n=this.$foldData,s=[];t.column+=1,i.column-=1;for(var o=0;o<n.length;o++){var r=n[o].range.compareRange(e);if(2!=r){if(-2==r)break;for(var a=n[o].folds,l=0;l<a.length;l++){var h=a[l];if(-2==(r=h.range.compareRange(e)))break;if(2!=r){if(42==r)break;s.push(h);}}}}return t.column-=1,i.column+=1,s},this.getFoldsInRangeList=function(e){if(Array.isArray(e)){var t=[];e.forEach((function(e){t=t.concat(this.getFoldsInRange(e));}),this);}else t=this.getFoldsInRange(e);return t},this.getAllFolds=function(){for(var e=[],t=this.$foldData,i=0;i<t.length;i++)for(var n=0;n<t[i].folds.length;n++)e.push(t[i].folds[n]);return e},this.getFoldStringAt=function(e,t,i,n){if(!(n=n||this.getFoldLine(e)))return null;for(var s,o,r={end:{column:0}},a=0;a<n.folds.length;a++){var l=(o=n.folds[a]).range.compareEnd(e,t);if(-1==l){s=this.getLine(o.start.row).substring(r.end.column,o.start.column);break}if(0===l)return null;r=o;}return s||(s=this.getLine(o.start.row).substring(r.end.column)),-1==i?s.substring(0,t-r.end.column):1==i?s.substring(t-r.end.column):s},this.getFoldLine=function(e,t){var i=this.$foldData,n=0;for(t&&(n=i.indexOf(t)),-1==n&&(n=0);n<i.length;n++){var s=i[n];if(s.start.row<=e&&s.end.row>=e)return s;if(s.end.row>e)return null}return null},this.getNextFoldLine=function(e,t){var i=this.$foldData,n=0;for(t&&(n=i.indexOf(t)),-1==n&&(n=0);n<i.length;n++){var s=i[n];if(s.end.row>=e)return s}return null},this.getFoldedRowCount=function(e,t){for(var i=this.$foldData,n=t-e+1,s=0;s<i.length;s++){var o=i[s],r=o.end.row,a=o.start.row;if(r>=t){a<t&&(a>=e?n-=t-a:n=0);break}r>=e&&(n-=a>=e?r-a:r-e+1);}return n},this.$addFoldLine=function(e){return this.$foldData.push(e),this.$foldData.sort((function(e,t){return e.start.row-t.start.row})),e},this.addFold=function(e,t){var i,n=this.$foldData,r=!1;e instanceof o?i=e:(i=new o(t,e)).collapseChildren=t.collapseChildren,this.$clipRangeToDocument(i.range);var a=i.start.row,l=i.start.column,h=i.end.row,c=i.end.column;if(!(a<h||a==h&&l<=c-2))throw new Error("The range has to be at least 2 characters width");var u=this.getFoldAt(a,l,1),d=this.getFoldAt(h,c,-1);if(u&&d==u)return u.addSubFold(i);u&&!u.range.isStart(a,l)&&this.removeFold(u),d&&!d.range.isEnd(h,c)&&this.removeFold(d);var g=this.getFoldsInRange(i.range);g.length>0&&(this.removeFolds(g),g.forEach((function(e){i.addSubFold(e);})));for(var f=0;f<n.length;f++){var m=n[f];if(h==m.start.row){m.addFold(i),r=!0;break}if(a==m.end.row){if(m.addFold(i),r=!0,!i.sameRow){var p=n[f+1];if(p&&p.start.row==h){m.merge(p);break}}break}if(h<=m.start.row)break}return r||(m=this.$addFoldLine(new s(this.$foldData,i))),this.$useWrapMode?this.$updateWrapData(m.start.row,m.start.row):this.$updateRowLengthCache(m.start.row,m.start.row),this.$modified=!0,this._signal("changeFold",{data:i,action:"add"}),i},this.addFolds=function(e){e.forEach((function(e){this.addFold(e);}),this);},this.removeFold=function(e){var t=e.foldLine,i=t.start.row,n=t.end.row,s=this.$foldData,o=t.folds;if(1==o.length)s.splice(s.indexOf(t),1);else if(t.range.isEnd(e.end.row,e.end.column))o.pop(),t.end.row=o[o.length-1].end.row,t.end.column=o[o.length-1].end.column;else if(t.range.isStart(e.start.row,e.start.column))o.shift(),t.start.row=o[0].start.row,t.start.column=o[0].start.column;else if(e.sameRow)o.splice(o.indexOf(e),1);else {var r=t.split(e.start.row,e.start.column);(o=r.folds).shift(),r.start.row=o[0].start.row,r.start.column=o[0].start.column;}this.$updating||(this.$useWrapMode?this.$updateWrapData(i,n):this.$updateRowLengthCache(i,n)),this.$modified=!0,this._signal("changeFold",{data:e,action:"remove"});},this.removeFolds=function(e){for(var t=[],i=0;i<e.length;i++)t.push(e[i]);t.forEach((function(e){this.removeFold(e);}),this),this.$modified=!0;},this.expandFold=function(e){this.removeFold(e),e.subFolds.forEach((function(t){e.restoreRange(t),this.addFold(t);}),this),e.collapseChildren>0&&this.foldAll(e.start.row+1,e.end.row,e.collapseChildren-1),e.subFolds=[];},this.expandFolds=function(e){e.forEach((function(e){this.expandFold(e);}),this);},this.unfold=function(e,t){var i,s;if(null==e?(i=new n(0,0,this.getLength(),0),t=!0):i="number"==typeof e?new n(e,0,e,this.getLine(e).length):"row"in e?n.fromPoints(e,e):e,s=this.getFoldsInRangeList(i),t)this.removeFolds(s);else for(var o=s;o.length;)this.expandFolds(o),o=this.getFoldsInRangeList(i);if(s.length)return s},this.isRowFolded=function(e,t){return !!this.getFoldLine(e,t)},this.getRowFoldEnd=function(e,t){var i=this.getFoldLine(e,t);return i?i.end.row:e},this.getRowFoldStart=function(e,t){var i=this.getFoldLine(e,t);return i?i.start.row:e},this.getFoldDisplayLine=function(e,t,i,n,s){null==n&&(n=e.start.row),null==s&&(s=0),null==t&&(t=e.end.row),null==i&&(i=this.getLine(t).length);var o=this.doc,r="";return e.walk((function(e,t,i,a){if(!(t<n)){if(t==n){if(i<s)return;a=Math.max(s,a);}r+=null!=e?e:o.getLine(t).substring(a,i);}}),t,i),r},this.getDisplayLine=function(e,t,i,n){var s,o=this.getFoldLine(e);return o?this.getFoldDisplayLine(o,e,t,i,n):(s=this.doc.getLine(e)).substring(n||0,t||s.length)},this.$cloneFoldData=function(){var e=[];return e=this.$foldData.map((function(t){var i=t.folds.map((function(e){return e.clone()}));return new s(e,i)}))},this.toggleFold=function(e){var t,i,n=this.selection.getRange();if(n.isEmpty()){var s=n.start;if(t=this.getFoldAt(s.row,s.column))return void this.expandFold(t);(i=this.findMatchingBracket(s))?1==n.comparePoint(i)?n.end=i:(n.start=i,n.start.column++,n.end.column--):(i=this.findMatchingBracket({row:s.row,column:s.column+1}))?(1==n.comparePoint(i)?n.end=i:n.start=i,n.start.column++):n=this.getCommentFoldRange(s.row,s.column)||n;}else {var o=this.getFoldsInRange(n);if(e&&o.length)return void this.expandFolds(o);1==o.length&&(t=o[0]);}if(t||(t=this.getFoldAt(n.start.row,n.start.column)),t&&t.range.toString()==n.toString())this.expandFold(t);else {var r="...";if(!n.isMultiLine()){if((r=this.getTextRange(n)).length<4)return;r=r.trim().substring(0,2)+"..";}this.addFold(r,n);}},this.getCommentFoldRange=function(e,t,i){var s=new r(this,e,t),o=s.getCurrentToken(),a=o.type;if(o&&/^comment|string/.test(a)){"comment"==(a=a.match(/comment|string/)[0])&&(a+="|doc-start");var l=new RegExp(a),h=new n;if(1!=i){do{o=s.stepBackward();}while(o&&l.test(o.type));s.stepForward();}if(h.start.row=s.getCurrentTokenRow(),h.start.column=s.getCurrentTokenColumn()+2,s=new r(this,e,t),-1!=i){var c=-1;do{if(o=s.stepForward(),-1==c){var u=this.getState(s.$row);l.test(u)||(c=s.$row);}else if(s.$row>c)break}while(o&&l.test(o.type));o=s.stepBackward();}else o=s.getCurrentToken();return h.end.row=s.getCurrentTokenRow(),h.end.column=s.getCurrentTokenColumn()+o.value.length-2,h}},this.foldAll=function(e,t,i){null==i&&(i=1e5);var n=this.foldWidgets;if(n){t=t||this.getLength();for(var s=e=e||0;s<t;s++)if(null==n[s]&&(n[s]=this.getFoldWidget(s)),"start"==n[s]){var o=this.getFoldWidgetRange(s);if(o&&o.isMultiLine()&&o.end.row<=t&&o.start.row>=e){s=o.end.row;try{var r=this.addFold("...",o);r&&(r.collapseChildren=i);}catch(e){}}}}},this.$foldStyles={manual:1,markbegin:1,markbeginend:1},this.$foldStyle="markbegin",this.setFoldStyle=function(e){if(!this.$foldStyles[e])throw new Error("invalid fold style: "+e+"["+Object.keys(this.$foldStyles).join(", ")+"]");if(this.$foldStyle!=e){this.$foldStyle=e,"manual"==e&&this.unfold();var t=this.$foldMode;this.$setFolding(null),this.$setFolding(t);}},this.$setFolding=function(e){this.$foldMode!=e&&(this.$foldMode=e,this.off("change",this.$updateFoldWidgets),this.off("tokenizerUpdate",this.$tokenizerUpdateFoldWidgets),this._signal("changeAnnotation"),e&&"manual"!=this.$foldStyle?(this.foldWidgets=[],this.getFoldWidget=e.getFoldWidget.bind(e,this,this.$foldStyle),this.getFoldWidgetRange=e.getFoldWidgetRange.bind(e,this,this.$foldStyle),this.$updateFoldWidgets=this.updateFoldWidgets.bind(this),this.$tokenizerUpdateFoldWidgets=this.tokenizerUpdateFoldWidgets.bind(this),this.on("change",this.$updateFoldWidgets),this.on("tokenizerUpdate",this.$tokenizerUpdateFoldWidgets)):this.foldWidgets=null);},this.getParentFoldRangeData=function(e,t){var i=this.foldWidgets;if(!i||t&&i[e])return {};for(var n,s=e-1;s>=0;){var o=i[s];if(null==o&&(o=i[s]=this.getFoldWidget(s)),"start"==o){var r=this.getFoldWidgetRange(s);if(n||(n=r),r&&r.end.row>=e)break}s--;}return {range:-1!==s&&r,firstRange:n}},this.onFoldWidgetClick=function(e,t){var i={children:(t=t.domEvent).shiftKey,all:t.ctrlKey||t.metaKey,siblings:t.altKey};if(!this.$toggleFoldWidget(e,i)){var n=t.target||t.srcElement;n&&/ace_fold-widget/.test(n.className)&&(n.className+=" ace_invalid");}},this.$toggleFoldWidget=function(e,t){if(this.getFoldWidget){var i=this.getFoldWidget(e),n=this.getLine(e),s="end"===i?-1:1,o=this.getFoldAt(e,-1===s?0:n.length,s);if(o)return t.children||t.all?this.removeFold(o):this.expandFold(o),o;var r=this.getFoldWidgetRange(e,!0);if(r&&!r.isMultiLine()&&(o=this.getFoldAt(r.start.row,r.start.column,1))&&r.isEqual(o.range))return this.removeFold(o),o;if(t.siblings){var a=this.getParentFoldRangeData(e);if(a.range)var l=a.range.start.row+1,h=a.range.end.row;this.foldAll(l,h,t.all?1e4:0);}else t.children?(h=r?r.end.row:this.getLength(),this.foldAll(e+1,h,t.all?1e4:0)):r&&(t.all&&(r.collapseChildren=1e4),this.addFold("...",r));return r}},this.toggleFoldWidget=function(e){var t=this.selection.getCursor().row;t=this.getRowFoldStart(t);var i=this.$toggleFoldWidget(t,{});if(!i){var n=this.getParentFoldRangeData(t,!0);if(i=n.range||n.firstRange){t=i.start.row;var s=this.getFoldAt(t,this.getLine(t).length,1);s?this.removeFold(s):this.addFold("...",i);}}},this.updateFoldWidgets=function(e){var t=e.start.row,i=e.end.row-t;if(0===i)this.foldWidgets[t]=null;else if("remove"==e.action)this.foldWidgets.splice(t,i+1,null);else {var n=Array(i+1);n.unshift(t,1),this.foldWidgets.splice.apply(this.foldWidgets,n);}},this.tokenizerUpdateFoldWidgets=function(e){var t=e.data;t.first!=t.last&&this.foldWidgets.length>t.first&&this.foldWidgets.splice(t.first,this.foldWidgets.length);};};})),ace.define("ace/edit_session/bracket_match",["require","exports","module","ace/token_iterator","ace/range"],(function(e,t,i){var n=e("../token_iterator").TokenIterator,s=e("../range").Range;t.BracketMatch=function(){this.findMatchingBracket=function(e,t){if(0==e.column)return null;var i=t||this.getLine(e.row).charAt(e.column-1);if(""==i)return null;var n=i.match(/([\(\[\{])|([\)\]\}])/);return n?n[1]?this.$findClosingBracket(n[1],e):this.$findOpeningBracket(n[2],e):null},this.getBracketRange=function(e){var t,i=this.getLine(e.row),n=!0,o=i.charAt(e.column-1),r=o&&o.match(/([\(\[\{])|([\)\]\}])/);if(r||(o=i.charAt(e.column),e={row:e.row,column:e.column+1},r=o&&o.match(/([\(\[\{])|([\)\]\}])/),n=!1),!r)return null;if(r[1]){if(!(a=this.$findClosingBracket(r[1],e)))return null;t=s.fromPoints(e,a),n||(t.end.column++,t.start.column--),t.cursor=t.end;}else {var a;if(!(a=this.$findOpeningBracket(r[2],e)))return null;t=s.fromPoints(a,e),n||(t.start.column++,t.end.column--),t.cursor=t.start;}return t},this.$brackets={")":"(","(":")","]":"[","[":"]","{":"}","}":"{"},this.$findOpeningBracket=function(e,t,i){var s=this.$brackets[e],o=1,r=new n(this,t.row,t.column),a=r.getCurrentToken();if(a||(a=r.stepForward()),a){i||(i=new RegExp("(\\.?"+a.type.replace(".","\\.").replace("rparen",".paren").replace(/\b(?:end)\b/,"(?:start|begin|end)")+")+"));for(var l=t.column-r.getCurrentTokenColumn()-2,h=a.value;;){for(;l>=0;){var c=h.charAt(l);if(c==s){if(0==(o-=1))return {row:r.getCurrentTokenRow(),column:l+r.getCurrentTokenColumn()}}else c==e&&(o+=1);l-=1;}do{a=r.stepBackward();}while(a&&!i.test(a.type));if(null==a)break;l=(h=a.value).length-1;}return null}},this.$findClosingBracket=function(e,t,i){var s=this.$brackets[e],o=1,r=new n(this,t.row,t.column),a=r.getCurrentToken();if(a||(a=r.stepForward()),a){i||(i=new RegExp("(\\.?"+a.type.replace(".","\\.").replace("lparen",".paren").replace(/\b(?:start|begin)\b/,"(?:start|begin|end)")+")+"));for(var l=t.column-r.getCurrentTokenColumn();;){for(var h=a.value,c=h.length;l<c;){var u=h.charAt(l);if(u==s){if(0==(o-=1))return {row:r.getCurrentTokenRow(),column:l+r.getCurrentTokenColumn()}}else u==e&&(o+=1);l+=1;}do{a=r.stepForward();}while(a&&!i.test(a.type));if(null==a)break;l=0;}return null}};};})),ace.define("ace/edit_session",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/bidihandler","ace/config","ace/lib/event_emitter","ace/selection","ace/mode/text","ace/range","ace/document","ace/background_tokenizer","ace/search_highlight","ace/edit_session/folding","ace/edit_session/bracket_match"],(function(e,t,i){var n=e("./lib/oop"),s=e("./lib/lang"),o=e("./bidihandler").BidiHandler,r=e("./config"),a=e("./lib/event_emitter").EventEmitter,l=e("./selection").Selection,h=e("./mode/text").Mode,c=e("./range").Range,u=e("./document").Document,d=e("./background_tokenizer").BackgroundTokenizer,g=e("./search_highlight").SearchHighlight,f=function(e,t){this.$breakpoints=[],this.$decorations=[],this.$frontMarkers={},this.$backMarkers={},this.$markerId=1,this.$undoSelect=!0,this.$foldData=[],this.id="session"+ ++f.$uid,this.$foldData.toString=function(){return this.join("\n")},this.on("changeFold",this.onChangeFold.bind(this)),this.$onChange=this.onChange.bind(this),"object"==typeof e&&e.getLine||(e=new u(e)),this.$bidiHandler=new o(this),this.setDocument(e),this.selection=new l(this),r.resetOptions(this),this.setMode(t),r._signal("session",this);};f.$uid=0,function(){n.implement(this,a),this.setDocument=function(e){this.doc&&this.doc.removeListener("change",this.$onChange),this.doc=e,e.on("change",this.$onChange),this.bgTokenizer&&this.bgTokenizer.setDocument(this.getDocument()),this.resetCaches();},this.getDocument=function(){return this.doc},this.$resetRowCache=function(e){if(!e)return this.$docRowCache=[],void(this.$screenRowCache=[]);var t=this.$docRowCache.length,i=this.$getRowCacheIndex(this.$docRowCache,e)+1;t>i&&(this.$docRowCache.splice(i,t),this.$screenRowCache.splice(i,t));},this.$getRowCacheIndex=function(e,t){for(var i=0,n=e.length-1;i<=n;){var s=i+n>>1,o=e[s];if(t>o)i=s+1;else {if(!(t<o))return s;n=s-1;}}return i-1},this.resetCaches=function(){this.$modified=!0,this.$wrapData=[],this.$rowLengthCache=[],this.$resetRowCache(0),this.bgTokenizer&&this.bgTokenizer.start(0);},this.onChangeFold=function(e){var t=e.data;this.$resetRowCache(t.start.row);},this.onChange=function(e){this.$modified=!0,this.$bidiHandler.onChange(e),this.$resetRowCache(e.start.row);var t=this.$updateInternalDataOnChange(e);this.$fromUndo||!this.$undoManager||e.ignore||(this.$deltasDoc.push(e),t&&0!=t.length&&this.$deltasFold.push({action:"removeFolds",folds:t}),this.$informUndoManager.schedule()),this.bgTokenizer&&this.bgTokenizer.$updateOnChange(e),this._signal("change",e);},this.setValue=function(e){this.doc.setValue(e),this.selection.moveTo(0,0),this.$resetRowCache(0),this.$deltas=[],this.$deltasDoc=[],this.$deltasFold=[],this.setUndoManager(this.$undoManager),this.getUndoManager().reset();},this.getValue=this.toString=function(){return this.doc.getValue()},this.getSelection=function(){return this.selection},this.getState=function(e){return this.bgTokenizer.getState(e)},this.getTokens=function(e){return this.bgTokenizer.getTokens(e)},this.getTokenAt=function(e,t){var i,n=this.bgTokenizer.getTokens(e),s=0;if(null==t){var o=n.length-1;s=this.getLine(e).length;}else for(o=0;o<n.length&&!((s+=n[o].value.length)>=t);o++);return (i=n[o])?(i.index=o,i.start=s-i.value.length,i):null},this.setUndoManager=function(e){if(this.$undoManager=e,this.$deltas=[],this.$deltasDoc=[],this.$deltasFold=[],this.$informUndoManager&&this.$informUndoManager.cancel(),e){var t=this;this.$syncInformUndoManager=function(){t.$informUndoManager.cancel(),t.$deltasFold.length&&(t.$deltas.push({group:"fold",deltas:t.$deltasFold}),t.$deltasFold=[]),t.$deltasDoc.length&&(t.$deltas.push({group:"doc",deltas:t.$deltasDoc}),t.$deltasDoc=[]),t.$deltas.length>0&&e.execute({action:"aceupdate",args:[t.$deltas,t],merge:t.mergeUndoDeltas}),t.mergeUndoDeltas=!1,t.$deltas=[];},this.$informUndoManager=s.delayedCall(this.$syncInformUndoManager);}},this.markUndoGroup=function(){this.$syncInformUndoManager&&this.$syncInformUndoManager();},this.$defaultUndoManager={undo:function(){},redo:function(){},reset:function(){}},this.getUndoManager=function(){return this.$undoManager||this.$defaultUndoManager},this.getTabString=function(){return this.getUseSoftTabs()?s.stringRepeat(" ",this.getTabSize()):"\t"},this.setUseSoftTabs=function(e){this.setOption("useSoftTabs",e);},this.getUseSoftTabs=function(){return this.$useSoftTabs&&!this.$mode.$indentWithTabs},this.setTabSize=function(e){this.setOption("tabSize",e);},this.getTabSize=function(){return this.$tabSize},this.isTabStop=function(e){return this.$useSoftTabs&&e.column%this.$tabSize==0},this.setNavigateWithinSoftTabs=function(e){this.setOption("navigateWithinSoftTabs",e);},this.getNavigateWithinSoftTabs=function(){return this.$navigateWithinSoftTabs},this.$overwrite=!1,this.setOverwrite=function(e){this.setOption("overwrite",e);},this.getOverwrite=function(){return this.$overwrite},this.toggleOverwrite=function(){this.setOverwrite(!this.$overwrite);},this.addGutterDecoration=function(e,t){this.$decorations[e]||(this.$decorations[e]=""),this.$decorations[e]+=" "+t,this._signal("changeBreakpoint",{});},this.removeGutterDecoration=function(e,t){this.$decorations[e]=(this.$decorations[e]||"").replace(" "+t,""),this._signal("changeBreakpoint",{});},this.getBreakpoints=function(){return this.$breakpoints},this.setBreakpoints=function(e){this.$breakpoints=[];for(var t=0;t<e.length;t++)this.$breakpoints[e[t]]="ace_breakpoint";this._signal("changeBreakpoint",{});},this.clearBreakpoints=function(){this.$breakpoints=[],this._signal("changeBreakpoint",{});},this.setBreakpoint=function(e,t){void 0===t&&(t="ace_breakpoint"),t?this.$breakpoints[e]=t:delete this.$breakpoints[e],this._signal("changeBreakpoint",{});},this.clearBreakpoint=function(e){delete this.$breakpoints[e],this._signal("changeBreakpoint",{});},this.addMarker=function(e,t,i,n){var s=this.$markerId++,o={range:e,type:i||"line",renderer:"function"==typeof i?i:null,clazz:t,inFront:!!n,id:s};return n?(this.$frontMarkers[s]=o,this._signal("changeFrontMarker")):(this.$backMarkers[s]=o,this._signal("changeBackMarker")),s},this.addDynamicMarker=function(e,t){if(e.update){var i=this.$markerId++;return e.id=i,e.inFront=!!t,t?(this.$frontMarkers[i]=e,this._signal("changeFrontMarker")):(this.$backMarkers[i]=e,this._signal("changeBackMarker")),e}},this.removeMarker=function(e){var t=this.$frontMarkers[e]||this.$backMarkers[e];if(t){var i=t.inFront?this.$frontMarkers:this.$backMarkers;t&&(delete i[e],this._signal(t.inFront?"changeFrontMarker":"changeBackMarker"));}},this.getMarkers=function(e){return e?this.$frontMarkers:this.$backMarkers},this.highlight=function(e){if(!this.$searchHighlight){var t=new g(null,"ace_selected-word","text");this.$searchHighlight=this.addDynamicMarker(t);}this.$searchHighlight.setRegexp(e);},this.highlightLines=function(e,t,i,n){"number"!=typeof t&&(i=t,t=e),i||(i="ace_step");var s=new c(e,0,t,1/0);return s.id=this.addMarker(s,i,"fullLine",n),s},this.setAnnotations=function(e){this.$annotations=e,this._signal("changeAnnotation",{});},this.getAnnotations=function(){return this.$annotations||[]},this.clearAnnotations=function(){this.setAnnotations([]);},this.$detectNewLine=function(e){var t=e.match(/^.*?(\r?\n)/m);this.$autoNewLine=t?t[1]:"\n";},this.getWordRange=function(e,t){var i=this.getLine(e),n=!1;if(t>0&&(n=!!i.charAt(t-1).match(this.tokenRe)),n||(n=!!i.charAt(t).match(this.tokenRe)),n)var s=this.tokenRe;else if(/^\s+$/.test(i.slice(t-1,t+1)))s=/\s/;else s=this.nonTokenRe;var o=t;if(o>0){do{o--;}while(o>=0&&i.charAt(o).match(s));o++;}for(var r=t;r<i.length&&i.charAt(r).match(s);)r++;return new c(e,o,e,r)},this.getAWordRange=function(e,t){for(var i=this.getWordRange(e,t),n=this.getLine(i.end.row);n.charAt(i.end.column).match(/[ \t]/);)i.end.column+=1;return i},this.setNewLineMode=function(e){this.doc.setNewLineMode(e);},this.getNewLineMode=function(){return this.doc.getNewLineMode()},this.setUseWorker=function(e){this.setOption("useWorker",e);},this.getUseWorker=function(){return this.$useWorker},this.onReloadTokenizer=function(e){var t=e.data;this.bgTokenizer.start(t.first),this._signal("tokenizerUpdate",e);},this.$modes={},this.$mode=null,this.$modeId=null,this.setMode=function(e,t){if(e&&"object"==typeof e){if(e.getTokenizer)return this.$onChangeMode(e);var i=e,n=i.path;}else n=e||"ace/mode/text";if(this.$modes["ace/mode/text"]||(this.$modes["ace/mode/text"]=new h),this.$modes[n]&&!i)return this.$onChangeMode(this.$modes[n]),void(t&&t());this.$modeId=n,r.loadModule(["mode",n],function(e){if(this.$modeId!==n)return t&&t();this.$modes[n]&&!i?this.$onChangeMode(this.$modes[n]):e&&e.Mode&&(e=new e.Mode(i),i||(this.$modes[n]=e,e.$id=n),this.$onChangeMode(e)),t&&t();}.bind(this)),this.$mode||this.$onChangeMode(this.$modes["ace/mode/text"],!0);},this.$onChangeMode=function(e,t){if(t||(this.$modeId=e.$id),this.$mode!==e){this.$mode=e,this.$stopWorker(),this.$useWorker&&this.$startWorker();var i=e.getTokenizer();if(void 0!==i.addEventListener){var n=this.onReloadTokenizer.bind(this);i.addEventListener("update",n);}if(this.bgTokenizer)this.bgTokenizer.setTokenizer(i);else {this.bgTokenizer=new d(i);var s=this;this.bgTokenizer.addEventListener("update",(function(e){s._signal("tokenizerUpdate",e);}));}this.bgTokenizer.setDocument(this.getDocument()),this.tokenRe=e.tokenRe,this.nonTokenRe=e.nonTokenRe,t||(e.attachToSession&&e.attachToSession(this),this.$options.wrapMethod.set.call(this,this.$wrapMethod),this.$setFolding(e.foldingRules),this.bgTokenizer.start(0),this._emit("changeMode"));}},this.$stopWorker=function(){this.$worker&&(this.$worker.terminate(),this.$worker=null);},this.$startWorker=function(){try{this.$worker=this.$mode.createWorker(this);}catch(e){r.warn("Could not load worker",e),this.$worker=null;}},this.getMode=function(){return this.$mode},this.$scrollTop=0,this.setScrollTop=function(e){this.$scrollTop===e||isNaN(e)||(this.$scrollTop=e,this._signal("changeScrollTop",e));},this.getScrollTop=function(){return this.$scrollTop},this.$scrollLeft=0,this.setScrollLeft=function(e){this.$scrollLeft===e||isNaN(e)||(this.$scrollLeft=e,this._signal("changeScrollLeft",e));},this.getScrollLeft=function(){return this.$scrollLeft},this.getScreenWidth=function(){return this.$computeWidth(),this.lineWidgets?Math.max(this.getLineWidgetMaxWidth(),this.screenWidth):this.screenWidth},this.getLineWidgetMaxWidth=function(){if(null!=this.lineWidgetsWidth)return this.lineWidgetsWidth;var e=0;return this.lineWidgets.forEach((function(t){t&&t.screenWidth>e&&(e=t.screenWidth);})),this.lineWidgetWidth=e},this.$computeWidth=function(e){if(this.$modified||e){if(this.$modified=!1,this.$useWrapMode)return this.screenWidth=this.$wrapLimit;for(var t=this.doc.getAllLines(),i=this.$rowLengthCache,n=0,s=0,o=this.$foldData[s],r=o?o.start.row:1/0,a=t.length,l=0;l<a;l++){if(l>r){if((l=o.end.row+1)>=a)break;r=(o=this.$foldData[s++])?o.start.row:1/0;}null==i[l]&&(i[l]=this.$getStringScreenWidth(t[l])[0]),i[l]>n&&(n=i[l]);}this.screenWidth=n;}},this.getLine=function(e){return this.doc.getLine(e)},this.getLines=function(e,t){return this.doc.getLines(e,t)},this.getLength=function(){return this.doc.getLength()},this.getTextRange=function(e){return this.doc.getTextRange(e||this.selection.getRange())},this.insert=function(e,t){return this.doc.insert(e,t)},this.remove=function(e){return this.doc.remove(e)},this.removeFullLines=function(e,t){return this.doc.removeFullLines(e,t)},this.undoChanges=function(e,t){if(e.length){this.$fromUndo=!0;for(var i=null,n=e.length-1;-1!=n;n--){var s=e[n];"doc"==s.group?(this.doc.revertDeltas(s.deltas),i=this.$getUndoSelection(s.deltas,!0,i)):s.deltas.forEach((function(e){this.addFolds(e.folds);}),this);}return this.$fromUndo=!1,i&&this.$undoSelect&&!t&&this.selection.setSelectionRange(i),i}},this.redoChanges=function(e,t){if(e.length){this.$fromUndo=!0;for(var i=null,n=0;n<e.length;n++){var s=e[n];"doc"==s.group&&(this.doc.applyDeltas(s.deltas),i=this.$getUndoSelection(s.deltas,!1,i));}return this.$fromUndo=!1,i&&this.$undoSelect&&!t&&this.selection.setSelectionRange(i),i}},this.setUndoSelect=function(e){this.$undoSelect=e;},this.$getUndoSelection=function(e,t,i){function n(e){return t?"insert"!==e.action:"insert"===e.action}var s,o,r=e[0];s=n(r)?c.fromPoints(r.start,r.end):c.fromPoints(r.start,r.start);for(var a=1;a<e.length;a++)n(r=e[a])?(o=r.start,-1==s.compare(o.row,o.column)&&s.setStart(o),o=r.end,1==s.compare(o.row,o.column)&&s.setEnd(o)):(o=r.start,-1==s.compare(o.row,o.column)&&(s=c.fromPoints(r.start,r.start)));if(null!=i){0===c.comparePoints(i.start,s.start)&&(i.start.column+=s.end.column-s.start.column,i.end.column+=s.end.column-s.start.column);var l=i.compareRange(s);1==l?s.setStart(i.start):-1==l&&s.setEnd(i.end);}return s},this.replace=function(e,t){return this.doc.replace(e,t)},this.moveText=function(e,t,i){var n=this.getTextRange(e),s=this.getFoldsInRange(e),o=c.fromPoints(t,t);if(!i){this.remove(e);var r=e.start.row-e.end.row;(h=r?-e.end.column:e.start.column-e.end.column)&&(o.start.row==e.end.row&&o.start.column>e.end.column&&(o.start.column+=h),o.end.row==e.end.row&&o.end.column>e.end.column&&(o.end.column+=h)),r&&o.start.row>=e.end.row&&(o.start.row+=r,o.end.row+=r);}if(o.end=this.insert(o.start,n),s.length){var a=e.start,l=o.start,h=(r=l.row-a.row,l.column-a.column);this.addFolds(s.map((function(e){return (e=e.clone()).start.row==a.row&&(e.start.column+=h),e.end.row==a.row&&(e.end.column+=h),e.start.row+=r,e.end.row+=r,e})));}return o},this.indentRows=function(e,t,i){i=i.replace(/\t/g,this.getTabString());for(var n=e;n<=t;n++)this.doc.insertInLine({row:n,column:0},i);},this.outdentRows=function(e){for(var t=e.collapseRows(),i=new c(0,0,0,0),n=this.getTabSize(),s=t.start.row;s<=t.end.row;++s){var o=this.getLine(s);i.start.row=s,i.end.row=s;for(var r=0;r<n&&" "==o.charAt(r);++r);r<n&&"\t"==o.charAt(r)?(i.start.column=r,i.end.column=r+1):(i.start.column=0,i.end.column=r),this.remove(i);}},this.$moveLines=function(e,t,i){if(e=this.getRowFoldStart(e),t=this.getRowFoldEnd(t),i<0){if((s=this.getRowFoldStart(e+i))<0)return 0;var n=s-e;}else if(i>0){var s;if((s=this.getRowFoldEnd(t+i))>this.doc.getLength()-1)return 0;n=s-t;}else {e=this.$clipRowToDocument(e);n=(t=this.$clipRowToDocument(t))-e+1;}var o=new c(e,0,t,Number.MAX_VALUE),r=this.getFoldsInRange(o).map((function(e){return (e=e.clone()).start.row+=n,e.end.row+=n,e})),a=0==i?this.doc.getLines(e,t):this.doc.removeFullLines(e,t);return this.doc.insertFullLines(e+n,a),r.length&&this.addFolds(r),n},this.moveLinesUp=function(e,t){return this.$moveLines(e,t,-1)},this.moveLinesDown=function(e,t){return this.$moveLines(e,t,1)},this.duplicateLines=function(e,t){return this.$moveLines(e,t,0)},this.$clipRowToDocument=function(e){return Math.max(0,Math.min(e,this.doc.getLength()-1))},this.$clipColumnToRow=function(e,t){return t<0?0:Math.min(this.doc.getLine(e).length,t)},this.$clipPositionToDocument=function(e,t){if(t=Math.max(0,t),e<0)e=0,t=0;else {var i=this.doc.getLength();e>=i?(e=i-1,t=this.doc.getLine(i-1).length):t=Math.min(this.doc.getLine(e).length,t);}return {row:e,column:t}},this.$clipRangeToDocument=function(e){e.start.row<0?(e.start.row=0,e.start.column=0):e.start.column=this.$clipColumnToRow(e.start.row,e.start.column);var t=this.doc.getLength()-1;return e.end.row>t?(e.end.row=t,e.end.column=this.doc.getLine(t).length):e.end.column=this.$clipColumnToRow(e.end.row,e.end.column),e},this.$wrapLimit=80,this.$useWrapMode=!1,this.$wrapLimitRange={min:null,max:null},this.setUseWrapMode=function(e){if(e!=this.$useWrapMode){if(this.$useWrapMode=e,this.$modified=!0,this.$resetRowCache(0),e){var t=this.getLength();this.$wrapData=Array(t),this.$updateWrapData(0,t-1);}this._signal("changeWrapMode");}},this.getUseWrapMode=function(){return this.$useWrapMode},this.setWrapLimitRange=function(e,t){this.$wrapLimitRange.min===e&&this.$wrapLimitRange.max===t||(this.$wrapLimitRange={min:e,max:t},this.$modified=!0,this.$bidiHandler.markAsDirty(),this.$useWrapMode&&this._signal("changeWrapMode"));},this.adjustWrapLimit=function(e,t){var i=this.$wrapLimitRange;i.max<0&&(i={min:t,max:t});var n=this.$constrainWrapLimit(e,i.min,i.max);return n!=this.$wrapLimit&&n>1&&(this.$wrapLimit=n,this.$modified=!0,this.$useWrapMode&&(this.$updateWrapData(0,this.getLength()-1),this.$resetRowCache(0),this._signal("changeWrapLimit")),!0)},this.$constrainWrapLimit=function(e,t,i){return t&&(e=Math.max(t,e)),i&&(e=Math.min(i,e)),e},this.getWrapLimit=function(){return this.$wrapLimit},this.setWrapLimit=function(e){this.setWrapLimitRange(e,e);},this.getWrapLimitRange=function(){return {min:this.$wrapLimitRange.min,max:this.$wrapLimitRange.max}},this.$updateInternalDataOnChange=function(e){var t=this.$useWrapMode,i=e.action,n=e.start,s=e.end,o=n.row,r=s.row,a=r-o,l=null;if(this.$updating=!0,0!=a)if("remove"===i){this[t?"$wrapData":"$rowLengthCache"].splice(o,a);var h=this.$foldData;l=this.getFoldsInRange(e),this.removeFolds(l);var c=0;if(m=this.getFoldLine(s.row)){m.addRemoveChars(s.row,s.column,n.column-s.column),m.shiftRow(-a);var u=this.getFoldLine(o);u&&u!==m&&(u.merge(m),m=u),c=h.indexOf(m)+1;}for(;c<h.length;c++){(m=h[c]).start.row>=s.row&&m.shiftRow(-a);}r=o;}else {var d=Array(a);d.unshift(o,0);var g=t?this.$wrapData:this.$rowLengthCache;g.splice.apply(g,d);h=this.$foldData,c=0;if(m=this.getFoldLine(o)){var f=m.range.compareInside(n.row,n.column);0==f?(m=m.split(n.row,n.column))&&(m.shiftRow(a),m.addRemoveChars(r,0,s.column-n.column)):-1==f&&(m.addRemoveChars(o,0,s.column-n.column),m.shiftRow(a)),c=h.indexOf(m)+1;}for(;c<h.length;c++){var m;(m=h[c]).start.row>=o&&m.shiftRow(a);}}else a=Math.abs(e.start.column-e.end.column),"remove"===i&&(l=this.getFoldsInRange(e),this.removeFolds(l),a=-a),(m=this.getFoldLine(o))&&m.addRemoveChars(o,n.column,a);return t&&this.$wrapData.length!=this.doc.getLength()&&console.error("doc.getLength() and $wrapData.length have to be the same!"),this.$updating=!1,t?this.$updateWrapData(o,r):this.$updateRowLengthCache(o,r),l},this.$updateRowLengthCache=function(e,t,i){this.$rowLengthCache[e]=null,this.$rowLengthCache[t]=null;},this.$updateWrapData=function(i,n){var s,o,r=this.doc.getAllLines(),a=this.getTabSize(),l=this.$wrapData,h=this.$wrapLimit,c=i;for(n=Math.min(n,r.length-1);c<=n;)(o=this.getFoldLine(c,o))?(s=[],o.walk(function(i,n,o,a){var l;if(null!=i){(l=this.$getDisplayTokens(i,s.length))[0]=e;for(var h=1;h<l.length;h++)l[h]=t;}else l=this.$getDisplayTokens(r[n].substring(a,o),s.length);s=s.concat(l);}.bind(this),o.end.row,r[o.end.row].length+1),l[o.start.row]=this.$computeWrapSplits(s,h,a),c=o.end.row+1):(s=this.$getDisplayTokens(r[c]),l[c]=this.$computeWrapSplits(s,h,a),c++);};var e=3,t=4;function i(e){return !(e<4352)&&(e>=4352&&e<=4447||e>=4515&&e<=4519||e>=4602&&e<=4607||e>=9001&&e<=9002||e>=11904&&e<=11929||e>=11931&&e<=12019||e>=12032&&e<=12245||e>=12272&&e<=12283||e>=12288&&e<=12350||e>=12353&&e<=12438||e>=12441&&e<=12543||e>=12549&&e<=12589||e>=12593&&e<=12686||e>=12688&&e<=12730||e>=12736&&e<=12771||e>=12784&&e<=12830||e>=12832&&e<=12871||e>=12880&&e<=13054||e>=13056&&e<=19903||e>=19968&&e<=42124||e>=42128&&e<=42182||e>=43360&&e<=43388||e>=44032&&e<=55203||e>=55216&&e<=55238||e>=55243&&e<=55291||e>=63744&&e<=64255||e>=65040&&e<=65049||e>=65072&&e<=65106||e>=65108&&e<=65126||e>=65128&&e<=65131||e>=65281&&e<=65376||e>=65504&&e<=65510)}this.$computeWrapSplits=function(i,n,s){if(0==i.length)return [];var o=[],r=i.length,a=0,l=0,h=this.$wrapAsCode,c=this.$indentedSoftWrap,u=n<=Math.max(2*s,8)||!1===c?0:Math.floor(n/2);function d(e){var t=i.slice(a,e),n=t.length;t.join("").replace(/12/g,(function(){n-=1;})).replace(/2/g,(function(){n-=1;})),o.length||(g=function(){var e=0;if(0===u)return e;if(c)for(var t=0;t<i.length;t++){var n=i[t];if(10==n)e+=1;else {if(11!=n){if(12==n)continue;break}e+=s;}}return h&&!1!==c&&(e+=s),Math.min(e,u)}(),o.indent=g),l+=n,o.push(l),a=e;}for(var g=0;r-a>n-g;){var f=a+n-g;if(i[f-1]>=10&&i[f]>=10)d(f);else if(i[f]!=e&&i[f]!=t){for(var m=Math.max(f-(n-(n>>2)),a-1);f>m&&i[f]<e;)f--;if(h){for(;f>m&&i[f]<e;)f--;for(;f>m&&9==i[f];)f--;}else for(;f>m&&i[f]<10;)f--;f>m?d(++f):(2==i[f=a+n]&&f--,d(f-g));}else {for(;f!=a-1&&i[f]!=e;f--);if(f>a){d(f);continue}for(f=a+n;f<i.length&&i[f]==t;f++);if(f==i.length)break;d(f);}}return o},this.$getDisplayTokens=function(e,t){var n,s=[];t=t||0;for(var o=0;o<e.length;o++){var r=e.charCodeAt(o);if(9==r){n=this.getScreenTabSize(s.length+t),s.push(11);for(var a=1;a<n;a++)s.push(12);}else 32==r?s.push(10):r>39&&r<48||r>57&&r<64?s.push(9):r>=4352&&i(r)?s.push(1,2):s.push(1);}return s},this.$getStringScreenWidth=function(e,t,n){if(0==t)return [0,0];var s,o;for(null==t&&(t=1/0),n=n||0,o=0;o<e.length&&(9==(s=e.charCodeAt(o))?n+=this.getScreenTabSize(n):s>=4352&&i(s)?n+=2:n+=1,!(n>t));o++);return [n,o]},this.lineWidgets=null,this.getRowLength=function(e){if(this.lineWidgets)var t=this.lineWidgets[e]&&this.lineWidgets[e].rowCount||0;else t=0;return this.$useWrapMode&&this.$wrapData[e]?this.$wrapData[e].length+1+t:1+t},this.getRowLineCount=function(e){return this.$useWrapMode&&this.$wrapData[e]?this.$wrapData[e].length+1:1},this.getRowWrapIndent=function(e){if(this.$useWrapMode){var t=this.screenToDocumentPosition(e,Number.MAX_VALUE),i=this.$wrapData[t.row];return i.length&&i[0]<t.column?i.indent:0}return 0},this.getScreenLastRowColumn=function(e){var t=this.screenToDocumentPosition(e,Number.MAX_VALUE);return this.documentToScreenColumn(t.row,t.column)},this.getDocumentLastRowColumn=function(e,t){var i=this.documentToScreenRow(e,t);return this.getScreenLastRowColumn(i)},this.getDocumentLastRowColumnPosition=function(e,t){var i=this.documentToScreenRow(e,t);return this.screenToDocumentPosition(i,Number.MAX_VALUE/10)},this.getRowSplitData=function(e){return this.$useWrapMode?this.$wrapData[e]:void 0},this.getScreenTabSize=function(e){return this.$tabSize-e%this.$tabSize},this.screenToDocumentRow=function(e,t){return this.screenToDocumentPosition(e,t).row},this.screenToDocumentColumn=function(e,t){return this.screenToDocumentPosition(e,t).column},this.screenToDocumentPosition=function(e,t,i){if(e<0)return {row:0,column:0};var n,s,o=0,r=0,a=0,l=0,h=this.$screenRowCache,c=this.$getRowCacheIndex(h,e),u=h.length;if(u&&c>=0){a=h[c],o=this.$docRowCache[c];var d=e>h[u-1];}else d=!u;for(var g=this.getLength()-1,f=this.getNextFoldLine(o),m=f?f.start.row:1/0;a<=e&&!(a+(l=this.getRowLength(o))>e||o>=g);)a+=l,++o>m&&(o=f.end.row+1,m=(f=this.getNextFoldLine(o,f))?f.start.row:1/0),d&&(this.$docRowCache.push(o),this.$screenRowCache.push(a));if(f&&f.start.row<=o)n=this.getFoldDisplayLine(f),o=f.start.row;else {if(a+l<=e||o>g)return {row:g,column:this.getLine(g).length};n=this.getLine(o),f=null;}var p=0,A=Math.floor(e-a);if(this.$useWrapMode){var C=this.$wrapData[o];C&&(s=C[A],A>0&&C.length&&(p=C.indent,r=C[A-1]||C[C.length-1],n=n.substring(r)));}return void 0!==i&&this.$bidiHandler.isBidiRow(a+A,o,A)&&(t=this.$bidiHandler.offsetToCol(i)),r+=this.$getStringScreenWidth(n,t-p)[1],this.$useWrapMode&&r>=s&&(r=s-1),f?f.idxToPosition(r):{row:o,column:r}},this.documentToScreenPosition=function(e,t){if(void 0===t)var i=this.$clipPositionToDocument(e.row,e.column);else i=this.$clipPositionToDocument(e,t);e=i.row,t=i.column;var n,s=0,o=null;(n=this.getFoldAt(e,t,1))&&(e=n.start.row,t=n.start.column);var r,a=0,l=this.$docRowCache,h=this.$getRowCacheIndex(l,e),c=l.length;if(c&&h>=0){a=l[h],s=this.$screenRowCache[h];var u=e>l[c-1];}else u=!c;for(var d=this.getNextFoldLine(a),g=d?d.start.row:1/0;a<e;){if(a>=g){if((r=d.end.row+1)>e)break;g=(d=this.getNextFoldLine(r,d))?d.start.row:1/0;}else r=a+1;s+=this.getRowLength(a),a=r,u&&(this.$docRowCache.push(a),this.$screenRowCache.push(s));}var f="";d&&a>=g?(f=this.getFoldDisplayLine(d,e,t),o=d.start.row):(f=this.getLine(e).substring(0,t),o=e);var m=0;if(this.$useWrapMode){var p=this.$wrapData[o];if(p){for(var A=0;f.length>=p[A];)s++,A++;f=f.substring(p[A-1]||0,f.length),m=A>0?p.indent:0;}}return {row:s,column:m+this.$getStringScreenWidth(f)[0]}},this.documentToScreenColumn=function(e,t){return this.documentToScreenPosition(e,t).column},this.documentToScreenRow=function(e,t){return this.documentToScreenPosition(e,t).row},this.getScreenLength=function(){var e=0,t=null;if(this.$useWrapMode)for(var i=this.$wrapData.length,n=0,s=(a=0,(t=this.$foldData[a++])?t.start.row:1/0);n<i;){var o=this.$wrapData[n];e+=o?o.length+1:1,++n>s&&(n=t.end.row+1,s=(t=this.$foldData[a++])?t.start.row:1/0);}else {e=this.getLength();for(var r=this.$foldData,a=0;a<r.length;a++)e-=(t=r[a]).end.row-t.start.row;}return this.lineWidgets&&(e+=this.$getWidgetScreenLength()),e},this.$setFontMetrics=function(e){this.$enableVarChar&&(this.$getStringScreenWidth=function(t,i,n){if(0===i)return [0,0];var s,o;for(i||(i=1/0),n=n||0,o=0;o<t.length&&!((n+="\t"===(s=t.charAt(o))?this.getScreenTabSize(n):e.getCharacterWidth(s))>i);o++);return [n,o]});},this.destroy=function(){this.bgTokenizer&&(this.bgTokenizer.setDocument(null),this.bgTokenizer=null),this.$stopWorker();},this.isFullWidth=i;}.call(f.prototype),e("./edit_session/folding").Folding.call(f.prototype),e("./edit_session/bracket_match").BracketMatch.call(f.prototype),r.defineOptions(f.prototype,"session",{wrap:{set:function(e){if(e&&"off"!=e?"free"==e?e=!0:"printMargin"==e?e=-1:"string"==typeof e&&(e=parseInt(e,10)||!1):e=!1,this.$wrap!=e)if(this.$wrap=e,e){var t="number"==typeof e?e:null;this.setWrapLimitRange(t,t),this.setUseWrapMode(!0);}else this.setUseWrapMode(!1);},get:function(){return this.getUseWrapMode()?-1==this.$wrap?"printMargin":this.getWrapLimitRange().min?this.$wrap:"free":"off"},handlesSet:!0},wrapMethod:{set:function(e){(e="auto"==e?"text"!=this.$mode.type:"text"!=e)!=this.$wrapAsCode&&(this.$wrapAsCode=e,this.$useWrapMode&&(this.$modified=!0,this.$resetRowCache(0),this.$updateWrapData(0,this.getLength()-1)));},initialValue:"auto"},indentedSoftWrap:{initialValue:!0},firstLineNumber:{set:function(){this._signal("changeBreakpoint");},initialValue:1},useWorker:{set:function(e){this.$useWorker=e,this.$stopWorker(),e&&this.$startWorker();},initialValue:!0},useSoftTabs:{initialValue:!0},tabSize:{set:function(e){isNaN(e)||this.$tabSize===e||(this.$modified=!0,this.$rowLengthCache=[],this.$tabSize=e,this._signal("changeTabSize"));},initialValue:4,handlesSet:!0},navigateWithinSoftTabs:{initialValue:!1},overwrite:{set:function(e){this._signal("changeOverwrite");},initialValue:!1},newLineMode:{set:function(e){this.doc.setNewLineMode(e);},get:function(){return this.doc.getNewLineMode()},handlesSet:!0},mode:{set:function(e){this.setMode(e);},get:function(){return this.$modeId}}}),t.EditSession=f;})),ace.define("ace/search",["require","exports","module","ace/lib/lang","ace/lib/oop","ace/range"],(function(e,t,i){var n=e("./lib/lang"),s=e("./lib/oop"),o=e("./range").Range,r=function(){this.$options={};};((function(){this.set=function(e){return s.mixin(this.$options,e),this},this.getOptions=function(){return n.copyObject(this.$options)},this.setOptions=function(e){this.$options=e;},this.find=function(e){var t=this.$options,i=this.$matchIterator(e,t);if(!i)return !1;var n=null;return i.forEach((function(e,i,s,r){return n=new o(e,i,s,r),!(i==r&&t.start&&t.start.start&&0!=t.skipCurrent&&n.isEqual(t.start))||(n=null,!1)})),n},this.findAll=function(e){var t=this.$options;if(!t.needle)return [];this.$assembleRegExp(t);var i=t.range,s=i?e.getLines(i.start.row,i.end.row):e.doc.getAllLines(),r=[],a=t.re;if(t.$isMultiLine){var l,h=a.length,c=s.length-h;e:for(var u=a.offset||0;u<=c;u++){for(var d=0;d<h;d++)if(-1==s[u+d].search(a[d]))continue e;var g=s[u],f=s[u+h-1],m=g.length-g.match(a[0])[0].length,p=f.match(a[h-1])[0].length;l&&l.end.row===u&&l.end.column>m||(r.push(l=new o(u,m,u+h-1,p)),h>2&&(u=u+h-2));}}else for(var A=0;A<s.length;A++){var C=n.getMatchOffsets(s[A],a);for(d=0;d<C.length;d++){var v=C[d];r.push(new o(A,v.offset,A,v.offset+v.length));}}if(i){var F=i.start.column,w=i.start.column;for(A=0,d=r.length-1;A<d&&r[A].start.column<F&&r[A].start.row==i.start.row;)A++;for(;A<d&&r[d].end.column>w&&r[d].end.row==i.end.row;)d--;for(r=r.slice(A,d+1),A=0,d=r.length;A<d;A++)r[A].start.row+=i.start.row,r[A].end.row+=i.start.row;}return r},this.replace=function(e,t){var i=this.$options,n=this.$assembleRegExp(i);if(i.$isMultiLine)return t;if(n){var s=n.exec(e);if(!s||s[0].length!=e.length)return null;if(t=e.replace(n,t),i.preserveCase){t=t.split("");for(var o=Math.min(e.length,e.length);o--;){var r=e[o];r&&r.toLowerCase()!=r?t[o]=t[o].toUpperCase():t[o]=t[o].toLowerCase();}t=t.join("");}return t}},this.$assembleRegExp=function(e,t){if(e.needle instanceof RegExp)return e.re=e.needle;var i=e.needle;if(!e.needle)return e.re=!1;e.regExp||(i=n.escapeRegExp(i)),e.wholeWord&&(i=function(e,t){function i(e){return /\w/.test(e)||t.regExp?"\\b":""}return i(e[0])+e+i(e[e.length-1])}(i,e));var s=e.caseSensitive?"gm":"gmi";if(e.$isMultiLine=!t&&/[\n\r]/.test(i),e.$isMultiLine)return e.re=this.$assembleMultilineRegExp(i,s);try{var o=new RegExp(i,s);}catch(e){o=!1;}return e.re=o},this.$assembleMultilineRegExp=function(e,t){for(var i=e.replace(/\r\n|\r|\n/g,"$\n^").split("\n"),n=[],s=0;s<i.length;s++)try{n.push(new RegExp(i[s],t));}catch(e){return !1}return n},this.$matchIterator=function(e,t){var i=this.$assembleRegExp(t);if(!i)return !1;var n=1==t.backwards,s=0!=t.skipCurrent,o=t.range,r=t.start;r||(r=o?o[n?"end":"start"]:e.selection.getRange()),r.start&&(r=r[s!=n?"end":"start"]);var a=o?o.start.row:0,l=o?o.end.row:e.getLength()-1;if(n)var h=function(e){var i=r.row;if(!u(i,r.column,e)){for(i--;i>=a;i--)if(u(i,Number.MAX_VALUE,e))return;if(0!=t.wrap)for(i=l,a=r.row;i>=a;i--)if(u(i,Number.MAX_VALUE,e))return}};else h=function(e){var i=r.row;if(!u(i,r.column,e)){for(i+=1;i<=l;i++)if(u(i,0,e))return;if(0!=t.wrap)for(i=a,l=r.row;i<=l;i++)if(u(i,0,e))return}};if(t.$isMultiLine)var c=i.length,u=function(t,s,o){var r=n?t-c+1:t;if(!(r<0)){var a=e.getLine(r),l=a.search(i[0]);if(!(!n&&l<s||-1===l)){for(var h=1;h<c;h++)if(-1==(a=e.getLine(r+h)).search(i[h]))return;var u=a.match(i[c-1])[0].length;if(!(n&&u>s))return !!o(r,l,r+c-1,u)||void 0}}};else if(n)u=function(t,n,s){var o,r=e.getLine(t),a=[],l=0;for(i.lastIndex=0;o=i.exec(r);){var h=o[0].length;if(l=o.index,!h){if(l>=r.length)break;i.lastIndex=l+=1;}if(o.index+h>n)break;a.push(o.index,h);}for(var c=a.length-1;c>=0;c-=2){var u=a[c-1];if(s(t,u,t,u+(h=a[c])))return !0}};else u=function(t,n,s){var o,r=e.getLine(t),a=n;for(i.lastIndex=n;o=i.exec(r);){var l=o[0].length;if(s(t,a=o.index,t,a+l))return !0;if(!l&&(i.lastIndex=a+=1,a>=r.length))return !1}};return {forEach:h}};})).call(r.prototype),t.Search=r;})),ace.define("ace/keyboard/hash_handler",["require","exports","module","ace/lib/keys","ace/lib/useragent"],(function(e,t,i){var n=e("../lib/keys"),s=e("../lib/useragent"),o=n.KEY_MODS;function r(e,t){this.platform=t||(s.isMac?"mac":"win"),this.commands={},this.commandKeyBinding={},this.addCommands(e),this.$singleCommand=!0;}function a(e,t){r.call(this,e,t),this.$singleCommand=!1;}a.prototype=r.prototype,function(){function e(e){return "object"==typeof e&&e.bindKey&&e.bindKey.position||(e.isDefault?-100:0)}this.addCommand=function(e){this.commands[e.name]&&this.removeCommand(e),this.commands[e.name]=e,e.bindKey&&this._buildKeyHash(e);},this.removeCommand=function(e,t){var i=e&&("string"==typeof e?e:e.name);e=this.commands[i],t||delete this.commands[i];var n=this.commandKeyBinding;for(var s in n){var o=n[s];if(o==e)delete n[s];else if(Array.isArray(o)){var r=o.indexOf(e);-1!=r&&(o.splice(r,1),1==o.length&&(n[s]=o[0]));}}},this.bindKey=function(e,t,i){if("object"==typeof e&&e&&(null==i&&(i=e.position),e=e[this.platform]),e)return "function"==typeof t?this.addCommand({exec:t,bindKey:e,name:t.name||e}):void e.split("|").forEach((function(e){var n="";if(-1!=e.indexOf(" ")){var s=e.split(/\s+/);e=s.pop(),s.forEach((function(e){var t=this.parseKeys(e),i=o[t.hashId]+t.key;n+=(n?" ":"")+i,this._addCommandToBinding(n,"chainKeys");}),this),n+=" ";}var r=this.parseKeys(e),a=o[r.hashId]+r.key;this._addCommandToBinding(n+a,t,i);}),this)},this._addCommandToBinding=function(t,i,n){var s,o=this.commandKeyBinding;if(i)if(!o[t]||this.$singleCommand)o[t]=i;else {Array.isArray(o[t])?-1!=(s=o[t].indexOf(i))&&o[t].splice(s,1):o[t]=[o[t]],"number"!=typeof n&&(n=e(i));var r=o[t];for(s=0;s<r.length;s++){if(e(r[s])>n)break}r.splice(s,0,i);}else delete o[t];},this.addCommands=function(e){e&&Object.keys(e).forEach((function(t){var i=e[t];if(i){if("string"==typeof i)return this.bindKey(i,t);"function"==typeof i&&(i={exec:i}),"object"==typeof i&&(i.name||(i.name=t),this.addCommand(i));}}),this);},this.removeCommands=function(e){Object.keys(e).forEach((function(t){this.removeCommand(e[t]);}),this);},this.bindKeys=function(e){Object.keys(e).forEach((function(t){this.bindKey(t,e[t]);}),this);},this._buildKeyHash=function(e){this.bindKey(e.bindKey,e);},this.parseKeys=function(e){var t=e.toLowerCase().split(/[\-\+]([\-\+])?/).filter((function(e){return e})),i=t.pop(),s=n[i];if(n.FUNCTION_KEYS[s])i=n.FUNCTION_KEYS[s].toLowerCase();else {if(!t.length)return {key:i,hashId:-1};if(1==t.length&&"shift"==t[0])return {key:i.toUpperCase(),hashId:-1}}for(var o=0,r=t.length;r--;){var a=n.KEY_MODS[t[r]];if(null==a)return "undefined"!=typeof console&&console.error("invalid modifier "+t[r]+" in "+e),!1;o|=a;}return {key:i,hashId:o}},this.findKeyCommand=function(e,t){var i=o[e]+t;return this.commandKeyBinding[i]},this.handleKeyboard=function(e,t,i,n){if(!(n<0)){var s=o[t]+i,r=this.commandKeyBinding[s];return e.$keyChain&&(e.$keyChain+=" "+s,r=this.commandKeyBinding[e.$keyChain]||r),!r||"chainKeys"!=r&&"chainKeys"!=r[r.length-1]?(e.$keyChain&&(t&&4!=t||1!=i.length?(-1==t||n>0)&&(e.$keyChain=""):e.$keyChain=e.$keyChain.slice(0,-s.length-1)),{command:r}):(e.$keyChain=e.$keyChain||s,{command:"null"})}},this.getStatusText=function(e,t){return t.$keyChain||""};}.call(r.prototype),t.HashHandler=r,t.MultiHashHandler=a;})),ace.define("ace/commands/command_manager",["require","exports","module","ace/lib/oop","ace/keyboard/hash_handler","ace/lib/event_emitter"],(function(e,t,i){var n=e("../lib/oop"),s=e("../keyboard/hash_handler").MultiHashHandler,o=e("../lib/event_emitter").EventEmitter,r=function(e,t){s.call(this,t,e),this.byName=this.commands,this.setDefaultHandler("exec",(function(e){return e.command.exec(e.editor,e.args||{})}));};n.inherits(r,s),function(){n.implement(this,o),this.exec=function(e,t,i){if(Array.isArray(e)){for(var n=e.length;n--;)if(this.exec(e[n],t,i))return !0;return !1}if("string"==typeof e&&(e=this.commands[e]),!e)return !1;if(t&&t.$readOnly&&!e.readOnly)return !1;if(e.isAvailable&&!e.isAvailable(t))return !1;var s={editor:t,command:e,args:i};return s.returnValue=this._emit("exec",s),this._signal("afterExec",s),!1!==s.returnValue},this.toggleRecording=function(e){if(!this.$inReplay)return e&&e._emit("changeStatus"),this.recording?(this.macro.pop(),this.removeEventListener("exec",this.$addCommandToMacro),this.macro.length||(this.macro=this.oldMacro),this.recording=!1):(this.$addCommandToMacro||(this.$addCommandToMacro=function(e){this.macro.push([e.command,e.args]);}.bind(this)),this.oldMacro=this.macro,this.macro=[],this.on("exec",this.$addCommandToMacro),this.recording=!0)},this.replay=function(e){if(!this.$inReplay&&this.macro){if(this.recording)return this.toggleRecording(e);try{this.$inReplay=!0,this.macro.forEach((function(t){"string"==typeof t?this.exec(t,e):this.exec(t[0],e,t[1]);}),this);}finally{this.$inReplay=!1;}}},this.trimMacro=function(e){return e.map((function(e){return "string"!=typeof e[0]&&(e[0]=e[0].name),e[1]||(e=e[0]),e}))};}.call(r.prototype),t.CommandManager=r;})),ace.define("ace/commands/default_commands",["require","exports","module","ace/lib/lang","ace/config","ace/range"],(function(e,t,i){var n=e("../lib/lang"),s=e("../config"),o=e("../range").Range;function r(e,t){return {win:e,mac:t}}t.commands=[{name:"showSettingsMenu",bindKey:r("Ctrl-,","Command-,"),exec:function(e){s.loadModule("ace/ext/settings_menu",(function(t){t.init(e),e.showSettingsMenu();}));},readOnly:!0},{name:"goToNextError",bindKey:r("Alt-E","F4"),exec:function(e){s.loadModule("ace/ext/error_marker",(function(t){t.showErrorMarker(e,1);}));},scrollIntoView:"animate",readOnly:!0},{name:"goToPreviousError",bindKey:r("Alt-Shift-E","Shift-F4"),exec:function(e){s.loadModule("ace/ext/error_marker",(function(t){t.showErrorMarker(e,-1);}));},scrollIntoView:"animate",readOnly:!0},{name:"selectall",bindKey:r("Ctrl-A","Command-A"),exec:function(e){e.selectAll();},readOnly:!0},{name:"centerselection",bindKey:r(null,"Ctrl-L"),exec:function(e){e.centerSelection();},readOnly:!0},{name:"gotoline",bindKey:r("Ctrl-L","Command-L"),exec:function(e){var t=parseInt(prompt("Enter line number:"),10);isNaN(t)||e.gotoLine(t);},readOnly:!0},{name:"fold",bindKey:r("Alt-L|Ctrl-F1","Command-Alt-L|Command-F1"),exec:function(e){e.session.toggleFold(!1);},multiSelectAction:"forEach",scrollIntoView:"center",readOnly:!0},{name:"unfold",bindKey:r("Alt-Shift-L|Ctrl-Shift-F1","Command-Alt-Shift-L|Command-Shift-F1"),exec:function(e){e.session.toggleFold(!0);},multiSelectAction:"forEach",scrollIntoView:"center",readOnly:!0},{name:"toggleFoldWidget",bindKey:r("F2","F2"),exec:function(e){e.session.toggleFoldWidget();},multiSelectAction:"forEach",scrollIntoView:"center",readOnly:!0},{name:"toggleParentFoldWidget",bindKey:r("Alt-F2","Alt-F2"),exec:function(e){e.session.toggleFoldWidget(!0);},multiSelectAction:"forEach",scrollIntoView:"center",readOnly:!0},{name:"foldall",bindKey:r(null,"Ctrl-Command-Option-0"),exec:function(e){e.session.foldAll();},scrollIntoView:"center",readOnly:!0},{name:"foldOther",bindKey:r("Alt-0","Command-Option-0"),exec:function(e){e.session.foldAll(),e.session.unfold(e.selection.getAllRanges());},scrollIntoView:"center",readOnly:!0},{name:"unfoldall",bindKey:r("Alt-Shift-0","Command-Option-Shift-0"),exec:function(e){e.session.unfold();},scrollIntoView:"center",readOnly:!0},{name:"findnext",bindKey:r("Ctrl-K","Command-G"),exec:function(e){e.findNext();},multiSelectAction:"forEach",scrollIntoView:"center",readOnly:!0},{name:"findprevious",bindKey:r("Ctrl-Shift-K","Command-Shift-G"),exec:function(e){e.findPrevious();},multiSelectAction:"forEach",scrollIntoView:"center",readOnly:!0},{name:"selectOrFindNext",bindKey:r("Alt-K","Ctrl-G"),exec:function(e){e.selection.isEmpty()?e.selection.selectWord():e.findNext();},readOnly:!0},{name:"selectOrFindPrevious",bindKey:r("Alt-Shift-K","Ctrl-Shift-G"),exec:function(e){e.selection.isEmpty()?e.selection.selectWord():e.findPrevious();},readOnly:!0},{name:"find",bindKey:r("Ctrl-F","Command-F"),exec:function(e){s.loadModule("ace/ext/searchbox",(function(t){t.Search(e);}));},readOnly:!0},{name:"overwrite",bindKey:"Insert",exec:function(e){e.toggleOverwrite();},readOnly:!0},{name:"selecttostart",bindKey:r("Ctrl-Shift-Home","Command-Shift-Home|Command-Shift-Up"),exec:function(e){e.getSelection().selectFileStart();},multiSelectAction:"forEach",readOnly:!0,scrollIntoView:"animate",aceCommandGroup:"fileJump"},{name:"gotostart",bindKey:r("Ctrl-Home","Command-Home|Command-Up"),exec:function(e){e.navigateFileStart();},multiSelectAction:"forEach",readOnly:!0,scrollIntoView:"animate",aceCommandGroup:"fileJump"},{name:"selectup",bindKey:r("Shift-Up","Shift-Up|Ctrl-Shift-P"),exec:function(e){e.getSelection().selectUp();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"golineup",bindKey:r("Up","Up|Ctrl-P"),exec:function(e,t){e.navigateUp(t.times);},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"selecttoend",bindKey:r("Ctrl-Shift-End","Command-Shift-End|Command-Shift-Down"),exec:function(e){e.getSelection().selectFileEnd();},multiSelectAction:"forEach",readOnly:!0,scrollIntoView:"animate",aceCommandGroup:"fileJump"},{name:"gotoend",bindKey:r("Ctrl-End","Command-End|Command-Down"),exec:function(e){e.navigateFileEnd();},multiSelectAction:"forEach",readOnly:!0,scrollIntoView:"animate",aceCommandGroup:"fileJump"},{name:"selectdown",bindKey:r("Shift-Down","Shift-Down|Ctrl-Shift-N"),exec:function(e){e.getSelection().selectDown();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"golinedown",bindKey:r("Down","Down|Ctrl-N"),exec:function(e,t){e.navigateDown(t.times);},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"selectwordleft",bindKey:r("Ctrl-Shift-Left","Option-Shift-Left"),exec:function(e){e.getSelection().selectWordLeft();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"gotowordleft",bindKey:r("Ctrl-Left","Option-Left"),exec:function(e){e.navigateWordLeft();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"selecttolinestart",bindKey:r("Alt-Shift-Left","Command-Shift-Left|Ctrl-Shift-A"),exec:function(e){e.getSelection().selectLineStart();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"gotolinestart",bindKey:r("Alt-Left|Home","Command-Left|Home|Ctrl-A"),exec:function(e){e.navigateLineStart();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"selectleft",bindKey:r("Shift-Left","Shift-Left|Ctrl-Shift-B"),exec:function(e){e.getSelection().selectLeft();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"gotoleft",bindKey:r("Left","Left|Ctrl-B"),exec:function(e,t){e.navigateLeft(t.times);},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"selectwordright",bindKey:r("Ctrl-Shift-Right","Option-Shift-Right"),exec:function(e){e.getSelection().selectWordRight();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"gotowordright",bindKey:r("Ctrl-Right","Option-Right"),exec:function(e){e.navigateWordRight();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"selecttolineend",bindKey:r("Alt-Shift-Right","Command-Shift-Right|Shift-End|Ctrl-Shift-E"),exec:function(e){e.getSelection().selectLineEnd();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"gotolineend",bindKey:r("Alt-Right|End","Command-Right|End|Ctrl-E"),exec:function(e){e.navigateLineEnd();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"selectright",bindKey:r("Shift-Right","Shift-Right"),exec:function(e){e.getSelection().selectRight();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"gotoright",bindKey:r("Right","Right|Ctrl-F"),exec:function(e,t){e.navigateRight(t.times);},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"selectpagedown",bindKey:"Shift-PageDown",exec:function(e){e.selectPageDown();},readOnly:!0},{name:"pagedown",bindKey:r(null,"Option-PageDown"),exec:function(e){e.scrollPageDown();},readOnly:!0},{name:"gotopagedown",bindKey:r("PageDown","PageDown|Ctrl-V"),exec:function(e){e.gotoPageDown();},readOnly:!0},{name:"selectpageup",bindKey:"Shift-PageUp",exec:function(e){e.selectPageUp();},readOnly:!0},{name:"pageup",bindKey:r(null,"Option-PageUp"),exec:function(e){e.scrollPageUp();},readOnly:!0},{name:"gotopageup",bindKey:"PageUp",exec:function(e){e.gotoPageUp();},readOnly:!0},{name:"scrollup",bindKey:r("Ctrl-Up",null),exec:function(e){e.renderer.scrollBy(0,-2*e.renderer.layerConfig.lineHeight);},readOnly:!0},{name:"scrolldown",bindKey:r("Ctrl-Down",null),exec:function(e){e.renderer.scrollBy(0,2*e.renderer.layerConfig.lineHeight);},readOnly:!0},{name:"selectlinestart",bindKey:"Shift-Home",exec:function(e){e.getSelection().selectLineStart();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"selectlineend",bindKey:"Shift-End",exec:function(e){e.getSelection().selectLineEnd();},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"togglerecording",bindKey:r("Ctrl-Alt-E","Command-Option-E"),exec:function(e){e.commands.toggleRecording(e);},readOnly:!0},{name:"replaymacro",bindKey:r("Ctrl-Shift-E","Command-Shift-E"),exec:function(e){e.commands.replay(e);},readOnly:!0},{name:"jumptomatching",bindKey:r("Ctrl-P","Ctrl-P"),exec:function(e){e.jumpToMatching();},multiSelectAction:"forEach",scrollIntoView:"animate",readOnly:!0},{name:"selecttomatching",bindKey:r("Ctrl-Shift-P","Ctrl-Shift-P"),exec:function(e){e.jumpToMatching(!0);},multiSelectAction:"forEach",scrollIntoView:"animate",readOnly:!0},{name:"expandToMatching",bindKey:r("Ctrl-Shift-M","Ctrl-Shift-M"),exec:function(e){e.jumpToMatching(!0,!0);},multiSelectAction:"forEach",scrollIntoView:"animate",readOnly:!0},{name:"passKeysToBrowser",bindKey:r(null,null),exec:function(){},passEvent:!0,readOnly:!0},{name:"copy",exec:function(e){},readOnly:!0},{name:"cut",exec:function(e){var t=e.getSelectionRange();e._emit("cut",t),e.selection.isEmpty()||(e.session.remove(t),e.clearSelection());},scrollIntoView:"cursor",multiSelectAction:"forEach"},{name:"paste",exec:function(e,t){e.$handlePaste(t);},scrollIntoView:"cursor"},{name:"removeline",bindKey:r("Ctrl-D","Command-D"),exec:function(e){e.removeLines();},scrollIntoView:"cursor",multiSelectAction:"forEachLine"},{name:"duplicateSelection",bindKey:r("Ctrl-Shift-D","Command-Shift-D"),exec:function(e){e.duplicateSelection();},scrollIntoView:"cursor",multiSelectAction:"forEach"},{name:"sortlines",bindKey:r("Ctrl-Alt-S","Command-Alt-S"),exec:function(e){e.sortLines();},scrollIntoView:"selection",multiSelectAction:"forEachLine"},{name:"togglecomment",bindKey:r("Ctrl-/","Command-/"),exec:function(e){e.toggleCommentLines();},multiSelectAction:"forEachLine",scrollIntoView:"selectionPart"},{name:"toggleBlockComment",bindKey:r("Ctrl-Shift-/","Command-Shift-/"),exec:function(e){e.toggleBlockComment();},multiSelectAction:"forEach",scrollIntoView:"selectionPart"},{name:"modifyNumberUp",bindKey:r("Ctrl-Shift-Up","Alt-Shift-Up"),exec:function(e){e.modifyNumber(1);},scrollIntoView:"cursor",multiSelectAction:"forEach"},{name:"modifyNumberDown",bindKey:r("Ctrl-Shift-Down","Alt-Shift-Down"),exec:function(e){e.modifyNumber(-1);},scrollIntoView:"cursor",multiSelectAction:"forEach"},{name:"replace",bindKey:r("Ctrl-H","Command-Option-F"),exec:function(e){s.loadModule("ace/ext/searchbox",(function(t){t.Search(e,!0);}));}},{name:"undo",bindKey:r("Ctrl-Z","Command-Z"),exec:function(e){e.undo();}},{name:"redo",bindKey:r("Ctrl-Shift-Z|Ctrl-Y","Command-Shift-Z|Command-Y"),exec:function(e){e.redo();}},{name:"copylinesup",bindKey:r("Alt-Shift-Up","Command-Option-Up"),exec:function(e){e.copyLinesUp();},scrollIntoView:"cursor"},{name:"movelinesup",bindKey:r("Alt-Up","Option-Up"),exec:function(e){e.moveLinesUp();},scrollIntoView:"cursor"},{name:"copylinesdown",bindKey:r("Alt-Shift-Down","Command-Option-Down"),exec:function(e){e.copyLinesDown();},scrollIntoView:"cursor"},{name:"movelinesdown",bindKey:r("Alt-Down","Option-Down"),exec:function(e){e.moveLinesDown();},scrollIntoView:"cursor"},{name:"del",bindKey:r("Delete","Delete|Ctrl-D|Shift-Delete"),exec:function(e){e.remove("right");},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"backspace",bindKey:r("Shift-Backspace|Backspace","Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"),exec:function(e){e.remove("left");},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"cut_or_delete",bindKey:r("Shift-Delete",null),exec:function(e){if(!e.selection.isEmpty())return !1;e.remove("left");},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"removetolinestart",bindKey:r("Alt-Backspace","Command-Backspace"),exec:function(e){e.removeToLineStart();},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"removetolineend",bindKey:r("Alt-Delete","Ctrl-K|Command-Delete"),exec:function(e){e.removeToLineEnd();},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"removetolinestarthard",bindKey:r("Ctrl-Shift-Backspace",null),exec:function(e){var t=e.selection.getRange();t.start.column=0,e.session.remove(t);},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"removetolineendhard",bindKey:r("Ctrl-Shift-Delete",null),exec:function(e){var t=e.selection.getRange();t.end.column=Number.MAX_VALUE,e.session.remove(t);},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"removewordleft",bindKey:r("Ctrl-Backspace","Alt-Backspace|Ctrl-Alt-Backspace"),exec:function(e){e.removeWordLeft();},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"removewordright",bindKey:r("Ctrl-Delete","Alt-Delete"),exec:function(e){e.removeWordRight();},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"outdent",bindKey:r("Shift-Tab","Shift-Tab"),exec:function(e){e.blockOutdent();},multiSelectAction:"forEach",scrollIntoView:"selectionPart"},{name:"indent",bindKey:r("Tab","Tab"),exec:function(e){e.indent();},multiSelectAction:"forEach",scrollIntoView:"selectionPart"},{name:"blockoutdent",bindKey:r("Ctrl-[","Ctrl-["),exec:function(e){e.blockOutdent();},multiSelectAction:"forEachLine",scrollIntoView:"selectionPart"},{name:"blockindent",bindKey:r("Ctrl-]","Ctrl-]"),exec:function(e){e.blockIndent();},multiSelectAction:"forEachLine",scrollIntoView:"selectionPart"},{name:"insertstring",exec:function(e,t){e.insert(t);},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"inserttext",exec:function(e,t){e.insert(n.stringRepeat(t.text||"",t.times||1));},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"splitline",bindKey:r(null,"Ctrl-O"),exec:function(e){e.splitLine();},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"transposeletters",bindKey:r("Alt-Shift-X","Ctrl-T"),exec:function(e){e.transposeLetters();},multiSelectAction:function(e){e.transposeSelections(1);},scrollIntoView:"cursor"},{name:"touppercase",bindKey:r("Ctrl-U","Ctrl-U"),exec:function(e){e.toUpperCase();},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"tolowercase",bindKey:r("Ctrl-Shift-U","Ctrl-Shift-U"),exec:function(e){e.toLowerCase();},multiSelectAction:"forEach",scrollIntoView:"cursor"},{name:"expandtoline",bindKey:r("Ctrl-Shift-L","Command-Shift-L"),exec:function(e){var t=e.selection.getRange();t.start.column=t.end.column=0,t.end.row++,e.selection.setRange(t,!1);},multiSelectAction:"forEach",scrollIntoView:"cursor",readOnly:!0},{name:"joinlines",bindKey:r(null,null),exec:function(e){for(var t=e.selection.isBackwards(),i=t?e.selection.getSelectionLead():e.selection.getSelectionAnchor(),s=t?e.selection.getSelectionAnchor():e.selection.getSelectionLead(),r=e.session.doc.getLine(i.row).length,a=e.session.doc.getTextRange(e.selection.getRange()).replace(/\n\s*/," ").length,l=e.session.doc.getLine(i.row),h=i.row+1;h<=s.row+1;h++){var c=n.stringTrimLeft(n.stringTrimRight(e.session.doc.getLine(h)));0!==c.length&&(c=" "+c),l+=c;}s.row+1<e.session.doc.getLength()-1&&(l+=e.session.doc.getNewLineCharacter()),e.clearSelection(),e.session.doc.replace(new o(i.row,0,s.row+2,0),l),a>0?(e.selection.moveCursorTo(i.row,i.column),e.selection.selectTo(i.row,i.column+a)):(r=e.session.doc.getLine(i.row).length>r?r+1:r,e.selection.moveCursorTo(i.row,r));},multiSelectAction:"forEach",readOnly:!0},{name:"invertSelection",bindKey:r(null,null),exec:function(e){var t=e.session.doc.getLength()-1,i=e.session.doc.getLine(t).length,n=e.selection.rangeList.ranges,s=[];n.length<1&&(n=[e.selection.getRange()]);for(var r=0;r<n.length;r++)r==n.length-1&&(n[r].end.row===t&&n[r].end.column===i||s.push(new o(n[r].end.row,n[r].end.column,t,i))),0===r?0===n[r].start.row&&0===n[r].start.column||s.push(new o(0,0,n[r].start.row,n[r].start.column)):s.push(new o(n[r-1].end.row,n[r-1].end.column,n[r].start.row,n[r].start.column));e.exitMultiSelectMode(),e.clearSelection();for(r=0;r<s.length;r++)e.selection.addRange(s[r],!1);},readOnly:!0,scrollIntoView:"none"}];})),ace.define("ace/editor",["require","exports","module","ace/lib/fixoldbrowsers","ace/lib/oop","ace/lib/dom","ace/lib/lang","ace/lib/useragent","ace/keyboard/textinput","ace/mouse/mouse_handler","ace/mouse/fold_handler","ace/keyboard/keybinding","ace/edit_session","ace/search","ace/range","ace/lib/event_emitter","ace/commands/command_manager","ace/commands/default_commands","ace/config","ace/token_iterator"],(function(e,t,i){e("./lib/fixoldbrowsers");var n=e("./lib/oop"),s=e("./lib/dom"),o=e("./lib/lang"),r=e("./lib/useragent"),a=e("./keyboard/textinput").TextInput,l=e("./mouse/mouse_handler").MouseHandler,h=e("./mouse/fold_handler").FoldHandler,c=e("./keyboard/keybinding").KeyBinding,u=e("./edit_session").EditSession,d=e("./search").Search,g=e("./range").Range,f=e("./lib/event_emitter").EventEmitter,m=e("./commands/command_manager").CommandManager,p=e("./commands/default_commands").commands,A=e("./config"),C=e("./token_iterator").TokenIterator,v=function(e,t){var i=e.getContainerElement();this.container=i,this.renderer=e,this.id="editor"+ ++v.$uid,this.commands=new m(r.isMac?"mac":"win",p),"object"==typeof document&&(this.textInput=new a(e.getTextAreaContainer(),this),this.renderer.textarea=this.textInput.getElement(),this.$mouseHandler=new l(this),new h(this)),this.keyBinding=new c(this),this.$blockScrolling=0,this.$search=(new d).set({wrap:!0}),this.$historyTracker=this.$historyTracker.bind(this),this.commands.on("exec",this.$historyTracker),this.$initOperationListeners(),this._$emitInputEvent=o.delayedCall(function(){this._signal("input",{}),this.session&&this.session.bgTokenizer&&this.session.bgTokenizer.scheduleStart();}.bind(this)),this.on("change",(function(e,t){t._$emitInputEvent.schedule(31);})),this.setSession(t||new u("")),A.resetOptions(this),A._signal("editor",this);};v.$uid=0,function(){n.implement(this,f),this.$initOperationListeners=function(){this.selections=[],this.commands.on("exec",this.startOperation.bind(this),!0),this.commands.on("afterExec",this.endOperation.bind(this),!0),this.$opResetTimer=o.delayedCall(this.endOperation.bind(this)),this.on("change",function(){this.curOp||this.startOperation(),this.curOp.docChanged=!0;}.bind(this),!0),this.on("changeSelection",function(){this.curOp||this.startOperation(),this.curOp.selectionChanged=!0;}.bind(this),!0);},this.curOp=null,this.prevOp={},this.startOperation=function(e){if(this.curOp){if(!e||this.curOp.command)return;this.prevOp=this.curOp;}e||(this.previousCommand=null,e={}),this.$opResetTimer.schedule(),this.curOp={command:e.command||{},args:e.args,scrollTop:this.renderer.scrollTop},this.curOp.command.name&&void 0!==this.curOp.command.scrollIntoView&&this.$blockScrolling++;},this.endOperation=function(e){if(this.curOp){if(e&&!1===e.returnValue)return this.curOp=null;this._signal("beforeEndOperation");var t=this.curOp.command;t.name&&this.$blockScrolling>0&&this.$blockScrolling--;var i=t&&t.scrollIntoView;if(i){switch(i){case"center-animate":i="animate";case"center":this.renderer.scrollCursorIntoView(null,.5);break;case"animate":case"cursor":this.renderer.scrollCursorIntoView();break;case"selectionPart":var n=this.selection.getRange(),s=this.renderer.layerConfig;(n.start.row>=s.lastRow||n.end.row<=s.firstRow)&&this.renderer.scrollSelectionIntoView(this.selection.anchor,this.selection.lead);}"animate"==i&&this.renderer.animateScrolling(this.curOp.scrollTop);}this.prevOp=this.curOp,this.curOp=null;}},this.$mergeableCommands=["backspace","del","insertstring"],this.$historyTracker=function(e){if(this.$mergeUndoDeltas){var t=this.prevOp,i=this.$mergeableCommands,n=t.command&&e.command.name==t.command.name;if("insertstring"==e.command.name){var s=e.args;void 0===this.mergeNextCommand&&(this.mergeNextCommand=!0),n=n&&this.mergeNextCommand&&(!/\s/.test(s)||/\s/.test(t.args)),this.mergeNextCommand=!0;}else n=n&&-1!==i.indexOf(e.command.name);"always"!=this.$mergeUndoDeltas&&Date.now()-this.sequenceStartTime>2e3&&(n=!1),n?this.session.mergeUndoDeltas=!0:-1!==i.indexOf(e.command.name)&&(this.sequenceStartTime=Date.now());}},this.setKeyboardHandler=function(e,t){if(e&&"string"==typeof e){this.$keybindingId=e;var i=this;A.loadModule(["keybinding",e],(function(n){i.$keybindingId==e&&i.keyBinding.setKeyboardHandler(n&&n.handler),t&&t();}));}else this.$keybindingId=null,this.keyBinding.setKeyboardHandler(e),t&&t();},this.getKeyboardHandler=function(){return this.keyBinding.getKeyboardHandler()},this.setSession=function(e){if(this.session!=e){this.curOp&&this.endOperation(),this.curOp={};var t=this.session;if(t){this.session.off("change",this.$onDocumentChange),this.session.off("changeMode",this.$onChangeMode),this.session.off("tokenizerUpdate",this.$onTokenizerUpdate),this.session.off("changeTabSize",this.$onChangeTabSize),this.session.off("changeWrapLimit",this.$onChangeWrapLimit),this.session.off("changeWrapMode",this.$onChangeWrapMode),this.session.off("changeFold",this.$onChangeFold),this.session.off("changeFrontMarker",this.$onChangeFrontMarker),this.session.off("changeBackMarker",this.$onChangeBackMarker),this.session.off("changeBreakpoint",this.$onChangeBreakpoint),this.session.off("changeAnnotation",this.$onChangeAnnotation),this.session.off("changeOverwrite",this.$onCursorChange),this.session.off("changeScrollTop",this.$onScrollTopChange),this.session.off("changeScrollLeft",this.$onScrollLeftChange);var i=this.session.getSelection();i.off("changeCursor",this.$onCursorChange),i.off("changeSelection",this.$onSelectionChange);}this.session=e,e?(this.$onDocumentChange=this.onDocumentChange.bind(this),e.on("change",this.$onDocumentChange),this.renderer.setSession(e),this.$onChangeMode=this.onChangeMode.bind(this),e.on("changeMode",this.$onChangeMode),this.$onTokenizerUpdate=this.onTokenizerUpdate.bind(this),e.on("tokenizerUpdate",this.$onTokenizerUpdate),this.$onChangeTabSize=this.renderer.onChangeTabSize.bind(this.renderer),e.on("changeTabSize",this.$onChangeTabSize),this.$onChangeWrapLimit=this.onChangeWrapLimit.bind(this),e.on("changeWrapLimit",this.$onChangeWrapLimit),this.$onChangeWrapMode=this.onChangeWrapMode.bind(this),e.on("changeWrapMode",this.$onChangeWrapMode),this.$onChangeFold=this.onChangeFold.bind(this),e.on("changeFold",this.$onChangeFold),this.$onChangeFrontMarker=this.onChangeFrontMarker.bind(this),this.session.on("changeFrontMarker",this.$onChangeFrontMarker),this.$onChangeBackMarker=this.onChangeBackMarker.bind(this),this.session.on("changeBackMarker",this.$onChangeBackMarker),this.$onChangeBreakpoint=this.onChangeBreakpoint.bind(this),this.session.on("changeBreakpoint",this.$onChangeBreakpoint),this.$onChangeAnnotation=this.onChangeAnnotation.bind(this),this.session.on("changeAnnotation",this.$onChangeAnnotation),this.$onCursorChange=this.onCursorChange.bind(this),this.session.on("changeOverwrite",this.$onCursorChange),this.$onScrollTopChange=this.onScrollTopChange.bind(this),this.session.on("changeScrollTop",this.$onScrollTopChange),this.$onScrollLeftChange=this.onScrollLeftChange.bind(this),this.session.on("changeScrollLeft",this.$onScrollLeftChange),this.selection=e.getSelection(),this.selection.on("changeCursor",this.$onCursorChange),this.$onSelectionChange=this.onSelectionChange.bind(this),this.selection.on("changeSelection",this.$onSelectionChange),this.onChangeMode(),this.$blockScrolling+=1,this.onCursorChange(),this.$blockScrolling-=1,this.onScrollTopChange(),this.onScrollLeftChange(),this.onSelectionChange(),this.onChangeFrontMarker(),this.onChangeBackMarker(),this.onChangeBreakpoint(),this.onChangeAnnotation(),this.session.getUseWrapMode()&&this.renderer.adjustWrapLimit(),this.renderer.updateFull()):(this.selection=null,this.renderer.setSession(e)),this._signal("changeSession",{session:e,oldSession:t}),this.curOp=null,t&&t._signal("changeEditor",{oldEditor:this}),e&&e._signal("changeEditor",{editor:this}),e&&e.bgTokenizer&&e.bgTokenizer.scheduleStart();}},this.getSession=function(){return this.session},this.setValue=function(e,t){return this.session.doc.setValue(e),t?1==t?this.navigateFileEnd():-1==t&&this.navigateFileStart():this.selectAll(),e},this.getValue=function(){return this.session.getValue()},this.getSelection=function(){return this.selection},this.resize=function(e){this.renderer.onResize(e);},this.setTheme=function(e,t){this.renderer.setTheme(e,t);},this.getTheme=function(){return this.renderer.getTheme()},this.setStyle=function(e){this.renderer.setStyle(e);},this.unsetStyle=function(e){this.renderer.unsetStyle(e);},this.getFontSize=function(){return this.getOption("fontSize")||s.computedStyle(this.container,"fontSize")},this.setFontSize=function(e){this.setOption("fontSize",e);},this.$highlightBrackets=function(){if(this.session.$bracketHighlight&&(this.session.removeMarker(this.session.$bracketHighlight),this.session.$bracketHighlight=null),!this.$highlightPending){var e=this;this.$highlightPending=!0,setTimeout((function(){e.$highlightPending=!1;var t=e.session;if(t&&t.bgTokenizer){var i=t.findMatchingBracket(e.getCursorPosition());if(i)var n=new g(i.row,i.column,i.row,i.column+1);else if(t.$mode.getMatching)n=t.$mode.getMatching(e.session);n&&(t.$bracketHighlight=t.addMarker(n,"ace_bracket","text"));}}),50);}},this.$highlightTags=function(){if(!this.$highlightTagPending){var e=this;this.$highlightTagPending=!0,setTimeout((function(){e.$highlightTagPending=!1;var t=e.session;if(t&&t.bgTokenizer){var i=e.getCursorPosition(),n=new C(e.session,i.row,i.column),s=n.getCurrentToken();if(!s||!/\b(?:tag-open|tag-name)/.test(s.type))return t.removeMarker(t.$tagHighlight),void(t.$tagHighlight=null);if(-1==s.type.indexOf("tag-open")||(s=n.stepForward())){var o=s.value,r=0,a=n.stepBackward();if("<"==a.value)do{a=s,(s=n.stepForward())&&s.value===o&&-1!==s.type.indexOf("tag-name")&&("<"===a.value?r++:"</"===a.value&&r--);}while(s&&r>=0);else {do{s=a,a=n.stepBackward(),s&&s.value===o&&-1!==s.type.indexOf("tag-name")&&("<"===a.value?r++:"</"===a.value&&r--);}while(a&&r<=0);n.stepForward();}if(!s)return t.removeMarker(t.$tagHighlight),void(t.$tagHighlight=null);var l=n.getCurrentTokenRow(),h=n.getCurrentTokenColumn(),c=new g(l,h,l,h+s.value.length),u=t.$backMarkers[t.$tagHighlight];t.$tagHighlight&&null!=u&&0!==c.compareRange(u.range)&&(t.removeMarker(t.$tagHighlight),t.$tagHighlight=null),c&&!t.$tagHighlight&&(t.$tagHighlight=t.addMarker(c,"ace_bracket","text"));}}}),50);}},this.focus=function(){var e=this;setTimeout((function(){e.textInput.focus();})),this.textInput.focus();},this.isFocused=function(){return this.textInput.isFocused()},this.blur=function(){this.textInput.blur();},this.onFocus=function(e){this.$isFocused||(this.$isFocused=!0,this.renderer.showCursor(),this.renderer.visualizeFocus(),this._emit("focus",e));},this.onBlur=function(e){this.$isFocused&&(this.$isFocused=!1,this.renderer.hideCursor(),this.renderer.visualizeBlur(),this._emit("blur",e));},this.$cursorChange=function(){this.renderer.updateCursor();},this.onDocumentChange=function(e){var t=this.session.$useWrapMode,i=e.start.row==e.end.row?e.end.row:1/0;this.renderer.updateLines(e.start.row,i,t),this._signal("change",e),this.$cursorChange(),this.$updateHighlightActiveLine();},this.onTokenizerUpdate=function(e){var t=e.data;this.renderer.updateLines(t.first,t.last);},this.onScrollTopChange=function(){this.renderer.scrollToY(this.session.getScrollTop());},this.onScrollLeftChange=function(){this.renderer.scrollToX(this.session.getScrollLeft());},this.onCursorChange=function(){this.$cursorChange(),this.$blockScrolling||(A.warn("Automatically scrolling cursor into view after selection change","this will be disabled in the next version","set editor.$blockScrolling = Infinity to disable this message"),this.renderer.scrollCursorIntoView()),this.$highlightBrackets(),this.$highlightTags(),this.$updateHighlightActiveLine(),this._signal("changeSelection");},this.$updateHighlightActiveLine=function(){var e,t=this.getSession();if(this.$highlightActiveLine&&("line"==this.$selectionStyle&&this.selection.isMultiLine()||(e=this.getCursorPosition()),!this.renderer.$maxLines||1!==this.session.getLength()||this.renderer.$minLines>1||(e=!1)),t.$highlightLineMarker&&!e)t.removeMarker(t.$highlightLineMarker.id),t.$highlightLineMarker=null;else if(!t.$highlightLineMarker&&e){var i=new g(e.row,e.column,e.row,1/0);i.id=t.addMarker(i,"ace_active-line","screenLine"),t.$highlightLineMarker=i;}else e&&(t.$highlightLineMarker.start.row=e.row,t.$highlightLineMarker.end.row=e.row,t.$highlightLineMarker.start.column=e.column,t._signal("changeBackMarker"));},this.onSelectionChange=function(e){var t=this.session;if(t.$selectionMarker&&t.removeMarker(t.$selectionMarker),t.$selectionMarker=null,this.selection.isEmpty())this.$updateHighlightActiveLine();else {var i=this.selection.getRange(),n=this.getSelectionStyle();t.$selectionMarker=t.addMarker(i,"ace_selection",n);}var s=this.$highlightSelectedWord&&this.$getSelectionHighLightRegexp();this.session.highlight(s),this._signal("changeSelection");},this.$getSelectionHighLightRegexp=function(){var e=this.session,t=this.getSelectionRange();if(!t.isEmpty()&&!t.isMultiLine()){var i=t.start.column-1,n=t.end.column+1,s=e.getLine(t.start.row),o=s.length,r=s.substring(Math.max(i,0),Math.min(n,o));if(!(i>=0&&/^[\w\d]/.test(r)||n<=o&&/[\w\d]$/.test(r)))if(r=s.substring(t.start.column,t.end.column),/^[\w\d]+$/.test(r))return this.$search.$assembleRegExp({wholeWord:!0,caseSensitive:!0,needle:r})}},this.onChangeFrontMarker=function(){this.renderer.updateFrontMarkers();},this.onChangeBackMarker=function(){this.renderer.updateBackMarkers();},this.onChangeBreakpoint=function(){this.renderer.updateBreakpoints();},this.onChangeAnnotation=function(){this.renderer.setAnnotations(this.session.getAnnotations());},this.onChangeMode=function(e){this.renderer.updateText(),this._emit("changeMode",e);},this.onChangeWrapLimit=function(){this.renderer.updateFull();},this.onChangeWrapMode=function(){this.renderer.onResize(!0);},this.onChangeFold=function(){this.$updateHighlightActiveLine(),this.renderer.updateFull();},this.getSelectedText=function(){return this.session.getTextRange(this.getSelectionRange())},this.getCopyText=function(){var e=this.getSelectedText();return this._signal("copy",e),e},this.onCopy=function(){this.commands.exec("copy",this);},this.onCut=function(){this.commands.exec("cut",this);},this.onPaste=function(e,t){var i={text:e,event:t};this.commands.exec("paste",this,i);},this.$handlePaste=function(e){"string"==typeof e&&(e={text:e}),this._signal("paste",e);var t=e.text;if(!this.inMultiSelectMode||this.inVirtualSelectionMode)this.insert(t);else {var i=t.split(/\r\n|\r|\n/),n=this.selection.rangeList.ranges;if(i.length>n.length||i.length<2||!i[1])return this.commands.exec("insertstring",this,t);for(var s=n.length;s--;){var o=n[s];o.isEmpty()||this.session.remove(o),this.session.insert(o.start,i[s]);}}},this.execCommand=function(e,t){return this.commands.exec(e,this,t)},this.insert=function(e,t){var i=this.session,n=i.getMode(),s=this.getCursorPosition();if(this.getBehavioursEnabled()&&!t){var o=n.transformAction(i.getState(s.row),"insertion",this,i,e);o&&(e!==o.text&&(this.session.mergeUndoDeltas=!1,this.$mergeNextCommand=!1),e=o.text);}if("\t"==e&&(e=this.session.getTabString()),this.selection.isEmpty()){if(this.session.getOverwrite()&&-1==e.indexOf("\n")){(r=new g.fromPoints(s,s)).end.column+=e.length,this.session.remove(r);}}else {var r=this.getSelectionRange();s=this.session.remove(r),this.clearSelection();}if("\n"==e||"\r\n"==e){var a=i.getLine(s.row);if(s.column>a.search(/\S|$/)){var l=a.substr(s.column).search(/\S|$/);i.doc.removeInLine(s.row,s.column,s.column+l);}}this.clearSelection();var h=s.column,c=i.getState(s.row),u=(a=i.getLine(s.row),n.checkOutdent(c,a,e));if(i.insert(s,e),o&&o.selection&&(2==o.selection.length?this.selection.setSelectionRange(new g(s.row,h+o.selection[0],s.row,h+o.selection[1])):this.selection.setSelectionRange(new g(s.row+o.selection[0],o.selection[1],s.row+o.selection[2],o.selection[3]))),i.getDocument().isNewLine(e)){var d=n.getNextLineIndent(c,a.slice(0,s.column),i.getTabString());i.insert({row:s.row+1,column:0},d);}u&&n.autoOutdent(c,i,s.row);},this.onTextInput=function(e){this.keyBinding.onTextInput(e);},this.onCommandKey=function(e,t,i){this.keyBinding.onCommandKey(e,t,i);},this.setOverwrite=function(e){this.session.setOverwrite(e);},this.getOverwrite=function(){return this.session.getOverwrite()},this.toggleOverwrite=function(){this.session.toggleOverwrite();},this.setScrollSpeed=function(e){this.setOption("scrollSpeed",e);},this.getScrollSpeed=function(){return this.getOption("scrollSpeed")},this.setDragDelay=function(e){this.setOption("dragDelay",e);},this.getDragDelay=function(){return this.getOption("dragDelay")},this.setSelectionStyle=function(e){this.setOption("selectionStyle",e);},this.getSelectionStyle=function(){return this.getOption("selectionStyle")},this.setHighlightActiveLine=function(e){this.setOption("highlightActiveLine",e);},this.getHighlightActiveLine=function(){return this.getOption("highlightActiveLine")},this.setHighlightGutterLine=function(e){this.setOption("highlightGutterLine",e);},this.getHighlightGutterLine=function(){return this.getOption("highlightGutterLine")},this.setHighlightSelectedWord=function(e){this.setOption("highlightSelectedWord",e);},this.getHighlightSelectedWord=function(){return this.$highlightSelectedWord},this.setAnimatedScroll=function(e){this.renderer.setAnimatedScroll(e);},this.getAnimatedScroll=function(){return this.renderer.getAnimatedScroll()},this.setShowInvisibles=function(e){this.renderer.setShowInvisibles(e);},this.getShowInvisibles=function(){return this.renderer.getShowInvisibles()},this.setDisplayIndentGuides=function(e){this.renderer.setDisplayIndentGuides(e);},this.getDisplayIndentGuides=function(){return this.renderer.getDisplayIndentGuides()},this.setShowPrintMargin=function(e){this.renderer.setShowPrintMargin(e);},this.getShowPrintMargin=function(){return this.renderer.getShowPrintMargin()},this.setPrintMarginColumn=function(e){this.renderer.setPrintMarginColumn(e);},this.getPrintMarginColumn=function(){return this.renderer.getPrintMarginColumn()},this.setReadOnly=function(e){this.setOption("readOnly",e);},this.getReadOnly=function(){return this.getOption("readOnly")},this.setBehavioursEnabled=function(e){this.setOption("behavioursEnabled",e);},this.getBehavioursEnabled=function(){return this.getOption("behavioursEnabled")},this.setWrapBehavioursEnabled=function(e){this.setOption("wrapBehavioursEnabled",e);},this.getWrapBehavioursEnabled=function(){return this.getOption("wrapBehavioursEnabled")},this.setShowFoldWidgets=function(e){this.setOption("showFoldWidgets",e);},this.getShowFoldWidgets=function(){return this.getOption("showFoldWidgets")},this.setFadeFoldWidgets=function(e){this.setOption("fadeFoldWidgets",e);},this.getFadeFoldWidgets=function(){return this.getOption("fadeFoldWidgets")},this.remove=function(e){this.selection.isEmpty()&&("left"==e?this.selection.selectLeft():this.selection.selectRight());var t=this.getSelectionRange();if(this.getBehavioursEnabled()){var i=this.session,n=i.getState(t.start.row),s=i.getMode().transformAction(n,"deletion",this,i,t);if(0===t.end.column){var o=i.getTextRange(t);if("\n"==o[o.length-1]){var r=i.getLine(t.end.row);/^\s+$/.test(r)&&(t.end.column=r.length);}}s&&(t=s);}this.session.remove(t),this.clearSelection();},this.removeWordRight=function(){this.selection.isEmpty()&&this.selection.selectWordRight(),this.session.remove(this.getSelectionRange()),this.clearSelection();},this.removeWordLeft=function(){this.selection.isEmpty()&&this.selection.selectWordLeft(),this.session.remove(this.getSelectionRange()),this.clearSelection();},this.removeToLineStart=function(){this.selection.isEmpty()&&this.selection.selectLineStart(),this.session.remove(this.getSelectionRange()),this.clearSelection();},this.removeToLineEnd=function(){this.selection.isEmpty()&&this.selection.selectLineEnd();var e=this.getSelectionRange();e.start.column==e.end.column&&e.start.row==e.end.row&&(e.end.column=0,e.end.row++),this.session.remove(e),this.clearSelection();},this.splitLine=function(){this.selection.isEmpty()||(this.session.remove(this.getSelectionRange()),this.clearSelection());var e=this.getCursorPosition();this.insert("\n"),this.moveCursorToPosition(e);},this.transposeLetters=function(){if(this.selection.isEmpty()){var e=this.getCursorPosition(),t=e.column;if(0!==t){var i,n,s=this.session.getLine(e.row);t<s.length?(i=s.charAt(t)+s.charAt(t-1),n=new g(e.row,t-1,e.row,t+1)):(i=s.charAt(t-1)+s.charAt(t-2),n=new g(e.row,t-2,e.row,t)),this.session.replace(n,i),this.session.selection.moveToPosition(n.end);}}},this.toLowerCase=function(){var e=this.getSelectionRange();this.selection.isEmpty()&&this.selection.selectWord();var t=this.getSelectionRange(),i=this.session.getTextRange(t);this.session.replace(t,i.toLowerCase()),this.selection.setSelectionRange(e);},this.toUpperCase=function(){var e=this.getSelectionRange();this.selection.isEmpty()&&this.selection.selectWord();var t=this.getSelectionRange(),i=this.session.getTextRange(t);this.session.replace(t,i.toUpperCase()),this.selection.setSelectionRange(e);},this.indent=function(){var e=this.session,t=this.getSelectionRange();if(!(t.start.row<t.end.row)){if(t.start.column<t.end.column){var i=e.getTextRange(t);if(!/^\s+$/.test(i)){c=this.$getSelectedRows();return void e.indentRows(c.first,c.last,"\t")}}var n=e.getLine(t.start.row),s=t.start,r=e.getTabSize(),a=e.documentToScreenColumn(s.row,s.column);if(this.session.getUseSoftTabs())var l=r-a%r,h=o.stringRepeat(" ",l);else {for(l=a%r;" "==n[t.start.column-1]&&l;)t.start.column--,l--;this.selection.setSelectionRange(t),h="\t";}return this.insert(h)}var c=this.$getSelectedRows();e.indentRows(c.first,c.last,"\t");},this.blockIndent=function(){var e=this.$getSelectedRows();this.session.indentRows(e.first,e.last,"\t");},this.blockOutdent=function(){var e=this.session.getSelection();this.session.outdentRows(e.getRange());},this.sortLines=function(){for(var e=this.$getSelectedRows(),t=this.session,i=[],n=e.first;n<=e.last;n++)i.push(t.getLine(n));i.sort((function(e,t){return e.toLowerCase()<t.toLowerCase()?-1:e.toLowerCase()>t.toLowerCase()?1:0}));var s=new g(0,0,0,0);for(n=e.first;n<=e.last;n++){var o=t.getLine(n);s.start.row=n,s.end.row=n,s.end.column=o.length,t.replace(s,i[n-e.first]);}},this.toggleCommentLines=function(){var e=this.session.getState(this.getCursorPosition().row),t=this.$getSelectedRows();this.session.getMode().toggleCommentLines(e,this.session,t.first,t.last);},this.toggleBlockComment=function(){var e=this.getCursorPosition(),t=this.session.getState(e.row),i=this.getSelectionRange();this.session.getMode().toggleBlockComment(t,this.session,i,e);},this.getNumberAt=function(e,t){var i=/[\-]?[0-9]+(?:\.[0-9]+)?/g;i.lastIndex=0;for(var n=this.session.getLine(e);i.lastIndex<t;){var s=i.exec(n);if(s.index<=t&&s.index+s[0].length>=t)return {value:s[0],start:s.index,end:s.index+s[0].length}}return null},this.modifyNumber=function(e){var t=this.selection.getCursor().row,i=this.selection.getCursor().column,n=new g(t,i-1,t,i),s=this.session.getTextRange(n);if(!isNaN(parseFloat(s))&&isFinite(s)){var o=this.getNumberAt(t,i);if(o){var r=o.value.indexOf(".")>=0?o.start+o.value.indexOf(".")+1:o.end,a=o.start+o.value.length-r,l=parseFloat(o.value);l*=Math.pow(10,a),r!==o.end&&i<r?e*=Math.pow(10,o.end-i-1):e*=Math.pow(10,o.end-i),l+=e;var h=(l/=Math.pow(10,a)).toFixed(a),c=new g(t,o.start,t,o.end);this.session.replace(c,h),this.moveCursorTo(t,Math.max(o.start+1,i+h.length-o.value.length));}}},this.removeLines=function(){var e=this.$getSelectedRows();this.session.removeFullLines(e.first,e.last),this.clearSelection();},this.duplicateSelection=function(){var e=this.selection,t=this.session,i=e.getRange(),n=e.isBackwards();if(i.isEmpty()){var s=i.start.row;t.duplicateLines(s,s);}else {var o=n?i.start:i.end,r=t.insert(o,t.getTextRange(i),!1);i.start=o,i.end=r,e.setSelectionRange(i,n);}},this.moveLinesDown=function(){this.$moveLines(1,!1);},this.moveLinesUp=function(){this.$moveLines(-1,!1);},this.moveText=function(e,t,i){return this.session.moveText(e,t,i)},this.copyLinesUp=function(){this.$moveLines(-1,!0);},this.copyLinesDown=function(){this.$moveLines(1,!0);},this.$moveLines=function(e,t){var i,n,s=this.selection;if(!s.inMultiSelectMode||this.inVirtualSelectionMode){var o=s.toOrientedRange();i=this.$getSelectedRows(o),n=this.session.$moveLines(i.first,i.last,t?0:e),t&&-1==e&&(n=0),o.moveBy(n,0),s.fromOrientedRange(o);}else {var r=s.rangeList.ranges;s.rangeList.detach(this.session),this.inVirtualSelectionMode=!0;for(var a=0,l=0,h=r.length,c=0;c<h;c++){var u=c;r[c].moveBy(a,0);for(var d=(i=this.$getSelectedRows(r[c])).first,g=i.last;++c<h;){l&&r[c].moveBy(l,0);var f=this.$getSelectedRows(r[c]);if(t&&f.first!=g)break;if(!t&&f.first>g+1)break;g=f.last;}for(c--,a=this.session.$moveLines(d,g,t?0:e),t&&-1==e&&(u=c+1);u<=c;)r[u].moveBy(a,0),u++;t||(a=0),l+=a;}s.fromOrientedRange(s.ranges[0]),s.rangeList.attach(this.session),this.inVirtualSelectionMode=!1;}},this.$getSelectedRows=function(e){return e=(e||this.getSelectionRange()).collapseRows(),{first:this.session.getRowFoldStart(e.start.row),last:this.session.getRowFoldEnd(e.end.row)}},this.onCompositionStart=function(e){this.renderer.showComposition(this.getCursorPosition());},this.onCompositionUpdate=function(e){this.renderer.setCompositionText(e);},this.onCompositionEnd=function(){this.renderer.hideComposition();},this.getFirstVisibleRow=function(){return this.renderer.getFirstVisibleRow()},this.getLastVisibleRow=function(){return this.renderer.getLastVisibleRow()},this.isRowVisible=function(e){return e>=this.getFirstVisibleRow()&&e<=this.getLastVisibleRow()},this.isRowFullyVisible=function(e){return e>=this.renderer.getFirstFullyVisibleRow()&&e<=this.renderer.getLastFullyVisibleRow()},this.$getVisibleRowCount=function(){return this.renderer.getScrollBottomRow()-this.renderer.getScrollTopRow()+1},this.$moveByPage=function(e,t){var i=this.renderer,n=this.renderer.layerConfig,s=e*Math.floor(n.height/n.lineHeight);this.$blockScrolling++,!0===t?this.selection.$moveSelection((function(){this.moveCursorBy(s,0);})):!1===t&&(this.selection.moveCursorBy(s,0),this.selection.clearSelection()),this.$blockScrolling--;var o=i.scrollTop;i.scrollBy(0,s*n.lineHeight),null!=t&&i.scrollCursorIntoView(null,.5),i.animateScrolling(o);},this.selectPageDown=function(){this.$moveByPage(1,!0);},this.selectPageUp=function(){this.$moveByPage(-1,!0);},this.gotoPageDown=function(){this.$moveByPage(1,!1);},this.gotoPageUp=function(){this.$moveByPage(-1,!1);},this.scrollPageDown=function(){this.$moveByPage(1);},this.scrollPageUp=function(){this.$moveByPage(-1);},this.scrollToRow=function(e){this.renderer.scrollToRow(e);},this.scrollToLine=function(e,t,i,n){this.renderer.scrollToLine(e,t,i,n);},this.centerSelection=function(){var e=this.getSelectionRange(),t={row:Math.floor(e.start.row+(e.end.row-e.start.row)/2),column:Math.floor(e.start.column+(e.end.column-e.start.column)/2)};this.renderer.alignCursor(t,.5);},this.getCursorPosition=function(){return this.selection.getCursor()},this.getCursorPositionScreen=function(){return this.session.documentToScreenPosition(this.getCursorPosition())},this.getSelectionRange=function(){return this.selection.getRange()},this.selectAll=function(){this.$blockScrolling+=1,this.selection.selectAll(),this.$blockScrolling-=1;},this.clearSelection=function(){this.selection.clearSelection();},this.moveCursorTo=function(e,t){this.selection.moveCursorTo(e,t);},this.moveCursorToPosition=function(e){this.selection.moveCursorToPosition(e);},this.jumpToMatching=function(e,t){var i=this.getCursorPosition(),n=new C(this.session,i.row,i.column),s=n.getCurrentToken(),o=s||n.stepForward();if(o){var r,a,l=!1,h={},c=i.column-o.start,u={")":"(","(":"(","]":"[","[":"[","{":"{","}":"{"};do{if(o.value.match(/[{}()\[\]]/g)){for(;c<o.value.length&&!l;c++)if(u[o.value[c]])switch(a=u[o.value[c]]+"."+o.type.replace("rparen","lparen"),isNaN(h[a])&&(h[a]=0),o.value[c]){case"(":case"[":case"{":h[a]++;break;case")":case"]":case"}":h[a]--,-1===h[a]&&(r="bracket",l=!0);}}else o&&-1!==o.type.indexOf("tag-name")&&(isNaN(h[o.value])&&(h[o.value]=0),"<"===s.value?h[o.value]++:"</"===s.value&&h[o.value]--,-1===h[o.value]&&(r="tag",l=!0));l||(s=o,o=n.stepForward(),c=0);}while(o&&!l);if(r){var d,f;if("bracket"===r)(d=this.session.getBracketRange(i))||(f=(d=new g(n.getCurrentTokenRow(),n.getCurrentTokenColumn()+c-1,n.getCurrentTokenRow(),n.getCurrentTokenColumn()+c-1)).start,(t||f.row===i.row&&Math.abs(f.column-i.column)<2)&&(d=this.session.getBracketRange(f)));else if("tag"===r){if(!o||-1===o.type.indexOf("tag-name"))return;var m=o.value;if(0===(d=new g(n.getCurrentTokenRow(),n.getCurrentTokenColumn()-2,n.getCurrentTokenRow(),n.getCurrentTokenColumn()-2)).compare(i.row,i.column)){l=!1;do{o=s,(s=n.stepBackward())&&(-1!==s.type.indexOf("tag-close")&&d.setEnd(n.getCurrentTokenRow(),n.getCurrentTokenColumn()+1),o.value===m&&-1!==o.type.indexOf("tag-name")&&("<"===s.value?h[m]++:"</"===s.value&&h[m]--,0===h[m]&&(l=!0)));}while(s&&!l)}o&&o.type.indexOf("tag-name")&&(f=d.start).row==i.row&&Math.abs(f.column-i.column)<2&&(f=d.end);}(f=d&&d.cursor||f)&&(e?d&&t?this.selection.setRange(d):d&&d.isEqual(this.getSelectionRange())?this.clearSelection():this.selection.selectTo(f.row,f.column):this.selection.moveTo(f.row,f.column));}}},this.gotoLine=function(e,t,i){this.selection.clearSelection(),this.session.unfold({row:e-1,column:t||0}),this.$blockScrolling+=1,this.exitMultiSelectMode&&this.exitMultiSelectMode(),this.moveCursorTo(e-1,t||0),this.$blockScrolling-=1,this.isRowFullyVisible(e-1)||this.scrollToLine(e-1,!0,i);},this.navigateTo=function(e,t){this.selection.moveTo(e,t);},this.navigateUp=function(e){if(this.selection.isMultiLine()&&!this.selection.isBackwards()){var t=this.selection.anchor.getPosition();return this.moveCursorToPosition(t)}this.selection.clearSelection(),this.selection.moveCursorBy(-e||-1,0);},this.navigateDown=function(e){if(this.selection.isMultiLine()&&this.selection.isBackwards()){var t=this.selection.anchor.getPosition();return this.moveCursorToPosition(t)}this.selection.clearSelection(),this.selection.moveCursorBy(e||1,0);},this.navigateLeft=function(e){if(this.selection.isEmpty())for(e=e||1;e--;)this.selection.moveCursorLeft();else {var t=this.getSelectionRange().start;this.moveCursorToPosition(t);}this.clearSelection();},this.navigateRight=function(e){if(this.selection.isEmpty())for(e=e||1;e--;)this.selection.moveCursorRight();else {var t=this.getSelectionRange().end;this.moveCursorToPosition(t);}this.clearSelection();},this.navigateLineStart=function(){this.selection.moveCursorLineStart(),this.clearSelection();},this.navigateLineEnd=function(){this.selection.moveCursorLineEnd(),this.clearSelection();},this.navigateFileEnd=function(){this.selection.moveCursorFileEnd(),this.clearSelection();},this.navigateFileStart=function(){this.selection.moveCursorFileStart(),this.clearSelection();},this.navigateWordRight=function(){this.selection.moveCursorWordRight(),this.clearSelection();},this.navigateWordLeft=function(){this.selection.moveCursorWordLeft(),this.clearSelection();},this.replace=function(e,t){t&&this.$search.set(t);var i=this.$search.find(this.session),n=0;return i?(this.$tryReplace(i,e)&&(n=1),null!==i&&(this.selection.setSelectionRange(i),this.renderer.scrollSelectionIntoView(i.start,i.end)),n):n},this.replaceAll=function(e,t){t&&this.$search.set(t);var i=this.$search.findAll(this.session),n=0;if(!i.length)return n;this.$blockScrolling+=1;var s=this.getSelectionRange();this.selection.moveTo(0,0);for(var o=i.length-1;o>=0;--o)this.$tryReplace(i[o],e)&&n++;return this.selection.setSelectionRange(s),this.$blockScrolling-=1,n},this.$tryReplace=function(e,t){var i=this.session.getTextRange(e);return null!==(t=this.$search.replace(i,t))?(e.end=this.session.replace(e,t),e):null},this.getLastSearchOptions=function(){return this.$search.getOptions()},this.find=function(e,t,i){t||(t={}),"string"==typeof e||e instanceof RegExp?t.needle=e:"object"==typeof e&&n.mixin(t,e);var s=this.selection.getRange();null==t.needle&&((e=this.session.getTextRange(s)||this.$search.$options.needle)||(s=this.session.getWordRange(s.start.row,s.start.column),e=this.session.getTextRange(s)),this.$search.set({needle:e})),this.$search.set(t),t.start||this.$search.set({start:s});var o=this.$search.find(this.session);return t.preventScroll?o:o?(this.revealRange(o,i),o):(t.backwards?s.start=s.end:s.end=s.start,void this.selection.setRange(s))},this.findNext=function(e,t){this.find({skipCurrent:!0,backwards:!1},e,t);},this.findPrevious=function(e,t){this.find(e,{skipCurrent:!0,backwards:!0},t);},this.revealRange=function(e,t){this.$blockScrolling+=1,this.session.unfold(e),this.selection.setSelectionRange(e),this.$blockScrolling-=1;var i=this.renderer.scrollTop;this.renderer.scrollSelectionIntoView(e.start,e.end,.5),!1!==t&&this.renderer.animateScrolling(i);},this.undo=function(){this.$blockScrolling++,this.session.getUndoManager().undo(),this.$blockScrolling--,this.renderer.scrollCursorIntoView(null,.5);},this.redo=function(){this.$blockScrolling++,this.session.getUndoManager().redo(),this.$blockScrolling--,this.renderer.scrollCursorIntoView(null,.5);},this.destroy=function(){this.renderer.destroy(),this._signal("destroy",this),this.session&&this.session.destroy();},this.setAutoScrollEditorIntoView=function(e){if(e){var t,i=this,n=!1;this.$scrollAnchor||(this.$scrollAnchor=document.createElement("div"));var s=this.$scrollAnchor;s.style.cssText="position:absolute",this.container.insertBefore(s,this.container.firstChild);var o=this.on("changeSelection",(function(){n=!0;})),r=this.renderer.on("beforeRender",(function(){n&&(t=i.renderer.container.getBoundingClientRect());})),a=this.renderer.on("afterRender",(function(){if(n&&t&&(i.isFocused()||i.searchBox&&i.searchBox.isFocused())){var e=i.renderer,o=e.$cursorLayer.$pixelPos,r=e.layerConfig,a=o.top-r.offset;null!=(n=o.top>=0&&a+t.top<0||!(o.top<r.height&&o.top+t.top+r.lineHeight>window.innerHeight)&&null)&&(s.style.top=a+"px",s.style.left=o.left+"px",s.style.height=r.lineHeight+"px",s.scrollIntoView(n)),n=t=null;}}));this.setAutoScrollEditorIntoView=function(e){e||(delete this.setAutoScrollEditorIntoView,this.off("changeSelection",o),this.renderer.off("afterRender",a),this.renderer.off("beforeRender",r));};}},this.$resetCursorStyle=function(){var e=this.$cursorStyle||"ace",t=this.renderer.$cursorLayer;t&&(t.setSmoothBlinking(/smooth/.test(e)),t.isBlinking=!this.$readOnly&&"wide"!=e,s.setCssClass(t.element,"ace_slim-cursors",/slim/.test(e)));};}.call(v.prototype),A.defineOptions(v.prototype,"editor",{selectionStyle:{set:function(e){this.onSelectionChange(),this._signal("changeSelectionStyle",{data:e});},initialValue:"line"},highlightActiveLine:{set:function(){this.$updateHighlightActiveLine();},initialValue:!0},highlightSelectedWord:{set:function(e){this.$onSelectionChange();},initialValue:!0},readOnly:{set:function(e){this.$resetCursorStyle();},initialValue:!1},cursorStyle:{set:function(e){this.$resetCursorStyle();},values:["ace","slim","smooth","wide"],initialValue:"ace"},mergeUndoDeltas:{values:[!1,!0,"always"],initialValue:!0},behavioursEnabled:{initialValue:!0},wrapBehavioursEnabled:{initialValue:!0},autoScrollEditorIntoView:{set:function(e){this.setAutoScrollEditorIntoView(e);}},keyboardHandler:{set:function(e){this.setKeyboardHandler(e);},get:function(){return this.keybindingId},handlesSet:!0},hScrollBarAlwaysVisible:"renderer",vScrollBarAlwaysVisible:"renderer",highlightGutterLine:"renderer",animatedScroll:"renderer",showInvisibles:"renderer",showPrintMargin:"renderer",printMarginColumn:"renderer",printMargin:"renderer",fadeFoldWidgets:"renderer",showFoldWidgets:"renderer",showLineNumbers:"renderer",showGutter:"renderer",displayIndentGuides:"renderer",fontSize:"renderer",fontFamily:"renderer",maxLines:"renderer",minLines:"renderer",scrollPastEnd:"renderer",fixedWidthGutter:"renderer",theme:"renderer",scrollSpeed:"$mouseHandler",dragDelay:"$mouseHandler",dragEnabled:"$mouseHandler",focusTimout:"$mouseHandler",tooltipFollowsMouse:"$mouseHandler",firstLineNumber:"session",overwrite:"session",newLineMode:"session",useWorker:"session",useSoftTabs:"session",tabSize:"session",wrap:"session",indentedSoftWrap:"session",foldStyle:"session",mode:"session"}),t.Editor=v;})),ace.define("ace/undomanager",["require","exports","module"],(function(e,t,i){var n=function(){this.reset();};((function(){function e(e){return {action:e.action,start:e.start,end:e.end,lines:1==e.lines.length?null:e.lines,text:1==e.lines.length?e.lines[0]:null}}function t(e){return {action:e.action,start:e.start,end:e.end,lines:e.lines||[e.text]}}function i(e,t){for(var i=new Array(e.length),n=0;n<e.length;n++){for(var s=e[n],o={group:s.group,deltas:new Array(s.length)},r=0;r<s.deltas.length;r++){var a=s.deltas[r];o.deltas[r]=t(a);}i[n]=o;}return i}this.execute=function(e){var t=e.args[0];this.$doc=e.args[1],e.merge&&this.hasUndo()&&(this.dirtyCounter--,t=this.$undoStack.pop().concat(t)),this.$undoStack.push(t),this.$redoStack=[],this.dirtyCounter<0&&(this.dirtyCounter=NaN),this.dirtyCounter++;},this.undo=function(e){var t=this.$undoStack.pop(),i=null;return t&&(i=this.$doc.undoChanges(t,e),this.$redoStack.push(t),this.dirtyCounter--),i},this.redo=function(e){var t=this.$redoStack.pop(),i=null;return t&&(i=this.$doc.redoChanges(this.$deserializeDeltas(t),e),this.$undoStack.push(t),this.dirtyCounter++),i},this.reset=function(){this.$undoStack=[],this.$redoStack=[],this.dirtyCounter=0;},this.hasUndo=function(){return this.$undoStack.length>0},this.hasRedo=function(){return this.$redoStack.length>0},this.markClean=function(){this.dirtyCounter=0;},this.isClean=function(){return 0===this.dirtyCounter},this.$serializeDeltas=function(t){return i(t,e)},this.$deserializeDeltas=function(e){return i(e,t)};})).call(n.prototype),t.UndoManager=n;})),ace.define("ace/layer/gutter",["require","exports","module","ace/lib/dom","ace/lib/oop","ace/lib/lang","ace/lib/event_emitter"],(function(e,t,i){var n=e("../lib/dom"),s=e("../lib/oop"),o=e("../lib/lang"),r=e("../lib/event_emitter").EventEmitter,a=function(e){this.element=n.createElement("div"),this.element.className="ace_layer ace_gutter-layer",e.appendChild(this.element),this.setShowFoldWidgets(this.$showFoldWidgets),this.gutterWidth=0,this.$annotations=[],this.$updateAnnotations=this.$updateAnnotations.bind(this),this.$cells=[];};((function(){s.implement(this,r),this.setSession=function(e){this.session&&this.session.removeEventListener("change",this.$updateAnnotations),this.session=e,e&&e.on("change",this.$updateAnnotations);},this.addGutterDecoration=function(e,t){window.console&&console.warn&&console.warn("deprecated use session.addGutterDecoration"),this.session.addGutterDecoration(e,t);},this.removeGutterDecoration=function(e,t){window.console&&console.warn&&console.warn("deprecated use session.removeGutterDecoration"),this.session.removeGutterDecoration(e,t);},this.setAnnotations=function(e){this.$annotations=[];for(var t=0;t<e.length;t++){var i=e[t],n=i.row,s=this.$annotations[n];s||(s=this.$annotations[n]={text:[]});var r=i.text;r=r?o.escapeHTML(r):i.html||"",-1===s.text.indexOf(r)&&s.text.push(r);var a=i.type;"error"==a?s.className=" ace_error":"warning"==a&&" ace_error"!=s.className?s.className=" ace_warning":"info"!=a||s.className||(s.className=" ace_info");}},this.$updateAnnotations=function(e){if(this.$annotations.length){var t=e.start.row,i=e.end.row-t;if(0===i);else if("remove"==e.action)this.$annotations.splice(t,i+1,null);else {var n=new Array(i+1);n.unshift(t,1),this.$annotations.splice.apply(this.$annotations,n);}}},this.update=function(e){for(var t=this.session,i=e.firstRow,s=Math.min(e.lastRow+e.gutterOffset,t.getLength()-1),o=t.getNextFoldLine(i),r=o?o.start.row:1/0,a=this.$showFoldWidgets&&t.foldWidgets,l=t.$breakpoints,h=t.$decorations,c=t.$firstLineNumber,u=0,d=t.gutterRenderer||this.$renderer,g=null,f=-1,m=i;;){if(m>r&&(m=o.end.row+1,r=(o=t.getNextFoldLine(m,o))?o.start.row:1/0),m>s){for(;this.$cells.length>f+1;)g=this.$cells.pop(),this.element.removeChild(g.element);break}(g=this.$cells[++f])||((g={element:null,textNode:null,foldWidget:null}).element=n.createElement("div"),g.textNode=document.createTextNode(""),g.element.appendChild(g.textNode),this.element.appendChild(g.element),this.$cells[f]=g);var p="ace_gutter-cell ";if(l[m]&&(p+=l[m]),h[m]&&(p+=h[m]),this.$annotations[m]&&(p+=this.$annotations[m].className),g.element.className!=p&&(g.element.className=p),(C=t.getRowLength(m)*e.lineHeight+"px")!=g.element.style.height&&(g.element.style.height=C),a){var A=a[m];null==A&&(A=a[m]=t.getFoldWidget(m));}if(A){g.foldWidget||(g.foldWidget=n.createElement("span"),g.element.appendChild(g.foldWidget));p="ace_fold-widget ace_"+A;"start"==A&&m==r&&m<o.end.row?p+=" ace_closed":p+=" ace_open",g.foldWidget.className!=p&&(g.foldWidget.className=p);var C=e.lineHeight+"px";g.foldWidget.style.height!=C&&(g.foldWidget.style.height=C);}else g.foldWidget&&(g.element.removeChild(g.foldWidget),g.foldWidget=null);var v=u=d?d.getText(t,m):m+c;v!==g.textNode.data&&(g.textNode.data=v),m++;}this.element.style.height=e.minHeight+"px",(this.$fixedWidth||t.$useWrapMode)&&(u=t.getLength()+c);var F=d?d.getWidth(t,u,e):u.toString().length*e.characterWidth,w=this.$padding||this.$computePadding();(F+=w.left+w.right)===this.gutterWidth||isNaN(F)||(this.gutterWidth=F,this.element.style.width=Math.ceil(this.gutterWidth)+"px",this._emit("changeGutterWidth",F));},this.$fixedWidth=!1,this.$showLineNumbers=!0,this.$renderer="",this.setShowLineNumbers=function(e){this.$renderer=!e&&{getWidth:function(){return ""},getText:function(){return ""}};},this.getShowLineNumbers=function(){return this.$showLineNumbers},this.$showFoldWidgets=!0,this.setShowFoldWidgets=function(e){e?n.addCssClass(this.element,"ace_folding-enabled"):n.removeCssClass(this.element,"ace_folding-enabled"),this.$showFoldWidgets=e,this.$padding=null;},this.getShowFoldWidgets=function(){return this.$showFoldWidgets},this.$computePadding=function(){if(!this.element.firstChild)return {left:0,right:0};var e=n.computedStyle(this.element.firstChild);return this.$padding={},this.$padding.left=parseInt(e.paddingLeft)+1||0,this.$padding.right=parseInt(e.paddingRight)||0,this.$padding},this.getRegion=function(e){var t=this.$padding||this.$computePadding(),i=this.element.getBoundingClientRect();return e.x<t.left+i.left?"markers":this.$showFoldWidgets&&e.x>i.right-t.right?"foldWidgets":void 0};})).call(a.prototype),t.Gutter=a;})),ace.define("ace/layer/marker",["require","exports","module","ace/range","ace/lib/dom"],(function(e,t,i){var n=e("../range").Range,s=e("../lib/dom"),o=function(e){this.element=s.createElement("div"),this.element.className="ace_layer ace_marker-layer",e.appendChild(this.element);};((function(){this.$padding=0,this.setPadding=function(e){this.$padding=e;},this.setSession=function(e){this.session=e;},this.setMarkers=function(e){this.markers=e;},this.update=function(e){if(e){this.config=e;var t=[];for(var i in this.markers){var n=this.markers[i];if(n.range){var s=n.range.clipRows(e.firstRow,e.lastRow);if(!s.isEmpty())if(s=s.toScreenRange(this.session),n.renderer){var o=this.$getTop(s.start.row,e),r=this.$padding+(this.session.$bidiHandler.isBidiRow(s.start.row)?this.session.$bidiHandler.getPosLeft(s.start.column):s.start.column*e.characterWidth);n.renderer(t,s,r,o,e);}else "fullLine"==n.type?this.drawFullLineMarker(t,s,n.clazz,e):"screenLine"==n.type?this.drawScreenLineMarker(t,s,n.clazz,e):s.isMultiLine()?"text"==n.type?this.drawTextMarker(t,s,n.clazz,e):this.drawMultiLineMarker(t,s,n.clazz,e):this.session.$bidiHandler.isBidiRow(s.start.row)?this.drawBidiSingleLineMarker(t,s,n.clazz+" ace_start ace_br15",e):this.drawSingleLineMarker(t,s,n.clazz+" ace_start ace_br15",e);}else n.update(t,this,this.session,e);}this.element.innerHTML=t.join("");}},this.$getTop=function(e,t){return (e-t.firstRowScreen)*t.lineHeight},this.drawTextMarker=function(e,t,i,s,o){for(var r=this.session,a=t.start.row,l=t.end.row,h=a,c=0,u=0,d=r.getScreenLastRowColumn(h),g=null,f=new n(h,t.start.column,h,u);h<=l;h++)f.start.row=f.end.row=h,f.start.column=h==a?t.start.column:r.getRowWrapIndent(h),f.end.column=d,c=u,u=d,d=h+1<l?r.getScreenLastRowColumn(h+1):h==l?0:t.end.column,g=i+(h==a?" ace_start":"")+" ace_br"+((h==a||h==a+1&&t.start.column?1:0)|(c<u?2:0)|(u>d?4:0)|(h==l?8:0)),this.session.$bidiHandler.isBidiRow(h)?this.drawBidiSingleLineMarker(e,f,g,s,h==l?0:1,o):this.drawSingleLineMarker(e,f,g,s,h==l?0:1,o);},this.drawMultiLineMarker=function(e,t,i,n,s){var o,r,a,l=this.$padding;(s=s||"",this.session.$bidiHandler.isBidiRow(t.start.row))?((h=t.clone()).end.row=h.start.row,h.end.column=this.session.getLine(h.start.row).length,this.drawBidiSingleLineMarker(e,h,i+" ace_br1 ace_start",n,null,s)):(o=n.lineHeight,r=this.$getTop(t.start.row,n),a=l+t.start.column*n.characterWidth,e.push("<div class='",i," ace_br1 ace_start' style='","height:",o,"px;","right:0;","top:",r,"px;","left:",a,"px;",s,"'></div>"));if(this.session.$bidiHandler.isBidiRow(t.end.row)){var h;(h=t.clone()).start.row=h.end.row,h.start.column=0,this.drawBidiSingleLineMarker(e,h,i+" ace_br12",n,null,s);}else {var c=t.end.column*n.characterWidth;o=n.lineHeight,r=this.$getTop(t.end.row,n),e.push("<div class='",i," ace_br12' style='","height:",o,"px;","width:",c,"px;","top:",r,"px;","left:",l,"px;",s,"'></div>");}if(!((o=(t.end.row-t.start.row-1)*n.lineHeight)<=0)){r=this.$getTop(t.start.row+1,n);var u=(t.start.column?1:0)|(t.end.column?0:8);e.push("<div class='",i,u?" ace_br"+u:"","' style='","height:",o,"px;","right:0;","top:",r,"px;","left:",l,"px;",s,"'></div>");}},this.drawSingleLineMarker=function(e,t,i,n,s,o){var r=n.lineHeight,a=(t.end.column+(s||0)-t.start.column)*n.characterWidth,l=this.$getTop(t.start.row,n),h=this.$padding+t.start.column*n.characterWidth;e.push("<div class='",i,"' style='","height:",r,"px;","width:",a,"px;","top:",l,"px;","left:",h,"px;",o||"","'></div>");},this.drawBidiSingleLineMarker=function(e,t,i,n,s,o){var r=n.lineHeight,a=this.$getTop(t.start.row,n),l=this.$padding;this.session.$bidiHandler.getSelections(t.start.column,t.end.column).forEach((function(t){e.push("<div class='",i,"' style='","height:",r,"px;","width:",t.width+(s||0),"px;","top:",a,"px;","left:",l+t.left,"px;",o||"","'></div>");}));},this.drawFullLineMarker=function(e,t,i,n,s){var o=this.$getTop(t.start.row,n),r=n.lineHeight;t.start.row!=t.end.row&&(r+=this.$getTop(t.end.row,n)-o),e.push("<div class='",i,"' style='","height:",r,"px;","top:",o,"px;","left:0;right:0;",s||"","'></div>");},this.drawScreenLineMarker=function(e,t,i,n,s){var o=this.$getTop(t.start.row,n),r=n.lineHeight;e.push("<div class='",i,"' style='","height:",r,"px;","top:",o,"px;","left:0;right:0;",s||"","'></div>");};})).call(o.prototype),t.Marker=o;})),ace.define("ace/layer/text",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/lib/lang","ace/lib/useragent","ace/lib/event_emitter"],(function(e,t,i){var n=e("../lib/oop"),s=e("../lib/dom"),o=e("../lib/lang");e("../lib/useragent");var r=e("../lib/event_emitter").EventEmitter,a=function(e){this.element=s.createElement("div"),this.element.className="ace_layer ace_text-layer",e.appendChild(this.element),this.$updateEolChar=this.$updateEolChar.bind(this);};((function(){n.implement(this,r),this.EOF_CHAR="¶",this.EOL_CHAR_LF="¬",this.EOL_CHAR_CRLF="¤",this.EOL_CHAR=this.EOL_CHAR_LF,this.TAB_CHAR="—",this.SPACE_CHAR="·",this.$padding=0,this.$updateEolChar=function(){var e="\n"==this.session.doc.getNewLineCharacter()?this.EOL_CHAR_LF:this.EOL_CHAR_CRLF;if(this.EOL_CHAR!=e)return this.EOL_CHAR=e,!0},this.setPadding=function(e){this.$padding=e,this.element.style.padding="0 "+e+"px";},this.getLineHeight=function(){return this.$fontMetrics.$characterSize.height||0},this.getCharacterWidth=function(){return this.$fontMetrics.$characterSize.width||0},this.$setFontMetrics=function(e){this.$fontMetrics=e,this.$fontMetrics.on("changeCharacterSize",function(e){this._signal("changeCharacterSize",e);}.bind(this)),this.$pollSizeChanges();},this.checkForSizeChanges=function(){this.$fontMetrics.checkForSizeChanges();},this.$pollSizeChanges=function(){return this.$pollSizeChangesTimer=this.$fontMetrics.$pollSizeChanges()},this.setSession=function(e){this.session=e,e&&this.$computeTabString();},this.showInvisibles=!1,this.setShowInvisibles=function(e){return this.showInvisibles!=e&&(this.showInvisibles=e,this.$computeTabString(),!0)},this.displayIndentGuides=!0,this.setDisplayIndentGuides=function(e){return this.displayIndentGuides!=e&&(this.displayIndentGuides=e,this.$computeTabString(),!0)},this.$tabStrings=[],this.onChangeTabSize=this.$computeTabString=function(){var e=this.session.getTabSize();this.tabSize=e;for(var t=this.$tabStrings=[0],i=1;i<e+1;i++)this.showInvisibles?t.push("<span class='ace_invisible ace_invisible_tab'>"+o.stringRepeat(this.TAB_CHAR,i)+"</span>"):t.push(o.stringRepeat(" ",i));if(this.displayIndentGuides){this.$indentGuideRe=/\s\S| \t|\t |\s$/;var n="ace_indent-guide",s="",r="";if(this.showInvisibles){n+=" ace_invisible",s=" ace_invisible_space",r=" ace_invisible_tab";var a=o.stringRepeat(this.SPACE_CHAR,this.tabSize),l=o.stringRepeat(this.TAB_CHAR,this.tabSize);}else l=a=o.stringRepeat(" ",this.tabSize);this.$tabStrings[" "]="<span class='"+n+s+"'>"+a+"</span>",this.$tabStrings["\t"]="<span class='"+n+r+"'>"+l+"</span>";}},this.updateLines=function(e,t,i){this.config.lastRow==e.lastRow&&this.config.firstRow==e.firstRow||this.scrollLines(e),this.config=e;for(var n=Math.max(t,e.firstRow),s=Math.min(i,e.lastRow),o=this.element.childNodes,r=0,a=e.firstRow;a<n;a++){if(l=this.session.getFoldLine(a)){if(l.containsRow(n)){n=l.start.row;break}a=l.end.row;}r++;}a=n;for(var l,h=(l=this.session.getNextFoldLine(a))?l.start.row:1/0;a>h&&(a=l.end.row+1,h=(l=this.session.getNextFoldLine(a,l))?l.start.row:1/0),!(a>s);){var c=o[r++];if(c){var u=[];this.$renderLine(u,a,!this.$useLineGroups(),a==h&&l),c.style.height=e.lineHeight*this.session.getRowLength(a)+"px",c.innerHTML=u.join("");}a++;}},this.scrollLines=function(e){var t=this.config;if(this.config=e,!t||t.lastRow<e.firstRow)return this.update(e);if(e.lastRow<t.firstRow)return this.update(e);var i=this.element;if(t.firstRow<e.firstRow)for(var n=this.session.getFoldedRowCount(t.firstRow,e.firstRow-1);n>0;n--)i.removeChild(i.firstChild);if(t.lastRow>e.lastRow)for(n=this.session.getFoldedRowCount(e.lastRow+1,t.lastRow);n>0;n--)i.removeChild(i.lastChild);if(e.firstRow<t.firstRow){var s=this.$renderLinesFragment(e,e.firstRow,t.firstRow-1);i.firstChild?i.insertBefore(s,i.firstChild):i.appendChild(s);}if(e.lastRow>t.lastRow){s=this.$renderLinesFragment(e,t.lastRow+1,e.lastRow);i.appendChild(s);}},this.$renderLinesFragment=function(e,t,i){for(var n=this.element.ownerDocument.createDocumentFragment(),o=t,r=this.session.getNextFoldLine(o),a=r?r.start.row:1/0;o>a&&(o=r.end.row+1,a=(r=this.session.getNextFoldLine(o,r))?r.start.row:1/0),!(o>i);){var l=s.createElement("div"),h=[];if(this.$renderLine(h,o,!1,o==a&&r),l.innerHTML=h.join(""),this.$useLineGroups())l.className="ace_line_group",n.appendChild(l),l.style.height=e.lineHeight*this.session.getRowLength(o)+"px";else for(;l.firstChild;)n.appendChild(l.firstChild);o++;}return n},this.update=function(e){this.config=e;for(var t=[],i=e.firstRow,n=e.lastRow,s=i,o=this.session.getNextFoldLine(s),r=o?o.start.row:1/0;s>r&&(s=o.end.row+1,r=(o=this.session.getNextFoldLine(s,o))?o.start.row:1/0),!(s>n);)this.$useLineGroups()&&t.push("<div class='ace_line_group' style='height:",e.lineHeight*this.session.getRowLength(s),"px'>"),this.$renderLine(t,s,!1,s==r&&o),this.$useLineGroups()&&t.push("</div>"),s++;this.element.innerHTML=t.join("");},this.$textToken={text:!0,rparen:!0,lparen:!0},this.$renderToken=function(e,t,i,n){var s=this,r=n.replace(/\t|&|<|>|( +)|([\x00-\x1f\x80-\xa0\xad\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\u3000\uFEFF\uFFF9-\uFFFC])|[\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g,(function(e,i,n,r,a){if(i)return s.showInvisibles?"<span class='ace_invisible ace_invisible_space'>"+o.stringRepeat(s.SPACE_CHAR,e.length)+"</span>":e;if("&"==e)return "&#38;";if("<"==e)return "&#60;";if(">"==e)return "&#62;";if("\t"==e){var l=s.session.getScreenTabSize(t+r);return t+=l-1,s.$tabStrings[l]}if("　"==e){var h=s.showInvisibles?"ace_cjk ace_invisible ace_invisible_space":"ace_cjk",c=s.showInvisibles?s.SPACE_CHAR:"";return t+=1,"<span class='"+h+"' style='width:"+2*s.config.characterWidth+"px'>"+c+"</span>"}return n?"<span class='ace_invisible ace_invisible_space ace_invalid'>"+s.SPACE_CHAR+"</span>":(t+=1,"<span class='ace_cjk' style='width:"+2*s.config.characterWidth+"px'>"+e+"</span>")}));if(this.$textToken[i.type])e.push(r);else {var a="ace_"+i.type.replace(/\./g," ace_"),l="";"fold"==i.type&&(l=" style='width:"+i.value.length*this.config.characterWidth+"px;' "),e.push("<span class='",a,"'",l,">",r,"</span>");}return t+n.length},this.renderIndentGuide=function(e,t,i){var n=t.search(this.$indentGuideRe);return n<=0||n>=i?t:" "==t[0]?(n-=n%this.tabSize,e.push(o.stringRepeat(this.$tabStrings[" "],n/this.tabSize)),t.substr(n)):"\t"==t[0]?(e.push(o.stringRepeat(this.$tabStrings["\t"],n)),t.substr(n)):t},this.$renderWrappedLine=function(e,t,i,n){for(var s=0,r=0,a=i[0],l=0,h=0;h<t.length;h++){var c=t[h],u=c.value;if(0==h&&this.displayIndentGuides){if(s=u.length,!(u=this.renderIndentGuide(e,u,a)))continue;s-=u.length;}if(s+u.length<a)l=this.$renderToken(e,l,c,u),s+=u.length;else {for(;s+u.length>=a;)l=this.$renderToken(e,l,c,u.substring(0,a-s)),u=u.substring(a-s),s=a,n||e.push("</div>","<div class='ace_line' style='height:",this.config.lineHeight,"px'>"),e.push(o.stringRepeat(" ",i.indent)),l=0,a=i[++r]||Number.MAX_VALUE;0!=u.length&&(s+=u.length,l=this.$renderToken(e,l,c,u));}}},this.$renderSimpleLine=function(e,t){var i=0,n=t[0],s=n.value;this.displayIndentGuides&&(s=this.renderIndentGuide(e,s)),s&&(i=this.$renderToken(e,i,n,s));for(var o=1;o<t.length;o++)s=(n=t[o]).value,i=this.$renderToken(e,i,n,s);},this.$renderLine=function(e,t,i,n){if(n||0==n||(n=this.session.getFoldLine(t)),n)var s=this.$getFoldLineTokens(t,n);else s=this.session.getTokens(t);if(i||e.push("<div class='ace_line' style='height:",this.config.lineHeight*(this.$useLineGroups()?1:this.session.getRowLength(t)),"px'>"),s.length){var o=this.session.getRowSplitData(t);o&&o.length?this.$renderWrappedLine(e,s,o,i):this.$renderSimpleLine(e,s);}this.showInvisibles&&(n&&(t=n.end.row),e.push("<span class='ace_invisible ace_invisible_eol'>",t==this.session.getLength()-1?this.EOF_CHAR:this.EOL_CHAR,"</span>")),i||e.push("</div>");},this.$getFoldLineTokens=function(e,t){var i=this.session,n=[];var s=i.getTokens(e);return t.walk((function(e,t,o,r,a){null!=e?n.push({type:"fold",value:e}):(a&&(s=i.getTokens(t)),s.length&&function(e,t,i){for(var s=0,o=0;o+e[s].value.length<t;)if(o+=e[s].value.length,++s==e.length)return;for(o!=t&&((r=e[s].value.substring(t-o)).length>i-t&&(r=r.substring(0,i-t)),n.push({type:e[s].type,value:r}),o=t+r.length,s+=1);o<i&&s<e.length;){var r;(r=e[s].value).length+o>i?n.push({type:e[s].type,value:r.substring(0,i-o)}):n.push(e[s]),o+=r.length,s+=1;}}(s,r,o));}),t.end.row,this.session.getLine(t.end.row).length),n},this.$useLineGroups=function(){return this.session.getUseWrapMode()},this.destroy=function(){clearInterval(this.$pollSizeChangesTimer),this.$measureNode&&this.$measureNode.parentNode.removeChild(this.$measureNode),delete this.$measureNode;};})).call(a.prototype),t.Text=a;})),ace.define("ace/layer/cursor",["require","exports","module","ace/lib/dom"],(function(e,t,i){var n,s=e("../lib/dom"),o=function(e){this.element=s.createElement("div"),this.element.className="ace_layer ace_cursor-layer",e.appendChild(this.element),void 0===n&&(n=!("opacity"in this.element.style)),this.isVisible=!1,this.isBlinking=!0,this.blinkInterval=1e3,this.smoothBlinking=!1,this.cursors=[],this.cursor=this.addCursor(),s.addCssClass(this.element,"ace_hidden-cursors"),this.$updateCursors=(n?this.$updateVisibility:this.$updateOpacity).bind(this);};((function(){this.$updateVisibility=function(e){for(var t=this.cursors,i=t.length;i--;)t[i].style.visibility=e?"":"hidden";},this.$updateOpacity=function(e){for(var t=this.cursors,i=t.length;i--;)t[i].style.opacity=e?"":"0";},this.$padding=0,this.setPadding=function(e){this.$padding=e;},this.setSession=function(e){this.session=e;},this.setBlinking=function(e){e!=this.isBlinking&&(this.isBlinking=e,this.restartTimer());},this.setBlinkInterval=function(e){e!=this.blinkInterval&&(this.blinkInterval=e,this.restartTimer());},this.setSmoothBlinking=function(e){e==this.smoothBlinking||n||(this.smoothBlinking=e,s.setCssClass(this.element,"ace_smooth-blinking",e),this.$updateCursors(!0),this.$updateCursors=this.$updateOpacity.bind(this),this.restartTimer());},this.addCursor=function(){var e=s.createElement("div");return e.className="ace_cursor",this.element.appendChild(e),this.cursors.push(e),e},this.removeCursor=function(){if(this.cursors.length>1){var e=this.cursors.pop();return e.parentNode.removeChild(e),e}},this.hideCursor=function(){this.isVisible=!1,s.addCssClass(this.element,"ace_hidden-cursors"),this.restartTimer();},this.showCursor=function(){this.isVisible=!0,s.removeCssClass(this.element,"ace_hidden-cursors"),this.restartTimer();},this.restartTimer=function(){var e=this.$updateCursors;if(clearInterval(this.intervalId),clearTimeout(this.timeoutId),this.smoothBlinking&&s.removeCssClass(this.element,"ace_smooth-blinking"),e(!0),this.isBlinking&&this.blinkInterval&&this.isVisible){this.smoothBlinking&&setTimeout(function(){s.addCssClass(this.element,"ace_smooth-blinking");}.bind(this));var t=function(){this.timeoutId=setTimeout((function(){e(!1);}),.6*this.blinkInterval);}.bind(this);this.intervalId=setInterval((function(){e(!0),t();}),this.blinkInterval),t();}},this.getPixelPosition=function(e,t){if(!this.config||!this.session)return {left:0,top:0};e||(e=this.session.selection.getCursor());var i=this.session.documentToScreenPosition(e);return {left:this.$padding+(this.session.$bidiHandler.isBidiRow(i.row,e.row)?this.session.$bidiHandler.getPosLeft(i.column):i.column*this.config.characterWidth),top:(i.row-(t?this.config.firstRowScreen:0))*this.config.lineHeight}},this.update=function(e){this.config=e;var t=this.session.$selectionMarkers,i=0,n=0;void 0!==t&&0!==t.length||(t=[{cursor:null}]);i=0;for(var s=t.length;i<s;i++){var o=this.getPixelPosition(t[i].cursor,!0);if(!((o.top>e.height+e.offset||o.top<0)&&i>1)){var r=(this.cursors[n++]||this.addCursor()).style;this.drawCursor?this.drawCursor(r,o,e,t[i],this.session):(r.left=o.left+"px",r.top=o.top+"px",r.width=e.characterWidth+"px",r.height=e.lineHeight+"px");}}for(;this.cursors.length>n;)this.removeCursor();var a=this.session.getOverwrite();this.$setOverwrite(a),this.$pixelPos=o,this.restartTimer();},this.drawCursor=null,this.$setOverwrite=function(e){e!=this.overwrite&&(this.overwrite=e,e?s.addCssClass(this.element,"ace_overwrite-cursors"):s.removeCssClass(this.element,"ace_overwrite-cursors"));},this.destroy=function(){clearInterval(this.intervalId),clearTimeout(this.timeoutId);};})).call(o.prototype),t.Cursor=o;})),ace.define("ace/scrollbar",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/lib/event","ace/lib/event_emitter"],(function(e,t,i){var n=e("./lib/oop"),s=e("./lib/dom"),o=e("./lib/event"),r=e("./lib/event_emitter").EventEmitter,a=32768,l=function(e){this.element=s.createElement("div"),this.element.className="ace_scrollbar ace_scrollbar"+this.classSuffix,this.inner=s.createElement("div"),this.inner.className="ace_scrollbar-inner",this.element.appendChild(this.inner),e.appendChild(this.element),this.setVisible(!1),this.skipEvent=!1,o.addListener(this.element,"scroll",this.onScroll.bind(this)),o.addListener(this.element,"mousedown",o.preventDefault);};(function(){n.implement(this,r),this.setVisible=function(e){this.element.style.display=e?"":"none",this.isVisible=e,this.coeff=1;};}).call(l.prototype);var h=function(e,t){l.call(this,e),this.scrollTop=0,this.scrollHeight=0,t.$scrollbarWidth=this.width=s.scrollbarWidth(e.ownerDocument),this.inner.style.width=this.element.style.width=(this.width||15)+5+"px",this.$minWidth=0;};n.inherits(h,l),function(){this.classSuffix="-v",this.onScroll=function(){if(!this.skipEvent){if(this.scrollTop=this.element.scrollTop,1!=this.coeff){var e=this.element.clientHeight/this.scrollHeight;this.scrollTop=this.scrollTop*(1-e)/(this.coeff-e);}this._emit("scroll",{data:this.scrollTop});}this.skipEvent=!1;},this.getWidth=function(){return Math.max(this.isVisible?this.width:0,this.$minWidth||0)},this.setHeight=function(e){this.element.style.height=e+"px";},this.setInnerHeight=this.setScrollHeight=function(e){this.scrollHeight=e,e>a?(this.coeff=a/e,e=a):1!=this.coeff&&(this.coeff=1),this.inner.style.height=e+"px";},this.setScrollTop=function(e){this.scrollTop!=e&&(this.skipEvent=!0,this.scrollTop=e,this.element.scrollTop=e*this.coeff);};}.call(h.prototype);var c=function(e,t){l.call(this,e),this.scrollLeft=0,this.height=t.$scrollbarWidth,this.inner.style.height=this.element.style.height=(this.height||15)+5+"px";};n.inherits(c,l),function(){this.classSuffix="-h",this.onScroll=function(){this.skipEvent||(this.scrollLeft=this.element.scrollLeft,this._emit("scroll",{data:this.scrollLeft})),this.skipEvent=!1;},this.getHeight=function(){return this.isVisible?this.height:0},this.setWidth=function(e){this.element.style.width=e+"px";},this.setInnerWidth=function(e){this.inner.style.width=e+"px";},this.setScrollWidth=function(e){this.inner.style.width=e+"px";},this.setScrollLeft=function(e){this.scrollLeft!=e&&(this.skipEvent=!0,this.scrollLeft=this.element.scrollLeft=e);};}.call(c.prototype),t.ScrollBar=h,t.ScrollBarV=h,t.ScrollBarH=c,t.VScrollBar=h,t.HScrollBar=c;})),ace.define("ace/renderloop",["require","exports","module","ace/lib/event"],(function(e,t,i){var n=e("./lib/event"),s=function(e,t){this.onRender=e,this.pending=!1,this.changes=0,this.window=t||window;};((function(){this.schedule=function(e){if(this.changes=this.changes|e,!this.pending&&this.changes){this.pending=!0;var t=this;n.nextFrame((function(){var e;for(t.pending=!1;e=t.changes;)t.changes=0,t.onRender(e);}),this.window);}};})).call(s.prototype),t.RenderLoop=s;})),ace.define("ace/layer/font_metrics",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/lib/lang","ace/lib/useragent","ace/lib/event_emitter"],(function(e,t,i){var n=e("../lib/oop"),s=e("../lib/dom"),o=e("../lib/lang"),r=e("../lib/useragent"),a=e("../lib/event_emitter").EventEmitter,l=0,h=t.FontMetrics=function(e){this.el=s.createElement("div"),this.$setMeasureNodeStyles(this.el.style,!0),this.$main=s.createElement("div"),this.$setMeasureNodeStyles(this.$main.style),this.$measureNode=s.createElement("div"),this.$setMeasureNodeStyles(this.$measureNode.style),this.el.appendChild(this.$main),this.el.appendChild(this.$measureNode),e.appendChild(this.el),l||this.$testFractionalRect(),this.$measureNode.innerHTML=o.stringRepeat("X",l),this.$characterSize={width:0,height:0},this.checkForSizeChanges();};(function(){n.implement(this,a),this.$characterSize={width:0,height:0},this.$testFractionalRect=function(){var e=s.createElement("div");this.$setMeasureNodeStyles(e.style),e.style.width="0.2px",document.documentElement.appendChild(e);var t=e.getBoundingClientRect().width;l=t>0&&t<1?50:100,e.parentNode.removeChild(e);},this.$setMeasureNodeStyles=function(e,t){e.width=e.height="auto",e.left=e.top="0px",e.visibility="hidden",e.position="absolute",e.whiteSpace="pre",r.isIE<8?e["font-family"]="inherit":e.font="inherit",e.overflow=t?"hidden":"visible";},this.checkForSizeChanges=function(){var e=this.$measureSizes();if(e&&(this.$characterSize.width!==e.width||this.$characterSize.height!==e.height)){this.$measureNode.style.fontWeight="bold";var t=this.$measureSizes();this.$measureNode.style.fontWeight="",this.$characterSize=e,this.charSizes=Object.create(null),this.allowBoldFonts=t&&t.width===e.width&&t.height===e.height,this._emit("changeCharacterSize",{data:e});}},this.$pollSizeChanges=function(){if(this.$pollSizeChangesTimer)return this.$pollSizeChangesTimer;var e=this;return this.$pollSizeChangesTimer=setInterval((function(){e.checkForSizeChanges();}),500)},this.setPolling=function(e){e?this.$pollSizeChanges():this.$pollSizeChangesTimer&&(clearInterval(this.$pollSizeChangesTimer),this.$pollSizeChangesTimer=0);},this.$measureSizes=function(){if(50===l){var e=null;try{e=this.$measureNode.getBoundingClientRect();}catch(t){e={width:0,height:0};}var t={height:e.height,width:e.width/l};}else t={height:this.$measureNode.clientHeight,width:this.$measureNode.clientWidth/l};return 0===t.width||0===t.height?null:t},this.$measureCharWidth=function(e){return this.$main.innerHTML=o.stringRepeat(e,l),this.$main.getBoundingClientRect().width/l},this.getCharacterWidth=function(e){var t=this.charSizes[e];return void 0===t&&(t=this.charSizes[e]=this.$measureCharWidth(e)/this.$characterSize.width),t},this.destroy=function(){clearInterval(this.$pollSizeChangesTimer),this.el&&this.el.parentNode&&this.el.parentNode.removeChild(this.el);};}).call(h.prototype);})),ace.define("ace/virtual_renderer",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/config","ace/lib/useragent","ace/layer/gutter","ace/layer/marker","ace/layer/text","ace/layer/cursor","ace/scrollbar","ace/scrollbar","ace/renderloop","ace/layer/font_metrics","ace/lib/event_emitter"],(function(e,t,i){var n=e("./lib/oop"),s=e("./lib/dom"),o=e("./config"),r=e("./lib/useragent"),a=e("./layer/gutter").Gutter,l=e("./layer/marker").Marker,h=e("./layer/text").Text,c=e("./layer/cursor").Cursor,u=e("./scrollbar").HScrollBar,d=e("./scrollbar").VScrollBar,g=e("./renderloop").RenderLoop,f=e("./layer/font_metrics").FontMetrics,m=e("./lib/event_emitter").EventEmitter;s.importCssString('.ace_editor {position: relative;overflow: hidden;font: 12px/normal \'Monaco\', \'Menlo\', \'Ubuntu Mono\', \'Consolas\', \'source-code-pro\', monospace;direction: ltr;text-align: left;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);}.ace_scroller {position: absolute;overflow: hidden;top: 0;bottom: 0;background-color: inherit;-ms-user-select: none;-moz-user-select: none;-webkit-user-select: none;user-select: none;cursor: text;}.ace_content {position: absolute;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;min-width: 100%;}.ace_dragging .ace_scroller:before{position: absolute;top: 0;left: 0;right: 0;bottom: 0;content: \'\';background: rgba(250, 250, 250, 0.01);z-index: 1000;}.ace_dragging.ace_dark .ace_scroller:before{background: rgba(0, 0, 0, 0.01);}.ace_selecting, .ace_selecting * {cursor: text !important;}.ace_gutter {position: absolute;overflow : hidden;width: auto;top: 0;bottom: 0;left: 0;cursor: default;z-index: 4;-ms-user-select: none;-moz-user-select: none;-webkit-user-select: none;user-select: none;}.ace_gutter-active-line {position: absolute;left: 0;right: 0;}.ace_scroller.ace_scroll-left {box-shadow: 17px 0 16px -16px rgba(0, 0, 0, 0.4) inset;}.ace_gutter-cell {padding-left: 19px;padding-right: 6px;background-repeat: no-repeat;}.ace_gutter-cell.ace_error {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABOFBMVEX/////////QRswFAb/Ui4wFAYwFAYwFAaWGAfDRymzOSH/PxswFAb/SiUwFAYwFAbUPRvjQiDllog5HhHdRybsTi3/Tyv9Tir+Syj/UC3////XurebMBIwFAb/RSHbPx/gUzfdwL3kzMivKBAwFAbbvbnhPx66NhowFAYwFAaZJg8wFAaxKBDZurf/RB6mMxb/SCMwFAYwFAbxQB3+RB4wFAb/Qhy4Oh+4QifbNRcwFAYwFAYwFAb/QRzdNhgwFAYwFAbav7v/Uy7oaE68MBK5LxLewr/r2NXewLswFAaxJw4wFAbkPRy2PyYwFAaxKhLm1tMwFAazPiQwFAaUGAb/QBrfOx3bvrv/VC/maE4wFAbRPBq6MRO8Qynew8Dp2tjfwb0wFAbx6eju5+by6uns4uH9/f36+vr/GkHjAAAAYnRSTlMAGt+64rnWu/bo8eAA4InH3+DwoN7j4eLi4xP99Nfg4+b+/u9B/eDs1MD1mO7+4PHg2MXa347g7vDizMLN4eG+Pv7i5evs/v79yu7S3/DV7/498Yv24eH+4ufQ3Ozu/v7+y13sRqwAAADLSURBVHjaZc/XDsFgGIBhtDrshlitmk2IrbHFqL2pvXf/+78DPokj7+Fz9qpU/9UXJIlhmPaTaQ6QPaz0mm+5gwkgovcV6GZzd5JtCQwgsxoHOvJO15kleRLAnMgHFIESUEPmawB9ngmelTtipwwfASilxOLyiV5UVUyVAfbG0cCPHig+GBkzAENHS0AstVF6bacZIOzgLmxsHbt2OecNgJC83JERmePUYq8ARGkJx6XtFsdddBQgZE2nPR6CICZhawjA4Fb/chv+399kfR+MMMDGOQAAAABJRU5ErkJggg==");background-repeat: no-repeat;background-position: 2px center;}.ace_gutter-cell.ace_warning {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAmVBMVEX///8AAAD///8AAAAAAABPSzb/5sAAAAB/blH/73z/ulkAAAAAAAD85pkAAAAAAAACAgP/vGz/rkDerGbGrV7/pkQICAf////e0IsAAAD/oED/qTvhrnUAAAD/yHD/njcAAADuv2r/nz//oTj/p064oGf/zHAAAAA9Nir/tFIAAAD/tlTiuWf/tkIAAACynXEAAAAAAAAtIRW7zBpBAAAAM3RSTlMAABR1m7RXO8Ln31Z36zT+neXe5OzooRDfn+TZ4p3h2hTf4t3k3ucyrN1K5+Xaks52Sfs9CXgrAAAAjklEQVR42o3PbQ+CIBQFYEwboPhSYgoYunIqqLn6/z8uYdH8Vmdnu9vz4WwXgN/xTPRD2+sgOcZjsge/whXZgUaYYvT8QnuJaUrjrHUQreGczuEafQCO/SJTufTbroWsPgsllVhq3wJEk2jUSzX3CUEDJC84707djRc5MTAQxoLgupWRwW6UB5fS++NV8AbOZgnsC7BpEAAAAABJRU5ErkJggg==");background-position: 2px center;}.ace_gutter-cell.ace_info {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAJ0Uk5TAAB2k804AAAAPklEQVQY02NgIB68QuO3tiLznjAwpKTgNyDbMegwisCHZUETUZV0ZqOquBpXj2rtnpSJT1AEnnRmL2OgGgAAIKkRQap2htgAAAAASUVORK5CYII=");background-position: 2px center;}.ace_dark .ace_gutter-cell.ace_info {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUAAAChoaGAgIAqKiq+vr6tra1ZWVmUlJSbm5s8PDxubm56enrdgzg3AAAAAXRSTlMAQObYZgAAAClJREFUeNpjYMAPdsMYHegyJZFQBlsUlMFVCWUYKkAZMxZAGdxlDMQBAG+TBP4B6RyJAAAAAElFTkSuQmCC");}.ace_scrollbar {position: absolute;right: 0;bottom: 0;z-index: 6;}.ace_scrollbar-inner {position: absolute;cursor: text;left: 0;top: 0;}.ace_scrollbar-v{overflow-x: hidden;overflow-y: scroll;top: 0;}.ace_scrollbar-h {overflow-x: scroll;overflow-y: hidden;left: 0;}.ace_print-margin {position: absolute;height: 100%;}.ace_text-input {position: absolute;z-index: 0;width: 0.5em;height: 1em;opacity: 0;background: transparent;-moz-appearance: none;appearance: none;border: none;resize: none;outline: none;overflow: hidden;font: inherit;padding: 0 1px;margin: 0 -1px;text-indent: -1em;-ms-user-select: text;-moz-user-select: text;-webkit-user-select: text;user-select: text;white-space: pre!important;}.ace_text-input.ace_composition {background: inherit;color: inherit;z-index: 1000;opacity: 1;text-indent: 0;}.ace_layer {z-index: 1;position: absolute;overflow: hidden;word-wrap: normal;white-space: pre;height: 100%;width: 100%;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;pointer-events: none;}.ace_gutter-layer {position: relative;width: auto;text-align: right;pointer-events: auto;}.ace_text-layer {font: inherit !important;}.ace_cjk {display: inline-block;text-align: center;}.ace_cursor-layer {z-index: 4;}.ace_cursor {z-index: 4;position: absolute;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;border-left: 2px solid;transform: translatez(0);}.ace_multiselect .ace_cursor {border-left-width: 1px;}.ace_slim-cursors .ace_cursor {border-left-width: 1px;}.ace_overwrite-cursors .ace_cursor {border-left-width: 0;border-bottom: 1px solid;}.ace_hidden-cursors .ace_cursor {opacity: 0.2;}.ace_smooth-blinking .ace_cursor {-webkit-transition: opacity 0.18s;transition: opacity 0.18s;}.ace_marker-layer .ace_step, .ace_marker-layer .ace_stack {position: absolute;z-index: 3;}.ace_marker-layer .ace_selection {position: absolute;z-index: 5;}.ace_marker-layer .ace_bracket {position: absolute;z-index: 6;}.ace_marker-layer .ace_active-line {position: absolute;z-index: 2;}.ace_marker-layer .ace_selected-word {position: absolute;z-index: 4;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;}.ace_line .ace_fold {-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;display: inline-block;height: 11px;margin-top: -2px;vertical-align: middle;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII="),url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACJJREFUeNpi+P//fxgTAwPDBxDxD078RSX+YeEyDFMCIMAAI3INmXiwf2YAAAAASUVORK5CYII=");background-repeat: no-repeat, repeat-x;background-position: center center, top left;color: transparent;border: 1px solid black;border-radius: 2px;cursor: pointer;pointer-events: auto;}.ace_dark .ace_fold {}.ace_fold:hover{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII="),url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACBJREFUeNpi+P//fz4TAwPDZxDxD5X4i5fLMEwJgAADAEPVDbjNw87ZAAAAAElFTkSuQmCC");}.ace_tooltip {background-color: #FFF;background-image: -webkit-linear-gradient(top, transparent, rgba(0, 0, 0, 0.1));background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));border: 1px solid gray;border-radius: 1px;box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);color: black;max-width: 100%;padding: 3px 4px;position: fixed;z-index: 999999;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;cursor: default;white-space: pre;word-wrap: break-word;line-height: normal;font-style: normal;font-weight: normal;letter-spacing: normal;pointer-events: none;}.ace_folding-enabled > .ace_gutter-cell {padding-right: 13px;}.ace_fold-widget {-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;margin: 0 -12px 0 1px;display: none;width: 11px;vertical-align: top;background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42mWKsQ0AMAzC8ixLlrzQjzmBiEjp0A6WwBCSPgKAXoLkqSot7nN3yMwR7pZ32NzpKkVoDBUxKAAAAABJRU5ErkJggg==");background-repeat: no-repeat;background-position: center;border-radius: 3px;border: 1px solid transparent;cursor: pointer;}.ace_folding-enabled .ace_fold-widget {display: inline-block;   }.ace_fold-widget.ace_end {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42m3HwQkAMAhD0YzsRchFKI7sAikeWkrxwScEB0nh5e7KTPWimZki4tYfVbX+MNl4pyZXejUO1QAAAABJRU5ErkJggg==");}.ace_fold-widget.ace_closed {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAGCAYAAAAG5SQMAAAAOUlEQVR42jXKwQkAMAgDwKwqKD4EwQ26sSOkVWjgIIHAzPiCgaqiqnJHZnKICBERHN194O5b9vbLuAVRL+l0YWnZAAAAAElFTkSuQmCCXA==");}.ace_fold-widget:hover {border: 1px solid rgba(0, 0, 0, 0.3);background-color: rgba(255, 255, 255, 0.2);box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);}.ace_fold-widget:active {border: 1px solid rgba(0, 0, 0, 0.4);background-color: rgba(0, 0, 0, 0.05);box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);}.ace_dark .ace_fold-widget {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHklEQVQIW2P4//8/AzoGEQ7oGCaLLAhWiSwB146BAQCSTPYocqT0AAAAAElFTkSuQmCC");}.ace_dark .ace_fold-widget.ace_end {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAH0lEQVQIW2P4//8/AxQ7wNjIAjDMgC4AxjCVKBirIAAF0kz2rlhxpAAAAABJRU5ErkJggg==");}.ace_dark .ace_fold-widget.ace_closed {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAFCAYAAACAcVaiAAAAHElEQVQIW2P4//+/AxAzgDADlOOAznHAKgPWAwARji8UIDTfQQAAAABJRU5ErkJggg==");}.ace_dark .ace_fold-widget:hover {box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);background-color: rgba(255, 255, 255, 0.1);}.ace_dark .ace_fold-widget:active {box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);}.ace_fold-widget.ace_invalid {background-color: #FFB4B4;border-color: #DE5555;}.ace_fade-fold-widgets .ace_fold-widget {-webkit-transition: opacity 0.4s ease 0.05s;transition: opacity 0.4s ease 0.05s;opacity: 0;}.ace_fade-fold-widgets:hover .ace_fold-widget {-webkit-transition: opacity 0.05s ease 0.05s;transition: opacity 0.05s ease 0.05s;opacity:1;}.ace_underline {text-decoration: underline;}.ace_bold {font-weight: bold;}.ace_nobold .ace_bold {font-weight: normal;}.ace_italic {font-style: italic;}.ace_error-marker {background-color: rgba(255, 0, 0,0.2);position: absolute;z-index: 9;}.ace_highlight-marker {background-color: rgba(255, 255, 0,0.2);position: absolute;z-index: 8;}.ace_br1 {border-top-left-radius    : 3px;}.ace_br2 {border-top-right-radius   : 3px;}.ace_br3 {border-top-left-radius    : 3px; border-top-right-radius:    3px;}.ace_br4 {border-bottom-right-radius: 3px;}.ace_br5 {border-top-left-radius    : 3px; border-bottom-right-radius: 3px;}.ace_br6 {border-top-right-radius   : 3px; border-bottom-right-radius: 3px;}.ace_br7 {border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px;}.ace_br8 {border-bottom-left-radius : 3px;}.ace_br9 {border-top-left-radius    : 3px; border-bottom-left-radius:  3px;}.ace_br10{border-top-right-radius   : 3px; border-bottom-left-radius:  3px;}.ace_br11{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-left-radius:  3px;}.ace_br12{border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}.ace_br13{border-top-left-radius    : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}.ace_br14{border-top-right-radius   : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}.ace_br15{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;}.ace_text-input-ios {position: absolute !important;top: -100000px !important;left: -100000px !important;}',"ace_editor.css");var p=function(e,t){var i=this;this.container=e||s.createElement("div"),this.$keepTextAreaAtCursor=!r.isOldIE,s.addCssClass(this.container,"ace_editor"),this.setTheme(t),this.$gutter=s.createElement("div"),this.$gutter.className="ace_gutter",this.container.appendChild(this.$gutter),this.$gutter.setAttribute("aria-hidden",!0),this.scroller=s.createElement("div"),this.scroller.className="ace_scroller",this.container.appendChild(this.scroller),this.content=s.createElement("div"),this.content.className="ace_content",this.scroller.appendChild(this.content),this.$gutterLayer=new a(this.$gutter),this.$gutterLayer.on("changeGutterWidth",this.onGutterResize.bind(this)),this.$markerBack=new l(this.content);var n=this.$textLayer=new h(this.content);this.canvas=n.element,this.$markerFront=new l(this.content),this.$cursorLayer=new c(this.content),this.$horizScroll=!1,this.$vScroll=!1,this.scrollBar=this.scrollBarV=new d(this.container,this),this.scrollBarH=new u(this.container,this),this.scrollBarV.addEventListener("scroll",(function(e){i.$scrollAnimation||i.session.setScrollTop(e.data-i.scrollMargin.top);})),this.scrollBarH.addEventListener("scroll",(function(e){i.$scrollAnimation||i.session.setScrollLeft(e.data-i.scrollMargin.left);})),this.scrollTop=0,this.scrollLeft=0,this.cursorPos={row:0,column:0},this.$fontMetrics=new f(this.container),this.$textLayer.$setFontMetrics(this.$fontMetrics),this.$textLayer.addEventListener("changeCharacterSize",(function(e){i.updateCharacterSize(),i.onResize(!0,i.gutterWidth,i.$size.width,i.$size.height),i._signal("changeCharacterSize",e);})),this.$size={width:0,height:0,scrollerHeight:0,scrollerWidth:0,$dirty:!0},this.layerConfig={width:1,padding:0,firstRow:0,firstRowScreen:0,lastRow:0,lineHeight:0,characterWidth:0,minHeight:1,maxHeight:1,offset:0,height:1,gutterOffset:1},this.scrollMargin={left:0,right:0,top:0,bottom:0,v:0,h:0},this.$loop=new g(this.$renderChanges.bind(this),this.container.ownerDocument.defaultView),this.$loop.schedule(this.CHANGE_FULL),this.updateCharacterSize(),this.setPadding(4),o.resetOptions(this),o._emit("renderer",this);};((function(){this.CHANGE_CURSOR=1,this.CHANGE_MARKER=2,this.CHANGE_GUTTER=4,this.CHANGE_SCROLL=8,this.CHANGE_LINES=16,this.CHANGE_TEXT=32,this.CHANGE_SIZE=64,this.CHANGE_MARKER_BACK=128,this.CHANGE_MARKER_FRONT=256,this.CHANGE_FULL=512,this.CHANGE_H_SCROLL=1024,n.implement(this,m),this.updateCharacterSize=function(){this.$textLayer.allowBoldFonts!=this.$allowBoldFonts&&(this.$allowBoldFonts=this.$textLayer.allowBoldFonts,this.setStyle("ace_nobold",!this.$allowBoldFonts)),this.layerConfig.characterWidth=this.characterWidth=this.$textLayer.getCharacterWidth(),this.layerConfig.lineHeight=this.lineHeight=this.$textLayer.getLineHeight(),this.$updatePrintMargin();},this.setSession=function(e){this.session&&this.session.doc.off("changeNewLineMode",this.onChangeNewLineMode),this.session=e,e&&this.scrollMargin.top&&e.getScrollTop()<=0&&e.setScrollTop(-this.scrollMargin.top),this.$cursorLayer.setSession(e),this.$markerBack.setSession(e),this.$markerFront.setSession(e),this.$gutterLayer.setSession(e),this.$textLayer.setSession(e),e&&(this.$loop.schedule(this.CHANGE_FULL),this.session.$setFontMetrics(this.$fontMetrics),this.scrollBarH.scrollLeft=this.scrollBarV.scrollTop=null,this.onChangeNewLineMode=this.onChangeNewLineMode.bind(this),this.onChangeNewLineMode(),this.session.doc.on("changeNewLineMode",this.onChangeNewLineMode));},this.updateLines=function(e,t,i){if(void 0===t&&(t=1/0),this.$changedLines?(this.$changedLines.firstRow>e&&(this.$changedLines.firstRow=e),this.$changedLines.lastRow<t&&(this.$changedLines.lastRow=t)):this.$changedLines={firstRow:e,lastRow:t},this.$changedLines.lastRow<this.layerConfig.firstRow){if(!i)return;this.$changedLines.lastRow=this.layerConfig.lastRow;}this.$changedLines.firstRow>this.layerConfig.lastRow||this.$loop.schedule(this.CHANGE_LINES);},this.onChangeNewLineMode=function(){this.$loop.schedule(this.CHANGE_TEXT),this.$textLayer.$updateEolChar(),this.session.$bidiHandler.setEolChar(this.$textLayer.EOL_CHAR);},this.onChangeTabSize=function(){this.$loop.schedule(this.CHANGE_TEXT|this.CHANGE_MARKER),this.$textLayer.onChangeTabSize();},this.updateText=function(){this.$loop.schedule(this.CHANGE_TEXT);},this.updateFull=function(e){e?this.$renderChanges(this.CHANGE_FULL,!0):this.$loop.schedule(this.CHANGE_FULL);},this.updateFontSize=function(){this.$textLayer.checkForSizeChanges();},this.$changes=0,this.$updateSizeAsync=function(){this.$loop.pending?this.$size.$dirty=!0:this.onResize();},this.onResize=function(e,t,i,n){if(!(this.resizing>2)){this.resizing>0?this.resizing++:this.resizing=e?1:0;var s=this.container;n||(n=s.clientHeight||s.scrollHeight),i||(i=s.clientWidth||s.scrollWidth);var o=this.$updateCachedSize(e,t,i,n);if(!this.$size.scrollerHeight||!i&&!n)return this.resizing=0;e&&(this.$gutterLayer.$padding=null),e?this.$renderChanges(o|this.$changes,!0):this.$loop.schedule(o|this.$changes),this.resizing&&(this.resizing=0),this.scrollBarV.scrollLeft=this.scrollBarV.scrollTop=null;}},this.$updateCachedSize=function(e,t,i,n){n-=this.$extraHeight||0;var s=0,o=this.$size,r={width:o.width,height:o.height,scrollerHeight:o.scrollerHeight,scrollerWidth:o.scrollerWidth};return n&&(e||o.height!=n)&&(o.height=n,s|=this.CHANGE_SIZE,o.scrollerHeight=o.height,this.$horizScroll&&(o.scrollerHeight-=this.scrollBarH.getHeight()),this.scrollBarV.element.style.bottom=this.scrollBarH.getHeight()+"px",s|=this.CHANGE_SCROLL),i&&(e||o.width!=i)&&(s|=this.CHANGE_SIZE,o.width=i,null==t&&(t=this.$showGutter?this.$gutter.offsetWidth:0),this.gutterWidth=t,this.scrollBarH.element.style.left=this.scroller.style.left=t+"px",o.scrollerWidth=Math.max(0,i-t-this.scrollBarV.getWidth()),this.scrollBarH.element.style.right=this.scroller.style.right=this.scrollBarV.getWidth()+"px",this.scroller.style.bottom=this.scrollBarH.getHeight()+"px",(this.session&&this.session.getUseWrapMode()&&this.adjustWrapLimit()||e)&&(s|=this.CHANGE_FULL)),o.$dirty=!i||!n,s&&this._signal("resize",r),s},this.onGutterResize=function(){var e=this.$showGutter?this.$gutter.offsetWidth:0;e!=this.gutterWidth&&(this.$changes|=this.$updateCachedSize(!0,e,this.$size.width,this.$size.height)),this.session.getUseWrapMode()&&this.adjustWrapLimit()||this.$size.$dirty?this.$loop.schedule(this.CHANGE_FULL):(this.$computeLayerConfig(),this.$loop.schedule(this.CHANGE_MARKER));},this.adjustWrapLimit=function(){var e=this.$size.scrollerWidth-2*this.$padding,t=Math.floor(e/this.characterWidth);return this.session.adjustWrapLimit(t,this.$showPrintMargin&&this.$printMarginColumn)},this.setAnimatedScroll=function(e){this.setOption("animatedScroll",e);},this.getAnimatedScroll=function(){return this.$animatedScroll},this.setShowInvisibles=function(e){this.setOption("showInvisibles",e),this.session.$bidiHandler.setShowInvisibles(e);},this.getShowInvisibles=function(){return this.getOption("showInvisibles")},this.getDisplayIndentGuides=function(){return this.getOption("displayIndentGuides")},this.setDisplayIndentGuides=function(e){this.setOption("displayIndentGuides",e);},this.setShowPrintMargin=function(e){this.setOption("showPrintMargin",e);},this.getShowPrintMargin=function(){return this.getOption("showPrintMargin")},this.setPrintMarginColumn=function(e){this.setOption("printMarginColumn",e);},this.getPrintMarginColumn=function(){return this.getOption("printMarginColumn")},this.getShowGutter=function(){return this.getOption("showGutter")},this.setShowGutter=function(e){return this.setOption("showGutter",e)},this.getFadeFoldWidgets=function(){return this.getOption("fadeFoldWidgets")},this.setFadeFoldWidgets=function(e){this.setOption("fadeFoldWidgets",e);},this.setHighlightGutterLine=function(e){this.setOption("highlightGutterLine",e);},this.getHighlightGutterLine=function(){return this.getOption("highlightGutterLine")},this.$updateGutterLineHighlight=function(){var e=this.$cursorLayer.$pixelPos,t=this.layerConfig.lineHeight;if(this.session.getUseWrapMode()){var i=this.session.selection.getCursor();i.column=0,e=this.$cursorLayer.getPixelPosition(i,!0),t*=this.session.getRowLength(i.row);}this.$gutterLineHighlight.style.top=e.top-this.layerConfig.offset+"px",this.$gutterLineHighlight.style.height=t+"px";},this.$updatePrintMargin=function(){if(this.$showPrintMargin||this.$printMarginEl){if(!this.$printMarginEl){var e=s.createElement("div");e.className="ace_layer ace_print-margin-layer",this.$printMarginEl=s.createElement("div"),this.$printMarginEl.className="ace_print-margin",e.appendChild(this.$printMarginEl),this.content.insertBefore(e,this.content.firstChild);}var t=this.$printMarginEl.style;t.left=this.characterWidth*this.$printMarginColumn+this.$padding+"px",t.visibility=this.$showPrintMargin?"visible":"hidden",this.session&&-1==this.session.$wrap&&this.adjustWrapLimit();}},this.getContainerElement=function(){return this.container},this.getMouseEventTarget=function(){return this.scroller},this.getTextAreaContainer=function(){return this.container},this.$moveTextAreaToCursor=function(){if(this.$keepTextAreaAtCursor){var e=this.layerConfig,t=this.$cursorLayer.$pixelPos.top,i=this.$cursorLayer.$pixelPos.left;t-=e.offset;var n=this.textarea.style,s=this.lineHeight;if(t<0||t>e.height-s)n.top=n.left="0";else {var o=this.characterWidth;if(this.$composition){var r=this.textarea.value.replace(/^\x01+/,"");o*=this.session.$getStringScreenWidth(r)[0]+2,s+=2;}(i-=this.scrollLeft)>this.$size.scrollerWidth-o&&(i=this.$size.scrollerWidth-o),i+=this.gutterWidth,n.height=s+"px",n.width=o+"px",n.left=Math.min(i,this.$size.scrollerWidth-o)+"px",n.top=Math.min(t,this.$size.height-s)+"px";}}},this.getFirstVisibleRow=function(){return this.layerConfig.firstRow},this.getFirstFullyVisibleRow=function(){return this.layerConfig.firstRow+(0===this.layerConfig.offset?0:1)},this.getLastFullyVisibleRow=function(){var e=this.layerConfig,t=e.lastRow;return this.session.documentToScreenRow(t,0)*e.lineHeight-this.session.getScrollTop()>e.height-e.lineHeight?t-1:t},this.getLastVisibleRow=function(){return this.layerConfig.lastRow},this.$padding=null,this.setPadding=function(e){this.$padding=e,this.$textLayer.setPadding(e),this.$cursorLayer.setPadding(e),this.$markerFront.setPadding(e),this.$markerBack.setPadding(e),this.$loop.schedule(this.CHANGE_FULL),this.$updatePrintMargin();},this.setScrollMargin=function(e,t,i,n){var s=this.scrollMargin;s.top=0|e,s.bottom=0|t,s.right=0|n,s.left=0|i,s.v=s.top+s.bottom,s.h=s.left+s.right,s.top&&this.scrollTop<=0&&this.session&&this.session.setScrollTop(-s.top),this.updateFull();},this.getHScrollBarAlwaysVisible=function(){return this.$hScrollBarAlwaysVisible},this.setHScrollBarAlwaysVisible=function(e){this.setOption("hScrollBarAlwaysVisible",e);},this.getVScrollBarAlwaysVisible=function(){return this.$vScrollBarAlwaysVisible},this.setVScrollBarAlwaysVisible=function(e){this.setOption("vScrollBarAlwaysVisible",e);},this.$updateScrollBarV=function(){var e=this.layerConfig.maxHeight,t=this.$size.scrollerHeight;!this.$maxLines&&this.$scrollPastEnd&&(e-=(t-this.lineHeight)*this.$scrollPastEnd,this.scrollTop>e-t&&(e=this.scrollTop+t,this.scrollBarV.scrollTop=null)),this.scrollBarV.setScrollHeight(e+this.scrollMargin.v),this.scrollBarV.setScrollTop(this.scrollTop+this.scrollMargin.top);},this.$updateScrollBarH=function(){this.scrollBarH.setScrollWidth(this.layerConfig.width+2*this.$padding+this.scrollMargin.h),this.scrollBarH.setScrollLeft(this.scrollLeft+this.scrollMargin.left);},this.$frozen=!1,this.freeze=function(){this.$frozen=!0;},this.unfreeze=function(){this.$frozen=!1;},this.$renderChanges=function(e,t){if(this.$changes&&(e|=this.$changes,this.$changes=0),this.session&&this.container.offsetWidth&&!this.$frozen&&(e||t)){if(this.$size.$dirty)return this.$changes|=e,this.onResize(!0);this.lineHeight||this.$textLayer.checkForSizeChanges(),this._signal("beforeRender"),this.session&&this.session.$bidiHandler&&this.session.$bidiHandler.updateCharacterWidths(this.$fontMetrics);var i=this.layerConfig;if(e&this.CHANGE_FULL||e&this.CHANGE_SIZE||e&this.CHANGE_TEXT||e&this.CHANGE_LINES||e&this.CHANGE_SCROLL||e&this.CHANGE_H_SCROLL){if(e|=this.$computeLayerConfig(),i.firstRow!=this.layerConfig.firstRow&&i.firstRowScreen==this.layerConfig.firstRowScreen){var n=this.scrollTop+(i.firstRow-this.layerConfig.firstRow)*this.lineHeight;n>0&&(this.scrollTop=n,e|=this.CHANGE_SCROLL,e|=this.$computeLayerConfig());}i=this.layerConfig,this.$updateScrollBarV(),e&this.CHANGE_H_SCROLL&&this.$updateScrollBarH(),this.$gutterLayer.element.style.marginTop=-i.offset+"px",this.content.style.marginTop=-i.offset+"px",this.content.style.width=i.width+2*this.$padding+"px",this.content.style.height=i.minHeight+"px";}if(e&this.CHANGE_H_SCROLL&&(this.content.style.marginLeft=-this.scrollLeft+"px",this.scroller.className=this.scrollLeft<=0?"ace_scroller":"ace_scroller ace_scroll-left"),e&this.CHANGE_FULL)return this.$textLayer.update(i),this.$showGutter&&this.$gutterLayer.update(i),this.$markerBack.update(i),this.$markerFront.update(i),this.$cursorLayer.update(i),this.$moveTextAreaToCursor(),this.$highlightGutterLine&&this.$updateGutterLineHighlight(),void this._signal("afterRender");if(e&this.CHANGE_SCROLL)return e&this.CHANGE_TEXT||e&this.CHANGE_LINES?this.$textLayer.update(i):this.$textLayer.scrollLines(i),this.$showGutter&&this.$gutterLayer.update(i),this.$markerBack.update(i),this.$markerFront.update(i),this.$cursorLayer.update(i),this.$highlightGutterLine&&this.$updateGutterLineHighlight(),this.$moveTextAreaToCursor(),void this._signal("afterRender");e&this.CHANGE_TEXT?(this.$textLayer.update(i),this.$showGutter&&this.$gutterLayer.update(i)):e&this.CHANGE_LINES?(this.$updateLines()||e&this.CHANGE_GUTTER&&this.$showGutter)&&this.$gutterLayer.update(i):(e&this.CHANGE_TEXT||e&this.CHANGE_GUTTER)&&this.$showGutter&&this.$gutterLayer.update(i),e&this.CHANGE_CURSOR&&(this.$cursorLayer.update(i),this.$moveTextAreaToCursor(),this.$highlightGutterLine&&this.$updateGutterLineHighlight()),e&(this.CHANGE_MARKER|this.CHANGE_MARKER_FRONT)&&this.$markerFront.update(i),e&(this.CHANGE_MARKER|this.CHANGE_MARKER_BACK)&&this.$markerBack.update(i),this._signal("afterRender");}else this.$changes|=e;},this.$autosize=function(){var e=this.session.getScreenLength()*this.lineHeight,t=this.$maxLines*this.lineHeight,i=Math.min(t,Math.max((this.$minLines||1)*this.lineHeight,e))+this.scrollMargin.v+(this.$extraHeight||0);this.$horizScroll&&(i+=this.scrollBarH.getHeight()),this.$maxPixelHeight&&i>this.$maxPixelHeight&&(i=this.$maxPixelHeight);var n=e>t;if(i!=this.desiredHeight||this.$size.height!=this.desiredHeight||n!=this.$vScroll){n!=this.$vScroll&&(this.$vScroll=n,this.scrollBarV.setVisible(n));var s=this.container.clientWidth;this.container.style.height=i+"px",this.$updateCachedSize(!0,this.$gutterWidth,s,i),this.desiredHeight=i,this._signal("autosize");}},this.$computeLayerConfig=function(){var e=this.session,t=this.$size,i=t.height<=2*this.lineHeight,n=this.session.getScreenLength()*this.lineHeight,s=this.$getLongestLine(),o=!i&&(this.$hScrollBarAlwaysVisible||t.scrollerWidth-s-2*this.$padding<0),r=this.$horizScroll!==o;r&&(this.$horizScroll=o,this.scrollBarH.setVisible(o));var a=this.$vScroll;this.$maxLines&&this.lineHeight>1&&this.$autosize();var l=this.scrollTop%this.lineHeight,h=t.scrollerHeight+this.lineHeight,c=!this.$maxLines&&this.$scrollPastEnd?(t.scrollerHeight-this.lineHeight)*this.$scrollPastEnd:0;n+=c;var u=this.scrollMargin;this.session.setScrollTop(Math.max(-u.top,Math.min(this.scrollTop,n-t.scrollerHeight+u.bottom))),this.session.setScrollLeft(Math.max(-u.left,Math.min(this.scrollLeft,s+2*this.$padding-t.scrollerWidth+u.right)));var d=!i&&(this.$vScrollBarAlwaysVisible||t.scrollerHeight-n+c<0||this.scrollTop>u.top),g=a!==d;g&&(this.$vScroll=d,this.scrollBarV.setVisible(d));var f,m,p=Math.ceil(h/this.lineHeight)-1,A=Math.max(0,Math.round((this.scrollTop-l)/this.lineHeight)),C=A+p,v=this.lineHeight;A=e.screenToDocumentRow(A,0);var F=e.getFoldLine(A);F&&(A=F.start.row),f=e.documentToScreenRow(A,0),m=e.getRowLength(A)*v,C=Math.min(e.screenToDocumentRow(C,0),e.getLength()-1),h=t.scrollerHeight+e.getRowLength(C)*v+m,l=this.scrollTop-f*v;var w=0;return this.layerConfig.width!=s&&(w=this.CHANGE_H_SCROLL),(r||g)&&(w=this.$updateCachedSize(!0,this.gutterWidth,t.width,t.height),this._signal("scrollbarVisibilityChanged"),g&&(s=this.$getLongestLine())),this.layerConfig={width:s,padding:this.$padding,firstRow:A,firstRowScreen:f,lastRow:C,lineHeight:v,characterWidth:this.characterWidth,minHeight:h,maxHeight:n,offset:l,gutterOffset:v?Math.max(0,Math.ceil((l+t.height-t.scrollerHeight)/v)):0,height:this.$size.scrollerHeight},w},this.$updateLines=function(){if(this.$changedLines){var e=this.$changedLines.firstRow,t=this.$changedLines.lastRow;this.$changedLines=null;var i=this.layerConfig;if(!(e>i.lastRow+1||t<i.firstRow))return t===1/0?(this.$showGutter&&this.$gutterLayer.update(i),void this.$textLayer.update(i)):(this.$textLayer.updateLines(i,e,t),!0)}},this.$getLongestLine=function(){var e=this.session.getScreenWidth();return this.showInvisibles&&!this.session.$useWrapMode&&(e+=1),Math.max(this.$size.scrollerWidth-2*this.$padding,Math.round(e*this.characterWidth))},this.updateFrontMarkers=function(){this.$markerFront.setMarkers(this.session.getMarkers(!0)),this.$loop.schedule(this.CHANGE_MARKER_FRONT);},this.updateBackMarkers=function(){this.$markerBack.setMarkers(this.session.getMarkers()),this.$loop.schedule(this.CHANGE_MARKER_BACK);},this.addGutterDecoration=function(e,t){this.$gutterLayer.addGutterDecoration(e,t);},this.removeGutterDecoration=function(e,t){this.$gutterLayer.removeGutterDecoration(e,t);},this.updateBreakpoints=function(e){this.$loop.schedule(this.CHANGE_GUTTER);},this.setAnnotations=function(e){this.$gutterLayer.setAnnotations(e),this.$loop.schedule(this.CHANGE_GUTTER);},this.updateCursor=function(){this.$loop.schedule(this.CHANGE_CURSOR);},this.hideCursor=function(){this.$cursorLayer.hideCursor();},this.showCursor=function(){this.$cursorLayer.showCursor();},this.scrollSelectionIntoView=function(e,t,i){this.scrollCursorIntoView(e,i),this.scrollCursorIntoView(t,i);},this.scrollCursorIntoView=function(e,t,i){if(0!==this.$size.scrollerHeight){var n=this.$cursorLayer.getPixelPosition(e),s=n.left,o=n.top,r=i&&i.top||0,a=i&&i.bottom||0,l=this.$scrollAnimation?this.session.getScrollTop():this.scrollTop;l+r>o?(t&&l+r>o+this.lineHeight&&(o-=t*this.$size.scrollerHeight),0===o&&(o=-this.scrollMargin.top),this.session.setScrollTop(o)):l+this.$size.scrollerHeight-a<o+this.lineHeight&&(t&&l+this.$size.scrollerHeight-a<o-this.lineHeight&&(o+=t*this.$size.scrollerHeight),this.session.setScrollTop(o+this.lineHeight-this.$size.scrollerHeight));var h=this.scrollLeft;h>s?(s<this.$padding+2*this.layerConfig.characterWidth&&(s=-this.scrollMargin.left),this.session.setScrollLeft(s)):h+this.$size.scrollerWidth<s+this.characterWidth?this.session.setScrollLeft(Math.round(s+this.characterWidth-this.$size.scrollerWidth)):h<=this.$padding&&s-h<this.characterWidth&&this.session.setScrollLeft(0);}},this.getScrollTop=function(){return this.session.getScrollTop()},this.getScrollLeft=function(){return this.session.getScrollLeft()},this.getScrollTopRow=function(){return this.scrollTop/this.lineHeight},this.getScrollBottomRow=function(){return Math.max(0,Math.floor((this.scrollTop+this.$size.scrollerHeight)/this.lineHeight)-1)},this.scrollToRow=function(e){this.session.setScrollTop(e*this.lineHeight);},this.alignCursor=function(e,t){"number"==typeof e&&(e={row:e,column:0});var i=this.$cursorLayer.getPixelPosition(e),n=this.$size.scrollerHeight-this.lineHeight,s=i.top-n*(t||0);return this.session.setScrollTop(s),s},this.STEPS=8,this.$calcSteps=function(e,t){var i,n,s=0,o=this.STEPS,r=[];for(s=0;s<o;++s)r.push((i=s/this.STEPS,n=e,(t-e)*(Math.pow(i-1,3)+1)+n));return r},this.scrollToLine=function(e,t,i,n){var s=this.$cursorLayer.getPixelPosition({row:e,column:0}).top;t&&(s-=this.$size.scrollerHeight/2);var o=this.scrollTop;this.session.setScrollTop(s),!1!==i&&this.animateScrolling(o,n);},this.animateScrolling=function(e,t){var i=this.scrollTop;if(this.$animatedScroll){var n=this;if(e!=i){if(this.$scrollAnimation){var s=this.$scrollAnimation.steps;if(s.length&&(e=s[0])==i)return}var o=n.$calcSteps(e,i);this.$scrollAnimation={from:e,to:i,steps:o},clearInterval(this.$timer),n.session.setScrollTop(o.shift()),n.session.$scrollTop=i,this.$timer=setInterval((function(){o.length?(n.session.setScrollTop(o.shift()),n.session.$scrollTop=i):null!=i?(n.session.$scrollTop=-1,n.session.setScrollTop(i),i=null):(n.$timer=clearInterval(n.$timer),n.$scrollAnimation=null,t&&t());}),10);}}},this.scrollToY=function(e){this.scrollTop!==e&&(this.$loop.schedule(this.CHANGE_SCROLL),this.scrollTop=e);},this.scrollToX=function(e){this.scrollLeft!==e&&(this.scrollLeft=e),this.$loop.schedule(this.CHANGE_H_SCROLL);},this.scrollTo=function(e,t){this.session.setScrollTop(t),this.session.setScrollLeft(t);},this.scrollBy=function(e,t){t&&this.session.setScrollTop(this.session.getScrollTop()+t),e&&this.session.setScrollLeft(this.session.getScrollLeft()+e);},this.isScrollableBy=function(e,t){return t<0&&this.session.getScrollTop()>=1-this.scrollMargin.top||(t>0&&this.session.getScrollTop()+this.$size.scrollerHeight-this.layerConfig.maxHeight<-1+this.scrollMargin.bottom||(e<0&&this.session.getScrollLeft()>=1-this.scrollMargin.left||(e>0&&this.session.getScrollLeft()+this.$size.scrollerWidth-this.layerConfig.width<-1+this.scrollMargin.right||void 0)))},this.pixelToScreenCoordinates=function(e,t){var i=this.scroller.getBoundingClientRect(),n=e+this.scrollLeft-i.left-this.$padding,s=n/this.characterWidth,o=Math.floor((t+this.scrollTop-i.top)/this.lineHeight),r=Math.round(s);return {row:o,column:r,side:s-r>0?1:-1,offsetX:n}},this.screenToTextCoordinates=function(e,t){var i=this.scroller.getBoundingClientRect(),n=e+this.scrollLeft-i.left-this.$padding,s=Math.round(n/this.characterWidth),o=(t+this.scrollTop-i.top)/this.lineHeight;return this.session.screenToDocumentPosition(o,Math.max(s,0),n)},this.textToScreenCoordinates=function(e,t){var i=this.scroller.getBoundingClientRect(),n=this.session.documentToScreenPosition(e,t),s=this.$padding+(this.session.$bidiHandler.isBidiRow(n.row,e)?this.session.$bidiHandler.getPosLeft(n.column):Math.round(n.column*this.characterWidth)),o=n.row*this.lineHeight;return {pageX:i.left+s-this.scrollLeft,pageY:i.top+o-this.scrollTop}},this.visualizeFocus=function(){s.addCssClass(this.container,"ace_focus");},this.visualizeBlur=function(){s.removeCssClass(this.container,"ace_focus");},this.showComposition=function(e){this.$composition||(this.$composition={keepTextAreaAtCursor:this.$keepTextAreaAtCursor,cssText:this.textarea.style.cssText}),this.$keepTextAreaAtCursor=!0,s.addCssClass(this.textarea,"ace_composition"),this.textarea.style.cssText="",this.$moveTextAreaToCursor();},this.setCompositionText=function(e){this.$moveTextAreaToCursor();},this.hideComposition=function(){this.$composition&&(s.removeCssClass(this.textarea,"ace_composition"),this.$keepTextAreaAtCursor=this.$composition.keepTextAreaAtCursor,this.textarea.style.cssText=this.$composition.cssText,this.$composition=null);},this.setTheme=function(e,t){var i=this;if(this.$themeId=e,i._dispatchEvent("themeChange",{theme:e}),e&&"string"!=typeof e)r(e);else {var n=e||this.$options.theme.initialValue;o.loadModule(["theme",n],r);}function r(n){if(i.$themeId!=e)return t&&t();if(!n||!n.cssClass)throw new Error("couldn't load module "+e+" or it didn't call define");s.importCssString(n.cssText,n.cssClass,i.container.ownerDocument),i.theme&&s.removeCssClass(i.container,i.theme.cssClass);var o="padding"in n?n.padding:"padding"in(i.theme||{})?4:i.$padding;i.$padding&&o!=i.$padding&&i.setPadding(o),i.$theme=n.cssClass,i.theme=n,s.addCssClass(i.container,n.cssClass),s.setCssClass(i.container,"ace_dark",n.isDark),i.$size&&(i.$size.width=0,i.$updateSizeAsync()),i._dispatchEvent("themeLoaded",{theme:n}),t&&t();}},this.getTheme=function(){return this.$themeId},this.setStyle=function(e,t){s.setCssClass(this.container,e,!1!==t);},this.unsetStyle=function(e){s.removeCssClass(this.container,e);},this.setCursorStyle=function(e){this.scroller.style.cursor!=e&&(this.scroller.style.cursor=e);},this.setMouseCursor=function(e){this.scroller.style.cursor=e;},this.destroy=function(){this.$textLayer.destroy(),this.$cursorLayer.destroy();};})).call(p.prototype),o.defineOptions(p.prototype,"renderer",{animatedScroll:{initialValue:!1},showInvisibles:{set:function(e){this.$textLayer.setShowInvisibles(e)&&this.$loop.schedule(this.CHANGE_TEXT);},initialValue:!1},showPrintMargin:{set:function(){this.$updatePrintMargin();},initialValue:!0},printMarginColumn:{set:function(){this.$updatePrintMargin();},initialValue:80},printMargin:{set:function(e){"number"==typeof e&&(this.$printMarginColumn=e),this.$showPrintMargin=!!e,this.$updatePrintMargin();},get:function(){return this.$showPrintMargin&&this.$printMarginColumn}},showGutter:{set:function(e){this.$gutter.style.display=e?"block":"none",this.$loop.schedule(this.CHANGE_FULL),this.onGutterResize();},initialValue:!0},fadeFoldWidgets:{set:function(e){s.setCssClass(this.$gutter,"ace_fade-fold-widgets",e);},initialValue:!1},showFoldWidgets:{set:function(e){this.$gutterLayer.setShowFoldWidgets(e);},initialValue:!0},showLineNumbers:{set:function(e){this.$gutterLayer.setShowLineNumbers(e),this.$loop.schedule(this.CHANGE_GUTTER);},initialValue:!0},displayIndentGuides:{set:function(e){this.$textLayer.setDisplayIndentGuides(e)&&this.$loop.schedule(this.CHANGE_TEXT);},initialValue:!0},highlightGutterLine:{set:function(e){if(!this.$gutterLineHighlight)return this.$gutterLineHighlight=s.createElement("div"),this.$gutterLineHighlight.className="ace_gutter-active-line",void this.$gutter.appendChild(this.$gutterLineHighlight);this.$gutterLineHighlight.style.display=e?"":"none",this.$cursorLayer.$pixelPos&&this.$updateGutterLineHighlight();},initialValue:!1,value:!0},hScrollBarAlwaysVisible:{set:function(e){this.$hScrollBarAlwaysVisible&&this.$horizScroll||this.$loop.schedule(this.CHANGE_SCROLL);},initialValue:!1},vScrollBarAlwaysVisible:{set:function(e){this.$vScrollBarAlwaysVisible&&this.$vScroll||this.$loop.schedule(this.CHANGE_SCROLL);},initialValue:!1},fontSize:{set:function(e){"number"==typeof e&&(e+="px"),this.container.style.fontSize=e,this.updateFontSize();},initialValue:12},fontFamily:{set:function(e){this.container.style.fontFamily=e,this.updateFontSize();}},maxLines:{set:function(e){this.updateFull();}},minLines:{set:function(e){this.updateFull();}},maxPixelHeight:{set:function(e){this.updateFull();},initialValue:0},scrollPastEnd:{set:function(e){e=+e||0,this.$scrollPastEnd!=e&&(this.$scrollPastEnd=e,this.$loop.schedule(this.CHANGE_SCROLL));},initialValue:0,handlesSet:!0},fixedWidthGutter:{set:function(e){this.$gutterLayer.$fixedWidth=!!e,this.$loop.schedule(this.CHANGE_GUTTER);}},theme:{set:function(e){this.setTheme(e);},get:function(){return this.$themeId||this.theme},initialValue:"./theme/textmate",handlesSet:!0}}),t.VirtualRenderer=p;})),ace.define("ace/worker/worker_client",["require","exports","module","ace/lib/oop","ace/lib/net","ace/lib/event_emitter","ace/config"],(function(e,t,i){var n=e("../lib/oop"),s=e("../lib/net"),o=e("../lib/event_emitter").EventEmitter,r=e("../config");function a(e,t){var i=function(e,t){var i=t.src;s.qualifyURL(e);try{return new Blob([i],{type:"application/javascript"})}catch(e){var n=new(window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder);return n.append(i),n.getBlob("application/javascript")}}(e,t),n=(window.URL||window.webkitURL).createObjectURL(i);return new Worker(n)}var l=function(t,i,n,s,o){if(this.$sendDeltaQueue=this.$sendDeltaQueue.bind(this),this.changeListener=this.changeListener.bind(this),this.onMessage=this.onMessage.bind(this),e.nameToUrl&&!e.toUrl&&(e.toUrl=e.nameToUrl),r.get("packaged")||!e.toUrl)s=s||r.moduleUrl(i.id,"worker");else {var l=this.$normalizePath;s=s||l(e.toUrl("ace/worker/worker.js",null,"_"));var h={};t.forEach((function(t){h[t]=l(e.toUrl(t,null,"_").replace(/(\.js)?(\?.*)?$/,""));}));}this.$worker=a(s,i),o&&this.send("importScripts",o),this.$worker.postMessage({init:!0,tlns:h,module:i.id,classname:n}),this.callbackId=1,this.callbacks={},this.$worker.onmessage=this.onMessage;};(function(){n.implement(this,o),this.onMessage=function(e){var t=e.data;switch(t.type){case"event":this._signal(t.name,{data:t.data});break;case"call":var i=this.callbacks[t.id];i&&(i(t.data),delete this.callbacks[t.id]);break;case"error":this.reportError(t.data);break;case"log":window.console&&console.log&&console.log.apply(console,t.data);}},this.reportError=function(e){window.console&&console.error&&console.error(e);},this.$normalizePath=function(e){return s.qualifyURL(e)},this.terminate=function(){this._signal("terminate",{}),this.deltaQueue=null,this.$worker.terminate(),this.$worker=null,this.$doc&&this.$doc.off("change",this.changeListener),this.$doc=null;},this.send=function(e,t){this.$worker.postMessage({command:e,args:t});},this.call=function(e,t,i){if(i){var n=this.callbackId++;this.callbacks[n]=i,t.push(n);}this.send(e,t);},this.emit=function(e,t){try{this.$worker.postMessage({event:e,data:{data:t.data}});}catch(e){console.error(e.stack);}},this.attachToDocument=function(e){this.$doc&&this.terminate(),this.$doc=e,this.call("setValue",[e.getValue()]),e.on("change",this.changeListener);},this.changeListener=function(e){this.deltaQueue||(this.deltaQueue=[],setTimeout(this.$sendDeltaQueue,0)),"insert"==e.action?this.deltaQueue.push(e.start,e.lines):this.deltaQueue.push(e.start,e.end);},this.$sendDeltaQueue=function(){var e=this.deltaQueue;e&&(this.deltaQueue=null,e.length>50&&e.length>this.$doc.getLength()>>1?this.call("setValue",[this.$doc.getValue()]):this.emit("change",{data:e}));};}).call(l.prototype);var h=function(e,t,i){this.$sendDeltaQueue=this.$sendDeltaQueue.bind(this),this.changeListener=this.changeListener.bind(this),this.callbackId=1,this.callbacks={},this.messageBuffer=[];var n=null,s=!1,a=Object.create(o),l=this;this.$worker={},this.$worker.terminate=function(){},this.$worker.postMessage=function(e){l.messageBuffer.push(e),n&&(s?setTimeout(h):h());},this.setEmitSync=function(e){s=e;};var h=function(){var e=l.messageBuffer.shift();e.command?n[e.command].apply(n,e.args):e.event&&a._signal(e.event,e.data);};a.postMessage=function(e){l.onMessage({data:e});},a.callback=function(e,t){this.postMessage({type:"call",id:t,data:e});},a.emit=function(e,t){this.postMessage({type:"event",name:e,data:t});},r.loadModule(["worker",t],(function(e){for(n=new e[i](a);l.messageBuffer.length;)h();}));};h.prototype=l.prototype,t.UIWorkerClient=h,t.WorkerClient=l,t.createWorker=a;})),ace.define("ace/placeholder",["require","exports","module","ace/range","ace/lib/event_emitter","ace/lib/oop"],(function(e,t,i){var n=e("./range").Range,s=e("./lib/event_emitter").EventEmitter,o=e("./lib/oop"),r=function(e,t,i,n,s,o){var r=this;this.length=t,this.session=e,this.doc=e.getDocument(),this.mainClass=s,this.othersClass=o,this.$onUpdate=this.onUpdate.bind(this),this.doc.on("change",this.$onUpdate),this.$others=n,this.$onCursorChange=function(){setTimeout((function(){r.onCursorChange();}));},this.$pos=i;var a=e.getUndoManager().$undoStack||e.getUndoManager().$undostack||{length:-1};this.$undoStackDepth=a.length,this.setup(),e.selection.on("changeCursor",this.$onCursorChange);};((function(){o.implement(this,s),this.setup=function(){var e=this,t=this.doc,i=this.session;this.selectionBefore=i.selection.toJSON(),i.selection.inMultiSelectMode&&i.selection.toSingleRange(),this.pos=t.createAnchor(this.$pos.row,this.$pos.column);var s=this.pos;s.$insertRight=!0,s.detach(),s.markerId=i.addMarker(new n(s.row,s.column,s.row,s.column+this.length),this.mainClass,null,!1),this.others=[],this.$others.forEach((function(i){var n=t.createAnchor(i.row,i.column);n.$insertRight=!0,n.detach(),e.others.push(n);})),i.setUndoSelect(!1);},this.showOtherMarkers=function(){if(!this.othersActive){var e=this.session,t=this;this.othersActive=!0,this.others.forEach((function(i){i.markerId=e.addMarker(new n(i.row,i.column,i.row,i.column+t.length),t.othersClass,null,!1);}));}},this.hideOtherMarkers=function(){if(this.othersActive){this.othersActive=!1;for(var e=0;e<this.others.length;e++)this.session.removeMarker(this.others[e].markerId);}},this.onUpdate=function(e){if(this.$updating)return this.updateAnchors(e);var t=e;if(t.start.row===t.end.row&&t.start.row===this.pos.row){this.$updating=!0;var i="insert"===e.action?t.end.column-t.start.column:t.start.column-t.end.column,s=t.start.column>=this.pos.column&&t.start.column<=this.pos.column+this.length+1,o=t.start.column-this.pos.column;if(this.updateAnchors(e),s&&(this.length+=i),s&&!this.session.$fromUndo)if("insert"===e.action)for(var r=this.others.length-1;r>=0;r--){var a={row:(l=this.others[r]).row,column:l.column+o};this.doc.insertMergedLines(a,e.lines);}else if("remove"===e.action)for(r=this.others.length-1;r>=0;r--){var l;a={row:(l=this.others[r]).row,column:l.column+o};this.doc.remove(new n(a.row,a.column,a.row,a.column-i));}this.$updating=!1,this.updateMarkers();}},this.updateAnchors=function(e){this.pos.onChange(e);for(var t=this.others.length;t--;)this.others[t].onChange(e);this.updateMarkers();},this.updateMarkers=function(){if(!this.$updating){var e=this,t=this.session,i=function(i,s){t.removeMarker(i.markerId),i.markerId=t.addMarker(new n(i.row,i.column,i.row,i.column+e.length),s,null,!1);};i(this.pos,this.mainClass);for(var s=this.others.length;s--;)i(this.others[s],this.othersClass);}},this.onCursorChange=function(e){if(!this.$updating&&this.session){var t=this.session.selection.getCursor();t.row===this.pos.row&&t.column>=this.pos.column&&t.column<=this.pos.column+this.length?(this.showOtherMarkers(),this._emit("cursorEnter",e)):(this.hideOtherMarkers(),this._emit("cursorLeave",e));}},this.detach=function(){this.session.removeMarker(this.pos&&this.pos.markerId),this.hideOtherMarkers(),this.doc.removeEventListener("change",this.$onUpdate),this.session.selection.removeEventListener("changeCursor",this.$onCursorChange),this.session.setUndoSelect(!0),this.session=null;},this.cancel=function(){if(-1!==this.$undoStackDepth){for(var e=this.session.getUndoManager(),t=(e.$undoStack||e.$undostack).length-this.$undoStackDepth,i=0;i<t;i++)e.undo(!0);this.selectionBefore&&this.session.selection.fromJSON(this.selectionBefore);}};})).call(r.prototype),t.PlaceHolder=r;})),ace.define("ace/mouse/multi_select_handler",["require","exports","module","ace/lib/event","ace/lib/useragent"],(function(e,t,i){var n=e("../lib/event"),s=e("../lib/useragent");function o(e,t){return e.row==t.row&&e.column==t.column}t.onMouseDown=function(e){var t=e.domEvent,i=t.altKey,r=t.shiftKey,a=t.ctrlKey,l=e.getAccelKey(),h=e.getButton();if(a&&s.isMac&&(h=t.button),e.editor.inMultiSelectMode&&2==h)e.editor.textInput.onContextMenu(e.domEvent);else if(a||i||l){if(0===h){var c,u=e.editor,d=u.selection,g=u.inMultiSelectMode,f=e.getDocumentPosition(),m=d.getCursor(),p=e.inSelection()||d.isEmpty()&&o(f,m),A=e.x,C=e.y,v=u.session,F=u.renderer.pixelToScreenCoordinates(A,C),w=F;if(u.$mouseHandler.$enableJumpToDef)a&&i||l&&i?c=r?"block":"add":i&&u.$blockSelectEnabled&&(c="block");else if(l&&!i){if(c="add",!g&&r)return}else i&&u.$blockSelectEnabled&&(c="block");if(c&&s.isMac&&t.ctrlKey&&u.$mouseHandler.cancelContextMenu(),"add"==c){if(!g&&p)return;if(!g){var E=d.toOrientedRange();u.addSelectionMarker(E);}var b=d.rangeList.rangeAtPoint(f);u.$blockScrolling++,u.inVirtualSelectionMode=!0,r&&(b=null,E=d.ranges[0]||E,u.removeSelectionMarker(E)),u.once("mouseup",(function(){var e=d.toOrientedRange();b&&e.isEmpty()&&o(b.cursor,e.cursor)?d.substractPoint(e.cursor):(r?d.substractPoint(E.cursor):E&&(u.removeSelectionMarker(E),d.addRange(E)),d.addRange(e)),u.$blockScrolling--,u.inVirtualSelectionMode=!1;}));}else if("block"==c){var $;e.stop(),u.inVirtualSelectionMode=!0;var y=[];u.$blockScrolling++,g&&!l?d.toSingleRange():!g&&l&&($=d.toOrientedRange(),u.addSelectionMarker($)),r?F=v.documentToScreenPosition(d.lead):d.moveToPosition(f),u.$blockScrolling--,w={row:-1,column:-1};var B=function(){var e=u.renderer.pixelToScreenCoordinates(A,C),t=v.screenToDocumentPosition(e.row,e.column,e.offsetX);o(w,e)&&o(t,d.lead)||(w=e,u.$blockScrolling++,u.selection.moveToPosition(t),u.renderer.scrollCursorIntoView(),u.removeSelectionMarkers(y),y=d.rectangularRangeBlock(w,F),u.$mouseHandler.$clickSelection&&1==y.length&&y[0].isEmpty()&&(y[0]=u.$mouseHandler.$clickSelection.clone()),y.forEach(u.addSelectionMarker,u),u.updateSelectionMarkers(),u.$blockScrolling--);};n.capture(u.container,(function(e){A=e.clientX,C=e.clientY;}),(function(e){clearInterval(S),u.removeSelectionMarkers(y),y.length||(y=[d.toOrientedRange()]),u.$blockScrolling++,$&&(u.removeSelectionMarker($),d.toSingleRange($));for(var t=0;t<y.length;t++)d.addRange(y[t]);u.inVirtualSelectionMode=!1,u.$mouseHandler.$clickSelection=null,u.$blockScrolling--;}));var S=setInterval((function(){B();}),20);return e.preventDefault()}}}else 0===h&&e.editor.inMultiSelectMode&&e.editor.exitMultiSelectMode();};})),ace.define("ace/commands/multi_select_commands",["require","exports","module","ace/keyboard/hash_handler"],(function(e,t,i){t.defaultCommands=[{name:"addCursorAbove",exec:function(e){e.selectMoreLines(-1);},bindKey:{win:"Ctrl-Alt-Up",mac:"Ctrl-Alt-Up"},scrollIntoView:"cursor",readOnly:!0},{name:"addCursorBelow",exec:function(e){e.selectMoreLines(1);},bindKey:{win:"Ctrl-Alt-Down",mac:"Ctrl-Alt-Down"},scrollIntoView:"cursor",readOnly:!0},{name:"addCursorAboveSkipCurrent",exec:function(e){e.selectMoreLines(-1,!0);},bindKey:{win:"Ctrl-Alt-Shift-Up",mac:"Ctrl-Alt-Shift-Up"},scrollIntoView:"cursor",readOnly:!0},{name:"addCursorBelowSkipCurrent",exec:function(e){e.selectMoreLines(1,!0);},bindKey:{win:"Ctrl-Alt-Shift-Down",mac:"Ctrl-Alt-Shift-Down"},scrollIntoView:"cursor",readOnly:!0},{name:"selectMoreBefore",exec:function(e){e.selectMore(-1);},bindKey:{win:"Ctrl-Alt-Left",mac:"Ctrl-Alt-Left"},scrollIntoView:"cursor",readOnly:!0},{name:"selectMoreAfter",exec:function(e){e.selectMore(1);},bindKey:{win:"Ctrl-Alt-Right",mac:"Ctrl-Alt-Right"},scrollIntoView:"cursor",readOnly:!0},{name:"selectNextBefore",exec:function(e){e.selectMore(-1,!0);},bindKey:{win:"Ctrl-Alt-Shift-Left",mac:"Ctrl-Alt-Shift-Left"},scrollIntoView:"cursor",readOnly:!0},{name:"selectNextAfter",exec:function(e){e.selectMore(1,!0);},bindKey:{win:"Ctrl-Alt-Shift-Right",mac:"Ctrl-Alt-Shift-Right"},scrollIntoView:"cursor",readOnly:!0},{name:"splitIntoLines",exec:function(e){e.multiSelect.splitIntoLines();},bindKey:{win:"Ctrl-Alt-L",mac:"Ctrl-Alt-L"},readOnly:!0},{name:"alignCursors",exec:function(e){e.alignCursors();},bindKey:{win:"Ctrl-Alt-A",mac:"Ctrl-Alt-A"},scrollIntoView:"cursor"},{name:"findAll",exec:function(e){e.findAll();},bindKey:{win:"Ctrl-Alt-K",mac:"Ctrl-Alt-G"},scrollIntoView:"cursor",readOnly:!0}],t.multiSelectCommands=[{name:"singleSelection",bindKey:"esc",exec:function(e){e.exitMultiSelectMode();},scrollIntoView:"cursor",readOnly:!0,isAvailable:function(e){return e&&e.inMultiSelectMode}}];var n=e("../keyboard/hash_handler").HashHandler;t.keyboardHandler=new n(t.multiSelectCommands);})),ace.define("ace/multi_select",["require","exports","module","ace/range_list","ace/range","ace/selection","ace/mouse/multi_select_handler","ace/lib/event","ace/lib/lang","ace/commands/multi_select_commands","ace/search","ace/edit_session","ace/editor","ace/config"],(function(e,t,i){var n=e("./range_list").RangeList,s=e("./range").Range,o=e("./selection").Selection,r=e("./mouse/multi_select_handler").onMouseDown,a=e("./lib/event"),l=e("./lib/lang"),h=e("./commands/multi_select_commands");t.commands=h.defaultCommands.concat(h.multiSelectCommands);var c=new(e("./search").Search);var u=e("./edit_session").EditSession;((function(){this.getSelectionMarkers=function(){return this.$selectionMarkers};})).call(u.prototype),function(){this.ranges=null,this.rangeList=null,this.addRange=function(e,t){if(e){if(!this.inMultiSelectMode&&0===this.rangeCount){var i=this.toOrientedRange();if(this.rangeList.add(i),this.rangeList.add(e),2!=this.rangeList.ranges.length)return this.rangeList.removeAll(),t||this.fromOrientedRange(e);this.rangeList.removeAll(),this.rangeList.add(i),this.$onAddRange(i);}e.cursor||(e.cursor=e.end);var n=this.rangeList.add(e);return this.$onAddRange(e),n.length&&this.$onRemoveRange(n),this.rangeCount>1&&!this.inMultiSelectMode&&(this._signal("multiSelect"),this.inMultiSelectMode=!0,this.session.$undoSelect=!1,this.rangeList.attach(this.session)),t||this.fromOrientedRange(e)}},this.toSingleRange=function(e){e=e||this.ranges[0];var t=this.rangeList.removeAll();t.length&&this.$onRemoveRange(t),e&&this.fromOrientedRange(e);},this.substractPoint=function(e){var t=this.rangeList.substractPoint(e);if(t)return this.$onRemoveRange(t),t[0]},this.mergeOverlappingRanges=function(){var e=this.rangeList.merge();e.length?this.$onRemoveRange(e):this.ranges[0]&&this.fromOrientedRange(this.ranges[0]);},this.$onAddRange=function(e){this.rangeCount=this.rangeList.ranges.length,this.ranges.unshift(e),this._signal("addRange",{range:e});},this.$onRemoveRange=function(e){if(this.rangeCount=this.rangeList.ranges.length,1==this.rangeCount&&this.inMultiSelectMode){var t=this.rangeList.ranges.pop();e.push(t),this.rangeCount=0;}for(var i=e.length;i--;){var n=this.ranges.indexOf(e[i]);this.ranges.splice(n,1);}this._signal("removeRange",{ranges:e}),0===this.rangeCount&&this.inMultiSelectMode&&(this.inMultiSelectMode=!1,this._signal("singleSelect"),this.session.$undoSelect=!0,this.rangeList.detach(this.session)),(t=t||this.ranges[0])&&!t.isEqual(this.getRange())&&this.fromOrientedRange(t);},this.$initRangeList=function(){this.rangeList||(this.rangeList=new n,this.ranges=[],this.rangeCount=0);},this.getAllRanges=function(){return this.rangeCount?this.rangeList.ranges.concat():[this.getRange()]},this.splitIntoLines=function(){if(this.rangeCount>1){var e=this.rangeList.ranges,t=e[e.length-1],i=s.fromPoints(e[0].start,t.end);this.toSingleRange(),this.setSelectionRange(i,t.cursor==t.start);}else {i=this.getRange();var n=this.isBackwards(),o=i.start.row,r=i.end.row;if(o==r){if(n)var a=i.end,l=i.start;else a=i.start,l=i.end;return this.addRange(s.fromPoints(l,l)),void this.addRange(s.fromPoints(a,a))}var h=[],c=this.getLineRange(o,!0);c.start.column=i.start.column,h.push(c);for(var u=o+1;u<r;u++)h.push(this.getLineRange(u,!0));(c=this.getLineRange(r,!0)).end.column=i.end.column,h.push(c),h.forEach(this.addRange,this);}},this.toggleBlockSelection=function(){if(this.rangeCount>1){var e=this.rangeList.ranges,t=e[e.length-1],i=s.fromPoints(e[0].start,t.end);this.toSingleRange(),this.setSelectionRange(i,t.cursor==t.start);}else {var n=this.session.documentToScreenPosition(this.selectionLead),o=this.session.documentToScreenPosition(this.selectionAnchor);this.rectangularRangeBlock(n,o).forEach(this.addRange,this);}},this.rectangularRangeBlock=function(e,t,i){var n=[],o=e.column<t.column;if(o)var r=e.column,a=t.column,l=e.offsetX,h=t.offsetX;else r=t.column,a=e.column,l=t.offsetX,h=e.offsetX;var c,u,d=e.row<t.row;if(d)var g=e.row,f=t.row;else g=t.row,f=e.row;r<0&&(r=0),g<0&&(g=0),g==f&&(i=!0);for(var m=g;m<=f;m++){var p=s.fromPoints(this.session.screenToDocumentPosition(m,r,l),this.session.screenToDocumentPosition(m,a,h));if(p.isEmpty()){if(A&&(c=p.end,u=A,c.row==u.row&&c.column==u.column))break;var A=p.end;}p.cursor=o?p.start:p.end,n.push(p);}if(d&&n.reverse(),!i){for(var C=n.length-1;n[C].isEmpty()&&C>0;)C--;if(C>0)for(var v=0;n[v].isEmpty();)v++;for(var F=C;F>=v;F--)n[F].isEmpty()&&n.splice(F,1);}return n};}.call(o.prototype);var d=e("./editor").Editor;function g(e){e.$multiselectOnSessionChange||(e.$onAddRange=e.$onAddRange.bind(e),e.$onRemoveRange=e.$onRemoveRange.bind(e),e.$onMultiSelect=e.$onMultiSelect.bind(e),e.$onSingleSelect=e.$onSingleSelect.bind(e),e.$multiselectOnSessionChange=t.onSessionChange.bind(e),e.$checkMultiselectChange=e.$checkMultiselectChange.bind(e),e.$multiselectOnSessionChange(e),e.on("changeSession",e.$multiselectOnSessionChange),e.on("mousedown",r),e.commands.addCommands(h.defaultCommands),function(e){var t=e.textInput.getElement(),i=!1;function n(t){i&&(e.renderer.setMouseCursor(""),i=!1);}a.addListener(t,"keydown",(function(t){var s=18==t.keyCode&&!(t.ctrlKey||t.shiftKey||t.metaKey);e.$blockSelectEnabled&&s?i||(e.renderer.setMouseCursor("crosshair"),i=!0):i&&n();})),a.addListener(t,"keyup",n),a.addListener(t,"blur",n);}(e));}((function(){this.updateSelectionMarkers=function(){this.renderer.updateCursor(),this.renderer.updateBackMarkers();},this.addSelectionMarker=function(e){e.cursor||(e.cursor=e.end);var t=this.getSelectionStyle();return e.marker=this.session.addMarker(e,"ace_selection",t),this.session.$selectionMarkers.push(e),this.session.selectionMarkerCount=this.session.$selectionMarkers.length,e},this.removeSelectionMarker=function(e){if(e.marker){this.session.removeMarker(e.marker);var t=this.session.$selectionMarkers.indexOf(e);-1!=t&&this.session.$selectionMarkers.splice(t,1),this.session.selectionMarkerCount=this.session.$selectionMarkers.length;}},this.removeSelectionMarkers=function(e){for(var t=this.session.$selectionMarkers,i=e.length;i--;){var n=e[i];if(n.marker){this.session.removeMarker(n.marker);var s=t.indexOf(n);-1!=s&&t.splice(s,1);}}this.session.selectionMarkerCount=t.length;},this.$onAddRange=function(e){this.addSelectionMarker(e.range),this.renderer.updateCursor(),this.renderer.updateBackMarkers();},this.$onRemoveRange=function(e){this.removeSelectionMarkers(e.ranges),this.renderer.updateCursor(),this.renderer.updateBackMarkers();},this.$onMultiSelect=function(e){this.inMultiSelectMode||(this.inMultiSelectMode=!0,this.setStyle("ace_multiselect"),this.keyBinding.addKeyboardHandler(h.keyboardHandler),this.commands.setDefaultHandler("exec",this.$onMultiSelectExec),this.renderer.updateCursor(),this.renderer.updateBackMarkers());},this.$onSingleSelect=function(e){this.session.multiSelect.inVirtualMode||(this.inMultiSelectMode=!1,this.unsetStyle("ace_multiselect"),this.keyBinding.removeKeyboardHandler(h.keyboardHandler),this.commands.removeDefaultHandler("exec",this.$onMultiSelectExec),this.renderer.updateCursor(),this.renderer.updateBackMarkers(),this._emit("changeSelection"));},this.$onMultiSelectExec=function(e){var t=e.command,i=e.editor;if(i.multiSelect){if(t.multiSelectAction)"forEach"==t.multiSelectAction?n=i.forEachSelection(t,e.args):"forEachLine"==t.multiSelectAction?n=i.forEachSelection(t,e.args,!0):"single"==t.multiSelectAction?(i.exitMultiSelectMode(),n=t.exec(i,e.args||{})):n=t.multiSelectAction(i,e.args||{});else {var n=t.exec(i,e.args||{});i.multiSelect.addRange(i.multiSelect.toOrientedRange()),i.multiSelect.mergeOverlappingRanges();}return n}},this.forEachSelection=function(e,t,i){if(!this.inVirtualSelectionMode){var n,s=i&&i.keepOrder,r=1==i||i&&i.$byLines,a=this.session,l=this.selection,h=l.rangeList,c=(s?l:h).ranges;if(!c.length)return e.exec?e.exec(this,t||{}):e(this,t||{});var u=l._eventRegistry;l._eventRegistry={};var d=new o(a);this.inVirtualSelectionMode=!0;for(var g=c.length;g--;){if(r)for(;g>0&&c[g].start.row==c[g-1].end.row;)g--;d.fromOrientedRange(c[g]),d.index=g,this.selection=a.selection=d;var f=e.exec?e.exec(this,t||{}):e(this,t||{});n||void 0===f||(n=f),d.toOrientedRange(c[g]);}d.detach(),this.selection=a.selection=l,this.inVirtualSelectionMode=!1,l._eventRegistry=u,l.mergeOverlappingRanges();var m=this.renderer.$scrollAnimation;return this.onCursorChange(),this.onSelectionChange(),m&&m.from==m.to&&this.renderer.animateScrolling(m.from),n}},this.exitMultiSelectMode=function(){this.inMultiSelectMode&&!this.inVirtualSelectionMode&&this.multiSelect.toSingleRange();},this.getSelectedText=function(){var e="";if(this.inMultiSelectMode&&!this.inVirtualSelectionMode){for(var t=this.multiSelect.rangeList.ranges,i=[],n=0;n<t.length;n++)i.push(this.session.getTextRange(t[n]));var s=this.session.getDocument().getNewLineCharacter();(e=i.join(s)).length==(i.length-1)*s.length&&(e="");}else this.selection.isEmpty()||(e=this.session.getTextRange(this.getSelectionRange()));return e},this.$checkMultiselectChange=function(e,t){if(this.inMultiSelectMode&&!this.inVirtualSelectionMode){var i=this.multiSelect.ranges[0];if(this.multiSelect.isEmpty()&&t==this.multiSelect.anchor)return;var n=t==this.multiSelect.anchor?i.cursor==i.start?i.end:i.start:i.cursor;n.row==t.row&&this.session.$clipPositionToDocument(n.row,n.column).column==t.column||this.multiSelect.toSingleRange(this.multiSelect.toOrientedRange());}},this.findAll=function(e,t,i){if((t=t||{}).needle=e||t.needle,null==t.needle){var n=this.selection.isEmpty()?this.selection.getWordRange():this.selection.getRange();t.needle=this.session.getTextRange(n);}this.$search.set(t);var s=this.$search.findAll(this.session);if(!s.length)return 0;this.$blockScrolling+=1;var o=this.multiSelect;i||o.toSingleRange(s[0]);for(var r=s.length;r--;)o.addRange(s[r],!0);return n&&o.rangeList.rangeAtPoint(n.start)&&o.addRange(n,!0),this.$blockScrolling-=1,s.length},this.selectMoreLines=function(e,t){var i=this.selection.toOrientedRange(),n=i.cursor==i.end,o=this.session.documentToScreenPosition(i.cursor);this.selection.$desiredColumn&&(o.column=this.selection.$desiredColumn);var r,a=this.session.screenToDocumentPosition(o.row+e,o.column);if(i.isEmpty())h=a;else var l=this.session.documentToScreenPosition(n?i.end:i.start),h=this.session.screenToDocumentPosition(l.row+e,l.column);n?(r=s.fromPoints(a,h)).cursor=r.start:(r=s.fromPoints(h,a)).cursor=r.end;if(r.desiredColumn=o.column,this.selection.inMultiSelectMode){if(t)var c=i.cursor;}else this.selection.addRange(i);this.selection.addRange(r),c&&this.selection.substractPoint(c);},this.transposeSelections=function(e){for(var t=this.session,i=t.multiSelect,n=i.ranges,s=n.length;s--;){if((a=n[s]).isEmpty()){var o=t.getWordRange(a.start.row,a.start.column);a.start.row=o.start.row,a.start.column=o.start.column,a.end.row=o.end.row,a.end.column=o.end.column;}}i.mergeOverlappingRanges();var r=[];for(s=n.length;s--;){var a=n[s];r.unshift(t.getTextRange(a));}e<0?r.unshift(r.pop()):r.push(r.shift());for(s=n.length;s--;){o=(a=n[s]).clone();t.replace(a,r[s]),a.start.row=o.start.row,a.start.column=o.start.column;}},this.selectMore=function(e,t,i){var n=this.session,s=n.multiSelect.toOrientedRange();if(!s.isEmpty()||((s=n.getWordRange(s.start.row,s.start.column)).cursor=-1==e?s.start:s.end,this.multiSelect.addRange(s),!i)){var o=n.getTextRange(s),r=function(e,t,i){return c.$options.wrap=!0,c.$options.needle=t,c.$options.backwards=-1==i,c.find(e)}(n,o,e);r&&(r.cursor=-1==e?r.start:r.end,this.$blockScrolling+=1,this.session.unfold(r),this.multiSelect.addRange(r),this.$blockScrolling-=1,this.renderer.scrollCursorIntoView(null,.5)),t&&this.multiSelect.substractPoint(s.cursor);}},this.alignCursors=function(){var e=this.session,t=e.multiSelect,i=t.ranges,n=-1,o=i.filter((function(e){if(e.cursor.row==n)return !0;n=e.cursor.row;}));if(i.length&&o.length!=i.length-1){o.forEach((function(e){t.substractPoint(e.cursor);}));var r=0,a=1/0,h=i.map((function(t){var i=t.cursor,n=e.getLine(i.row).substr(i.column).search(/\S/g);return -1==n&&(n=0),i.column>r&&(r=i.column),n<a&&(a=n),n}));i.forEach((function(t,i){var n=t.cursor,o=r-n.column,c=h[i]-a;o>c?e.insert(n,l.stringRepeat(" ",o-c)):e.remove(new s(n.row,n.column,n.row,n.column-o+c)),t.start.column=t.end.column=r,t.start.row=t.end.row=n.row,t.cursor=t.end;})),t.fromOrientedRange(i[0]),this.renderer.updateCursor(),this.renderer.updateBackMarkers();}else {var c=this.selection.getRange(),u=c.start.row,d=c.end.row,g=u==d;if(g){var f,m=this.session.getLength();do{f=this.session.getLine(d);}while(/[=:]/.test(f)&&++d<m);do{f=this.session.getLine(u);}while(/[=:]/.test(f)&&--u>0);u<0&&(u=0),d>=m&&(d=m-1);}var p=this.session.removeFullLines(u,d);p=this.$reAlignText(p,g),this.session.insert({row:u,column:0},p.join("\n")+"\n"),g||(c.start.column=0,c.end.column=p[p.length-1].length),this.selection.setRange(c);}},this.$reAlignText=function(e,t){var i,n,s,o=!0,r=!0;return e.map((function(e){var t=e.match(/(\s*)(.*?)(\s*)([=:].*)/);return t?null==i?(i=t[1].length,n=t[2].length,s=t[3].length,t):(i+n+s!=t[1].length+t[2].length+t[3].length&&(r=!1),i!=t[1].length&&(o=!1),i>t[1].length&&(i=t[1].length),n<t[2].length&&(n=t[2].length),s>t[3].length&&(s=t[3].length),t):[e]})).map(t?h:o?r?function(e){return e[2]?a(i+n-e[2].length)+e[2]+a(s)+e[4].replace(/^([=:])\s+/,"$1 "):e[0]}:h:function(e){return e[2]?a(i)+e[2]+a(s)+e[4].replace(/^([=:])\s+/,"$1 "):e[0]});function a(e){return l.stringRepeat(" ",e)}function h(e){return e[2]?a(i)+e[2]+a(n-e[2].length+s)+e[4].replace(/^([=:])\s+/,"$1 "):e[0]}};})).call(d.prototype),t.onSessionChange=function(e){var t=e.session;t&&!t.multiSelect&&(t.$selectionMarkers=[],t.selection.$initRangeList(),t.multiSelect=t.selection),this.multiSelect=t&&t.multiSelect;var i=e.oldSession;i&&(i.multiSelect.off("addRange",this.$onAddRange),i.multiSelect.off("removeRange",this.$onRemoveRange),i.multiSelect.off("multiSelect",this.$onMultiSelect),i.multiSelect.off("singleSelect",this.$onSingleSelect),i.multiSelect.lead.off("change",this.$checkMultiselectChange),i.multiSelect.anchor.off("change",this.$checkMultiselectChange)),t&&(t.multiSelect.on("addRange",this.$onAddRange),t.multiSelect.on("removeRange",this.$onRemoveRange),t.multiSelect.on("multiSelect",this.$onMultiSelect),t.multiSelect.on("singleSelect",this.$onSingleSelect),t.multiSelect.lead.on("change",this.$checkMultiselectChange),t.multiSelect.anchor.on("change",this.$checkMultiselectChange)),t&&this.inMultiSelectMode!=t.selection.inMultiSelectMode&&(t.selection.inMultiSelectMode?this.$onMultiSelect():this.$onSingleSelect());},t.MultiSelect=g,e("./config").defineOptions(d.prototype,"editor",{enableMultiselect:{set:function(e){g(this),e?(this.on("changeSession",this.$multiselectOnSessionChange),this.on("mousedown",r)):(this.off("changeSession",this.$multiselectOnSessionChange),this.off("mousedown",r));},value:!0},enableBlockSelect:{set:function(e){this.$blockSelectEnabled=e;},value:!0}});})),ace.define("ace/mode/folding/fold_mode",["require","exports","module","ace/range"],(function(e,t,i){var n=e("../../range").Range,s=t.FoldMode=function(){};(function(){this.foldingStartMarker=null,this.foldingStopMarker=null,this.getFoldWidget=function(e,t,i){var n=e.getLine(i);return this.foldingStartMarker.test(n)?"start":"markbeginend"==t&&this.foldingStopMarker&&this.foldingStopMarker.test(n)?"end":""},this.getFoldWidgetRange=function(e,t,i){return null},this.indentationBlock=function(e,t,i){var s=/\S/,o=e.getLine(t),r=o.search(s);if(-1!=r){for(var a=i||o.length,l=e.getLength(),h=t,c=t;++t<l;){var u=e.getLine(t).search(s);if(-1!=u){if(u<=r)break;c=t;}}if(c>h){var d=e.getLine(c).length;return new n(h,a,c,d)}}},this.openingBracketBlock=function(e,t,i,s,o){var r={row:i,column:s+1},a=e.$findClosingBracket(t,r,o);if(a){var l=e.foldWidgets[a.row];return null==l&&(l=e.getFoldWidget(a.row)),"start"==l&&a.row>r.row&&(a.row--,a.column=e.getLine(a.row).length),n.fromPoints(r,a)}},this.closingBracketBlock=function(e,t,i,s,o){var r={row:i,column:s},a=e.$findOpeningBracket(t,r);if(a)return a.column++,r.column--,n.fromPoints(a,r)};}).call(s.prototype);})),ace.define("ace/theme/textmate",["require","exports","module","ace/lib/dom"],(function(e,t,i){t.isDark=!1,t.cssClass="ace-tm",t.cssText='.ace-tm .ace_gutter {background: #f0f0f0;color: #333;}.ace-tm .ace_print-margin {width: 1px;background: #e8e8e8;}.ace-tm .ace_fold {background-color: #6B72E6;}.ace-tm {background-color: #FFFFFF;color: black;}.ace-tm .ace_cursor {color: black;}.ace-tm .ace_invisible {color: rgb(191, 191, 191);}.ace-tm .ace_storage,.ace-tm .ace_keyword {color: blue;}.ace-tm .ace_constant {color: rgb(197, 6, 11);}.ace-tm .ace_constant.ace_buildin {color: rgb(88, 72, 246);}.ace-tm .ace_constant.ace_language {color: rgb(88, 92, 246);}.ace-tm .ace_constant.ace_library {color: rgb(6, 150, 14);}.ace-tm .ace_invalid {background-color: rgba(255, 0, 0, 0.1);color: red;}.ace-tm .ace_support.ace_function {color: rgb(60, 76, 114);}.ace-tm .ace_support.ace_constant {color: rgb(6, 150, 14);}.ace-tm .ace_support.ace_type,.ace-tm .ace_support.ace_class {color: rgb(109, 121, 222);}.ace-tm .ace_keyword.ace_operator {color: rgb(104, 118, 135);}.ace-tm .ace_string {color: rgb(3, 106, 7);}.ace-tm .ace_comment {color: rgb(76, 136, 107);}.ace-tm .ace_comment.ace_doc {color: rgb(0, 102, 255);}.ace-tm .ace_comment.ace_doc.ace_tag {color: rgb(128, 159, 191);}.ace-tm .ace_constant.ace_numeric {color: rgb(0, 0, 205);}.ace-tm .ace_variable {color: rgb(49, 132, 149);}.ace-tm .ace_xml-pe {color: rgb(104, 104, 91);}.ace-tm .ace_entity.ace_name.ace_function {color: #0000A2;}.ace-tm .ace_heading {color: rgb(12, 7, 255);}.ace-tm .ace_list {color:rgb(185, 6, 144);}.ace-tm .ace_meta.ace_tag {color:rgb(0, 22, 142);}.ace-tm .ace_string.ace_regex {color: rgb(255, 0, 0)}.ace-tm .ace_marker-layer .ace_selection {background: rgb(181, 213, 255);}.ace-tm.ace_multiselect .ace_selection.ace_start {box-shadow: 0 0 3px 0px white;}.ace-tm .ace_marker-layer .ace_step {background: rgb(252, 255, 0);}.ace-tm .ace_marker-layer .ace_stack {background: rgb(164, 229, 101);}.ace-tm .ace_marker-layer .ace_bracket {margin: -1px 0 0 -1px;border: 1px solid rgb(192, 192, 192);}.ace-tm .ace_marker-layer .ace_active-line {background: rgba(0, 0, 0, 0.07);}.ace-tm .ace_gutter-active-line {background-color : #dcdcdc;}.ace-tm .ace_marker-layer .ace_selected-word {background: rgb(250, 250, 255);border: 1px solid rgb(200, 200, 250);}.ace-tm .ace_indent-guide {background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") right repeat-y;}',e("../lib/dom").importCssString(t.cssText,t.cssClass);})),ace.define("ace/line_widgets",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/range"],(function(e,t,i){e("./lib/oop");var n=e("./lib/dom");function s(e){this.session=e,this.session.widgetManager=this,this.session.getRowLength=this.getRowLength,this.session.$getWidgetScreenLength=this.$getWidgetScreenLength,this.updateOnChange=this.updateOnChange.bind(this),this.renderWidgets=this.renderWidgets.bind(this),this.measureWidgets=this.measureWidgets.bind(this),this.session._changedWidgets=[],this.$onChangeEditor=this.$onChangeEditor.bind(this),this.session.on("change",this.updateOnChange),this.session.on("changeFold",this.updateOnFold),this.session.on("changeEditor",this.$onChangeEditor);}e("./range").Range,function(){this.getRowLength=function(e){var t;return t=this.lineWidgets&&this.lineWidgets[e]&&this.lineWidgets[e].rowCount||0,this.$useWrapMode&&this.$wrapData[e]?this.$wrapData[e].length+1+t:1+t},this.$getWidgetScreenLength=function(){var e=0;return this.lineWidgets.forEach((function(t){t&&t.rowCount&&!t.hidden&&(e+=t.rowCount);})),e},this.$onChangeEditor=function(e){this.attach(e.editor);},this.attach=function(e){e&&e.widgetManager&&e.widgetManager!=this&&e.widgetManager.detach(),this.editor!=e&&(this.detach(),this.editor=e,e&&(e.widgetManager=this,e.renderer.on("beforeRender",this.measureWidgets),e.renderer.on("afterRender",this.renderWidgets)));},this.detach=function(e){var t=this.editor;if(t){this.editor=null,t.widgetManager=null,t.renderer.off("beforeRender",this.measureWidgets),t.renderer.off("afterRender",this.renderWidgets);var i=this.session.lineWidgets;i&&i.forEach((function(e){e&&e.el&&e.el.parentNode&&(e._inDocument=!1,e.el.parentNode.removeChild(e.el));}));}},this.updateOnFold=function(e,t){var i=t.lineWidgets;if(i&&e.action){for(var n=e.data,s=n.start.row,o=n.end.row,r="add"==e.action,a=s+1;a<o;a++)i[a]&&(i[a].hidden=r);i[o]&&(r?i[s]?i[o].hidden=r:i[s]=i[o]:(i[s]==i[o]&&(i[s]=void 0),i[o].hidden=r));}},this.updateOnChange=function(e){var t=this.session.lineWidgets;if(t){var i=e.start.row,n=e.end.row-i;if(0===n);else if("remove"==e.action){t.splice(i+1,n).forEach((function(e){e&&this.removeLineWidget(e);}),this),this.$updateRows();}else {var s=new Array(n);s.unshift(i,0),t.splice.apply(t,s),this.$updateRows();}}},this.$updateRows=function(){var e=this.session.lineWidgets;if(e){var t=!0;e.forEach((function(e,i){if(e)for(t=!1,e.row=i;e.$oldWidget;)e.$oldWidget.row=i,e=e.$oldWidget;})),t&&(this.session.lineWidgets=null);}},this.addLineWidget=function(e){this.session.lineWidgets||(this.session.lineWidgets=new Array(this.session.getLength()));var t=this.session.lineWidgets[e.row];t&&(e.$oldWidget=t,t.el&&t.el.parentNode&&(t.el.parentNode.removeChild(t.el),t._inDocument=!1)),this.session.lineWidgets[e.row]=e,e.session=this.session;var i=this.editor.renderer;e.html&&!e.el&&(e.el=n.createElement("div"),e.el.innerHTML=e.html),e.el&&(n.addCssClass(e.el,"ace_lineWidgetContainer"),e.el.style.position="absolute",e.el.style.zIndex=5,i.container.appendChild(e.el),e._inDocument=!0),e.coverGutter||(e.el.style.zIndex=3),null==e.pixelHeight&&(e.pixelHeight=e.el.offsetHeight),null==e.rowCount&&(e.rowCount=e.pixelHeight/i.layerConfig.lineHeight);var s=this.session.getFoldAt(e.row,0);if(e.$fold=s,s){var o=this.session.lineWidgets;e.row!=s.end.row||o[s.start.row]?e.hidden=!0:o[s.start.row]=e;}return this.session._emit("changeFold",{data:{start:{row:e.row}}}),this.$updateRows(),this.renderWidgets(null,i),this.onWidgetChanged(e),e},this.removeLineWidget=function(e){if(e._inDocument=!1,e.session=null,e.el&&e.el.parentNode&&e.el.parentNode.removeChild(e.el),e.editor&&e.editor.destroy)try{e.editor.destroy();}catch(e){}if(this.session.lineWidgets){var t=this.session.lineWidgets[e.row];if(t==e)this.session.lineWidgets[e.row]=e.$oldWidget,e.$oldWidget&&this.onWidgetChanged(e.$oldWidget);else for(;t;){if(t.$oldWidget==e){t.$oldWidget=e.$oldWidget;break}t=t.$oldWidget;}}this.session._emit("changeFold",{data:{start:{row:e.row}}}),this.$updateRows();},this.getWidgetsAtRow=function(e){for(var t=this.session.lineWidgets,i=t&&t[e],n=[];i;)n.push(i),i=i.$oldWidget;return n},this.onWidgetChanged=function(e){this.session._changedWidgets.push(e),this.editor&&this.editor.renderer.updateFull();},this.measureWidgets=function(e,t){var i=this.session._changedWidgets,n=t.layerConfig;if(i&&i.length){for(var s=1/0,o=0;o<i.length;o++){var r=i[o];if(r&&r.el&&r.session==this.session){if(!r._inDocument){if(this.session.lineWidgets[r.row]!=r)continue;r._inDocument=!0,t.container.appendChild(r.el);}r.h=r.el.offsetHeight,r.fixedWidth||(r.w=r.el.offsetWidth,r.screenWidth=Math.ceil(r.w/n.characterWidth));var a=r.h/n.lineHeight;r.coverLine&&(a-=this.session.getRowLineCount(r.row))<0&&(a=0),r.rowCount!=a&&(r.rowCount=a,r.row<s&&(s=r.row));}}s!=1/0&&(this.session._emit("changeFold",{data:{start:{row:s}}}),this.session.lineWidgetWidth=null),this.session._changedWidgets=[];}},this.renderWidgets=function(e,t){var i=t.layerConfig,n=this.session.lineWidgets;if(n){for(var s=Math.min(this.firstRow,i.firstRow),o=Math.max(this.lastRow,i.lastRow,n.length);s>0&&!n[s];)s--;this.firstRow=i.firstRow,this.lastRow=i.lastRow,t.$cursorLayer.config=i;for(var r=s;r<=o;r++){var a=n[r];if(a&&a.el)if(a.hidden)a.el.style.top=-100-(a.pixelHeight||0)+"px";else {a._inDocument||(a._inDocument=!0,t.container.appendChild(a.el));var l=t.$cursorLayer.getPixelPosition({row:r,column:0},!0).top;a.coverLine||(l+=i.lineHeight*this.session.getRowLineCount(a.row)),a.el.style.top=l-i.offset+"px";var h=a.coverGutter?0:t.gutterWidth;a.fixedWidth||(h-=t.scrollLeft),a.el.style.left=h+"px",a.fullWidth&&a.screenWidth&&(a.el.style.minWidth=i.width+2*i.padding+"px"),a.fixedWidth?a.el.style.right=t.scrollBar.getWidth()+"px":a.el.style.right="";}}}};}.call(s.prototype),t.LineWidgets=s;})),ace.define("ace/ext/error_marker",["require","exports","module","ace/line_widgets","ace/lib/dom","ace/range"],(function(e,t,i){var n=e("../line_widgets").LineWidgets,s=e("../lib/dom"),o=e("../range").Range;t.showErrorMarker=function(e,t){var i=e.session;i.widgetManager||(i.widgetManager=new n(i),i.widgetManager.attach(e));var r=e.getCursorPosition(),a=r.row,l=i.widgetManager.getWidgetsAtRow(a).filter((function(e){return "errorMarker"==e.type}))[0];l?l.destroy():a-=t;var h,c=function(e,t,i){var n=e.getAnnotations().sort(o.comparePoints);if(n.length){var s=function(e,t,i){for(var n=0,s=e.length-1;n<=s;){var o=n+s>>1,r=i(t,e[o]);if(r>0)n=o+1;else {if(!(r<0))return o;s=o-1;}}return -(n+1)}(n,{row:t,column:-1},o.comparePoints);s<0&&(s=-s-1),s>=n.length?s=i>0?0:n.length-1:0===s&&i<0&&(s=n.length-1);var r=n[s];if(r&&i){if(r.row===t){do{r=n[s+=i];}while(r&&r.row===t);if(!r)return n.slice()}var a=[];t=r.row;do{a[i<0?"unshift":"push"](r),r=n[s+=i];}while(r&&r.row==t);return a.length&&a}}}(i,a,t);if(c){var u=c[0];r.column=(u.pos&&"number"!=typeof u.column?u.pos.sc:u.column)||0,r.row=u.row,h=e.renderer.$gutterLayer.$annotations[r.row];}else {if(l)return;h={text:["Looks good!"],className:"ace_ok"};}e.session.unfold(r.row),e.selection.moveToPosition(r);var d={row:r.row,fixedWidth:!0,coverGutter:!0,el:s.createElement("div"),type:"errorMarker"},g=d.el.appendChild(s.createElement("div")),f=d.el.appendChild(s.createElement("div"));f.className="error_widget_arrow "+h.className;var m=e.renderer.$cursorLayer.getPixelPosition(r).left;f.style.left=m+e.renderer.gutterWidth-5+"px",d.el.className="error_widget_wrapper",g.className="error_widget "+h.className,g.innerHTML=h.text.join("<br>"),g.appendChild(s.createElement("div"));var p=function(e,t,i){if(0===t&&("esc"===i||"return"===i))return d.destroy(),{command:"null"}};d.destroy=function(){e.$mouseHandler.isMousePressed||(e.keyBinding.removeKeyboardHandler(p),i.widgetManager.removeLineWidget(d),e.off("changeSelection",d.destroy),e.off("changeSession",d.destroy),e.off("mouseup",d.destroy),e.off("change",d.destroy));},e.keyBinding.addKeyboardHandler(p),e.on("changeSelection",d.destroy),e.on("changeSession",d.destroy),e.on("mouseup",d.destroy),e.on("change",d.destroy),e.session.widgetManager.addLineWidget(d),d.el.onmousedown=e.focus.bind(e),e.renderer.scrollCursorIntoView(null,.5,{bottom:d.el.offsetHeight});},s.importCssString("    .error_widget_wrapper {        background: inherit;        color: inherit;        border:none    }    .error_widget {        border-top: solid 2px;        border-bottom: solid 2px;        margin: 5px 0;        padding: 10px 40px;        white-space: pre-wrap;    }    .error_widget.ace_error, .error_widget_arrow.ace_error{        border-color: #ff5a5a    }    .error_widget.ace_warning, .error_widget_arrow.ace_warning{        border-color: #F1D817    }    .error_widget.ace_info, .error_widget_arrow.ace_info{        border-color: #5a5a5a    }    .error_widget.ace_ok, .error_widget_arrow.ace_ok{        border-color: #5aaa5a    }    .error_widget_arrow {        position: absolute;        border: solid 5px;        border-top-color: transparent!important;        border-right-color: transparent!important;        border-left-color: transparent!important;        top: -5px;    }","");})),ace.define("ace/ace",["require","exports","module","ace/lib/fixoldbrowsers","ace/lib/dom","ace/lib/event","ace/editor","ace/edit_session","ace/undomanager","ace/virtual_renderer","ace/worker/worker_client","ace/keyboard/hash_handler","ace/placeholder","ace/multi_select","ace/mode/folding/fold_mode","ace/theme/textmate","ace/ext/error_marker","ace/config"],(function(e,t,i){e("./lib/fixoldbrowsers");var n=e("./lib/dom"),s=e("./lib/event"),o=e("./editor").Editor,r=e("./edit_session").EditSession,a=e("./undomanager").UndoManager,l=e("./virtual_renderer").VirtualRenderer;e("./worker/worker_client"),e("./keyboard/hash_handler"),e("./placeholder"),e("./multi_select"),e("./mode/folding/fold_mode"),e("./theme/textmate"),e("./ext/error_marker"),t.config=e("./config"),t.acequire=e,t.edit=function(e){if("string"==typeof e){var i=e;if(!(e=document.getElementById(i)))throw new Error("ace.edit can't find div #"+i)}if(e&&e.env&&e.env.editor instanceof o)return e.env.editor;var r="";if(e&&/input|textarea/i.test(e.tagName)){var a=e;r=a.value,e=n.createElement("pre"),a.parentNode.replaceChild(e,a);}else e&&(r=n.getInnerText(e),e.innerHTML="");var h=t.createEditSession(r),c=new o(new l(e));c.setSession(h);var u={document:h,editor:c,onResize:c.resize.bind(c,null)};return a&&(u.textarea=a),s.addListener(window,"resize",u.onResize),c.on("destroy",(function(){s.removeListener(window,"resize",u.onResize),u.editor.container.env=null;})),c.container.env=c.env=u,c},t.createEditSession=function(e,t){var i=new r(e,t);return i.setUndoManager(new a),i},t.EditSession=r,t.UndoManager=a,t.version="1.2.9";})),ace.acequire(["ace/ace"],(function(e){for(var t in e&&(e.config.init(!0),e.define=ace.define),window.ace||(window.ace=e),e)e.hasOwnProperty(t)&&(window.ace[t]=e[t]);}));var S=window.ace.acequire("ace/ace");function D(t){let i,n;return {c(){var e,s,o;i=a("div"),n=a("div"),e=n,s="id",null==(o=t[2])?e.removeAttribute(s):e.getAttribute(s)!==o&&e.setAttribute(s,o),l(n,"width",k(t[1])),l(n,"height",k(t[0])),l(i,"width",k(t[1])),l(i,"height",k(t[0]));},m(e,t){!function(e,t,i){e.insertBefore(t,i||null);}(e,i,t),function(e,t){e.appendChild(t);}(i,n);},p(e,[t]){2&t&&l(n,"width",k(e[1])),1&t&&l(n,"height",k(e[0])),2&t&&l(i,"width",k(e[1])),1&t&&l(i,"height",k(e[0]));},i:e,o:e,d(e){e&&r(i);}}}ace.define("ace/snippets",["require","exports","module","ace/lib/oop","ace/lib/event_emitter","ace/lib/lang","ace/range","ace/anchor","ace/keyboard/hash_handler","ace/tokenizer","ace/lib/dom","ace/editor"],(function(e,t,i){var n=e("./lib/oop"),s=e("./lib/event_emitter").EventEmitter,o=e("./lib/lang"),r=e("./range").Range,a=e("./anchor").Anchor,l=e("./keyboard/hash_handler").HashHandler,h=e("./tokenizer").Tokenizer,c=r.comparePoints,u=function(){this.snippetMap={},this.snippetNameMap={};};(function(){n.implement(this,s),this.getTokenizer=function(){function e(e,t,i){return e=e.substr(1),/^\d+$/.test(e)&&!i.inFormatString?[{tabstopId:parseInt(e,10)}]:[{text:e}]}function t(e){return "(?:[^\\\\"+e+"]|\\\\.)"}return u.$tokenizer=new h({start:[{regex:/:/,onMatch:function(e,t,i){return i.length&&i[0].expectIf?(i[0].expectIf=!1,i[0].elseBranch=i[0],[i[0]]):":"}},{regex:/\\./,onMatch:function(e,t,i){var n=e[1];return "}"==n&&i.length||-1!="`$\\".indexOf(n)?e=n:i.inFormatString&&("n"==n||"t"==n?e="\n":-1!="ulULE".indexOf(n)&&(e={changeCase:n,local:n>"a"})),[e]}},{regex:/}/,onMatch:function(e,t,i){return [i.length?i.shift():e]}},{regex:/\$(?:\d+|\w+)/,onMatch:e},{regex:/\$\{[\dA-Z_a-z]+/,onMatch:function(t,i,n){var s=e(t.substr(1),0,n);return n.unshift(s[0]),s},next:"snippetVar"},{regex:/\n/,token:"newline",merge:!1}],snippetVar:[{regex:"\\|"+t("\\|")+"*\\|",onMatch:function(e,t,i){i[0].choices=e.slice(1,-1).split(",");},next:"start"},{regex:"/("+t("/")+"+)/(?:("+t("/")+"*)/)(\\w*):?",onMatch:function(e,t,i){var n=i[0];return n.fmtString=e,e=this.splitRegex.exec(e),n.guard=e[1],n.fmt=e[2],n.flag=e[3],""},next:"start"},{regex:"`"+t("`")+"*`",onMatch:function(e,t,i){return i[0].code=e.splice(1,-1),""},next:"start"},{regex:"\\?",onMatch:function(e,t,i){i[0]&&(i[0].expectIf=!0);},next:"start"},{regex:"([^:}\\\\]|\\\\.)*:?",token:"",next:"start"}],formatString:[{regex:"/("+t("/")+"+)/",token:"regex"},{regex:"",onMatch:function(e,t,i){i.inFormatString=!0;},next:"start"}]}),u.prototype.getTokenizer=function(){return u.$tokenizer},u.$tokenizer},this.tokenizeTmSnippet=function(e,t){return this.getTokenizer().getLineTokens(e,t).tokens.map((function(e){return e.value||e}))},this.$getDefaultValue=function(e,t){if(/^[A-Z]\d+$/.test(t)){var i=t.substr(1);return (this.variables[t[0]+"__"]||{})[i]}if(/^\d+$/.test(t))return (this.variables.__||{})[t];if(t=t.replace(/^TM_/,""),e){var n=e.session;switch(t){case"CURRENT_WORD":var s=n.getWordRange();case"SELECTION":case"SELECTED_TEXT":return n.getTextRange(s);case"CURRENT_LINE":return n.getLine(e.getCursorPosition().row);case"PREV_LINE":return n.getLine(e.getCursorPosition().row-1);case"LINE_INDEX":return e.getCursorPosition().column;case"LINE_NUMBER":return e.getCursorPosition().row+1;case"SOFT_TABS":return n.getUseSoftTabs()?"YES":"NO";case"TAB_SIZE":return n.getTabSize();case"FILENAME":case"FILEPATH":return "";case"FULLNAME":return "Ace"}}},this.variables={},this.getVariableValue=function(e,t){return this.variables.hasOwnProperty(t)?this.variables[t](e,t)||"":this.$getDefaultValue(e,t)||""},this.tmStrFormat=function(e,t,i){var n=t.flag||"",s=t.guard;s=new RegExp(s,n.replace(/[^gi]/,""));var o=this.tokenizeTmSnippet(t.fmt,"formatString"),r=this,a=e.replace(s,(function(){r.variables.__=arguments;for(var e=r.resolveVariables(o,i),t="E",n=0;n<e.length;n++){var s=e[n];if("object"==typeof s)if(e[n]="",s.changeCase&&s.local){var a=e[n+1];a&&"string"==typeof a&&("u"==s.changeCase?e[n]=a[0].toUpperCase():e[n]=a[0].toLowerCase(),e[n+1]=a.substr(1));}else s.changeCase&&(t=s.changeCase);else "U"==t?e[n]=s.toUpperCase():"L"==t&&(e[n]=s.toLowerCase());}return e.join("")}));return this.variables.__=null,a},this.resolveVariables=function(e,t){for(var i=[],n=0;n<e.length;n++){var s=e[n];if("string"==typeof s)i.push(s);else {if("object"!=typeof s)continue;if(s.skip)r(s);else {if(s.processed<n)continue;if(s.text){var o=this.getVariableValue(t,s.text);o&&s.fmtString&&(o=this.tmStrFormat(o,s)),s.processed=n,null==s.expectIf?o&&(i.push(o),r(s)):o?s.skip=s.elseBranch:r(s);}else (null!=s.tabstopId||null!=s.changeCase)&&i.push(s);}}}function r(t){var i=e.indexOf(t,n+1);-1!=i&&(n=i);}return i},this.insertSnippetForSelection=function(e,t){var i=e.getCursorPosition(),n=e.session.getLine(i.row),s=e.session.getTabString(),o=n.match(/^\s*/)[0];i.column<o.length&&(o=o.slice(0,i.column)),t=t.replace(/\r/g,"");var r=this.tokenizeTmSnippet(t);r=(r=this.resolveVariables(r,e)).map((function(e){return "\n"==e?e+o:"string"==typeof e?e.replace(/\t/g,s):e}));var a=[];r.forEach((function(e,t){if("object"==typeof e){var i=e.tabstopId,n=a[i];if(n||((n=a[i]=[]).index=i,n.value=""),-1===n.indexOf(e)){n.push(e);var s=r.indexOf(e,t+1);if(-1!==s){var o=r.slice(t+1,s);o.some((function(e){return "object"==typeof e}))&&!n.value?n.value=o:!o.length||n.value&&"string"==typeof n.value||(n.value=o.join(""));}}}})),a.forEach((function(e){e.length=0;}));var l={};function h(e){for(var t=[],i=0;i<e.length;i++){var n=e[i];if("object"==typeof n){if(l[n.tabstopId])continue;n=t[e.lastIndexOf(n,i-1)]||{tabstopId:n.tabstopId};}t[i]=n;}return t}for(var c=0;c<r.length;c++){var u=r[c];if("object"==typeof u){var g=u.tabstopId,f=r.indexOf(u,c+1);if(l[g])l[g]===u&&(l[g]=null);else {var m=a[g],p="string"==typeof m.value?[m.value]:h(m.value);p.unshift(c+1,Math.max(0,f-c)),p.push(u),l[g]=u,r.splice.apply(r,p),-1===m.indexOf(u)&&m.push(u);}}}var A=0,C=0,v="";r.forEach((function(e){if("string"==typeof e){var t=e.split("\n");t.length>1?(C=t[t.length-1].length,A+=t.length-1):C+=e.length,v+=e;}else e.start?e.end={row:A,column:C}:e.start={row:A,column:C};}));var F=e.getSelectionRange(),w=e.session.replace(F,v),E=new d(e),b=e.inVirtualSelectionMode&&e.selection.index;E.addTabstops(a,F.start,w,b);},this.insertSnippet=function(e,t){var i=this;if(e.inVirtualSelectionMode)return i.insertSnippetForSelection(e,t);e.forEachSelection((function(){i.insertSnippetForSelection(e,t);}),null,{keepOrder:!0}),e.tabstopManager&&e.tabstopManager.tabNext();},this.$getScope=function(e){var t=e.session.$mode.$id||"";if("html"===(t=t.split("/").pop())||"php"===t){"php"!==t||e.session.$mode.inlinePhp||(t="html");var i=e.getCursorPosition(),n=e.session.getState(i.row);"object"==typeof n&&(n=n[0]),n.substring&&("js-"==n.substring(0,3)?t="javascript":"css-"==n.substring(0,4)?t="css":"php-"==n.substring(0,4)&&(t="php"));}return t},this.getActiveScopes=function(e){var t=this.$getScope(e),i=[t],n=this.snippetMap;return n[t]&&n[t].includeScopes&&i.push.apply(i,n[t].includeScopes),i.push("_"),i},this.expandWithTab=function(e,t){var i=this,n=e.forEachSelection((function(){return i.expandSnippetForSelection(e,t)}),null,{keepOrder:!0});return n&&e.tabstopManager&&e.tabstopManager.tabNext(),n},this.expandSnippetForSelection=function(e,t){var i,n=e.getCursorPosition(),s=e.session.getLine(n.row),o=s.substring(0,n.column),r=s.substr(n.column),a=this.snippetMap;return this.getActiveScopes(e).some((function(e){var t=a[e];return t&&(i=this.findMatchingSnippet(t,o,r)),!!i}),this),!!i&&(t&&t.dryRun||(e.session.doc.removeInLine(n.row,n.column-i.replaceBefore.length,n.column+i.replaceAfter.length),this.variables.M__=i.matchBefore,this.variables.T__=i.matchAfter,this.insertSnippetForSelection(e,i.content),this.variables.M__=this.variables.T__=null),!0)},this.findMatchingSnippet=function(e,t,i){for(var n=e.length;n--;){var s=e[n];if((!s.startRe||s.startRe.test(t))&&((!s.endRe||s.endRe.test(i))&&(s.startRe||s.endRe)))return s.matchBefore=s.startRe?s.startRe.exec(t):[""],s.matchAfter=s.endRe?s.endRe.exec(i):[""],s.replaceBefore=s.triggerRe?s.triggerRe.exec(t)[0]:"",s.replaceAfter=s.endTriggerRe?s.endTriggerRe.exec(i)[0]:"",s}},this.snippetMap={},this.snippetNameMap={},this.register=function(e,t){var i=this.snippetMap,n=this.snippetNameMap,s=this;function r(e){return e&&!/^\^?\(.*\)\$?$|^\\b$/.test(e)&&(e="(?:"+e+")"),e||""}function a(e,t,i){return e=r(e),t=r(t),i?(e=t+e)&&"$"!=e[e.length-1]&&(e+="$"):(e+=t)&&"^"!=e[0]&&(e="^"+e),new RegExp(e)}function l(e){e.scope||(e.scope=t||"_"),t=e.scope,i[t]||(i[t]=[],n[t]={});var r=n[t];if(e.name){var l=r[e.name];l&&s.unregister(l),r[e.name]=e;}i[t].push(e),e.tabTrigger&&!e.trigger&&(!e.guard&&/^\w/.test(e.tabTrigger)&&(e.guard="\\b"),e.trigger=o.escapeRegExp(e.tabTrigger)),(e.trigger||e.guard||e.endTrigger||e.endGuard)&&(e.startRe=a(e.trigger,e.guard,!0),e.triggerRe=new RegExp(e.trigger,"",!0),e.endRe=a(e.endTrigger,e.endGuard,!0),e.endTriggerRe=new RegExp(e.endTrigger,"",!0));}e||(e=[]),e&&e.content?l(e):Array.isArray(e)&&e.forEach(l),this._signal("registerSnippets",{scope:t});},this.unregister=function(e,t){var i=this.snippetMap,n=this.snippetNameMap;function s(e){var s=n[e.scope||t];if(s&&s[e.name]){delete s[e.name];var o=i[e.scope||t],r=o&&o.indexOf(e);r>=0&&o.splice(r,1);}}e.content?s(e):Array.isArray(e)&&e.forEach(s);},this.parseSnippetFile=function(e){e=e.replace(/\r/g,"");for(var t,i=[],n={},s=/^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;t=s.exec(e);){if(t[1])try{n=JSON.parse(t[1]),i.push(n);}catch(e){}if(t[4])n.content=t[4].replace(/^\t/gm,""),i.push(n),n={};else {var o=t[2],r=t[3];if("regex"==o){var a=/\/((?:[^\/\\]|\\.)*)|$/g;n.guard=a.exec(r)[1],n.trigger=a.exec(r)[1],n.endTrigger=a.exec(r)[1],n.endGuard=a.exec(r)[1];}else "snippet"==o?(n.tabTrigger=r.match(/^\S*/)[0],n.name||(n.name=r)):n[o]=r;}}return i},this.getSnippetByName=function(e,t){var i,n=this.snippetNameMap;return this.getActiveScopes(t).some((function(t){var s=n[t];return s&&(i=s[e]),!!i}),this),i};}).call(u.prototype);var d=function(e){if(e.tabstopManager)return e.tabstopManager;e.tabstopManager=this,this.$onChange=this.onChange.bind(this),this.$onChangeSelection=o.delayedCall(this.onChangeSelection.bind(this)).schedule,this.$onChangeSession=this.onChangeSession.bind(this),this.$onAfterExec=this.onAfterExec.bind(this),this.attach(e);};((function(){this.attach=function(e){this.index=0,this.ranges=[],this.tabstops=[],this.$openTabstops=null,this.selectedTabstop=null,this.editor=e,this.editor.on("change",this.$onChange),this.editor.on("changeSelection",this.$onChangeSelection),this.editor.on("changeSession",this.$onChangeSession),this.editor.commands.on("afterExec",this.$onAfterExec),this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);},this.detach=function(){this.tabstops.forEach(this.removeTabstopMarkers,this),this.ranges=null,this.tabstops=null,this.selectedTabstop=null,this.editor.removeListener("change",this.$onChange),this.editor.removeListener("changeSelection",this.$onChangeSelection),this.editor.removeListener("changeSession",this.$onChangeSession),this.editor.commands.removeListener("afterExec",this.$onAfterExec),this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler),this.editor.tabstopManager=null,this.editor=null;},this.onChange=function(e){var t="r"==e.action[0],i=e.start,n=e.end,s=i.row,o=n.row-s,r=n.column-i.column;if(t&&(o=-o,r=-r),!this.$inChange&&t){var a=this.selectedTabstop;if(a&&!a.some((function(e){return c(e.start,i)<=0&&c(e.end,n)>=0})))return this.detach()}for(var l=this.ranges,h=0;h<l.length;h++){var u=l[h];u.end.row<i.row||(t&&c(i,u.start)<0&&c(n,u.end)>0?(this.removeRange(u),h--):(u.start.row==s&&u.start.column>i.column&&(u.start.column+=r),u.end.row==s&&u.end.column>=i.column&&(u.end.column+=r),u.start.row>=s&&(u.start.row+=o),u.end.row>=s&&(u.end.row+=o),c(u.start,u.end)>0&&this.removeRange(u)));}l.length||this.detach();},this.updateLinkedFields=function(){var e=this.selectedTabstop;if(e&&e.hasLinkedRanges){this.$inChange=!0;for(var i=this.editor.session,n=i.getTextRange(e.firstNonLinked),s=e.length;s--;){var o=e[s];if(o.linked){var r=t.snippetManager.tmStrFormat(n,o.original);i.replace(o,r);}}this.$inChange=!1;}},this.onAfterExec=function(e){e.command&&!e.command.readOnly&&this.updateLinkedFields();},this.onChangeSelection=function(){if(this.editor){for(var e=this.editor.selection.lead,t=this.editor.selection.anchor,i=this.editor.selection.isEmpty(),n=this.ranges.length;n--;)if(!this.ranges[n].linked){var s=this.ranges[n].contains(e.row,e.column),o=i||this.ranges[n].contains(t.row,t.column);if(s&&o)return}this.detach();}},this.onChangeSession=function(){this.detach();},this.tabNext=function(e){var t=this.tabstops.length,i=this.index+(e||1);(i=Math.min(Math.max(i,1),t))==t&&(i=0),this.selectTabstop(i),0===i&&this.detach();},this.selectTabstop=function(e){this.$openTabstops=null;var t=this.tabstops[this.index];if(t&&this.addTabstopMarkers(t),this.index=e,(t=this.tabstops[this.index])&&t.length){if(this.selectedTabstop=t,this.editor.inVirtualSelectionMode)this.editor.selection.setRange(t.firstNonLinked);else {var i=this.editor.multiSelect;i.toSingleRange(t.firstNonLinked.clone());for(var n=t.length;n--;)t.hasLinkedRanges&&t[n].linked||i.addRange(t[n].clone(),!0);i.ranges[0]&&i.addRange(i.ranges[0].clone());}this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);}},this.addTabstops=function(e,t,i){if(this.$openTabstops||(this.$openTabstops=[]),!e[0]){var n=r.fromPoints(i,i);f(n.start,t),f(n.end,t),e[0]=[n],e[0].index=0;}var s=[this.index+1,0],o=this.ranges;e.forEach((function(e,i){for(var n=this.$openTabstops[i]||e,a=e.length;a--;){var l=e[a],h=r.fromPoints(l.start,l.end||l.start);g(h.start,t),g(h.end,t),h.original=l,h.tabstop=n,o.push(h),n!=e?n.unshift(h):n[a]=h,l.fmtString?(h.linked=!0,n.hasLinkedRanges=!0):n.firstNonLinked||(n.firstNonLinked=h);}n.firstNonLinked||(n.hasLinkedRanges=!1),n===e&&(s.push(n),this.$openTabstops[i]=n),this.addTabstopMarkers(n);}),this),s.length>2&&(this.tabstops.length&&s.push(s.splice(2,1)[0]),this.tabstops.splice.apply(this.tabstops,s));},this.addTabstopMarkers=function(e){var t=this.editor.session;e.forEach((function(e){e.markerId||(e.markerId=t.addMarker(e,"ace_snippet-marker","text"));}));},this.removeTabstopMarkers=function(e){var t=this.editor.session;e.forEach((function(e){t.removeMarker(e.markerId),e.markerId=null;}));},this.removeRange=function(e){var t=e.tabstop.indexOf(e);e.tabstop.splice(t,1),t=this.ranges.indexOf(e),this.ranges.splice(t,1),this.editor.session.removeMarker(e.markerId),e.tabstop.length||(-1!=(t=this.tabstops.indexOf(e.tabstop))&&this.tabstops.splice(t,1),this.tabstops.length||this.detach());},this.keyboardHandler=new l,this.keyboardHandler.bindKeys({Tab:function(e){t.snippetManager&&t.snippetManager.expandWithTab(e)||e.tabstopManager.tabNext(1);},"Shift-Tab":function(e){e.tabstopManager.tabNext(-1);},Esc:function(e){e.tabstopManager.detach();},Return:function(e){return !1}});})).call(d.prototype),a.prototype.onChange;var g=function(e,t){0==e.row&&(e.column+=t.column),e.row+=t.row;},f=function(e,t){e.row==t.row&&(e.column-=t.column),e.row-=t.row;};e("./lib/dom").importCssString(".ace_snippet-marker {    -moz-box-sizing: border-box;    box-sizing: border-box;    background: rgba(194, 193, 208, 0.09);    border: 1px dotted rgba(211, 208, 235, 0.62);    position: absolute;}"),t.snippetManager=new u;var m=e("./editor").Editor;(function(){this.insertSnippet=function(e,i){return t.snippetManager.insertSnippet(this,e,i)},this.expandSnippet=function(e){return t.snippetManager.expandWithTab(this,e)};}).call(m.prototype);})),ace.define("ace/ext/emmet",["require","exports","module","ace/keyboard/hash_handler","ace/editor","ace/snippets","ace/range","resources","resources","tabStops","resources","utils","actions","ace/config","ace/config"],(function(e,t,i){var n,s,o=e("ace/keyboard/hash_handler").HashHandler,r=e("ace/editor").Editor,a=e("ace/snippets").snippetManager,l=e("ace/range").Range;function h(){}h.prototype={setupContext:function(e){this.ace=e,this.indentation=e.session.getTabString(),n||(n=window.emmet),(n.resources||n.require("resources")).setVariable("indentation",this.indentation),this.$syntax=null,this.$syntax=this.getSyntax();},getSelectionRange:function(){var e=this.ace.getSelectionRange(),t=this.ace.session.doc;return {start:t.positionToIndex(e.start),end:t.positionToIndex(e.end)}},createSelection:function(e,t){var i=this.ace.session.doc;this.ace.selection.setRange({start:i.indexToPosition(e),end:i.indexToPosition(t)});},getCurrentLineRange:function(){var e=this.ace,t=e.getCursorPosition().row,i=e.session.getLine(t).length,n=e.session.doc.positionToIndex({row:t,column:0});return {start:n,end:n+i}},getCaretPos:function(){var e=this.ace.getCursorPosition();return this.ace.session.doc.positionToIndex(e)},setCaretPos:function(e){var t=this.ace.session.doc.indexToPosition(e);this.ace.selection.moveToPosition(t);},getCurrentLine:function(){var e=this.ace.getCursorPosition().row;return this.ace.session.getLine(e)},replaceContent:function(e,t,i,n){null==i&&(i=null==t?this.getContent().length:t),null==t&&(t=0);var s=this.ace,o=s.session.doc,r=l.fromPoints(o.indexToPosition(t),o.indexToPosition(i));s.session.remove(r),r.end=r.start,e=this.$updateTabstops(e),a.insertSnippet(s,e);},getContent:function(){return this.ace.getValue()},getSyntax:function(){if(this.$syntax)return this.$syntax;var e=this.ace.session.$modeId.split("/").pop();if("html"==e||"php"==e){var t=this.ace.getCursorPosition(),i=this.ace.session.getState(t.row);"string"!=typeof i&&(i=i[0]),i&&((i=i.split("-")).length>1?e=i[0]:"php"==e&&(e="html"));}return e},getProfileName:function(){var e=n.resources||n.require("resources");switch(this.getSyntax()){case"css":return "css";case"xml":case"xsl":return "xml";case"html":var t=e.getVariable("profile");return t||(t=-1!=this.ace.session.getLines(0,2).join("").search(/<!DOCTYPE[^>]+XHTML/i)?"xhtml":"html"),t;default:var i=this.ace.session.$mode;return i.emmetConfig&&i.emmetConfig.profile||"xhtml"}},prompt:function(e){return prompt(e)},getSelection:function(){return this.ace.session.getTextRange()},getFilePath:function(){return ""},$updateTabstops:function(e){var t=0,i=null,s=n.tabStops||n.require("tabStops"),o=(n.resources||n.require("resources")).getVocabulary("user"),r={tabstop:function(e){var n=parseInt(e.group,10),o=0===n;o?n=++t:n+=1e3;var a=e.placeholder;a&&(a=s.processText(a,r));var l="${"+n+(a?":"+a:"")+"}";return o&&(i=[e.start,l]),l},escape:function(e){return "$"==e?"\\$":"\\"==e?"\\\\":e}};if(e=s.processText(e,r),o.variables.insert_final_tabstop&&!/\$\{0\}$/.test(e))e+="${0}";else if(i){e=(n.utils?n.utils.common:n.require("utils")).replaceSubstring(e,"${0}",i[0],i[1]);}return e}};var c={expand_abbreviation:{mac:"ctrl+alt+e",win:"alt+e"},match_pair_outward:{mac:"ctrl+d",win:"ctrl+,"},match_pair_inward:{mac:"ctrl+j",win:"ctrl+shift+0"},matching_pair:{mac:"ctrl+alt+j",win:"alt+j"},next_edit_point:"alt+right",prev_edit_point:"alt+left",toggle_comment:{mac:"command+/",win:"ctrl+/"},split_join_tag:{mac:"shift+command+'",win:"shift+ctrl+`"},remove_tag:{mac:"command+'",win:"shift+ctrl+;"},evaluate_math_expression:{mac:"shift+command+y",win:"shift+ctrl+y"},increment_number_by_1:"ctrl+up",decrement_number_by_1:"ctrl+down",increment_number_by_01:"alt+up",decrement_number_by_01:"alt+down",increment_number_by_10:{mac:"alt+command+up",win:"shift+alt+up"},decrement_number_by_10:{mac:"alt+command+down",win:"shift+alt+down"},select_next_item:{mac:"shift+command+.",win:"shift+ctrl+."},select_previous_item:{mac:"shift+command+,",win:"shift+ctrl+,"},reflect_css_value:{mac:"shift+command+r",win:"shift+ctrl+r"},encode_decode_data_url:{mac:"shift+ctrl+d",win:"ctrl+'"},expand_abbreviation_with_tab:"Tab",wrap_with_abbreviation:{mac:"shift+ctrl+a",win:"shift+ctrl+a"}},u=new h;for(var d in t.commands=new o,t.runEmmetCommand=function e(t){try{u.setupContext(t);var i=n.actions||n.require("actions");if("expand_abbreviation_with_tab"==this.action){if(!t.selection.isEmpty())return !1;var s=t.selection.lead,o=t.session.getTokenAt(s.row,s.column);if(o&&/\btag\b/.test(o.type))return !1}if("wrap_with_abbreviation"==this.action)return setTimeout((function(){i.run("wrap_with_abbreviation",u);}),0);var r=i.run(this.action,u);}catch(i){if(!n)return f(e.bind(this,t)),!0;t._signal("changeStatus","string"==typeof i?i:i.message),console.log(i),r=!1;}return r},c)t.commands.addCommand({name:"emmet:"+d,action:d,bindKey:c[d],exec:t.runEmmetCommand,multiSelectAction:"forEach"});t.updateCommands=function(e,i){i?e.keyBinding.addKeyboardHandler(t.commands):e.keyBinding.removeKeyboardHandler(t.commands);},t.isSupportedMode=function(e){if(!e)return !1;if(e.emmetConfig)return !0;var t=e.$id||e;return /css|less|scss|sass|stylus|html|php|twig|ejs|handlebars/.test(t)},t.isAvailable=function(e,i){if(/(evaluate_math_expression|expand_abbreviation)$/.test(i))return !0;var n=e.session.$mode,s=t.isSupportedMode(n);if(s&&n.$modes)try{u.setupContext(e),/js|php/.test(u.getSyntax())&&(s=!1);}catch(e){}return s};var g=function(e,i){var n=i;if(n){var s=t.isSupportedMode(n.session.$mode);!1===e.enableEmmet&&(s=!1),s&&f(),t.updateCommands(n,s);}},f=function(t){"string"==typeof s&&e("ace/config").loadModule(s,(function(){s=null,t&&t();}));};t.AceEmmetEditor=h,e("ace/config").defineOptions(r.prototype,"editor",{enableEmmet:{set:function(e){this[e?"on":"removeListener"]("changeMode",g),g({enableEmmet:!!e},this);},value:!0}}),t.setCore=function(e){"string"==typeof e?s=e:n=e;};})),ace.acequire(["ace/ext/emmet"],(function(){}));const x=/^\d*$/;function k(e){return x.test(e)?e+"px":e}function L(e,t,i){const n=`svelte-ace-editor-div:${Math.floor(1e10*Math.random())}`,s=d();let o,{value:r=""}=t,{lang:a="json"}=t,{theme:l="chrome"}=t,{height:h="100%"}=t,{width:c="100%"}=t,{options:g={}}=t,{readonly:f=!1}=t,m="";var p;p=()=>{o&&(o.destroy(),o.container.remove());},u().$$.on_destroy.push(p);const C=()=>(v(),A$2).then((()=>{o&&o.resize();}));return function(e){u().$$.on_mount.push(e);}((()=>{i(4,a=a||"text"),i(5,l=l||"chrome"),o=S.edit(n),s("init",o),o.$blockScrolling=1/0,o.getSession().setMode("ace/mode/"+a),o.setTheme("ace/theme/"+l),o.setValue(r,1),o.setReadOnly(f),m=r,o.onBlur=()=>s("blur"),o.onChangeMode=e=>s("changeMode",e),o.onCommandKey=(e,t,i)=>s("commandKey",{err:e,hashId:t,keyCode:i}),o.onCopy=()=>s("copy"),o.onCursorChange=()=>s("cursorChange"),o.onCut=()=>{const e=o.getCopyText();console.log("cut event : ",e),o.insert(""),s("cut");},o.onDocumentChange=e=>s("documentChange",e),o.onFocus=()=>s("focus"),o.onPaste=e=>{console.log("paste event : ",e),o.insert(e),s("paste",e);},o.onSelectionChange=e=>s("selectionChange",e),o.on("change",(function(){const e=o.getValue();i(3,r=e),s("input",e),m=e;})),g&&o.setOptions(g);})),e.$$set=e=>{"value"in e&&i(3,r=e.value),"lang"in e&&i(4,a=e.lang),"theme"in e&&i(5,l=e.theme),"height"in e&&i(0,h=e.height),"width"in e&&i(1,c=e.width),"options"in e&&i(6,g=e.options),"readonly"in e&&i(7,f=e.readonly);},e.$$.update=()=>{var t,i,n,s;8&e.$$.dirty&&m!==(t=r)&&o&&"string"==typeof t&&(o.session.setValue(t),m=t),32&e.$$.dirty&&(i=l,o&&o.setTheme("ace/theme/"+i)),16&e.$$.dirty&&(n=a,o&&o.getSession().setMode("ace/mode/"+n)),64&e.$$.dirty&&function(e){o&&o.setOptions(e);}(g),128&e.$$.dirty&&(s=f,o&&o.setReadOnly(s)),3&e.$$.dirty&&null!==h&&null!==c&&C();},[h,c,n,r,a,l,g,f]}class R extends class{$destroy(){!function(e,t){const i=e.$$;null!==i.fragment&&(n(i.on_destroy),i.fragment&&i.fragment.d(t),i.on_destroy=i.fragment=null,i.ctx=[]);}(this,1),this.$destroy=e;}$on(e,t){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(t),()=>{const e=i.indexOf(t);-1!==e&&i.splice(e,1);}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1);}}{constructor(e){super(),B(this,e,L,D,o,{value:3,lang:4,theme:5,height:0,width:1,options:6,readonly:7});}}S.Anchor;S.Document;S.Editor;

    ace.define("ace/mode/elm_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(acequire, exports, module) {

    var oop = acequire("../lib/oop");
    var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

    var ElmHighlightRules = function() {
        var keywordMapper = this.createKeywordMapper({
           "keyword": "as|case|class|data|default|deriving|do|else|export|foreign|" +
                "hiding|jsevent|if|import|in|infix|infixl|infixr|instance|let|" +
                "module|newtype|of|open|then|type|where|_|port|\u03BB"
        }, "identifier");
        
        var escapeRe = /\\(\d+|['"\\&trnbvf])/;
        
        var smallRe = /[a-z_]/.source;
        var largeRe = /[A-Z]/.source;
        var idRe = /[a-z_A-Z0-9']/.source;

        this.$rules = {
            start: [{
                token: "string.start",
                regex: '"',
                next: "string"
            }, {
                token: "string.character",
                regex: "'(?:" + escapeRe.source + "|.)'?"
            }, {
                regex: /0(?:[xX][0-9A-Fa-f]+|[oO][0-7]+)|\d+(\.\d+)?([eE][-+]?\d*)?/,
                token: "constant.numeric"
            }, {
                token: "comment",
                regex: "--.*"
            }, {
                token : "keyword",
                regex : /\.\.|\||:|=|\\|"|->|<-|\u2192/
            }, {
                token : "keyword.operator",
                regex : /[-!#$%&*+.\/<=>?@\\^|~:\u03BB\u2192]+/
            }, {
                token : "operator.punctuation",
                regex : /[,;`]/
            }, {
                regex : largeRe + idRe + "+\\.?",
                token : function(value) {
                    if (value[value.length - 1] == ".")
                        return "entity.name.function"; 
                    return "constant.language"; 
                }
            }, {
                regex : "^" + smallRe  + idRe + "+",
                token : function(value) {
                    return "constant.language"; 
                }
            }, {
                token : keywordMapper,
                regex : "[\\w\\xff-\\u218e\\u2455-\\uffff]+\\b"
            }, {
                regex: "{-#?",
                token: "comment.start",
                onMatch: function(value, currentState, stack) {
                    this.next = value.length == 2 ? "blockComment" : "docComment";
                    return this.token;
                }
            }, {
                token: "variable.language",
                regex: /\[markdown\|/,
                next: "markdown"
            }, {
                token: "paren.lparen",
                regex: /[\[({]/ 
            }, {
                token: "paren.rparen",
                regex: /[\])}]/
            } ],
            markdown: [{
                regex: /\|\]/,
                next: "start"
            }, {
                defaultToken : "string"
            }],
            blockComment: [{
                regex: "{-",
                token: "comment.start",
                push: "blockComment"
            }, {
                regex: "-}",
                token: "comment.end",
                next: "pop"
            }, {
                defaultToken: "comment"
            }],
            docComment: [{
                regex: "{-",
                token: "comment.start",
                push: "docComment"
            }, {
                regex: "-}",
                token: "comment.end",
                next: "pop" 
            }, {
                defaultToken: "doc.comment"
            }],
            string: [{
                token: "constant.language.escape",
                regex: escapeRe
            }, {
                token: "text",
                regex: /\\(\s|$)/,
                next: "stringGap"
            }, {
                token: "string.end",
                regex: '"',
                next: "start"
            }, {
                defaultToken: "string"
            }],
            stringGap: [{
                token: "text",
                regex: /\\/,
                next: "string"
            }, {
                token: "error",
                regex: "",
                next: "start"
            }]
        };
        
        this.normalizeRules();
    };

    oop.inherits(ElmHighlightRules, TextHighlightRules);

    exports.ElmHighlightRules = ElmHighlightRules;
    });

    ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(acequire, exports, module) {

    var oop = acequire("../../lib/oop");
    var Range = acequire("../../range").Range;
    var BaseFoldMode = acequire("./fold_mode").FoldMode;

    var FoldMode = exports.FoldMode = function(commentRegex) {
        if (commentRegex) {
            this.foldingStartMarker = new RegExp(
                this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
            );
            this.foldingStopMarker = new RegExp(
                this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
            );
        }
    };
    oop.inherits(FoldMode, BaseFoldMode);

    (function() {
        
        this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
        this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
        this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
        this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
        this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
        this._getFoldWidgetBase = this.getFoldWidget;
        this.getFoldWidget = function(session, foldStyle, row) {
            var line = session.getLine(row);
        
            if (this.singleLineBlockCommentRe.test(line)) {
                if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                    return "";
            }
        
            var fw = this._getFoldWidgetBase(session, foldStyle, row);
        
            if (!fw && this.startRegionRe.test(line))
                return "start"; // lineCommentRegionStart
        
            return fw;
        };

        this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
            var line = session.getLine(row);
            
            if (this.startRegionRe.test(line))
                return this.getCommentRegionBlock(session, line, row);
            
            var match = line.match(this.foldingStartMarker);
            if (match) {
                var i = match.index;

                if (match[1])
                    return this.openingBracketBlock(session, match[1], row, i);
                    
                var range = session.getCommentFoldRange(row, i + match[0].length, 1);
                
                if (range && !range.isMultiLine()) {
                    if (forceMultiline) {
                        range = this.getSectionRange(session, row);
                    } else if (foldStyle != "all")
                        range = null;
                }
                
                return range;
            }

            if (foldStyle === "markbegin")
                return;

            var match = line.match(this.foldingStopMarker);
            if (match) {
                var i = match.index + match[0].length;

                if (match[1])
                    return this.closingBracketBlock(session, match[1], row, i);

                return session.getCommentFoldRange(row, i, -1);
            }
        };
        
        this.getSectionRange = function(session, row) {
            var line = session.getLine(row);
            var startIndent = line.search(/\S/);
            var startRow = row;
            var startColumn = line.length;
            row = row + 1;
            var endRow = row;
            var maxRow = session.getLength();
            while (++row < maxRow) {
                line = session.getLine(row);
                var indent = line.search(/\S/);
                if (indent === -1)
                    continue;
                if  (startIndent > indent)
                    break;
                var subRange = this.getFoldWidgetRange(session, "all", row);
                
                if (subRange) {
                    if (subRange.start.row <= startRow) {
                        break;
                    } else if (subRange.isMultiLine()) {
                        row = subRange.end.row;
                    } else if (startIndent == indent) {
                        break;
                    }
                }
                endRow = row;
            }
            
            return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
        };
        this.getCommentRegionBlock = function(session, line, row) {
            var startColumn = line.search(/\s*$/);
            var maxRow = session.getLength();
            var startRow = row;
            
            var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
            var depth = 1;
            while (++row < maxRow) {
                line = session.getLine(row);
                var m = re.exec(line);
                if (!m) continue;
                if (m[1]) depth--;
                else depth++;

                if (!depth) break;
            }

            var endRow = row;
            if (endRow > startRow) {
                return new Range(startRow, startColumn, endRow, line.length);
            }
        };

    }).call(FoldMode.prototype);

    });

    ace.define("ace/mode/elm",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/elm_highlight_rules","ace/mode/folding/cstyle"], function(acequire, exports, module) {

    var oop = acequire("../lib/oop");
    var TextMode = acequire("./text").Mode;
    var HighlightRules = acequire("./elm_highlight_rules").ElmHighlightRules;
    var FoldMode = acequire("./folding/cstyle").FoldMode;

    var Mode = function() {
        this.HighlightRules = HighlightRules;
        this.foldingRules = new FoldMode();
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.lineCommentStart = "--";
        this.blockComment = {start: "{-", end: "-}", nestable: true};
        this.$id = "ace/mode/elm";
    }).call(Mode.prototype);

    exports.Mode = Mode;
    });

    ace.define("ace/theme/monokai",["require","exports","module","ace/lib/dom"], function(acequire, exports, module) {

    exports.isDark = true;
    exports.cssClass = "ace-monokai";
    exports.cssText = ".ace-monokai .ace_gutter {\
background: #2F3129;\
color: #8F908A\
}\
.ace-monokai .ace_print-margin {\
width: 1px;\
background: #555651\
}\
.ace-monokai {\
background-color: #272822;\
color: #F8F8F2\
}\
.ace-monokai .ace_cursor {\
color: #F8F8F0\
}\
.ace-monokai .ace_marker-layer .ace_selection {\
background: #49483E\
}\
.ace-monokai.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #272822;\
}\
.ace-monokai .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-monokai .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #49483E\
}\
.ace-monokai .ace_marker-layer .ace_active-line {\
background: #202020\
}\
.ace-monokai .ace_gutter-active-line {\
background-color: #272727\
}\
.ace-monokai .ace_marker-layer .ace_selected-word {\
border: 1px solid #49483E\
}\
.ace-monokai .ace_invisible {\
color: #52524d\
}\
.ace-monokai .ace_entity.ace_name.ace_tag,\
.ace-monokai .ace_keyword,\
.ace-monokai .ace_meta.ace_tag,\
.ace-monokai .ace_storage {\
color: #F92672\
}\
.ace-monokai .ace_punctuation,\
.ace-monokai .ace_punctuation.ace_tag {\
color: #fff\
}\
.ace-monokai .ace_constant.ace_character,\
.ace-monokai .ace_constant.ace_language,\
.ace-monokai .ace_constant.ace_numeric,\
.ace-monokai .ace_constant.ace_other {\
color: #AE81FF\
}\
.ace-monokai .ace_invalid {\
color: #F8F8F0;\
background-color: #F92672\
}\
.ace-monokai .ace_invalid.ace_deprecated {\
color: #F8F8F0;\
background-color: #AE81FF\
}\
.ace-monokai .ace_support.ace_constant,\
.ace-monokai .ace_support.ace_function {\
color: #66D9EF\
}\
.ace-monokai .ace_fold {\
background-color: #A6E22E;\
border-color: #F8F8F2\
}\
.ace-monokai .ace_storage.ace_type,\
.ace-monokai .ace_support.ace_class,\
.ace-monokai .ace_support.ace_type {\
font-style: italic;\
color: #66D9EF\
}\
.ace-monokai .ace_entity.ace_name.ace_function,\
.ace-monokai .ace_entity.ace_other,\
.ace-monokai .ace_entity.ace_other.ace_attribute-name,\
.ace-monokai .ace_variable {\
color: #A6E22E\
}\
.ace-monokai .ace_variable.ace_parameter {\
font-style: italic;\
color: #FD971F\
}\
.ace-monokai .ace_string {\
color: #E6DB74\
}\
.ace-monokai .ace_comment {\
color: #75715E\
}\
.ace-monokai .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
}";

    var dom = acequire("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
    });

    /* src\components\Editor.svelte generated by Svelte v3.49.0 */
    const file$l = "src\\components\\Editor.svelte";

    function create_fragment$o(ctx) {
    	let div;
    	let aceeditor;
    	let current;

    	aceeditor = new R({
    			props: {
    				width: "40vw",
    				height: "80vh",
    				lang: "elm",
    				theme: "monokai",
    				value: /*text*/ ctx[0],
    				options: { showPrintMargin: false }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(aceeditor.$$.fragment);
    			attr_dev(div, "class", "mt-3 px-6");
    			add_location(div, file$l, 6, 0, 171);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(aceeditor, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const aceeditor_changes = {};
    			if (dirty & /*text*/ 1) aceeditor_changes.value = /*text*/ ctx[0];
    			aceeditor.$set(aceeditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aceeditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aceeditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(aceeditor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Editor', slots, []);
    	let { text = '' } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Editor> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ AceEditor: R, text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$o, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Editor",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get text() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Filters out falsy classes.
     * @param {...(string | false | null)} args The classes to be filtered
     * @return {string} The classes without the falsy values
     */
    function classes(...args) {
      return args.filter(cls => !!cls).join(' ');
    }

    /* node_modules\attractions\typography\h1.svelte generated by Svelte v3.49.0 */
    const file$k = "node_modules\\attractions\\typography\\h1.svelte";

    function create_fragment$n(ctx) {
    	let h1;
    	let h1_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	let h1_levels = [
    		{
    			class: h1_class_value = classes(/*_class*/ ctx[0])
    		},
    		/*$$restProps*/ ctx[1]
    	];

    	let h1_data = {};

    	for (let i = 0; i < h1_levels.length; i += 1) {
    		h1_data = assign(h1_data, h1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			set_attributes(h1, h1_data);
    			toggle_class(h1, "svelte-11ck5r8", true);
    			add_location(h1, file$k, 7, 0, 117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);

    			if (default_slot) {
    				default_slot.m(h1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h1, h1_data = get_spread_update(h1_levels, [
    				(!current || dirty & /*_class*/ 1 && h1_class_value !== (h1_class_value = classes(/*_class*/ ctx[0]))) && { class: h1_class_value },
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
    			]));

    			toggle_class(h1, "svelte-11ck5r8", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('H1', slots, ['default']);
    	let { class: _class = null } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(0, _class = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classes, _class });

    	$$self.$inject_state = $$new_props => {
    		if ('_class' in $$props) $$invalidate(0, _class = $$new_props._class);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [_class, $$restProps, $$scope, slots];
    }

    class H1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$n, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "H1",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get class() {
    		throw new Error("<H1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<H1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var H1$1 = H1;

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$7 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$5 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers$2 = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded = false;
            _this.activationTimer = 0;
            _this.fgDeactivationRemovalTimer = 0;
            _this.fgScale = '0';
            _this.frame = { width: 0, height: 0 };
            _this.initialSize = 0;
            _this.layoutFrame = 0;
            _this.maxRadius = 0;
            _this.unboundedCoords = { left: 0, top: 0 };
            _this.activationState = _this.defaultActivationState();
            _this.activationTimerCallback = function () {
                _this.activationAnimationHasEnded = true;
                _this.runDeactivationUXLogicIfReady();
            };
            _this.activateHandler = function (e) {
                _this.activateImpl(e);
            };
            _this.deactivateHandler = function () {
                _this.deactivateImpl();
            };
            _this.focusHandler = function () {
                _this.handleFocus();
            };
            _this.blurHandler = function () {
                _this.handleBlur();
            };
            _this.resizeHandler = function () {
                _this.layout();
            };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$7;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$5;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple();
            this.registerRootHandlers(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple()) {
                if (this.activationTimer) {
                    clearTimeout(this.activationTimer);
                    this.activationTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer) {
                    clearTimeout(this.fgDeactivationRemovalTimer);
                    this.fgDeactivationRemovalTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars();
                });
            }
            this.deregisterRootHandlers();
            this.deregisterDeactivationHandlers();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activateImpl(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivateImpl();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame) {
                cancelAnimationFrame(this.layoutFrame);
            }
            this.layoutFrame = requestAnimationFrame(function () {
                _this.layoutInternal();
                _this.layoutFrame = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
            var e_1, _a;
            if (supportsPressRipple) {
                try {
                    for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler);
            this.adapter.registerInteractionHandler('blur', this.blurHandler);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
            var e_2, _a;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
            }
            else {
                try {
                    for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
            var e_3, _a;
            try {
                for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
            var e_4, _a;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        MDCRippleFoundation.prototype.removeCssVars = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activateImpl = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState = _this.defaultActivationState();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer);
            clearTimeout(this.fgDeactivationRemovalTimer);
            this.rmBoundedActivationClasses();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer = setTimeout(function () {
                _this.activationTimerCallback();
            }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
            var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame.width / 2,
                    y: this.frame.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize / 2),
                y: startPoint.y - (this.initialSize / 2),
            };
            var endPoint = {
                x: (this.frame.width / 2) - (this.initialSize / 2),
                y: (this.frame.height / 2) - (this.initialSize / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded) {
                this.rmBoundedActivationClasses();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers$2.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState = function () {
            var _this = this;
            this.previousActivationEvent = this.activationState.activationEvent;
            this.activationState = this.defaultActivationState();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivateImpl = function () {
            var _this = this;
            var activationState = this.activationState;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () {
                    _this.animateDeactivation(state);
                });
                this.resetActivationState();
            }
            else {
                this.deregisterDeactivationHandlers();
                requestAnimationFrame(function () {
                    _this.activationState.hasDeactivationUXRun = true;
                    _this.animateDeactivation(state);
                    _this.resetActivationState();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal = function () {
            var _this = this;
            this.frame = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame.height, this.frame.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize = initialSize - 1;
            }
            else {
                this.initialSize = initialSize;
            }
            this.fgScale = "" + this.maxRadius / this.initialSize;
            this.updateLayoutCssVars();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords = {
                    left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                    top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var strings$4 = {
        NATIVE_CONTROL_SELECTOR: '.mdc-radio__native-control',
    };
    var cssClasses$6 = {
        DISABLED: 'mdc-radio--disabled',
        ROOT: 'mdc-radio',
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCRadioFoundation = /** @class */ (function (_super) {
        __extends(MDCRadioFoundation, _super);
        function MDCRadioFoundation(adapter) {
            return _super.call(this, __assign(__assign({}, MDCRadioFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCRadioFoundation, "cssClasses", {
            get: function () {
                return cssClasses$6;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRadioFoundation, "strings", {
            get: function () {
                return strings$4;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRadioFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    setNativeControlDisabled: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRadioFoundation.prototype.setDisabled = function (disabled) {
            var DISABLED = MDCRadioFoundation.cssClasses.DISABLED;
            this.adapter.setNativeControlDisabled(disabled);
            if (disabled) {
                this.adapter.addClass(DISABLED);
            }
            else {
                this.adapter.removeClass(DISABLED);
            }
        };
        return MDCRadioFoundation;
    }(MDCFoundation));

    function classMap(classObj) {
        return Object.entries(classObj)
            .filter(([name, value]) => name !== '' && value)
            .map(([name]) => name)
            .join(' ');
    }

    function dispatch(element, eventType, detail, eventInit = { bubbles: true }, 
    /** This is an internal thing used by SMUI to duplicate some SMUI events as MDC events. */
    duplicateEventForMDC = false) {
        if (typeof Event !== 'undefined' && element) {
            const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
            element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
            if (duplicateEventForMDC && eventType.startsWith('SMUI')) {
                const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => 'MDC'), Object.assign(Object.assign({}, eventInit), { detail }));
                element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
                if (duplicateEvent.defaultPrevented) {
                    event.preventDefault();
                }
            }
            return event;
        }
    }

    function exclude(obj, keys) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const cashIndex = name.indexOf('$');
            if (cashIndex !== -1 &&
                keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
                continue;
            }
            if (keys.indexOf(name) !== -1) {
                continue;
            }
            newObj[name] = obj[name];
        }
        return newObj;
    }

    // Match old modifiers. (only works on DOM events)
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match new modifiers.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    function forwardEventsBuilder(component) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let destructor = () => { };
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            const oldModifierMatch = eventType.match(oldModifierRegex);
            if (oldModifierMatch && console) {
                console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                    'all events can be bound with modifiers. Please update your ' +
                    'event binding: ', eventType);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const oldModifierMatch = eventType.match(oldModifierRegex);
                const newModifierMatch = eventType.match(newModifierRegex);
                const modifierMatch = oldModifierMatch || newModifierMatch;
                if (eventType.match(/^SMUI:\w+:/)) {
                    const newEventTypeParts = eventType.split(':');
                    let newEventType = '';
                    for (let i = 0; i < newEventTypeParts.length; i++) {
                        newEventType +=
                            i === newEventTypeParts.length - 1
                                ? ':' + newEventTypeParts[i]
                                : newEventTypeParts[i]
                                    .split('-')
                                    .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                    .join('');
                    }
                    console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                    eventType = newEventType;
                }
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(oldModifierMatch ? ':' : '$');
                    eventType = parts[0];
                    const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                },
            };
        };
    }

    function prefixFilter(obj, prefix) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (name.substring(0, prefix.length) === prefix) {
                newObj[name.substring(prefix.length)] = obj[name];
            }
        }
        return newObj;
    }

    function useActions(node, actions) {
        let actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            },
        };
    }

    const { applyPassive } = events;
    const { matches } = ponyfill;
    function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve(), } = {}) {
        let instance;
        let addLayoutListener = getContext('SMUI:addLayoutListener');
        let removeLayoutListener;
        let oldActive = active;
        let oldEventTarget = eventTarget;
        let oldActiveTarget = activeTarget;
        function handleProps() {
            if (surface) {
                addClass('mdc-ripple-surface');
                if (color === 'primary') {
                    addClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                else if (color === 'secondary') {
                    removeClass('smui-ripple-surface--primary');
                    addClass('smui-ripple-surface--secondary');
                }
                else {
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
            }
            else {
                removeClass('mdc-ripple-surface');
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            // Handle activation first.
            if (instance && oldActive !== active) {
                oldActive = active;
                if (active) {
                    instance.activate();
                }
                else if (active === false) {
                    instance.deactivate();
                }
            }
            // Then create/destroy an instance.
            if (ripple && !instance) {
                instance = new MDCRippleFoundation({
                    addClass,
                    browserSupportsCssVars: () => supportsCssVariables(window),
                    computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
                    containsEventTarget: (target) => node.contains(target),
                    deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
                    deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
                    deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
                    getWindowPageOffset: () => ({
                        x: window.pageXOffset,
                        y: window.pageYOffset,
                    }),
                    isSurfaceActive: () => active == null ? matches(activeTarget || node, ':active') : active,
                    isSurfaceDisabled: () => !!disabled,
                    isUnbounded: () => !!unbounded,
                    registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
                    registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
                    registerResizeHandler: (handler) => window.addEventListener('resize', handler),
                    removeClass,
                    updateCssVariable: addStyle,
                });
                initPromise.then(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            else if (instance && !ripple) {
                initPromise.then(() => {
                    if (instance) {
                        instance.destroy();
                        instance = undefined;
                    }
                });
            }
            // Now handle event/active targets
            if (instance &&
                (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
                oldEventTarget = eventTarget;
                oldActiveTarget = activeTarget;
                instance.destroy();
                requestAnimationFrame(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            if (!ripple && unbounded) {
                addClass('mdc-ripple-upgraded--unbounded');
            }
        }
        handleProps();
        if (addLayoutListener) {
            removeLayoutListener = addLayoutListener(layout);
        }
        function layout() {
            if (instance) {
                instance.layout();
            }
        }
        return {
            update(props) {
                ({
                    ripple,
                    surface,
                    unbounded,
                    disabled,
                    color,
                    active,
                    rippleElement,
                    eventTarget,
                    activeTarget,
                    addClass,
                    removeClass,
                    addStyle,
                    initPromise,
                } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: undefined, active: undefined, rippleElement: undefined, eventTarget: undefined, activeTarget: undefined, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
                handleProps();
            },
            destroy() {
                if (instance) {
                    instance.destroy();
                    instance = undefined;
                    removeClass('mdc-ripple-surface');
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                if (removeLayoutListener) {
                    removeLayoutListener();
                }
            },
        };
    }

    /* node_modules\@smui\radio\dist\Radio.svelte generated by Svelte v3.49.0 */
    const file$j = "node_modules\\@smui\\radio\\dist\\Radio.svelte";

    function create_fragment$m(ctx) {
    	let div4;
    	let input;
    	let input_class_value;
    	let input_value_value;
    	let useActions_action;
    	let t0;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div3;
    	let div4_class_value;
    	let div4_style_value;
    	let Ripple_action;
    	let useActions_action_1;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{
    			class: input_class_value = classMap({
    				[/*input$class*/ ctx[9]]: true,
    				'mdc-radio__native-control': true
    			})
    		},
    		{ type: "radio" },
    		/*inputProps*/ ctx[16],
    		{ disabled: /*disabled*/ ctx[0] },
    		{
    			__value: input_value_value = /*isUninitializedValue*/ ctx[15](/*valueKey*/ ctx[7])
    			? /*value*/ ctx[6]
    			: /*valueKey*/ ctx[7]
    		},
    		prefixFilter(/*$$restProps*/ ctx[20], 'input$')
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let div4_levels = [
    		{
    			class: div4_class_value = classMap({
    				[/*className*/ ctx[3]]: true,
    				'mdc-radio': true,
    				'mdc-radio--disabled': /*disabled*/ ctx[0],
    				'mdc-radio--touch': /*touch*/ ctx[5],
    				.../*internalClasses*/ ctx[11]
    			})
    		},
    		{
    			style: div4_style_value = Object.entries(/*internalStyles*/ ctx[12]).map(func$5).concat([/*style*/ ctx[4]]).join(' ')
    		},
    		exclude(/*$$restProps*/ ctx[20], ['input$'])
    	];

    	let div4_data = {};

    	for (let i = 0; i < div4_levels.length; i += 1) {
    		div4_data = assign(div4_data, div4_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			input = element("input");
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div3 = element("div");
    			set_attributes(input, input_data);
    			/*$$binding_groups*/ ctx[26][0].push(input);
    			add_location(input, file$j, 24, 2, 518);
    			attr_dev(div0, "class", "mdc-radio__outer-circle");
    			add_location(div0, file$j, 40, 4, 900);
    			attr_dev(div1, "class", "mdc-radio__inner-circle");
    			add_location(div1, file$j, 41, 4, 944);
    			attr_dev(div2, "class", "mdc-radio__background");
    			add_location(div2, file$j, 39, 2, 860);
    			attr_dev(div3, "class", "mdc-radio__ripple");
    			add_location(div3, file$j, 43, 2, 995);
    			set_attributes(div4, div4_data);
    			add_location(div4, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, input);
    			if (input.autofocus) input.focus();
    			input.checked = input.__value === /*group*/ ctx[1];
    			append_dev(div4, t0);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			/*div4_binding*/ ctx[27](div4);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, input, /*input$use*/ ctx[8])),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[25]),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[23], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[24], false, false, false),
    					action_destroyer(Ripple_action = Ripple.call(null, div4, {
    						unbounded: true,
    						active: /*rippleActive*/ ctx[13],
    						addClass: /*addClass*/ ctx[17],
    						removeClass: /*removeClass*/ ctx[18],
    						addStyle: /*addStyle*/ ctx[19]
    					})),
    					action_destroyer(useActions_action_1 = useActions.call(null, div4, /*use*/ ctx[2])),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, div4))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty & /*input$class*/ 512 && input_class_value !== (input_class_value = classMap({
    					[/*input$class*/ ctx[9]]: true,
    					'mdc-radio__native-control': true
    				})) && { class: input_class_value },
    				{ type: "radio" },
    				/*inputProps*/ ctx[16],
    				dirty & /*disabled*/ 1 && { disabled: /*disabled*/ ctx[0] },
    				dirty & /*valueKey, value*/ 192 && input_value_value !== (input_value_value = /*isUninitializedValue*/ ctx[15](/*valueKey*/ ctx[7])
    				? /*value*/ ctx[6]
    				: /*valueKey*/ ctx[7]) && { __value: input_value_value },
    				dirty & /*$$restProps*/ 1048576 && prefixFilter(/*$$restProps*/ ctx[20], 'input$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*input$use*/ 256) useActions_action.update.call(null, /*input$use*/ ctx[8]);

    			if (dirty & /*group*/ 2) {
    				input.checked = input.__value === /*group*/ ctx[1];
    			}

    			set_attributes(div4, div4_data = get_spread_update(div4_levels, [
    				dirty & /*className, disabled, touch, internalClasses*/ 2089 && div4_class_value !== (div4_class_value = classMap({
    					[/*className*/ ctx[3]]: true,
    					'mdc-radio': true,
    					'mdc-radio--disabled': /*disabled*/ ctx[0],
    					'mdc-radio--touch': /*touch*/ ctx[5],
    					.../*internalClasses*/ ctx[11]
    				})) && { class: div4_class_value },
    				dirty & /*internalStyles, style*/ 4112 && div4_style_value !== (div4_style_value = Object.entries(/*internalStyles*/ ctx[12]).map(func$5).concat([/*style*/ ctx[4]]).join(' ')) && { style: div4_style_value },
    				dirty & /*$$restProps*/ 1048576 && exclude(/*$$restProps*/ ctx[20], ['input$'])
    			]));

    			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*rippleActive*/ 8192) Ripple_action.update.call(null, {
    				unbounded: true,
    				active: /*rippleActive*/ ctx[13],
    				addClass: /*addClass*/ ctx[17],
    				removeClass: /*removeClass*/ ctx[18],
    				addStyle: /*addStyle*/ ctx[19]
    			});

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty & /*use*/ 4) useActions_action_1.update.call(null, /*use*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			/*$$binding_groups*/ ctx[26][0].splice(/*$$binding_groups*/ ctx[26][0].indexOf(input), 1);
    			/*div4_binding*/ ctx[27](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$5 = ([name, value]) => `${name}: ${value};`;

    function instance_1$6($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","disabled","touch","group","value","valueKey","input$use","input$class","getId","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Radio', slots, []);
    	var _a;
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { disabled = false } = $$props;
    	let { touch = false } = $$props;
    	let { group = undefined } = $$props;
    	let { value = null } = $$props;
    	let { valueKey = uninitializedValue } = $$props;
    	let { input$use = [] } = $$props;
    	let { input$class = '' } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};
    	let rippleActive = false;

    	let inputProps = (_a = getContext('SMUI:generic:input:props')) !== null && _a !== void 0
    	? _a
    	: {};

    	onMount(() => {
    		instance = new MDCRadioFoundation({
    				addClass,
    				removeClass,
    				setNativeControlDisabled: value => $$invalidate(0, disabled = value)
    			});

    		const accessor = {
    			_smui_radio_accessor: true,
    			get element() {
    				return getElement();
    			},
    			get checked() {
    				return group === value;
    			},
    			set checked(checked) {
    				if (checked && group !== value) {
    					$$invalidate(1, group = value);
    				} else if (!checked && group === value) {
    					$$invalidate(1, group = undefined);
    				}
    			},
    			activateRipple() {
    				if (!disabled) {
    					$$invalidate(13, rippleActive = true);
    				}
    			},
    			deactivateRipple() {
    				$$invalidate(13, rippleActive = false);
    			}
    		};

    		dispatch(element, 'SMUIGenericInput:mount', accessor);
    		instance.init();

    		return () => {
    			dispatch(element, 'SMUIGenericInput:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(12, internalStyles);
    			} else {
    				$$invalidate(12, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function getId() {
    		return inputProps && inputProps.id;
    	}

    	function getElement() {
    		return element;
    	}

    	const $$binding_groups = [[]];

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_change_handler() {
    		group = this.__value;
    		$$invalidate(1, group);
    	}

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(10, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(20, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(2, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('disabled' in $$new_props) $$invalidate(0, disabled = $$new_props.disabled);
    		if ('touch' in $$new_props) $$invalidate(5, touch = $$new_props.touch);
    		if ('group' in $$new_props) $$invalidate(1, group = $$new_props.group);
    		if ('value' in $$new_props) $$invalidate(6, value = $$new_props.value);
    		if ('valueKey' in $$new_props) $$invalidate(7, valueKey = $$new_props.valueKey);
    		if ('input$use' in $$new_props) $$invalidate(8, input$use = $$new_props.input$use);
    		if ('input$class' in $$new_props) $$invalidate(9, input$class = $$new_props.input$class);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		MDCRadioFoundation,
    		onMount,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		Ripple,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		style,
    		disabled,
    		touch,
    		group,
    		value,
    		valueKey,
    		input$use,
    		input$class,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		rippleActive,
    		inputProps,
    		addClass,
    		removeClass,
    		addStyle,
    		getId,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_a' in $$props) _a = $$new_props._a;
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(2, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('disabled' in $$props) $$invalidate(0, disabled = $$new_props.disabled);
    		if ('touch' in $$props) $$invalidate(5, touch = $$new_props.touch);
    		if ('group' in $$props) $$invalidate(1, group = $$new_props.group);
    		if ('value' in $$props) $$invalidate(6, value = $$new_props.value);
    		if ('valueKey' in $$props) $$invalidate(7, valueKey = $$new_props.valueKey);
    		if ('input$use' in $$props) $$invalidate(8, input$use = $$new_props.input$use);
    		if ('input$class' in $$props) $$invalidate(9, input$class = $$new_props.input$class);
    		if ('element' in $$props) $$invalidate(10, element = $$new_props.element);
    		if ('instance' in $$props) instance = $$new_props.instance;
    		if ('internalClasses' in $$props) $$invalidate(11, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(12, internalStyles = $$new_props.internalStyles);
    		if ('rippleActive' in $$props) $$invalidate(13, rippleActive = $$new_props.rippleActive);
    		if ('inputProps' in $$props) $$invalidate(16, inputProps = $$new_props.inputProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		disabled,
    		group,
    		use,
    		className,
    		style,
    		touch,
    		value,
    		valueKey,
    		input$use,
    		input$class,
    		element,
    		internalClasses,
    		internalStyles,
    		rippleActive,
    		forwardEvents,
    		isUninitializedValue,
    		inputProps,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		getId,
    		getElement,
    		blur_handler,
    		focus_handler,
    		input_change_handler,
    		$$binding_groups,
    		div4_binding
    	];
    }

    class Radio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$6, create_fragment$m, safe_not_equal, {
    			use: 2,
    			class: 3,
    			style: 4,
    			disabled: 0,
    			touch: 5,
    			group: 1,
    			value: 6,
    			valueKey: 7,
    			input$use: 8,
    			input$class: 9,
    			getId: 21,
    			getElement: 22
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Radio",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get use() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueKey() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueKey(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input$use() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input$use(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input$class() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input$class(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getId() {
    		return this.$$.ctx[21];
    	}

    	set getId(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[22];
    	}

    	set getElement(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$5 = {
        ROOT: 'mdc-form-field',
    };
    var strings$3 = {
        LABEL_SELECTOR: '.mdc-form-field > label',
    };

    /**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFormFieldFoundation = /** @class */ (function (_super) {
        __extends(MDCFormFieldFoundation, _super);
        function MDCFormFieldFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCFormFieldFoundation.defaultAdapter), adapter)) || this;
            _this.click = function () {
                _this.handleClick();
            };
            return _this;
        }
        Object.defineProperty(MDCFormFieldFoundation, "cssClasses", {
            get: function () {
                return cssClasses$5;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFormFieldFoundation, "strings", {
            get: function () {
                return strings$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFormFieldFoundation, "defaultAdapter", {
            get: function () {
                return {
                    activateInputRipple: function () { return undefined; },
                    deactivateInputRipple: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCFormFieldFoundation.prototype.init = function () {
            this.adapter.registerInteractionHandler('click', this.click);
        };
        MDCFormFieldFoundation.prototype.destroy = function () {
            this.adapter.deregisterInteractionHandler('click', this.click);
        };
        MDCFormFieldFoundation.prototype.handleClick = function () {
            var _this = this;
            this.adapter.activateInputRipple();
            requestAnimationFrame(function () {
                _this.adapter.deactivateInputRipple();
            });
        };
        return MDCFormFieldFoundation;
    }(MDCFoundation));

    /* node_modules\@smui\form-field\dist\FormField.svelte generated by Svelte v3.49.0 */

    const file$i = "node_modules\\@smui\\form-field\\dist\\FormField.svelte";
    const get_label_slot_changes$1 = dirty => ({});
    const get_label_slot_context$1 = ctx => ({});

    function create_fragment$l(ctx) {
    	let div;
    	let t;
    	let label_1;
    	let useActions_action;
    	let div_class_value;
    	let useActions_action_1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	const label_slot_template = /*#slots*/ ctx[13].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[12], get_label_slot_context$1);
    	let label_1_levels = [{ for: /*inputId*/ ctx[4] }, prefixFilter(/*$$restProps*/ ctx[10], 'label$')];
    	let label_1_data = {};

    	for (let i = 0; i < label_1_levels.length; i += 1) {
    		label_1_data = assign(label_1_data, label_1_levels[i]);
    	}

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-form-field': true,
    				'mdc-form-field--align-end': /*align*/ ctx[2] === 'end',
    				'mdc-form-field--nowrap': /*noWrap*/ ctx[3]
    			})
    		},
    		exclude(/*$$restProps*/ ctx[10], ['label$'])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			label_1 = element("label");
    			if (label_slot) label_slot.c();
    			set_attributes(label_1, label_1_data);
    			add_location(label_1, file$i, 15, 2, 412);
    			set_attributes(div, div_data);
    			add_location(div, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, label_1);

    			if (label_slot) {
    				label_slot.m(label_1, null);
    			}

    			/*label_1_binding*/ ctx[14](label_1);
    			/*div_binding*/ ctx[15](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, label_1, /*label$use*/ ctx[5])),
    					action_destroyer(useActions_action_1 = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[9].call(null, div)),
    					listen_dev(div, "SMUIGenericInput:mount", /*SMUIGenericInput_mount_handler*/ ctx[16], false, false, false),
    					listen_dev(div, "SMUIGenericInput:unmount", /*SMUIGenericInput_unmount_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (label_slot) {
    				if (label_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[12], dirty, get_label_slot_changes$1),
    						get_label_slot_context$1
    					);
    				}
    			}

    			set_attributes(label_1, label_1_data = get_spread_update(label_1_levels, [
    				(!current || dirty & /*inputId*/ 16) && { for: /*inputId*/ ctx[4] },
    				dirty & /*$$restProps*/ 1024 && prefixFilter(/*$$restProps*/ ctx[10], 'label$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*label$use*/ 32) useActions_action.update.call(null, /*label$use*/ ctx[5]);

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className, align, noWrap*/ 14 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-form-field': true,
    					'mdc-form-field--align-end': /*align*/ ctx[2] === 'end',
    					'mdc-form-field--nowrap': /*noWrap*/ ctx[3]
    				}))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[10], ['label$'])
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty & /*use*/ 1) useActions_action_1.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(label_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(label_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (label_slot) label_slot.d(detaching);
    			/*label_1_binding*/ ctx[14](null);
    			/*div_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }
    let counter = 0;

    function instance_1$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","align","noWrap","inputId","label$use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormField', slots, ['default','label']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { align = 'start' } = $$props;
    	let { noWrap = false } = $$props;
    	let { inputId = 'SMUI-form-field-' + counter++ } = $$props;
    	let { label$use = [] } = $$props;
    	let element;
    	let instance;
    	let label;
    	let input;
    	setContext('SMUI:generic:input:props', { id: inputId });

    	onMount(() => {
    		instance = new MDCFormFieldFoundation({
    				activateInputRipple: () => {
    					if (input) {
    						input.activateRipple();
    					}
    				},
    				deactivateInputRipple: () => {
    					if (input) {
    						input.deactivateRipple();
    					}
    				},
    				deregisterInteractionHandler: (evtType, handler) => {
    					label.removeEventListener(evtType, handler);
    				},
    				registerInteractionHandler: (evtType, handler) => {
    					label.addEventListener(evtType, handler);
    				}
    			});

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function getElement() {
    		return element;
    	}

    	function label_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			label = $$value;
    			$$invalidate(7, label);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(6, element);
    		});
    	}

    	const SMUIGenericInput_mount_handler = event => $$invalidate(8, input = event.detail);
    	const SMUIGenericInput_unmount_handler = () => $$invalidate(8, input = undefined);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('align' in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ('noWrap' in $$new_props) $$invalidate(3, noWrap = $$new_props.noWrap);
    		if ('inputId' in $$new_props) $$invalidate(4, inputId = $$new_props.inputId);
    		if ('label$use' in $$new_props) $$invalidate(5, label$use = $$new_props.label$use);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		counter,
    		MDCFormFieldFoundation,
    		onMount,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		align,
    		noWrap,
    		inputId,
    		label$use,
    		element,
    		instance,
    		label,
    		input,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('align' in $$props) $$invalidate(2, align = $$new_props.align);
    		if ('noWrap' in $$props) $$invalidate(3, noWrap = $$new_props.noWrap);
    		if ('inputId' in $$props) $$invalidate(4, inputId = $$new_props.inputId);
    		if ('label$use' in $$props) $$invalidate(5, label$use = $$new_props.label$use);
    		if ('element' in $$props) $$invalidate(6, element = $$new_props.element);
    		if ('instance' in $$props) instance = $$new_props.instance;
    		if ('label' in $$props) $$invalidate(7, label = $$new_props.label);
    		if ('input' in $$props) $$invalidate(8, input = $$new_props.input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		align,
    		noWrap,
    		inputId,
    		label$use,
    		element,
    		label,
    		input,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		label_1_binding,
    		div_binding,
    		SMUIGenericInput_mount_handler,
    		SMUIGenericInput_unmount_handler
    	];
    }

    class FormField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$5, create_fragment$l, safe_not_equal, {
    			use: 0,
    			class: 1,
    			align: 2,
    			noWrap: 3,
    			inputId: 4,
    			label$use: 5,
    			getElement: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormField",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get use() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noWrap() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noWrap(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputId() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputId(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label$use() {
    		throw new Error("<FormField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label$use(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[11];
    	}

    	set getElement(value) {
    		throw new Error("<FormField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\RadioGroup.svelte generated by Svelte v3.49.0 */
    const file$h = "src\\components\\RadioGroup.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (8:4) <FormField>
    function create_default_slot$7(ctx) {
    	let radio;
    	let updating_group;
    	let t;
    	let current;

    	function radio_group_binding(value) {
    		/*radio_group_binding*/ ctx[1](value);
    	}

    	let radio_props = { value: /*option*/ ctx[2], touch: true };

    	if (/*val*/ ctx[0] !== void 0) {
    		radio_props.group = /*val*/ ctx[0];
    	}

    	radio = new Radio({ props: radio_props, $$inline: true });
    	binding_callbacks.push(() => bind(radio, 'group', radio_group_binding));

    	const block = {
    		c: function create() {
    			create_component(radio.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(radio, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const radio_changes = {};

    			if (!updating_group && dirty & /*val*/ 1) {
    				updating_group = true;
    				radio_changes.group = /*val*/ ctx[0];
    				add_flush_callback(() => updating_group = false);
    			}

    			radio.$set(radio_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radio.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radio.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(radio, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(8:4) <FormField>",
    		ctx
    	});

    	return block;
    }

    // (10:6) 
    function create_label_slot(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*option*/ ctx[2]);
    			attr_dev(span, "slot", "label");
    			add_location(span, file$h, 9, 6, 288);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_label_slot.name,
    		type: "slot",
    		source: "(10:6) ",
    		ctx
    	});

    	return block;
    }

    // (7:2) {#each ['DFA', 'NFA', 'Regex', 'CFG', 'TM'] as option}
    function create_each_block(ctx) {
    	let formfield;
    	let current;

    	formfield = new FormField({
    			props: {
    				$$slots: {
    					label: [create_label_slot],
    					default: [create_default_slot$7]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formfield.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formfield, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formfield_changes = {};

    			if (dirty & /*$$scope, val*/ 33) {
    				formfield_changes.$$scope = { dirty, ctx };
    			}

    			formfield.$set(formfield_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formfield, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(7:2) {#each ['DFA', 'NFA', 'Regex', 'CFG', 'TM'] as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let current;
    	let each_value = ['DFA', 'NFA', 'Regex', 'CFG', 'TM'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 5; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < 5; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "radio-demo");
    			add_location(div, file$h, 5, 0, 126);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < 5; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*val*/ 1) {
    				each_value = ['DFA', 'NFA', 'Regex', 'CFG', 'TM'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 5; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = 5; i < 5; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 5; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < 5; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RadioGroup', slots, []);
    	let val = 'DFA';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RadioGroup> was created with unknown prop '${key}'`);
    	});

    	function radio_group_binding(value) {
    		val = value;
    		$$invalidate(0, val);
    	}

    	$$self.$capture_state = () => ({ Radio, FormField, val });

    	$$self.$inject_state = $$props => {
    		if ('val' in $$props) $$invalidate(0, val = $$props.val);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [val, radio_group_binding];
    }

    class RadioGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioGroup",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$4 = {
        ICON_BUTTON_ON: 'mdc-icon-button--on',
        ROOT: 'mdc-icon-button',
    };
    var strings$2 = {
        ARIA_LABEL: 'aria-label',
        ARIA_PRESSED: 'aria-pressed',
        DATA_ARIA_LABEL_OFF: 'data-aria-label-off',
        DATA_ARIA_LABEL_ON: 'data-aria-label-on',
        CHANGE_EVENT: 'MDCIconButtonToggle:change',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCIconButtonToggleFoundation = /** @class */ (function (_super) {
        __extends(MDCIconButtonToggleFoundation, _super);
        function MDCIconButtonToggleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCIconButtonToggleFoundation.defaultAdapter), adapter)) || this;
            /**
             * Whether the icon button has an aria label that changes depending on
             * toggled state.
             */
            _this.hasToggledAriaLabel = false;
            return _this;
        }
        Object.defineProperty(MDCIconButtonToggleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$4;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCIconButtonToggleFoundation, "strings", {
            get: function () {
                return strings$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCIconButtonToggleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    hasClass: function () { return false; },
                    notifyChange: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    getAttr: function () { return null; },
                    setAttr: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCIconButtonToggleFoundation.prototype.init = function () {
            var ariaLabelOn = this.adapter.getAttr(strings$2.DATA_ARIA_LABEL_ON);
            var ariaLabelOff = this.adapter.getAttr(strings$2.DATA_ARIA_LABEL_OFF);
            if (ariaLabelOn && ariaLabelOff) {
                if (this.adapter.getAttr(strings$2.ARIA_PRESSED) !== null) {
                    throw new Error('MDCIconButtonToggleFoundation: Button should not set ' +
                        '`aria-pressed` if it has a toggled aria label.');
                }
                this.hasToggledAriaLabel = true;
            }
            else {
                this.adapter.setAttr(strings$2.ARIA_PRESSED, String(this.isOn()));
            }
        };
        MDCIconButtonToggleFoundation.prototype.handleClick = function () {
            this.toggle();
            this.adapter.notifyChange({ isOn: this.isOn() });
        };
        MDCIconButtonToggleFoundation.prototype.isOn = function () {
            return this.adapter.hasClass(cssClasses$4.ICON_BUTTON_ON);
        };
        MDCIconButtonToggleFoundation.prototype.toggle = function (isOn) {
            if (isOn === void 0) { isOn = !this.isOn(); }
            // Toggle UI based on state.
            if (isOn) {
                this.adapter.addClass(cssClasses$4.ICON_BUTTON_ON);
            }
            else {
                this.adapter.removeClass(cssClasses$4.ICON_BUTTON_ON);
            }
            // Toggle aria attributes based on state.
            if (this.hasToggledAriaLabel) {
                var ariaLabel = isOn ?
                    this.adapter.getAttr(strings$2.DATA_ARIA_LABEL_ON) :
                    this.adapter.getAttr(strings$2.DATA_ARIA_LABEL_OFF);
                this.adapter.setAttr(strings$2.ARIA_LABEL, ariaLabel || '');
            }
            else {
                this.adapter.setAttr(strings$2.ARIA_PRESSED, "" + isOn);
            }
        };
        return MDCIconButtonToggleFoundation;
    }(MDCFoundation));

    /* node_modules\@smui\common\dist\elements\A.svelte generated by Svelte v3.49.0 */
    const file$g = "node_modules\\@smui\\common\\dist\\elements\\A.svelte";

    function create_fragment$j(ctx) {
    	let a;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let a_levels = [{ href: /*href*/ ctx[1] }, /*$$restProps*/ ctx[4]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			/*a_binding*/ ctx[8](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, a, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 2) && { href: /*href*/ ctx[1] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			/*a_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","href","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('A', slots, ['default']);
    	let { use = [] } = $$props;
    	let { href = 'javascript:void(0);' } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('href' in $$new_props) $$invalidate(1, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		href,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('href' in $$props) $$invalidate(1, href = $$new_props.href);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		href,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		a_binding
    	];
    }

    class A$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$j, safe_not_equal, { use: 0, href: 1, getElement: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "A",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get use() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[5];
    	}

    	set getElement(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\elements\Button.svelte generated by Svelte v3.49.0 */
    const file$f = "node_modules\\@smui\\common\\dist\\elements\\Button.svelte";

    function create_fragment$i(ctx) {
    	let button;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let button_levels = [/*$$restProps*/ ctx[3]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, button, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		button_binding
    	];
    }

    class Button$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$i, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get use() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\elements\Div.svelte generated by Svelte v3.49.0 */
    const file$e = "node_modules\\@smui\\common\\dist\\elements\\Div.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[3]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Div', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Div$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$h, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Div",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get use() {
    		throw new Error("<Div>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\elements\I.svelte generated by Svelte v3.49.0 */
    const file$d = "node_modules\\@smui\\common\\dist\\elements\\I.svelte";

    function create_fragment$g(ctx) {
    	let i;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let i_levels = [/*$$restProps*/ ctx[3]];
    	let i_data = {};

    	for (let i = 0; i < i_levels.length; i += 1) {
    		i_data = assign(i_data, i_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			i = element("i");
    			if (default_slot) default_slot.c();
    			set_attributes(i, i_data);
    			add_location(i, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);

    			if (default_slot) {
    				default_slot.m(i, null);
    			}

    			/*i_binding*/ ctx[7](i);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, i, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, i))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(i, i_data = get_spread_update(i_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (default_slot) default_slot.d(detaching);
    			/*i_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('I', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function i_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		i_binding
    	];
    }

    class I extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$g, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "I",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get use() {
    		throw new Error("<I>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<I>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<I>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\elements\Span.svelte generated by Svelte v3.49.0 */
    const file$c = "node_modules\\@smui\\common\\dist\\elements\\Span.svelte";

    function create_fragment$f(ctx) {
    	let span;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let span_levels = [/*$$restProps*/ ctx[3]];
    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[7](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, span))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Span', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		span_binding
    	];
    }

    class Span$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$f, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Span",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get use() {
    		throw new Error("<Span>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Span>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Span>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\elements\Svg.svelte generated by Svelte v3.49.0 */
    const file$b = "node_modules\\@smui\\common\\dist\\elements\\Svg.svelte";

    function create_fragment$e(ctx) {
    	let svg;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let svg_levels = [/*$$restProps*/ ctx[3]];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (default_slot) default_slot.c();
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			/*svg_binding*/ ctx[7](svg);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, svg, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, svg))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot) default_slot.d(detaching);
    			/*svg_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Svg', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		svg_binding
    	];
    }

    class Svg$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$e, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get use() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const A = A$1;
    const Button = Button$1;
    const Div = Div$1;
    const Span = Span$1;
    const Svg = Svg$1;

    /* node_modules\@smui\icon-button\dist\IconButton.svelte generated by Svelte v3.49.0 */
    const file$a = "node_modules\\@smui\\icon-button\\dist\\IconButton.svelte";

    // (61:10) {#if touch}
    function create_if_block$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mdc-icon-button__touch");
    			add_location(div, file$a, 60, 21, 1955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(61:10) {#if touch}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: true,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-icon-button': true,     'mdc-icon-button--on': !isUninitializedValue(pressed) && pressed,     'mdc-icon-button--touch': touch,     'mdc-icon-button--display-flex': displayFlex,     'smui-icon-button--size-button': size === 'button',     'mdc-icon-button--reduced-size': size === 'mini' || size === 'button',     'mdc-card__action': context === 'card:action',     'mdc-card__action--icon': context === 'card:action',     'mdc-top-app-bar__navigation-icon': context === 'top-app-bar:navigation',     'mdc-top-app-bar__action-item': context === 'top-app-bar:action',     'mdc-snackbar__dismiss': context === 'snackbar:actions',     'mdc-data-table__pagination-button': context === 'data-table:pagination',     'mdc-data-table__sort-icon-button':       context === 'data-table:sortable-header-cell',     'mdc-dialog__close': context === 'dialog:header' && action === 'close',     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   aria-pressed={!isUninitializedValue(pressed)     ? pressed       ? 'true'       : 'false'     : null}   aria-label={pressed ? ariaLabelOn : ariaLabelOff}   data-aria-label-on={ariaLabelOn}   data-aria-label-off={ariaLabelOff}   aria-describedby={ariaDescribedby}   on:click={() => instance && instance.handleClick()}   on:click={() =>     context === 'top-app-bar:navigation' &&     dispatch(getElement(), 'SMUITopAppBarIconButton:nav')}   {href}   {...actionProp}   {...internalAttrs}   {...$$restProps}   >
    function create_default_slot$6(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[32].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[36], null);
    	let if_block = /*touch*/ ctx[8] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "mdc-icon-button__ripple");
    			add_location(div, file$a, 59, 3, 1894);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[36], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*touch*/ ctx[8]) {
    				if (if_block) ; else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: true,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-icon-button': true,     'mdc-icon-button--on': !isUninitializedValue(pressed) && pressed,     'mdc-icon-button--touch': touch,     'mdc-icon-button--display-flex': displayFlex,     'smui-icon-button--size-button': size === 'button',     'mdc-icon-button--reduced-size': size === 'mini' || size === 'button',     'mdc-card__action': context === 'card:action',     'mdc-card__action--icon': context === 'card:action',     'mdc-top-app-bar__navigation-icon': context === 'top-app-bar:navigation',     'mdc-top-app-bar__action-item': context === 'top-app-bar:action',     'mdc-snackbar__dismiss': context === 'snackbar:actions',     'mdc-data-table__pagination-button': context === 'data-table:pagination',     'mdc-data-table__sort-icon-button':       context === 'data-table:sortable-header-cell',     'mdc-dialog__close': context === 'dialog:header' && action === 'close',     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   aria-pressed={!isUninitializedValue(pressed)     ? pressed       ? 'true'       : 'false'     : null}   aria-label={pressed ? ariaLabelOn : ariaLabelOff}   data-aria-label-on={ariaLabelOn}   data-aria-label-off={ariaLabelOff}   aria-describedby={ariaDescribedby}   on:click={() => instance && instance.handleClick()}   on:click={() =>     context === 'top-app-bar:navigation' &&     dispatch(getElement(), 'SMUITopAppBarIconButton:nav')}   {href}   {...actionProp}   {...internalAttrs}   {...$$restProps}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [
    				[
    					Ripple,
    					{
    						ripple: /*ripple*/ ctx[4],
    						unbounded: true,
    						color: /*color*/ ctx[5],
    						disabled: !!/*$$restProps*/ ctx[28].disabled,
    						addClass: /*addClass*/ ctx[25],
    						removeClass: /*removeClass*/ ctx[26],
    						addStyle: /*addStyle*/ ctx[27]
    					}
    				],
    				/*forwardEvents*/ ctx[21],
    				.../*use*/ ctx[1]
    			]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[2]]: true,
    				'mdc-icon-button': true,
    				'mdc-icon-button--on': !/*isUninitializedValue*/ ctx[22](/*pressed*/ ctx[0]) && /*pressed*/ ctx[0],
    				'mdc-icon-button--touch': /*touch*/ ctx[8],
    				'mdc-icon-button--display-flex': /*displayFlex*/ ctx[9],
    				'smui-icon-button--size-button': /*size*/ ctx[10] === 'button',
    				'mdc-icon-button--reduced-size': /*size*/ ctx[10] === 'mini' || /*size*/ ctx[10] === 'button',
    				'mdc-card__action': /*context*/ ctx[23] === 'card:action',
    				'mdc-card__action--icon': /*context*/ ctx[23] === 'card:action',
    				'mdc-top-app-bar__navigation-icon': /*context*/ ctx[23] === 'top-app-bar:navigation',
    				'mdc-top-app-bar__action-item': /*context*/ ctx[23] === 'top-app-bar:action',
    				'mdc-snackbar__dismiss': /*context*/ ctx[23] === 'snackbar:actions',
    				'mdc-data-table__pagination-button': /*context*/ ctx[23] === 'data-table:pagination',
    				'mdc-data-table__sort-icon-button': /*context*/ ctx[23] === 'data-table:sortable-header-cell',
    				'mdc-dialog__close': /*context*/ ctx[23] === 'dialog:header' && /*action*/ ctx[12] === 'close',
    				.../*internalClasses*/ ctx[17]
    			})
    		},
    		{
    			style: Object.entries(/*internalStyles*/ ctx[18]).map(func$4).concat([/*style*/ ctx[3]]).join(' ')
    		},
    		{
    			"aria-pressed": !/*isUninitializedValue*/ ctx[22](/*pressed*/ ctx[0])
    			? /*pressed*/ ctx[0] ? 'true' : 'false'
    			: null
    		},
    		{
    			"aria-label": /*pressed*/ ctx[0]
    			? /*ariaLabelOn*/ ctx[6]
    			: /*ariaLabelOff*/ ctx[7]
    		},
    		{
    			"data-aria-label-on": /*ariaLabelOn*/ ctx[6]
    		},
    		{
    			"data-aria-label-off": /*ariaLabelOff*/ ctx[7]
    		},
    		{
    			"aria-describedby": /*ariaDescribedby*/ ctx[24]
    		},
    		{ href: /*href*/ ctx[11] },
    		/*actionProp*/ ctx[20],
    		/*internalAttrs*/ ctx[19],
    		/*$$restProps*/ ctx[28]
    	];

    	var switch_value = /*component*/ ctx[13];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$6] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[33](switch_instance);
    		switch_instance.$on("click", /*click_handler*/ ctx[34]);
    		switch_instance.$on("click", /*click_handler_1*/ ctx[35]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use, className, isUninitializedValue, pressed, touch, displayFlex, size, context, action, internalClasses, internalStyles, style, ariaLabelOn, ariaLabelOff, ariaDescribedby, href, actionProp, internalAttrs*/ 536748031)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use*/ 505413682 && {
    						use: [
    							[
    								Ripple,
    								{
    									ripple: /*ripple*/ ctx[4],
    									unbounded: true,
    									color: /*color*/ ctx[5],
    									disabled: !!/*$$restProps*/ ctx[28].disabled,
    									addClass: /*addClass*/ ctx[25],
    									removeClass: /*removeClass*/ ctx[26],
    									addStyle: /*addStyle*/ ctx[27]
    								}
    							],
    							/*forwardEvents*/ ctx[21],
    							.../*use*/ ctx[1]
    						]
    					},
    					dirty[0] & /*className, isUninitializedValue, pressed, touch, displayFlex, size, context, action, internalClasses*/ 12719877 && {
    						class: classMap({
    							[/*className*/ ctx[2]]: true,
    							'mdc-icon-button': true,
    							'mdc-icon-button--on': !/*isUninitializedValue*/ ctx[22](/*pressed*/ ctx[0]) && /*pressed*/ ctx[0],
    							'mdc-icon-button--touch': /*touch*/ ctx[8],
    							'mdc-icon-button--display-flex': /*displayFlex*/ ctx[9],
    							'smui-icon-button--size-button': /*size*/ ctx[10] === 'button',
    							'mdc-icon-button--reduced-size': /*size*/ ctx[10] === 'mini' || /*size*/ ctx[10] === 'button',
    							'mdc-card__action': /*context*/ ctx[23] === 'card:action',
    							'mdc-card__action--icon': /*context*/ ctx[23] === 'card:action',
    							'mdc-top-app-bar__navigation-icon': /*context*/ ctx[23] === 'top-app-bar:navigation',
    							'mdc-top-app-bar__action-item': /*context*/ ctx[23] === 'top-app-bar:action',
    							'mdc-snackbar__dismiss': /*context*/ ctx[23] === 'snackbar:actions',
    							'mdc-data-table__pagination-button': /*context*/ ctx[23] === 'data-table:pagination',
    							'mdc-data-table__sort-icon-button': /*context*/ ctx[23] === 'data-table:sortable-header-cell',
    							'mdc-dialog__close': /*context*/ ctx[23] === 'dialog:header' && /*action*/ ctx[12] === 'close',
    							.../*internalClasses*/ ctx[17]
    						})
    					},
    					dirty[0] & /*internalStyles, style*/ 262152 && {
    						style: Object.entries(/*internalStyles*/ ctx[18]).map(func$4).concat([/*style*/ ctx[3]]).join(' ')
    					},
    					dirty[0] & /*isUninitializedValue, pressed*/ 4194305 && {
    						"aria-pressed": !/*isUninitializedValue*/ ctx[22](/*pressed*/ ctx[0])
    						? /*pressed*/ ctx[0] ? 'true' : 'false'
    						: null
    					},
    					dirty[0] & /*pressed, ariaLabelOn, ariaLabelOff*/ 193 && {
    						"aria-label": /*pressed*/ ctx[0]
    						? /*ariaLabelOn*/ ctx[6]
    						: /*ariaLabelOff*/ ctx[7]
    					},
    					dirty[0] & /*ariaLabelOn*/ 64 && {
    						"data-aria-label-on": /*ariaLabelOn*/ ctx[6]
    					},
    					dirty[0] & /*ariaLabelOff*/ 128 && {
    						"data-aria-label-off": /*ariaLabelOff*/ ctx[7]
    					},
    					dirty[0] & /*ariaDescribedby*/ 16777216 && {
    						"aria-describedby": /*ariaDescribedby*/ ctx[24]
    					},
    					dirty[0] & /*href*/ 2048 && { href: /*href*/ ctx[11] },
    					dirty[0] & /*actionProp*/ 1048576 && get_spread_object(/*actionProp*/ ctx[20]),
    					dirty[0] & /*internalAttrs*/ 524288 && get_spread_object(/*internalAttrs*/ ctx[19]),
    					dirty[0] & /*$$restProps*/ 268435456 && get_spread_object(/*$$restProps*/ ctx[28])
    				])
    			: {};

    			if (dirty[0] & /*touch*/ 256 | dirty[1] & /*$$scope*/ 32) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[13])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[33](switch_instance);
    					switch_instance.$on("click", /*click_handler*/ ctx[34]);
    					switch_instance.$on("click", /*click_handler_1*/ ctx[35]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[33](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$4 = ([name, value]) => `${name}: ${value};`;

    function instance_1$4($$self, $$props, $$invalidate) {
    	let actionProp;

    	const omit_props_names = [
    		"use","class","style","ripple","color","toggle","pressed","ariaLabelOn","ariaLabelOff","touch","displayFlex","size","href","action","component","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconButton', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { ripple = true } = $$props;
    	let { color = undefined } = $$props;
    	let { toggle = false } = $$props;
    	let { pressed = uninitializedValue } = $$props;
    	let { ariaLabelOn = undefined } = $$props;
    	let { ariaLabelOff = undefined } = $$props;
    	let { touch = false } = $$props;
    	let { displayFlex = true } = $$props;
    	let { size = 'normal' } = $$props;
    	let { href = undefined } = $$props;
    	let { action = undefined } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};
    	let internalAttrs = {};
    	let context = getContext('SMUI:icon-button:context');
    	let ariaDescribedby = getContext('SMUI:icon-button:aria-describedby');
    	let { component = href == null ? Button : A } = $$props;
    	let previousDisabled = $$restProps.disabled;
    	setContext('SMUI:icon:context', 'icon-button');
    	let oldToggle = null;

    	onDestroy(() => {
    		instance && instance.destroy();
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(17, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(17, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(18, internalStyles);
    			} else {
    				$$invalidate(18, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function getAttr(name) {
    		var _a;

    		return name in internalAttrs
    		? (_a = internalAttrs[name]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().getAttribute(name);
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(19, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function handleChange(evtData) {
    		$$invalidate(0, pressed = evtData.isOn);
    	}

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(15, element);
    		});
    	}

    	const click_handler = () => instance && instance.handleClick();
    	const click_handler_1 = () => context === 'top-app-bar:navigation' && dispatch(getElement(), 'SMUITopAppBarIconButton:nav');

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(28, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('ripple' in $$new_props) $$invalidate(4, ripple = $$new_props.ripple);
    		if ('color' in $$new_props) $$invalidate(5, color = $$new_props.color);
    		if ('toggle' in $$new_props) $$invalidate(29, toggle = $$new_props.toggle);
    		if ('pressed' in $$new_props) $$invalidate(0, pressed = $$new_props.pressed);
    		if ('ariaLabelOn' in $$new_props) $$invalidate(6, ariaLabelOn = $$new_props.ariaLabelOn);
    		if ('ariaLabelOff' in $$new_props) $$invalidate(7, ariaLabelOff = $$new_props.ariaLabelOff);
    		if ('touch' in $$new_props) $$invalidate(8, touch = $$new_props.touch);
    		if ('displayFlex' in $$new_props) $$invalidate(9, displayFlex = $$new_props.displayFlex);
    		if ('size' in $$new_props) $$invalidate(10, size = $$new_props.size);
    		if ('href' in $$new_props) $$invalidate(11, href = $$new_props.href);
    		if ('action' in $$new_props) $$invalidate(12, action = $$new_props.action);
    		if ('component' in $$new_props) $$invalidate(13, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(36, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCIconButtonToggleFoundation,
    		onDestroy,
    		getContext,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		dispatch,
    		Ripple,
    		A,
    		Button,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		toggle,
    		pressed,
    		ariaLabelOn,
    		ariaLabelOff,
    		touch,
    		displayFlex,
    		size,
    		href,
    		action,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		context,
    		ariaDescribedby,
    		component,
    		previousDisabled,
    		oldToggle,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		getAttr,
    		addAttr,
    		handleChange,
    		getElement,
    		actionProp
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('ripple' in $$props) $$invalidate(4, ripple = $$new_props.ripple);
    		if ('color' in $$props) $$invalidate(5, color = $$new_props.color);
    		if ('toggle' in $$props) $$invalidate(29, toggle = $$new_props.toggle);
    		if ('pressed' in $$props) $$invalidate(0, pressed = $$new_props.pressed);
    		if ('ariaLabelOn' in $$props) $$invalidate(6, ariaLabelOn = $$new_props.ariaLabelOn);
    		if ('ariaLabelOff' in $$props) $$invalidate(7, ariaLabelOff = $$new_props.ariaLabelOff);
    		if ('touch' in $$props) $$invalidate(8, touch = $$new_props.touch);
    		if ('displayFlex' in $$props) $$invalidate(9, displayFlex = $$new_props.displayFlex);
    		if ('size' in $$props) $$invalidate(10, size = $$new_props.size);
    		if ('href' in $$props) $$invalidate(11, href = $$new_props.href);
    		if ('action' in $$props) $$invalidate(12, action = $$new_props.action);
    		if ('element' in $$props) $$invalidate(15, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(16, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(17, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(18, internalStyles = $$new_props.internalStyles);
    		if ('internalAttrs' in $$props) $$invalidate(19, internalAttrs = $$new_props.internalAttrs);
    		if ('context' in $$props) $$invalidate(23, context = $$new_props.context);
    		if ('ariaDescribedby' in $$props) $$invalidate(24, ariaDescribedby = $$new_props.ariaDescribedby);
    		if ('component' in $$props) $$invalidate(13, component = $$new_props.component);
    		if ('previousDisabled' in $$props) $$invalidate(30, previousDisabled = $$new_props.previousDisabled);
    		if ('oldToggle' in $$props) $$invalidate(31, oldToggle = $$new_props.oldToggle);
    		if ('actionProp' in $$props) $$invalidate(20, actionProp = $$new_props.actionProp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*action*/ 4096) {
    			$$invalidate(20, actionProp = (() => {
    				if (context === 'data-table:pagination') {
    					switch (action) {
    						case 'first-page':
    							return { 'data-first-page': 'true' };
    						case 'prev-page':
    							return { 'data-prev-page': 'true' };
    						case 'next-page':
    							return { 'data-next-page': 'true' };
    						case 'last-page':
    							return { 'data-last-page': 'true' };
    						default:
    							return { 'data-action': 'true' };
    					}
    				} else if (context === 'dialog:header') {
    					return { 'data-mdc-dialog-action': action };
    				} else {
    					return { action };
    				}
    			})());
    		}

    		if (previousDisabled !== $$restProps.disabled) {
    			const elem = getElement();

    			if ('blur' in elem) {
    				elem.blur();
    			}

    			$$invalidate(30, previousDisabled = $$restProps.disabled);
    		}

    		if ($$self.$$.dirty[0] & /*element, toggle, instance*/ 536969216 | $$self.$$.dirty[1] & /*oldToggle*/ 1) {
    			if (element && getElement() && toggle !== oldToggle) {
    				if (toggle && !instance) {
    					$$invalidate(16, instance = new MDCIconButtonToggleFoundation({
    							addClass,
    							hasClass,
    							notifyChange: evtData => {
    								handleChange(evtData);
    								dispatch(getElement(), 'SMUIIconButtonToggle:change', evtData, undefined, true);
    							},
    							removeClass,
    							getAttr,
    							setAttr: addAttr
    						}));

    					instance.init();
    				} else if (!toggle && instance) {
    					instance.destroy();
    					$$invalidate(16, instance = undefined);
    					$$invalidate(17, internalClasses = {});
    					$$invalidate(19, internalAttrs = {});
    				}

    				$$invalidate(31, oldToggle = toggle);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, pressed*/ 65537) {
    			if (instance && !isUninitializedValue(pressed) && instance.isOn() !== pressed) {
    				instance.toggle(pressed);
    			}
    		}
    	};

    	return [
    		pressed,
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		ariaLabelOn,
    		ariaLabelOff,
    		touch,
    		displayFlex,
    		size,
    		href,
    		action,
    		component,
    		getElement,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		actionProp,
    		forwardEvents,
    		isUninitializedValue,
    		context,
    		ariaDescribedby,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		toggle,
    		previousDisabled,
    		oldToggle,
    		slots,
    		switch_instance_binding,
    		click_handler,
    		click_handler_1,
    		$$scope
    	];
    }

    class IconButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$4,
    			create_fragment$d,
    			safe_not_equal,
    			{
    				use: 1,
    				class: 2,
    				style: 3,
    				ripple: 4,
    				color: 5,
    				toggle: 29,
    				pressed: 0,
    				ariaLabelOn: 6,
    				ariaLabelOff: 7,
    				touch: 8,
    				displayFlex: 9,
    				size: 10,
    				href: 11,
    				action: 12,
    				component: 13,
    				getElement: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconButton",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get use() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pressed() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pressed(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelOn() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelOn(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelOff() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelOff(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get displayFlex() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displayFlex(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[14];
    	}

    	set getElement(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\CommonIcon.svelte generated by Svelte v3.49.0 */

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-button__icon': context === 'button',     'mdc-fab__icon': context === 'fab',     'mdc-icon-button__icon': context === 'icon-button',     'mdc-icon-button__icon--on': context === 'icon-button' && on,     'mdc-tab__icon': context === 'tab',     'mdc-banner__icon': context === 'banner',     'mdc-segmented-button__icon': context === 'segmented-button',   })}   aria-hidden="true"   {...component === Svg ? { focusable: 'false', tabindex: '-1' } : {}}   {...$$restProps}>
    function create_default_slot$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-button__icon': context === 'button',     'mdc-fab__icon': context === 'fab',     'mdc-icon-button__icon': context === 'icon-button',     'mdc-icon-button__icon--on': context === 'icon-button' && on,     'mdc-tab__icon': context === 'tab',     'mdc-banner__icon': context === 'banner',     'mdc-segmented-button__icon': context === 'segmented-button',   })}   aria-hidden=\\\"true\\\"   {...component === Svg ? { focusable: 'false', tabindex: '-1' } : {}}   {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[5], .../*use*/ ctx[0]]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-button__icon': /*context*/ ctx[6] === 'button',
    				'mdc-fab__icon': /*context*/ ctx[6] === 'fab',
    				'mdc-icon-button__icon': /*context*/ ctx[6] === 'icon-button',
    				'mdc-icon-button__icon--on': /*context*/ ctx[6] === 'icon-button' && /*on*/ ctx[2],
    				'mdc-tab__icon': /*context*/ ctx[6] === 'tab',
    				'mdc-banner__icon': /*context*/ ctx[6] === 'banner',
    				'mdc-segmented-button__icon': /*context*/ ctx[6] === 'segmented-button'
    			})
    		},
    		{ "aria-hidden": "true" },
    		/*component*/ ctx[3] === Svg$1
    		? { focusable: 'false', tabindex: '-1' }
    		: {},
    		/*$$restProps*/ ctx[7]
    	];

    	var switch_value = /*component*/ ctx[3];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$5] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[10](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*forwardEvents, use, classMap, className, context, on, component, Svg, $$restProps*/ 239)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*forwardEvents, use*/ 33 && {
    						use: [/*forwardEvents*/ ctx[5], .../*use*/ ctx[0]]
    					},
    					dirty & /*classMap, className, context, on*/ 70 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							'mdc-button__icon': /*context*/ ctx[6] === 'button',
    							'mdc-fab__icon': /*context*/ ctx[6] === 'fab',
    							'mdc-icon-button__icon': /*context*/ ctx[6] === 'icon-button',
    							'mdc-icon-button__icon--on': /*context*/ ctx[6] === 'icon-button' && /*on*/ ctx[2],
    							'mdc-tab__icon': /*context*/ ctx[6] === 'tab',
    							'mdc-banner__icon': /*context*/ ctx[6] === 'banner',
    							'mdc-segmented-button__icon': /*context*/ ctx[6] === 'segmented-button'
    						})
    					},
    					switch_instance_spread_levels[2],
    					dirty & /*component, Svg*/ 8 && get_spread_object(/*component*/ ctx[3] === Svg$1
    					? { focusable: 'false', tabindex: '-1' }
    					: {}),
    					dirty & /*$$restProps*/ 128 && get_spread_object(/*$$restProps*/ ctx[7])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 2048) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[10](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[10](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","on","component","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommonIcon', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { on = false } = $$props;
    	let element;
    	let { component = I } = $$props;
    	const context = getContext('SMUI:icon:context');

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(4, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('on' in $$new_props) $$invalidate(2, on = $$new_props.on);
    		if ('component' in $$new_props) $$invalidate(3, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		I,
    		Svg: Svg$1,
    		forwardEvents,
    		use,
    		className,
    		on,
    		element,
    		component,
    		context,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('on' in $$props) $$invalidate(2, on = $$new_props.on);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    		if ('component' in $$props) $$invalidate(3, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		on,
    		component,
    		element,
    		forwardEvents,
    		context,
    		$$restProps,
    		getElement,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class CommonIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$c, safe_not_equal, {
    			use: 0,
    			class: 1,
    			on: 2,
    			component: 3,
    			getElement: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommonIcon",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get use() {
    		throw new Error("<CommonIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<CommonIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<CommonIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CommonIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get on() {
    		throw new Error("<CommonIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set on(value) {
    		throw new Error("<CommonIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<CommonIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<CommonIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[8];
    	}

    	set getElement(value) {
    		throw new Error("<CommonIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\ContextFragment.svelte generated by Svelte v3.49.0 */

    function create_fragment$b(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $storeValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContextFragment', slots, ['default']);
    	let { key } = $$props;
    	let { value } = $$props;
    	const storeValue = writable(value);
    	validate_store(storeValue, 'storeValue');
    	component_subscribe($$self, storeValue, value => $$invalidate(5, $storeValue = value));
    	setContext(key, storeValue);

    	onDestroy(() => {
    		storeValue.set(undefined);
    	});

    	const writable_props = ['key', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContextFragment> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		setContext,
    		writable,
    		key,
    		value,
    		storeValue,
    		$storeValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 4) {
    			set_store_value(storeValue, $storeValue = value, $storeValue);
    		}
    	};

    	return [storeValue, key, value, $$scope, slots];
    }

    class ContextFragment extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$b, safe_not_equal, { key: 1, value: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContextFragment",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*key*/ ctx[1] === undefined && !('key' in props)) {
    			console.warn("<ContextFragment> was created without expected prop 'key'");
    		}

    		if (/*value*/ ctx[2] === undefined && !('value' in props)) {
    			console.warn("<ContextFragment> was created without expected prop 'value'");
    		}
    	}

    	get key() {
    		throw new Error("<ContextFragment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<ContextFragment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ContextFragment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ContextFragment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Icon = CommonIcon;

    // Material Design Icons v6.9.96
    var mdiTrashCan = "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z";
    var mdiTrashCanOutline = "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z";
    var mdiWeatherNight = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z";
    var mdiWeatherSunny = "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z";

    /* src\components\ToggleButton.svelte generated by Svelte v3.49.0 */
    const file$9 = "src\\components\\ToggleButton.svelte";

    // (27:4) {:else}
    function create_else_block$3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", mdiWeatherSunny);
    			add_location(path, file$9, 27, 6, 839);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(27:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if isDark}
    function create_if_block$4(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", mdiWeatherNight);
    			add_location(path, file$9, 25, 6, 770);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(25:4) {#if isDark}",
    		ctx
    	});

    	return block;
    }

    // (24:2) <Icon component={Svg} viewBox="0 0 24 24">
    function create_default_slot_1$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*isDark*/ ctx[0]) return create_if_block$4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(24:2) <Icon component={Svg} viewBox=\\\"0 0 24 24\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:0) <IconButton    on:click={toggleTheme}    class="ml-auto w-10 h-10  bg-orange-200 dark:bg-purple-600 rounded-md p-1 brightness-100 hover:brightness-75"    ripple={false}  >
    function create_default_slot$4(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				component: Svg,
    				viewBox: "0 0 24 24",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope, isDark*/ 33) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(19:0) <IconButton    on:click={toggleTheme}    class=\\\"ml-auto w-10 h-10  bg-orange-200 dark:bg-purple-600 rounded-md p-1 brightness-100 hover:brightness-75\\\"    ripple={false}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let iconbutton;
    	let current;

    	iconbutton = new IconButton({
    			props: {
    				class: "ml-auto w-10 h-10  bg-orange-200 dark:bg-purple-600 rounded-md p-1 brightness-100 hover:brightness-75",
    				ripple: false,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	iconbutton.$on("click", /*toggleTheme*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(iconbutton.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbutton_changes = {};

    			if (dirty & /*$$scope, isDark*/ 33) {
    				iconbutton_changes.$$scope = { dirty, ctx };
    			}

    			iconbutton.$set(iconbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToggleButton', slots, []);
    	const { getisDark, getmainRef } = getContext(key);
    	let isDark;
    	let mainRef;

    	onMount(() => {
    		$$invalidate(0, isDark = getisDark());
    		mainRef = getmainRef();
    	});

    	function toggleTheme() {
    		mainRef.classList.toggle('dark');
    		$$invalidate(0, isDark = !isDark);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToggleButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		IconButton,
    		Icon,
    		Svg,
    		mdiWeatherNight,
    		mdiWeatherSunny,
    		key,
    		getisDark,
    		getmainRef,
    		isDark,
    		mainRef,
    		toggleTheme
    	});

    	$$self.$inject_state = $$props => {
    		if ('isDark' in $$props) $$invalidate(0, isDark = $$props.isDark);
    		if ('mainRef' in $$props) mainRef = $$props.mainRef;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isDark, toggleTheme];
    }

    class ToggleButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToggleButton",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$3 = {
        LABEL_FLOAT_ABOVE: 'mdc-floating-label--float-above',
        LABEL_REQUIRED: 'mdc-floating-label--required',
        LABEL_SHAKE: 'mdc-floating-label--shake',
        ROOT: 'mdc-floating-label',
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFloatingLabelFoundation = /** @class */ (function (_super) {
        __extends(MDCFloatingLabelFoundation, _super);
        function MDCFloatingLabelFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCFloatingLabelFoundation.defaultAdapter), adapter)) || this;
            _this.shakeAnimationEndHandler = function () {
                _this.handleShakeAnimationEnd();
            };
            return _this;
        }
        Object.defineProperty(MDCFloatingLabelFoundation, "cssClasses", {
            get: function () {
                return cssClasses$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFloatingLabelFoundation, "defaultAdapter", {
            /**
             * See {@link MDCFloatingLabelAdapter} for typing information on parameters and return types.
             */
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    getWidth: function () { return 0; },
                    registerInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCFloatingLabelFoundation.prototype.init = function () {
            this.adapter.registerInteractionHandler('animationend', this.shakeAnimationEndHandler);
        };
        MDCFloatingLabelFoundation.prototype.destroy = function () {
            this.adapter.deregisterInteractionHandler('animationend', this.shakeAnimationEndHandler);
        };
        /**
         * Returns the width of the label element.
         */
        MDCFloatingLabelFoundation.prototype.getWidth = function () {
            return this.adapter.getWidth();
        };
        /**
         * Styles the label to produce a shake animation to indicate an error.
         * @param shouldShake If true, adds the shake CSS class; otherwise, removes shake class.
         */
        MDCFloatingLabelFoundation.prototype.shake = function (shouldShake) {
            var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
            if (shouldShake) {
                this.adapter.addClass(LABEL_SHAKE);
            }
            else {
                this.adapter.removeClass(LABEL_SHAKE);
            }
        };
        /**
         * Styles the label to float or dock.
         * @param shouldFloat If true, adds the float CSS class; otherwise, removes float and shake classes to dock the label.
         */
        MDCFloatingLabelFoundation.prototype.float = function (shouldFloat) {
            var _a = MDCFloatingLabelFoundation.cssClasses, LABEL_FLOAT_ABOVE = _a.LABEL_FLOAT_ABOVE, LABEL_SHAKE = _a.LABEL_SHAKE;
            if (shouldFloat) {
                this.adapter.addClass(LABEL_FLOAT_ABOVE);
            }
            else {
                this.adapter.removeClass(LABEL_FLOAT_ABOVE);
                this.adapter.removeClass(LABEL_SHAKE);
            }
        };
        /**
         * Styles the label as required.
         * @param isRequired If true, adds an asterisk to the label, indicating that it is required.
         */
        MDCFloatingLabelFoundation.prototype.setRequired = function (isRequired) {
            var LABEL_REQUIRED = MDCFloatingLabelFoundation.cssClasses.LABEL_REQUIRED;
            if (isRequired) {
                this.adapter.addClass(LABEL_REQUIRED);
            }
            else {
                this.adapter.removeClass(LABEL_REQUIRED);
            }
        };
        MDCFloatingLabelFoundation.prototype.handleShakeAnimationEnd = function () {
            var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
            this.adapter.removeClass(LABEL_SHAKE);
        };
        return MDCFloatingLabelFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$2 = {
        LINE_RIPPLE_ACTIVE: 'mdc-line-ripple--active',
        LINE_RIPPLE_DEACTIVATING: 'mdc-line-ripple--deactivating',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCLineRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCLineRippleFoundation, _super);
        function MDCLineRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCLineRippleFoundation.defaultAdapter), adapter)) || this;
            _this.transitionEndHandler = function (evt) {
                _this.handleTransitionEnd(evt);
            };
            return _this;
        }
        Object.defineProperty(MDCLineRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCLineRippleFoundation, "defaultAdapter", {
            /**
             * See {@link MDCLineRippleAdapter} for typing information on parameters and return types.
             */
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    hasClass: function () { return false; },
                    setStyle: function () { return undefined; },
                    registerEventHandler: function () { return undefined; },
                    deregisterEventHandler: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCLineRippleFoundation.prototype.init = function () {
            this.adapter.registerEventHandler('transitionend', this.transitionEndHandler);
        };
        MDCLineRippleFoundation.prototype.destroy = function () {
            this.adapter.deregisterEventHandler('transitionend', this.transitionEndHandler);
        };
        MDCLineRippleFoundation.prototype.activate = function () {
            this.adapter.removeClass(cssClasses$2.LINE_RIPPLE_DEACTIVATING);
            this.adapter.addClass(cssClasses$2.LINE_RIPPLE_ACTIVE);
        };
        MDCLineRippleFoundation.prototype.setRippleCenter = function (xCoordinate) {
            this.adapter.setStyle('transform-origin', xCoordinate + "px center");
        };
        MDCLineRippleFoundation.prototype.deactivate = function () {
            this.adapter.addClass(cssClasses$2.LINE_RIPPLE_DEACTIVATING);
        };
        MDCLineRippleFoundation.prototype.handleTransitionEnd = function (evt) {
            // Wait for the line ripple to be either transparent or opaque
            // before emitting the animation end event
            var isDeactivating = this.adapter.hasClass(cssClasses$2.LINE_RIPPLE_DEACTIVATING);
            if (evt.propertyName === 'opacity') {
                if (isDeactivating) {
                    this.adapter.removeClass(cssClasses$2.LINE_RIPPLE_ACTIVE);
                    this.adapter.removeClass(cssClasses$2.LINE_RIPPLE_DEACTIVATING);
                }
            }
        };
        return MDCLineRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var strings$1 = {
        NOTCH_ELEMENT_SELECTOR: '.mdc-notched-outline__notch',
    };
    var numbers$1 = {
        // This should stay in sync with $mdc-notched-outline-padding * 2.
        NOTCH_ELEMENT_PADDING: 8,
    };
    var cssClasses$1 = {
        NO_LABEL: 'mdc-notched-outline--no-label',
        OUTLINE_NOTCHED: 'mdc-notched-outline--notched',
        OUTLINE_UPGRADED: 'mdc-notched-outline--upgraded',
    };

    /**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCNotchedOutlineFoundation = /** @class */ (function (_super) {
        __extends(MDCNotchedOutlineFoundation, _super);
        function MDCNotchedOutlineFoundation(adapter) {
            return _super.call(this, __assign(__assign({}, MDCNotchedOutlineFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCNotchedOutlineFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCNotchedOutlineFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCNotchedOutlineFoundation, "numbers", {
            get: function () {
                return numbers$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCNotchedOutlineFoundation, "defaultAdapter", {
            /**
             * See {@link MDCNotchedOutlineAdapter} for typing information on parameters and return types.
             */
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    setNotchWidthProperty: function () { return undefined; },
                    removeNotchWidthProperty: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Adds the outline notched selector and updates the notch width calculated based off of notchWidth.
         */
        MDCNotchedOutlineFoundation.prototype.notch = function (notchWidth) {
            var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
            if (notchWidth > 0) {
                notchWidth += numbers$1.NOTCH_ELEMENT_PADDING; // Add padding from left/right.
            }
            this.adapter.setNotchWidthProperty(notchWidth);
            this.adapter.addClass(OUTLINE_NOTCHED);
        };
        /**
         * Removes notched outline selector to close the notch in the outline.
         */
        MDCNotchedOutlineFoundation.prototype.closeNotch = function () {
            var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
            this.adapter.removeClass(OUTLINE_NOTCHED);
            this.adapter.removeNotchWidthProperty();
        };
        return MDCNotchedOutlineFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var strings = {
        ARIA_CONTROLS: 'aria-controls',
        ARIA_DESCRIBEDBY: 'aria-describedby',
        INPUT_SELECTOR: '.mdc-text-field__input',
        LABEL_SELECTOR: '.mdc-floating-label',
        LEADING_ICON_SELECTOR: '.mdc-text-field__icon--leading',
        LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
        OUTLINE_SELECTOR: '.mdc-notched-outline',
        PREFIX_SELECTOR: '.mdc-text-field__affix--prefix',
        SUFFIX_SELECTOR: '.mdc-text-field__affix--suffix',
        TRAILING_ICON_SELECTOR: '.mdc-text-field__icon--trailing'
    };
    var cssClasses = {
        DISABLED: 'mdc-text-field--disabled',
        FOCUSED: 'mdc-text-field--focused',
        HELPER_LINE: 'mdc-text-field-helper-line',
        INVALID: 'mdc-text-field--invalid',
        LABEL_FLOATING: 'mdc-text-field--label-floating',
        NO_LABEL: 'mdc-text-field--no-label',
        OUTLINED: 'mdc-text-field--outlined',
        ROOT: 'mdc-text-field',
        TEXTAREA: 'mdc-text-field--textarea',
        WITH_LEADING_ICON: 'mdc-text-field--with-leading-icon',
        WITH_TRAILING_ICON: 'mdc-text-field--with-trailing-icon',
        WITH_INTERNAL_COUNTER: 'mdc-text-field--with-internal-counter',
    };
    var numbers = {
        LABEL_SCALE: 0.75,
    };
    /**
     * Whitelist based off of
     * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation
     * under the "Validation-related attributes" section.
     */
    var VALIDATION_ATTR_WHITELIST = [
        'pattern',
        'min',
        'max',
        'required',
        'step',
        'minlength',
        'maxlength',
    ];
    /**
     * Label should always float for these types as they show some UI even if value
     * is empty.
     */
    var ALWAYS_FLOAT_TYPES = [
        'color',
        'date',
        'datetime-local',
        'month',
        'range',
        'time',
        'week',
    ];

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var POINTERDOWN_EVENTS = ['mousedown', 'touchstart'];
    var INTERACTION_EVENTS = ['click', 'keydown'];
    var MDCTextFieldFoundation = /** @class */ (function (_super) {
        __extends(MDCTextFieldFoundation, _super);
        /**
         * @param adapter
         * @param foundationMap Map from subcomponent names to their subfoundations.
         */
        function MDCTextFieldFoundation(adapter, foundationMap) {
            if (foundationMap === void 0) { foundationMap = {}; }
            var _this = _super.call(this, __assign(__assign({}, MDCTextFieldFoundation.defaultAdapter), adapter)) || this;
            _this.isFocused = false;
            _this.receivedUserInput = false;
            _this.valid = true;
            _this.useNativeValidation = true;
            _this.validateOnValueChange = true;
            _this.helperText = foundationMap.helperText;
            _this.characterCounter = foundationMap.characterCounter;
            _this.leadingIcon = foundationMap.leadingIcon;
            _this.trailingIcon = foundationMap.trailingIcon;
            _this.inputFocusHandler = function () {
                _this.activateFocus();
            };
            _this.inputBlurHandler = function () {
                _this.deactivateFocus();
            };
            _this.inputInputHandler = function () {
                _this.handleInput();
            };
            _this.setPointerXOffset = function (evt) {
                _this.setTransformOrigin(evt);
            };
            _this.textFieldInteractionHandler = function () {
                _this.handleTextFieldInteraction();
            };
            _this.validationAttributeChangeHandler = function (attributesList) {
                _this.handleValidationAttributeChange(attributesList);
            };
            return _this;
        }
        Object.defineProperty(MDCTextFieldFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldAlwaysFloat", {
            get: function () {
                var type = this.getNativeInput().type;
                return ALWAYS_FLOAT_TYPES.indexOf(type) >= 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldFloat", {
            get: function () {
                return this.shouldAlwaysFloat || this.isFocused || !!this.getValue() ||
                    this.isBadInput();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldShake", {
            get: function () {
                return !this.isFocused && !this.isValid() && !!this.getValue();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation, "defaultAdapter", {
            /**
             * See {@link MDCTextFieldAdapter} for typing information on parameters and
             * return types.
             */
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    hasClass: function () { return true; },
                    setInputAttr: function () { return undefined; },
                    removeInputAttr: function () { return undefined; },
                    registerTextFieldInteractionHandler: function () { return undefined; },
                    deregisterTextFieldInteractionHandler: function () { return undefined; },
                    registerInputInteractionHandler: function () { return undefined; },
                    deregisterInputInteractionHandler: function () { return undefined; },
                    registerValidationAttributeChangeHandler: function () {
                        return new MutationObserver(function () { return undefined; });
                    },
                    deregisterValidationAttributeChangeHandler: function () { return undefined; },
                    getNativeInput: function () { return null; },
                    isFocused: function () { return false; },
                    activateLineRipple: function () { return undefined; },
                    deactivateLineRipple: function () { return undefined; },
                    setLineRippleTransformOrigin: function () { return undefined; },
                    shakeLabel: function () { return undefined; },
                    floatLabel: function () { return undefined; },
                    setLabelRequired: function () { return undefined; },
                    hasLabel: function () { return false; },
                    getLabelWidth: function () { return 0; },
                    hasOutline: function () { return false; },
                    notchOutline: function () { return undefined; },
                    closeOutline: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTextFieldFoundation.prototype.init = function () {
            var e_1, _a, e_2, _b;
            if (this.adapter.hasLabel() && this.getNativeInput().required) {
                this.adapter.setLabelRequired(true);
            }
            if (this.adapter.isFocused()) {
                this.inputFocusHandler();
            }
            else if (this.adapter.hasLabel() && this.shouldFloat) {
                this.notchOutline(true);
                this.adapter.floatLabel(true);
                this.styleFloating(true);
            }
            this.adapter.registerInputInteractionHandler('focus', this.inputFocusHandler);
            this.adapter.registerInputInteractionHandler('blur', this.inputBlurHandler);
            this.adapter.registerInputInteractionHandler('input', this.inputInputHandler);
            try {
                for (var POINTERDOWN_EVENTS_1 = __values(POINTERDOWN_EVENTS), POINTERDOWN_EVENTS_1_1 = POINTERDOWN_EVENTS_1.next(); !POINTERDOWN_EVENTS_1_1.done; POINTERDOWN_EVENTS_1_1 = POINTERDOWN_EVENTS_1.next()) {
                    var evtType = POINTERDOWN_EVENTS_1_1.value;
                    this.adapter.registerInputInteractionHandler(evtType, this.setPointerXOffset);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (POINTERDOWN_EVENTS_1_1 && !POINTERDOWN_EVENTS_1_1.done && (_a = POINTERDOWN_EVENTS_1.return)) _a.call(POINTERDOWN_EVENTS_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var INTERACTION_EVENTS_1 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next(); !INTERACTION_EVENTS_1_1.done; INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next()) {
                    var evtType = INTERACTION_EVENTS_1_1.value;
                    this.adapter.registerTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (INTERACTION_EVENTS_1_1 && !INTERACTION_EVENTS_1_1.done && (_b = INTERACTION_EVENTS_1.return)) _b.call(INTERACTION_EVENTS_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.validationObserver =
                this.adapter.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler);
            this.setcharacterCounter(this.getValue().length);
        };
        MDCTextFieldFoundation.prototype.destroy = function () {
            var e_3, _a, e_4, _b;
            this.adapter.deregisterInputInteractionHandler('focus', this.inputFocusHandler);
            this.adapter.deregisterInputInteractionHandler('blur', this.inputBlurHandler);
            this.adapter.deregisterInputInteractionHandler('input', this.inputInputHandler);
            try {
                for (var POINTERDOWN_EVENTS_2 = __values(POINTERDOWN_EVENTS), POINTERDOWN_EVENTS_2_1 = POINTERDOWN_EVENTS_2.next(); !POINTERDOWN_EVENTS_2_1.done; POINTERDOWN_EVENTS_2_1 = POINTERDOWN_EVENTS_2.next()) {
                    var evtType = POINTERDOWN_EVENTS_2_1.value;
                    this.adapter.deregisterInputInteractionHandler(evtType, this.setPointerXOffset);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (POINTERDOWN_EVENTS_2_1 && !POINTERDOWN_EVENTS_2_1.done && (_a = POINTERDOWN_EVENTS_2.return)) _a.call(POINTERDOWN_EVENTS_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var INTERACTION_EVENTS_2 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next(); !INTERACTION_EVENTS_2_1.done; INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next()) {
                    var evtType = INTERACTION_EVENTS_2_1.value;
                    this.adapter.deregisterTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (INTERACTION_EVENTS_2_1 && !INTERACTION_EVENTS_2_1.done && (_b = INTERACTION_EVENTS_2.return)) _b.call(INTERACTION_EVENTS_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
            this.adapter.deregisterValidationAttributeChangeHandler(this.validationObserver);
        };
        /**
         * Handles user interactions with the Text Field.
         */
        MDCTextFieldFoundation.prototype.handleTextFieldInteraction = function () {
            var nativeInput = this.adapter.getNativeInput();
            if (nativeInput && nativeInput.disabled) {
                return;
            }
            this.receivedUserInput = true;
        };
        /**
         * Handles validation attribute changes
         */
        MDCTextFieldFoundation.prototype.handleValidationAttributeChange = function (attributesList) {
            var _this = this;
            attributesList.some(function (attributeName) {
                if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
                    _this.styleValidity(true);
                    _this.adapter.setLabelRequired(_this.getNativeInput().required);
                    return true;
                }
                return false;
            });
            if (attributesList.indexOf('maxlength') > -1) {
                this.setcharacterCounter(this.getValue().length);
            }
        };
        /**
         * Opens/closes the notched outline.
         */
        MDCTextFieldFoundation.prototype.notchOutline = function (openNotch) {
            if (!this.adapter.hasOutline() || !this.adapter.hasLabel()) {
                return;
            }
            if (openNotch) {
                var labelWidth = this.adapter.getLabelWidth() * numbers.LABEL_SCALE;
                this.adapter.notchOutline(labelWidth);
            }
            else {
                this.adapter.closeOutline();
            }
        };
        /**
         * Activates the text field focus state.
         */
        MDCTextFieldFoundation.prototype.activateFocus = function () {
            this.isFocused = true;
            this.styleFocused(this.isFocused);
            this.adapter.activateLineRipple();
            if (this.adapter.hasLabel()) {
                this.notchOutline(this.shouldFloat);
                this.adapter.floatLabel(this.shouldFloat);
                this.styleFloating(this.shouldFloat);
                this.adapter.shakeLabel(this.shouldShake);
            }
            if (this.helperText &&
                (this.helperText.isPersistent() || !this.helperText.isValidation() ||
                    !this.valid)) {
                this.helperText.showToScreenReader();
            }
        };
        /**
         * Sets the line ripple's transform origin, so that the line ripple activate
         * animation will animate out from the user's click location.
         */
        MDCTextFieldFoundation.prototype.setTransformOrigin = function (evt) {
            if (this.isDisabled() || this.adapter.hasOutline()) {
                return;
            }
            var touches = evt.touches;
            var targetEvent = touches ? touches[0] : evt;
            var targetClientRect = targetEvent.target.getBoundingClientRect();
            var normalizedX = targetEvent.clientX - targetClientRect.left;
            this.adapter.setLineRippleTransformOrigin(normalizedX);
        };
        /**
         * Handles input change of text input and text area.
         */
        MDCTextFieldFoundation.prototype.handleInput = function () {
            this.autoCompleteFocus();
            this.setcharacterCounter(this.getValue().length);
        };
        /**
         * Activates the Text Field's focus state in cases when the input value
         * changes without user input (e.g. programmatically).
         */
        MDCTextFieldFoundation.prototype.autoCompleteFocus = function () {
            if (!this.receivedUserInput) {
                this.activateFocus();
            }
        };
        /**
         * Deactivates the Text Field's focus state.
         */
        MDCTextFieldFoundation.prototype.deactivateFocus = function () {
            this.isFocused = false;
            this.adapter.deactivateLineRipple();
            var isValid = this.isValid();
            this.styleValidity(isValid);
            this.styleFocused(this.isFocused);
            if (this.adapter.hasLabel()) {
                this.notchOutline(this.shouldFloat);
                this.adapter.floatLabel(this.shouldFloat);
                this.styleFloating(this.shouldFloat);
                this.adapter.shakeLabel(this.shouldShake);
            }
            if (!this.shouldFloat) {
                this.receivedUserInput = false;
            }
        };
        MDCTextFieldFoundation.prototype.getValue = function () {
            return this.getNativeInput().value;
        };
        /**
         * @param value The value to set on the input Element.
         */
        MDCTextFieldFoundation.prototype.setValue = function (value) {
            // Prevent Safari from moving the caret to the end of the input when the
            // value has not changed.
            if (this.getValue() !== value) {
                this.getNativeInput().value = value;
            }
            this.setcharacterCounter(value.length);
            if (this.validateOnValueChange) {
                var isValid = this.isValid();
                this.styleValidity(isValid);
            }
            if (this.adapter.hasLabel()) {
                this.notchOutline(this.shouldFloat);
                this.adapter.floatLabel(this.shouldFloat);
                this.styleFloating(this.shouldFloat);
                if (this.validateOnValueChange) {
                    this.adapter.shakeLabel(this.shouldShake);
                }
            }
        };
        /**
         * @return The custom validity state, if set; otherwise, the result of a
         *     native validity check.
         */
        MDCTextFieldFoundation.prototype.isValid = function () {
            return this.useNativeValidation ? this.isNativeInputValid() : this.valid;
        };
        /**
         * @param isValid Sets the custom validity state of the Text Field.
         */
        MDCTextFieldFoundation.prototype.setValid = function (isValid) {
            this.valid = isValid;
            this.styleValidity(isValid);
            var shouldShake = !isValid && !this.isFocused && !!this.getValue();
            if (this.adapter.hasLabel()) {
                this.adapter.shakeLabel(shouldShake);
            }
        };
        /**
         * @param shouldValidate Whether or not validity should be updated on
         *     value change.
         */
        MDCTextFieldFoundation.prototype.setValidateOnValueChange = function (shouldValidate) {
            this.validateOnValueChange = shouldValidate;
        };
        /**
         * @return Whether or not validity should be updated on value change. `true`
         *     by default.
         */
        MDCTextFieldFoundation.prototype.getValidateOnValueChange = function () {
            return this.validateOnValueChange;
        };
        /**
         * Enables or disables the use of native validation. Use this for custom
         * validation.
         * @param useNativeValidation Set this to false to ignore native input
         *     validation.
         */
        MDCTextFieldFoundation.prototype.setUseNativeValidation = function (useNativeValidation) {
            this.useNativeValidation = useNativeValidation;
        };
        MDCTextFieldFoundation.prototype.isDisabled = function () {
            return this.getNativeInput().disabled;
        };
        /**
         * @param disabled Sets the text-field disabled or enabled.
         */
        MDCTextFieldFoundation.prototype.setDisabled = function (disabled) {
            this.getNativeInput().disabled = disabled;
            this.styleDisabled(disabled);
        };
        /**
         * @param content Sets the content of the helper text.
         */
        MDCTextFieldFoundation.prototype.setHelperTextContent = function (content) {
            if (this.helperText) {
                this.helperText.setContent(content);
            }
        };
        /**
         * Sets the aria label of the leading icon.
         */
        MDCTextFieldFoundation.prototype.setLeadingIconAriaLabel = function (label) {
            if (this.leadingIcon) {
                this.leadingIcon.setAriaLabel(label);
            }
        };
        /**
         * Sets the text content of the leading icon.
         */
        MDCTextFieldFoundation.prototype.setLeadingIconContent = function (content) {
            if (this.leadingIcon) {
                this.leadingIcon.setContent(content);
            }
        };
        /**
         * Sets the aria label of the trailing icon.
         */
        MDCTextFieldFoundation.prototype.setTrailingIconAriaLabel = function (label) {
            if (this.trailingIcon) {
                this.trailingIcon.setAriaLabel(label);
            }
        };
        /**
         * Sets the text content of the trailing icon.
         */
        MDCTextFieldFoundation.prototype.setTrailingIconContent = function (content) {
            if (this.trailingIcon) {
                this.trailingIcon.setContent(content);
            }
        };
        /**
         * Sets character counter values that shows characters used and the total
         * character limit.
         */
        MDCTextFieldFoundation.prototype.setcharacterCounter = function (currentLength) {
            if (!this.characterCounter) {
                return;
            }
            var maxLength = this.getNativeInput().maxLength;
            if (maxLength === -1) {
                throw new Error('MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.');
            }
            this.characterCounter.setCounterValue(currentLength, maxLength);
        };
        /**
         * @return True if the Text Field input fails in converting the user-supplied
         *     value.
         */
        MDCTextFieldFoundation.prototype.isBadInput = function () {
            // The badInput property is not supported in IE 11 💩.
            return this.getNativeInput().validity.badInput || false;
        };
        /**
         * @return The result of native validity checking (ValidityState.valid).
         */
        MDCTextFieldFoundation.prototype.isNativeInputValid = function () {
            return this.getNativeInput().validity.valid;
        };
        /**
         * Styles the component based on the validity state.
         */
        MDCTextFieldFoundation.prototype.styleValidity = function (isValid) {
            var INVALID = MDCTextFieldFoundation.cssClasses.INVALID;
            if (isValid) {
                this.adapter.removeClass(INVALID);
            }
            else {
                this.adapter.addClass(INVALID);
            }
            if (this.helperText) {
                this.helperText.setValidity(isValid);
                // We dynamically set or unset aria-describedby for validation helper text
                // only, based on whether the field is valid
                var helperTextValidation = this.helperText.isValidation();
                if (!helperTextValidation) {
                    return;
                }
                var helperTextVisible = this.helperText.isVisible();
                var helperTextId = this.helperText.getId();
                if (helperTextVisible && helperTextId) {
                    this.adapter.setInputAttr(strings.ARIA_DESCRIBEDBY, helperTextId);
                }
                else {
                    this.adapter.removeInputAttr(strings.ARIA_DESCRIBEDBY);
                }
            }
        };
        /**
         * Styles the component based on the focused state.
         */
        MDCTextFieldFoundation.prototype.styleFocused = function (isFocused) {
            var FOCUSED = MDCTextFieldFoundation.cssClasses.FOCUSED;
            if (isFocused) {
                this.adapter.addClass(FOCUSED);
            }
            else {
                this.adapter.removeClass(FOCUSED);
            }
        };
        /**
         * Styles the component based on the disabled state.
         */
        MDCTextFieldFoundation.prototype.styleDisabled = function (isDisabled) {
            var _a = MDCTextFieldFoundation.cssClasses, DISABLED = _a.DISABLED, INVALID = _a.INVALID;
            if (isDisabled) {
                this.adapter.addClass(DISABLED);
                this.adapter.removeClass(INVALID);
            }
            else {
                this.adapter.removeClass(DISABLED);
            }
            if (this.leadingIcon) {
                this.leadingIcon.setDisabled(isDisabled);
            }
            if (this.trailingIcon) {
                this.trailingIcon.setDisabled(isDisabled);
            }
        };
        /**
         * Styles the component based on the label floating state.
         */
        MDCTextFieldFoundation.prototype.styleFloating = function (isFloating) {
            var LABEL_FLOATING = MDCTextFieldFoundation.cssClasses.LABEL_FLOATING;
            if (isFloating) {
                this.adapter.addClass(LABEL_FLOATING);
            }
            else {
                this.adapter.removeClass(LABEL_FLOATING);
            }
        };
        /**
         * @return The native text input element from the host environment, or an
         *     object with the same shape for unit tests.
         */
        MDCTextFieldFoundation.prototype.getNativeInput = function () {
            // this.adapter may be undefined in foundation unit tests. This happens when
            // testdouble is creating a mock object and invokes the
            // shouldShake/shouldFloat getters (which in turn call getValue(), which
            // calls this method) before init() has been called from the MDCTextField
            // constructor. To work around that issue, we return a dummy object.
            var nativeInput = this.adapter ? this.adapter.getNativeInput() : null;
            return nativeInput || {
                disabled: false,
                maxLength: -1,
                required: false,
                type: 'input',
                validity: {
                    badInput: false,
                    valid: true,
                },
                value: '',
            };
        };
        return MDCTextFieldFoundation;
    }(MDCFoundation));

    /* node_modules\@smui\floating-label\dist\FloatingLabel.svelte generated by Svelte v3.49.0 */

    const file$8 = "node_modules\\@smui\\floating-label\\dist\\FloatingLabel.svelte";

    // (19:0) {:else}
    function create_else_block$2(ctx) {
    	let label;
    	let label_class_value;
    	let label_style_value;
    	let label_for_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	let label_levels = [
    		{
    			class: label_class_value = classMap({
    				[/*className*/ ctx[3]]: true,
    				'mdc-floating-label': true,
    				'mdc-floating-label--float-above': /*floatAbove*/ ctx[0],
    				'mdc-floating-label--required': /*required*/ ctx[1],
    				.../*internalClasses*/ ctx[8]
    			})
    		},
    		{
    			style: label_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func_1$1).concat([/*style*/ ctx[4]]).join(' ')
    		},
    		{
    			for: label_for_value = /*forId*/ ctx[5] || (/*inputProps*/ ctx[11]
    			? /*inputProps*/ ctx[11].id
    			: undefined)
    		},
    		/*$$restProps*/ ctx[12]
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    			add_location(label, file$8, 19, 2, 494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			/*label_binding*/ ctx[24](label);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, label, /*use*/ ctx[2])),
    					action_destroyer(/*forwardEvents*/ ctx[10].call(null, label))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2097152)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(label, label_data = get_spread_update(label_levels, [
    				(!current || dirty & /*className, floatAbove, required, internalClasses*/ 267 && label_class_value !== (label_class_value = classMap({
    					[/*className*/ ctx[3]]: true,
    					'mdc-floating-label': true,
    					'mdc-floating-label--float-above': /*floatAbove*/ ctx[0],
    					'mdc-floating-label--required': /*required*/ ctx[1],
    					.../*internalClasses*/ ctx[8]
    				}))) && { class: label_class_value },
    				(!current || dirty & /*internalStyles, style*/ 528 && label_style_value !== (label_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func_1$1).concat([/*style*/ ctx[4]]).join(' '))) && { style: label_style_value },
    				(!current || dirty & /*forId*/ 32 && label_for_value !== (label_for_value = /*forId*/ ctx[5] || (/*inputProps*/ ctx[11]
    				? /*inputProps*/ ctx[11].id
    				: undefined))) && { for: label_for_value },
    				dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 4) useActions_action.update.call(null, /*use*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
    			/*label_binding*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(19:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1:0) {#if wrapped}
    function create_if_block$3(ctx) {
    	let span;
    	let span_class_value;
    	let span_style_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	let span_levels = [
    		{
    			class: span_class_value = classMap({
    				[/*className*/ ctx[3]]: true,
    				'mdc-floating-label': true,
    				'mdc-floating-label--float-above': /*floatAbove*/ ctx[0],
    				'mdc-floating-label--required': /*required*/ ctx[1],
    				.../*internalClasses*/ ctx[8]
    			})
    		},
    		{
    			style: span_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func$3).concat([/*style*/ ctx[4]]).join(' ')
    		},
    		/*$$restProps*/ ctx[12]
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$8, 1, 2, 16);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[23](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[2])),
    					action_destroyer(/*forwardEvents*/ ctx[10].call(null, span))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2097152)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				(!current || dirty & /*className, floatAbove, required, internalClasses*/ 267 && span_class_value !== (span_class_value = classMap({
    					[/*className*/ ctx[3]]: true,
    					'mdc-floating-label': true,
    					'mdc-floating-label--float-above': /*floatAbove*/ ctx[0],
    					'mdc-floating-label--required': /*required*/ ctx[1],
    					.../*internalClasses*/ ctx[8]
    				}))) && { class: span_class_value },
    				(!current || dirty & /*internalStyles, style*/ 528 && span_style_value !== (span_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func$3).concat([/*style*/ ctx[4]]).join(' '))) && { style: span_style_value },
    				dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 4) useActions_action.update.call(null, /*use*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[23](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(1:0) {#if wrapped}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*wrapped*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$3 = ([name, value]) => `${name}: ${value};`;
    const func_1$1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","for","floatAbove","required","wrapped","shake","float","setRequired","getWidth","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FloatingLabel', slots, ['default']);
    	var _a;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { for: forId = undefined } = $$props;
    	let { floatAbove = false } = $$props;
    	let { required = false } = $$props;
    	let { wrapped = false } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};

    	let inputProps = (_a = getContext('SMUI:generic:input:props')) !== null && _a !== void 0
    	? _a
    	: {};

    	let previousFloatAbove = floatAbove;
    	let previousRequired = required;

    	onMount(() => {
    		$$invalidate(18, instance = new MDCFloatingLabelFoundation({
    				addClass,
    				removeClass,
    				getWidth: () => {
    					var _a, _b;
    					const el = getElement();
    					const clone = el.cloneNode(true);

    					(_a = el.parentNode) === null || _a === void 0
    					? void 0
    					: _a.appendChild(clone);

    					clone.classList.add('smui-floating-label--remove-transition');
    					clone.classList.add('smui-floating-label--force-size');
    					clone.classList.remove('mdc-floating-label--float-above');
    					const scrollWidth = clone.scrollWidth;

    					(_b = el.parentNode) === null || _b === void 0
    					? void 0
    					: _b.removeChild(clone);

    					return scrollWidth;
    				},
    				registerInteractionHandler: (evtType, handler) => getElement().addEventListener(evtType, handler),
    				deregisterInteractionHandler: (evtType, handler) => getElement().removeEventListener(evtType, handler)
    			}));

    		const accessor = {
    			get element() {
    				return getElement();
    			},
    			addStyle,
    			removeStyle
    		};

    		dispatch(element, 'SMUIFloatingLabel:mount', accessor);
    		instance.init();

    		return () => {
    			dispatch(element, 'SMUIFloatingLabel:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(8, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(8, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(9, internalStyles);
    			} else {
    				$$invalidate(9, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function removeStyle(name) {
    		if (name in internalStyles) {
    			delete internalStyles[name];
    			$$invalidate(9, internalStyles);
    		}
    	}

    	function shake(shouldShake) {
    		instance.shake(shouldShake);
    	}

    	function float(shouldFloat) {
    		$$invalidate(0, floatAbove = shouldFloat);
    	}

    	function setRequired(isRequired) {
    		$$invalidate(1, required = isRequired);
    	}

    	function getWidth() {
    		return instance.getWidth();
    	}

    	function getElement() {
    		return element;
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	function label_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(2, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('for' in $$new_props) $$invalidate(5, forId = $$new_props.for);
    		if ('floatAbove' in $$new_props) $$invalidate(0, floatAbove = $$new_props.floatAbove);
    		if ('required' in $$new_props) $$invalidate(1, required = $$new_props.required);
    		if ('wrapped' in $$new_props) $$invalidate(6, wrapped = $$new_props.wrapped);
    		if ('$$scope' in $$new_props) $$invalidate(21, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		MDCFloatingLabelFoundation,
    		onMount,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		dispatch,
    		forwardEvents,
    		use,
    		className,
    		style,
    		forId,
    		floatAbove,
    		required,
    		wrapped,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		inputProps,
    		previousFloatAbove,
    		previousRequired,
    		addClass,
    		removeClass,
    		addStyle,
    		removeStyle,
    		shake,
    		float,
    		setRequired,
    		getWidth,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_a' in $$props) _a = $$new_props._a;
    		if ('use' in $$props) $$invalidate(2, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('forId' in $$props) $$invalidate(5, forId = $$new_props.forId);
    		if ('floatAbove' in $$props) $$invalidate(0, floatAbove = $$new_props.floatAbove);
    		if ('required' in $$props) $$invalidate(1, required = $$new_props.required);
    		if ('wrapped' in $$props) $$invalidate(6, wrapped = $$new_props.wrapped);
    		if ('element' in $$props) $$invalidate(7, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(18, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(8, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(9, internalStyles = $$new_props.internalStyles);
    		if ('inputProps' in $$props) $$invalidate(11, inputProps = $$new_props.inputProps);
    		if ('previousFloatAbove' in $$props) $$invalidate(19, previousFloatAbove = $$new_props.previousFloatAbove);
    		if ('previousRequired' in $$props) $$invalidate(20, previousRequired = $$new_props.previousRequired);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*instance, previousFloatAbove, floatAbove*/ 786433) {
    			if (instance && previousFloatAbove !== floatAbove) {
    				$$invalidate(19, previousFloatAbove = floatAbove);
    				instance.float(floatAbove);
    			}
    		}

    		if ($$self.$$.dirty & /*instance, previousRequired, required*/ 1310722) {
    			if (instance && previousRequired !== required) {
    				$$invalidate(20, previousRequired = required);
    				instance.setRequired(required);
    			}
    		}
    	};

    	return [
    		floatAbove,
    		required,
    		use,
    		className,
    		style,
    		forId,
    		wrapped,
    		element,
    		internalClasses,
    		internalStyles,
    		forwardEvents,
    		inputProps,
    		$$restProps,
    		shake,
    		float,
    		setRequired,
    		getWidth,
    		getElement,
    		instance,
    		previousFloatAbove,
    		previousRequired,
    		$$scope,
    		slots,
    		span_binding,
    		label_binding
    	];
    }

    class FloatingLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$3, create_fragment$9, safe_not_equal, {
    			use: 2,
    			class: 3,
    			style: 4,
    			for: 5,
    			floatAbove: 0,
    			required: 1,
    			wrapped: 6,
    			shake: 13,
    			float: 14,
    			setRequired: 15,
    			getWidth: 16,
    			getElement: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FloatingLabel",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get use() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get for() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set for(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get floatAbove() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set floatAbove(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapped() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapped(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shake() {
    		return this.$$.ctx[13];
    	}

    	set shake(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get float() {
    		return this.$$.ctx[14];
    	}

    	set float(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setRequired() {
    		return this.$$.ctx[15];
    	}

    	set setRequired(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getWidth() {
    		return this.$$.ctx[16];
    	}

    	set getWidth(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[17];
    	}

    	set getElement(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\line-ripple\dist\LineRipple.svelte generated by Svelte v3.49.0 */
    const file$7 = "node_modules\\@smui\\line-ripple\\dist\\LineRipple.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let div_class_value;
    	let div_style_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-line-ripple': true,
    				'mdc-line-ripple--active': /*active*/ ctx[3],
    				.../*internalClasses*/ ctx[5]
    			})
    		},
    		{
    			style: div_style_value = Object.entries(/*internalStyles*/ ctx[6]).map(func$2).concat([/*style*/ ctx[2]]).join(' ')
    		},
    		/*$$restProps*/ ctx[8]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			add_location(div, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[13](div);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*className, active, internalClasses*/ 42 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-line-ripple': true,
    					'mdc-line-ripple--active': /*active*/ ctx[3],
    					.../*internalClasses*/ ctx[5]
    				})) && { class: div_class_value },
    				dirty & /*internalStyles, style*/ 68 && div_style_value !== (div_style_value = Object.entries(/*internalStyles*/ ctx[6]).map(func$2).concat([/*style*/ ctx[2]]).join(' ')) && { style: div_style_value },
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$2 = ([name, value]) => `${name}: ${value};`;

    function instance_1$2($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","active","activate","deactivate","setRippleCenter","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LineRipple', slots, []);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { active = false } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};

    	onMount(() => {
    		instance = new MDCLineRippleFoundation({
    				addClass,
    				removeClass,
    				hasClass,
    				setStyle: addStyle,
    				registerEventHandler: (evtType, handler) => getElement().addEventListener(evtType, handler),
    				deregisterEventHandler: (evtType, handler) => getElement().removeEventListener(evtType, handler)
    			});

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(5, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(5, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(6, internalStyles);
    			} else {
    				$$invalidate(6, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function activate() {
    		instance.activate();
    	}

    	function deactivate() {
    		instance.deactivate();
    	}

    	function setRippleCenter(xCoordinate) {
    		instance.setRippleCenter(xCoordinate);
    	}

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(4, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('active' in $$new_props) $$invalidate(3, active = $$new_props.active);
    	};

    	$$self.$capture_state = () => ({
    		MDCLineRippleFoundation,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		style,
    		active,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		activate,
    		deactivate,
    		setRippleCenter,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('active' in $$props) $$invalidate(3, active = $$new_props.active);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    		if ('instance' in $$props) instance = $$new_props.instance;
    		if ('internalClasses' in $$props) $$invalidate(5, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(6, internalStyles = $$new_props.internalStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		style,
    		active,
    		element,
    		internalClasses,
    		internalStyles,
    		forwardEvents,
    		$$restProps,
    		activate,
    		deactivate,
    		setRippleCenter,
    		getElement,
    		div_binding
    	];
    }

    class LineRipple extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$2, create_fragment$8, safe_not_equal, {
    			use: 0,
    			class: 1,
    			style: 2,
    			active: 3,
    			activate: 9,
    			deactivate: 10,
    			setRippleCenter: 11,
    			getElement: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LineRipple",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get use() {
    		throw new Error("<LineRipple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<LineRipple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<LineRipple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<LineRipple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activate() {
    		return this.$$.ctx[9];
    	}

    	set activate(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		return this.$$.ctx[10];
    	}

    	set deactivate(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setRippleCenter() {
    		return this.$$.ctx[11];
    	}

    	set setRippleCenter(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[12];
    	}

    	set getElement(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\notched-outline\dist\NotchedOutline.svelte generated by Svelte v3.49.0 */
    const file$6 = "node_modules\\@smui\\notched-outline\\dist\\NotchedOutline.svelte";

    // (17:2) {#if !noLabel}
    function create_if_block$2(ctx) {
    	let div;
    	let div_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "mdc-notched-outline__notch");
    			attr_dev(div, "style", div_style_value = Object.entries(/*notchStyles*/ ctx[7]).map(func$1).join(' '));
    			add_location(div, file$6, 17, 4, 496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*notchStyles*/ 128 && div_style_value !== (div_style_value = Object.entries(/*notchStyles*/ ctx[7]).map(func$1).join(' '))) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(17:2) {#if !noLabel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let div2_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = !/*noLabel*/ ctx[3] && create_if_block$2(ctx);

    	let div2_levels = [
    		{
    			class: div2_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-notched-outline': true,
    				'mdc-notched-outline--notched': /*notched*/ ctx[2],
    				'mdc-notched-outline--no-label': /*noLabel*/ ctx[3],
    				.../*internalClasses*/ ctx[6]
    			})
    		},
    		/*$$restProps*/ ctx[9]
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "mdc-notched-outline__leading");
    			add_location(div0, file$6, 15, 2, 430);
    			attr_dev(div1, "class", "mdc-notched-outline__trailing");
    			add_location(div1, file$6, 26, 2, 699);
    			set_attributes(div2, div2_data);
    			add_location(div2, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			/*div2_binding*/ ctx[15](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div2, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[8].call(null, div2)),
    					listen_dev(div2, "SMUIFloatingLabel:mount", /*SMUIFloatingLabel_mount_handler*/ ctx[16], false, false, false),
    					listen_dev(div2, "SMUIFloatingLabel:unmount", /*SMUIFloatingLabel_unmount_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*noLabel*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*noLabel*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				(!current || dirty & /*className, notched, noLabel, internalClasses*/ 78 && div2_class_value !== (div2_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-notched-outline': true,
    					'mdc-notched-outline--notched': /*notched*/ ctx[2],
    					'mdc-notched-outline--no-label': /*noLabel*/ ctx[3],
    					.../*internalClasses*/ ctx[6]
    				}))) && { class: div2_class_value },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			/*div2_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$1($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","notched","noLabel","notch","closeNotch","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotchedOutline', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { notched = false } = $$props;
    	let { noLabel = false } = $$props;
    	let element;
    	let instance;
    	let floatingLabel;
    	let internalClasses = {};
    	let notchStyles = {};

    	onMount(() => {
    		instance = new MDCNotchedOutlineFoundation({
    				addClass,
    				removeClass,
    				setNotchWidthProperty: width => addNotchStyle('width', width + 'px'),
    				removeNotchWidthProperty: () => removeNotchStyle('width')
    			});

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(6, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(6, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addNotchStyle(name, value) {
    		if (notchStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete notchStyles[name];
    				$$invalidate(7, notchStyles);
    			} else {
    				$$invalidate(7, notchStyles[name] = value, notchStyles);
    			}
    		}
    	}

    	function removeNotchStyle(name) {
    		if (name in notchStyles) {
    			delete notchStyles[name];
    			$$invalidate(7, notchStyles);
    		}
    	}

    	function notch(notchWidth) {
    		instance.notch(notchWidth);
    	}

    	function closeNotch() {
    		instance.closeNotch();
    	}

    	function getElement() {
    		return element;
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	const SMUIFloatingLabel_mount_handler = event => $$invalidate(4, floatingLabel = event.detail);
    	const SMUIFloatingLabel_unmount_handler = () => $$invalidate(4, floatingLabel = undefined);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('notched' in $$new_props) $$invalidate(2, notched = $$new_props.notched);
    		if ('noLabel' in $$new_props) $$invalidate(3, noLabel = $$new_props.noLabel);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCNotchedOutlineFoundation,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		notched,
    		noLabel,
    		element,
    		instance,
    		floatingLabel,
    		internalClasses,
    		notchStyles,
    		addClass,
    		removeClass,
    		addNotchStyle,
    		removeNotchStyle,
    		notch,
    		closeNotch,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('notched' in $$props) $$invalidate(2, notched = $$new_props.notched);
    		if ('noLabel' in $$props) $$invalidate(3, noLabel = $$new_props.noLabel);
    		if ('element' in $$props) $$invalidate(5, element = $$new_props.element);
    		if ('instance' in $$props) instance = $$new_props.instance;
    		if ('floatingLabel' in $$props) $$invalidate(4, floatingLabel = $$new_props.floatingLabel);
    		if ('internalClasses' in $$props) $$invalidate(6, internalClasses = $$new_props.internalClasses);
    		if ('notchStyles' in $$props) $$invalidate(7, notchStyles = $$new_props.notchStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*floatingLabel*/ 16) {
    			if (floatingLabel) {
    				floatingLabel.addStyle('transition-duration', '0s');
    				addClass('mdc-notched-outline--upgraded');

    				requestAnimationFrame(() => {
    					if (floatingLabel) {
    						floatingLabel.removeStyle('transition-duration');
    					}
    				});
    			} else {
    				removeClass('mdc-notched-outline--upgraded');
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		notched,
    		noLabel,
    		floatingLabel,
    		element,
    		internalClasses,
    		notchStyles,
    		forwardEvents,
    		$$restProps,
    		notch,
    		closeNotch,
    		getElement,
    		$$scope,
    		slots,
    		div2_binding,
    		SMUIFloatingLabel_mount_handler,
    		SMUIFloatingLabel_unmount_handler
    	];
    }

    class NotchedOutline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$1, create_fragment$7, safe_not_equal, {
    			use: 0,
    			class: 1,
    			notched: 2,
    			noLabel: 3,
    			notch: 10,
    			closeNotch: 11,
    			getElement: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotchedOutline",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get use() {
    		throw new Error("<NotchedOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<NotchedOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notched() {
    		throw new Error("<NotchedOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notched(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noLabel() {
    		throw new Error("<NotchedOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noLabel(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notch() {
    		return this.$$.ctx[10];
    	}

    	set notch(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeNotch() {
    		return this.$$.ctx[11];
    	}

    	set closeNotch(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[12];
    	}

    	set getElement(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\classadder\ClassAdder.svelte generated by Svelte v3.49.0 */

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>
    function create_default_slot$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				[/*smuiClass*/ ctx[5]]: true,
    				.../*smuiClassMap*/ ctx[4]
    			})
    		},
    		/*props*/ ctx[6],
    		/*$$restProps*/ ctx[8]
    	];

    	var switch_value = /*component*/ ctx[2];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$3] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[11](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*forwardEvents, use, classMap, className, smuiClass, smuiClassMap, props, $$restProps*/ 499)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*forwardEvents, use*/ 129 && {
    						use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
    					},
    					dirty & /*classMap, className, smuiClass, smuiClassMap*/ 50 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							[/*smuiClass*/ ctx[5]]: true,
    							.../*smuiClassMap*/ ctx[4]
    						})
    					},
    					dirty & /*props*/ 64 && get_spread_object(/*props*/ ctx[6]),
    					dirty & /*$$restProps*/ 256 && get_spread_object(/*$$restProps*/ ctx[8])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 4096) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[11](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[11](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const internals = {
    	component: Div$1,
    	class: '',
    	classMap: {},
    	contexts: {},
    	props: {}
    };

    function instance$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","component","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClassAdder', slots, ['default']);
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;
    	const smuiClass = internals.class;
    	const smuiClassMap = {};
    	const smuiClassUnsubscribes = [];
    	const contexts = internals.contexts;
    	const props = internals.props;
    	let { component = internals.component } = $$props;

    	Object.entries(internals.classMap).forEach(([name, context]) => {
    		const store = getContext(context);

    		if (store && 'subscribe' in store) {
    			smuiClassUnsubscribes.push(store.subscribe(value => {
    				$$invalidate(4, smuiClassMap[name] = value, smuiClassMap);
    			}));
    		}
    	});

    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	for (let context in contexts) {
    		if (contexts.hasOwnProperty(context)) {
    			setContext(context, contexts[context]);
    		}
    	}

    	onDestroy(() => {
    		for (const unsubscribe of smuiClassUnsubscribes) {
    			unsubscribe();
    		}
    	});

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(3, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('component' in $$new_props) $$invalidate(2, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Div: Div$1,
    		internals,
    		onDestroy,
    		getContext,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		use,
    		className,
    		element,
    		smuiClass,
    		smuiClassMap,
    		smuiClassUnsubscribes,
    		contexts,
    		props,
    		component,
    		forwardEvents,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(3, element = $$new_props.element);
    		if ('component' in $$props) $$invalidate(2, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		component,
    		element,
    		smuiClassMap,
    		smuiClass,
    		props,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class ClassAdder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$6, safe_not_equal, {
    			use: 0,
    			class: 1,
    			component: 2,
    			getElement: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClassAdder",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get use() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[9];
    	}

    	set getElement(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // @ts-ignore: Internals is exported... argh.
    const defaults = Object.assign({}, internals);
    function classAdderBuilder(props) {
        return new Proxy(ClassAdder, {
            construct: function (target, args) {
                Object.assign(internals, defaults, props);
                // @ts-ignore: Need spread arg.
                return new target(...args);
            },
            get: function (target, prop) {
                Object.assign(internals, defaults, props);
                return target[prop];
            },
        });
    }

    var HelperLine = classAdderBuilder({
        class: 'mdc-text-field-helper-line',
        component: Div,
    });

    var Prefix = classAdderBuilder({
        class: 'mdc-text-field__affix mdc-text-field__affix--prefix',
        component: Span,
    });

    var Suffix = classAdderBuilder({
        class: 'mdc-text-field__affix mdc-text-field__affix--suffix',
        component: Span,
    });

    /* node_modules\@smui\textfield\dist\Input.svelte generated by Svelte v3.49.0 */
    const file$5 = "node_modules\\@smui\\textfield\\dist\\Input.svelte";

    function create_fragment$5(ctx) {
    	let input;
    	let input_class_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{
    			class: input_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-text-field__input': true
    			})
    		},
    		{ type: /*type*/ ctx[2] },
    		{ placeholder: /*placeholder*/ ctx[3] },
    		/*valueProp*/ ctx[4],
    		/*internalAttrs*/ ctx[6],
    		/*$$restProps*/ ctx[10]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[26](input);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, input, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, input)),
    					listen_dev(input, "input", /*input_handler*/ ctx[27], false, false, false),
    					listen_dev(input, "change", /*changeHandler*/ ctx[9], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[24], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[25], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty & /*className*/ 2 && input_class_value !== (input_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-text-field__input': true
    				})) && { class: input_class_value },
    				dirty & /*type*/ 4 && { type: /*type*/ ctx[2] },
    				dirty & /*placeholder*/ 8 && { placeholder: /*placeholder*/ ctx[3] },
    				dirty & /*valueProp*/ 16 && /*valueProp*/ ctx[4],
    				dirty & /*internalAttrs*/ 64 && /*internalAttrs*/ ctx[6],
    				dirty & /*$$restProps*/ 1024 && /*$$restProps*/ ctx[10]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[26](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function toNumber(value) {
    	if (value === '') {
    		const nan = new Number(Number.NaN);
    		nan.length = 0;
    		return nan;
    	}

    	return +value;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","type","placeholder","value","files","dirty","invalid","updateInvalid","emptyValueNull","emptyValueUndefined","getAttr","addAttr","removeAttr","focus","blur","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { type = 'text' } = $$props;
    	let { placeholder = ' ' } = $$props;
    	let { value = uninitializedValue } = $$props;
    	const valueUninitialized = isUninitializedValue(value);

    	if (valueUninitialized) {
    		value = '';
    	}

    	let { files = null } = $$props;
    	let { dirty = false } = $$props;
    	let { invalid = false } = $$props;
    	let { updateInvalid = true } = $$props;
    	let { emptyValueNull = value === null } = $$props;

    	if (valueUninitialized && emptyValueNull) {
    		value = null;
    	}

    	let { emptyValueUndefined = value === undefined } = $$props;

    	if (valueUninitialized && emptyValueUndefined) {
    		value = undefined;
    	}

    	let element;
    	let internalAttrs = {};
    	let valueProp = {};

    	onMount(() => {
    		if (updateInvalid) {
    			$$invalidate(14, invalid = element.matches(':invalid'));
    		}
    	});

    	function valueUpdater(e) {
    		if (type === 'file') {
    			$$invalidate(12, files = e.currentTarget.files);
    			return;
    		}

    		if (e.currentTarget.value === '' && emptyValueNull) {
    			$$invalidate(11, value = null);
    			return;
    		}

    		if (e.currentTarget.value === '' && emptyValueUndefined) {
    			$$invalidate(11, value = undefined);
    			return;
    		}

    		switch (type) {
    			case 'number':
    			case 'range':
    				$$invalidate(11, value = toNumber(e.currentTarget.value));
    				break;
    			default:
    				$$invalidate(11, value = e.currentTarget.value);
    				break;
    		}
    	}

    	function changeHandler(e) {
    		if (type === 'file' || type === 'range') {
    			valueUpdater(e);
    		}

    		$$invalidate(13, dirty = true);

    		if (updateInvalid) {
    			$$invalidate(14, invalid = element.matches(':invalid'));
    		}
    	}

    	function getAttr(name) {
    		var _a;

    		return name in internalAttrs
    		? (_a = internalAttrs[name]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().getAttribute(name);
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(6, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function removeAttr(name) {
    		if (!(name in internalAttrs) || internalAttrs[name] != null) {
    			$$invalidate(6, internalAttrs[name] = undefined, internalAttrs);
    		}
    	}

    	function focus() {
    		getElement().focus();
    	}

    	function blur() {
    		getElement().blur();
    	}

    	function getElement() {
    		return element;
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	const input_handler = e => type !== 'file' && valueUpdater(e);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('type' in $$new_props) $$invalidate(2, type = $$new_props.type);
    		if ('placeholder' in $$new_props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('value' in $$new_props) $$invalidate(11, value = $$new_props.value);
    		if ('files' in $$new_props) $$invalidate(12, files = $$new_props.files);
    		if ('dirty' in $$new_props) $$invalidate(13, dirty = $$new_props.dirty);
    		if ('invalid' in $$new_props) $$invalidate(14, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$new_props) $$invalidate(15, updateInvalid = $$new_props.updateInvalid);
    		if ('emptyValueNull' in $$new_props) $$invalidate(16, emptyValueNull = $$new_props.emptyValueNull);
    		if ('emptyValueUndefined' in $$new_props) $$invalidate(17, emptyValueUndefined = $$new_props.emptyValueUndefined);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		type,
    		placeholder,
    		value,
    		valueUninitialized,
    		files,
    		dirty,
    		invalid,
    		updateInvalid,
    		emptyValueNull,
    		emptyValueUndefined,
    		element,
    		internalAttrs,
    		valueProp,
    		toNumber,
    		valueUpdater,
    		changeHandler,
    		getAttr,
    		addAttr,
    		removeAttr,
    		focus,
    		blur,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('type' in $$props) $$invalidate(2, type = $$new_props.type);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('value' in $$props) $$invalidate(11, value = $$new_props.value);
    		if ('files' in $$props) $$invalidate(12, files = $$new_props.files);
    		if ('dirty' in $$props) $$invalidate(13, dirty = $$new_props.dirty);
    		if ('invalid' in $$props) $$invalidate(14, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$props) $$invalidate(15, updateInvalid = $$new_props.updateInvalid);
    		if ('emptyValueNull' in $$props) $$invalidate(16, emptyValueNull = $$new_props.emptyValueNull);
    		if ('emptyValueUndefined' in $$props) $$invalidate(17, emptyValueUndefined = $$new_props.emptyValueUndefined);
    		if ('element' in $$props) $$invalidate(5, element = $$new_props.element);
    		if ('internalAttrs' in $$props) $$invalidate(6, internalAttrs = $$new_props.internalAttrs);
    		if ('valueProp' in $$props) $$invalidate(4, valueProp = $$new_props.valueProp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*type, valueProp, value*/ 2068) {
    			if (type === 'file') {
    				delete valueProp.value;
    				(($$invalidate(4, valueProp), $$invalidate(2, type)), $$invalidate(11, value));
    			} else {
    				$$invalidate(4, valueProp.value = value == null ? '' : value, valueProp);
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		type,
    		placeholder,
    		valueProp,
    		element,
    		internalAttrs,
    		forwardEvents,
    		valueUpdater,
    		changeHandler,
    		$$restProps,
    		value,
    		files,
    		dirty,
    		invalid,
    		updateInvalid,
    		emptyValueNull,
    		emptyValueUndefined,
    		getAttr,
    		addAttr,
    		removeAttr,
    		focus,
    		blur,
    		getElement,
    		blur_handler,
    		focus_handler,
    		input_binding,
    		input_handler
    	];
    }

    class Input$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$5, safe_not_equal, {
    			use: 0,
    			class: 1,
    			type: 2,
    			placeholder: 3,
    			value: 11,
    			files: 12,
    			dirty: 13,
    			invalid: 14,
    			updateInvalid: 15,
    			emptyValueNull: 16,
    			emptyValueUndefined: 17,
    			getAttr: 18,
    			addAttr: 19,
    			removeAttr: 20,
    			focus: 21,
    			blur: 22,
    			getElement: 23
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get use() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dirty() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dirty(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateInvalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateInvalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emptyValueNull() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emptyValueNull(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emptyValueUndefined() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emptyValueUndefined(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getAttr() {
    		return this.$$.ctx[18];
    	}

    	set getAttr(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addAttr() {
    		return this.$$.ctx[19];
    	}

    	set addAttr(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeAttr() {
    		return this.$$.ctx[20];
    	}

    	set removeAttr(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[21];
    	}

    	set focus(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[22];
    	}

    	set blur(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[23];
    	}

    	set getElement(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\textfield\dist\Textarea.svelte generated by Svelte v3.49.0 */
    const file$4 = "node_modules\\@smui\\textfield\\dist\\Textarea.svelte";

    function create_fragment$4(ctx) {
    	let textarea;
    	let textarea_class_value;
    	let textarea_style_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		{
    			class: textarea_class_value = classMap({
    				[/*className*/ ctx[2]]: true,
    				'mdc-text-field__input': true
    			})
    		},
    		{
    			style: textarea_style_value = `${/*resizable*/ ctx[4] ? '' : 'resize: none; '}${/*style*/ ctx[3]}`
    		},
    		/*internalAttrs*/ ctx[6],
    		/*$$restProps*/ ctx[9]
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			if (textarea.autofocus) textarea.focus();
    			/*textarea_binding*/ ctx[21](textarea);
    			set_input_value(textarea, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, textarea, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, textarea)),
    					listen_dev(textarea, "change", /*changeHandler*/ ctx[8], false, false, false),
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[19], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler*/ ctx[20], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[22])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty & /*className*/ 4 && textarea_class_value !== (textarea_class_value = classMap({
    					[/*className*/ ctx[2]]: true,
    					'mdc-text-field__input': true
    				})) && { class: textarea_class_value },
    				dirty & /*resizable, style*/ 24 && textarea_style_value !== (textarea_style_value = `${/*resizable*/ ctx[4] ? '' : 'resize: none; '}${/*style*/ ctx[3]}`) && { style: textarea_style_value },
    				dirty & /*internalAttrs*/ 64 && /*internalAttrs*/ ctx[6],
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);

    			if (dirty & /*value*/ 1) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			/*textarea_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","value","dirty","invalid","updateInvalid","resizable","getAttr","addAttr","removeAttr","focus","blur","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Textarea', slots, []);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;
    	let { dirty = false } = $$props;
    	let { invalid = false } = $$props;
    	let { updateInvalid = true } = $$props;
    	let { resizable = true } = $$props;
    	let element;
    	let internalAttrs = {};

    	onMount(() => {
    		if (updateInvalid) {
    			$$invalidate(11, invalid = element.matches(':invalid'));
    		}
    	});

    	function changeHandler() {
    		$$invalidate(10, dirty = true);

    		if (updateInvalid) {
    			$$invalidate(11, invalid = element.matches(':invalid'));
    		}
    	}

    	function getAttr(name) {
    		var _a;

    		return name in internalAttrs
    		? (_a = internalAttrs[name]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().getAttribute(name);
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(6, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function removeAttr(name) {
    		if (!(name in internalAttrs) || internalAttrs[name] != null) {
    			$$invalidate(6, internalAttrs[name] = undefined, internalAttrs);
    		}
    	}

    	function focus() {
    		getElement().focus();
    	}

    	function blur() {
    		getElement().blur();
    	}

    	function getElement() {
    		return element;
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('dirty' in $$new_props) $$invalidate(10, dirty = $$new_props.dirty);
    		if ('invalid' in $$new_props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$new_props) $$invalidate(12, updateInvalid = $$new_props.updateInvalid);
    		if ('resizable' in $$new_props) $$invalidate(4, resizable = $$new_props.resizable);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		style,
    		value,
    		dirty,
    		invalid,
    		updateInvalid,
    		resizable,
    		element,
    		internalAttrs,
    		changeHandler,
    		getAttr,
    		addAttr,
    		removeAttr,
    		focus,
    		blur,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('dirty' in $$props) $$invalidate(10, dirty = $$new_props.dirty);
    		if ('invalid' in $$props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$props) $$invalidate(12, updateInvalid = $$new_props.updateInvalid);
    		if ('resizable' in $$props) $$invalidate(4, resizable = $$new_props.resizable);
    		if ('element' in $$props) $$invalidate(5, element = $$new_props.element);
    		if ('internalAttrs' in $$props) $$invalidate(6, internalAttrs = $$new_props.internalAttrs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		use,
    		className,
    		style,
    		resizable,
    		element,
    		internalAttrs,
    		forwardEvents,
    		changeHandler,
    		$$restProps,
    		dirty,
    		invalid,
    		updateInvalid,
    		getAttr,
    		addAttr,
    		removeAttr,
    		focus,
    		blur,
    		getElement,
    		blur_handler,
    		focus_handler,
    		textarea_binding,
    		textarea_input_handler
    	];
    }

    class Textarea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$4, safe_not_equal, {
    			use: 1,
    			class: 2,
    			style: 3,
    			value: 0,
    			dirty: 10,
    			invalid: 11,
    			updateInvalid: 12,
    			resizable: 4,
    			getAttr: 13,
    			addAttr: 14,
    			removeAttr: 15,
    			focus: 16,
    			blur: 17,
    			getElement: 18
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Textarea",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get use() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dirty() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dirty(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateInvalid() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateInvalid(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resizable() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resizable(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getAttr() {
    		return this.$$.ctx[13];
    	}

    	set getAttr(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addAttr() {
    		return this.$$.ctx[14];
    	}

    	set addAttr(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeAttr() {
    		return this.$$.ctx[15];
    	}

    	set removeAttr(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[16];
    	}

    	set focus(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[17];
    	}

    	set blur(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[18];
    	}

    	set getElement(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\textfield\dist\Textfield.svelte generated by Svelte v3.49.0 */

    const { Error: Error_1 } = globals;
    const file$3 = "node_modules\\@smui\\textfield\\dist\\Textfield.svelte";
    const get_helper_slot_changes = dirty => ({});
    const get_helper_slot_context = ctx => ({});
    const get_ripple_slot_changes = dirty => ({});
    const get_ripple_slot_context = ctx => ({});
    const get_trailingIcon_slot_changes_1 = dirty => ({});
    const get_trailingIcon_slot_context_1 = ctx => ({});
    const get_leadingIcon_slot_changes_1 = dirty => ({});
    const get_leadingIcon_slot_context_1 = ctx => ({});
    const get_label_slot_changes_2 = dirty => ({});
    const get_label_slot_context_2 = ctx => ({});
    const get_trailingIcon_slot_changes = dirty => ({});
    const get_trailingIcon_slot_context = ctx => ({});
    const get_suffix_slot_changes = dirty => ({});
    const get_suffix_slot_context = ctx => ({});
    const get_prefix_slot_changes = dirty => ({});
    const get_prefix_slot_context = ctx => ({});
    const get_internalCounter_slot_changes = dirty => ({});
    const get_internalCounter_slot_context = ctx => ({});
    const get_leadingIcon_slot_changes = dirty => ({});
    const get_leadingIcon_slot_context = ctx => ({});
    const get_label_slot_changes_1 = dirty => ({});
    const get_label_slot_context_1 = ctx => ({});
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (163:0) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let t0;
    	let contextfragment0;
    	let t1;
    	let t2;
    	let contextfragment1;
    	let t3;
    	let div_class_value;
    	let div_style_value;
    	let Ripple_action;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const label_slot_template = /*#slots*/ ctx[51].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[90], get_label_slot_context_2);

    	contextfragment0 = new ContextFragment({
    			props: {
    				key: "SMUI:textfield:icon:leading",
    				value: true,
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[51].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[90], null);

    	contextfragment1 = new ContextFragment({
    			props: {
    				key: "SMUI:textfield:icon:leading",
    				value: false,
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const ripple_slot_template = /*#slots*/ ctx[51].ripple;
    	const ripple_slot = create_slot(ripple_slot_template, ctx, /*$$scope*/ ctx[90], get_ripple_slot_context);

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[9]]: true,
    				'mdc-text-field': true,
    				'mdc-text-field--disabled': /*disabled*/ ctx[12],
    				'mdc-text-field--textarea': /*textarea*/ ctx[14],
    				'mdc-text-field--filled': /*variant*/ ctx[15] === 'filled',
    				'mdc-text-field--outlined': /*variant*/ ctx[15] === 'outlined',
    				'smui-text-field--standard': /*variant*/ ctx[15] === 'standard' && !/*textarea*/ ctx[14],
    				'mdc-text-field--no-label': /*noLabel*/ ctx[16] || !/*$$slots*/ ctx[42].label,
    				'mdc-text-field--with-leading-icon': /*$$slots*/ ctx[42].leadingIcon,
    				'mdc-text-field--with-trailing-icon': /*$$slots*/ ctx[42].trailingIcon,
    				'mdc-text-field--invalid': /*invalid*/ ctx[1],
    				.../*internalClasses*/ ctx[25]
    			})
    		},
    		{
    			style: div_style_value = Object.entries(/*internalStyles*/ ctx[26]).map(func_1).concat([/*style*/ ctx[10]]).join(' ')
    		},
    		exclude(/*$$restProps*/ ctx[41], ['input$', 'label$', 'ripple$', 'outline$', 'helperLine$'])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (label_slot) label_slot.c();
    			t0 = space();
    			create_component(contextfragment0.$$.fragment);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			create_component(contextfragment1.$$.fragment);
    			t3 = space();
    			if (ripple_slot) ripple_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$3, 163, 2, 5417);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (label_slot) {
    				label_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			mount_component(contextfragment0, div, null);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t2);
    			mount_component(contextfragment1, div, null);
    			append_dev(div, t3);

    			if (ripple_slot) {
    				ripple_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[80](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple_action = Ripple.call(null, div, {
    						ripple: /*ripple*/ ctx[11],
    						unbounded: false,
    						addClass: /*addClass*/ ctx[38],
    						removeClass: /*removeClass*/ ctx[39],
    						addStyle: /*addStyle*/ ctx[40]
    					})),
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[8])),
    					action_destroyer(/*forwardEvents*/ ctx[34].call(null, div)),
    					listen_dev(div, "SMUITextfieldLeadingIcon:mount", /*SMUITextfieldLeadingIcon_mount_handler_1*/ ctx[81], false, false, false),
    					listen_dev(div, "SMUITextfieldLeadingIcon:unmount", /*SMUITextfieldLeadingIcon_unmount_handler_1*/ ctx[82], false, false, false),
    					listen_dev(div, "SMUITextfieldTrailingIcon:mount", /*SMUITextfieldTrailingIcon_mount_handler_1*/ ctx[83], false, false, false),
    					listen_dev(div, "SMUITextfieldTrailingIcon:unmount", /*SMUITextfieldTrailingIcon_unmount_handler_1*/ ctx[84], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[90], dirty, get_label_slot_changes_2),
    						get_label_slot_context_2
    					);
    				}
    			}

    			const contextfragment0_changes = {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				contextfragment0_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment0.$set(contextfragment0_changes);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[90], dirty, null),
    						null
    					);
    				}
    			}

    			const contextfragment1_changes = {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				contextfragment1_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment1.$set(contextfragment1_changes);

    			if (ripple_slot) {
    				if (ripple_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						ripple_slot,
    						ripple_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(ripple_slot_template, /*$$scope*/ ctx[90], dirty, get_ripple_slot_changes),
    						get_ripple_slot_context
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className, disabled, textarea, variant, noLabel, invalid, internalClasses*/ 33673730 | dirty[1] & /*$$slots*/ 2048 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[9]]: true,
    					'mdc-text-field': true,
    					'mdc-text-field--disabled': /*disabled*/ ctx[12],
    					'mdc-text-field--textarea': /*textarea*/ ctx[14],
    					'mdc-text-field--filled': /*variant*/ ctx[15] === 'filled',
    					'mdc-text-field--outlined': /*variant*/ ctx[15] === 'outlined',
    					'smui-text-field--standard': /*variant*/ ctx[15] === 'standard' && !/*textarea*/ ctx[14],
    					'mdc-text-field--no-label': /*noLabel*/ ctx[16] || !/*$$slots*/ ctx[42].label,
    					'mdc-text-field--with-leading-icon': /*$$slots*/ ctx[42].leadingIcon,
    					'mdc-text-field--with-trailing-icon': /*$$slots*/ ctx[42].trailingIcon,
    					'mdc-text-field--invalid': /*invalid*/ ctx[1],
    					.../*internalClasses*/ ctx[25]
    				}))) && { class: div_class_value },
    				(!current || dirty[0] & /*internalStyles, style*/ 67109888 && div_style_value !== (div_style_value = Object.entries(/*internalStyles*/ ctx[26]).map(func_1).concat([/*style*/ ctx[10]]).join(' '))) && { style: div_style_value },
    				dirty[1] & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[41], ['input$', 'label$', 'ripple$', 'outline$', 'helperLine$'])
    			]));

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*ripple*/ 2048) Ripple_action.update.call(null, {
    				ripple: /*ripple*/ ctx[11],
    				unbounded: false,
    				addClass: /*addClass*/ ctx[38],
    				removeClass: /*removeClass*/ ctx[39],
    				addStyle: /*addStyle*/ ctx[40]
    			});

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 256) useActions_action.update.call(null, /*use*/ ctx[8]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot, local);
    			transition_in(contextfragment0.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(contextfragment1.$$.fragment, local);
    			transition_in(ripple_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot, local);
    			transition_out(contextfragment0.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(contextfragment1.$$.fragment, local);
    			transition_out(ripple_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (label_slot) label_slot.d(detaching);
    			destroy_component(contextfragment0);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(contextfragment1);
    			if (ripple_slot) ripple_slot.d(detaching);
    			/*div_binding*/ ctx[80](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(163:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1:0) {#if valued}
    function create_if_block_1(ctx) {
    	let label_1;
    	let t0;
    	let t1;
    	let contextfragment0;
    	let t2;
    	let t3;
    	let current_block_type_index;
    	let if_block2;
    	let t4;
    	let contextfragment1;
    	let t5;
    	let label_1_class_value;
    	let label_1_style_value;
    	let Ripple_action;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*textarea*/ ctx[14] && /*variant*/ ctx[15] !== 'outlined' && create_if_block_8(ctx);
    	let if_block1 = (/*textarea*/ ctx[14] || /*variant*/ ctx[15] === 'outlined') && create_if_block_6(ctx);

    	contextfragment0 = new ContextFragment({
    			props: {
    				key: "SMUI:textfield:icon:leading",
    				value: true,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[51].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[90], null);
    	const if_block_creators = [create_if_block_3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*textarea*/ ctx[14] && typeof /*value*/ ctx[0] === 'string') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	contextfragment1 = new ContextFragment({
    			props: {
    				key: "SMUI:textfield:icon:leading",
    				value: false,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block3 = !/*textarea*/ ctx[14] && /*variant*/ ctx[15] !== 'outlined' && /*ripple*/ ctx[11] && create_if_block_2(ctx);

    	let label_1_levels = [
    		{
    			class: label_1_class_value = classMap({
    				[/*className*/ ctx[9]]: true,
    				'mdc-text-field': true,
    				'mdc-text-field--disabled': /*disabled*/ ctx[12],
    				'mdc-text-field--textarea': /*textarea*/ ctx[14],
    				'mdc-text-field--filled': /*variant*/ ctx[15] === 'filled',
    				'mdc-text-field--outlined': /*variant*/ ctx[15] === 'outlined',
    				'smui-text-field--standard': /*variant*/ ctx[15] === 'standard' && !/*textarea*/ ctx[14],
    				'mdc-text-field--no-label': /*noLabel*/ ctx[16] || /*label*/ ctx[17] == null && !/*$$slots*/ ctx[42].label,
    				'mdc-text-field--label-floating': /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== '',
    				'mdc-text-field--with-leading-icon': /*isUninitializedValue*/ ctx[35](/*withLeadingIcon*/ ctx[22])
    				? /*$$slots*/ ctx[42].leadingIcon
    				: /*withLeadingIcon*/ ctx[22],
    				'mdc-text-field--with-trailing-icon': /*isUninitializedValue*/ ctx[35](/*withTrailingIcon*/ ctx[23])
    				? /*$$slots*/ ctx[42].trailingIcon
    				: /*withTrailingIcon*/ ctx[23],
    				'mdc-text-field--with-internal-counter': /*textarea*/ ctx[14] && /*$$slots*/ ctx[42].internalCounter,
    				'mdc-text-field--invalid': /*invalid*/ ctx[1],
    				.../*internalClasses*/ ctx[25]
    			})
    		},
    		{
    			style: label_1_style_value = Object.entries(/*internalStyles*/ ctx[26]).map(func).concat([/*style*/ ctx[10]]).join(' ')
    		},
    		{
    			for: /* suppress a11y warning, since this is wrapped */ undefined
    		},
    		exclude(/*$$restProps*/ ctx[41], ['input$', 'label$', 'ripple$', 'outline$', 'helperLine$'])
    	];

    	let label_1_data = {};

    	for (let i = 0; i < label_1_levels.length; i += 1) {
    		label_1_data = assign(label_1_data, label_1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			create_component(contextfragment0.$$.fragment);
    			t2 = space();
    			if (default_slot) default_slot.c();
    			t3 = space();
    			if_block2.c();
    			t4 = space();
    			create_component(contextfragment1.$$.fragment);
    			t5 = space();
    			if (if_block3) if_block3.c();
    			set_attributes(label_1, label_1_data);
    			add_location(label_1, file$3, 1, 2, 15);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			if (if_block0) if_block0.m(label_1, null);
    			append_dev(label_1, t0);
    			if (if_block1) if_block1.m(label_1, null);
    			append_dev(label_1, t1);
    			mount_component(contextfragment0, label_1, null);
    			append_dev(label_1, t2);

    			if (default_slot) {
    				default_slot.m(label_1, null);
    			}

    			append_dev(label_1, t3);
    			if_blocks[current_block_type_index].m(label_1, null);
    			append_dev(label_1, t4);
    			mount_component(contextfragment1, label_1, null);
    			append_dev(label_1, t5);
    			if (if_block3) if_block3.m(label_1, null);
    			/*label_1_binding*/ ctx[73](label_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple_action = Ripple.call(null, label_1, {
    						ripple: !/*textarea*/ ctx[14] && /*variant*/ ctx[15] === 'filled',
    						unbounded: false,
    						addClass: /*addClass*/ ctx[38],
    						removeClass: /*removeClass*/ ctx[39],
    						addStyle: /*addStyle*/ ctx[40],
    						eventTarget: /*inputElement*/ ctx[33],
    						activeTarget: /*inputElement*/ ctx[33],
    						initPromise: /*initPromise*/ ctx[37]
    					})),
    					action_destroyer(useActions_action = useActions.call(null, label_1, /*use*/ ctx[8])),
    					action_destroyer(/*forwardEvents*/ ctx[34].call(null, label_1)),
    					listen_dev(label_1, "SMUITextfieldLeadingIcon:mount", /*SMUITextfieldLeadingIcon_mount_handler*/ ctx[74], false, false, false),
    					listen_dev(label_1, "SMUITextfieldLeadingIcon:unmount", /*SMUITextfieldLeadingIcon_unmount_handler*/ ctx[75], false, false, false),
    					listen_dev(label_1, "SMUITextfieldTrailingIcon:mount", /*SMUITextfieldTrailingIcon_mount_handler*/ ctx[76], false, false, false),
    					listen_dev(label_1, "SMUITextfieldTrailingIcon:unmount", /*SMUITextfieldTrailingIcon_unmount_handler*/ ctx[77], false, false, false),
    					listen_dev(label_1, "SMUITextfieldCharacterCounter:mount", /*SMUITextfieldCharacterCounter_mount_handler*/ ctx[78], false, false, false),
    					listen_dev(label_1, "SMUITextfieldCharacterCounter:unmount", /*SMUITextfieldCharacterCounter_unmount_handler*/ ctx[79], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!/*textarea*/ ctx[14] && /*variant*/ ctx[15] !== 'outlined') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*textarea, variant*/ 49152) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(label_1, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*textarea*/ ctx[14] || /*variant*/ ctx[15] === 'outlined') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*textarea, variant*/ 49152) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(label_1, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const contextfragment0_changes = {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				contextfragment0_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment0.$set(contextfragment0_changes);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[90], dirty, null),
    						null
    					);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(label_1, t4);
    			}

    			const contextfragment1_changes = {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				contextfragment1_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment1.$set(contextfragment1_changes);

    			if (!/*textarea*/ ctx[14] && /*variant*/ ctx[15] !== 'outlined' && /*ripple*/ ctx[11]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*textarea, variant, ripple*/ 51200) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(label_1, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			set_attributes(label_1, label_1_data = get_spread_update(label_1_levels, [
    				(!current || dirty[0] & /*className, disabled, textarea, variant, noLabel, label, focused, value, withLeadingIcon, withTrailingIcon, invalid, internalClasses*/ 314823171 | dirty[1] & /*$$slots*/ 2048 && label_1_class_value !== (label_1_class_value = classMap({
    					[/*className*/ ctx[9]]: true,
    					'mdc-text-field': true,
    					'mdc-text-field--disabled': /*disabled*/ ctx[12],
    					'mdc-text-field--textarea': /*textarea*/ ctx[14],
    					'mdc-text-field--filled': /*variant*/ ctx[15] === 'filled',
    					'mdc-text-field--outlined': /*variant*/ ctx[15] === 'outlined',
    					'smui-text-field--standard': /*variant*/ ctx[15] === 'standard' && !/*textarea*/ ctx[14],
    					'mdc-text-field--no-label': /*noLabel*/ ctx[16] || /*label*/ ctx[17] == null && !/*$$slots*/ ctx[42].label,
    					'mdc-text-field--label-floating': /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== '',
    					'mdc-text-field--with-leading-icon': /*isUninitializedValue*/ ctx[35](/*withLeadingIcon*/ ctx[22])
    					? /*$$slots*/ ctx[42].leadingIcon
    					: /*withLeadingIcon*/ ctx[22],
    					'mdc-text-field--with-trailing-icon': /*isUninitializedValue*/ ctx[35](/*withTrailingIcon*/ ctx[23])
    					? /*$$slots*/ ctx[42].trailingIcon
    					: /*withTrailingIcon*/ ctx[23],
    					'mdc-text-field--with-internal-counter': /*textarea*/ ctx[14] && /*$$slots*/ ctx[42].internalCounter,
    					'mdc-text-field--invalid': /*invalid*/ ctx[1],
    					.../*internalClasses*/ ctx[25]
    				}))) && { class: label_1_class_value },
    				(!current || dirty[0] & /*internalStyles, style*/ 67109888 && label_1_style_value !== (label_1_style_value = Object.entries(/*internalStyles*/ ctx[26]).map(func).concat([/*style*/ ctx[10]]).join(' '))) && { style: label_1_style_value },
    				{
    					for: /* suppress a11y warning, since this is wrapped */ undefined
    				},
    				dirty[1] & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[41], ['input$', 'label$', 'ripple$', 'outline$', 'helperLine$'])
    			]));

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*textarea, variant*/ 49152 | dirty[1] & /*inputElement*/ 4) Ripple_action.update.call(null, {
    				ripple: !/*textarea*/ ctx[14] && /*variant*/ ctx[15] === 'filled',
    				unbounded: false,
    				addClass: /*addClass*/ ctx[38],
    				removeClass: /*removeClass*/ ctx[39],
    				addStyle: /*addStyle*/ ctx[40],
    				eventTarget: /*inputElement*/ ctx[33],
    				activeTarget: /*inputElement*/ ctx[33],
    				initPromise: /*initPromise*/ ctx[37]
    			});

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 256) useActions_action.update.call(null, /*use*/ ctx[8]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(contextfragment0.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(if_block2);
    			transition_in(contextfragment1.$$.fragment, local);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(contextfragment0.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(if_block2);
    			transition_out(contextfragment1.$$.fragment, local);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(contextfragment0);
    			if (default_slot) default_slot.d(detaching);
    			if_blocks[current_block_type_index].d();
    			destroy_component(contextfragment1);
    			if (if_block3) if_block3.d();
    			/*label_1_binding*/ ctx[73](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(1:0) {#if valued}",
    		ctx
    	});

    	return block;
    }

    // (207:4) <ContextFragment key="SMUI:textfield:icon:leading" value={true}>
    function create_default_slot_9(ctx) {
    	let current;
    	const leadingIcon_slot_template = /*#slots*/ ctx[51].leadingIcon;
    	const leadingIcon_slot = create_slot(leadingIcon_slot_template, ctx, /*$$scope*/ ctx[90], get_leadingIcon_slot_context_1);

    	const block = {
    		c: function create() {
    			if (leadingIcon_slot) leadingIcon_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (leadingIcon_slot) {
    				leadingIcon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (leadingIcon_slot) {
    				if (leadingIcon_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						leadingIcon_slot,
    						leadingIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(leadingIcon_slot_template, /*$$scope*/ ctx[90], dirty, get_leadingIcon_slot_changes_1),
    						get_leadingIcon_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leadingIcon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leadingIcon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (leadingIcon_slot) leadingIcon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(207:4) <ContextFragment key=\\\"SMUI:textfield:icon:leading\\\" value={true}>",
    		ctx
    	});

    	return block;
    }

    // (211:4) <ContextFragment key="SMUI:textfield:icon:leading" value={false}>
    function create_default_slot_8(ctx) {
    	let current;
    	const trailingIcon_slot_template = /*#slots*/ ctx[51].trailingIcon;
    	const trailingIcon_slot = create_slot(trailingIcon_slot_template, ctx, /*$$scope*/ ctx[90], get_trailingIcon_slot_context_1);

    	const block = {
    		c: function create() {
    			if (trailingIcon_slot) trailingIcon_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (trailingIcon_slot) {
    				trailingIcon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (trailingIcon_slot) {
    				if (trailingIcon_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						trailingIcon_slot,
    						trailingIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(trailingIcon_slot_template, /*$$scope*/ ctx[90], dirty, get_trailingIcon_slot_changes_1),
    						get_trailingIcon_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(trailingIcon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(trailingIcon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (trailingIcon_slot) trailingIcon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(211:4) <ContextFragment key=\\\"SMUI:textfield:icon:leading\\\" value={false}>",
    		ctx
    	});

    	return block;
    }

    // (62:4) {#if !textarea && variant !== 'outlined'}
    function create_if_block_8(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*variant*/ ctx[15] === 'filled' && create_if_block_10(ctx);
    	let if_block1 = !/*noLabel*/ ctx[16] && (/*label*/ ctx[17] != null || /*$$slots*/ ctx[42].label) && create_if_block_9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*variant*/ ctx[15] === 'filled') {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*noLabel*/ ctx[16] && (/*label*/ ctx[17] != null || /*$$slots*/ ctx[42].label)) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*noLabel, label*/ 196608 | dirty[1] & /*$$slots*/ 2048) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(62:4) {#if !textarea && variant !== 'outlined'}",
    		ctx
    	});

    	return block;
    }

    // (63:6) {#if variant === 'filled'}
    function create_if_block_10(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "mdc-text-field__ripple");
    			add_location(span, file$3, 63, 8, 2241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(63:6) {#if variant === 'filled'}",
    		ctx
    	});

    	return block;
    }

    // (66:6) {#if !noLabel && (label != null || $$slots.label)}
    function create_if_block_9(ctx) {
    	let floatinglabel;
    	let current;

    	const floatinglabel_spread_levels = [
    		{
    			floatAbove: /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== ''
    		},
    		{ required: /*required*/ ctx[13] },
    		{ wrapped: true },
    		prefixFilter(/*$$restProps*/ ctx[41], 'label$')
    	];

    	let floatinglabel_props = {
    		$$slots: { default: [create_default_slot_7] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < floatinglabel_spread_levels.length; i += 1) {
    		floatinglabel_props = assign(floatinglabel_props, floatinglabel_spread_levels[i]);
    	}

    	floatinglabel = new FloatingLabel({
    			props: floatinglabel_props,
    			$$inline: true
    		});

    	/*floatinglabel_binding*/ ctx[52](floatinglabel);

    	const block = {
    		c: function create() {
    			create_component(floatinglabel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(floatinglabel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const floatinglabel_changes = (dirty[0] & /*focused, value, required*/ 268443649 | dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(floatinglabel_spread_levels, [
    					dirty[0] & /*focused, value*/ 268435457 && {
    						floatAbove: /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== ''
    					},
    					dirty[0] & /*required*/ 8192 && { required: /*required*/ ctx[13] },
    					floatinglabel_spread_levels[2],
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'label$'))
    				])
    			: {};

    			if (dirty[0] & /*label*/ 131072 | dirty[2] & /*$$scope*/ 268435456) {
    				floatinglabel_changes.$$scope = { dirty, ctx };
    			}

    			floatinglabel.$set(floatinglabel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(floatinglabel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(floatinglabel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*floatinglabel_binding*/ ctx[52](null);
    			destroy_component(floatinglabel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(66:6) {#if !noLabel && (label != null || $$slots.label)}",
    		ctx
    	});

    	return block;
    }

    // (67:8) <FloatingLabel           bind:this={floatingLabel}           floatAbove={focused || (value != null && value !== '')}           {required}           wrapped           {...prefixFilter($$restProps, 'label$')}           >
    function create_default_slot_7(ctx) {
    	let t_value = (/*label*/ ctx[17] == null ? '' : /*label*/ ctx[17]) + "";
    	let t;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[51].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[90], get_label_slot_context);

    	const block = {
    		c: function create() {
    			t = text(t_value);
    			if (label_slot) label_slot.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);

    			if (label_slot) {
    				label_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*label*/ 131072) && t_value !== (t_value = (/*label*/ ctx[17] == null ? '' : /*label*/ ctx[17]) + "")) set_data_dev(t, t_value);

    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[90], dirty, get_label_slot_changes),
    						get_label_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (label_slot) label_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(67:8) <FloatingLabel           bind:this={floatingLabel}           floatAbove={focused || (value != null && value !== '')}           {required}           wrapped           {...prefixFilter($$restProps, 'label$')}           >",
    		ctx
    	});

    	return block;
    }

    // (77:4) {#if textarea || variant === 'outlined'}
    function create_if_block_6(ctx) {
    	let notchedoutline;
    	let current;

    	const notchedoutline_spread_levels = [
    		{
    			noLabel: /*noLabel*/ ctx[16] || /*label*/ ctx[17] == null && !/*$$slots*/ ctx[42].label
    		},
    		prefixFilter(/*$$restProps*/ ctx[41], 'outline$')
    	];

    	let notchedoutline_props = {
    		$$slots: { default: [create_default_slot_5] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < notchedoutline_spread_levels.length; i += 1) {
    		notchedoutline_props = assign(notchedoutline_props, notchedoutline_spread_levels[i]);
    	}

    	notchedoutline = new NotchedOutline({
    			props: notchedoutline_props,
    			$$inline: true
    		});

    	/*notchedoutline_binding*/ ctx[54](notchedoutline);

    	const block = {
    		c: function create() {
    			create_component(notchedoutline.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notchedoutline, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const notchedoutline_changes = (dirty[0] & /*noLabel, label*/ 196608 | dirty[1] & /*$$slots, $$restProps*/ 3072)
    			? get_spread_update(notchedoutline_spread_levels, [
    					dirty[0] & /*noLabel, label*/ 196608 | dirty[1] & /*$$slots*/ 2048 && {
    						noLabel: /*noLabel*/ ctx[16] || /*label*/ ctx[17] == null && !/*$$slots*/ ctx[42].label
    					},
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'outline$'))
    				])
    			: {};

    			if (dirty[0] & /*focused, value, required, floatingLabel, label, noLabel*/ 268640289 | dirty[1] & /*$$restProps, $$slots*/ 3072 | dirty[2] & /*$$scope*/ 268435456) {
    				notchedoutline_changes.$$scope = { dirty, ctx };
    			}

    			notchedoutline.$set(notchedoutline_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notchedoutline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notchedoutline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*notchedoutline_binding*/ ctx[54](null);
    			destroy_component(notchedoutline, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(77:4) {#if textarea || variant === 'outlined'}",
    		ctx
    	});

    	return block;
    }

    // (83:8) {#if !noLabel && (label != null || $$slots.label)}
    function create_if_block_7(ctx) {
    	let floatinglabel;
    	let current;

    	const floatinglabel_spread_levels = [
    		{
    			floatAbove: /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== ''
    		},
    		{ required: /*required*/ ctx[13] },
    		{ wrapped: true },
    		prefixFilter(/*$$restProps*/ ctx[41], 'label$')
    	];

    	let floatinglabel_props = {
    		$$slots: { default: [create_default_slot_6] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < floatinglabel_spread_levels.length; i += 1) {
    		floatinglabel_props = assign(floatinglabel_props, floatinglabel_spread_levels[i]);
    	}

    	floatinglabel = new FloatingLabel({
    			props: floatinglabel_props,
    			$$inline: true
    		});

    	/*floatinglabel_binding_1*/ ctx[53](floatinglabel);

    	const block = {
    		c: function create() {
    			create_component(floatinglabel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(floatinglabel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const floatinglabel_changes = (dirty[0] & /*focused, value, required*/ 268443649 | dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(floatinglabel_spread_levels, [
    					dirty[0] & /*focused, value*/ 268435457 && {
    						floatAbove: /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== ''
    					},
    					dirty[0] & /*required*/ 8192 && { required: /*required*/ ctx[13] },
    					floatinglabel_spread_levels[2],
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'label$'))
    				])
    			: {};

    			if (dirty[0] & /*label*/ 131072 | dirty[2] & /*$$scope*/ 268435456) {
    				floatinglabel_changes.$$scope = { dirty, ctx };
    			}

    			floatinglabel.$set(floatinglabel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(floatinglabel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(floatinglabel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*floatinglabel_binding_1*/ ctx[53](null);
    			destroy_component(floatinglabel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(83:8) {#if !noLabel && (label != null || $$slots.label)}",
    		ctx
    	});

    	return block;
    }

    // (84:10) <FloatingLabel             bind:this={floatingLabel}             floatAbove={focused || (value != null && value !== '')}             {required}             wrapped             {...prefixFilter($$restProps, 'label$')}             >
    function create_default_slot_6(ctx) {
    	let t_value = (/*label*/ ctx[17] == null ? '' : /*label*/ ctx[17]) + "";
    	let t;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[51].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[90], get_label_slot_context_1);

    	const block = {
    		c: function create() {
    			t = text(t_value);
    			if (label_slot) label_slot.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);

    			if (label_slot) {
    				label_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*label*/ 131072) && t_value !== (t_value = (/*label*/ ctx[17] == null ? '' : /*label*/ ctx[17]) + "")) set_data_dev(t, t_value);

    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[90], dirty, get_label_slot_changes_1),
    						get_label_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (label_slot) label_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(84:10) <FloatingLabel             bind:this={floatingLabel}             floatAbove={focused || (value != null && value !== '')}             {required}             wrapped             {...prefixFilter($$restProps, 'label$')}             >",
    		ctx
    	});

    	return block;
    }

    // (78:6) <NotchedOutline         bind:this={notchedOutline}         noLabel={noLabel || (label == null && !$$slots.label)}         {...prefixFilter($$restProps, 'outline$')}       >
    function create_default_slot_5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*noLabel*/ ctx[16] && (/*label*/ ctx[17] != null || /*$$slots*/ ctx[42].label) && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*noLabel*/ ctx[16] && (/*label*/ ctx[17] != null || /*$$slots*/ ctx[42].label)) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*noLabel, label*/ 196608 | dirty[1] & /*$$slots*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(78:6) <NotchedOutline         bind:this={notchedOutline}         noLabel={noLabel || (label == null && !$$slots.label)}         {...prefixFilter($$restProps, 'outline$')}       >",
    		ctx
    	});

    	return block;
    }

    // (95:4) <ContextFragment key="SMUI:textfield:icon:leading" value={true}>
    function create_default_slot_4(ctx) {
    	let current;
    	const leadingIcon_slot_template = /*#slots*/ ctx[51].leadingIcon;
    	const leadingIcon_slot = create_slot(leadingIcon_slot_template, ctx, /*$$scope*/ ctx[90], get_leadingIcon_slot_context);

    	const block = {
    		c: function create() {
    			if (leadingIcon_slot) leadingIcon_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (leadingIcon_slot) {
    				leadingIcon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (leadingIcon_slot) {
    				if (leadingIcon_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						leadingIcon_slot,
    						leadingIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(leadingIcon_slot_template, /*$$scope*/ ctx[90], dirty, get_leadingIcon_slot_changes),
    						get_leadingIcon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leadingIcon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leadingIcon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (leadingIcon_slot) leadingIcon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(95:4) <ContextFragment key=\\\"SMUI:textfield:icon:leading\\\" value={true}>",
    		ctx
    	});

    	return block;
    }

    // (124:4) {:else}
    function create_else_block$1(ctx) {
    	let t0;
    	let t1;
    	let input_1;
    	let updating_value;
    	let updating_files;
    	let updating_dirty;
    	let updating_invalid;
    	let t2;
    	let t3;
    	let current;
    	const prefix_slot_template = /*#slots*/ ctx[51].prefix;
    	const prefix_slot = create_slot(prefix_slot_template, ctx, /*$$scope*/ ctx[90], get_prefix_slot_context);
    	let if_block0 = /*prefix*/ ctx[20] != null && create_if_block_5(ctx);

    	const input_1_spread_levels = [
    		{ type: /*type*/ ctx[18] },
    		{ disabled: /*disabled*/ ctx[12] },
    		{ required: /*required*/ ctx[13] },
    		{ updateInvalid: /*updateInvalid*/ ctx[19] },
    		{ "aria-controls": /*helperId*/ ctx[27] },
    		{ "aria-describedby": /*helperId*/ ctx[27] },
    		/*noLabel*/ ctx[16] && /*label*/ ctx[17] != null
    		? { placeholder: /*label*/ ctx[17] }
    		: {},
    		prefixFilter(/*$$restProps*/ ctx[41], 'input$')
    	];

    	function input_1_value_binding(value) {
    		/*input_1_value_binding*/ ctx[64](value);
    	}

    	function input_1_files_binding(value) {
    		/*input_1_files_binding*/ ctx[65](value);
    	}

    	function input_1_dirty_binding(value) {
    		/*input_1_dirty_binding*/ ctx[66](value);
    	}

    	function input_1_invalid_binding(value) {
    		/*input_1_invalid_binding*/ ctx[67](value);
    	}

    	let input_1_props = {};

    	for (let i = 0; i < input_1_spread_levels.length; i += 1) {
    		input_1_props = assign(input_1_props, input_1_spread_levels[i]);
    	}

    	if (/*value*/ ctx[0] !== void 0) {
    		input_1_props.value = /*value*/ ctx[0];
    	}

    	if (/*files*/ ctx[3] !== void 0) {
    		input_1_props.files = /*files*/ ctx[3];
    	}

    	if (/*dirty*/ ctx[4] !== void 0) {
    		input_1_props.dirty = /*dirty*/ ctx[4];
    	}

    	if (/*invalid*/ ctx[1] !== void 0) {
    		input_1_props.invalid = /*invalid*/ ctx[1];
    	}

    	input_1 = new Input$1({ props: input_1_props, $$inline: true });
    	/*input_1_binding*/ ctx[63](input_1);
    	binding_callbacks.push(() => bind(input_1, 'value', input_1_value_binding));
    	binding_callbacks.push(() => bind(input_1, 'files', input_1_files_binding));
    	binding_callbacks.push(() => bind(input_1, 'dirty', input_1_dirty_binding));
    	binding_callbacks.push(() => bind(input_1, 'invalid', input_1_invalid_binding));
    	input_1.$on("blur", /*blur_handler_2*/ ctx[68]);
    	input_1.$on("focus", /*focus_handler_2*/ ctx[69]);
    	input_1.$on("blur", /*blur_handler_3*/ ctx[70]);
    	input_1.$on("focus", /*focus_handler_3*/ ctx[71]);
    	let if_block1 = /*suffix*/ ctx[21] != null && create_if_block_4(ctx);
    	const suffix_slot_template = /*#slots*/ ctx[51].suffix;
    	const suffix_slot = create_slot(suffix_slot_template, ctx, /*$$scope*/ ctx[90], get_suffix_slot_context);

    	const block = {
    		c: function create() {
    			if (prefix_slot) prefix_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(input_1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (suffix_slot) suffix_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (prefix_slot) {
    				prefix_slot.m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(input_1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);

    			if (suffix_slot) {
    				suffix_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (prefix_slot) {
    				if (prefix_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						prefix_slot,
    						prefix_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(prefix_slot_template, /*$$scope*/ ctx[90], dirty, get_prefix_slot_changes),
    						get_prefix_slot_context
    					);
    				}
    			}

    			if (/*prefix*/ ctx[20] != null) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*prefix*/ 1048576) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const input_1_changes = (dirty[0] & /*type, disabled, required, updateInvalid, helperId, noLabel, label*/ 135213056 | dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(input_1_spread_levels, [
    					dirty[0] & /*type*/ 262144 && { type: /*type*/ ctx[18] },
    					dirty[0] & /*disabled*/ 4096 && { disabled: /*disabled*/ ctx[12] },
    					dirty[0] & /*required*/ 8192 && { required: /*required*/ ctx[13] },
    					dirty[0] & /*updateInvalid*/ 524288 && { updateInvalid: /*updateInvalid*/ ctx[19] },
    					dirty[0] & /*helperId*/ 134217728 && { "aria-controls": /*helperId*/ ctx[27] },
    					dirty[0] & /*helperId*/ 134217728 && { "aria-describedby": /*helperId*/ ctx[27] },
    					dirty[0] & /*noLabel, label*/ 196608 && get_spread_object(/*noLabel*/ ctx[16] && /*label*/ ctx[17] != null
    					? { placeholder: /*label*/ ctx[17] }
    					: {}),
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'input$'))
    				])
    			: {};

    			if (!updating_value && dirty[0] & /*value*/ 1) {
    				updating_value = true;
    				input_1_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_files && dirty[0] & /*files*/ 8) {
    				updating_files = true;
    				input_1_changes.files = /*files*/ ctx[3];
    				add_flush_callback(() => updating_files = false);
    			}

    			if (!updating_dirty && dirty[0] & /*dirty*/ 16) {
    				updating_dirty = true;
    				input_1_changes.dirty = /*dirty*/ ctx[4];
    				add_flush_callback(() => updating_dirty = false);
    			}

    			if (!updating_invalid && dirty[0] & /*invalid*/ 2) {
    				updating_invalid = true;
    				input_1_changes.invalid = /*invalid*/ ctx[1];
    				add_flush_callback(() => updating_invalid = false);
    			}

    			input_1.$set(input_1_changes);

    			if (/*suffix*/ ctx[21] != null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*suffix*/ 2097152) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (suffix_slot) {
    				if (suffix_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						suffix_slot,
    						suffix_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(suffix_slot_template, /*$$scope*/ ctx[90], dirty, get_suffix_slot_changes),
    						get_suffix_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prefix_slot, local);
    			transition_in(if_block0);
    			transition_in(input_1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(suffix_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prefix_slot, local);
    			transition_out(if_block0);
    			transition_out(input_1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(suffix_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (prefix_slot) prefix_slot.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			/*input_1_binding*/ ctx[63](null);
    			destroy_component(input_1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (suffix_slot) suffix_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(124:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:4) {#if textarea && typeof value === 'string'}
    function create_if_block_3(ctx) {
    	let span;
    	let textarea_1;
    	let updating_value;
    	let updating_dirty;
    	let updating_invalid;
    	let t;
    	let span_class_value;
    	let current;

    	const textarea_1_spread_levels = [
    		{ disabled: /*disabled*/ ctx[12] },
    		{ required: /*required*/ ctx[13] },
    		{ updateInvalid: /*updateInvalid*/ ctx[19] },
    		{ "aria-controls": /*helperId*/ ctx[27] },
    		{ "aria-describedby": /*helperId*/ ctx[27] },
    		prefixFilter(/*$$restProps*/ ctx[41], 'input$')
    	];

    	function textarea_1_value_binding(value) {
    		/*textarea_1_value_binding*/ ctx[56](value);
    	}

    	function textarea_1_dirty_binding(value) {
    		/*textarea_1_dirty_binding*/ ctx[57](value);
    	}

    	function textarea_1_invalid_binding(value) {
    		/*textarea_1_invalid_binding*/ ctx[58](value);
    	}

    	let textarea_1_props = {};

    	for (let i = 0; i < textarea_1_spread_levels.length; i += 1) {
    		textarea_1_props = assign(textarea_1_props, textarea_1_spread_levels[i]);
    	}

    	if (/*value*/ ctx[0] !== void 0) {
    		textarea_1_props.value = /*value*/ ctx[0];
    	}

    	if (/*dirty*/ ctx[4] !== void 0) {
    		textarea_1_props.dirty = /*dirty*/ ctx[4];
    	}

    	if (/*invalid*/ ctx[1] !== void 0) {
    		textarea_1_props.invalid = /*invalid*/ ctx[1];
    	}

    	textarea_1 = new Textarea({ props: textarea_1_props, $$inline: true });
    	/*textarea_1_binding*/ ctx[55](textarea_1);
    	binding_callbacks.push(() => bind(textarea_1, 'value', textarea_1_value_binding));
    	binding_callbacks.push(() => bind(textarea_1, 'dirty', textarea_1_dirty_binding));
    	binding_callbacks.push(() => bind(textarea_1, 'invalid', textarea_1_invalid_binding));
    	textarea_1.$on("blur", /*blur_handler*/ ctx[59]);
    	textarea_1.$on("focus", /*focus_handler*/ ctx[60]);
    	textarea_1.$on("blur", /*blur_handler_1*/ ctx[61]);
    	textarea_1.$on("focus", /*focus_handler_1*/ ctx[62]);
    	const internalCounter_slot_template = /*#slots*/ ctx[51].internalCounter;
    	const internalCounter_slot = create_slot(internalCounter_slot_template, ctx, /*$$scope*/ ctx[90], get_internalCounter_slot_context);

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(textarea_1.$$.fragment);
    			t = space();
    			if (internalCounter_slot) internalCounter_slot.c();

    			attr_dev(span, "class", span_class_value = classMap({
    				'mdc-text-field__resizer': !('input$resizable' in /*$$restProps*/ ctx[41]) || /*$$restProps*/ ctx[41].input$resizable
    			}));

    			add_location(span, file$3, 99, 6, 3514);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(textarea_1, span, null);
    			append_dev(span, t);

    			if (internalCounter_slot) {
    				internalCounter_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textarea_1_changes = (dirty[0] & /*disabled, required, updateInvalid, helperId*/ 134754304 | dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(textarea_1_spread_levels, [
    					dirty[0] & /*disabled*/ 4096 && { disabled: /*disabled*/ ctx[12] },
    					dirty[0] & /*required*/ 8192 && { required: /*required*/ ctx[13] },
    					dirty[0] & /*updateInvalid*/ 524288 && { updateInvalid: /*updateInvalid*/ ctx[19] },
    					dirty[0] & /*helperId*/ 134217728 && { "aria-controls": /*helperId*/ ctx[27] },
    					dirty[0] & /*helperId*/ 134217728 && { "aria-describedby": /*helperId*/ ctx[27] },
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'input$'))
    				])
    			: {};

    			if (!updating_value && dirty[0] & /*value*/ 1) {
    				updating_value = true;
    				textarea_1_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_dirty && dirty[0] & /*dirty*/ 16) {
    				updating_dirty = true;
    				textarea_1_changes.dirty = /*dirty*/ ctx[4];
    				add_flush_callback(() => updating_dirty = false);
    			}

    			if (!updating_invalid && dirty[0] & /*invalid*/ 2) {
    				updating_invalid = true;
    				textarea_1_changes.invalid = /*invalid*/ ctx[1];
    				add_flush_callback(() => updating_invalid = false);
    			}

    			textarea_1.$set(textarea_1_changes);

    			if (internalCounter_slot) {
    				if (internalCounter_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						internalCounter_slot,
    						internalCounter_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(internalCounter_slot_template, /*$$scope*/ ctx[90], dirty, get_internalCounter_slot_changes),
    						get_internalCounter_slot_context
    					);
    				}
    			}

    			if (!current || dirty[1] & /*$$restProps*/ 1024 && span_class_value !== (span_class_value = classMap({
    				'mdc-text-field__resizer': !('input$resizable' in /*$$restProps*/ ctx[41]) || /*$$restProps*/ ctx[41].input$resizable
    			}))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textarea_1.$$.fragment, local);
    			transition_in(internalCounter_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textarea_1.$$.fragment, local);
    			transition_out(internalCounter_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			/*textarea_1_binding*/ ctx[55](null);
    			destroy_component(textarea_1);
    			if (internalCounter_slot) internalCounter_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(99:4) {#if textarea && typeof value === 'string'}",
    		ctx
    	});

    	return block;
    }

    // (126:6) {#if prefix != null}
    function create_if_block_5(ctx) {
    	let prefix_1;
    	let current;

    	prefix_1 = new Prefix({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(prefix_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(prefix_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const prefix_1_changes = {};

    			if (dirty[0] & /*prefix*/ 1048576 | dirty[2] & /*$$scope*/ 268435456) {
    				prefix_1_changes.$$scope = { dirty, ctx };
    			}

    			prefix_1.$set(prefix_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prefix_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prefix_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(prefix_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(126:6) {#if prefix != null}",
    		ctx
    	});

    	return block;
    }

    // (127:8) <Prefix>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*prefix*/ ctx[20]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*prefix*/ 1048576) set_data_dev(t, /*prefix*/ ctx[20]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(127:8) <Prefix>",
    		ctx
    	});

    	return block;
    }

    // (148:6) {#if suffix != null}
    function create_if_block_4(ctx) {
    	let suffix_1;
    	let current;

    	suffix_1 = new Suffix({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(suffix_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(suffix_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const suffix_1_changes = {};

    			if (dirty[0] & /*suffix*/ 2097152 | dirty[2] & /*$$scope*/ 268435456) {
    				suffix_1_changes.$$scope = { dirty, ctx };
    			}

    			suffix_1.$set(suffix_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(suffix_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(suffix_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(suffix_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(148:6) {#if suffix != null}",
    		ctx
    	});

    	return block;
    }

    // (149:8) <Suffix>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*suffix*/ ctx[21]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*suffix*/ 2097152) set_data_dev(t, /*suffix*/ ctx[21]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(149:8) <Suffix>",
    		ctx
    	});

    	return block;
    }

    // (153:4) <ContextFragment key="SMUI:textfield:icon:leading" value={false}>
    function create_default_slot_1$1(ctx) {
    	let current;
    	const trailingIcon_slot_template = /*#slots*/ ctx[51].trailingIcon;
    	const trailingIcon_slot = create_slot(trailingIcon_slot_template, ctx, /*$$scope*/ ctx[90], get_trailingIcon_slot_context);

    	const block = {
    		c: function create() {
    			if (trailingIcon_slot) trailingIcon_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (trailingIcon_slot) {
    				trailingIcon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (trailingIcon_slot) {
    				if (trailingIcon_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						trailingIcon_slot,
    						trailingIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(trailingIcon_slot_template, /*$$scope*/ ctx[90], dirty, get_trailingIcon_slot_changes),
    						get_trailingIcon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(trailingIcon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(trailingIcon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (trailingIcon_slot) trailingIcon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(153:4) <ContextFragment key=\\\"SMUI:textfield:icon:leading\\\" value={false}>",
    		ctx
    	});

    	return block;
    }

    // (156:4) {#if !textarea && variant !== 'outlined' && ripple}
    function create_if_block_2(ctx) {
    	let lineripple;
    	let current;
    	const lineripple_spread_levels = [prefixFilter(/*$$restProps*/ ctx[41], 'ripple$')];
    	let lineripple_props = {};

    	for (let i = 0; i < lineripple_spread_levels.length; i += 1) {
    		lineripple_props = assign(lineripple_props, lineripple_spread_levels[i]);
    	}

    	lineripple = new LineRipple({ props: lineripple_props, $$inline: true });
    	/*lineripple_binding*/ ctx[72](lineripple);

    	const block = {
    		c: function create() {
    			create_component(lineripple.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lineripple, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lineripple_changes = (dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(lineripple_spread_levels, [get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'ripple$'))])
    			: {};

    			lineripple.$set(lineripple_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lineripple.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lineripple.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*lineripple_binding*/ ctx[72](null);
    			destroy_component(lineripple, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(156:4) {#if !textarea && variant !== 'outlined' && ripple}",
    		ctx
    	});

    	return block;
    }

    // (217:0) {#if $$slots.helper}
    function create_if_block$1(ctx) {
    	let helperline;
    	let current;
    	const helperline_spread_levels = [prefixFilter(/*$$restProps*/ ctx[41], 'helperLine$')];

    	let helperline_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < helperline_spread_levels.length; i += 1) {
    		helperline_props = assign(helperline_props, helperline_spread_levels[i]);
    	}

    	helperline = new HelperLine({ props: helperline_props, $$inline: true });
    	helperline.$on("SMUITextfieldHelperText:id", /*SMUITextfieldHelperText_id_handler*/ ctx[85]);
    	helperline.$on("SMUITextfieldHelperText:mount", /*SMUITextfieldHelperText_mount_handler*/ ctx[86]);
    	helperline.$on("SMUITextfieldHelperText:unmount", /*SMUITextfieldHelperText_unmount_handler*/ ctx[87]);
    	helperline.$on("SMUITextfieldCharacterCounter:mount", /*SMUITextfieldCharacterCounter_mount_handler_1*/ ctx[88]);
    	helperline.$on("SMUITextfieldCharacterCounter:unmount", /*SMUITextfieldCharacterCounter_unmount_handler_1*/ ctx[89]);

    	const block = {
    		c: function create() {
    			create_component(helperline.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(helperline, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const helperline_changes = (dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(helperline_spread_levels, [get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'helperLine$'))])
    			: {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				helperline_changes.$$scope = { dirty, ctx };
    			}

    			helperline.$set(helperline_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(helperline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(helperline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(helperline, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(217:0) {#if $$slots.helper}",
    		ctx
    	});

    	return block;
    }

    // (218:2) <HelperLine     on:SMUITextfieldHelperText:id={(event) => (helperId = event.detail)}     on:SMUITextfieldHelperText:mount={(event) => (helperText = event.detail)}     on:SMUITextfieldHelperText:unmount={() => {       helperId = undefined;       helperText = undefined;     }}     on:SMUITextfieldCharacterCounter:mount={(event) =>       (characterCounter = event.detail)}     on:SMUITextfieldCharacterCounter:unmount={() =>       (characterCounter = undefined)}     {...prefixFilter($$restProps, 'helperLine$')}     >
    function create_default_slot$2(ctx) {
    	let current;
    	const helper_slot_template = /*#slots*/ ctx[51].helper;
    	const helper_slot = create_slot(helper_slot_template, ctx, /*$$scope*/ ctx[90], get_helper_slot_context);

    	const block = {
    		c: function create() {
    			if (helper_slot) helper_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (helper_slot) {
    				helper_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (helper_slot) {
    				if (helper_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						helper_slot,
    						helper_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(helper_slot_template, /*$$scope*/ ctx[90], dirty, get_helper_slot_changes),
    						get_helper_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(helper_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(helper_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (helper_slot) helper_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(218:2) <HelperLine     on:SMUITextfieldHelperText:id={(event) => (helperId = event.detail)}     on:SMUITextfieldHelperText:mount={(event) => (helperText = event.detail)}     on:SMUITextfieldHelperText:unmount={() => {       helperId = undefined;       helperText = undefined;     }}     on:SMUITextfieldCharacterCounter:mount={(event) =>       (characterCounter = event.detail)}     on:SMUITextfieldCharacterCounter:unmount={() =>       (characterCounter = undefined)}     {...prefixFilter($$restProps, 'helperLine$')}     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*valued*/ ctx[36]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*$$slots*/ ctx[42].helper && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block0.p(ctx, dirty);

    			if (/*$$slots*/ ctx[42].helper) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*$$slots*/ 2048) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = ([name, value]) => `${name}: ${value};`;
    const func_1 = ([name, value]) => `${name}: ${value};`;

    function instance_1($$self, $$props, $$invalidate) {
    	let inputElement;

    	const omit_props_names = [
    		"use","class","style","ripple","disabled","required","textarea","variant","noLabel","label","type","value","files","invalid","updateInvalid","dirty","prefix","suffix","validateOnValueChange","useNativeValidation","withLeadingIcon","withTrailingIcon","input","floatingLabel","lineRipple","notchedOutline","focus","blur","layout","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;

    	validate_slots('Textfield', slots, [
    		'label','leadingIcon','default','internalCounter','prefix','suffix','trailingIcon','ripple','helper'
    	]);

    	const $$slots = compute_slots(slots);
    	const { applyPassive } = events;
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { ripple = true } = $$props;
    	let { disabled = false } = $$props;
    	let { required = false } = $$props;
    	let { textarea = false } = $$props;
    	let { variant = textarea ? 'outlined' : 'standard' } = $$props;
    	let { noLabel = false } = $$props;
    	let { label = undefined } = $$props;
    	let { type = 'text' } = $$props;

    	let { value = $$restProps.input$emptyValueUndefined
    	? undefined
    	: uninitializedValue } = $$props;

    	let { files = uninitializedValue } = $$props;
    	const valued = !isUninitializedValue(value) || !isUninitializedValue(files);

    	if (isUninitializedValue(value)) {
    		value = undefined;
    	}

    	if (isUninitializedValue(files)) {
    		files = null;
    	}

    	let { invalid = uninitializedValue } = $$props;
    	let { updateInvalid = isUninitializedValue(invalid) } = $$props;

    	if (isUninitializedValue(invalid)) {
    		invalid = false;
    	}

    	let { dirty = false } = $$props;
    	let { prefix = undefined } = $$props;
    	let { suffix = undefined } = $$props;
    	let { validateOnValueChange = updateInvalid } = $$props;
    	let { useNativeValidation = updateInvalid } = $$props;
    	let { withLeadingIcon = uninitializedValue } = $$props;
    	let { withTrailingIcon = uninitializedValue } = $$props;
    	let { input = undefined } = $$props;
    	let { floatingLabel = undefined } = $$props;
    	let { lineRipple = undefined } = $$props;
    	let { notchedOutline = undefined } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};
    	let helperId = undefined;
    	let focused = false;
    	let addLayoutListener = getContext('SMUI:addLayoutListener');
    	let removeLayoutListener;
    	let initPromiseResolve;
    	let initPromise = new Promise(resolve => initPromiseResolve = resolve);

    	// These are instances, not accessors.
    	let leadingIcon = undefined;

    	let trailingIcon = undefined;
    	let helperText = undefined;
    	let characterCounter = undefined;

    	// React to changes of value from outside component.
    	let previousValue = value;

    	if (addLayoutListener) {
    		removeLayoutListener = addLayoutListener(layout);
    	}

    	onMount(() => {
    		$$invalidate(49, instance = new MDCTextFieldFoundation({
    				// getRootAdapterMethods_
    				addClass,
    				removeClass,
    				hasClass,
    				registerTextFieldInteractionHandler: (evtType, handler) => getElement().addEventListener(evtType, handler),
    				deregisterTextFieldInteractionHandler: (evtType, handler) => getElement().removeEventListener(evtType, handler),
    				registerValidationAttributeChangeHandler: handler => {
    					const getAttributesList = mutationsList => {
    						return mutationsList.map(mutation => mutation.attributeName).filter(attributeName => attributeName);
    					};

    					const observer = new MutationObserver(mutationsList => {
    							if (useNativeValidation) {
    								handler(getAttributesList(mutationsList));
    							}
    						});

    					const config = { attributes: true };

    					if (input) {
    						observer.observe(input.getElement(), config);
    					}

    					return observer;
    				},
    				deregisterValidationAttributeChangeHandler: observer => {
    					observer.disconnect();
    				},
    				// getInputAdapterMethods_
    				getNativeInput: () => {
    					var _a;

    					return (_a = input === null || input === void 0
    					? void 0
    					: input.getElement()) !== null && _a !== void 0
    					? _a
    					: null;
    				},
    				setInputAttr: (name, value) => {
    					input === null || input === void 0
    					? void 0
    					: input.addAttr(name, value);
    				},
    				removeInputAttr: name => {
    					input === null || input === void 0
    					? void 0
    					: input.removeAttr(name);
    				},
    				isFocused: () => document.activeElement === (input === null || input === void 0
    				? void 0
    				: input.getElement()),
    				registerInputInteractionHandler: (evtType, handler) => {
    					input === null || input === void 0
    					? void 0
    					: input.getElement().addEventListener(evtType, handler, applyPassive());
    				},
    				deregisterInputInteractionHandler: (evtType, handler) => {
    					input === null || input === void 0
    					? void 0
    					: input.getElement().removeEventListener(evtType, handler, applyPassive());
    				},
    				// getLabelAdapterMethods_
    				floatLabel: shouldFloat => floatingLabel && floatingLabel.float(shouldFloat),
    				getLabelWidth: () => floatingLabel ? floatingLabel.getWidth() : 0,
    				hasLabel: () => !!floatingLabel,
    				shakeLabel: shouldShake => floatingLabel && floatingLabel.shake(shouldShake),
    				setLabelRequired: isRequired => floatingLabel && floatingLabel.setRequired(isRequired),
    				// getLineRippleAdapterMethods_
    				activateLineRipple: () => lineRipple && lineRipple.activate(),
    				deactivateLineRipple: () => lineRipple && lineRipple.deactivate(),
    				setLineRippleTransformOrigin: normalizedX => lineRipple && lineRipple.setRippleCenter(normalizedX),
    				// getOutlineAdapterMethods_
    				closeOutline: () => notchedOutline && notchedOutline.closeNotch(),
    				hasOutline: () => !!notchedOutline,
    				notchOutline: labelWidth => notchedOutline && notchedOutline.notch(labelWidth)
    			},
    		{
    				get helperText() {
    					return helperText;
    				},
    				get characterCounter() {
    					return characterCounter;
    				},
    				get leadingIcon() {
    					return leadingIcon;
    				},
    				get trailingIcon() {
    					return trailingIcon;
    				}
    			}));

    		if (valued) {
    			if (input == null) {
    				throw new Error('SMUI Textfield initialized without Input component.');
    			}

    			instance.init();
    		} else {
    			tick().then(() => {
    				if (input == null) {
    					throw new Error('SMUI Textfield initialized without Input component.');
    				}

    				instance.init();
    			});
    		}

    		initPromiseResolve();

    		return () => {
    			instance.destroy();
    		};
    	});

    	onDestroy(() => {
    		if (removeLayoutListener) {
    			removeLayoutListener();
    		}
    	});

    	function hasClass(className) {
    		var _a;

    		return className in internalClasses
    		? (_a = internalClasses[className]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(25, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(25, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(26, internalStyles);
    			} else {
    				$$invalidate(26, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function focus() {
    		input === null || input === void 0
    		? void 0
    		: input.focus();
    	}

    	function blur() {
    		input === null || input === void 0
    		? void 0
    		: input.blur();
    	}

    	function layout() {
    		if (instance) {
    			const openNotch = instance.shouldFloat;
    			instance.notchOutline(openNotch);
    		}
    	}

    	function getElement() {
    		return element;
    	}

    	function floatinglabel_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			floatingLabel = $$value;
    			$$invalidate(5, floatingLabel);
    		});
    	}

    	function floatinglabel_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			floatingLabel = $$value;
    			$$invalidate(5, floatingLabel);
    		});
    	}

    	function notchedoutline_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			notchedOutline = $$value;
    			$$invalidate(7, notchedOutline);
    		});
    	}

    	function textarea_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(2, input);
    		});
    	}

    	function textarea_1_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function textarea_1_dirty_binding(value) {
    		dirty = value;
    		$$invalidate(4, dirty);
    	}

    	function textarea_1_invalid_binding(value) {
    		invalid = value;
    		(($$invalidate(1, invalid), $$invalidate(49, instance)), $$invalidate(19, updateInvalid));
    	}

    	const blur_handler = () => $$invalidate(28, focused = false);
    	const focus_handler = () => $$invalidate(28, focused = true);
    	const blur_handler_1 = event => dispatch(element, 'blur', event);
    	const focus_handler_1 = event => dispatch(element, 'focus', event);

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(2, input);
    		});
    	}

    	function input_1_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function input_1_files_binding(value) {
    		files = value;
    		$$invalidate(3, files);
    	}

    	function input_1_dirty_binding(value) {
    		dirty = value;
    		$$invalidate(4, dirty);
    	}

    	function input_1_invalid_binding(value) {
    		invalid = value;
    		(($$invalidate(1, invalid), $$invalidate(49, instance)), $$invalidate(19, updateInvalid));
    	}

    	const blur_handler_2 = () => $$invalidate(28, focused = false);
    	const focus_handler_2 = () => $$invalidate(28, focused = true);
    	const blur_handler_3 = event => dispatch(element, 'blur', event);
    	const focus_handler_3 = event => dispatch(element, 'focus', event);

    	function lineripple_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			lineRipple = $$value;
    			$$invalidate(6, lineRipple);
    		});
    	}

    	function label_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(24, element);
    		});
    	}

    	const SMUITextfieldLeadingIcon_mount_handler = event => $$invalidate(29, leadingIcon = event.detail);
    	const SMUITextfieldLeadingIcon_unmount_handler = () => $$invalidate(29, leadingIcon = undefined);
    	const SMUITextfieldTrailingIcon_mount_handler = event => $$invalidate(30, trailingIcon = event.detail);
    	const SMUITextfieldTrailingIcon_unmount_handler = () => $$invalidate(30, trailingIcon = undefined);
    	const SMUITextfieldCharacterCounter_mount_handler = event => $$invalidate(32, characterCounter = event.detail);
    	const SMUITextfieldCharacterCounter_unmount_handler = () => $$invalidate(32, characterCounter = undefined);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(24, element);
    		});
    	}

    	const SMUITextfieldLeadingIcon_mount_handler_1 = event => $$invalidate(29, leadingIcon = event.detail);
    	const SMUITextfieldLeadingIcon_unmount_handler_1 = () => $$invalidate(29, leadingIcon = undefined);
    	const SMUITextfieldTrailingIcon_mount_handler_1 = event => $$invalidate(30, trailingIcon = event.detail);
    	const SMUITextfieldTrailingIcon_unmount_handler_1 = () => $$invalidate(30, trailingIcon = undefined);
    	const SMUITextfieldHelperText_id_handler = event => $$invalidate(27, helperId = event.detail);
    	const SMUITextfieldHelperText_mount_handler = event => $$invalidate(31, helperText = event.detail);

    	const SMUITextfieldHelperText_unmount_handler = () => {
    		$$invalidate(27, helperId = undefined);
    		$$invalidate(31, helperText = undefined);
    	};

    	const SMUITextfieldCharacterCounter_mount_handler_1 = event => $$invalidate(32, characterCounter = event.detail);
    	const SMUITextfieldCharacterCounter_unmount_handler_1 = () => $$invalidate(32, characterCounter = undefined);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(41, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(8, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(10, style = $$new_props.style);
    		if ('ripple' in $$new_props) $$invalidate(11, ripple = $$new_props.ripple);
    		if ('disabled' in $$new_props) $$invalidate(12, disabled = $$new_props.disabled);
    		if ('required' in $$new_props) $$invalidate(13, required = $$new_props.required);
    		if ('textarea' in $$new_props) $$invalidate(14, textarea = $$new_props.textarea);
    		if ('variant' in $$new_props) $$invalidate(15, variant = $$new_props.variant);
    		if ('noLabel' in $$new_props) $$invalidate(16, noLabel = $$new_props.noLabel);
    		if ('label' in $$new_props) $$invalidate(17, label = $$new_props.label);
    		if ('type' in $$new_props) $$invalidate(18, type = $$new_props.type);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('files' in $$new_props) $$invalidate(3, files = $$new_props.files);
    		if ('invalid' in $$new_props) $$invalidate(1, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$new_props) $$invalidate(19, updateInvalid = $$new_props.updateInvalid);
    		if ('dirty' in $$new_props) $$invalidate(4, dirty = $$new_props.dirty);
    		if ('prefix' in $$new_props) $$invalidate(20, prefix = $$new_props.prefix);
    		if ('suffix' in $$new_props) $$invalidate(21, suffix = $$new_props.suffix);
    		if ('validateOnValueChange' in $$new_props) $$invalidate(43, validateOnValueChange = $$new_props.validateOnValueChange);
    		if ('useNativeValidation' in $$new_props) $$invalidate(44, useNativeValidation = $$new_props.useNativeValidation);
    		if ('withLeadingIcon' in $$new_props) $$invalidate(22, withLeadingIcon = $$new_props.withLeadingIcon);
    		if ('withTrailingIcon' in $$new_props) $$invalidate(23, withTrailingIcon = $$new_props.withTrailingIcon);
    		if ('input' in $$new_props) $$invalidate(2, input = $$new_props.input);
    		if ('floatingLabel' in $$new_props) $$invalidate(5, floatingLabel = $$new_props.floatingLabel);
    		if ('lineRipple' in $$new_props) $$invalidate(6, lineRipple = $$new_props.lineRipple);
    		if ('notchedOutline' in $$new_props) $$invalidate(7, notchedOutline = $$new_props.notchedOutline);
    		if ('$$scope' in $$new_props) $$invalidate(90, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTextFieldFoundation,
    		events,
    		onMount,
    		onDestroy,
    		getContext,
    		tick,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		ContextFragment,
    		Ripple,
    		FloatingLabel,
    		LineRipple,
    		NotchedOutline,
    		HelperLine,
    		Prefix,
    		Suffix,
    		Input: Input$1,
    		Textarea,
    		applyPassive,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		style,
    		ripple,
    		disabled,
    		required,
    		textarea,
    		variant,
    		noLabel,
    		label,
    		type,
    		value,
    		files,
    		valued,
    		invalid,
    		updateInvalid,
    		dirty,
    		prefix,
    		suffix,
    		validateOnValueChange,
    		useNativeValidation,
    		withLeadingIcon,
    		withTrailingIcon,
    		input,
    		floatingLabel,
    		lineRipple,
    		notchedOutline,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		helperId,
    		focused,
    		addLayoutListener,
    		removeLayoutListener,
    		initPromiseResolve,
    		initPromise,
    		leadingIcon,
    		trailingIcon,
    		helperText,
    		characterCounter,
    		previousValue,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		focus,
    		blur,
    		layout,
    		getElement,
    		inputElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(8, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(9, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(10, style = $$new_props.style);
    		if ('ripple' in $$props) $$invalidate(11, ripple = $$new_props.ripple);
    		if ('disabled' in $$props) $$invalidate(12, disabled = $$new_props.disabled);
    		if ('required' in $$props) $$invalidate(13, required = $$new_props.required);
    		if ('textarea' in $$props) $$invalidate(14, textarea = $$new_props.textarea);
    		if ('variant' in $$props) $$invalidate(15, variant = $$new_props.variant);
    		if ('noLabel' in $$props) $$invalidate(16, noLabel = $$new_props.noLabel);
    		if ('label' in $$props) $$invalidate(17, label = $$new_props.label);
    		if ('type' in $$props) $$invalidate(18, type = $$new_props.type);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('files' in $$props) $$invalidate(3, files = $$new_props.files);
    		if ('invalid' in $$props) $$invalidate(1, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$props) $$invalidate(19, updateInvalid = $$new_props.updateInvalid);
    		if ('dirty' in $$props) $$invalidate(4, dirty = $$new_props.dirty);
    		if ('prefix' in $$props) $$invalidate(20, prefix = $$new_props.prefix);
    		if ('suffix' in $$props) $$invalidate(21, suffix = $$new_props.suffix);
    		if ('validateOnValueChange' in $$props) $$invalidate(43, validateOnValueChange = $$new_props.validateOnValueChange);
    		if ('useNativeValidation' in $$props) $$invalidate(44, useNativeValidation = $$new_props.useNativeValidation);
    		if ('withLeadingIcon' in $$props) $$invalidate(22, withLeadingIcon = $$new_props.withLeadingIcon);
    		if ('withTrailingIcon' in $$props) $$invalidate(23, withTrailingIcon = $$new_props.withTrailingIcon);
    		if ('input' in $$props) $$invalidate(2, input = $$new_props.input);
    		if ('floatingLabel' in $$props) $$invalidate(5, floatingLabel = $$new_props.floatingLabel);
    		if ('lineRipple' in $$props) $$invalidate(6, lineRipple = $$new_props.lineRipple);
    		if ('notchedOutline' in $$props) $$invalidate(7, notchedOutline = $$new_props.notchedOutline);
    		if ('element' in $$props) $$invalidate(24, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(49, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(25, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(26, internalStyles = $$new_props.internalStyles);
    		if ('helperId' in $$props) $$invalidate(27, helperId = $$new_props.helperId);
    		if ('focused' in $$props) $$invalidate(28, focused = $$new_props.focused);
    		if ('addLayoutListener' in $$props) addLayoutListener = $$new_props.addLayoutListener;
    		if ('removeLayoutListener' in $$props) removeLayoutListener = $$new_props.removeLayoutListener;
    		if ('initPromiseResolve' in $$props) initPromiseResolve = $$new_props.initPromiseResolve;
    		if ('initPromise' in $$props) $$invalidate(37, initPromise = $$new_props.initPromise);
    		if ('leadingIcon' in $$props) $$invalidate(29, leadingIcon = $$new_props.leadingIcon);
    		if ('trailingIcon' in $$props) $$invalidate(30, trailingIcon = $$new_props.trailingIcon);
    		if ('helperText' in $$props) $$invalidate(31, helperText = $$new_props.helperText);
    		if ('characterCounter' in $$props) $$invalidate(32, characterCounter = $$new_props.characterCounter);
    		if ('previousValue' in $$props) $$invalidate(50, previousValue = $$new_props.previousValue);
    		if ('inputElement' in $$props) $$invalidate(33, inputElement = $$new_props.inputElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*input*/ 4) {
    			$$invalidate(33, inputElement = input && input.getElement());
    		}

    		if ($$self.$$.dirty[0] & /*invalid, updateInvalid*/ 524290 | $$self.$$.dirty[1] & /*instance*/ 262144) {
    			if (instance && instance.isValid() !== !invalid) {
    				if (updateInvalid) {
    					$$invalidate(1, invalid = !instance.isValid());
    				} else {
    					instance.setValid(!invalid);
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*instance, validateOnValueChange*/ 266240) {
    			if (instance && instance.getValidateOnValueChange() !== validateOnValueChange) {
    				instance.setValidateOnValueChange(isUninitializedValue(validateOnValueChange)
    				? false
    				: validateOnValueChange);
    			}
    		}

    		if ($$self.$$.dirty[1] & /*instance, useNativeValidation*/ 270336) {
    			if (instance) {
    				instance.setUseNativeValidation(isUninitializedValue(useNativeValidation)
    				? true
    				: useNativeValidation);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*disabled*/ 4096 | $$self.$$.dirty[1] & /*instance*/ 262144) {
    			if (instance) {
    				instance.setDisabled(disabled);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 1 | $$self.$$.dirty[1] & /*instance, previousValue*/ 786432) {
    			if (instance && valued && previousValue !== value) {
    				$$invalidate(50, previousValue = value);

    				// Check the data is flowing down.
    				const stringValue = `${value}`;

    				if (instance.getValue() !== stringValue) {
    					instance.setValue(stringValue);
    				}
    			}
    		}
    	};

    	return [
    		value,
    		invalid,
    		input,
    		files,
    		dirty,
    		floatingLabel,
    		lineRipple,
    		notchedOutline,
    		use,
    		className,
    		style,
    		ripple,
    		disabled,
    		required,
    		textarea,
    		variant,
    		noLabel,
    		label,
    		type,
    		updateInvalid,
    		prefix,
    		suffix,
    		withLeadingIcon,
    		withTrailingIcon,
    		element,
    		internalClasses,
    		internalStyles,
    		helperId,
    		focused,
    		leadingIcon,
    		trailingIcon,
    		helperText,
    		characterCounter,
    		inputElement,
    		forwardEvents,
    		isUninitializedValue,
    		valued,
    		initPromise,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		$$slots,
    		validateOnValueChange,
    		useNativeValidation,
    		focus,
    		blur,
    		layout,
    		getElement,
    		instance,
    		previousValue,
    		slots,
    		floatinglabel_binding,
    		floatinglabel_binding_1,
    		notchedoutline_binding,
    		textarea_1_binding,
    		textarea_1_value_binding,
    		textarea_1_dirty_binding,
    		textarea_1_invalid_binding,
    		blur_handler,
    		focus_handler,
    		blur_handler_1,
    		focus_handler_1,
    		input_1_binding,
    		input_1_value_binding,
    		input_1_files_binding,
    		input_1_dirty_binding,
    		input_1_invalid_binding,
    		blur_handler_2,
    		focus_handler_2,
    		blur_handler_3,
    		focus_handler_3,
    		lineripple_binding,
    		label_1_binding,
    		SMUITextfieldLeadingIcon_mount_handler,
    		SMUITextfieldLeadingIcon_unmount_handler,
    		SMUITextfieldTrailingIcon_mount_handler,
    		SMUITextfieldTrailingIcon_unmount_handler,
    		SMUITextfieldCharacterCounter_mount_handler,
    		SMUITextfieldCharacterCounter_unmount_handler,
    		div_binding,
    		SMUITextfieldLeadingIcon_mount_handler_1,
    		SMUITextfieldLeadingIcon_unmount_handler_1,
    		SMUITextfieldTrailingIcon_mount_handler_1,
    		SMUITextfieldTrailingIcon_unmount_handler_1,
    		SMUITextfieldHelperText_id_handler,
    		SMUITextfieldHelperText_mount_handler,
    		SMUITextfieldHelperText_unmount_handler,
    		SMUITextfieldCharacterCounter_mount_handler_1,
    		SMUITextfieldCharacterCounter_unmount_handler_1,
    		$$scope
    	];
    }

    class Textfield extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				use: 8,
    				class: 9,
    				style: 10,
    				ripple: 11,
    				disabled: 12,
    				required: 13,
    				textarea: 14,
    				variant: 15,
    				noLabel: 16,
    				label: 17,
    				type: 18,
    				value: 0,
    				files: 3,
    				invalid: 1,
    				updateInvalid: 19,
    				dirty: 4,
    				prefix: 20,
    				suffix: 21,
    				validateOnValueChange: 43,
    				useNativeValidation: 44,
    				withLeadingIcon: 22,
    				withTrailingIcon: 23,
    				input: 2,
    				floatingLabel: 5,
    				lineRipple: 6,
    				notchedOutline: 7,
    				focus: 45,
    				blur: 46,
    				layout: 47,
    				getElement: 48
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Textfield",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get use() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textarea() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textarea(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noLabel() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noLabel(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateInvalid() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateInvalid(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dirty() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dirty(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validateOnValueChange() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set validateOnValueChange(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useNativeValidation() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useNativeValidation(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withLeadingIcon() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withLeadingIcon(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withTrailingIcon() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withTrailingIcon(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get floatingLabel() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set floatingLabel(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineRipple() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineRipple(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notchedOutline() {
    		throw new Error_1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notchedOutline(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[45];
    	}

    	set focus(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[46];
    	}

    	set blur(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layout() {
    		return this.$$.ctx[47];
    	}

    	set layout(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[48];
    	}

    	set getElement(value) {
    		throw new Error_1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Input.svelte generated by Svelte v3.49.0 */
    const file$2 = "src\\components\\Input.svelte";

    // (22:8) {:else}
    function create_else_block(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", mdiTrashCan);
    			add_location(path, file$2, 22, 10, 794);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(22:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:8) {#if isDark}
    function create_if_block(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", mdiTrashCanOutline);
    			add_location(path, file$2, 20, 10, 714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(20:8) {#if isDark}",
    		ctx
    	});

    	return block;
    }

    // (19:6) <Icon component={Svg} viewBox="0 0 24 24">
    function create_default_slot_1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*isDark*/ ctx[0]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(19:6) <Icon component={Svg} viewBox=\\\"0 0 24 24\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:4) <IconButton on:click={() => (value = '')} slot="trailingIcon">
    function create_default_slot$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				component: Svg,
    				viewBox: "0 0 24 24",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope, isDark*/ 33) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(18:4) <IconButton on:click={() => (value = '')} slot=\\\"trailingIcon\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:4) 
    function create_trailingIcon_slot(ctx) {
    	let iconbutton;
    	let current;

    	iconbutton = new IconButton({
    			props: {
    				slot: "trailingIcon",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	iconbutton.$on("click", /*click_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(iconbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const iconbutton_changes = {};

    			if (dirty & /*$$scope, isDark*/ 33) {
    				iconbutton_changes.$$scope = { dirty, ctx };
    			}

    			iconbutton.$set(iconbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_trailingIcon_slot.name,
    		type: "slot",
    		source: "(18:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let textfield;
    	let updating_value;
    	let current;

    	function textfield_value_binding(value) {
    		/*textfield_value_binding*/ ctx[3](value);
    	}

    	let textfield_props = {
    		label: "Input String",
    		$$slots: { trailingIcon: [create_trailingIcon_slot] },
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[1] !== void 0) {
    		textfield_props.value = /*value*/ ctx[1];
    	}

    	textfield = new Textfield({ props: textfield_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield, 'value', textfield_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(textfield.$$.fragment);
    			attr_dev(div, "class", "flex align-center ml-10");
    			add_location(div, file$2, 15, 0, 478);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(textfield, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const textfield_changes = {};

    			if (dirty & /*$$scope, value, isDark*/ 35) {
    				textfield_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*value*/ 2) {
    				updating_value = true;
    				textfield_changes.value = /*value*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			textfield.$set(textfield_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(textfield);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	const { getisDark } = getContext(key);
    	let isDark;

    	onMount(() => {
    		$$invalidate(0, isDark = getisDark());
    	});

    	let value = '';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(1, value = '');

    	function textfield_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(1, value);
    	}

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		Textfield,
    		IconButton,
    		Icon,
    		Svg,
    		mdiTrashCanOutline,
    		mdiTrashCan,
    		key,
    		getisDark,
    		isDark,
    		value
    	});

    	$$self.$inject_state = $$props => {
    		if ('isDark' in $$props) $$invalidate(0, isDark = $$props.isDark);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isDark, value, click_handler, textfield_value_binding];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Navbar.svelte generated by Svelte v3.49.0 */
    const file$1 = "src\\components\\Navbar.svelte";

    // (8:2) <H1 class="m-0">
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Automaton Simulator");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(8:2) <H1 class=\\\"m-0\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let nav;
    	let h1;
    	let t0;
    	let radiogroup;
    	let t1;
    	let input;
    	let t2;
    	let togglebutton;
    	let current;

    	h1 = new H1$1({
    			props: {
    				class: "m-0",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	radiogroup = new RadioGroup({ $$inline: true });
    	input = new Input({ $$inline: true });
    	togglebutton = new ToggleButton({ $$inline: true });

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			create_component(h1.$$.fragment);
    			t0 = space();
    			create_component(radiogroup.$$.fragment);
    			t1 = space();
    			create_component(input.$$.fragment);
    			t2 = space();
    			create_component(togglebutton.$$.fragment);
    			attr_dev(nav, "class", "flex h-12 py-3 px-6 align-center justify-center w-screen ");
    			add_location(nav, file$1, 6, 0, 201);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			mount_component(h1, nav, null);
    			append_dev(nav, t0);
    			mount_component(radiogroup, nav, null);
    			append_dev(nav, t1);
    			mount_component(input, nav, null);
    			append_dev(nav, t2);
    			mount_component(togglebutton, nav, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const h1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				h1_changes.$$scope = { dirty, ctx };
    			}

    			h1.$set(h1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(h1.$$.fragment, local);
    			transition_in(radiogroup.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			transition_in(togglebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(h1.$$.fragment, local);
    			transition_out(radiogroup.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			transition_out(togglebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(h1);
    			destroy_component(radiogroup);
    			destroy_component(input);
    			destroy_component(togglebutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ H1: H1$1, RadioGroup, ToggleButton, Input });
    	return [];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let navbar;
    	let t;
    	let editor;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	editor = new Editor({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t = space();
    			create_component(editor.$$.fragment);
    			attr_dev(main, "class", "w-screen h-screen fixed dark");
    			add_location(main, file, 26, 0, 772);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t);
    			mount_component(editor, main, null);
    			/*main_binding*/ ctx[1](main);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(editor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(editor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(editor);
    			/*main_binding*/ ctx[1](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let isDark = true;
    	let mainRef;

    	setContext(key, {
    		getisDark: () => isDark,
    		getmainRef: () => mainRef
    	});

    	onMount(() => {
    		if (localStorage.theme === 'dark' || !('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    			mainRef.classList.add('dark');
    			isDark = true;
    		} else {
    			mainRef.classList.remove('dark');
    			isDark = false;
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function main_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			mainRef = $$value;
    			$$invalidate(0, mainRef);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		setContext,
    		key,
    		Editor,
    		Navbar,
    		isDark,
    		mainRef
    	});

    	$$self.$inject_state = $$props => {
    		if ('isDark' in $$props) isDark = $$props.isDark;
    		if ('mainRef' in $$props) $$invalidate(0, mainRef = $$props.mainRef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mainRef, main_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world',
        },
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map