function broadcast(componentName, eventName, params,deep=true) {
    this.$children.forEach(child => {
        const name = child.$options.name;

        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else if(deep){
            // todo 如果 params 是空数组，接收到的会是 undefined
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}
export default {
    methods: {
        //父级通信
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.name;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        //同级通信
        sibling(componentName, eventName, params){
          let parent = this.$parent || this.$root;
          broadcast.call(parent, componentName, eventName, params,false);
        },
        //子集通信
        broadcast(componentName, eventName, params,deep) {
            broadcast.call(this, componentName, eventName, params,deep);
        }
    }
};
