// 全局配置
(() => {
    const  isPC = () =>{ //是否为PC端
        const userAgentInfo = navigator.userAgent;
        const Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        let flag = true, type = 'pc';
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                type = Agents[v];
                break;
            }
        }
        return {flag, type};
    }

    const {flag, type} = isPC()

    const {width, height}  = window.screen;
    console.log(width, height, innerWidth, innerHeight)
    const {protocol, hostname, port} = location;
    window.Config = {
        baseURL: 'http://192.168.1.100:3003',
        // baseURL: `${protocol}://${hostname}:${port}`,
        location: { protocol, hostname},
        isPc: flag,
        type,
        screen: {
            width,
            height,
        },
    }
})()