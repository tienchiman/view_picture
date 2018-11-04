(({Config: {baseURL,}}) => {
    const parseType = o => Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    const isArray = (o) => parseType(o) === 'array';
    const isObject = (o) => parseType(o) === 'object';
    const isString = (o) => parseType(o) === 'string';

    const elementExp = /^html(.*)element$/;
    const isElement = (o) => elementExp.test(parseType(o));
    const parseElement  = (node) => elementExp.exec(parseType(node))[1];//得到元素类型
    /**
     * request 请求
     * !!! 如果method 为form, 那么必须有个file字段
     * */
    const request = (() => {
        // 将数据抱装为form
        const stringifyForm = (data) => {
            const form = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'file') {
                    const file = data[key];
                    form.append('file', file, file.name)
                } else {
                    form.append(key, data[key]);
                }
            })
            return form;
        }
        const request = axios.create({
            baseURL: baseURL,
            timeout: 1000,
            // headers: {'Content-Type': 'multipart/form-data'}
        });
        // 添加请求拦截器
        request.interceptors.request.use(config => {
            const {method, data} = config;

            if (method === 'form') {
                config.headers['Content-Type'] = 'multipart/form-data';
                config.method = 'post';
                config.url = '/upload'
                config.data = stringifyForm(data)
            }

            return config;
        }, error => Promise.reject(error));

        // 添加响应拦截器
        request.interceptors.response.use(({data}) => {
            // 对响应数据做点什么
            return data;
        }, error => Promise.reject(error));


        return request;
    })()
    // 解析网络图片的尺寸
    const parseImgSize = (src, containerWidth) => {
        return new Promise((resolve) => {
            let img = new Image();
            img.src = src;
            img.onload = () => {
                const width = img.width;
                height = img.height;
                const vHeight = containerWidth / width * height;
                resolve({src, vHeight, vWidth: containerWidth, height, width});
                img = null;
            }
        })
    }
    const addClass = (node, params) => {
        if(node){
            if(params){
                const oldClass = container.getAttribute('class');
                if(isArray(params)){
                    node.setAttribute('class', `${oldClass} ${params.join(' ')}`)
                }
                if(isString(params)){
                    node.setAttribute('class', `${oldClass} ${params}`)
                }
            }
        }
        return node;
    }
    const dom = (param) => {

        if (!param) {
            console.error('plase input params');
            return false;
        }
        let container ;
        if(isString(param)){
            container = document.getElementById(param)
        }
        if(isElement(param)){
            container = param;
        }
        container.tag = parseElement(container);
        if(!container){
            return false;
        }
        const css = (...params) => {
            const [nameo, valueo] = params;
            if (nameo) {
                if (isString(nameo)) {
                    if (valueo && isString(valueo)) {
                        container.style[nameo] = valueo;
                        return container;
                    } else {
                        return container.style[nameo];
                    }
                } else if (isObject(nameo)) {
                    Object.keys(nameo).forEach(name => {
                        container.style[name] = nameo[name];
                    })
                    return container;
                }
            }
        }
        container.offset = () => ({width: container.offsetWidth, height: container.offsetHeight})
        container.css = css;
        const attr = (...params) => {
            const [name, value] = params;
            if(name){
                if(isString(name)){
                    value && isString(value) ? container.setAttribute(name, value) : container.getAttribute(name);
                }
                if(isObject(name)){
                    Object.keys(name).forEach(key => {
                        container.setAttribute(key, name[key]);
                    })
                }
            }
            return container;
        };
        container.addClass = (params) => {
            if(params){
                const oldClass = container.getAttribute('class');
                if(isArray(params)){
                    container.setAttribute('class', `${oldClass} ${params.join(' ')}`)
                }
                if(isString(params)){
                    container.setAttribute('class', `${oldClass} ${params}`)
                }
            }
            return container;
        };
        container.removeClass = (params) => {
            if(params){
                const oldClass = container.getAttribute('class');
                const getnewclass = (classname) => oldClass.replace(classname.trim(), '').trim();
                if(isArray(params)){
                    let nClass = oldClass;
                    params.forEach(iclass => {
                        nClass = getnewclass(iclass)
                    })
                    container.setAttribute('class',nClass)
                }

                if(isString(params)){
                    container.setAttribute('class', `${getnewclass(params)}`)
                }
            }
            return container;
        }
        container.attr = attr;
        container.hide = () => {
            const {display} = container.style;
            container.setAttribute('display', display)
            container.style.display = 'none';
        }
        container.show = () => {
            const display = container.getAttribute('display');
            if(display && /^(inline-block|block|flex)$/.test(display)){
                container.style.display = display;
                // container.removeAttribute('display')
            }else{
                container.style.display = 'block';
            }
        }
        container.html = (string) => {
            container.innerHTML = string;
            return container;
        }
        container.click = (cb) => {
            container.onclick = (e) => {
                const {target} = e;
                if(target){
                    target.attr = attr;
                }
                cb && cb({target, ...e});
            }
        }
        return container
    }
    const random =  (max, min) => Math.floor(min + Math.random() * ((max + 1) - min));
    const isUrl = (url) => /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(url);
    window.Util = {
        request,
        parseImgSize,
        dom,
        random,
        isArray,
        isObject,
        isString,
        parseType,
        isUrl
    }
})(window)