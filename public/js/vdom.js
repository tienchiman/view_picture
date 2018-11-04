(({Util: {isOject,dom}}) => {
    const parsePageElement = (root) => {
        const lists = {
            event: [],//绑定事件的元素
            model: [],//数据绑定的
            attrs: []//属性的,
        };
        const total = {all: 0, element: 0, text: 0, comment: 0};// 统计节点个数
        const nodeNames = {'1': 'element', '3': 'text', '8': 'comment'};


        /**
         * @param { Object } node 此元素
         * @param { Object } parent 此元素父节点
         * @param { Object } atParentsIndex 此元素在父节点中的位置
         *
         * */
        const eachChilds = (node, parent, atParentsIndex) => {
            const type = node.nodeType;
            // 统计个数
            total.all += 1;
            if (!(/^[138]$/.test(type))) {// 只需要便利元素节点, 而且, 只需要1 3 8
                return;
            }
            total[nodeNames[`${type}`]] += 1;


            if (!(/^[1]$/.test(type))) {// 不是元素的 不用遍历了
                return;
            }
            const attrs = node.attributes;
            if (attrs) {
                const length = attrs.length;
                for (let i = 0; i < length; i++) {
                    const {name, value} = attrs[`${i}`];

                    if (/^\$/.test(name)) {//绑定属性
                        lists.attrs.push({node, name: value, attr: name.replace('$','')});
                    }
                    if (/^@/.test(name)) {//注册事件
                        lists.event.push({node, name: value, type: name.replace('@','')})
                    }
                    if (/^:/.test(name)) {
                        lists.model.push({node, name: value})
                    }
                    // node.removeAttribute(name)
                }
            }
            const children = node.childNodes;
            if (children && children.length > 0) {
                children.forEach((item, index) => {
                    eachChilds(item, node, index)
                })
            } else {
                return;
            }
        }
        eachChilds(root);

        return {
            total,
            lists,
        }
    }
    const setOver = (data, key, callback) => {
        if (!data[key]) {
            console.error(`${key} is not found at data`)
            return;
        }

    }

    class App {
        /**
         *  @param { String } appId 此app 的id
         *
         * */
        constructor({appId, data, mounted, methods}) {
            const app = document.getElementById('app');
            if (app) {
                const {total, lists: {event, model, attrs}} = parsePageElement(app);
                /**
                 * data
                 *
                 * */

                const setModel = (maps, value) => {
                    return maps.map(({node}) => {
                        const tagName = node.tagName.toLowerCase();
                        tagName === 'input' ? node.value = value : node.innerText = value;
                        return tagName;
                    })
                }
                const handleAttrs = (maps, value) => {
                    maps.forEach(({node}) => {
                        dom(node).attr(value);
                    })
                }
                let modelMaps = {}, attrsMaps = {};
                Object.keys(data).forEach(key => {
                    this[key] = data[key];
                    modelMaps[key] = model.filter(({name}) => name === key);//关系隐射
                    attrsMaps[key] = attrs.filter(({name}) => name === key);//关系隐射
                    // 初始化设置
                    setModel(modelMaps[key], data[key]);
                    handleAttrs(attrsMaps[key], data[key]);
                });
                const commit = (name, value) => {
                    // console.log(name, value, this[name])
                    if (!name || !this[name]) {
                        console.error('not found',this[name])
                    } else {
                        this[name] = value;
                        setModel(modelMaps[name], value);
                        handleAttrs(attrsMaps[name], value);
                    }
                }


                // methods
                Object.keys(methods).forEach(methodname => {
                    if (!this[methodname]) {
                        this[methodname] = methods[methodname];
                        const eventMaps = event.filter(({name}) => methodname === name);
                        eventMaps.forEach(({node, type}) => {
                            node[`on${type}`] = (e) => {
                                this[methodname](e);//让调用方法的是这个this
                            }
                        })
                    }else{
                        console.error('name is defined in data!')
                    }
                })
                this.$commit = commit;
                mounted(this);

            } else {
                console.log('init error')
            }

        }

        static create(inits) {
            return new App(inits);
        }
    }

    window.App = App;

})(window)